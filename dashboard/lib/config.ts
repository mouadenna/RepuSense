// Configuration utilities for the dashboard

// Default configuration
const config = {
  apiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:8000',
  timeoutMs: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '60000', 10),
  defaultCompany: process.env.NEXT_PUBLIC_DEFAULT_COMPANY || 'inwi'
};

export default config; 