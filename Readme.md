# RepuSense: Reddit Data Analysis Pipeline

RepuSense is a comprehensive data analysis pipeline that performs NLP tasks on Reddit data, specifically focused on analyzing public sentiment and discussions about any company. The pipeline includes data collection, preprocessing, and various NLP analyses, with results exposed via a REST API.

## Project Structure

```
RepuSense/
│
├── scrapping script/                # Original Reddit data scraping script
│   ├── reddit_nlp_scraper.py        # Script for scraping Reddit posts
│   └── reddit_nlp_*.json            # Downloaded Reddit data
│
├── nlp_pipeline/                    # Main NLP pipeline code
│   ├── data_processing/             # Data fetching and preprocessing
│   │   ├── data_fetcher.py          # Module for fetching Reddit data
│   │   └── data_preprocessor.py     # Module for preprocessing data
│   │
│   ├── spark_nlp/                   # NLP analysis modules
│   │   ├── topic_modeling.py        # Topic modeling using BERTopic
│   │   ├── sentiment_analysis.py    # Sentiment analysis using CardiffNLP model
│   │   ├── keyword_extraction.py    # Keyword extraction using KeyBERT
│   │   └── engagement_analysis.py   # Comment engagement analysis
│   │
│   ├── api/                         # API for exposing NLP results
│   │   ├── main.py                  # FastAPI application
│   │   └── process_request.py       # Module for processing analysis requests
│   │
│   └── main.py                      # Main orchestrator for the pipeline
│
├── airflow/                         # Airflow DAGs for scheduled runs
│   └── repusense_dag.py             # Weekly pipeline execution DAG
│
├── data_storage/                    # Directory for storing raw data by company (created at runtime)
├── processed_data/                  # Directory for storing processed data by company (created at runtime)
├── nlp_results/                     # Directory for storing NLP results by company (created at runtime)
├── api_data/                        # Directory for API data by company (created at runtime)
├── api_requests/                    # Directory for storing analysis requests (created at runtime)
│
├── requirements.txt                 # Project dependencies
└── README.md                        # Project documentation
```

## Setup

### Prerequisites

- Python 3.8 or higher
- Pip for package installation
- Apache Airflow 2.6+ (for scheduled runs)
- AWS account with S3 access (for storing results)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/RepuSense.git
   cd RepuSense
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure AWS credentials (if using S3 storage):
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export REPUSENSE_S3_BUCKET=your_bucket_name
   ```

## Usage

### Running the Pipeline

You can run the full NLP pipeline for a specific company using the main script:

```bash
python run_pipeline.py --company "YourCompanyName"
```

This command will:
1. Fetch Reddit data about the specified company
2. Preprocess the data
3. Run various NLP analyses
4. Generate API-ready data
5. Start the API server

#### Command Line Options

The run_pipeline.py script supports the following options:

- `--company`: Name of the company to analyze (required for new analyses)
- `--skip-pipeline`: Skip running the NLP pipeline and just start the API
- `--use-existing`: Use existing data (without fetching new data)
- `--skip-topic`: Skip topic modeling (which is resource-intensive)
- `--skip-sentiment`: Skip sentiment analysis
- `--skip-keyword`: Skip keyword extraction
- `--start-date`: Start date for data fetching (format: "YYYY-MM-DD")
- `--end-date`: End date for data fetching (format: "YYYY-MM-DD")
- `--existing-file`: Path to existing data file to use
- `--api-only`: Only start the API server without running the pipeline
- `--port`: Port for the API server (default: 8000)
- `--use-s3`: Store results in an S3 bucket
- `--s3-bucket`: S3 bucket name for storing results

#### Examples

1. To analyze a new company:
   ```bash
   python run_pipeline.py --company "Microsoft" --start-date "2024-01-01" --end-date "2024-06-30"
   ```

2. To use existing data for a company:
   ```bash
   python run_pipeline.py --company "Apple" --use-existing --existing-file "path/to/apple_data.json"
   ```

3. To skip resource-intensive analyses:
   ```bash
   python run_pipeline.py --company "Google" --skip-topic --skip-sentiment
   ```

4. To just start the API server:
   ```bash
   python run_pipeline.py --api-only
   ```

5. To store results in S3:
   ```bash
   python run_pipeline.py --company "Amazon" --use-s3 --s3-bucket "my-repusense-bucket"
   ```

### Running the Pipeline Directly

You can also run the pipeline directly using the main.py script for more control:

```bash
python nlp_pipeline/main.py --company "CompanyName" --start-date "2024-01-01" --end-date "2024-06-30" --use-s3 --s3-bucket "my-repusense-bucket"
```

#### Additional Options

- `--keyword`: Custom keyword to search for on Reddit (if different from company name)
- `--limit`: Maximum number of posts to fetch
- `--skip-fetch`: Skip data fetching
- `--skip-preprocess`: Skip data preprocessing
- `--skip-api`: Skip API data preparation

### Scheduled Runs with Airflow

RepuSense includes an Airflow DAG for scheduling weekly analysis runs:

1. Copy the DAG file to your Airflow DAGs folder:
   ```bash
   cp airflow/repusense_dag.py ~/airflow/dags/
   ```

2. Update the configuration in the DAG file:
   - Update `sys.path.append('/path/to/RepuSense')` with your actual project path
   - Configure the `S3_BUCKET` and `S3_REGION` variables
   - Update the list of companies to analyze in the `run_all_companies_pipeline` function

3. The DAG will run automatically every Sunday at midnight, processing all companies and storing results in S3.

### Running the API

Once you've run the pipeline and generated the API data, you can start just the API server:

```bash
cd nlp_pipeline/api
uvicorn main:app --reload
```

The API will be available at http://localhost:8000.

#### API Endpoints

The API provides company-specific endpoints:

- `/api/companies`: Get list of all analyzed companies
- `/api/company/{company_name}`: Get company information
- `/api/company/{company_name}/topics`: Get topic distribution for a company
- `/api/company/{company_name}/sentiment`: Get sentiment analysis results for a company
- `/api/company/{company_name}/keywords`: Get keyword extraction results for a company
- `/api/company/{company_name}/engagement`: Get comment engagement index for a company
- `/api/company/{company_name}/wordcloud`: Get word cloud data for a company
- `/api/company/{company_name}/post/{post_id}/sentiment`: Get sentiment for a specific post
- `/api/company/{company_name}/post/{post_id}/keywords`: Get keywords for a specific post
- `/api/company/{company_name}/post/{post_id}/engagement`: Get engagement for a specific post

#### Triggering Analysis via API

You can trigger on-demand analysis for a company:

- `POST /api/analyze`: Trigger analysis for a company
  ```json
  {
    "company": "CompanyName",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "keyword": "optional_custom_keyword",
    "async_processing": false
  }
  ```

- `GET /api/analyze/{request_id}`: Check the status of an analysis request
- `GET /api/requests`: List recent analysis requests

For backward compatibility, the API also supports general endpoints with optional company filtering:

- `/api/topics?company=CompanyName`: Get topic distribution
- `/api/sentiment?company=CompanyName`: Get sentiment analysis results
- `/api/keywords?company=CompanyName`: Get keyword extraction results
- `/api/engagement?company=CompanyName`: Get comment engagement index
- `/api/wordcloud?company=CompanyName`: Get word cloud data

### S3 Storage Structure

When using S3 storage, the results are organized as follows:

```
s3://your-bucket-name/
├── company1/
│   └── YYYYMMDD/                      # Date of analysis
│       ├── topics.json                # Topic modeling results
│       ├── sentiment.json             # Sentiment analysis results
│       ├── keywords.json              # Keyword extraction results
│       ├── engagement.json            # Engagement analysis results
│       ├── wordcloud.json             # Word cloud data
│       ├── company_info.json          # Company metadata
│       └── combined_results.json      # All results combined in one file
│
├── company2/
│   └── YYYYMMDD/
│       └── ...
```

This structure allows for keeping historical analyses and comparing changes over time.

### Individual Pipeline Components

You can also run individual components of the pipeline:

1. **Data Fetching**:
   ```bash
   python nlp_pipeline/data_processing/data_fetcher.py
   ```

2. **Data Preprocessing**:
   ```bash
   python nlp_pipeline/data_processing/data_preprocessor.py
   ```

3. **Topic Modeling**:
   ```bash
   python nlp_pipeline/spark_nlp/topic_modeling.py
   ```

4. **Sentiment Analysis**:
   ```bash
   python nlp_pipeline/spark_nlp/sentiment_analysis.py
   ```

5. **Keyword Extraction**:
   ```bash
   python nlp_pipeline/spark_nlp/keyword_extraction.py
   ```

6. **Engagement Analysis**:
   ```bash
   python nlp_pipeline/spark_nlp/engagement_analysis.py
   ```

## NLP Tasks and Results

### Topic Modeling

- Uses BERTopic to identify topics in the Reddit posts and comments
- Results include topic distribution, keywords for each topic, and visualizations

### Sentiment Analysis

- Uses the CardiffNLP/twitter-roberta-base-sentiment model to analyze sentiment
- Categorizes text as positive, neutral, or negative with a confidence score

### Keyword Extraction

- Uses KeyBERT to extract the most relevant keywords from posts and comments
- Results include top keywords per post and overall word frequencies

### Engagement Analysis

- Analyzes comment engagement by counting comments per post
- Identifies the most engaged posts and provides engagement distribution

## Use Cases

RepuSense can be used for various purposes:

1. **Brand Monitoring**: Track public perception and sentiment about a company
2. **Competitor Analysis**: Compare sentiment and topics across multiple companies
3. **Crisis Management**: Identify negative sentiment spikes and emerging issues
4. **Market Research**: Understand what topics consumers associate with a brand
5. **Content Strategy**: Identify topics with high engagement to inform content creation

## Contact

For any questions or issues, please open an issue on GitHub or contact the project maintainers.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
