/**
 * Returns true if current is less than required.
 * Assumes simple x.y.z format
 */
export function isVersionOlder(current: string, required: string): boolean {
  if (!current || !required) return false;
  
  const currentParts = current.split('.').map(Number);
  const requiredParts = required.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] || 0;
    const r = requiredParts[i] || 0;
    
    if (c < r) return true;
    if (c > r) return false;
  }
  
  return false;
}
