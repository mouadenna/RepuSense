import os
import sys
import json
import logging
import re
import string
from pathlib import Path
import pandas as pd
from typing import List, Dict, Any, Union, Optional

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class RedditDataPreprocessor:
    """
    Class to preprocess Reddit data for NLP tasks.
    Handles cleaning, filtering, and transforming data into suitable formats.
    """

    def __init__(self, processed_dir=None, company_name=None):
        """
        Initialize the preprocessor.
        
        Args:
            processed_dir: Directory to store processed data
            company_name: Name of the company (used for directory structure if processed_dir is None)
        """
        self.base_dir = Path(__file__).parent.parent.parent
        
        # Define the data directory structure
        self.data_dir = self.base_dir / "data"
        
        # Store company name
        self.company_name = company_name
        
        # Determine processed directory
        if processed_dir is None:
            # If no processed_dir is provided, use the default with company name
            self.processed_dir = self.data_dir / "processed_data"
            if company_name:
                self.company_processed_dir = self.processed_dir / company_name
            else:
                self.company_processed_dir = self.processed_dir
        else:
            # If processed_dir is provided, use it directly without additional company name
            self.processed_dir = Path(processed_dir)
            if not self.processed_dir.is_absolute():
                self.processed_dir = self.data_dir / processed_dir
            self.company_processed_dir = self.processed_dir
        
        # Create the processed data directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.processed_dir, exist_ok=True)
        os.makedirs(self.company_processed_dir, exist_ok=True)
        
        logger.info(f"Processed data will be stored in: {self.company_processed_dir}")
    
    def load_data(self, data_path):
        """
        Load data from a JSON file.
        
        Args:
            data_path: Path to the JSON data file
            
        Returns:
            Loaded data as a list of dictionaries
        """
        data_path = Path(data_path)
        
        if not data_path.exists():
            logger.error(f"Data file does not exist: {data_path}")
            raise FileNotFoundError(f"Data file does not exist: {data_path}")
        
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            logger.info(f"Successfully loaded data from: {data_path}")
            logger.info(f"Number of posts loaded: {len(data)}")
            return data
        
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise
    
    def clean_text(self, text):
        """
        Clean text by removing URLs, special characters, and extra whitespace.
        
        Args:
            text: Text to clean
            
        Returns:
            Cleaned text
        """
        if not text or not isinstance(text, str):
            return ""
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove Reddit markdown formatting
        text = re.sub(r'\[.*?\]\(.*?\)', '', text)  # Remove links [text](url)
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove bold **text**
        text = re.sub(r'\*(.*?)\*', r'\1', text)  # Remove italic *text*
        text = re.sub(r'~~(.*?)~~', r'\1', text)  # Remove strikethrough ~~text~~
        text = re.sub(r'#+ ', '', text)  # Remove headers # text
        
        # Remove special characters and numbers, keep letters, spaces, and punctuation
        text = re.sub(r'[^a-zA-Z0-9\s.,!?\'"-]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def preprocess_data(self, data):
        """
        Preprocess the Reddit data.
        
        Args:
            data: List of Reddit posts
            
        Returns:
            Preprocessed data as a DataFrame
        """
        preprocessed_posts = []
        
        for i, post in enumerate(data):
            try:
                # Extract post text and clean it
                post_text = self.clean_text(post.get('post_text', ''))
                
                # Skip empty posts
                if not post_text:
                    continue
                
                # Extract and clean comments
                comments = post.get('comments', [])
                cleaned_comments = [self.clean_text(comment) for comment in comments if comment]
                cleaned_comments = [comment for comment in cleaned_comments if comment]  # Remove empty comments
                
                # Create the preprocessed post
                preprocessed_post = {
                    'post_id': i,
                    'post_text': post_text,
                    'comments': cleaned_comments,
                    'comment_count': len(cleaned_comments)
                }
                
                preprocessed_posts.append(preprocessed_post)
            
            except Exception as e:
                logger.warning(f"Error preprocessing post {i}: {str(e)}")
                continue
        
        logger.info(f"Successfully preprocessed {len(preprocessed_posts)} posts")
        
        # Convert to DataFrame for easier manipulation
        posts_df = pd.DataFrame(preprocessed_posts)
        
        return posts_df
    
    def save_processed_data(self, data_df, output_filename):
        """
        Save processed data to a CSV file.
        
        Args:
            data_df: DataFrame with processed data
            output_filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.company_processed_dir / output_filename
        
        # For DataFrames containing list columns, save as JSON to preserve structure
        if output_filename.endswith('.json'):
            data_df.to_json(output_path, orient='records', indent=2)
        else:
            # If we need to save as CSV, convert list columns to strings
            df_to_save = data_df.copy()
            for col in df_to_save.columns:
                if df_to_save[col].apply(lambda x: isinstance(x, list)).any():
                    df_to_save[col] = df_to_save[col].apply(lambda x: str(x) if isinstance(x, list) else x)
            
            df_to_save.to_csv(output_path, index=False)
        
        logger.info(f"Successfully saved processed data to: {output_path}")
        return output_path
    
    def extract_text_for_nlp(self, data_df):
        """
        Extract all text for NLP tasks.
        
        Args:
            data_df: DataFrame with posts and comments
            
        Returns:
            DataFrame with post_id and text (all text from posts and comments)
        """
        # Create a new DataFrame with post_id and combined text
        nlp_data = []
        
        for _, row in data_df.iterrows():
            # Add the post text
            nlp_data.append({
                'post_id': row['post_id'],
                'text_type': 'post',
                'text': row['post_text']
            })
            
            # Add each comment
            for i, comment in enumerate(row['comments']):
                nlp_data.append({
                    'post_id': row['post_id'],
                    'text_type': 'comment',
                    'comment_id': i,
                    'text': comment
                })
        
        nlp_df = pd.DataFrame(nlp_data)
        logger.info(f"Extracted {len(nlp_df)} text entries for NLP processing")
        
        return nlp_df
    
    def process_data(self, data_path, save_intermediate=True):
        """
        Process the data from end to end.
        
        Args:
            data_path: Path to the data file
            save_intermediate: Whether to save intermediate results
            
        Returns:
            DataFrame ready for NLP tasks
        """
        # Load the data
        data = self.load_data(data_path)
        
        # Preprocess the data
        processed_df = self.preprocess_data(data)
        
        if save_intermediate:
            self.save_processed_data(processed_df, 'processed_posts.json')
        
        # Extract text for NLP
        nlp_df = self.extract_text_for_nlp(processed_df)
        
        # Save NLP data
        output_path = self.save_processed_data(nlp_df, 'nlp_ready_data.json')
        
        return nlp_df, output_path

if __name__ == "__main__":
    # Example usage
    preprocessor = RedditDataPreprocessor(company_name="inwi")
    
    # Process data from a file (adjusted path to use the new data directory structure)
    data_path = Path(__file__).parent.parent.parent / "data" / "data_storage" / "inwi" / "reddit_inwi_2024-01-01_2025-12-31_20250509_220334.json"
    
    if data_path.exists():
        nlp_df, output_path = preprocessor.process_data(data_path)
        print(f"NLP-ready data saved to: {output_path}")
    else:
        print(f"Data file not found at: {data_path}")
        print("Run data_fetcher.py first to get the data.") 