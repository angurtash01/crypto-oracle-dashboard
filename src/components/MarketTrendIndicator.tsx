
import React from 'react';
import { MarketTrend, analyzeMarketTrend } from '../utils/marketTrends';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Bull, Bear, CircleArrowUp, CircleArrowDown, Circle } from 'lucide-react';

interface MarketTrendIndicatorProps {
  priceData: number[];
  volumeData?: number[];
  sentimentScore?: number;
}

const MarketTrendIndicator: React.FC<MarketTrendIndicatorProps> = ({ 
  priceData, 
  volumeData = [], 
  sentimentScore = 50 
}) => {
  const trend = analyzeMarketTrend(priceData, volumeData, sentimentScore);
  
  const getTrendIcon = () => {
    switch (trend.status) {
      case 'bullish':
        return <Bull className="h-8 w-8 text-gain mr-3" />;
      case 'bearish':
        return <Bear className="h-8 w-8 text-loss mr-3" />;
      default:
        return <Circle className="h-8 w-8 text-muted-foreground mr-3" />;
    }
  };
  
  const getStatusColor = () => {
    switch (trend.status) {
      case 'bullish':
        return '#22c55e';
      case 'bearish':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };
  
  const getTrendLabel = () => {
    switch (trend.status) {
      case 'bullish':
        return 'Bullish';
      case 'bearish':
        return 'Bearish';
      default:
        return 'Neutral';
    }
  };
  
  return (
    <div className="bg-card rounded-lg p-4 border border-border/40">
      <h3 className="text-sm font-semibold mb-3">Market Trend Analysis</h3>
      
      <div className="flex items-center mb-2">
        {getTrendIcon()}
        <div>
          <div className="flex items-center">
            <Badge 
              variant="outline" 
              className={`font-bold ${
                trend.status === 'bullish' ? 'text-gain' : 
                trend.status === 'bearish' ? 'text-loss' : 
                'text-muted-foreground'
              }`}
            >
              {getTrendLabel()} Trend
            </Badge>
            <span className="text-xs ml-2">
              {trend.confidence}% confidence
            </span>
          </div>
          <p className="text-xs mt-1">{trend.description}</p>
        </div>
      </div>
      
      <Progress 
        value={trend.confidence} 
        className="h-2 mb-3" 
        indicatorColor={getStatusColor()}
      />
      
      <div className="space-y-2">
        <h4 className="text-xs font-medium">Key Indicators:</h4>
        <ul className="text-xs space-y-1">
          {trend.indicators.map((indicator, index) => (
            <li key={index} className="flex items-center text-muted-foreground">
              {indicator.includes('up') || indicator.includes('increasing') || indicator.includes('positive') ? (
                <CircleArrowUp className="h-3.5 w-3.5 text-gain mr-1.5" />
              ) : indicator.includes('down') || indicator.includes('decreasing') || indicator.includes('negative') ? (
                <CircleArrowDown className="h-3.5 w-3.5 text-loss mr-1.5" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
              )}
              {indicator}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MarketTrendIndicator;
