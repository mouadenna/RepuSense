import os
import sys
import json
import logging
import datetime
import requests
from pathlib import Path
from typing import Optional, List, Dict, Any

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NewsAPIFetcher:
    """
    Class to fetch news articles using the NewsAPI and store them in a designated location.
    This complements the RedditDataFetcher to provide a more comprehensive view of public sentiment.
    """

    def __init__(self, api_key: str, storage_dir=None, company_name=None):
        """
        Initialize the news data fetcher.
        
        Args:
            api_key: NewsAPI API key
            storage_dir: Directory to store the data
            company_name: Name of the company (used for directory structure if storage_dir is None)
        """
        self.api_key = api_key
        self.base_url = "https://newsapi.org/v2"
        self.base_dir = Path(__file__).parent.parent.parent
        
        # Define the data directory structure
        self.data_dir = self.base_dir / "data"
        
        # Store company name
        self.company_name = company_name
        
        # Determine storage directory
        if storage_dir is None:
            # If no storage_dir is provided, use the default with company name
            self.storage_dir = self.data_dir / "news_data_storage"
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
        
        logger.info(f"News data will be stored in: {self.company_storage_dir}")

    def fetch_everything(self, 
                        query: str,
                        from_date: Optional[str] = None,
                        to_date: Optional[str] = None,
                        language: str = "en",
                        sort_by: str = "publishedAt",
                        page_size: int = 100) -> Dict[str, Any]:
        """
        Fetch articles from the /everything endpoint.
        
        Args:
            query: Keywords or phrases to search for
            from_date: A date in YYYY-MM-DD format
            to_date: A date in YYYY-MM-DD format
            language: Language code (e.g., 'en' for English)
            sort_by: Sort order (relevancy, popularity, publishedAt)
            page_size: Number of results per page (max 100)
            
        Returns:
            JSON response from the API
        """
        endpoint = f"{self.base_url}/everything"
        
        params = {
            "q": query,
            "language": language,
            "sortBy": sort_by,
            "pageSize": page_size,
            "apiKey": self.api_key
        }
        
        if from_date:
            params["from"] = from_date
        
        if to_date:
            params["to"] = to_date
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching news data: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise

    def fetch_top_headlines(self,
                           query: Optional[str] = None,
                           country: Optional[str] = None,
                           category: Optional[str] = None,
                           sources: Optional[str] = None,
                           page_size: int = 100) -> Dict[str, Any]:
        """
        Fetch top headlines from the /top-headlines endpoint.
        
        Args:
            query: Keywords or phrases to search for
            country: 2-letter ISO 3166-1 country code
            category: Category (business, entertainment, general, health, science, sports, technology)
            sources: Comma-separated string of news source IDs
            page_size: Number of results per page (max 100)
            
        Returns:
            JSON response from the API
        """
        endpoint = f"{self.base_url}/top-headlines"
        
        params = {
            "pageSize": page_size,
            "apiKey": self.api_key
        }
        
        if query:
            params["q"] = query
        
        if country:
            params["country"] = country
        
        if category:
            params["category"] = category
        
        if sources:
            params["sources"] = sources
        
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()  # Raise an exception for HTTP errors
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching top headlines: {str(e)}")
            if hasattr(e.response, 'text'):
                logger.error(f"Response: {e.response.text}")
            raise

    def fetch_and_store_data(self, 
                            company_name: str, 
                            start_date: Optional[str] = None, 
                            end_date: Optional[str] = None,
                            search_everything: bool = True,
                            search_headlines: bool = True,
                            country: Optional[str] = None,
                            category: Optional[str] = None):
        """
        Fetch news data and store it in the storage directory.
        
        Args:
            company_name: Company name to search for
            start_date: Start date in YYYY-MM-DD format
            end_date: End date in YYYY-MM-DD format
            search_everything: Whether to search the /everything endpoint
            search_headlines: Whether to search the /top-headlines endpoint
            country: Country code for headlines search
            category: Category for headlines search
            
        Returns:
            Path to the stored data file
        """
        logger.info(f"Fetching news data for company: {company_name}, from {start_date} to {end_date}")
        
        # Update company name internally
        self.company_name = company_name
        
        # Generate a unique filename based on the search parameters
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"news_{company_name.replace(' ', '_')}_{start_date or 'none'}_{end_date or 'none'}_{timestamp}.json"
        output_path = self.company_storage_dir / filename
        
        results = {
            "company": company_name,
            "start_date": start_date,
            "end_date": end_date,
            "fetch_timestamp": datetime.datetime.now().isoformat(),
            "articles": []
        }
        
        try:
            # Fetch from /everything endpoint if enabled
            if search_everything:
                everything_data = self.fetch_everything(
                    query=company_name,
                    from_date=start_date,
                    to_date=end_date
                )
                
                if "articles" in everything_data:
                    for article in everything_data["articles"]:
                        article["source_endpoint"] = "everything"
                        results["articles"].append(article)
                
                logger.info(f"Found {len(everything_data.get('articles', []))} articles from /everything endpoint")
            
            # Fetch from /top-headlines endpoint if enabled
            if search_headlines:
                headlines_data = self.fetch_top_headlines(
                    query=company_name,
                    country=country,
                    category=category
                )
                
                if "articles" in headlines_data:
                    for article in headlines_data["articles"]:
                        article["source_endpoint"] = "top-headlines"
                        # Avoid duplicates (simple check on URL)
                        if not any(existing["url"] == article["url"] for existing in results["articles"]):
                            results["articles"].append(article)
                
                logger.info(f"Found {len(headlines_data.get('articles', []))} articles from /top-headlines endpoint")
            
            # Calculate total unique articles
            total_articles = len(results["articles"])
            logger.info(f"Total unique articles: {total_articles}")
            
            # Add article count to the results
            results["total_articles"] = total_articles
            
            # Write the results to a JSON file
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            
            logger.info(f"Successfully fetched and stored news data at: {output_path}")
            return output_path
            
        except Exception as e:
            logger.error(f"Error fetching news data: {str(e)}")
            raise


if __name__ == "__main__":
    # Example usage
    API_KEY = "ec13800922bf4ae7841c166c06d208ca"  # Your NewsAPI key
    
    news_fetcher = NewsAPIFetcher(
        api_key=API_KEY,
        company_name="Apple"
    )
    
    # Option 1: Fetch news articles for a company
    data_path = news_fetcher.fetch_and_store_data(
        company_name="Apple",
        start_date="2024-01-01",
        end_date=datetime.datetime.now().strftime("%Y-%m-%d"),
        search_everything=True,
        search_headlines=True,
        country="us",
        category="business"
    )

    print(f"News data is available at: {data_path}") 