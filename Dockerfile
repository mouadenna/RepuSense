FROM apache/airflow:2.7.1

USER root

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    openjdk-11-jdk \
    python3-pip \
    && apt-get clean

# Set Java environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# Install Python packages
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# Install Spark NLP
RUN pip install --no-cache-dir spark-nlp==4.4.0

# Set Airflow environment variables
ENV AIRFLOW_HOME=/opt/airflow
ENV PYTHONPATH="${PYTHONPATH}:/opt/airflow"

USER airflow

# Copy DAGs and other necessary files
COPY airflow/ ${AIRFLOW_HOME}/dags/
COPY config.json ${AIRFLOW_HOME}/
