"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { apiService } from "@/lib/api"
import { useCompany } from "@/contexts/CompanyContext"

interface KeywordItem {
  post_id: number;
  keywords: string[];
}

export function KeywordsCloud() {
  const { selectedCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!selectedCompany) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="text-sm text-muted-foreground">No company selected</div>
      </div>
    );
  }

  const wordcloudImageUrl = apiService.getCompanyWordcloudImageUrl(selectedCompany);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  return (
    <div className="h-[300px] w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading wordcloud image...</div>
        </div>
      )}
      
      {!imageError ? (
        <div className="relative h-full w-full flex items-center justify-center">
          <img
            src={wordcloudImageUrl}
            alt={`Word cloud for ${selectedCompany}`}
            className="max-h-full max-w-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-sm text-muted-foreground">Wordcloud image not available</div>
        </div>
      )}
    </div>
  );
} 