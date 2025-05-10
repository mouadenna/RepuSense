import os
import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import date, datetime
import sys

from fastapi import FastAPI, HTTPException, Query, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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
API_DATA_DIR = DATA_DIR / "api_data"

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

# Set S3 bucket configuration from config
s3_bucket = config.get('s3', {}).get('bucket', "repusense-results")
request_processor.s3_bucket = s3_bucket

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

# Helper function to load JSON data for a specific company
def load_json_data(filename, company=None):
    if company:
        file_path = API_DATA_DIR / company / filename
    else:
        # Try to find the first available company directory
        for company_dir in API_DATA_DIR.iterdir():
            if company_dir.is_dir():
                file_path = company_dir / filename
                break
        else:
            logger.error(f"No company data found in {API_DATA_DIR}")
            return None
    
    if not file_path.exists():
        logger.error(f"File not found: {file_path}")
        return None
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        logger.error(f"Error loading JSON data from {file_path}: {str(e)}")
        return None

# Helper function to get available companies
def get_available_companies():
    companies = []
    
    # Create API data directory if it doesn't exist yet
    os.makedirs(API_DATA_DIR, exist_ok=True)
    
    for company_dir in API_DATA_DIR.iterdir():
        if company_dir.is_dir():
            # Check if company_info.json exists
            info_file = company_dir / "company_info.json"
            if info_file.exists():
                try:
                    with open(info_file, 'r', encoding='utf-8') as f:
                        company_info = json.load(f)
                    companies.append(company_info)
                except Exception as e:
                    logger.error(f"Error loading company info from {info_file}: {str(e)}")
                    companies.append({"name": company_dir.name})
            else:
                companies.append({"name": company_dir.name})
    return companies

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
    Get list of companies with available analysis data.
    
    Returns:
        List of company information
    """
    companies = get_available_companies()
    if not companies:
        raise HTTPException(status_code=404, detail="No company data found")
    return companies

@app.get("/api/company/{company_name}")
def get_company_info(company_name: str):
    """
    Get information about a specific company.
    
    Args:
        company_name: Name of the company
    
    Returns:
        Company information
    """
    company_info = load_json_data("company_info.json", company_name)
    if company_info is None:
        raise HTTPException(status_code=404, detail=f"Company {company_name} not found")
    return company_info

@app.get("/api/topics")
def get_topics(company: Optional[str] = Query(None, description="Company name filter")):
    """
    Get topic distribution data.
    
    Args:
        company: Optional company name filter
    
    Returns:
        List of topics with their counts
    """
    data = load_json_data("topics.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Topic data not found")
    return data

@app.get("/api/sentiment")
def get_sentiment(company: Optional[str] = Query(None, description="Company name filter")):
    """
    Get sentiment analysis data.
    
    Args:
        company: Optional company name filter
    
    Returns:
        List of post sentiment analysis results
    """
    data = load_json_data("sentiment.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Sentiment data not found")
    return data

@app.get("/api/keywords")
def get_keywords(company: Optional[str] = Query(None, description="Company name filter")):
    """
    Get keyword extraction data.
    
    Args:
        company: Optional company name filter
    
    Returns:
        List of posts with their extracted keywords
    """
    data = load_json_data("keywords.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Keyword data not found")
    return data

@app.get("/api/engagement")
def get_engagement(company: Optional[str] = Query(None, description="Company name filter")):
    """
    Get comment engagement data.
    
    Args:
        company: Optional company name filter
    
    Returns:
        List of posts with their comment counts
    """
    data = load_json_data("engagement.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Engagement data not found")
    return data

@app.get("/api/wordcloud")
def get_wordcloud(company: Optional[str] = Query(None, description="Company name filter")):
    """
    Get word cloud data.
    
    Args:
        company: Optional company name filter
    
    Returns:
        List of words with their frequencies
    """
    data = load_json_data("wordcloud.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Word cloud data not found")
    return data

# Company-specific endpoints
@app.get("/api/company/{company_name}/topics")
def get_company_topics(company_name: str):
    """
    Get topic distribution for a specific company.
    
    Args:
        company_name: Name of the company
    
    Returns:
        List of topics with their counts
    """
    data = load_json_data("topics.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Topic data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/sentiment")
def get_company_sentiment(company_name: str):
    """
    Get sentiment analysis for a specific company.
    
    Args:
        company_name: Name of the company
    
    Returns:
        List of sentiment analysis results
    """
    data = load_json_data("sentiment.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Sentiment data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/keywords")
def get_company_keywords(company_name: str):
    """
    Get keywords for a specific company.
    
    Args:
        company_name: Name of the company
    
    Returns:
        List of keyword extraction results
    """
    data = load_json_data("keywords.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Keyword data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/engagement")
def get_company_engagement(company_name: str):
    """
    Get engagement for a specific company.
    
    Args:
        company_name: Name of the company
    
    Returns:
        List of engagement analysis results
    """
    data = load_json_data("engagement.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Engagement data for company {company_name} not found")
    return data

@app.get("/api/company/{company_name}/wordcloud")
def get_company_wordcloud(company_name: str):
    """
    Get word cloud for a specific company.
    
    Args:
        company_name: Name of the company
    
    Returns:
        List of words with their frequencies
    """
    data = load_json_data("wordcloud.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Word cloud data for company {company_name} not found")
    return data

# Post-specific endpoints
@app.get("/api/company/{company_name}/post/{post_id}/sentiment")
def get_post_sentiment(company_name: str, post_id: int):
    """
    Get sentiment for a specific post.
    
    Args:
        company_name: Name of the company
        post_id: ID of the post
    
    Returns:
        Sentiment analysis result for the post
    """
    data = load_json_data("sentiment.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Sentiment data for company {company_name} not found")
    
    for item in data:
        if item.get("post_id") == post_id:
            return item
    
    raise HTTPException(status_code=404, detail=f"Sentiment data for post {post_id} not found")

@app.get("/api/company/{company_name}/post/{post_id}/keywords")
def get_post_keywords(company_name: str, post_id: int):
    """
    Get keywords for a specific post.
    
    Args:
        company_name: Name of the company
        post_id: ID of the post
    
    Returns:
        Keywords for the post
    """
    data = load_json_data("keywords.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Keyword data for company {company_name} not found")
    
    for item in data:
        if item.get("post_id") == post_id:
            return item
    
    raise HTTPException(status_code=404, detail=f"Keyword data for post {post_id} not found")

@app.get("/api/company/{company_name}/post/{post_id}/engagement")
def get_post_engagement(company_name: str, post_id: int):
    """
    Get engagement for a specific post.
    
    Args:
        company_name: Name of the company
        post_id: ID of the post
    
    Returns:
        Engagement data for the post
    """
    data = load_json_data("engagement.json", company_name)
    if data is None:
        raise HTTPException(status_code=404, detail=f"Engagement data for company {company_name} not found")
    
    for item in data:
        if item.get("post_id") == post_id:
            return item
    
    raise HTTPException(status_code=404, detail=f"Engagement data for post {post_id} not found")

# Analysis request endpoints
@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_company(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Trigger analysis for a company.
    
    Args:
        request: Analysis request details
    
    Returns:
        Request status
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
        # For non-async requests, process in background task
        background_tasks.add_task(
            process_analysis_request_task,
            request
        )
        
        # Return immediate response with scheduled status
        status = {
            'request_id': f"{request.company}_{request.start_date or 'default'}_{request.end_date or 'default'}",
            'status': 'processing',
            'company': request.company,
            'timestamp': datetime.now().isoformat()
        }
    
    return status

@app.get("/api/analyze/{request_id}")
def get_analysis_status(request_id: str):
    """
    Get status of an analysis request.
    
    Args:
        request_id: ID of the request
    
    Returns:
        Request status
    """
    status = request_processor.get_request_status(request_id)
    if status['status'] == 'unknown':
        raise HTTPException(status_code=404, detail=f"Analysis request {request_id} not found")
    
    return status

@app.get("/api/requests")
def list_analysis_requests(company: Optional[str] = Query(None), limit: int = Query(10, gt=0, lt=100)):
    """
    List recent analysis requests.
    
    Args:
        company: Filter by company (optional)
        limit: Maximum number of requests to return
    
    Returns:
        List of requests
    """
    return request_processor.list_requests(company=company, limit=limit)

# Legacy endpoints for backward compatibility
@app.get("/api/post/{post_id}/sentiment")
def get_legacy_post_sentiment(post_id: int, company: Optional[str] = Query(None)):
    """
    Get sentiment for a specific post (legacy endpoint).
    
    Args:
        post_id: ID of the post
        company: Optional company name filter
    
    Returns:
        Sentiment analysis result for the post
    """
    data = load_json_data("sentiment.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Sentiment data not found")
    
    for item in data:
        if item.get("post_id") == post_id:
            return item
    
    raise HTTPException(status_code=404, detail=f"Sentiment data for post {post_id} not found")

@app.get("/api/post/{post_id}/keywords")
def get_legacy_post_keywords(post_id: int, company: Optional[str] = Query(None)):
    """
    Get keywords for a specific post (legacy endpoint).
    
    Args:
        post_id: ID of the post
        company: Optional company name filter
    
    Returns:
        Keywords for the post
    """
    data = load_json_data("keywords.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Keyword data not found")
    
    for item in data:
        if item.get("post_id") == post_id:
            return item
    
    raise HTTPException(status_code=404, detail=f"Keyword data for post {post_id} not found")

@app.get("/api/post/{post_id}/engagement")
def get_legacy_post_engagement(post_id: int, company: Optional[str] = Query(None)):
    """
    Get engagement for a specific post (legacy endpoint).
    
    Args:
        post_id: ID of the post
        company: Optional company name filter
    
    Returns:
        Engagement data for the post
    """
    data = load_json_data("engagement.json", company)
    if data is None:
        raise HTTPException(status_code=404, detail="Engagement data not found")
    
    for item in data:
        if item.get("post_id") == post_id:
            return item
    
    raise HTTPException(status_code=404, detail=f"Engagement data for post {post_id} not found")

# Process a company synchronously
@app.post("/api/v1/analyze")
def analyze_company_v1(
    company: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Analyze a company's reputation on Reddit.
    
    - **company**: Name of the company to analyze
    - **start_date**: Start date in YYYY-MM-DD format (optional)
    - **end_date**: End date in YYYY-MM-DD format (optional)
    """
    try:
        result = request_processor.process_request_sync(
            company=company,
            start_date=start_date,
            end_date=end_date
        )
        return result
    except Exception as e:
        logger.error(f"Error analyzing company {company}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Schedule a company analysis
@app.post("/api/v1/schedule")
def schedule_analysis_v1(
    company: str,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Schedule a company reputation analysis.
    
    - **company**: Name of the company to analyze
    - **start_date**: Start date in YYYY-MM-DD format (optional)
    - **end_date**: End date in YYYY-MM-DD format (optional)
    """
    try:
        result = request_processor.process_request_async(
            company=company,
            start_date=start_date,
            end_date=end_date
        )
        return result
    except Exception as e:
        logger.error(f"Error scheduling analysis for company {company}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get request status
@app.get("/api/v1/status/{request_id}")
def get_status_v1(request_id: str):
    """
    Get the status of a request.
    
    - **request_id**: ID of the request to check
    """
    try:
        result = request_processor.get_request_status(request_id)
        return result
    except Exception as e:
        logger.error(f"Error getting status for request {request_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# List requests
@app.get("/api/v1/requests")
def list_requests_v1(
    company: Optional[str] = None,
    limit: int = Query(10, gt=0, le=100)
):
    """
    List recent requests.
    
    - **company**: Filter by company (optional)
    - **limit**: Maximum number of requests to return (1-100)
    """
    try:
        result = request_processor.list_requests(company=company, limit=limit)
        return result
    except Exception as e:
        logger.error(f"Error listing requests: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Get configuration
@app.get("/api/v1/config")
def get_config():
    """
    Get the API configuration.
    """
    return {
        "s3_bucket": s3_bucket,
        "s3_enabled": True,
        "api_version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    
    # Check if API data directory exists
    if not API_DATA_DIR.exists():
        logger.warning(f"API data directory not found: {API_DATA_DIR}")
        logger.warning("Run the NLP pipeline first to generate the API data")
    
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=8000) 