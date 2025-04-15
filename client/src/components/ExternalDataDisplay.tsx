import React from 'react';
import { ExternalData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface ExternalDataDisplayProps {
  externalData?: ExternalData;
  dataType: 'housing' | 'education' | 'safety';
  title: string;
  description?: string;
}

const ExternalDataDisplay = ({ externalData, dataType, title, description }: ExternalDataDisplayProps) => {
  if (!externalData) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-neutral-50 pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Database className="h-4 w-4 text-neutral-500" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-4 text-center text-sm text-neutral-500">
          No external data available
        </CardContent>
      </Card>
    );
  }

  const source = externalData[dataType];
  
  if (!source || !source.data) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-neutral-50 pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Database className="h-4 w-4 text-neutral-500" />
            {title}
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-4 text-center text-sm text-neutral-500">
          No {dataType} data available
        </CardContent>
      </Card>
    );
  }

  // Format fetched date to be more readable
  const fetchDate = source.fetched ? new Date(source.fetched).toLocaleDateString() : 'Unknown';

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-neutral-50 pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <Database className="h-4 w-4 text-[#005ea2]" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-xs text-neutral-500 mb-3">
          Source: {source.source || 'data.gov'} (Last updated: {fetchDate})
        </div>
        
        <div className="space-y-2">
          {renderDataContent(dataType, source.data)}
        </div>
      </CardContent>
    </Card>
  );
};

function renderDataContent(dataType: string, data: any) {
  if (!data) return <p className="text-sm text-neutral-500">No data available</p>;

  switch (dataType) {
    case 'housing':
      return (
        <>
          {data.medianHomeValue && (
            <div className="flex justify-between">
              <span className="text-sm">Median Home Value:</span>
              <span className="font-medium">${Number(data.medianHomeValue).toLocaleString()}</span>
            </div>
          )}
          {data.homeOwnershipRate && (
            <div className="flex justify-between">
              <span className="text-sm">Home Ownership Rate:</span>
              <span className="font-medium">{data.homeOwnershipRate}%</span>
            </div>
          )}
          {data.rentMedian && (
            <div className="flex justify-between">
              <span className="text-sm">Median Rent:</span>
              <span className="font-medium">${Number(data.rentMedian).toLocaleString()}/mo</span>
            </div>
          )}
        </>
      );
    
    case 'education':
      return (
        <>
          {data.schoolCount && (
            <div className="flex justify-between">
              <span className="text-sm">Number of Schools:</span>
              <span className="font-medium">{data.schoolCount}</span>
            </div>
          )}
          {data.graduationRate && (
            <div className="flex justify-between">
              <span className="text-sm">Graduation Rate:</span>
              <span className="font-medium">{data.graduationRate}%</span>
            </div>
          )}
          {data.studentTeacherRatio && (
            <div className="flex justify-between">
              <span className="text-sm">Student-Teacher Ratio:</span>
              <span className="font-medium">{data.studentTeacherRatio}:1</span>
            </div>
          )}
        </>
      );
    
    case 'safety':
      return (
        <>
          {data.crimeRate && (
            <div className="flex justify-between">
              <span className="text-sm">Crime Rate (per 100k):</span>
              <span className="font-medium">{data.crimeRate}</span>
            </div>
          )}
          {data.violentCrime !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm">Violent Crime Rate:</span>
              <span className="font-medium">{data.violentCrime}</span>
            </div>
          )}
          {data.propertyCrime !== undefined && (
            <div className="flex justify-between">
              <span className="text-sm">Property Crime Rate:</span>
              <span className="font-medium">{data.propertyCrime}</span>
            </div>
          )}
        </>
      );
    
    default:
      return (
        <pre className="text-xs bg-neutral-50 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      );
  }
}

export default ExternalDataDisplay;