import ouiData from 'oui-data' with { type: 'json' };

class MacVendorLookup {
  constructor() {
    this.cache = new Map();
  }

  getVendor(macAddress) {
    if (!macAddress) return 'Unknown';
    
    // normalize MAC address format
    const normalizedMac = macAddress.toUpperCase().replace(/[-:]/g, ':');
    
    // check cache first
    if (this.cache.has(normalizedMac)) {
      return this.cache.get(normalizedMac);
    }

    try {
      // extract OUI (first 3 octets) and convert to format used by oui-data
      const ouiParts = normalizedMac.split(':').slice(0, 3);
      const oui = ouiParts.join('');
      
      // lookup vendor using oui-data
      const vendor = ouiData[oui];
      
      // truncate vendor name to first 2-3 words for better display
      const vendorName = vendor ? this._truncateVendor(vendor) : 'Unknown';
      this.cache.set(normalizedMac, vendorName);
      
      return vendorName;
    } catch (error) {
      console.error('Error looking up MAC vendor:', error);
      return 'Unknown';
    }
  }


  clearCache() {
    this.cache.clear();
  }


  getCacheSize() {
    return this.cache.size;
  }

  _truncateVendor(vendor) {
    if (!vendor) return 'Unknown';
    
    // split by newlines and take first line (company name)
    const firstLine = vendor.split('\n')[0].trim();
    
    // split by spaces and take first 2-3 words
    const words = firstLine.split(' ');
    
    // take first 2-3 words, but avoid common suffixes that don't add value
    const commonSuffixes = ['Inc.', 'Corp.', 'Corporation', 'Ltd.', 'Limited', 'LLC', 'GmbH', 'S.A.', 'S.A.S.', 'S.p.A.', 'Co.', 'Company'];
    
    let truncatedWords = [];
    for (let i = 0; i < Math.min(words.length, 3); i++) {
      const word = words[i];
      truncatedWords.push(word);
      
      // stop if we hit a common suffix (but include it)
      if (commonSuffixes.includes(word)) {
        break;
      }
    }
    
    return truncatedWords.join(' ');
  }
}

export default MacVendorLookup;
