# RepuSense

A reputation analysis system that processes social media data to provide insights about companies.

## Features

1. **Data Collection**: Automated collection of social media posts
2. **NLP Processing**: Advanced natural language processing for sentiment and topic analysis
3. **Visualization**: Interactive visualizations of analysis results
4. **Storage**: Results stored locally in the data directory

## Requirements

- Python 3.8+
- Required Python packages (see requirements.txt)
- Reddit API credentials (for data collection)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/repusense.git
cd repusense
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure the application:
   - Copy `config.example.json` to `config.json`
   - Update the configuration with your Reddit API credentials

## Usage

### Running the Pipeline

Run the NLP pipeline for a company:

```bash
python run_pipeline.py --company "CompanyName" --start-date "2024-01-01" --end-date "2024-12-31"
```

### Using the API

Start the API server:

```bash
python -m nlp_pipeline.api.main
```

The API will be available at `http://localhost:8000`

## Project Structure

```
repusense/
├── data/
│   ├── nlp_results/     # Analysis results
│   ├── processed_data/  # Processed data files
│   └── raw_data/        # Raw collected data
├── nlp_pipeline/
│   ├── api/            # API implementation
│   ├── data_processing/ # Data processing modules
│   └── spark_nlp/      # NLP analysis modules
├── config.json         # Configuration file
├── requirements.txt    # Python dependencies
└── run_pipeline.py     # Pipeline execution script
```

## Data Storage

Results are stored in the local filesystem with the following structure:

```
data/nlp_results/
  company_name/
    topics/
      topic_distribution.json
      topic_visualization.html
    sentiment/
      sentiment_results.json
    keywords/
      keyword_results.json
      word_cloud_data.json
      wordcloud.png
    engagement/
      engagement_results.json
```

## API Endpoints

- `GET /api/companies` - List available companies
- `GET /api/company/{company_name}` - Get company information
- `GET /api/company/{company_name}/topics` - Get topic analysis
- `GET /api/company/{company_name}/sentiment` - Get sentiment analysis
- `GET /api/company/{company_name}/keywords` - Get keyword analysis
- `GET /api/company/{company_name}/engagement` - Get engagement analysis
- `GET /api/company/{company_name}/wordcloud` - Get word cloud data
- `GET /api/company/{company_name}/wordcloud-image` - Get word cloud image
- `GET /api/company/{company_name}/topics/visualization-html` - Get topic visualization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
