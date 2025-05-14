import os
import sys
import json
import logging
import numpy as np
import pandas as pd
import torch
from pathlib import Path
from typing import List, Dict, Optional, Union, Any
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import matplotlib.pyplot as plt
import plotly.express as px

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """
    Class to perform sentiment analysis on Reddit data using the CardiffNLP twitter-roberta-base-sentiment model.
    """
    
    def __init__(self, output_dir=None, company_name=None):
        """
        Initialize the sentiment analyzer.
        
        Args:
            output_dir: Directory to store sentiment analysis results
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
                self.output_dir = self.nlp_results_dir / company_name / "sentiment"
            else:
                self.output_dir = self.nlp_results_dir / "sentiment"
        else:
            self.output_dir = Path(output_dir)
            if not self.output_dir.is_absolute():
                if company_name:
                    self.output_dir = self.data_dir / output_dir / company_name / "sentiment"
                else:
                    self.output_dir = self.data_dir / output_dir
        
        # Create the output directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.nlp_results_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        
        logger.info(f"Sentiment analysis results will be stored in: {self.output_dir}")
        
        # Initialize model
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.sentiment_labels = {0: "negative", 1: "neutral", 2: "positive"}
    
    def load_data(self, data_path):
        """
        Load data for sentiment analysis.
        
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
        Initialize the sentiment analysis model.
        """
        try:
            # Load model and tokenizer
            model_name = "cardiffnlp/twitter-roberta-base-sentiment"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForSequenceClassification.from_pretrained(model_name)
            self.model.to(self.device)
            
            logger.info(f"Successfully initialized sentiment analysis model on {self.device}")
        
        except Exception as e:
            logger.error(f"Error initializing sentiment analysis model: {str(e)}")
            raise
    
    def analyze_sentiment(self, text):
        """
        Analyze the sentiment of a text.
        
        Args:
            text: Text to analyze
            
        Returns:
            Dictionary with sentiment label and score
        """
        if not text or not isinstance(text, str):
            return {"sentiment": "neutral", "score": 0.5}
        
        if self.model is None or self.tokenizer is None:
            logger.info("Model not initialized. Initializing...")
            self.initialize_model()
        
        try:
            # Truncate text if too long (to avoid exceeding model max length)
            max_length = 512
            if len(text) > max_length * 4:  # Rough character estimate
                text = text[:max_length * 4]
            
            # Tokenize and get sentiment
            inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=max_length).to(self.device)
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            # Get probabilities
            probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
            probs = probs.cpu().numpy()[0]
            
            # Get predicted sentiment
            sentiment_idx = np.argmax(probs)
            sentiment = self.sentiment_labels[sentiment_idx]
            score = float(probs[sentiment_idx])
            
            return {"sentiment": sentiment, "score": score}
        
        except Exception as e:
            logger.warning(f"Error analyzing sentiment for text: {str(e)}")
            return {"sentiment": "neutral", "score": 0.5}
    
    def analyze_batch(self, texts, batch_size=16):
        """
        Analyze sentiment for a batch of texts.
        
        Args:
            texts: List of texts to analyze
            batch_size: Size of batches for processing
            
        Returns:
            List of sentiment results (dictionaries with sentiment and score)
        """
        if self.model is None or self.tokenizer is None:
            logger.info("Model not initialized. Initializing...")
            self.initialize_model()
        
        results = []
        
        for i in range(0, len(texts), batch_size):
            batch_texts = texts[i:i+batch_size]
            batch_results = [self.analyze_sentiment(text) for text in batch_texts]
            results.extend(batch_results)
            
            if (i + batch_size) % 100 == 0 or i + batch_size >= len(texts):
                logger.info(f"Processed {min(i + batch_size, len(texts))}/{len(texts)} texts")
        
        return results
    
    def analyze_data(self, data_df):
        """
        Analyze sentiment for all texts in the data.
        
        Args:
            data_df: DataFrame with texts to analyze
            
        Returns:
            DataFrame with sentiment analysis results
        """
        # Create a copy of the input DataFrame
        result_df = data_df.copy()
        
        # Get a list of all texts
        texts = result_df['text'].tolist()
        
        # Analyze sentiment
        logger.info(f"Analyzing sentiment for {len(texts)} texts")
        sentiment_results = self.analyze_batch(texts)
        
        # Add sentiment results to the DataFrame
        result_df['sentiment'] = [result['sentiment'] for result in sentiment_results]
        result_df['sentiment_score'] = [result['score'] for result in sentiment_results]
        
        return result_df
    
    def prepare_sentiment_distribution(self, data_df):
        """
        Prepare sentiment distribution data for visualization.
        
        Args:
            data_df: DataFrame with sentiment analysis results
            
        Returns:
            DataFrame with sentiment counts
        """
        # Count the occurrences of each sentiment
        sentiment_counts = data_df['sentiment'].value_counts().reset_index()
        sentiment_counts.columns = ['sentiment', 'count']
        
        return sentiment_counts
    
    def save_sentiment_results(self, data_df, filename="sentiment_results.json"):
        """
        Save sentiment analysis results to a file.
        
        Args:
            data_df: DataFrame with sentiment analysis results
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        # Select relevant columns
        result_df = data_df[['post_id', 'text_type', 'sentiment', 'sentiment_score']]
        
        # Create a list of dictionaries for the API format
        api_format = []
        for _, row in result_df.iterrows():
            api_format.append({
                "post_id": int(row['post_id']),
                "sentiment": row['sentiment'],
                "score": float(row['sentiment_score'])
            })
        
        # Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(api_format, f, indent=2)
        
        logger.info(f"Successfully saved sentiment results to: {output_path}")
        return output_path
    
    def visualize_sentiment_distribution(self, data_df, filename="sentiment_distribution.html"):
        """
        Create a visualization of sentiment distribution.
        
        Args:
            data_df: DataFrame with sentiment analysis results
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        try:
            # Get sentiment distribution
            sentiment_counts = self.prepare_sentiment_distribution(data_df)
            
            # Create a bar chart
            fig = px.bar(
                sentiment_counts, 
                x='sentiment', 
                y='count',
                color='sentiment',
                color_discrete_map={'positive': 'green', 'neutral': 'gray', 'negative': 'red'},
                title='Sentiment Distribution',
                labels={'sentiment': 'Sentiment', 'count': 'Count'},
                template='plotly_white'
            )
            
            # Save to file
            fig.write_html(str(output_path))
            
            logger.info(f"Successfully saved sentiment distribution visualization to: {output_path}")
            return output_path
        
        except Exception as e:
            logger.error(f"Error creating sentiment distribution visualization: {str(e)}")
            raise
    
    def run_sentiment_analysis(self, data_path):
        """
        Run the complete sentiment analysis pipeline.
        
        Args:
            data_path: Path to the preprocessed data
            
        Returns:
            Dictionary with paths to all output files
        """
        # Load the data
        data_df = self.load_data(data_path)
        
        # Initialize the model
        self.initialize_model()
        
        # Analyze sentiment
        result_df = self.analyze_data(data_df)
        
        # Save the results
        results = {}
        results['sentiment_results'] = self.save_sentiment_results(result_df)
        results['sentiment_visualization'] = self.visualize_sentiment_distribution(result_df)
        
        # Save the full results
        output_path = self.output_dir / "documents_with_sentiment.json"
        result_df.to_json(output_path, orient='records', indent=2)
        results['documents_with_sentiment'] = output_path
        
        logger.info("Sentiment analysis complete")
        return results

if __name__ == "__main__":
    # Example usage
    sentiment_analyzer = SentimentAnalyzer(company_name="inwi")
    
    # Process data from a file using the new data directory structure
    nlp_data_path = Path(__file__).parent.parent.parent / "data" / "processed_data" / "inwi" / "nlp_ready_data.json"
    
    if nlp_data_path.exists():
        results = sentiment_analyzer.run_sentiment_analysis(nlp_data_path)
        print("Sentiment analysis results:")
        for key, path in results.items():
            print(f"- {key}: {path}")
    else:
        print(f"Data file not found at: {nlp_data_path}")
        print("Run data_preprocessor.py first to prepare the data.") 