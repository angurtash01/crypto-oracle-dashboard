
import React from 'react';
import { ChartPattern, detectPatterns } from '../utils/chartPatterns';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface PatternDetectorProps {
  priceData: number[];
}

const PatternDetector: React.FC<PatternDetectorProps> = ({ priceData }) => {
  const patterns = detectPatterns(priceData);
  
  if (patterns.length === 0) {
    return (
      <div className="bg-card rounded-lg p-4 border border-border/40">
        <h3 className="text-sm font-semibold mb-2">Pattern Detection</h3>
        <p className="text-xs text-muted-foreground">No significant patterns detected in current price data.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg p-4 border border-border/40">
      <h3 className="text-sm font-semibold mb-2">Pattern Detection</h3>
      <div className="space-y-3">
        {patterns.map((pattern, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <Badge variant={getPatternVariant(pattern.type)}>
                {formatPatternType(pattern.type)}
              </Badge>
              <span className="text-xs font-medium">
                {pattern.confidence.toFixed(0)}% confidence
              </span>
            </div>
            <Progress 
              value={pattern.confidence} 
              className="h-2" 
              indicatorColor={getPatternColor(pattern.type)}
            />
            <p className="text-xs text-muted-foreground mt-1">{pattern.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatPatternType(type: ChartPattern['type']): string {
  switch (type) {
    case 'double-top':
      return 'Double Top';
    case 'double-bottom':
      return 'Double Bottom';
    case 'head-and-shoulders':
      return 'Head and Shoulders';
    case 'inverse-head-and-shoulders':
      return 'Inverse Head and Shoulders';
    case 'triangle':
      return 'Triangle';
    case 'channel':
      return 'Channel';
    default:
      return type;
  }
}

function getPatternVariant(type: ChartPattern['type']): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case 'double-top':
    case 'head-and-shoulders':
      return 'destructive';
    case 'double-bottom':
    case 'inverse-head-and-shoulders':
      return 'default';
    default:
      return 'secondary';
  }
}

function getPatternColor(type: ChartPattern['type']): string {
  switch (type) {
    case 'double-top':
    case 'head-and-shoulders':
      return '#ef4444';  // Red for bearish patterns
    case 'double-bottom':
    case 'inverse-head-and-shoulders':
      return '#22c55e';  // Green for bullish patterns
    case 'triangle':
    case 'channel':
      return '#3b82f6';  // Blue for neutral patterns
    default:
      return '#8b5cf6';  // Purple for other patterns
  }
}

export default PatternDetector;
