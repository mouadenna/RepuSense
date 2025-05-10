#!/usr/bin/env python
import os
import sys
import argparse
import subprocess
import json
from pathlib import Path

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Run the RepuSense NLP pipeline')
    
    # Main options
    parser.add_argument('--company', type=str, help='Company name to analyze')
    parser.add_argument('--start-date', type=str, help='Start date (YYYY-MM-DD)')
    parser.add_argument('--end-date', type=str, help='End date (YYYY-MM-DD)')
    
    # Use existing data
    parser.add_argument('--use-existing', action='store_true', 
                       help='Use existing data instead of fetching new data')
    parser.add_argument('--existing-file', type=str, 
                       help='Path to existing data file')
    
    # Skip steps
    parser.add_argument('--skip-topic', action='store_true', 
                       help='Skip topic modeling')
    parser.add_argument('--skip-sentiment', action='store_true', 
                       help='Skip sentiment analysis')
    parser.add_argument('--skip-keyword', action='store_true', 
                       help='Skip keyword extraction')
    
    # Initialize data directory structure
    parser.add_argument('--init-structure', action='store_true',
                       help='Initialize the data directory structure')
    
    return parser.parse_args()

# Load configuration from config.json
def load_config():
    config_path = Path(__file__).parent / "config.json"
    
    if config_path.exists():
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            print(f"Loaded configuration from {config_path}")
            return config
        except Exception as e:
            print(f"Error loading configuration: {str(e)}")
    
    print("No configuration file found, using defaults")
    return {}

def init_directory_structure():
    """Initialize the data directory structure based on config."""
    config = load_config()
    base_dir = Path(__file__).parent
    
    # Get directory names from config
    data_dir_name = config.get('pipeline', {}).get('data_dir', "data")
    data_storage_dir = config.get('pipeline', {}).get('data_storage_dir', "data_storage")
    processed_data_dir = config.get('pipeline', {}).get('processed_data_dir', "processed_data")
    nlp_results_dir = config.get('pipeline', {}).get('nlp_results_dir', "nlp_results")
    api_data_dir = config.get('pipeline', {}).get('api_data_dir', "api_data")
    api_requests_dir = config.get('pipeline', {}).get('api_requests_dir', "api_requests")
    
    # Create the main data directory
    data_dir = base_dir / data_dir_name
    os.makedirs(data_dir, exist_ok=True)
    
    # Create subdirectories
    directories = [
        data_dir / data_storage_dir,
        data_dir / processed_data_dir,
        data_dir / nlp_results_dir,
        data_dir / api_data_dir,
        data_dir / api_requests_dir
    ]
    
    # Create each directory
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")
    
    print("Data directory structure initialized successfully.")

def run_pipeline(args):
    """Run the NLP pipeline with the specified options."""
    print("Running NLP pipeline...")
    
    # Load configuration
    config = load_config()
    
    # Construct the command
    cmd = [sys.executable, "nlp_pipeline/main.py"]
    
    # Add company name if provided
    if args.company:
        cmd.extend(["--company", args.company])
    
    # Add date range if provided
    if args.start_date:
        cmd.extend(["--start-date", args.start_date])
    
    if args.end_date:
        cmd.extend(["--end-date", args.end_date])
    
    # Add options
    if args.use_existing:
        cmd.append("--use-existing")
        if args.existing_file:
            cmd.extend(["--existing-file", args.existing_file])
        elif args.company:
            # Try to find company-specific data file
            default_file = f"scrapping script/reddit_nlp_{args.company}_2024-01-01_2025-12-31.json"
            if os.path.exists(default_file):
                cmd.extend(["--existing-file", default_file])
        else:
            # Default to the inwi example if no company specified
            cmd.extend(["--existing-file", "scrapping script/reddit_nlp_inwi_2024-01-01_2025-12-31.json"])
    
    if args.skip_topic:
        cmd.append("--skip-topic")
    
    if args.skip_sentiment:
        cmd.append("--skip-sentiment")
    
    if args.skip_keyword:
        cmd.append("--skip-keyword")
    
    # Add S3 configuration from config.json
    use_s3 = config.get('s3', {}).get('enabled', True)
    s3_bucket = config.get('s3', {}).get('bucket')
    
    if use_s3:
        cmd.append("--use-s3")
        
    if s3_bucket:
        cmd.extend(["--s3-bucket", s3_bucket])
    
    # Run the pipeline
    print(f"Executing command: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    
    if result.returncode != 0:
        print("Pipeline execution failed!")
        sys.exit(1)
    
    print("Pipeline execution completed successfully!")

def run_api():
    """Run the API server."""
    print("Starting API server...")
    
    # Load configuration
    config = load_config()
    api_port = config.get('api', {}).get('port', 8000)
    api_host = config.get('api', {}).get('host', '0.0.0.0')
    
    cmd = [
        sys.executable, "-m", "uvicorn", 
        "nlp_pipeline.api.main:app", 
        "--host", api_host,
        "--port", str(api_port)
    ]
    
    print(f"Executing command: {' '.join(cmd)}")
    subprocess.run(cmd)

def main():
    """Main entry point."""
    args = parse_args()
    
    # Initialize directory structure if requested
    if args.init_structure:
        init_directory_structure()
        return
    
    # Run the pipeline
    run_pipeline(args)

if __name__ == "__main__":
    main() 