# RepuSense

A Natural Language Processing (NLP) pipeline for analyzing company reputation and sentiment from multiple data sources, with cloud storage integration.

## Project Overview

RepuSense is a comprehensive tool designed to analyze public perception of companies by processing text data from various sources including:

- **Social Media**: Reddit, Twitter, Facebook, etc.
- **News Articles**: Online news publications and press releases
- **Product Reviews**: E-commerce platforms and review sites
- **Forums**: Industry-specific discussion boards
- **Customer Feedback**: Survey responses and support tickets

The pipeline extracts valuable insights through:

- **Topic Modeling**: Discover key discussion themes about a company
- **Sentiment Analysis**: Understand the emotional tone of conversations
- **Keyword Extraction**: Identify important terms and phrases
- **Engagement Analysis**: Measure user interaction and interest levels

## Architecture

The following diagram illustrates the architecture and data flow of the RepuSense system:

![RepuSense Architecture](schema.png)

1. **Data Collection**: Python-based scraping scripts collect data from Reddit, news sources, and other platforms
2. **Processing Pipeline**: Apache Airflow orchestrates the NLP processing with Spark NLP
3. **Analysis**: Multiple analysis techniques including sentiment analysis (CamemBERT), topic modeling (BERTopic/LDA), emotion detection, and keyword extraction (KeyBERT)
4. **Storage**: Results stored in Amazon S3
5. **Access Layer**: RESTful API endpoints provide access to analysis results
6. **Applications**: Visualization layer (Plotly) and AI-powered recommendations (LangChain)

## Installation

### Prerequisites

- Python 3.8+
- Pip package manager
- AWS account with S3 access (for cloud storage)
- Azure account (for embedding models)
- API credentials for desired data sources

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/RepuSense.git
   cd RepuSense
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `config.json` file in the project root with your configuration:
   ```json
   {
     "s3": {
       "bucket": "repusense-results",
       "region": "us-east-1",
       "enabled": true
     },
     "api": {
       "port": 8000,
       "host": "0.0.0.0"
     },
     "azure": {
       "api_key": "your-azure-api-key",
       "endpoint": "https://models.inference.ai.azure.com",
       "model_name": "text-embedding-3-small"
     },
     "pipeline": {
       "default_company": "inwi",
       "data_dir": "data",
       "data_storage_dir": "data_storage",
       "processed_data_dir": "processed_data",
       "nlp_results_dir": "nlp_results"
     },
     "logging": {
       "level": "INFO",
       "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
     }
   }
   ```

## Usage

### Running the Pipeline

Run the NLP pipeline for a specific company:

```
python run_pipeline.py --company "Apple"
```

### Using Existing Data

Process pre-collected data for a company:

```
python run_pipeline.py --company "Microsoft" --use-existing --existing-file "/path/to/data.json"
```

### Fetching New Data

Collect and analyze new data for a date range:

```
python run_pipeline.py --company "Tesla" --start-date "2024-01-01" --end-date "2024-05-01"
```

### Using S3 Storage

Enable S3 storage for results:

```
python run_pipeline.py --company "Samsung" --use-s3 --s3-bucket "repusense-results"
```

### Full Command Reference

```
python run_pipeline.py --company "CompanyName" [OPTIONS]
```

Required arguments:
- `--company`: Name of the company to analyze (required)

Optional arguments:
- `--start-date`: Start date for data collection (YYYY-MM-DD)
- `--end-date`: End date for data collection (YYYY-MM-DD)
- `--use-existing`: Use existing data file
- `--existing-file`: Path to the existing data file
- `--use-s3`: Store results in S3
- `--s3-bucket`: S3 bucket name
- `--init-structure`: Initialize the data directory structure

Skip specific pipeline steps:
- `--skip-topic`: Skip topic modeling
- `--skip-sentiment`: Skip sentiment analysis
- `--skip-keyword`: Skip keyword extraction

## Pipeline Components

### 1. Data Fetching

The pipeline can collect data from multiple sources:

- **Reddit**: Using PRAW (Python Reddit API Wrapper)
- **News Articles**: Using news APIs and web scraping
- **Support for additional sources**: Extensible to other data sources

### 2. Data Preprocessing

Cleans and transforms raw text data by:
- Removing URLs, special characters, and formatting
- Normalizing text across different data sources
- Preserving source-specific metadata
- Preparing text for NLP analysis

### 3. NLP Analysis

The core analysis is performed through several components:

#### Topic Modeling

Discovers the main themes and topics in discussions about the company using BERTopic with Azure embeddings.

#### Sentiment Analysis

Evaluates the emotional tone of content using a transformer-based sentiment analysis model.

#### Keyword Extraction

Identifies key terms and phrases that characterize discussions about the company using KeyBERT.

#### Engagement Analysis

Measures user interaction and interest based on source-specific engagement metrics (comments, likes, shares, etc.).

### 4. Results Storage

Results are saved in structured JSON format with two options:

- **Cloud Storage**: Primary storage in S3 bucket at `s3://repusense-results/data/nlp_results/{company}/`
- **Local Storage**: Fallback storage in local directories at `data/nlp_results/{company}/`

Results directories include:
- Topics: `{company}/topics/`
- Sentiment: `{company}/sentiment/`
- Keywords: `{company}/keywords/`
- Engagement: `{company}/engagement/`

## API

The project includes a FastAPI backend for serving the analysis results:

1. Start the API server:
   ```bash
   python -m uvicorn nlp_pipeline.api.main:app --host 0.0.0.0 --port 8000
   ```
   
2. API endpoints include:
   - `/api/companies` - List all analyzed companies
   - `/api/company/{company_name}` - Company information
   - `/api/company/{company_name}/topics` - Topic distribution
   - `/api/company/{company_name}/sentiment` - Sentiment analysis
   - `/api/company/{company_name}/keywords` - Keyword extraction
   - `/api/company/{company_name}/wordcloud` - Word cloud data
   - `/api/company/{company_name}/wordcloud-image` - Word cloud visualization
   - `/api/company/{company_name}/topics/visualization-html` - Interactive topic visualization
   - `/api/analyze` - Trigger new analyses asynchronously

## Dashboard

The project includes a web dashboard built with Next.js, React 18, and Tailwind CSS. To set up and run the dashboard:

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   # Or with pnpm:
   pnpm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build and start in production:
   ```bash
   npm run build
   npm run start
   ```

The dashboard includes features such as:
- Company selection
- Topic visualization
- Sentiment analysis
- Keyword cloud visualization
- Recommendations and alerts
- Interactive data exploration

## Airflow Integration

The project includes Apache Airflow integration for scheduling and automating analysis:

1. The DAG file `airflow/repusense_dag.py` can be placed in your Airflow DAGs directory
2. The DAG dynamically discovers companies from S3 storage
3. Each company's data is processed in parallel
4. Results are stored in both S3 and local storage for redundancy

## Directory Structure

```
RepuSense/
├── config.json                   # Project configuration
├── run_pipeline.py               # Main pipeline runner
├── nlp_pipeline/                 # Core NLP pipeline code
│   ├── main.py                   # Pipeline implementation
│   ├── api/                      # API server
│   │   ├── main.py               # FastAPI implementation
│   │   └── process_request.py    # Asynchronous request processor
│   ├── data_processing/          # Data fetching and preprocessing
│   │   ├── data_fetcher.py       # Core data fetching framework
│   │   ├── sources/              # Source-specific fetchers
│   │   │   ├── reddit_fetcher.py # Reddit-specific fetcher
│   │   │   └── news_fetcher.py   # News-specific fetcher
│   │   └── data_preprocessor.py  # Preprocesses text data
│   └── spark_nlp/                # NLP analysis components
│       ├── topic_modeling.py     # Topic modeling with BERTopic
│       ├── sentiment_analysis.py # Sentiment analysis
│       ├── keyword_extraction.py # Keyword extraction
│       └── engagement_analysis.py # Engagement analysis
├── airflow/                      # Airflow integration
│   └── repusense_dag.py          # Airflow DAG definition
├── scrapping script/             # Data collection utilities
│   ├── reddit_nlp_scraper.py     # Reddit data collector
│   └── other_scrapers/           # Additional data collectors
├── dashboard/                    # Next.js web dashboard
│   ├── app/                      # App router pages
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Utility functions
│   ├── styles/                   # CSS styles
│   └── public/                   # Static assets
├── data/                         # Data storage (git-ignored)
│   ├── data_storage/             # Raw data
│   ├── processed_data/           # Preprocessed data
│   └── nlp_results/              # Analysis results
└── requirements.txt              # Project dependencies
```

## Example Visualizations

After running the pipeline, you can find:

- Topic visualizations: `data/nlp_results/{company}/topics/topic_visualization.html`
- Word cloud image: `data/nlp_results/{company}/keywords/wordcloud.png`
- Sentiment distribution charts (via the dashboard)
- Engagement analysis visualizations (via the dashboard)

## Cloud Integration

RepuSense uses S3 for cloud storage with the following features:

- **Primary data storage**: NLP results are stored in S3
- **Fallback mechanism**: If S3 is unavailable, local storage is used
- **Dynamic company discovery**: The system can discover available companies from S3
- **Efficient data access**: The API prioritizes S3 for data retrieval
- **Scalable architecture**: Supports processing large datasets across multiple machines

## Contributing

Contributions to RepuSense are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
