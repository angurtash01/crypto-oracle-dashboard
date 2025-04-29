
import React from 'react';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface MCPPrediction {
  coin: string;
  probability: number;
  direction: 'up' | 'down';
  timeframe: string;
  explanation: string;
  indicators: {
    rsi: number;
    macd: string;
    sentiment: string;
  };
}

interface MCPCardProps {
  prediction: MCPPrediction;
  isLoading?: boolean;
}

const MCPCard = ({ prediction, isLoading = false }: MCPCardProps) => {
  const { probability, direction, timeframe, explanation, indicators } = prediction;
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border/40 animate-pulse">
        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
        <div className="h-24 bg-muted rounded mb-4"></div>
        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/4"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg p-6 border border-border/40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Market Prediction</h3>
        <div className="flex items-center space-x-1 text-muted-foreground text-sm">
          <Calendar className="h-3.5 w-3.5" />
          <span>{timeframe}</span>
        </div>
      </div>
      
      <div className={`flex items-center p-4 mb-4 rounded-md ${
        direction === 'up' ? 'bg-gain/10 border border-gain/20' : 'bg-loss/10 border border-loss/20'
      }`}>
        <div className={`rounded-full p-3 mr-4 ${
          direction === 'up' ? 'bg-gain/20 text-gain' : 'bg-loss/20 text-loss'
        }`}>
          {direction === 'up' ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
        </div>
        <div>
          <h4 className={`text-lg font-bold ${
            direction === 'up' ? 'text-gain' : 'text-loss'
          }`}>
            {Math.round(probability)}% chance BTC will {direction === 'up' ? 'rise' : 'fall'}
          </h4>
          <p className="text-sm mt-1">{explanation}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-2">
        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-muted-foreground mb-1">RSI</p>
          <p className="font-medium">
            {indicators.rsi}
            <span className="text-xs ml-1 text-muted-foreground">
              {indicators.rsi > 70 ? '(Overbought)' : indicators.rsi < 30 ? '(Oversold)' : ''}
            </span>
          </p>
        </div>
        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-muted-foreground mb-1">MACD</p>
          <p className={`font-medium ${
            indicators.macd === 'Bullish' ? 'text-gain' : 
            indicators.macd === 'Bearish' ? 'text-loss' : ''
          }`}>
            {indicators.macd}
          </p>
        </div>
        <div className="bg-secondary rounded-md p-3">
          <p className="text-xs text-muted-foreground mb-1">Sentiment</p>
          <p className={`font-medium ${
            indicators.sentiment === 'Positive' ? 'text-gain' : 
            indicators.sentiment === 'Negative' ? 'text-loss' : 'text-muted-foreground'
          }`}>
            {indicators.sentiment}
          </p>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        AI-powered analysis based on technical indicators and market sentiment. Not financial advice.
      </p>
    </div>
  );
};

export default MCPCard;
