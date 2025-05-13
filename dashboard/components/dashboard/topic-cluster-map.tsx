"use client"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"

export function TopicClusterMap() {
  const { selectedCompany } = useCompany();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchVisualization() {
      if (!selectedCompany) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get the topic visualization HTML
        const html = await apiService.getCompanyTopicVisualizationHtml(selectedCompany);
        
        if (html) {
          // Process HTML to ensure it works in an iframe context
          // - Remove any base tags
          // - Make sure scripts and resources have proper paths
          let processedHtml = html
            .replace(/<base\s+href=[^>]+>/gi, '')
            // Add responsive styling to ensure content fits without scrollbars
            .replace('</head>', `
              <style>
                html, body {
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                }
                .visualization-container {
                  width: 100%;
                  height: 100%;
                  overflow: visible;
                }
              </style>
            </head>`);
            
          setHtmlContent(processedHtml);
        } else {
          setError("No topic visualization available for this company");
        }
      } catch (err) {
        console.error("Error fetching topic visualization:", err);
        setError("Failed to load topic visualization");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVisualization();
  }, [selectedCompany]);

  return (
    <div className="w-full h-screen max-h-[600px]">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading topic visualization...</div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-sm text-destructive">{error}</div>
        </div>
      ) : (
        <iframe 
          srcDoc={htmlContent || ""}
          className="w-full h-full border-0"
          title="Topic Visualization"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      )}
    </div>
  );
}