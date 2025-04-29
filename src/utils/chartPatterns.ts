
// Pattern detection utility for cryptocurrency charts

/**
 * Detects chart patterns in price data
 * @param prices Array of price data points
 * @returns Array of detected patterns with confidence levels and locations
 */
export interface ChartPattern {
  type: 'double-top' | 'double-bottom' | 'head-and-shoulders' | 'inverse-head-and-shoulders' | 'triangle' | 'channel';
  confidence: number; // 0-100
  startIndex: number;
  endIndex: number;
  description: string;
}

export function detectPatterns(prices: number[]): ChartPattern[] {
  const patterns: ChartPattern[] = [];
  
  if (prices.length < 20) return patterns;
  
  // Double Top Detection
  const doubleTop = detectDoubleTop(prices);
  if (doubleTop) patterns.push(doubleTop);
  
  // Double Bottom Detection
  const doubleBottom = detectDoubleBottom(prices);
  if (doubleBottom) patterns.push(doubleBottom);
  
  // Head and Shoulders Detection
  const headAndShoulders = detectHeadAndShoulders(prices);
  if (headAndShoulders) patterns.push(headAndShoulders);
  
  // Inverse Head and Shoulders Detection
  const inverseHeadAndShoulders = detectInverseHeadAndShoulders(prices);
  if (inverseHeadAndShoulders) patterns.push(inverseHeadAndShoulders);
  
  // Add more pattern detections as needed
  
  return patterns;
}

function detectDoubleTop(prices: number[]): ChartPattern | null {
  const len = prices.length;
  if (len < 20) return null;
  
  // Simple detection algorithm: Find two peaks with similar heights
  const peaks: number[] = [];
  
  // Find local maxima
  for (let i = 5; i < len - 5; i++) {
    if (
      prices[i] > prices[i - 1] &&
      prices[i] > prices[i - 2] &&
      prices[i] > prices[i - 3] &&
      prices[i] > prices[i + 1] &&
      prices[i] > prices[i + 2] &&
      prices[i] > prices[i + 3]
    ) {
      peaks.push(i);
    }
  }
  
  // Check for double top pattern
  if (peaks.length >= 2) {
    for (let i = 0; i < peaks.length - 1; i++) {
      const peak1 = peaks[i];
      const peak2 = peaks[i + 1];
      
      // Check distance between peaks
      if (peak2 - peak1 >= 10) {
        // Check similarity in height
        const priceRatio = Math.min(prices[peak1], prices[peak2]) / Math.max(prices[peak1], prices[peak2]);
        
        if (priceRatio > 0.95) {
          // Check for trough between peaks
          let hasTrough = false;
          let minVal = Number.MAX_VALUE;
          let minIdx = -1;
          
          for (let j = peak1 + 1; j < peak2; j++) {
            if (prices[j] < minVal) {
              minVal = prices[j];
              minIdx = j;
            }
          }
          
          if (minVal < prices[peak1] * 0.97 && minVal < prices[peak2] * 0.97) {
            hasTrough = true;
          }
          
          if (hasTrough) {
            const confidence = 70 + (priceRatio * 30); // 70-100 based on similarity
            
            return {
              type: 'double-top',
              confidence: confidence > 100 ? 100 : confidence,
              startIndex: Math.max(0, peak1 - 5),
              endIndex: Math.min(len - 1, peak2 + 5),
              description: 'Double Top pattern detected - potential bearish reversal'
            };
          }
        }
      }
    }
  }
  
  return null;
}

function detectDoubleBottom(prices: number[]): ChartPattern | null {
  const len = prices.length;
  if (len < 20) return null;
  
  // Similar to double top but looking for troughs
  const troughs: number[] = [];
  
  // Find local minima
  for (let i = 5; i < len - 5; i++) {
    if (
      prices[i] < prices[i - 1] &&
      prices[i] < prices[i - 2] &&
      prices[i] < prices[i - 3] &&
      prices[i] < prices[i + 1] &&
      prices[i] < prices[i + 2] &&
      prices[i] < prices[i + 3]
    ) {
      troughs.push(i);
    }
  }
  
  // Check for double bottom pattern
  if (troughs.length >= 2) {
    for (let i = 0; i < troughs.length - 1; i++) {
      const trough1 = troughs[i];
      const trough2 = troughs[i + 1];
      
      // Check distance between troughs
      if (trough2 - trough1 >= 10) {
        // Check similarity in height
        const priceRatio = Math.min(prices[trough1], prices[trough2]) / Math.max(prices[trough1], prices[trough2]);
        
        if (priceRatio > 0.95) {
          // Check for peak between troughs
          let hasPeak = false;
          let maxVal = -Number.MAX_VALUE;
          let maxIdx = -1;
          
          for (let j = trough1 + 1; j < trough2; j++) {
            if (prices[j] > maxVal) {
              maxVal = prices[j];
              maxIdx = j;
            }
          }
          
          if (maxVal > prices[trough1] * 1.03 && maxVal > prices[trough2] * 1.03) {
            hasPeak = true;
          }
          
          if (hasPeak) {
            const confidence = 70 + (priceRatio * 30);
            
            return {
              type: 'double-bottom',
              confidence: confidence > 100 ? 100 : confidence,
              startIndex: Math.max(0, trough1 - 5),
              endIndex: Math.min(len - 1, trough2 + 5),
              description: 'Double Bottom pattern detected - potential bullish reversal'
            };
          }
        }
      }
    }
  }
  
  return null;
}

function detectHeadAndShoulders(prices: number[]): ChartPattern | null {
  const len = prices.length;
  if (len < 30) return null;
  
  // Find local maxima
  const peaks: number[] = [];
  for (let i = 5; i < len - 5; i++) {
    if (
      prices[i] > prices[i - 1] &&
      prices[i] > prices[i - 2] &&
      prices[i] > prices[i + 1] &&
      prices[i] > prices[i + 2]
    ) {
      peaks.push(i);
    }
  }
  
  // Need at least 3 peaks for head and shoulders
  if (peaks.length < 3) return null;
  
  // Check for head and shoulders pattern
  for (let i = 0; i < peaks.length - 2; i++) {
    const shoulder1 = peaks[i];
    const head = peaks[i + 1];
    const shoulder2 = peaks[i + 2];
    
    // Check distances between peaks
    if (head - shoulder1 >= 5 && shoulder2 - head >= 5 && shoulder2 - shoulder1 <= 50) {
      // Check if middle peak is higher
      if (prices[head] > prices[shoulder1] && prices[head] > prices[shoulder2]) {
        // Check if shoulder heights are similar
        const shoulderRatio = Math.min(prices[shoulder1], prices[shoulder2]) / Math.max(prices[shoulder1], prices[shoulder2]);
        
        if (shoulderRatio > 0.8) {
          const confidence = 60 + (shoulderRatio * 40);
          
          return {
            type: 'head-and-shoulders',
            confidence: confidence > 100 ? 100 : confidence,
            startIndex: Math.max(0, shoulder1 - 5),
            endIndex: Math.min(len - 1, shoulder2 + 5),
            description: 'Head and Shoulders pattern detected - potential bearish reversal'
          };
        }
      }
    }
  }
  
  return null;
}

function detectInverseHeadAndShoulders(prices: number[]): ChartPattern | null {
  const len = prices.length;
  if (len < 30) return null;
  
  // Find local minima
  const troughs: number[] = [];
  for (let i = 5; i < len - 5; i++) {
    if (
      prices[i] < prices[i - 1] &&
      prices[i] < prices[i - 2] &&
      prices[i] < prices[i + 1] &&
      prices[i] < prices[i + 2]
    ) {
      troughs.push(i);
    }
  }
  
  // Need at least 3 troughs for inverse head and shoulders
  if (troughs.length < 3) return null;
  
  // Check for inverse head and shoulders pattern
  for (let i = 0; i < troughs.length - 2; i++) {
    const shoulder1 = troughs[i];
    const head = troughs[i + 1];
    const shoulder2 = troughs[i + 2];
    
    // Check distances between troughs
    if (head - shoulder1 >= 5 && shoulder2 - head >= 5 && shoulder2 - shoulder1 <= 50) {
      // Check if middle trough is lower
      if (prices[head] < prices[shoulder1] && prices[head] < prices[shoulder2]) {
        // Check if shoulder depths are similar
        const shoulderRatio = Math.min(prices[shoulder1], prices[shoulder2]) / Math.max(prices[shoulder1], prices[shoulder2]);
        
        if (shoulderRatio > 0.8) {
          const confidence = 60 + (shoulderRatio * 40);
          
          return {
            type: 'inverse-head-and-shoulders',
            confidence: confidence > 100 ? 100 : confidence,
            startIndex: Math.max(0, shoulder1 - 5),
            endIndex: Math.min(len - 1, shoulder2 + 5),
            description: 'Inverse Head and Shoulders pattern detected - potential bullish reversal'
          };
        }
      }
    }
  }
  
  return null;
}
