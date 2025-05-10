import os
import sys
import json
import logging
import argparse
import boto3
from pathlib import Path
from datetime import datetime

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
        
        # Validate company name - THROW ERROR if not provided
        if not company_name:
            raise ValueError("Company name is required. Please provide a company name using the --company parameter.")
        
        # Store company name
        self.company_name = company_name
        
        # Log the company name for debugging
        logger.info(f"Initializing NLP pipeline for company: {self.company_name}")
        
        # S3 configuration (prioritize constructor params, then config, then defaults)
        self.use_s3 = use_s3 if use_s3 is not None else self.config.get('s3', {}).get('enabled', True)
        self.s3_bucket = s3_bucket or self.config.get('s3', {}).get('bucket', "repusense-results")
        self.s3_region = self.config.get('s3', {}).get('region', "us-east-1")
        self.s3_client = None
        
        if self.use_s3 and self.s3_bucket:
            try:
                self.s3_client = boto3.client('s3', region_name=self.s3_region)
                logger.info(f"Initialized S3 client for bucket: {self.s3_bucket} in region: {self.s3_region}")
            except Exception as e:
                logger.error(f"Error initializing S3 client: {str(e)}")
                logger.warning("Falling back to local storage")
                self.use_s3 = False
        
        # Create data directory to contain all data-related subdirectories
        self.data_dir = self.base_dir / "data"
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Store directory names from config
        self.data_storage_dir_name = self.config.get('pipeline', {}).get('data_storage_dir', "data_storage")
        self.processed_data_dir_name = self.config.get('pipeline', {}).get('processed_data_dir', "processed_data")
        self.nlp_results_dir_name = self.config.get('pipeline', {}).get('nlp_results_dir', "nlp_results")
        self.api_data_dir_name = self.config.get('pipeline', {}).get('api_data_dir', "api_data")
        
        # Company-specific storage and processing directories
        self.data_storage_dir = self.data_dir / self.data_storage_dir_name / self.company_name
        self.processed_data_dir = self.data_dir / self.processed_data_dir_name / self.company_name
        
        # Create common nlp_results company directory for analysis results
        self.nlp_results_company_dir = self.data_dir / self.nlp_results_dir_name / self.company_name
        os.makedirs(self.nlp_results_company_dir, exist_ok=True)
        
        # Create analysis subdirectories
        analysis_types = ["topics", "sentiment", "keywords", "engagement"]
        self.analysis_dirs = {}
        for analysis_type in analysis_types:
            dir_path = self.nlp_results_company_dir / analysis_type
            self.analysis_dirs[analysis_type] = dir_path
            os.makedirs(dir_path, exist_ok=True)
        
        # Create additional directories
        self.api_data_dir = self.data_dir / self.api_data_dir_name / self.company_name
        os.makedirs(self.data_storage_dir, exist_ok=True)
        os.makedirs(self.processed_data_dir, exist_ok=True)
        os.makedirs(self.api_data_dir, exist_ok=True)
        
        # Initialize pipeline components
        self.data_fetcher = RedditDataFetcher(
            storage_dir=self.data_storage_dir,
            company_name=self.company_name 
        )
        
        # Pass only the base processed_data_dir to RedditDataPreprocessor
        self.data_preprocessor = RedditDataPreprocessor(
            processed_dir=self.processed_data_dir,
            company_name=self.company_name
        )
        
        self.topic_modeler = TopicModeler(
            output_dir=str(self.analysis_dirs["topics"]),
            company_name=None  # Set to None since the path already includes the company name
        )
        self.sentiment_analyzer = SentimentAnalyzer(
            output_dir=str(self.analysis_dirs["sentiment"]),
            company_name=None  # Set to None since the path already includes the company name
        )
        self.keyword_extractor = KeywordExtractor(
            output_dir=str(self.analysis_dirs["keywords"]),
            company_name=None  # Set to None since the path already includes the company name
        )
        self.engagement_analyzer = EngagementAnalyzer(
            output_dir=str(self.analysis_dirs["engagement"]),
            company_name=None  # Set to None since the path already includes the company name
        )
        
        # Store results
        self.results = {}
    
    def _load_config(self):
        """
        Load configuration from config.json if it exists.
        
        Returns:
            Dictionary with configuration settings
        """
        config_path = Path(__file__).parent.parent / "config.json"
        
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
    
    def fetch_data(self, start_date=None, end_date=None, limit=None, use_existing=False, existing_file=None):
        """
        Fetch Reddit data.
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            limit: Maximum number of posts to fetch
            use_existing: Whether to use an existing data file
            existing_file: Path to the existing data file
            
        Returns:
            Path to the data file
        """
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
        """
        Preprocess the data.
        
        Args:
            data_path: Path to the data file
            
        Returns:
            Tuple of (DataFrame with preprocessed posts, path to NLP-ready data)
        """
        logger.info("Step 2: Preprocessing data")
        
        # Process the data
        nlp_df, nlp_data_path = self.data_preprocessor.process_data(data_path)
        
        # Get the path to the processed_posts.json file directly from the data_preprocessor
        processed_posts_path = self.data_preprocessor.company_processed_dir / "processed_posts.json"
        logger.info(f"Expected path for processed posts: {processed_posts_path}")
        
        # Store the paths in results
        self.results['processed_posts_path'] = processed_posts_path
        self.results['nlp_data_path'] = nlp_data_path
        
        # Verify the file exists
        if not processed_posts_path.exists():
            logger.warning(f"Processed posts file not found at expected path: {processed_posts_path}")
        else:
            logger.info(f"Verified processed posts file exists at: {processed_posts_path}")
        
        return nlp_df, nlp_data_path
    
    def run_topic_modeling(self, data_path):
        """
        Run topic modeling.
        
        Args:
            data_path: Path to the NLP-ready data
            
        Returns:
            Dictionary with topic modeling results
        """
        logger.info("Step 3: Running topic modeling")
        
        topic_results = self.topic_modeler.run_topic_modeling(data_path)
        self.results['topic_modeling'] = topic_results
        
        return topic_results
    
    def run_sentiment_analysis(self, data_path):
        """
        Run sentiment analysis.
        
        Args:
            data_path: Path to the NLP-ready data
            
        Returns:
            Dictionary with sentiment analysis results
        """
        logger.info("Step 4: Running sentiment analysis")
        
        sentiment_results = self.sentiment_analyzer.run_sentiment_analysis(data_path)
        self.results['sentiment_analysis'] = sentiment_results
        
        return sentiment_results
    
    def run_keyword_extraction(self, data_path):
        """
        Run keyword extraction.
        
        Args:
            data_path: Path to the NLP-ready data
            
        Returns:
            Dictionary with keyword extraction results
        """
        logger.info("Step 5: Running keyword extraction")
        
        keyword_results = self.keyword_extractor.run_keyword_extraction(data_path)
        self.results['keyword_extraction'] = keyword_results
        
        return keyword_results
    
    def run_engagement_analysis(self, data_path):
        """
        Run engagement analysis.
        
        Args:
            data_path: Path to the preprocessed posts
            
        Returns:
            Dictionary with engagement analysis results
        """
        logger.info("Step 6: Running engagement analysis")
        
        engagement_results = self.engagement_analyzer.run_engagement_analysis(data_path)
        self.results['engagement_analysis'] = engagement_results
        
        return engagement_results
    
    def prepare_api_data(self, output_dir=None):
        """
        Prepare data for the API.
        
        Args:
            output_dir: Directory to store API data
            
        Returns:
            Dictionary with paths to API data files
        """
        logger.info("Step 7: Preparing API data")
        
        # Create the API data directory
        if output_dir is None:
            api_data_dir = self.api_data_dir
        else:
            api_data_dir = Path(output_dir)
            if not api_data_dir.is_absolute():
                api_data_dir = self.data_dir / output_dir / self.company_name
            
        os.makedirs(api_data_dir, exist_ok=True)
        
        api_data = {}
        
        # Copy topic distribution
        if 'topic_modeling' in self.results and 'topic_distribution' in self.results['topic_modeling']:
            source_path = self.results['topic_modeling']['topic_distribution']
            dest_path = api_data_dir / "topics.json"
            self._copy_json_file(source_path, dest_path)
            api_data['topics'] = dest_path
        
        # Copy sentiment results
        if 'sentiment_analysis' in self.results and 'sentiment_results' in self.results['sentiment_analysis']:
            source_path = self.results['sentiment_analysis']['sentiment_results']
            dest_path = api_data_dir / "sentiment.json"
            self._copy_json_file(source_path, dest_path)
            api_data['sentiment'] = dest_path
        
        # Copy keyword results
        if 'keyword_extraction' in self.results and 'keyword_results' in self.results['keyword_extraction']:
            source_path = self.results['keyword_extraction']['keyword_results']
            dest_path = api_data_dir / "keywords.json"
            self._copy_json_file(source_path, dest_path)
            api_data['keywords'] = dest_path
        
        # Copy engagement results
        if 'engagement_analysis' in self.results and 'engagement_results' in self.results['engagement_analysis']:
            source_path = self.results['engagement_analysis']['engagement_results']
            dest_path = api_data_dir / "engagement.json"
            self._copy_json_file(source_path, dest_path)
            api_data['engagement'] = dest_path
        
        # Copy word cloud data
        if 'keyword_extraction' in self.results and 'word_cloud_data' in self.results['keyword_extraction']:
            source_path = self.results['keyword_extraction']['word_cloud_data']
            dest_path = api_data_dir / "wordcloud.json"
            self._copy_json_file(source_path, dest_path)
            api_data['wordcloud'] = dest_path
        
        # Create a company info file
        company_info_path = api_data_dir / "company_info.json"
        company_info = {
            "name": self.company_name,
            "analysis_timestamp": self.results.get('timestamp', ''),
            "data_sources": ["Reddit"]
        }
        with open(company_info_path, 'w', encoding='utf-8') as f:
            json.dump(company_info, f, indent=2)
        api_data['company_info'] = company_info_path
        
        self.results['api_data'] = api_data
        
        # Upload to S3 if enabled
        if self.use_s3 and self.s3_client:
            self.upload_results_to_s3(api_data)
        
        return api_data
    
    def _copy_json_file(self, source_path, dest_path):
        """
        Copy a JSON file, preserving its structure.
        
        Args:
            source_path: Path to the source file
            dest_path: Path to the destination file
        """
        try:
            with open(source_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            with open(dest_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            
            logger.info(f"Copied {source_path} to {dest_path}")
        
        except Exception as e:
            logger.error(f"Error copying JSON file: {str(e)}")
    
    def upload_results_to_s3(self, api_data):
        """
        Upload API data to S3.
        
        Args:
            api_data: Dictionary with paths to API data files
        
        Returns:
            Dictionary with S3 URLs for the uploaded files
        """
        if not self.s3_client or not self.s3_bucket:
            logger.error("S3 client or bucket not configured")
            return None
        
        s3_urls = {}
        timestamp = datetime.now().strftime("%Y%m%d")
        
        try:
            # Create a results object for all data
            all_results = {}
            
            # Upload each file
            for data_type, file_path in api_data.items():
                if not isinstance(file_path, Path) or not file_path.exists():
                    continue
                
                # Read the file content
                with open(file_path, 'r', encoding='utf-8') as f:
                    file_content = json.load(f)
                
                # Add to all_results
                all_results[data_type] = file_content
                
                # Define S3 key (path in the bucket)
                s3_key = f"{self.company_name}/{timestamp}/{data_type}.json"
                
                # Upload file
                self.s3_client.upload_file(
                    Filename=str(file_path),
                    Bucket=self.s3_bucket,
                    Key=s3_key
                )
                
                # Generate URL
                s3_url = f"s3://{self.s3_bucket}/{s3_key}"
                s3_urls[data_type] = s3_url
                
                logger.info(f"Uploaded {file_path} to {s3_url}")
            
            # Save the combined results to JSON file
            combined_results_path = self.processed_data_dir / "combined_results.json"
            with open(combined_results_path, 'w', encoding='utf-8') as f:
                json.dump(all_results, f, indent=2)
            
            # Upload the combined results
            combined_s3_key = f"{self.company_name}/{timestamp}/combined_results.json"
            self.s3_client.upload_file(
                Filename=str(combined_results_path),
                Bucket=self.s3_bucket,
                Key=combined_s3_key
            )
            
            s3_urls['combined_results'] = f"s3://{self.s3_bucket}/{combined_s3_key}"
            logger.info(f"Uploaded combined results to {s3_urls['combined_results']}")
            
            self.results['s3_urls'] = s3_urls
            return s3_urls
            
        except Exception as e:
            logger.error(f"Error uploading to S3: {str(e)}")
            return None
    
    def run_pipeline(self, start_date=None, end_date=None, limit=None, 
                    use_existing=False, existing_file=None, skip_steps=None):
        """
        Run the complete NLP pipeline.
        
        Args:
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            limit: Maximum number of posts to fetch
            use_existing: Whether to use an existing data file
            existing_file: Path to the existing data file
            skip_steps: List of steps to skip
            
        Returns:
            Dictionary with all results
        """
        if skip_steps is None:
            skip_steps = []
            
        # Add timestamp to results
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
            # Use default paths if skipped
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
            # Use the processed_posts.json file from the results
            processed_posts_path = self.results['processed_posts_path']
            
            # Verify the file exists
            if not processed_posts_path.exists():
                logger.warning(f"Processed posts file not found at expected path: {processed_posts_path}")
                
                # Try finding in these possible locations
                possible_paths = [
                    # Try directly in the processed data dir
                    self.processed_data_dir / "processed_posts.json",
                    # Try in the company-specific dir that match processed_data_dir
                    self.data_dir / self.processed_data_dir_name / "processed_posts.json",
                    # Try in the data_preprocessor's company_processed_dir
                    self.data_preprocessor.company_processed_dir / "processed_posts.json"
                ]
                
                for path in possible_paths:
                    if path.exists():
                        logger.info(f"Found processed posts at alternate path: {path}")
                        processed_posts_path = path
                        # Update the path in results
                        self.results['processed_posts_path'] = processed_posts_path
                        break
                else:
                    logger.error(f"Could not find processed posts file. Engagement analysis will likely fail.")
            
            # Only attempt engagement analysis if file exists
            if processed_posts_path.exists():
                self.run_engagement_analysis(processed_posts_path)
            else:
                logger.error("Skipping engagement analysis due to missing processed_posts.json file")
                self.results['engagement_analysis'] = {"error": "Processed posts file not found"}
        
        # Step 7: Prepare API data
        if 'api' not in skip_steps:
            self.prepare_api_data()
        
        logger.info("Pipeline execution complete")
        return self.results

def parse_args():
    """
    Parse command line arguments.
    
    Returns:
        Parsed arguments
    """
    parser = argparse.ArgumentParser(description='Run the NLP pipeline for Reddit data')
    
    # Company name
    parser.add_argument('--company', type=str, required=True, 
                       help='Name of the company to analyze (will be used as keyword for Reddit search)')
    
    # Data fetching options
    parser.add_argument('--start-date', type=str, help='Start date in YYYY-MM-DD format')
    parser.add_argument('--end-date', type=str, help='End date in YYYY-MM-DD format')
    parser.add_argument('--limit', type=int, help='Maximum number of posts to fetch')
    
    # Use existing data
    parser.add_argument('--use-existing', action='store_true', help='Use existing data file')
    parser.add_argument('--existing-file', type=str, help='Path to the existing data file')
    
    # Skip steps
    parser.add_argument('--skip-fetch', action='store_true', help='Skip data fetching')
    parser.add_argument('--skip-preprocess', action='store_true', help='Skip data preprocessing')
    parser.add_argument('--skip-topic', action='store_true', help='Skip topic modeling')
    parser.add_argument('--skip-sentiment', action='store_true', help='Skip sentiment analysis')
    parser.add_argument('--skip-keyword', action='store_true', help='Skip keyword extraction')
    parser.add_argument('--skip-engagement', action='store_true', help='Skip engagement analysis')
    parser.add_argument('--skip-api', action='store_true', help='Skip API data preparation')
    
    # S3 options
    parser.add_argument('--use-s3', action='store_true', help='Store results in S3')
    parser.add_argument('--s3-bucket', type=str, help='S3 bucket name')
    
    return parser.parse_args()

if __name__ == "__main__":
    # Parse command line arguments
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
    if args.skip_api:
        skip_steps.append('api')
    
    # Get company name - THROW ERROR if not provided
    if not args.company:
        logger.error("Company name is required. Please provide a company name using the --company parameter.")
        sys.exit(1)
    
    company_name = args.company
    logger.info(f"Using company name: {company_name}")
    
    # Initialize the pipeline with company name and S3 settings
    pipeline = NLPPipeline(
        company_name=company_name,
        use_s3=args.use_s3,
        s3_bucket=args.s3_bucket
    )
    
    # Run the pipeline with command line arguments
    if args.use_existing and args.existing_file:
        # Run with existing data
        results = pipeline.run_pipeline(
            use_existing=True,
            existing_file=args.existing_file,
            skip_steps=skip_steps
        )
    elif args.start_date and args.end_date:
        # Run with new data and specified keyword
        results = pipeline.run_pipeline(
            start_date=args.start_date,
            end_date=args.end_date,
            limit=args.limit,
            skip_steps=skip_steps
        )
    else:
        # Run with default values using the provided company name
        logger.info(f"Running with default values for company: {company_name}")
        
        # Try to find existing data for this company
        existing_file = Path(__file__).parent.parent / "scrapping script" / f"reddit_nlp_{company_name}_2024-01-01_2025-12-31.json"
        
        if not existing_file.exists():
            # No existing data for this company
            logger.error(f"No default data found for company '{company_name}'. Please provide a data file with --existing-file or specify --start-date and --end-date to fetch new data.")
            sys.exit(1)
        
        results = pipeline.run_pipeline(
            use_existing=True,
            existing_file=str(existing_file),
            skip_steps=skip_steps
        )
    
    # Print results summary
    logger.info("Pipeline results summary:")
    for step, step_results in results.items():
        if isinstance(step_results, dict):
            logger.info(f"- {step}:")
            for key, value in step_results.items():
                logger.info(f"  - {key}: {value}")
        else:
            logger.info(f"- {step}: {step_results}")
    
    logger.info("Done!") 