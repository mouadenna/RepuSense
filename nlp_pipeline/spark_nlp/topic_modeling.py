import os
import sys
import json
import logging
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional, Union, Any
from bertopic import BERTopic
from sklearn.feature_extraction.text import CountVectorizer
from sentence_transformers import SentenceTransformer
import matplotlib.pyplot as plt
import plotly.express as px
from azure.ai.inference import EmbeddingsClient
from azure.core.credentials import AzureKeyCredential
from transformers import pipeline

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AzureEmbeddingsBackend:
    """
    Azure embeddings backend for BERTopic that wraps the interface BERTopic expects.
    This implementation specifically follows BERTopic's expected interface.
    """
    
    def __init__(self):
        """Initialize the Azure embeddings backend"""
        try:
            # Load config
            config_path = Path(__file__).parent.parent.parent / "config.json"
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            # Get API key - first try environment variables, then config
            token = os.environ.get("GITHUB_TOKEN")
            if not token and "azure" in config and "api_key" in config["azure"]:
                token = config["azure"]["api_key"]
            
            # Get endpoint and model name from config
            endpoint = "https://models.inference.ai.azure.com"
            model_name = "text-embedding-3-small"
            if "azure" in config:
                if "endpoint" in config["azure"]:
                    endpoint = config["azure"]["endpoint"]
                if "model_name" in config["azure"]:
                    model_name = config["azure"]["model_name"]
            
            if not token:
                raise ValueError("Azure API key not found in environment variables or config file")
            
            self.client = EmbeddingsClient(
                endpoint=endpoint,
                credential=AzureKeyCredential(token)
            )
            self.model_name = model_name
            logger.info(f"Successfully initialized Azure embedding model: {model_name} at {endpoint}")
        
        except Exception as e:
            logger.error(f"Error initializing Azure embedding model: {str(e)}")
            raise
    
    def embed(self, documents, verbose=False):
        """
        Create embeddings for a list of documents.
        
        Args:
            documents: List of documents to embed
            verbose: Whether to display progress
            
        Returns:
            numpy.ndarray: Document embeddings
        """
        try:
            # Filter out empty or invalid texts
            valid_documents = [text for text in documents if text and isinstance(text, str) and text.strip()]
            
            if not valid_documents:
                logger.warning("No valid documents found for embedding")
                return np.array([])
            
            if verbose:
                logger.info(f"Sending {len(valid_documents)} documents to Azure embedding API")
            
            # Send all documents at once
            response = self.client.embed(
                input=valid_documents,
                model=self.model_name
            )
            
            # Extract embeddings
            embeddings = [item.embedding for item in response.data]
            
            if verbose:
                logger.info(f"Successfully created embeddings for {len(embeddings)} documents")
                embedding_dim = len(embeddings[0]) if embeddings else 0
                logger.info(f"Embedding dimension: {embedding_dim}")
            
            # Return as numpy array
            return np.array(embeddings)
        
        except Exception as e:
            logger.error(f"Error creating embeddings: {str(e)}")
            raise

class TopicModeler:
    """
    Class to perform topic modeling on Reddit data using BERTopic.
    """
    
    def __init__(self, output_dir=None, company_name=None):
        """
        Initialize the topic modeler.
        
        Args:
            output_dir: Directory to store topic modeling results
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
                self.output_dir = self.nlp_results_dir / company_name / "topics"
            else:
                self.output_dir = self.nlp_results_dir / "topics"
        else:
            self.output_dir = Path(output_dir)
            if not self.output_dir.is_absolute():
                if company_name:
                    self.output_dir = self.data_dir / output_dir / company_name / "topics"
                else:
                    self.output_dir = self.data_dir / output_dir
        
        # Create the output directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.nlp_results_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        
        logger.info(f"Topic modeling results will be stored in: {self.output_dir}")
        
        # Initialize topic modeling components
        self.model = None
    
    def load_data(self, data_path):
        """
        Load data for topic modeling.
        
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
    
    def initialize_model(self, n_topics="auto", min_topic_size=10, nr_topics=None):
        """
        Initialize the BERTopic model.
        
        Args:
            n_topics: 'auto' or number of topics to extract
            min_topic_size: Minimum size of topics
            nr_topics: Number of topics to reduce to after the initial modeling
        """
        try:
            # Check if we should use Azure embeddings
            use_azure = False
            config_path = Path(__file__).parent.parent.parent / "config.json"
            if config_path.exists():
                with open(config_path, 'r') as f:
                    config = json.load(f)
                use_azure = "azure" in config and "api_key" in config["azure"] and config["azure"]["api_key"]
            
            if use_azure:
                logger.info("Using Azure embeddings for topic modeling")
                # Use a fallback SentenceTransformer with the custom Azure embeddings
                embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
                embeddings_backend = AzureEmbeddingsBackend()
                
                # Initialize vectorizer
                vectorizer_model = CountVectorizer(stop_words="english", min_df=2, max_df=0.85, ngram_range=(2,5))
                
                # Initialize BERTopic with custom embedding calculation
                self.model = BERTopic(
                    vectorizer_model=vectorizer_model,
                    min_topic_size=min_topic_size,
                    nr_topics=nr_topics,
                    verbose=True
                )
                
                logger.info("Successfully initialized BERTopic model with Azure embeddings")
                
                # Save the embeddings backend for use in fit_transform
                self.embeddings_backend = embeddings_backend
                self.use_custom_embeddings = True
            else:
                logger.info("Using standard SentenceTransformer for topic modeling")
                # Use standard SentenceTransformer
                embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
                
                # Initialize vectorizer
                vectorizer_model = CountVectorizer(stop_words="english", min_df=2, max_df=0.85, ngram_range=(2,5))
                
                # Initialize BERTopic
                self.model = BERTopic(
                    embedding_model=embedding_model,
                    vectorizer_model=vectorizer_model,
                    min_topic_size=min_topic_size,
                    nr_topics=nr_topics,
                    verbose=True
                )
                
                logger.info("Successfully initialized BERTopic model with SentenceTransformer")
                self.use_custom_embeddings = False
        
        except Exception as e:
            logger.error(f"Error initializing BERTopic model: {str(e)}")
            raise
    
    def fit_transform(self, documents):
        """
        Fit the BERTopic model and transform documents.
        
        Args:
            documents: List of documents to model
            
        Returns:
            Tuple of (topics, probabilities)
        """
        if self.model is None:
            logger.info("Model not initialized. Initializing with default parameters.")
            self.initialize_model()
        
        try:
            if hasattr(self, 'use_custom_embeddings') and self.use_custom_embeddings:
                # Calculate embeddings using Azure
                logger.info("Calculating embeddings using Azure...")
                embeddings = self.embeddings_backend.embed(documents, verbose=True)
                
                # Fit the model with pre-calculated embeddings
                topics, probs = self.model.fit_transform(documents, embeddings=embeddings)
                logger.info(f"Successfully fit BERTopic model on {len(documents)} documents with custom embeddings")
            else:
                # Use the standard BERTopic approach
                topics, probs = self.model.fit_transform(documents)
                logger.info(f"Successfully fit BERTopic model on {len(documents)} documents")
            
            return topics, probs
        
        except Exception as e:
            logger.error(f"Error during topic modeling: {str(e)}")
            raise
    
    def get_topic_info(self):
        """
        Get information about the generated topics.
        
        Returns:
            DataFrame with topic information
        """
        if self.model is None:
            logger.error("Model not initialized or fit. Call initialize_model() and fit_transform() first.")
            raise ValueError("Model not initialized or fit")
        
        return self.model.get_topic_info()
    
    def save_topic_info(self, filename="topic_info.json"):
        """
        Save topic information to a file.
        
        Args:
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        topic_info = self.get_topic_info()
        topic_info.to_json(output_path, orient='records', indent=2)
        
        logger.info(f"Successfully saved topic information to: {output_path}")
        return output_path
    
    def save_topic_keywords(self, filename="topic_keywords.json"):
        """
        Save keywords for each topic to a file.
        
        Args:
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        if self.model is None:
            logger.error("Model not initialized or fit. Call initialize_model() and fit_transform() first.")
            raise ValueError("Model not initialized or fit")
        
        output_path = self.output_dir / filename
        
        # Get topics and their keywords
        topics = {}
        for topic_id in sorted(set(self.model.topics_) - {-1}):  # -1 is the outlier topic
            topics[str(topic_id)] = [word for word, _ in self.model.get_topic(topic_id)]
        
        # Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(topics, f, indent=2)
        
        logger.info(f"Successfully saved topic keywords to: {output_path}")
        return output_path
    
    def prepare_topic_distribution(self):
        """
        Prepare topic distribution data for visualization.
        
        Returns:
            List of dictionaries with topic label and count
        """
        if self.model is None:
            logger.error("Model not initialized or fit. Call initialize_model() and fit_transform() first.")
            raise ValueError("Model not initialized or fit")
        
        # Get topic information and counts
        topic_info = self.get_topic_info()
        
        # Filter out the outlier topic (-1)
        topic_info = topic_info[topic_info['Topic'] != -1]
        
        # Create the topic distribution
        topic_distribution = []
        for _, row in topic_info.iterrows():
            # Get a representative label for the topic
            topic_id = row['Topic']
            topic_words = self.model.get_topic(topic_id)
            topic_label = " & ".join([word for word, _ in topic_words[:3]])
            
            topic_distribution.append({
                'topic': topic_label,
                'count': row['Count']
            })
        
        return topic_distribution
    
    def save_topic_distribution(self, filename="topic_distribution.json"):
        """
        Save topic distribution to a file.
        
        Args:
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        topic_distribution = self.prepare_topic_distribution()
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(topic_distribution, f, indent=2)
        
        logger.info(f"Successfully saved topic distribution to: {output_path}")
        return output_path
    
    def visualize_topics(self, filename="topic_visualization.html"):
        """
        Create an interactive visualization of the topics.
        
        Args:
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        if self.model is None:
            logger.error("Model not initialized or fit. Call initialize_model() and fit_transform() first.")
            raise ValueError("Model not initialized or fit")
        
        output_path = self.output_dir / filename
        
        try:
            # Create an interactive topic visualization
            fig = self.model.visualize_topics()
            fig.write_html(str(output_path))
            
            logger.info(f"Successfully saved topic visualization to: {output_path}")
            return output_path
        
        except Exception as e:
            logger.error(f"Error creating topic visualization: {str(e)}")
            raise
    
    def visualize_barchart(self, filename="topic_barchart.html"):
        """
        Create a bar chart of topic counts.
        
        Args:
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        if self.model is None:
            logger.error("Model not initialized or fit. Call initialize_model() and fit_transform() first.")
            raise ValueError("Model not initialized or fit")
        
        output_path = self.output_dir / filename
        
        try:
            # Get topic distribution
            topic_distribution = self.prepare_topic_distribution()
            
            # Sort by count in descending order
            topic_distribution.sort(key=lambda x: x['count'], reverse=True)
            
            # Create a DataFrame for plotting
            df = pd.DataFrame(topic_distribution)
            
            # Create a bar chart
            fig = px.bar(
                df, 
                x='topic', 
                y='count',
                title='Topic Distribution',
                labels={'topic': 'Topic', 'count': 'Count'},
                template='plotly_white'
            )
            
            # Save to file
            fig.write_html(str(output_path))
            
            logger.info(f"Successfully saved topic bar chart to: {output_path}")
            return output_path
        
        except Exception as e:
            logger.error(f"Error creating topic bar chart: {str(e)}")
            raise
    
    def run_topic_modeling(self, data_path):
        """
        Run the complete topic modeling pipeline.
        
        Args:
            data_path: Path to the preprocessed data
            
        Returns:
            Dictionary with paths to all output files
        """
        # Load the data
        data_df = self.load_data(data_path)
        
        # Extract the documents
        documents = data_df['text'].tolist()
        
        # Initialize and fit the model
        self.initialize_model()
        topics, _ = self.fit_transform(documents)
        
        # Add topic assignments to the data
        data_df['topic'] = topics
        
        # Save the results
        results = {}
        results['topic_info'] = self.save_topic_info()
        results['topic_keywords'] = self.save_topic_keywords()
        results['topic_distribution'] = self.save_topic_distribution()
        results['topic_visualization'] = self.visualize_topics()
        results['topic_barchart'] = self.visualize_barchart()
        
        # Save the data with topic assignments
        output_path = self.output_dir / "documents_with_topics.json"
        data_df.to_json(output_path, orient='records', indent=2)
        results['documents_with_topics'] = output_path
        
        logger.info("Topic modeling complete")
        return results

if __name__ == "__main__":
    # Example usage
    topic_modeler = TopicModeler(company_name="inwi")
    
    # Process data from a file using the new data directory structure
    nlp_data_path = Path(__file__).parent.parent.parent / "data" / "processed_data" / "inwi" / "nlp_ready_data.json"
    
    if nlp_data_path.exists():
        results = topic_modeler.run_topic_modeling(nlp_data_path)
        print("Topic modeling results:")
        for key, path in results.items():
            print(f"- {key}: {path}")
    else:
        print(f"Data file not found at: {nlp_data_path}")
        print("Run data_preprocessor.py first to prepare the data.") 