
/**
 * Formats a number as currency (USD)
 */
export const formatCurrency = (value: number): string => {
  // Format very large numbers with abbreviations
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  
  // Format regular numbers
  if (value >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  
  // Small numbers need more decimal places
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 8
  }).format(value);
};

/**
 * Formats a number as a percentage
 */
export const formatPercentage = (value: number): string => {
  const formattedValue = value.toFixed(2);
  const sign = value >= 0 ? '+' : '';
  return `${sign}${formattedValue}%`;
};

/**
 * Formats a timestamp as a date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};
