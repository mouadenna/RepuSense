import os
import json
import logging
from pathlib import Path
from datetime import datetime
import argparse
import sys

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NLPPipeline:
    def __init__(self, base_dir=None, company_name=None):
        """
        Initialize the NLP pipeline.
        
        Args:
            base_dir: Base directory for data
            company_name: Name of the company to analyze
        """
        # Set up directories
        self.base_dir = Path(base_dir) if base_dir else Path(__file__).parent.parent
        self.data_dir = self.base_dir / "data"
        self.nlp_results_dir = self.data_dir / "nlp_results"
        self.company_name = company_name
        
        # Create necessary directories
        self.nlp_results_dir.mkdir(parents=True, exist_ok=True)
        if self.company_name:
            (self.nlp_results_dir / self.company_name).mkdir(parents=True, exist_ok=True)
        
        # Load configuration
        self.config = self._load_config()
        
        # Initialize results dictionary
        self.results = {
            'company': self.company_name,
            'timestamp': datetime.now().isoformat(),
            'data_sources': ['Reddit']
        }
    
    def _load_config(self):
        """Load configuration from config.json."""
        config_path = self.base_dir / "config.json"
        
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
    
    def process_data(self, start_date=None, end_date=None, keyword=None):
        """Process the data and generate NLP results."""
        try:
            # Your existing processing code here
            # ...
            
            # Save results locally
            self._save_results()
            
            return self.results
            
        except Exception as e:
            logger.error(f"Error processing data: {str(e)}")
            raise
    
    def _save_results(self):
        """Save NLP results to local storage."""
        if not self.company_name:
            logger.error("No company name provided")
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        company_dir = self.nlp_results_dir / self.company_name
        
        # Create timestamp directory
        timestamp_dir = company_dir / timestamp
        timestamp_dir.mkdir(parents=True, exist_ok=True)
        
        # Save individual result files
        for file_type, data in self.results.items():
            if file_type not in ['company', 'timestamp', 'data_sources']:
                file_path = timestamp_dir / f"{file_type}.json"
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2)
        
        # Save combined results
        combined_path = timestamp_dir / "combined_results.json"
        with open(combined_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2)
        
        logger.info(f"Results saved to {timestamp_dir}")

def main():
    parser = argparse.ArgumentParser(description='Run NLP pipeline')
    
    # Required arguments
    parser.add_argument('--company', type=str, required=True, help='Company name to analyze')
    
    # Optional arguments
    parser.add_argument('--start-date', type=str, help='Start date for analysis (YYYY-MM-DD)')
    parser.add_argument('--end-date', type=str, help='End date for analysis (YYYY-MM-DD)')
    parser.add_argument('--keyword', type=str, help='Keyword to filter data')
    parser.add_argument('--output-dir', type=str, help='Output directory for results')
    
    args = parser.parse_args()
    
    # Initialize pipeline
    pipeline = NLPPipeline(
        base_dir=args.output_dir,
        company_name=args.company
    )
    
    # Process data
    results = pipeline.process_data(
        start_date=args.start_date,
        end_date=args.end_date,
        keyword=args.keyword
    )
    
    logger.info("Pipeline completed successfully")

if __name__ == "__main__":
    main() 