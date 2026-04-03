/**
 * Format duration in seconds to human readable format
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "2:34" for 154 seconds)
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format number as currency
 * @param amount Amount to format
 * @param currency Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format large numbers with K, M, B suffixes
 * @param num Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Truncate address for display
 * @param address Ethereum address
 * @param chars Number of characters to show (default: 4)
 * @returns Truncated address
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Format percentage with optional decimal places
 * @param value Percentage value
 * @param decimals Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}
