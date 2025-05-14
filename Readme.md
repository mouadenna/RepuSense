# RepuSense

A Natural Language Processing (NLP) pipeline for analyzing company reputation and sentiment from multiple data sources.

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

## Installation

### Prerequisites

- Python 3.8+
- Pip package manager
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
     "pipeline": {
       "default_company": "inwi"
     },
     "s3": {
       "enabled": false,
       "bucket": "repusense-results",
       "region": "us-east-1"
     },
     "data_sources": {
       "reddit": true,
       "twitter": false,
       "news": false,
       "reviews": false
     }
   }
   ```

## Usage

### Basic Usage

Run the NLP pipeline for a specific company:

```
python nlp_pipeline/main.py --company "Apple"
```

### Using Existing Data

Process pre-collected data for a company:

```
python nlp_pipeline/main.py --company "Microsoft" --use-existing --existing-file "/path/to/data.json"
```

### Fetching New Data

Collect and analyze new data for a date range:

```
python nlp_pipeline/main.py --company "Tesla" --start-date "2024-01-01" --end-date "2024-05-01"
```

### Specifying Data Sources

You can specify which data sources to use:

```
python nlp_pipeline/main.py --company "Samsung" --sources "reddit,twitter,news"
```

### Full Command Reference

```
python nlp_pipeline/main.py --company "CompanyName" [OPTIONS]
```

Required arguments:
- `--company`: Name of the company to analyze (required)

Optional arguments:
- `--start-date`: Start date for data collection (YYYY-MM-DD)
- `--end-date`: End date for data collection (YYYY-MM-DD)
- `--limit`: Maximum number of posts/articles to fetch
- `--sources`: Comma-separated list of data sources to use
- `--use-existing`: Use existing data file
- `--existing-file`: Path to the existing data file
- `--use-s3`: Store results in S3
- `--s3-bucket`: S3 bucket name

Skip specific pipeline steps:
- `--skip-fetch`: Skip data fetching
- `--skip-preprocess`: Skip data preprocessing
- `--skip-topic`: Skip topic modeling
- `--skip-sentiment`: Skip sentiment analysis
- `--skip-keyword`: Skip keyword extraction
- `--skip-engagement`: Skip engagement analysis
- `--skip-api`: Skip API data preparation

## Pipeline Components

### 1. Data Fetching

The pipeline can collect data from multiple sources:

- **Reddit**: Using PRAW (Python Reddit API Wrapper)
- **Twitter**: Using Twitter API v2
- **News Articles**: Using news APIs and web scraping
- **Review Sites**: Using site-specific APIs and scraping techniques
- **Custom Sources**: Support for custom data sources via adapters

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

Results are saved in structured JSON format in the following directories:
- Topics: `data/nlp_results/{company}/topics/`
- Sentiment: `data/nlp_results/{company}/sentiment/`
- Keywords: `data/nlp_results/{company}/keywords/`
- Engagement: `data/nlp_results/{company}/engagement/`

API-ready data is stored in `data/api_data/{company}/`.

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

If you encounter Tailwind CSS configuration errors, install the `@tailwindcss/postcss` plugin:
```bash
npm install -D @tailwindcss/postcss
```
Ensure your `postcss.config.mjs` includes:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

You can set environment variables in a `.env.local` file inside the `dashboard` directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Directory Structure

```
RepuSense/
├── config.json                   # Project configuration
├── nlp_pipeline/                 # Main pipeline code
│   ├── main.py                   # Pipeline orchestrator
│   ├── data_processing/          # Data fetching and preprocessing
│   │   ├── data_fetcher.py       # Core data fetching framework
│   │   ├── sources/              # Source-specific fetchers
│   │   │   ├── reddit_fetcher.py # Reddit-specific fetcher
│   │   │   ├── twitter_fetcher.py # Twitter-specific fetcher
│   │   │   ├── news_fetcher.py   # News-specific fetcher
│   │   │   └── review_fetcher.py # Review sites fetcher
│   │   └── data_preprocessor.py  # Preprocesses text data
│   └── spark_nlp/                # NLP analysis components
│       ├── topic_modeling.py     # Topic modeling with BERTopic
│       ├── sentiment_analysis.py # Sentiment analysis
│       ├── keyword_extraction.py # Keyword extraction
│       └── engagement_analysis.py # Engagement analysis
├── scrapping script/             # Data collection utilities
│   ├── reddit_nlp_scraper.py     # Reddit data collector
│   └── other_scrapers/           # Additional data collectors
├── data/                         # Data storage (git-ignored)
│   ├── data_storage/             # Raw data
│   ├── processed_data/           # Preprocessed data
│   ├── nlp_results/              # Analysis results
│   └── api_data/                 # API-ready data
└── requirements.txt              # Project dependencies
```

## Example Visualizations

After running the pipeline, you can find:

- Topic visualizations: `data/nlp_results/{company}/topics/topic_visualization.html`
- Sentiment distribution: `data/nlp_results/{company}/sentiment/sentiment_distribution.html` 
- Word cloud: `data/nlp_results/{company}/keywords/wordcloud.png`
- Engagement analysis: `data/nlp_results/{company}/engagement/engagement_distribution.html`
- Source comparison: `data/nlp_results/{company}/source_comparison.html`

## Extending to New Data Sources

RepuSense is designed to be easily extensible to new data sources. To add a new source:

1. Create a new fetcher in `nlp_pipeline/data_processing/sources/`
2. Implement the required interface methods:
   - `fetch_data()`
   - `parse_data()`
   - `get_metadata()`
3. Register the new source in `config.json`
4. The pipeline will automatically incorporate the new source

## Contributing

Contributions to RepuSense are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
