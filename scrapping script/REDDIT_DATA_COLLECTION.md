# 📊 Reddit Data Collection for RepuSense

## Overview

This module is a core component of the RepuSense e-reputation analysis system. It handles the collection of Reddit posts and comments related to specific keywords for sentiment analysis and reputation monitoring.

## 🔍 Features

- **Keyword-Based Search**: Find all Reddit discussions related to your brand or topics of interest
- **Date Range Filtering**: Specify precise time periods for historical or recent data analysis
- **Complete Comment Threads**: Capture entire conversations, not just isolated posts
- **NLP-Ready Output**: Data is formatted specifically for natural language processing tasks
- **No Post Limit**: Retrieve all available data within your specified parameters

## 🛠️ Technical Implementation

The Reddit data collection process consists of two main components:

1. **Post Discovery**: Uses the Reddit API (via PRAW) to find relevant posts based on keywords and date parameters
2. **Comment Extraction**: Retrieves all comments associated with those posts through Reddit's JSON API

The implementation prioritizes:
- **Data Completeness**: Collects full conversation threads for context
- **API Compliance**: Respects Reddit's rate limits to avoid throttling
- **Error Handling**: Gracefully handles API issues and connectivity problems
- **NLP Preparation**: Formats output specifically for sentiment analysis pipelines

## 📋 Usage Instructions

### Running the Script

```bash
python reddit_nlp_scraper.py "keyword" "start-date" "end-date" [limit]
```

Example:
```bash
python reddit_nlp_scraper.py "inwi" "2023-01-01" "2023-12-31"
```

Parameters:
- `keyword`: The search term (e.g., company name, product, topic)
- `start-date`: Beginning date for data collection (YYYY-MM-DD)
- `end-date`: End date for data collection (YYYY-MM-DD)
- `limit` (optional): Maximum number of posts to retrieve (default: no limit)

### Output Format

The script generates a JSON file with the following structure:

```json
[
  {
    "post_text": "Original post content...",
    "comments": [
      "First comment text",
      "Second comment text",
      "Reply to a comment",
      ...
    ]
  },
  ...
]
```

Output files are named: `reddit_nlp_[keyword]_[start-date]_[end-date].json`

## 🔄 Integration with RepuSense

This Reddit data collection module feeds directly into the RepuSense NLP pipeline for:

1. **Sentiment Analysis**: Determining overall positive/negative/neutral sentiment
2. **Topic Modeling**: Identifying recurring themes and issues
3. **Trend Detection**: Spotting emerging reputation concerns
4. **Competitive Analysis**: Comparing brand sentiment against competitors

## ⚙️ Dependencies

- Python 3.9+
- PRAW (Python Reddit API Wrapper)
- Requests
- Playwright (optional for enhanced scraping capabilities)

Install dependencies:
```bash
pip install praw requests playwright
```

## 🚨 Limitations & Considerations

- Reddit's search API has inherent limitations in result completeness
- Historical data beyond a certain age may be limited
- API rate limits may affect large-scale data collection
- Some subreddits or posts may be private or restricted

## 🔄 Future Improvements

- Implement parallel processing for faster large-scale collection
- Add proxy support for enhanced reliability
- Incorporate subreddit-specific targeting options
- Develop continuous monitoring capabilities

---

*This module is part of the RepuSense project - an AI-powered e-reputation analysis and management system.* 