import { useEffect, useState } from 'react';
import { apiService } from '@/lib/api';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface VisualizationIframeProps {
  title: string;
  description: string;
  fetchHtml: (companyName: string) => Promise<string | null>;
  className?: string;
}

export function VisualizationIframe({ title, description, fetchHtml, className = '' }: VisualizationIframeProps) {
  const { selectedCompany } = useCompany();
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVisualization() {
      if (!selectedCompany) return;

      setIsLoading(true);
      setError(null);

      try {
        const content = await fetchHtml(selectedCompany);
        if (content) {
          setHtmlContent(content);
        } else {
          setError('Failed to load visualization');
        }
      } catch (err) {
        setError('Error loading visualization');
        console.error('Error loading visualization:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadVisualization();
  }, [selectedCompany, fetchHtml]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="w-full h-[600px] p-4">
            <Skeleton className="w-full h-full" />
          </div>
        ) : error ? (
          <div className="w-full h-[600px] flex items-center justify-center text-red-500">
            {error}
          </div>
        ) : htmlContent ? (
          <div className="w-full h-[600px] overflow-hidden">
            <iframe
              srcDoc={htmlContent}
              className="w-full h-full border-0"
              title={title}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
} 