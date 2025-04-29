
// Market Contextual Predictor (MCP) service
// This is a mock service that simulates AI predictions

/**
 * Calculate Relative Strength Index (RSI)
 * @param prices Array of prices
 * @param period RSI period (typically 14)
 */
const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) {
    return 50; // Default value if not enough data
  }
  
  let gains = 0;
  let losses = 0;
  
  // Calculate average gain and average loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses -= change;
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate remaining values
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    
    if (change >= 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
  }
  
  // Calculate RS and RSI
  const rs = avgGain / (avgLoss === 0 ? 0.01 : avgLoss); // Avoid division by zero
  const rsi = 100 - (100 / (1 + rs));
  
  return Math.round(rsi * 100) / 100;
};

/**
 * Calculate Moving Average Convergence Divergence (MACD)
 * @param prices Array of prices
 */
const calculateMACD = (prices: number[]): string => {
  if (prices.length < 26) {
    return "Neutral"; // Not enough data
  }
  
  // Simple calculation for demo purposes
  const ema12 = prices.slice(-12).reduce((sum, price) => sum + price, 0) / 12;
  const ema26 = prices.slice(-26).reduce((sum, price) => sum + price, 0) / 26;
  const macd = ema12 - ema26;
  
  // Previous values for signal comparison
  const prevEma12 = prices.slice(-13, -1).reduce((sum, price) => sum + price, 0) / 12;
  const prevEma26 = prices.slice(-27, -1).reduce((sum, price) => sum + price, 0) / 26;
  const prevMacd = prevEma12 - prevEma26;
  
  if (macd > 0 && macd > prevMacd) {
    return "Bullish";
  } else if (macd < 0 && macd < prevMacd) {
    return "Bearish";
  } else {
    return "Neutral";
  }
};

/**
 * Simulated sentiment analysis on news and social media
 */
const analyzeSentiment = (): string => {
  const sentiments = ["Positive", "Neutral", "Negative"];
  const weights = [0.5, 0.3, 0.2]; // Biased toward positive for demo
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < sentiments.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return sentiments[i];
    }
  }
  
  return "Neutral";
};

/**
 * Generate a prediction explanation based on indicators
 */
const generateExplanation = (rsi: number, macd: string, sentiment: string): string => {
  let rsiText = "";
  if (rsi > 70) {
    rsiText = "RSI indicates overbought conditions";
  } else if (rsi < 30) {
    rsiText = "RSI indicates oversold conditions";
  } else {
    rsiText = "RSI in neutral territory";
  }
  
  let macdText = "";
  if (macd === "Bullish") {
    macdText = "MACD showing bullish crossover";
  } else if (macd === "Bearish") {
    macdText = "MACD showing bearish crossover";
  } else {
    macdText = "MACD in neutral zone";
  }
  
  let sentimentText = "";
  if (sentiment === "Positive") {
    sentimentText = "positive market sentiment";
  } else if (sentiment === "Negative") {
    sentimentText = "negative market sentiment";
  } else {
    sentimentText = "neutral market sentiment";
  }
  
  // Randomly select news event
  const newsEvents = [
    "recent ETF approval news",
    "regulatory developments",
    "institutional adoption",
    "whale wallet movements",
    "mining difficulty changes"
  ];
  const newsEvent = newsEvents[Math.floor(Math.random() * newsEvents.length)];
  
  return `${rsiText} with ${macdText} and ${sentimentText} from ${newsEvent}.`;
};

/**
 * Main function to generate a mock MCP prediction
 */
export const simulateMCPPrediction = async () => {
  // Mock price data
  const mockPrices = [];
  let price = 60000; // Starting BTC price
  
  for (let i = 0; i < 30; i++) {
    price = price + (Math.random() * 2000 - 1000);
    mockPrices.push(price);
  }
  
  // Calculate indicators
  const rsi = calculateRSI(mockPrices);
  const macd = calculateMACD(mockPrices);
  const sentiment = analyzeSentiment();
  
  // Determine prediction direction and probability
  let probability = 50; // Base probability
  let direction: 'up' | 'down' = 'up';
  
  // Adjust based on RSI
  if (rsi > 70) {
    probability -= 15; // Overbought, likely to go down
    direction = 'down';
  } else if (rsi < 30) {
    probability += 15; // Oversold, likely to go up
    direction = 'up';
  }
  
  // Adjust based on MACD
  if (macd === "Bullish") {
    probability += 10;
    direction = 'up';
  } else if (macd === "Bearish") {
    probability -= 10;
    direction = 'down';
  }
  
  // Adjust based on sentiment
  if (sentiment === "Positive") {
    probability += 7;
    direction = 'up';
  } else if (sentiment === "Negative") {
    probability -= 7;
    direction = 'down';
  }
  
  // Add some randomness
  probability += (Math.random() * 10 - 5);
  
  // Ensure probability is between 50 and 90
  probability = Math.min(90, Math.max(50, probability));
  
  // Generate explanation
  const explanation = generateExplanation(rsi, macd, sentiment);
  
  // Return prediction object
  return {
    coin: "Bitcoin",
    probability: probability,
    direction: direction,
    timeframe: "Next 24 hours",
    explanation: explanation,
    indicators: {
      rsi: rsi,
      macd: macd,
      sentiment: sentiment
    }
  };
};
