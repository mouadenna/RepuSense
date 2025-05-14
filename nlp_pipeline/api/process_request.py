import os
import sys
import json
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import subprocess
from datetime import datetime
import uuid
import time

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
        self.nlp_results_dir = self.data_dir / "nlp_results"
        
        # Create directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.nlp_results_dir, exist_ok=True)
        
        # In-memory request tracking
        self.requests = {}
        
        logger.info(f"Analysis request processor initialized. S3 bucket: {self.s3_bucket}")
    
    def _generate_request_id(self, company: str) -> str:
        """
        Generate a unique request ID.
        
        Args:
            company: Company name
            
        Returns:
            Request ID
        """
        request_id = f"{company}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{str(uuid.uuid4())[:8]}"
        return request_id
    
    def process_request_sync(self, company: str, start_date: Optional[str] = None, 
                            end_date: Optional[str] = None, keyword: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a request synchronously.
        
        Args:
            company: Company name
            start_date: Start date (optional, defaults to 30 days ago)
            end_date: End date (optional, defaults to today)
            keyword: Optional keyword to filter by
            
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
        
        # Create request data and ID
        request_id = self._generate_request_id(company)
        request_data = {
            'request_id': request_id,
            'company': company,
            'start_date': start_date,
            'end_date': end_date,
            'keyword': keyword,
            'timestamp': datetime.now().isoformat()
        }
        
        # Store initial status in memory
        self.requests[request_id] = {
            'request_id': request_id,
            'status': 'processing',
            'company': company,
            'timestamp': datetime.now().isoformat(),
            'request_data': request_data
        }
        
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
            
            # Build paths to the NLP results
            nlp_result_paths = {
                'topics': str(self.nlp_results_dir / company / "topics" / "topic_distribution.json"),
                'sentiment': str(self.nlp_results_dir / company / "sentiment" / "sentiment_results.json"),
                'keywords': str(self.nlp_results_dir / company / "keywords" / "keyword_results.json"),
                'engagement': str(self.nlp_results_dir / company / "engagement" / "engagement_results.json"),
                'wordcloud': str(self.nlp_results_dir / company / "keywords" / "word_cloud_data.json"),
                'wordcloud_image': str(self.nlp_results_dir / company / "keywords" / "wordcloud.png"),
                'topic_visualization': str(self.nlp_results_dir / company / "topics" / "topic_visualization.html")
            }
            
            # Create status
            status = {
                'request_id': request_id,
                'status': 'completed',
                'company': company,
                'timestamp': datetime.now().isoformat(),
                's3_urls': results.get('s3_urls', {}),
                'nlp_data': nlp_result_paths
            }
            
            # Store the status in memory
            self.requests[request_id] = status
            
            logger.info(f"Request {request_id} completed successfully")
            return status
            
        except Exception as e:
            logger.error(f"Error processing request {request_id}: {str(e)}")
            
            # Record the error in memory
            status = {
                'request_id': request_id,
                'status': 'error',
                'company': company,
                'timestamp': datetime.now().isoformat(),
                'error': str(e)
            }
            
            # Store the status in memory
            self.requests[request_id] = status
            
            return status
    
    def process_request_async(self, company: str, start_date: Optional[str] = None, 
                             end_date: Optional[str] = None, keyword: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a request asynchronously.
        
        Args:
            company: Company name
            start_date: Start date (optional)
            end_date: End date (optional)
            keyword: Optional keyword to filter by
            
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
        
        # Create request data and ID
        request_id = self._generate_request_id(company)
        request_data = {
            'request_id': request_id,
            'company': company,
            'start_date': start_date,
            'end_date': end_date,
            'keyword': keyword,
            'timestamp': datetime.now().isoformat(),
            'scheduled': True
        }
        
        # Create a status record for the scheduled request
        status = {
            'request_id': request_id,
            'status': 'scheduled',
            'company': company,
            'timestamp': datetime.now().isoformat(),
            'request_data': request_data
        }
        
        # Store in memory
        self.requests[request_id] = status
        
        # Start async processing in a separate thread or process
        # This would normally be handled by a task queue like Celery
        # For simplicity, we're just logging it
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
        # Check if request exists in memory
        if request_id in self.requests:
            return self.requests[request_id]
        
        return {
            'request_id': request_id,
            'status': 'unknown'
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
        # Filter requests by company if specified
        if company:
            filtered_requests = [r for r in self.requests.values() if r.get('company') == company]
        else:
            filtered_requests = list(self.requests.values())
        
        # Sort by timestamp (newest first)
        sorted_requests = sorted(
            filtered_requests,
            key=lambda x: x.get('timestamp', ''),
            reverse=True
        )
        
        # Limit the number of results
        limited_requests = sorted_requests[:limit]
        
        return {
            'requests': limited_requests,
            'count': len(limited_requests)
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