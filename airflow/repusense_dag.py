from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.amazon.aws.operators.s3 import S3CreateBucketOperator
from airflow.providers.amazon.aws.operators.s3 import S3Hook
import os
import sys
import subprocess
import json
from pathlib import Path

# Add the project root to the path
sys.path.append('/path/to/RepuSense')  # Replace with actual path in production

# Import the NLP pipeline
from nlp_pipeline.main import NLPPipeline

# Load configuration from config.json
def load_config():
    config_path = Path(__file__).parent.parent / "config.json"
    
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

config = load_config()

# Default arguments for the DAG
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# S3 configuration
S3_BUCKET = config.get('s3', {}).get('bucket', 'repusense-results')  
S3_REGION = config.get('s3', {}).get('region', 'us-east-1')

# Function to run the pipeline for a company
def run_repusense_pipeline(company_name, **kwargs):
    """
    Run the RepuSense pipeline for a specific company.
    
    Args:
        company_name: Name of the company to analyze
    """
    # Calculate date range for last week
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    # Format dates for the pipeline
    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = end_date.strftime('%Y-%m-%d')
    
    # Initialize the pipeline
    pipeline = NLPPipeline(
        company_name=company_name,
        use_s3=True,
        s3_bucket=S3_BUCKET
    )
    
    # Run the pipeline
    results = pipeline.run_pipeline(
        start_date=start_date_str,
        end_date=end_date_str
    )
    
    return results

# Function to run pipeline for multiple companies
def run_all_companies_pipeline(**kwargs):
    """
    Run the pipeline for all companies in the system.
    """
    # In a real system, this would fetch company names from a database
    # For this example, we'll use a hardcoded list
    companies = ['inwi', 'microsoft', 'apple', 'google', 'amazon']
    
    all_results = {}
    for company in companies:
        try:
            results = run_repusense_pipeline(company)
            all_results[company] = results
        except Exception as e:
            print(f"Error processing company {company}: {str(e)}")
    
    return all_results

# Function to check if any API requests are pending
def check_api_requests(**kwargs):
    """
    Check if there are any pending API requests for company analysis.
    Returns list of companies that need to be processed.
    """
    # In a real system, this would check a database or queue for pending requests
    # For this example, we'll return an empty list (no pending requests)
    return []

# Function to process API requests
def process_api_requests(**kwargs):
    """
    Process pending API requests.
    """
    # Get pending requests
    ti = kwargs['ti']
    pending_requests = ti.xcom_pull(task_ids='check_api_requests')
    
    if not pending_requests:
        print("No pending API requests to process")
        return {}
    
    # Process each request
    results = {}
    for company in pending_requests:
        try:
            company_results = run_repusense_pipeline(company)
            results[company] = company_results
        except Exception as e:
            print(f"Error processing API request for company {company}: {str(e)}")
    
    return results

# Function to verify S3 bucket exists
def ensure_s3_bucket_exists(**kwargs):
    """
    Verify the S3 bucket exists, create it if not.
    """
    s3_hook = S3Hook()
    if not s3_hook.check_for_bucket(S3_BUCKET):
        print(f"Creating S3 bucket: {S3_BUCKET}")
        s3_hook.create_bucket(bucket_name=S3_BUCKET, region_name=S3_REGION)
    else:
        print(f"S3 bucket already exists: {S3_BUCKET}")
    
    return S3_BUCKET

# Define the DAG
dag = DAG(
    'repusense_weekly_pipeline',
    default_args=default_args,
    description='Weekly RepuSense NLP analysis pipeline',
    schedule_interval='0 0 * * 0',  # Run at midnight every Sunday
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=['repusense', 'nlp', 'reddit'],
)

# Task to ensure S3 bucket exists
ensure_bucket_task = PythonOperator(
    task_id='ensure_s3_bucket_exists',
    python_callable=ensure_s3_bucket_exists,
    dag=dag,
)

# Task to run the pipeline for all companies
run_pipeline_task = PythonOperator(
    task_id='run_all_companies_pipeline',
    python_callable=run_all_companies_pipeline,
    dag=dag,
)

# Task to check for API requests
check_api_task = PythonOperator(
    task_id='check_api_requests',
    python_callable=check_api_requests,
    dag=dag,
)

# Task to process any pending API requests
process_api_task = PythonOperator(
    task_id='process_api_requests',
    python_callable=process_api_requests,
    provide_context=True,
    dag=dag,
)

# Define task dependencies
ensure_bucket_task >> run_pipeline_task
ensure_bucket_task >> check_api_task >> process_api_task 