// API service for interacting with the NLP pipeline
import config from './config';

interface CompanyInfo {
  name: string;
  analysis_timestamp: string;
  data_sources: string[];
}

interface Recommendation {
  issue: string;
  recommendation: string;
  urgency: "High" | "Medium" | "Low";
  related_topics: string[];
  impact_score: number;
}

interface AnalysisRequest {
  company: string;
  start_date?: string;
  end_date?: string;
  keyword?: string;
  async_processing?: boolean;
}

interface AnalysisResponse {
  request_id: string;
  status: string;
  company: string;
  timestamp: string;
}

const API_ENDPOINT = config.apiEndpoint;

export const apiService = {
  /**
   * Get the list of available analyzed companies
   */
  async getCompanies(): Promise<CompanyInfo[]> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/companies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching companies:', error);
      return [];
    }
  },

  /**
   * Get information about a specific company
   */
  async getCompanyInfo(companyName: string): Promise<CompanyInfo | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching company info for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get topics for a specific company
   */
  async getCompanyTopics(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/topics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching topics for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get sentiment analysis for a specific company
   */
  async getCompanySentiment(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/sentiment`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching sentiment for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get word cloud data for a specific company
   */
  async getCompanyWordcloud(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/wordcloud`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching wordcloud for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Request a new analysis for a company
   */
  async analyzeCompany(request: AnalysisRequest): Promise<AnalysisResponse | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error requesting analysis for ${request.company}:`, error);
      return null;
    }
  },

  /**
   * Check the status of an analysis request
   */
  async getAnalysisStatus(requestId: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/analyze/${requestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error checking status for request ${requestId}:`, error);
      return null;
    }
  },

  /**
   * Get topic visualization HTML for a specific company
   */
  async getCompanyTopicVisualizationHtml(companyName: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/topics/visualization-html`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.text();
    } catch (error) {
      console.error(`Error fetching topic visualization HTML for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get engagement data for a specific company
   */
  async getCompanyEngagement(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/engagement`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching engagement data for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get keywords data for a specific company
   */
  async getCompanyKeywords(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/keywords`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching keywords data for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get wordcloud image URL for a specific company
   */
  getCompanyWordcloudImageUrl(companyName: string): string {
    return `${API_ENDPOINT}/api/company/${companyName}/wordcloud-image`;
  },

  /**
   * Get data sources for a specific company
   */
  async getCompanyDataSources(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/data-sources`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching data sources for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get recommendations for a specific company
   */
  async getCompanyRecommendations(companyName: string): Promise<{ recommendations: Recommendation[] } | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/recommendations?company=${companyName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching recommendations for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get content statistics for a specific company
   */
  async getCompanyContentStats(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/content-stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching content stats for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get topic barchart visualization HTML for a specific company
   */
  async getCompanyTopicBarchartHtml(companyName: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/topics/barchart`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.text();
    } catch (error) {
      console.error(`Error fetching topic barchart HTML for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get topic keywords data for a specific company
   */
  async getCompanyTopicKeywords(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/topics/keywords`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching topic keywords for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get sentiment distribution visualization HTML for a specific company
   */
  async getCompanySentimentDistributionHtml(companyName: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/sentiment/distribution`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.text();
    } catch (error) {
      console.error(`Error fetching sentiment distribution HTML for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get top engaged posts visualization HTML for a specific company
   */
  async getCompanyTopEngagedPostsHtml(companyName: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/engagement/top-posts`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.text();
    } catch (error) {
      console.error(`Error fetching top engaged posts HTML for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get engagement distribution visualization HTML for a specific company
   */
  async getCompanyEngagementDistributionHtml(companyName: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/engagement/distribution`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.text();
    } catch (error) {
      console.error(`Error fetching engagement distribution HTML for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get engagement analysis data for a specific company
   */
  async getCompanyEngagementAnalysis(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/engagement/analysis`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching engagement analysis for ${companyName}:`, error);
      return null;
    }
  },

  /**
   * Get topic info data for a specific company
   */
  async getCompanyTopicInfo(companyName: string) {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/company/${companyName}/topics/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching topic info for ${companyName}:`, error);
      return null;
    }
  }
};