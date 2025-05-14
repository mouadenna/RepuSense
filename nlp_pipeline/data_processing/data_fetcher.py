import os
import sys
import json
import datetime
import logging
import shutil
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the parent directory to sys.path to import the reddit_nlp_scraper
sys.path.append(str(Path(__file__).parent.parent.parent / "scrapping script"))

try:
    import reddit_nlp_scraper
except ImportError:
    logger.error("Could not import reddit_nlp_scraper. Make sure it exists in the correct directory.")
    sys.exit(1)

class RedditDataFetcher:
    """
    Class to fetch Reddit data using the reddit_nlp_scraper and store it in a designated location.
    This simulates an Airflow task that would fetch data and store it in S3.
    """

    def __init__(self, storage_dir=None, company_name=None):
        """
        Initialize the data fetcher.
        
        Args:
            storage_dir: Directory to store the data (simulating S3)
            company_name: Name of the company (used for directory structure if storage_dir is None)
        """
        self.base_dir = Path(__file__).parent.parent.parent
        
        # Define the data directory structure
        self.data_dir = self.base_dir / "data"
        
        # Store company name
        self.company_name = company_name
        
        # Determine storage directory
        if storage_dir is None:
            # If no storage_dir is provided, use the default with company name
            self.storage_dir = self.data_dir / "data_storage"
            if company_name:
                self.company_storage_dir = self.storage_dir / company_name
            else:
                self.company_storage_dir = self.storage_dir
        else:
            # If storage_dir is provided, use it directly without additional company name
            self.storage_dir = Path(storage_dir)
            if not self.storage_dir.is_absolute():
                self.storage_dir = self.data_dir / storage_dir
            self.company_storage_dir = self.storage_dir
        
        # Create the storage directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.storage_dir, exist_ok=True)
        os.makedirs(self.company_storage_dir, exist_ok=True)
        
        logger.info(f"Data will be stored in: {self.company_storage_dir}")

    def fetch_and_store_data(self, company_name, start_date, end_date, limit=None):
        """
        Fetch Reddit data and store it in the storage directory.
        
        Args:
            company_name: Company name to search for on Reddit
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            limit: Maximum number of posts to fetch
            
        Returns:
            Path to the stored data file
        """
        logger.info(f"Fetching Reddit data for company: {company_name}, from {start_date} to {end_date}")
        
        # Update company name internally (but don't change the directory)
        self.company_name = company_name
        
        # Generate a unique filename based on the search parameters
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"reddit_{company_name.replace(' ', '_')}_{start_date}_{end_date}_{timestamp}.json"
        output_path = self.company_storage_dir / filename
        
        try:
            # Call the scraper function to fetch and save the data
            data = reddit_nlp_scraper.scrape_reddit_for_nlp(
                keyword=company_name,  # Using company name as keyword for Reddit search
                start_date=start_date,
                end_date=end_date,
                limit=limit,
                output_file=str(output_path)
            )
            
            logger.info(f"Successfully fetched and stored Reddit data at: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Error fetching Reddit data: {str(e)}")
            raise

    def copy_existing_data(self, existing_file, company_name=None):
        """
        Copy an existing data file to the storage directory.
        
        Args:
            existing_file: Path to an existing data file
            company_name: Name of the company (optional, uses self.company_name if not provided)
            
        Returns:
            Path to the copied data file
        """
        existing_file_path = Path(existing_file)
        
        if not existing_file_path.exists():
            logger.error(f"Existing file not found: {existing_file}")
            raise FileNotFoundError(f"Existing file not found: {existing_file}")
        
        # Update internal company name (but don't change the directory)
        if company_name:
            self.company_name = company_name
        
        # Generate a new filename in the storage directory
        filename = f"existing_data_{self.company_name}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        dest_path = self.company_storage_dir / filename
        
        # Copy the file
        shutil.copyfile(existing_file_path, dest_path)
        
        logger.info(f"Copied existing data from {existing_file} to {dest_path}")
        return dest_path


if __name__ == "__main__":
    # Example usage
    data_fetcher = RedditDataFetcher(company_name="inwi")
    
    #Option 1: Fetch new data
    data_path = data_fetcher.fetch_and_store_data(
        company_name="inwi",
        start_date="2024-01-01",
        end_date="2025-12-31",
        limit=None
    )

    print(f"Data is available at: {data_path}") 