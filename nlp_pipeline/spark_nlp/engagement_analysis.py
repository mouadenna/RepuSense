import os
import sys
import json
import logging
import pandas as pd
from pathlib import Path
from typing import List, Dict, Optional, Union, Any
import plotly.express as px

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EngagementAnalyzer:
    """
    Class to analyze comment engagement for Reddit posts.
    """
    
    def __init__(self, output_dir=None, company_name=None):
        """
        Initialize the engagement analyzer.
        
        Args:
            output_dir: Directory to store engagement analysis results
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
                self.output_dir = self.nlp_results_dir / company_name / "engagement"
            else:
                self.output_dir = self.nlp_results_dir / "engagement"
        else:
            self.output_dir = Path(output_dir)
            if not self.output_dir.is_absolute():
                if company_name:
                    self.output_dir = self.data_dir / output_dir / company_name / "engagement"
                else:
                    self.output_dir = self.data_dir / output_dir
        
        # Create the output directories if they don't exist
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(self.nlp_results_dir, exist_ok=True)
        os.makedirs(self.output_dir, exist_ok=True)
        
        logger.info(f"Engagement analysis results will be stored in: {self.output_dir}")
    
    def load_data(self, data_path):
        """
        Load data for engagement analysis.
        
        Args:
            data_path: Path to the preprocessed posts data
            
        Returns:
            DataFrame with posts and their comments
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
            logger.info(f"Number of posts loaded: {len(data_df)}")
            
            # Ensure required columns are present
            required_cols = ['post_id', 'post_text', 'comments', 'comment_count']
            for col in required_cols:
                if col not in data_df.columns:
                    logger.error(f"Required column '{col}' not found in data")
                    raise ValueError(f"Required column '{col}' not found in data")
            
            return data_df
        
        except Exception as e:
            logger.error(f"Error loading data: {str(e)}")
            raise
    
    def analyze_engagement(self, data_df):
        """
        Analyze comment engagement for posts.
        
        Args:
            data_df: DataFrame with posts and their comments
            
        Returns:
            DataFrame with engagement analysis
        """
        # Create a copy of the input DataFrame with relevant columns
        result_df = data_df[['post_id', 'post_text', 'comment_count']].copy()
        
        # Sort by comment count in descending order
        result_df = result_df.sort_values('comment_count', ascending=False).reset_index(drop=True)
        
        # Add rank based on comment count
        result_df['rank'] = result_df.index + 1
        
        logger.info(f"Successfully analyzed engagement for {len(result_df)} posts")
        return result_df
    
    def save_engagement_results(self, data_df, filename="engagement_results.json"):
        """
        Save engagement analysis results to a file.
        
        Args:
            data_df: DataFrame with engagement analysis results
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        # Create a list of dictionaries for the API format
        api_format = []
        for _, row in data_df.iterrows():
            api_format.append({
                "post_id": int(row['post_id']),
                "comment_count": int(row['comment_count'])
            })
        
        # Save to file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(api_format, f, indent=2)
        
        logger.info(f"Successfully saved engagement results to: {output_path}")
        return output_path
    
    def visualize_top_engaged_posts(self, data_df, top_n=20, filename="top_engaged_posts.html"):
        """
        Create a visualization of the top engaged posts.
        
        Args:
            data_df: DataFrame with engagement analysis results
            top_n: Number of top engaged posts to show
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        try:
            # Select top N posts
            top_posts = data_df.head(top_n).copy()
            
            # Truncate post text for display
            top_posts['post_text_short'] = top_posts['post_text'].apply(
                lambda x: x[:50] + '...' if len(x) > 50 else x
            )
            
            # Create a bar chart
            fig = px.bar(
                top_posts, 
                x='post_id', 
                y='comment_count',
                title=f'Top {top_n} Engaged Posts',
                labels={'post_id': 'Post ID', 'comment_count': 'Comment Count'},
                hover_data=['post_text_short'],
                template='plotly_white'
            )
            
            # Save to file
            fig.write_html(str(output_path))
            
            logger.info(f"Successfully saved top engaged posts visualization to: {output_path}")
            return output_path
        
        except Exception as e:
            logger.error(f"Error creating top engaged posts visualization: {str(e)}")
            raise
    
    def visualize_engagement_distribution(self, data_df, filename="engagement_distribution.html"):
        """
        Create a visualization of the engagement distribution.
        
        Args:
            data_df: DataFrame with engagement analysis results
            filename: Name for the output file
            
        Returns:
            Path to the saved file
        """
        output_path = self.output_dir / filename
        
        try:
            # Create a histogram
            fig = px.histogram(
                data_df, 
                x='comment_count',
                title='Engagement Distribution',
                labels={'comment_count': 'Comment Count'},
                template='plotly_white',
                nbins=20
            )
            
            # Save to file
            fig.write_html(str(output_path))
            
            logger.info(f"Successfully saved engagement distribution visualization to: {output_path}")
            return output_path
        
        except Exception as e:
            logger.error(f"Error creating engagement distribution visualization: {str(e)}")
            raise
    
    def run_engagement_analysis(self, data_path):
        """
        Run the complete engagement analysis pipeline.
        
        Args:
            data_path: Path to the preprocessed posts data
            
        Returns:
            Dictionary with paths to all output files
        """
        # Load the data
        data_df = self.load_data(data_path)
        
        # Analyze engagement
        result_df = self.analyze_engagement(data_df)
        
        # Save the results
        results = {}
        results['engagement_results'] = self.save_engagement_results(result_df)
        results['top_engaged_posts'] = self.visualize_top_engaged_posts(result_df)
        results['engagement_distribution'] = self.visualize_engagement_distribution(result_df)
        
        # Save the full results
        output_path = self.output_dir / "engagement_analysis.json"
        result_df.to_json(output_path, orient='records', indent=2)
        results['engagement_analysis'] = output_path
        
        logger.info("Engagement analysis complete")
        return results

if __name__ == "__main__":
    # Example usage
    engagement_analyzer = EngagementAnalyzer(company_name="inwi")
    
    # Process data from a file using the new data directory structure
    processed_data_path = Path(__file__).parent.parent.parent / "data" / "processed_data" / "inwi" / "processed_posts.json"
    
    if processed_data_path.exists():
        results = engagement_analyzer.run_engagement_analysis(processed_data_path)
        print("Engagement analysis results:")
        for key, path in results.items():
            print(f"- {key}: {path}")
    else:
        print(f"Data file not found at: {processed_data_path}")
        print("Run data_preprocessor.py first to prepare the data.") 