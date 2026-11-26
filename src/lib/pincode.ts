/**
 * Indian Postal PIN Code Verification and Deliverability Helper
 * Integrates with India Post API with instant offline fallback
 */

export interface PincodeInfo {
  valid: boolean;
  deliverable: boolean;
  pincode: string;
  city?: string;
  district?: string;
  state?: string;
  estimatedDays?: string;
  deliveryType?: string;
  error?: string;
}

const REGION_MAP: Record<string, { state: string; days: string }> = {
  '1': { state: 'Northern Region (Delhi, Punjab, Haryana, HP, J&K)', days: '3-5 business days' },
  '2': { state: 'Northern Region (UP, Uttarakhand)', days: '3-5 business days' },
  '3': { state: 'Western Region (Rajasthan, Gujarat)', days: '3-5 business days' },
  '4': { state: 'Western/Central Region (Maharashtra, Goa, MP, CG)', days: '3-5 business days' },
  '5': { state: 'Southern Region (AP, Telangana, Karnataka)', days: '4-5 business days' },
  '6': { state: 'Southern Region (Tamil Nadu, Kerala)', days: '4-5 business days' },
  '7': { state: 'Eastern/North-Eastern Region (WB, Sikkim, NE)', days: '2-4 business days' },
  '8': { state: 'Eastern Region (Bihar, Jharkhand)', days: '3-4 business days' },
};

// In-memory cache for validated pincodes to avoid repeated external network requests
const PINCODE_CACHE = new Map<string, PincodeInfo>();

export async function verifyPincode(pincodeRaw: string): Promise<PincodeInfo> {
  const pincode = (pincodeRaw || '').trim();

  // Indian PIN codes are exactly 6 digits, starting from 1 to 9 (cannot start with 0)
  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return {
      valid: false,
      deliverable: false,
      pincode,
      error: 'Invalid PIN code. Please enter a valid 6-digit Indian Postal PIN code.',
    };
  }

  // Check in-memory cache
  const cached = PINCODE_CACHE.get(pincode);
  if (cached) {
    return cached;
  }

  // Check for local Himalayan express delivery zones:
  // 734xxx (Siliguri, Darjeeling, Kurseong, Mirik)
  // 735xxx (Jalpaiguri, Alipurduar, Cooch Behar)
  // 737xxx (Sikkim: Gangtok, Namchi, Pelling)
  const isLocalHimalayan = /^73[457]/.test(pincode);

  try {
    // Attempt real-time lookup via Postal PIN code API with a 2.5-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
        const primary = data[0].PostOffice[0];
        const district = primary.District || '';
        const state = primary.State || '';
        const city = primary.Block && primary.Block !== 'NA' ? primary.Block : district;

        const result: PincodeInfo = {
          valid: true,
          deliverable: true,
          pincode,
          city: city || district,
          district,
          state,
          estimatedDays: isLocalHimalayan ? '1 - 2 business days' : '3 - 5 business days',
          deliveryType: isLocalHimalayan ? 'Local Himalayan Express Dispatch' : 'Pan-India Express Courier',
        };
        PINCODE_CACHE.set(pincode, result);
        return result;
      }
    }
  } catch (err) {
    // Timeout or network glitch - fallback cleanly to regional prefix heuristics
  }

  // Graceful offline fallback: Valid 6-digit format with regional heuristics
  const firstDigit = pincode[0];
  const region = REGION_MAP[firstDigit] || { state: 'India', days: '3-5 business days' };

  const fallbackResult: PincodeInfo = {
    valid: true,
    deliverable: true,
    pincode,
    city: isLocalHimalayan ? 'Siliguri & Hills Region' : undefined,
    state: region.state,
    estimatedDays: isLocalHimalayan ? '1 - 2 business days' : region.days,
    deliveryType: isLocalHimalayan ? 'Local Himalayan Express Dispatch' : 'Pan-India Express Courier',
  };
  PINCODE_CACHE.set(pincode, fallbackResult);
  return fallbackResult;
}
