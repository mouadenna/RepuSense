"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCompany } from "@/contexts/CompanyContext";
import { apiService } from "@/lib/api";

export function LandingPage() {
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedCompany } = useCompany();
  const { toast } = useToast();

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a company name",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if company exists in the API
      const companyInfo = await apiService.getCompanyInfo(companyName);
      
      if (companyInfo) {
        // Company exists, set it as selected
        setSelectedCompany(companyName);
        toast({
          title: "Success",
          description: `Loading dashboard for ${companyName}`,
        });
      } else {
        // Company doesn't exist, ask to analyze
        const analyzeResponse = await apiService.analyzeCompany({
          company: companyName,
          async_processing: true,
        });
        
        if (analyzeResponse) {
          setSelectedCompany(companyName);
          toast({
            title: "Analysis Started",
            description: `We're analyzing ${companyName}. This may take a few minutes.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to start company analysis. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error checking company:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">RepuSense</h1>
          <p className="text-muted-foreground">Comprehensive E-Reputation Analysis for Businesses</p>
        </div>
        
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome to RepuSense</CardTitle>
            <CardDescription>
              Enter a company name to start analyzing its e-reputation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompanySubmit} className="space-y-4">
              <div className="flex w-full items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Company name (e.g., Inwi, Microsoft)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 