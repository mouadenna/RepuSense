import os
import sys
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import subprocess
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

# Import the NLP pipeline
from nlp_pipeline.main import NLPPipeline

# Load configuration from config.json
def load_config():
    config_path = Path(__file__).parent.parent.parent / "config.json"
    
    if config_path.exists():
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            logger.info(f"Loaded configuration from {config_path}")
            return config
        except Exception as e:
            logger.error(f"Error loading configuration: {str(e)}")
    
    logger.warning("No configuration file found, using defaults")
    return {}

config = load_config()

class AnalysisRequestProcessor:
    """
    Class to process requests for company analysis.
    This is used by the API to trigger analysis on demand.
    """
    
    def __init__(self, s3_bucket=None):
        """
        Initialize the request processor.
        
        Args:
            s3_bucket: S3 bucket name for results storage
        """
        self.base_dir = Path(__file__).parent.parent.parent
        self.s3_bucket = s3_bucket or config.get('s3', {}).get('bucket', "repusense-results")
        
        # Create data directory structure
        self.data_dir = self.base_dir / "data"
        self.requests_dir = self.data_dir / "api_requests"
        
        # Create directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.requests_dir, exist_ok=True)
        
        logger.info(f"Analysis request processor initialized. Requests dir: {self.requests_dir}, S3 bucket: {self.s3_bucket}")
    
    def _save_request(self, request_data: Dict[str, Any]) -> str:
        """
        Save a request to a file.
        
        Args:
            request_data: Request data
            
        Returns:
            Path to the request file
        """
        # Generate a unique ID for the request
        request_id = f"{request_data['company']}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        request_data['request_id'] = request_id
        
        # Save the request
        request_path = self.requests_dir / f"{request_id}.json"
        with open(request_path, 'w', encoding='utf-8') as f:
            json.dump(request_data, f, indent=2)
        
        logger.info(f"Saved request to {request_path}")
        return request_id
    
    def process_request_sync(self, company: str, start_date: Optional[str] = None, 
                            end_date: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a request synchronously.
        
        Args:
            company: Company name
            start_date: Start date (optional, defaults to 30 days ago)
            end_date: End date (optional, defaults to today)
            
        Returns:
            Processing result
        """
        logger.info(f"Processing request for company: {company}")
        
        # Set default dates if not provided
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        if not start_date:
            # Default to 30 days before end date
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
            start_dt = end_dt.replace(day=1)  # First day of the month
            start_date = start_dt.strftime('%Y-%m-%d')
        
        # Save the request
        request_data = {
            'company': company,
            'start_date': start_date,
            'end_date': end_date,
            'timestamp': datetime.now().isoformat()
        }
        request_id = self._save_request(request_data)
        
        try:
            # Initialize the pipeline
            pipeline = NLPPipeline(
                company_name=company,
                use_s3=bool(self.s3_bucket),
                s3_bucket=self.s3_bucket
            )
            
            # Run the pipeline
            results = pipeline.run_pipeline(
                start_date=start_date,
                end_date=end_date
            )
            
            # Record the status
            status = {
                'request_id': request_id,
                'status': 'completed',
                'company': company,
                'timestamp': datetime.now().isoformat(),
                's3_urls': results.get('s3_urls', {}),
                'api_data': {
                    k: str(v) for k, v in results.get('api_data', {}).items()
                }
            }
            
            # Save the status
            status_path = self.requests_dir / f"{request_id}_status.json"
            with open(status_path, 'w', encoding='utf-8') as f:
                json.dump(status, f, indent=2)
            
            logger.info(f"Request {request_id} completed successfully")
            return status
            
        except Exception as e:
            logger.error(f"Error processing request {request_id}: {str(e)}")
            
            # Record the error
            status = {
                'request_id': request_id,
                'status': 'error',
                'company': company,
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }
            
            # Save the status
            status_path = self.requests_dir / f"{request_id}_status.json"
            with open(status_path, 'w', encoding='utf-8') as f:
                json.dump(status, f, indent=2)
            
            return status
    
    def process_request_async(self, company: str, start_date: Optional[str] = None, 
                             end_date: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a request asynchronously by scheduling it with Airflow.
        
        Args:
            company: Company name
            start_date: Start date (optional)
            end_date: End date (optional)
            
        Returns:
            Request ID and status
        """
        logger.info(f"Scheduling request for company: {company}")
        
        # Set default dates if not provided
        if not end_date:
            end_date = datetime.now().strftime('%Y-%m-%d')
        
        if not start_date:
            # Default to 30 days before end date
            end_dt = datetime.strptime(end_date, '%Y-%m-%d')
            start_dt = end_dt.replace(day=1)  # First day of the month
            start_date = start_dt.strftime('%Y-%m-%d')
        
        # Save the request
        request_data = {
            'company': company,
            'start_date': start_date,
            'end_date': end_date,
            'timestamp': datetime.now().isoformat(),
            'scheduled': True
        }
        request_id = self._save_request(request_data)
        
        # Create a status record for the scheduled request
        status = {
            'request_id': request_id,
            'status': 'scheduled',
            'company': company,
            'timestamp': datetime.now().isoformat()
        }
        
        # Save the status
        status_path = self.requests_dir / f"{request_id}_status.json"
        with open(status_path, 'w', encoding='utf-8') as f:
            json.dump(status, f, indent=2)
        
        logger.info(f"Request {request_id} scheduled successfully")
        return status
    
    def get_request_status(self, request_id: str) -> Dict[str, Any]:
        """
        Get the status of a request.
        
        Args:
            request_id: Request ID
            
        Returns:
            Request status
        """
        status_path = self.requests_dir / f"{request_id}_status.json"
        
        if not status_path.exists():
            return {
                'request_id': request_id,
                'status': 'unknown'
            }
        
        try:
            with open(status_path, 'r', encoding='utf-8') as f:
                status = json.load(f)
            
            return status
        
        except Exception as e:
            logger.error(f"Error reading status for request {request_id}: {str(e)}")
            return {
                'request_id': request_id,
                'status': 'error',
                'error': str(e)
            }
    
    def list_requests(self, company: Optional[str] = None, limit: int = 10) -> Dict[str, Any]:
        """
        List recent requests.
        
        Args:
            company: Filter by company (optional)
            limit: Maximum number of requests to return
            
        Returns:
            List of requests
        """
        requests = []
        
        try:
            # Get all status files
            status_files = list(self.requests_dir.glob("*_status.json"))
            
            # Sort by modification time (newest first)
            status_files.sort(key=lambda x: os.path.getmtime(x), reverse=True)
            
            # Process files
            for status_file in status_files[:limit]:
                with open(status_file, 'r', encoding='utf-8') as f:
                    status = json.load(f)
                
                # Filter by company if specified
                if company and status.get('company') != company:
                    continue
                
                requests.append(status)
        
        except Exception as e:
            logger.error(f"Error listing requests: {str(e)}")
        
        return {
            'requests': requests,
            'count': len(requests)
        }

# Singleton instance for use in FastAPI
request_processor = AnalysisRequestProcessor(
    s3_bucket=os.environ.get('REPUSENSE_S3_BUCKET')
)

if __name__ == "__main__":
    # Example usage
    processor = AnalysisRequestProcessor()
    
    # Process a request synchronously
    result = processor.process_request_sync(
        company="inwi",
        start_date="2024-01-01",
        end_date="2024-12-31"
    )
    
    print(f"Processing result: {result}") 