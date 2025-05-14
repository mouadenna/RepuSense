from io import BytesIO
import os
import sys
import json
import logging
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional, Union, Any
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer
import matplotlib.pyplot as plt
from collections import Counter
from wordcloud import WordCloud

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class KeywordExtractor:
    """
    Class to extract keywords from Reddit data using KeyBERT.
    """
    
    def __init__(self, output_dir=None, company_name=None):
        """
        Initialize the keyword extractor.
        
        Args:
            output_dir: Directory to store keyword extraction results
            company_name: Name of the company (used for directory structure)
        """
        self.base_dir = Path(__file__).parent.parent.parent
        
        # Define the data directory structure
        self.data_dir = self.base_dir / "data"
        self.nlp_results_dir = self.data_dir / "nlp_results"
        
        # Set the company name
        self.company_name = company_name
        
        # Set the output directory
        if output_dir is None:
            if company_name:
                self.output_dir = self.nlp_results_dir / company_name / "keywords"
            else:
                self.output_dir = self.nlp_results_dir / "keywords"
        else:
            self.output_dir = Path(output_dir)
            if not self.output_dir.is_absolute():
                if company_name:
                    self.output_dir = self.data_dir / output_dir / company_name / "keywords"
                else:
                    self.output_dir = self.data_dir / output_dir
        
        # Create the output directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.nlp_results_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        
        logger.info(f"Keyword extraction results will be stored in: {self.output_dir}")
        
        # Initialize model
        self.model = None
    
    def load_data(self, data_path):
        """
        Load data for keyword extraction.
        
        Args:
            data_path: Path to the preprocessed data
            
        Returns:
            DataFrame with post_id, text_type, and text columns
        """
        data_path = Path(data_path)
        
        if not data_path.exists():
            logger.error(f"Data file does not exist: {data_path}")
            raise FileNotFoundError(f"Data file does not exist: {data_path}")
        
        try:
            # Load the data
            if data_path.suffix == '.json':
                data_df = pd.read_json(data_path)
            else:
                data_df = pd.read_csv(data_path)
            
            logger.info(f"Successfully loaded data from: {data_path}")
            logger.info(f"Number of documents loaded: {len(data_df)}")
            
            # Ensure required columns are present
            required_cols = ['post_id', 'text_type', 'text']
            for col in required_cols:
                if col not in data_df.columns:
                    logger.error(f"Required column '{col}' not found in data")
                    raise ValueError(f"Required column '{col}' not found in data")
            
            return data_df
        
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise
    
    def initialize_model(self):
        """
        Initialize the KeyBERT model.
        """
        try:
            # Initialize KeyBERT with a sentence transformer model
            self.model = KeyBERT(model="all-MiniLM-L6-v2")
            
            logger.info("Successfully initialized KeyBERT model")
        
        except Exception as e:
            logger.error(f"Error initializing KeyBERT model: {str(e)}")
            raise
    
    def extract_keywords(self, text, top_n=5, min_df=1, ngram_range=(1, 2)):
        """
        Extract keywords from a text.
        
        Args:
            text: Text to extract keywords from
            top_n: Number of top keywords to extract
            min_df: Minimum document frequency for words
            ngram_range: Range of n-grams to consider
            
        Returns:
            List of extracted keywords
        """
        if not text or not isinstance(text, str):
            return []
        
        if self.model is None:
            logger.info("Model not initialized. Initializing...")
            self.initialize_model()
        
        try:
            # Extract keywords
            keywords = self.model.extract_keywords(
                text,
                keyphrase_ngram_range=ngram_range,
                stop_words='english',
                top_n=top_n,
                min_df=min_df
            )
            
            # Return just the keywords (not scores)
            return [keyword for keyword, _ in keywords]
        
        except Exception as e:
            logger.warning(f"Error extracting keywords from text: {str(e)}")
            return []
    
    def extract_keywords_batch(self, data_df, top_n=5):
        """
        Extract keywords for all texts in the data.
        
        Args:
            data_df: DataFrame with texts to analyze
            top_n: Number of top keywords to extract per text
            
        Returns:
            DataFrame with keyword extraction results
        """
        if self.model is None:
            logger.info("Model not initialized. Initializing...")
            self.initialize_model()
        
        # Create a copy of the input DataFrame
        result_df = data_df.copy()
        
        # Extract keywords for each text
        keywords_list = []
        
        logger.info(f"Extracting keywords for {len(result_df)} texts")
        
        for i, row in result_df.iterrows():
            text = row['text']
            post_id = row['post_id']
            text_type = row['text_type']
            
            try:
                # Extract keywords
                keywords = self.extract_keywords(text, top_n=top_n)
                
                # Log progress
                if (i + 1) % 100 == 0 or (i + 1) == len(result_df):
                    logger.info(f"Processed {i + 1}/{len(result_df)} texts")
                
                keywords_list.append(keywords)
            
            except Exception as e:
                logger.warning(f"Error extracting keywords for text {i}: {str(e)}")
                keywords_list.append([])
        
        # Add keywords to the DataFrame
        result_df['keywords'] = keywords_list
        
        return result_df
    
    def save_keyword_results(self, data_df, filename="keyword_results.json"):
        """
        Save keyword extraction results to a file.
        
        Args:
            data_df: DataFrame with keyword extraction results
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        # Create a list of dictionaries for the API format
        api_format = []
        
        for _, row in data_df.iterrows():
            if not row['keywords'] or len(row['keywords']) == 0:
                continue
                
            api_format.append({
                "post_id": int(row['post_id']),
                "keywords": row['keywords']
            })
        
        # Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(api_format, f, indent=2)
        
        logger.info(f"Successfully saved keyword results to: {output_path}")
        return output_path
    
    def prepare_word_cloud_data(self, data_df):
        """
        Prepare word cloud data by counting keyword frequencies.
        
        Args:
            data_df: DataFrame with keyword extraction results
            
        Returns:
            List of dictionaries with word and frequency
        """
        # Flatten the list of keywords
        all_keywords = []
        for keywords in data_df['keywords']:
            all_keywords.extend(keywords)
        
        # Count the frequencies
        keyword_counts = Counter(all_keywords)
        
        # Create the word cloud data
        word_cloud_data = [
            {"word": word, "frequency": count}
            for word, count in keyword_counts.most_common(100)  # Top 100 words
        ]
        
        return word_cloud_data
    
    def save_word_cloud_data(self, data_df, filename="word_cloud_data.json"):
        """
        Save word cloud data to a file.
        
        Args:
            data_df: DataFrame with keyword extraction results
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        word_cloud_data = self.prepare_word_cloud_data(data_df)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(word_cloud_data, f, indent=2)
        
        logger.info(f"Successfully saved word cloud data to: {output_path}")
        return output_path
    
    def create_word_cloud(self, data_df, max_words=100):
        """
        Create a word cloud visualization of keywords.
        
        Args:
            data_df: DataFrame with keyword extraction results
            max_words: Maximum number of words to include in the word cloud
            
        Returns:
            Path to the saved image file
        """
        try:
            # Get word cloud data (keyword frequencies)
            word_cloud_data = self.prepare_word_cloud_data(data_df)
            
            # Create a dictionary of word:frequency for WordCloud
            word_freq = {item["word"]: item["frequency"] for item in word_cloud_data}
            
            # Create the WordCloud object
            wc = WordCloud(
                background_color="white",
                max_words=max_words,
                width=800,
                height=400,
                colormap="viridis",
                contour_width=1,
                contour_color="steelblue"
            )
            
            # Generate the word cloud
            wc.generate_from_frequencies(word_freq)
            
            # Save as image first
            img_path = self.output_dir / "wordcloud.png"
            wc.to_file(str(img_path))
            logger.info(f"Saved word cloud image to: {img_path}")
            
            # Create a plotly figure with the word cloud image
            plt.figure(figsize=(10, 5))
            plt.imshow(wc, interpolation="bilinear")
            plt.axis("off")
            
            # Save to a BytesIO object
            img_buf = BytesIO()
            plt.savefig(img_buf, format='png', bbox_inches='tight', pad_inches=0)
            img_buf.seek(0)
            plt.close()
            
            logger.info(f"Successfully saved word cloud visualization to: {self.output_dir}")
            return img_path
        
        except Exception as e:
            logger.error(f"Error creating word cloud visualization: {str(e)}")
            raise
    
    def run_keyword_extraction(self, data_path, top_n=5):
        """
        Run the complete keyword extraction pipeline.
        
        Args:
            data_path: Path to the preprocessed data
            top_n: Number of top keywords to extract per text
            
        Returns:
            Dictionary with paths to all output files
        """
        # Load the data
        data_df = self.load_data(data_path)
        
        # Initialize the model
        self.initialize_model()
        
        # Extract keywords
        result_df = self.extract_keywords_batch(data_df, top_n=top_n)
        
        # Save keyword extraction results
        keyword_results_path = self.save_keyword_results(result_df)
        
        # Save word cloud data
        word_cloud_data_path = self.save_word_cloud_data(result_df)
        
        # Create word cloud visualization
        wordcloud_image_path = self.create_word_cloud(result_df)
        
        results = {
            'keyword_df': result_df,
            'keyword_results': keyword_results_path,
            'word_cloud_data': word_cloud_data_path,
            'wordcloud_image': wordcloud_image_path
        }
        
        logger.info("Keyword extraction completed successfully")
        return results

if __name__ == "__main__":
    # Example usage
    keyword_extractor = KeywordExtractor(company_name="inwi")
    
    # Process data from a file using the new data directory structure
    nlp_data_path = Path(__file__).parent.parent.parent / "data" / "processed_data" / "inwi" / "nlp_ready_data.json"
    
    if nlp_data_path.exists():
        results = keyword_extractor.run_keyword_extraction(nlp_data_path)
        print("Keyword extraction results:")
        for key, path in results.items():
            print(f"- {key}: {path}")
        print("\nWord cloud visualization created at:")
        print(results['wordcloud_image'])
    else:
        print(f"Data file not found at: {nlp_data_path}")
        print("Run data_preprocessor.py first to prepare the data.") 