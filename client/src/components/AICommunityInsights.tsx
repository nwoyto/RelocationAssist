import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react";

interface AICommunityInsightsProps {
  locationId: number;
  locationName: string;
}

export default function AICommunityInsights({ locationId, locationName }: AICommunityInsightsProps) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchCommunitySummary = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.get(`/api/ai/community-summary/${locationId}`);
      setSummary(response.data.summary);
    } catch (err) {
      console.error("Error fetching community summary:", err);
      setError("We couldn't load the AI-generated community insights. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCommunitySummary();
  };

  useEffect(() => {
    fetchCommunitySummary();
  }, [locationId]);

  return (
    <Card className="w-full mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Community Insights</CardTitle>
          <CardDescription>
            Detailed analysis of {locationName} powered by AI
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={loading || refreshing}
          className={refreshing ? "animate-spin" : ""}
        >
          <RefreshCw size={16} />
        </Button>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[92%]" />
            <Skeleton className="h-4 w-[88%]" />
            <Skeleton className="h-4 w-[95%]" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: summary }} />
        )}
      </CardContent>
    </Card>
  );
}