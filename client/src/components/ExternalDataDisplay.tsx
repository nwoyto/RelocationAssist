import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, Database, Info } from "lucide-react";

interface ExternalDataDisplayProps {
  externalData?: {
    housing: any;
    education: any;
    safety: any;
    lastUpdated: string;
  };
  dataType: 'housing' | 'education' | 'safety';
  title: string;
  description?: string;
}

const ExternalDataDisplay = ({ externalData, dataType, title, description }: ExternalDataDisplayProps) => {
  if (!externalData) {
    return null;
  }

  const data = externalData[dataType];
  const lastUpdated = externalData.lastUpdated ? new Date(externalData.lastUpdated).toLocaleDateString() : 'N/A';

  // If no external data is available, show a message
  if (!data) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentic Data Unavailable</AlertTitle>
        <AlertDescription>
          We couldn't retrieve {dataType} data for this location from official sources.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span className="text-xs">data.gov</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <div className="mb-2">
            <div className="text-xs text-muted-foreground mb-1">Source: {data.source}</div>
            <div className="text-xs text-muted-foreground">Last updated: {lastUpdated}</div>
          </div>
          
          {data.data ? (
            <div className="mt-4 space-y-2">
              {Object.entries(data.data).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium">{key.replace(/_/g, ' ')}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-4 bg-muted rounded-md">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">No detailed data available</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExternalDataDisplay;