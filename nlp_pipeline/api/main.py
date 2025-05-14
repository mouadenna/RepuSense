import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import date, datetime
import sys
import boto3
from botocore.exceptions import ClientError

from fastapi import FastAPI, HTTPException, Query, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel

# Import the request processor
from nlp_pipeline.api.process_request import request_processor

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

# Define the base directory
BASE_DIR = Path(__file__).parent.parent.parent
DATA_DIR = BASE_DIR / "data"
NLP_RESULTS_DIR = DATA_DIR / "nlp_results"

# Load configuration
def load_config():
    config_path = BASE_DIR / "config.json"
    
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

config = load_config()

# S3 configuration
S3_BUCKET = config.get('s3', {}).get('bucket', "repusense-results")
S3_REGION = config.get('s3', {}).get('region', "us-east-1")

# Initialize S3 client
try:
    s3_client = boto3.client('s3', region_name=S3_REGION)
    logger.info(f"S3 client initialized for bucket: {S3_BUCKET}")
except Exception as e:
    logger.error(f"Error initializing S3 client: {str(e)}")
    s3_client = None

# Create FastAPI app
app = FastAPI(
    title="RepuSense API",
    description="API for RepuSense NLP Pipeline",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set S3 bucket configuration for request processor
request_processor.s3_bucket = S3_BUCKET

# Define data models
class CompanyInfo(BaseModel):
    name: str
    analysis_timestamp: str
    data_sources: List[str]

class TopicItem(BaseModel):
    topic: str
    count: int

class SentimentItem(BaseModel):
    post_id: int
    sentiment: str
    score: float

class KeywordItem(BaseModel):
    post_id: int
    keywords: List[str]

class EngagementItem(BaseModel):
    post_id: int
    comment_count: int

class WordCloudItem(BaseModel):
    word: str
    frequency: int

class AnalysisRequest(BaseModel):
    company: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    keyword: Optional[str] = None
    async_processing: bool = False

class AnalysisResponse(BaseModel):
    request_id: str
    status: str
    company: str
    timestamp: str

# Helper function to load data from S3
def load_s3_json(s3_key):
    """Load JSON data from S3 bucket."""
    if not s3_client:
        logger.error("S3 client not initialized")
        return None
    
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=s3_key)
        content = response['Body'].read().decode('utf-8')
        return json.loads(content)
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == 'NoSuchKey':
            logger.info(f"File not found in S3: {s3_key}")
        else:
            logger.error(f"Error loading S3 file {s3_key}: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Error loading S3 file {s3_key}: {str(e)}")
        return None

# Helper function to get an image from S3
def get_s3_image(s3_key):
    """Get image data from S3 bucket."""
    if not s3_client:
        logger.error("S3 client not initialized")
        return None
    
    try:
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=s3_key)
        return response['Body'].read()
    except ClientError as e:
        error_code = e.response.get('Error', {}).get('Code')
        if error_code == 'NoSuchKey':
            logger.info(f"Image not found in S3: {s3_key}")
        else:
            logger.error(f"Error loading S3 image {s3_key}: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Error loading S3 image {s3_key}: {str(e)}")
        return None

# Helper function to load JSON data for a specific company
def load_json_data(filename, company=None):
    """
    Load data for a company, prioritizing S3 over local files.
    """
    result = None
    
    if company:
        # Try to load from S3 first
        s3_prefix = f"data/nlp_results/{company}/"
        
        if filename == "topics.json":
            s3_key = f"{s3_prefix}topics/topic_distribution.json"
            result = load_s3_json(s3_key)
        elif filename == "sentiment.json":
            s3_key = f"{s3_prefix}sentiment/sentiment_results.json"
            result = load_s3_json(s3_key)
        elif filename == "keywords.json":
            s3_key = f"{s3_prefix}keywords/keyword_results.json"
            result = load_s3_json(s3_key)
        elif filename == "engagement.json":
            s3_key = f"{s3_prefix}engagement/engagement_results.json"
            result = load_s3_json(s3_key)
        elif filename == "wordcloud.json":
            s3_key = f"{s3_prefix}keywords/word_cloud_data.json"
            result = load_s3_json(s3_key)
        elif filename == "company_info.json":
            # Create company info on the fly
            result = {
                "name": company,
                "analysis_timestamp": datetime.now().isoformat(),
                "data_sources": ["Reddit"]
            }
        
        # If not found in S3, fall back to local directory as backup
        if result is None:
            logger.info(f"Data not found in S3, checking local directory for {company}/{filename}")
            file_mapping = {
                "topics.json": NLP_RESULTS_DIR / company / "topics" / "topic_distribution.json",
                "sentiment.json": NLP_RESULTS_DIR / company / "sentiment" / "sentiment_results.json",
                "keywords.json": NLP_RESULTS_DIR / company / "keywords" / "keyword_results.json",
                "engagement.json": NLP_RESULTS_DIR / company / "engagement" / "engagement_results.json",
                "wordcloud.json": NLP_RESULTS_DIR / company / "keywords" / "word_cloud_data.json"
            }
            
            if filename in file_mapping:
                result = _try_load_json(file_mapping[filename])
    else:
        # Try to find the first available company
        try:
            # List all companies in S3
            if s3_client:
                response = s3_client.list_objects_v2(
                    Bucket=S3_BUCKET,
                    Prefix='data/nlp_results/',
                    Delimiter='/'
                )
                
                if 'CommonPrefixes' in response:
                    for prefix in response['CommonPrefixes']:
                        company_path = prefix['Prefix']
                        company_name = company_path.split('/')[-2] if company_path.endswith('/') else company_path.split('/')[-1]
                        
                        if company_name:
                            result = load_json_data(filename, company_name)
                            if result:
                                break
        except Exception as e:
            logger.error(f"Error listing companies in S3: {str(e)}")
        
        # If not found in S3, check local directory
        if result is None:
            for company_dir in NLP_RESULTS_DIR.iterdir():
                if company_dir.is_dir():
                    result = load_json_data(filename, company_dir.name)
                    if result:
                        break
    
    return result

# Helper function to try loading a JSON file locally
def _try_load_json(file_path):
    if not file_path.exists():
        logger.info(f"File not found: {file_path}")
        return None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info(f"Successfully loaded data from {file_path}")
        return data
    except Exception as e:
        logger.error(f"Error loading JSON data from {file_path}: {str(e)}")
        return None

# Helper function to get available companies
def get_available_companies():
    """Get list of available companies, prioritizing S3."""
    companies = []
    
    # Try to get companies from S3 first
    if s3_client:
        try:
            response = s3_client.list_objects_v2(
                Bucket=S3_BUCKET,
                Prefix='data/nlp_results/',
                Delimiter='/'
            )
            
            if 'CommonPrefixes' in response:
                for prefix in response['CommonPrefixes']:
                    company_path = prefix['Prefix']
                    company_name = company_path.split('/')[-2] if company_path.endswith('/') else company_path.split('/')[-1]
                    
                    if company_name:
                        companies.append({
                            "name": company_name,
                            "analysis_timestamp": datetime.now().isoformat(),
                            "data_sources": ["Reddit"],
                            "source": "S3"
                        })
                
                logger.info(f"Found {len(companies)} companies in S3")
                return companies
        except Exception as e:
            logger.error(f"Error listing companies in S3: {str(e)}")
    
    # Fall back to local directory if S3 failed or returned no results
    if not companies:
        for company_dir in NLP_RESULTS_DIR.iterdir():
            if company_dir.is_dir():
                companies.append({
                    "name": company_dir.name,
                    "analysis_timestamp": datetime.now().isoformat(),
                    "data_sources": ["Reddit"],
                    "source": "local"
                })
        
        logger.info(f"Found {len(companies)} companies in local directory")
    
    return companies

# API Routes
@app.get("/")
def read_root():
    return {
        "name": "RepuSense API",
        "description": "API for Reddit reputation analysis",
        "version": "1.0.0"
    }

@app.get("/api/companies")
def get_companies():
    """
    Get the list of available analyzed companies.
    """
    return get_available_companies()

@app.get("/api/company/{company_name}")
def get_company_info(company_name: str):
    """
    Get information about a specific company.
    """
    company_info = load_json_data("company_info.json", company_name)
    if company_info is None:
        raise HTTPException(status_code=404, detail=f"Company {company_name} not found")
    return company_info

@app.get("/api/company/{company_name}/topics")
def get_company_topics(company_name: str):
    """
    Get topic distribution for a specific company.
    """
    data = load_json_data("topics.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Topic data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/sentiment")
def get_company_sentiment(company_name: str):
    """
    Get sentiment analysis for a specific company.
    """
    data = load_json_data("sentiment.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Sentiment data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/keywords")
def get_company_keywords(company_name: str):
    """
    Get keywords for a specific company.
    """
    data = load_json_data("keywords.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Keyword data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/engagement")
def get_company_engagement(company_name: str):
    """
    Get engagement for a specific company.
    """
    data = load_json_data("engagement.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Engagement data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/wordcloud")
def get_company_wordcloud(company_name: str):
    """
    Get word cloud for a specific company.
    """
    data = load_json_data("wordcloud.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Word cloud data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/wordcloud-image")
def get_company_wordcloud_image(company_name: str):
    """
    Get word cloud image for a specific company.
    """
    # Try S3 first
    s3_key = f"data/nlp_results/{company_name}/keywords/wordcloud.png"
    image_data = get_s3_image(s3_key)
    
    if image_data:
        return Response(content=image_data, media_type="image/png")
    
    # Fall back to local file if not found in S3
    image_path = NLP_RESULTS_DIR / company_name / "keywords" / "wordcloud.png"
    if not image_path.exists():
        raise HTTPException(status_code=404, detail=f"Word cloud image for company {company_name} not found")
    
    return FileResponse(image_path, media_type="image/png")

@app.get("/api/company/{company_name}/topics/visualization-html")
def get_company_topic_visualization_html(company_name: str):
    """
    Get the HTML visualization file for company topics.
    """
    # Try S3 first
    s3_key = f"data/nlp_results/{company_name}/topics/topic_visualization.html"
    html_content_data = get_s3_image(s3_key)
    
    if html_content_data:
        html_content = html_content_data.decode('utf-8')
        return HTMLResponse(content=html_content, status_code=200)
    
    # Fall back to local file if not found in S3
    visualization_path = NLP_RESULTS_DIR / company_name / "topics" / "topic_visualization.html"
    
    if not visualization_path.exists():
        raise HTTPException(status_code=404, detail=f"Topic visualization for {company_name} not found")
    
    try:
        with open(visualization_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        return HTMLResponse(content=html_content, status_code=200)
    except Exception as e:
        logger.error(f"Error reading topic visualization HTML: {str(e)}")
        raise HTTPException(status_code=500, detail="Error reading visualization file")

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_company(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Trigger analysis for a company.
    """
    # Convert date objects to strings
    start_date = request.start_date.isoformat() if request.start_date else None
    end_date = request.end_date.isoformat() if request.end_date else None
    
    if request.async_processing:
        # Schedule asynchronous processing
        status = request_processor.process_request_async(
            company=request.company,
            start_date=start_date,
            end_date=end_date,
            keyword=request.keyword
        )
    else:
        # Create a placeholder request ID for immediate response
        request_id = f"{request.company}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # For non-async requests, process in background task
        background_tasks.add_task(
            process_analysis_request_task,
            request
        )
        
        # Return immediate response with processing status
        status = {
            'request_id': request_id,
            'status': 'processing',
            'company': request.company,
            'timestamp': datetime.now().isoformat()
        }
        
        # Store in the request processor's memory
        request_processor.requests[request_id] = status
    
    return status

# Background task to process analysis request
def process_analysis_request_task(request: AnalysisRequest):
    # Convert date objects to strings
    start_date = request.start_date.isoformat() if request.start_date else None
    end_date = request.end_date.isoformat() if request.end_date else None
    
    # Process the request
    request_processor.process_request_sync(
        company=request.company,
        start_date=start_date,
        end_date=end_date,
        keyword=request.keyword
    )

@app.get("/api/analyze/{request_id}")
def get_analysis_status(request_id: str):
    """
    Get status of an analysis request.
    """
    status = request_processor.get_request_status(request_id)
    if status['status'] == 'unknown':
        raise HTTPException(status_code=404, detail=f"Analysis request {request_id} not found")
    
    return status

@app.get("/api/recommendations")
def get_recommendations(company: str):
    """
    Get recommendations for a company.
    """
    recommendations = [
        {
            "id": 1,
            "type": "high",
            "title": "Improve customer service response time",
            "description": "Analysis shows that customers frequently complain about slow response times. Consider implementing a faster response protocol for customer support channels.",
            "impact_score": 85,
            "related_topics": ["customer service", "support", "response time"],
            "sentiment_impact": {
                "current": -0.32,
                "potential": 0.15
            }
        },
        {
            "id": 2,
            "type": "medium",
            "title": "Highlight positive product features in marketing",
            "description": "Customers frequently praise specific product features that aren't prominently featured in current marketing. Consider highlighting these features in upcoming campaigns.",
            "impact_score": 72,
            "related_topics": ["marketing", "product features", "advertising"],
            "sentiment_impact": {
                "current": 0.05,
                "potential": 0.25
            }
        },
        {
            "id": 3,
            "type": "high",
            "title": "Address pricing concerns on premium plans",
            "description": "Significant negative sentiment is associated with premium plan pricing. Consider reviewing competitive pricing or better communicating value proposition.",
            "impact_score": 79,
            "related_topics": ["pricing", "premium plans", "subscription"],
            "sentiment_impact": {
                "current": -0.41,
                "potential": 0.10
            }
        },
        {
            "id": 4,
            "type": "low",
            "title": "Enhance mobile app user experience",
            "description": "Users report various usability issues with the mobile application. Consider conducting usability testing and implementing UX improvements.",
            "impact_score": 63,
            "related_topics": ["mobile app", "user experience", "usability"],
            "sentiment_impact": {
                "current": -0.18,
                "potential": 0.22
            }
        },
        {
            "id": 5,
            "type": "medium",
            "title": "Improve product documentation and tutorials",
            "description": "Analysis shows that users struggle with understanding product features due to insufficient documentation. Creating better guides and tutorials could help adoption.",
            "impact_score": 68,
            "related_topics": ["documentation", "tutorials", "user education"],
            "sentiment_impact": {
                "current": -0.12,
                "potential": 0.30
            }
        }
    ]
    
    return {"recommendations": recommendations}

@app.get("/api/alerts")
def get_alerts(company: str):
    """
    Get alerts for a company.
    """
    alerts = [
        {
            "id": 1,
            "severity": "critical",
            "title": "Significant increase in negative sentiment",
            "description": "There has been a 35% increase in negative sentiment about your brand in the last 48 hours, primarily regarding recent service outages.",
            "source": "Reddit",
            "created_at": "2023-12-02T09:15:23Z",
            "status": "active"
        },
        {
            "id": 2,
            "severity": "high",
            "title": "Potential PR crisis emerging",
            "description": "Multiple news outlets are reporting on allegations about your company's environmental practices. This is gaining traction across social media.",
            "source": "News Articles",
            "created_at": "2023-12-01T16:42:11Z",
            "status": "active"
        },
        {
            "id": 3,
            "severity": "medium",
            "title": "Competitor campaign gaining attention",
            "description": "Your main competitor's new marketing campaign is receiving positive engagement and mentions have increased by 62% this week.",
            "source": "News Articles",
            "created_at": "2023-11-30T14:20:45Z",
            "status": "active"
        },
        {
            "id": 4,
            "severity": "low",
            "title": "Feature request trend identified",
            "description": "There's a growing trend of customers requesting a specific feature enhancement for your mobile application across multiple platforms.",
            "source": "Reddit",
            "created_at": "2023-11-28T11:05:32Z",
            "status": "resolved"
        },
        {
            "id": 5,
            "severity": "high",
            "title": "Security concern being discussed",
            "description": "Technical users are discussing a potential security vulnerability in your product on specialized forums and Reddit threads.",
            "source": "Reddit",
            "created_at": "2023-12-03T08:35:17Z",
            "status": "active"
        }
    ]
    
    return {"alerts": alerts}

@app.get("/api/company/{company_name}/data-sources")
def get_company_data_sources(company_name: str):
    """
    Get data sources for a specific company.
    """
    # Dummy data for data sources
    data_sources = [
        {
            "name": "Reddit",
            "post_count": 237,
            "comment_count": 1582,
            "sentiment_distribution": {
                "positive": 45,
                "neutral": 30,
                "negative": 25
            },
            "last_updated": "2023-12-01T12:00:00Z"
        },
        {
            "name": "News Articles",
            "post_count": 87,
            "comment_count": 342,
            "sentiment_distribution": {
                "positive": 52,
                "neutral": 33,
                "negative": 15
            },
            "last_updated": "2023-12-03T15:45:00Z"
        }
    ]
    
    return data_sources

@app.get("/api/company/{company_name}/content-stats")
def get_company_content_stats(company_name: str):
    """
    Get content statistics for a specific company.
    """
    # Reuse data from data sources to calculate totals (Reddit and News Articles)
    data_sources = get_company_data_sources(company_name)
    
    # Calculate total posts, articles, and comments
    total_posts = sum(source["post_count"] for source in data_sources if "post_count" in source)
    total_comments = sum(source["comment_count"] for source in data_sources if "comment_count" in source)
    
    # Get articles count (from News Articles source)
    articles_source = next((source for source in data_sources if source["name"] == "News Articles"), None)
    total_articles = articles_source["post_count"] if articles_source else 0
    
    # Calculate total social media posts (from Reddit)
    social_posts = total_posts - total_articles
    
    return {
        "total_content": total_posts + total_comments,
        "posts": social_posts,
        "articles": total_articles,
        "comments": total_comments,
        "by_source": {source["name"]: source["post_count"] + source["comment_count"] for source in data_sources}
    }

if __name__ == "__main__":
    import uvicorn
    
    # Check if NLP results directory exists
    if not NLP_RESULTS_DIR.exists():
        logger.warning(f"NLP results directory not found: {NLP_RESULTS_DIR}")
        logger.warning("Run the NLP pipeline first to generate results")
    
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8000) 


