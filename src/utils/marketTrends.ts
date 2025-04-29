
// Market trend analysis for cryptocurrency data

/**
 * Market trend indicators
 */
export interface MarketTrend {
  status: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0-100
  indicators: string[];
  description: string;
}

/**
 * Analyzes price trends to determine market sentiment
 */
export function analyzeMarketTrend(
  priceData: number[], 
  volumeData: number[] = [], 
  sentimentScore: number = 50
): MarketTrend {
  if (priceData.length < 7) {
    return {
      status: 'neutral',
      confidence: 50,
      indicators: ['Insufficient data'],
      description: 'Not enough price history to determine trend'
    };
  }
  
  // Calculate price change percentage
  const latestPrice = priceData[priceData.length - 1];
  const weekAgoPrice = priceData[Math.max(0, priceData.length - 8)];
  const monthAgoPrice = priceData[Math.max(0, priceData.length - 30)] || priceData[0];
  
  const weeklyChange = ((latestPrice - weekAgoPrice) / weekAgoPrice) * 100;
  const monthlyChange = ((latestPrice - monthAgoPrice) / monthAgoPrice) * 100;
  
  // Calculate volume trend if data is available
  let volumeTrend = 0;
  if (volumeData.length >= 7) {
    const recentVolume = volumeData.slice(-7).reduce((sum, vol) => sum + vol, 0) / 7;
    const previousVolume = volumeData.slice(-14, -7).reduce((sum, vol) => sum + vol, 0) / 7;
    volumeTrend = ((recentVolume - previousVolume) / previousVolume) * 100;
  }
  
  // Calculate price momentum
  let momentum = 0;
  if (priceData.length >= 14) {
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < 14; i++) {
      const change = priceData[priceData.length - i] - priceData[priceData.length - i - 1];
      if (change >= 0) {
        gains.push(change);
      } else {
        losses.push(Math.abs(change));
      }
    }
    
    const avgGain = gains.reduce((sum, val) => sum + val, 0) / 14;
    const avgLoss = losses.reduce((sum, val) => sum + val, 0) / 14;
    
    if (avgLoss === 0) {
      momentum = 100; // Pure bullish momentum
    } else {
      const rs = avgGain / avgLoss;
      momentum = 100 - (100 / (1 + rs)); // RSI-like calculation
    }
  }
  
  // Combine indicators to determine market trend
  const indicators: string[] = [];
  
  // Add price indicators
  if (weeklyChange > 0) {
    indicators.push(`Price up ${weeklyChange.toFixed(2)}% this week`);
  } else {
    indicators.push(`Price down ${Math.abs(weeklyChange).toFixed(2)}% this week`);
  }
  
  if (monthlyChange > 0) {
    indicators.push(`Price up ${monthlyChange.toFixed(2)}% this month`);
  } else {
    indicators.push(`Price down ${Math.abs(monthlyChange).toFixed(2)}% this month`);
  }
  
  // Add volume indicator if available
  if (volumeData.length >= 7) {
    if (volumeTrend > 10) {
      indicators.push('Volume increasing significantly');
    } else if (volumeTrend > 0) {
      indicators.push('Volume slightly increasing');
    } else if (volumeTrend < -10) {
      indicators.push('Volume decreasing significantly');
    } else {
      indicators.push('Volume relatively stable');
    }
  }
  
  // Add sentiment indicator
  if (sentimentScore > 60) {
    indicators.push('Positive market sentiment');
  } else if (sentimentScore < 40) {
    indicators.push('Negative market sentiment');
  } else {
    indicators.push('Neutral market sentiment');
  }
  
  // Add momentum indicator
  if (momentum > 70) {
    indicators.push('Strong bullish momentum (potentially overbought)');
  } else if (momentum > 55) {
    indicators.push('Moderate bullish momentum');
  } else if (momentum < 30) {
    indicators.push('Strong bearish momentum (potentially oversold)');
  } else if (momentum < 45) {
    indicators.push('Moderate bearish momentum');
  } else {
    indicators.push('Neutral momentum');
  }
  
  // Calculate overall score
  let score = 0;
  score += weeklyChange * 2;
  score += monthlyChange;
  score += (volumeTrend > 0 ? 10 : -10);
  score += (sentimentScore - 50) * 2;
  score += (momentum - 50) * 1.5;
  
  // Normalize score to 0-100 range
  const normalizedScore = Math.min(100, Math.max(0, score + 50));
  
  // Determine status
  let status: 'bullish' | 'bearish' | 'neutral';
  let description: string;
  
  if (normalizedScore >= 65) {
    status = 'bullish';
    description = 'The market shows strong bullish signals with positive price action and sentiment.';
  } else if (normalizedScore <= 35) {
    status = 'bearish';
    description = 'The market shows bearish signals with negative price action and sentiment.';
  } else {
    status = 'neutral';
    description = 'The market is showing mixed signals without a clear trend direction.';
  }
  
  return {
    status,
    confidence: Math.round(Math.abs(normalizedScore - 50) * 2),
    indicators,
    description
  };
}
