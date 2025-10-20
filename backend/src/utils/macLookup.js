import ouiData from 'oui-data' with { type: 'json' };

class MacVendorLookup {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get vendor information from MAC address
   * @param {string} macAddress - MAC address in format XX:XX:XX:XX:XX:XX
   * @returns {string} Vendor name or 'Unknown'
   */
  getVendor(macAddress) {
    if (!macAddress) return 'Unknown';
    
    // Normalize MAC address format
    const normalizedMac = macAddress.toUpperCase().replace(/[-:]/g, ':');
    
    // Check cache first
    if (this.cache.has(normalizedMac)) {
      return this.cache.get(normalizedMac);
    }

    try {
      // Extract OUI (first 3 octets) and convert to format used by oui-data
      const ouiParts = normalizedMac.split(':').slice(0, 3);
      const oui = ouiParts.join('');
      
      // Lookup vendor using oui-data
      const vendor = ouiData[oui];
      
      // Truncate vendor name to first 2-3 words for better display
      const vendorName = vendor ? this._truncateVendor(vendor) : 'Unknown';
      this.cache.set(normalizedMac, vendorName);
      
      return vendorName;
    } catch (error) {
      console.error('Error looking up MAC vendor:', error);
      return 'Unknown';
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize() {
    return this.cache.size;
  }

  /**
   * Truncate vendor name to first 2-3 words for better display
   * @param {string} vendor - Full vendor name
   * @returns {string} Truncated vendor name
   */
  _truncateVendor(vendor) {
    if (!vendor) return 'Unknown';
    
    // Split by newlines and take first line (company name)
    const firstLine = vendor.split('\n')[0].trim();
    
    // Split by spaces and take first 2-3 words
    const words = firstLine.split(' ');
    
    // Take first 2-3 words, but avoid common suffixes that don't add value
    const commonSuffixes = ['Inc.', 'Corp.', 'Corporation', 'Ltd.', 'Limited', 'LLC', 'GmbH', 'S.A.', 'S.A.S.', 'S.p.A.', 'Co.', 'Company'];
    
    let truncatedWords = [];
    for (let i = 0; i < Math.min(words.length, 3); i++) {
      const word = words[i];
      truncatedWords.push(word);
      
      // Stop if we hit a common suffix (but include it)
      if (commonSuffixes.includes(word)) {
        break;
      }
    }
    
    return truncatedWords.join(' ');
  }
}

export default MacVendorLookup;
