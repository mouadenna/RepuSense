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
    Gets company names from existing folders in S3 at s3://repusense-results/data/nlp_results/
    """
    companies = []
    
    # Get companies from S3
    try:
        s3_hook = S3Hook()
        if not s3_hook.check_for_bucket(S3_BUCKET):
            print(f"S3 bucket {S3_BUCKET} not found")
            return {}
            
        # List companies in the "data/nlp_results/" path within the S3 bucket
        s3_client = s3_hook.get_conn()
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET,
            Prefix='data/nlp_results/',
            Delimiter='/'
        )
        
        if 'CommonPrefixes' in response:
            for prefix in response['CommonPrefixes']:
                # Extract company name from prefix (e.g., "data/nlp_results/companyname/")
                prefix_path = prefix['Prefix']
                company_name = prefix_path.split('/')[-2] if prefix_path.endswith('/') else prefix_path.split('/')[-1]
                
                if company_name:
                    companies.append(company_name)
            
            print(f"Found {len(companies)} companies in S3: {', '.join(companies)}")
        else:
            print("No company directories found in S3")
    except Exception as e:
        print(f"Error accessing S3 for company list: {str(e)}")
    
    if not companies:
        print("No companies found in S3")
        return {}
    
    print(f"Processing {len(companies)} companies: {', '.join(companies)}")
    
    all_results = {}
    for company in companies:
        try:
            results = run_repusense_pipeline(company)
            all_results[company] = results
        except Exception as e:
            print(f"Error processing company {company}: {str(e)}")
    
    return all_results

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

# Define task dependencies
ensure_bucket_task >> run_pipeline_task 