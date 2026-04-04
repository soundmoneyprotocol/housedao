export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Check for common mobile patterns
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent.toLowerCase());
}

export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}
