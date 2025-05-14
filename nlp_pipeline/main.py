import os
import sys
import json
import logging
import argparse
import boto3
from pathlib import Path
from datetime import datetime
import shutil

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

# Import the pipeline modules
from nlp_pipeline.data_processing.data_fetcher import RedditDataFetcher
from nlp_pipeline.data_processing.data_preprocessor import RedditDataPreprocessor
from nlp_pipeline.spark_nlp.topic_modeling import TopicModeler
from nlp_pipeline.spark_nlp.sentiment_analysis import SentimentAnalyzer
from nlp_pipeline.spark_nlp.keyword_extraction import KeywordExtractor
from nlp_pipeline.spark_nlp.engagement_analysis import EngagementAnalyzer

class NLPPipeline:
    """
    Main class to orchestrate the NLP pipeline.
    """
    
    def __init__(self, base_dir=None, company_name=None, use_s3=None, s3_bucket=None):
        """
        Initialize the NLP pipeline.
        
        Args:
            base_dir: Base directory for the project
            company_name: Name of the company being analyzed (required)
            use_s3: Whether to store results in S3
            s3_bucket: S3 bucket name
        """
        if base_dir is None:
            self.base_dir = Path(__file__).parent.parent
        else:
            self.base_dir = Path(base_dir)
        
        # Load config if it exists
        self.config = self._load_config()
        
        # Validate company name
        if not company_name:
            raise ValueError("Company name is required.")
        
        # Store company name
        self.company_name = company_name
        logger.info(f"Initializing NLP pipeline for company: {self.company_name}")
        
        # S3 configuration
        self.use_s3 = use_s3 if use_s3 is not None else self.config.get('s3', {}).get('enabled', True)
        self.s3_bucket = s3_bucket or self.config.get('s3', {}).get('bucket', "repusense-results")
        self.s3_region = self.config.get('s3', {}).get('region', "us-east-1")
        self.s3_client = None
        
        if self.use_s3 and self.s3_bucket:
            try:
                self.s3_client = boto3.client('s3', region_name=self.s3_region)
                logger.info(f"S3 client initialized for bucket: {self.s3_bucket}")
            except Exception as e:
                logger.error(f"Error initializing S3 client: {str(e)}")
                self.use_s3 = False
        
        # Create directory structure
        self.data_dir = self.base_dir / "data"
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Directory names
        self.data_storage_dir_name = "data_storage"
        self.processed_data_dir_name = "processed_data"
        self.nlp_results_dir_name = "nlp_results"
        
        # Company-specific directories
        self.data_storage_dir = self.data_dir / self.data_storage_dir_name / self.company_name
        self.processed_data_dir = self.data_dir / self.processed_data_dir_name / self.company_name
        self.nlp_results_company_dir = self.data_dir / self.nlp_results_dir_name / self.company_name
        
        # Create directories
        os.makedirs(self.data_storage_dir, exist_ok=True)
        os.makedirs(self.processed_data_dir, exist_ok=True)
        os.makedirs(self.nlp_results_company_dir, exist_ok=True)
        
        # Create analysis subdirectories
        analysis_types = ["topics", "sentiment", "keywords", "engagement"]
        self.analysis_dirs = {}
        for analysis_type in analysis_types:
            dir_path = self.nlp_results_company_dir / analysis_type
            self.analysis_dirs[analysis_type] = dir_path
            os.makedirs(dir_path, exist_ok=True)
        
        # Initialize pipeline components
        self.data_fetcher = RedditDataFetcher(
            storage_dir=self.data_storage_dir,
            company_name=self.company_name 
        )
        
        self.data_preprocessor = RedditDataPreprocessor(
            processed_dir=self.processed_data_dir,
            company_name=self.company_name
        )
        
        self.topic_modeler = TopicModeler(
            output_dir=str(self.analysis_dirs["topics"]),
            company_name=None
        )
        
        self.sentiment_analyzer = SentimentAnalyzer(
            output_dir=str(self.analysis_dirs["sentiment"]),
            company_name=None
        )
        
        self.keyword_extractor = KeywordExtractor(
            output_dir=str(self.analysis_dirs["keywords"]),
            company_name=None
        )
        
        self.engagement_analyzer = EngagementAnalyzer(
            output_dir=str(self.analysis_dirs["engagement"]),
            company_name=None
        )
        
        # Store results
        self.results = {}
    
    def _load_config(self):
        """Load configuration from config.json if it exists."""
        config_path = Path(__file__).parent.parent / "config.json"
        
        if config_path.exists():
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                return config
            except Exception as e:
                logger.error(f"Error loading configuration: {str(e)}")
        
        return {}
    
    def fetch_data(self, start_date=None, end_date=None, limit=None, use_existing=False, existing_file=None):
        """Fetch Reddit data."""
        logger.info("Step 1: Fetching data")
        
        if use_existing and existing_file:
            logger.info(f"Using existing data file: {existing_file}")
            data_path = self.data_fetcher.copy_existing_data(existing_file)
        else:
            logger.info(f"Fetching new data for company: {self.company_name}")
            data_path = self.data_fetcher.fetch_and_store_data(
                company_name=self.company_name,
                start_date=start_date,
                end_date=end_date,
                limit=limit
            )
        
        self.results['data_path'] = data_path
        return data_path
    
    def preprocess_data(self, data_path):
        """Preprocess the data."""
        logger.info("Step 2: Preprocessing data")
        
        nlp_df, nlp_data_path = self.data_preprocessor.process_data(data_path)
        
        processed_posts_path = self.processed_data_dir / "processed_posts.json"
        
        self.results['processed_posts_path'] = processed_posts_path
        self.results['nlp_data_path'] = nlp_data_path
        
        return nlp_df, nlp_data_path
    
    def run_topic_modeling(self, data_path):
        """Run topic modeling."""
        logger.info("Step 3: Running topic modeling")
        
        topic_results = self.topic_modeler.run_topic_modeling(data_path)
        self.results['topic_modeling'] = topic_results
        
        return topic_results
    
    def run_sentiment_analysis(self, data_path):
        """Run sentiment analysis."""
        logger.info("Step 4: Running sentiment analysis")
        
        sentiment_results = self.sentiment_analyzer.run_sentiment_analysis(data_path)
        self.results['sentiment_analysis'] = sentiment_results
        
        return sentiment_results
    
    def run_keyword_extraction(self, data_path):
        """Run keyword extraction."""
        logger.info("Step 5: Running keyword extraction")
        
        keyword_results = self.keyword_extractor.run_keyword_extraction(data_path)
        self.results['keyword_extraction'] = keyword_results
        
        return keyword_results
    
    def run_engagement_analysis(self, data_path):
        """Run engagement analysis."""
        logger.info("Step 6: Running engagement analysis")
        
        engagement_results = self.engagement_analyzer.run_engagement_analysis(data_path)
        self.results['engagement_analysis'] = engagement_results
        
        return engagement_results
    
    def upload_results_to_s3(self):
        """Upload NLP results to S3."""
        if not self.s3_client or not self.s3_bucket:
            return None
        
        s3_urls = {}
        timestamp = datetime.now().strftime("%Y%m%d")
        
        try:
            # Define files to upload
            files_to_upload = [
                ('topics', self.analysis_dirs["topics"] / "topic_distribution.json"),
                ('sentiment', self.analysis_dirs["sentiment"] / "sentiment_results.json"),
                ('keywords', self.analysis_dirs["keywords"] / "keyword_results.json"),
                ('engagement', self.analysis_dirs["engagement"] / "engagement_results.json"),
                ('wordcloud', self.analysis_dirs["keywords"] / "word_cloud_data.json")
            ]
            
            # Upload each file
            all_results = {}
            for file_type, file_path in files_to_upload:
                if file_path.exists():
                    with open(file_path, 'r', encoding='utf-8') as f:
                        all_results[file_type] = json.load(f)
                        
                    s3_key = f"data/nlp_results/{self.company_name}/{timestamp}/{file_type}.json"
                    self.s3_client.upload_file(
                        Filename=str(file_path),
                        Bucket=self.s3_bucket,
                        Key=s3_key
                    )
                    s3_urls[file_type] = f"s3://{self.s3_bucket}/{s3_key}"
            
            # Save combined results to file
            combined_results_path = self.processed_data_dir / "combined_results.json"
            with open(combined_results_path, 'w', encoding='utf-8') as f:
                json.dump(all_results, f, indent=2)
            
            # Upload combined results
            combined_s3_key = f"data/nlp_results/{self.company_name}/{timestamp}/combined_results.json"
            self.s3_client.upload_file(
                Filename=str(combined_results_path),
                Bucket=self.s3_bucket,
                Key=combined_s3_key
            )
            
            s3_urls['combined_results'] = f"s3://{self.s3_bucket}/{combined_s3_key}"
            self.results['s3_urls'] = s3_urls
            
            return s3_urls
            
        except Exception as e:
            logger.error(f"Error uploading to S3: {str(e)}")
            return None
    
    def run_pipeline(self, start_date=None, end_date=None, limit=None, 
                    use_existing=False, existing_file=None, skip_steps=None):
        """Run the complete NLP pipeline."""
        if skip_steps is None:
            skip_steps = []
            
        # Add metadata to results
        self.results['timestamp'] = datetime.now().isoformat()
        self.results['company_name'] = self.company_name
        
        # Step 1: Fetch data
        if 'fetch' not in skip_steps:
            data_path = self.fetch_data(
                start_date=start_date,
                end_date=end_date,
                limit=limit,
                use_existing=use_existing,
                existing_file=existing_file
            )
        else:
            data_path = existing_file
            self.results['data_path'] = Path(existing_file)
        
        # Step 2: Preprocess data
        if 'preprocess' not in skip_steps:
            _, nlp_data_path = self.preprocess_data(data_path)
        else:
            nlp_data_path = self.processed_data_dir / "nlp_ready_data.json"
            self.results['processed_posts_path'] = self.processed_data_dir / "processed_posts.json"
            self.results['nlp_data_path'] = nlp_data_path
        
        # Step 3: Run topic modeling
        if 'topic' not in skip_steps:
            self.run_topic_modeling(nlp_data_path)
        
        # Step 4: Run sentiment analysis
        if 'sentiment' not in skip_steps:
            self.run_sentiment_analysis(nlp_data_path)
        
        # Step 5: Run keyword extraction
        if 'keyword' not in skip_steps:
            self.run_keyword_extraction(nlp_data_path)
        
        # Step 6: Run engagement analysis
        if 'engagement' not in skip_steps:
            processed_posts_path = self.results['processed_posts_path']
            if processed_posts_path.exists():
                self.run_engagement_analysis(processed_posts_path)
            else:
                logger.error("Skipping engagement analysis due to missing processed_posts.json file")
                self.results['engagement_analysis'] = {"error": "Processed posts file not found"}
        
        # Upload to S3 if enabled
        if self.use_s3 and self.s3_client:
            self.upload_results_to_s3()
        
        logger.info("Pipeline execution complete")
        return self.results

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Run the NLP pipeline for Reddit data')
    
    # Required arguments
    parser.add_argument('--company', type=str, required=True, 
                       help='Company name to analyze')
    
    # Data fetching options
    parser.add_argument('--start-date', type=str, help='Start date (YYYY-MM-DD)')
    parser.add_argument('--end-date', type=str, help='End date (YYYY-MM-DD)')
    parser.add_argument('--limit', type=int, help='Maximum posts to fetch')
    
    # Use existing data
    parser.add_argument('--use-existing', action='store_true', help='Use existing data')
    parser.add_argument('--existing-file', type=str, help='Path to existing data file')
    
    # Skip steps
    parser.add_argument('--skip-fetch', action='store_true', help='Skip data fetching')
    parser.add_argument('--skip-preprocess', action='store_true', help='Skip preprocessing')
    parser.add_argument('--skip-topic', action='store_true', help='Skip topic modeling')
    parser.add_argument('--skip-sentiment', action='store_true', help='Skip sentiment analysis')
    parser.add_argument('--skip-keyword', action='store_true', help='Skip keyword extraction')
    parser.add_argument('--skip-engagement', action='store_true', help='Skip engagement analysis')
    
    # S3 options
    parser.add_argument('--use-s3', action='store_true', help='Store results in S3')
    parser.add_argument('--s3-bucket', type=str, help='S3 bucket name')
    
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_args()
    
    # Determine which steps to skip
    skip_steps = []
    if args.skip_fetch or (args.use_existing and args.existing_file):
        skip_steps.append('fetch')
    if args.skip_preprocess:
        skip_steps.append('preprocess')
    if args.skip_topic:
        skip_steps.append('topic')
    if args.skip_sentiment:
        skip_steps.append('sentiment')
    if args.skip_keyword:
        skip_steps.append('keyword')
    if args.skip_engagement:
        skip_steps.append('engagement')
    
    # Get company name
    company_name = args.company
    logger.info(f"Using company name: {company_name}")
    
    try:
        # Initialize the pipeline
        pipeline = NLPPipeline(
            company_name=company_name,
            use_s3=args.use_s3,
            s3_bucket=args.s3_bucket
        )
        
        # Run the pipeline
        if args.use_existing and args.existing_file:
            # Run with existing data
            results = pipeline.run_pipeline(
                use_existing=True,
                existing_file=args.existing_file,
                skip_steps=skip_steps
            )
        elif args.start_date and args.end_date:
            # Run with new data and date range
            results = pipeline.run_pipeline(
                start_date=args.start_date,
                end_date=args.end_date,
                limit=args.limit,
                skip_steps=skip_steps
            )
        else:
            # Use default file
            default_file = Path(__file__).parent.parent / "scrapping script" / f"reddit_nlp_{company_name}_2024-01-01_2025-12-31.json"
            
            if not default_file.exists():
                raise FileNotFoundError(f"No default data found for company '{company_name}'")
            
            results = pipeline.run_pipeline(
                use_existing=True,
                existing_file=str(default_file),
                skip_steps=skip_steps
            )
        
        logger.info("Pipeline execution successful")
        
    except Exception as e:
        logger.error(f"Pipeline execution failed: {str(e)}")
        sys.exit(1) 