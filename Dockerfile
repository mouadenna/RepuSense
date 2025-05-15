# Use Python 3.9 as base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Create necessary directories
RUN mkdir -p data/nlp_results

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "nlp_pipeline.api.main:app", "--host", "0.0.0.0", "--port", "8000"] 