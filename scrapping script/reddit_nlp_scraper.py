import praw
import datetime
import time
import json
import requests
import sys
from playwright.sync_api import sync_playwright

def epoch_time(date_str):
    """Convert date string to epoch time."""
    return int(time.mktime(datetime.datetime.strptime(date_str, "%Y-%m-%d").timetuple()))

def extract_comments_from_json(comments_data):
    """Extract comment texts from Reddit JSON data, flattening the structure."""
    all_comment_texts = []

    def extract_comment_text(comment):
        # Skip AutoModerator comments
        if comment.get('author') == 'AutoModerator':
            return

        # Add the comment text
        if 'body' in comment and comment['body']:
            all_comment_texts.append(comment['body'])

        # Process replies
        replies = comment.get('replies', {})
        if isinstance(replies, dict):
            replies_children = replies.get('data', {}).get('children', [])
            for reply in replies_children:
                if reply.get('kind') == 't1':  # t1 is the prefix for comments
                    extract_comment_text(reply.get('data', {}))

    # Process top-level comments
    for child in comments_data.get('data', {}).get('children', []):
        if child.get('kind') == 't1':  # t1 is the prefix for comments
            extract_comment_text(child.get('data', {}))

    return all_comment_texts

def fetch_comments(post_url):
    """Fetch comments for a single post."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
    
    json_url = post_url.rstrip('/') + '.json'
    try:
        # Respect Reddit's rate limits
        time.sleep(2)
        response = requests.get(json_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        comment_texts = []
        if isinstance(data, list) and len(data) > 1:
            comment_texts = extract_comments_from_json(data[1])
        return comment_texts
    except Exception as e:
        print(f"Error fetching comments from {post_url}: {str(e)}")
        return []

def fetch_reddit_posts(keyword, start_date, end_date, limit=None):
    """Fetch Reddit posts matching the keyword and date range."""
    # Initialize the Reddit API client
    reddit = praw.Reddit(
        client_id="WE9cMa51atcAuT5vk82o4w",
        client_secret="gKSbsR83IF45C2jruOi6gsCQ8fyLPw",
        user_agent="RepuSense/1.0 (by u/mouad)"
    )
    
    # Convert dates to epoch time for filtering
    after_epoch = epoch_time(start_date)
    before_epoch = epoch_time(end_date)
    
    print(f"Searching for '{keyword}' between {start_date} and {end_date}")
    print("No post limit applied - retrieving all posts in the date range")
    
    # Collect posts with their information
    posts_with_info = []
    
    try:
        # Search across all of Reddit
        search_in = reddit.subreddit("all")
        
        # Use either a large number or None for limit to get as many posts as possible
        search_limit = None if limit is None else limit
        
        # Perform the search
        for submission in search_in.search(keyword, sort="relevance", time_filter="all", limit=search_limit):
            created_time = submission.created_utc
            
            # Filter by date range
            if after_epoch <= created_time <= before_epoch:
                # Get the post text (combine title and selftext for self posts)
                post_text = submission.title
                if submission.is_self and hasattr(submission, "selftext") and submission.selftext:
                    post_text += "\n\n" + submission.selftext
                
                post_info = {
                    "id": submission.id,
                    "permalink": f"https://www.reddit.com{submission.permalink}",
                    "post_text": post_text,
                    "created_utc": datetime.datetime.fromtimestamp(submission.created_utc).strftime("%Y-%m-%d %H:%M:%S"),
                    "subreddit": submission.subreddit.display_name
                }
                
                posts_with_info.append(post_info)
                print(f"Found post: {submission.title[:50]}{'...' if len(submission.title) > 50 else ''}")
                
    except Exception as e:
        print(f"Error during Reddit search: {str(e)}")
    
    return posts_with_info

def scrape_reddit_for_nlp(keyword, start_date, end_date, limit=None, output_file=None):
    """
    Main function to scrape Reddit posts and comments for NLP tasks.
    
    Args:
        keyword: Search term
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        limit: Maximum number of posts to fetch (None for no limit)
        output_file: Output JSON file path
    
    Returns:
        List of posts with their comments in NLP-friendly format
    """
    # If no output file specified, create one based on the keyword and dates
    if not output_file:
        output_file = f"reddit_nlp_{keyword.replace(' ', '_')}_{start_date}_{end_date}.json"
    
    # Step 1: Fetch posts matching the keyword and date range
    print(f"Step 1: Fetching posts for '{keyword}' from {start_date} to {end_date}...")
    posts = fetch_reddit_posts(keyword, start_date, end_date, limit=limit)
    print(f"Found {len(posts)} posts matching the criteria.")
    
    # Step 2: Fetch comments for each post
    print("\nStep 2: Fetching comments for each post...")
    nlp_data = []
    
    for i, post in enumerate(posts, 1):
        print(f"[{i}/{len(posts)}] Fetching comments for post: {post['id']}")
        
        # Fetch comments for this post
        comment_texts = fetch_comments(post["permalink"])
        print(f"  Found {len(comment_texts)} comments")
        
        # Add post and comments to the NLP dataset
        nlp_entry = {
            "post_text": post["post_text"],
            "comments": comment_texts
        }
        
        nlp_data.append(nlp_entry)
    
    # Step 3: Save the NLP-friendly data to a JSON file
    print(f"\nStep 3: Saving data to {output_file}...")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(nlp_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Successfully saved {len(nlp_data)} posts with their comments to '{output_file}'")
    print(f"Total posts: {len(nlp_data)}")
    total_comments = sum(len(entry["comments"]) for entry in nlp_data)
    print(f"Total comments: {total_comments}")
    
    return nlp_data

if __name__ == "__main__":
    # Check command line arguments
    if len(sys.argv) < 4:
        print("Usage: python reddit_nlp_scraper.py <keyword> <start_date> <end_date> [limit]")
        print("Example: python reddit_nlp_scraper.py \"solar energy\" 2023-01-01 2023-12-31")
        print("Note: Default is no limit - all posts within date range will be retrieved")
        sys.exit(1)
    
    # Parse command line arguments
    keyword = sys.argv[1]
    start_date = sys.argv[2]
    end_date = sys.argv[3]
    limit = int(sys.argv[4]) if len(sys.argv) > 4 else None
    
    # Run the scraper
    scrape_reddit_for_nlp(keyword, start_date, end_date, limit=limit) 