import DeviceScanner from './scanner.js';
import DeviceIdentifier from './identifier.js';
import MacVendorLookup from './utils/macLookup.js';

class DeviceMonitor {
  constructor() {
    this.scanner = new DeviceScanner();
    this.identifier = new DeviceIdentifier();
    this.macLookup = new MacVendorLookup();
  }

  async getDeviceStatus() {
    const scannedDevices = await this.scanner.scan();
    const knownDevices = this.identifier.getKnownDevices();

    const onlineKnown = [];
    const onlineUnknown = [];
    const offlineKnown = [];

    // map scanned devices
    const onlineMacs = new Set(scannedDevices.map(d => d.mac));

    // process scanned devices
    scannedDevices.forEach(device => {
      const known = this.identifier.isKnown(device.mac);
      const vendor = this.macLookup.getVendor(device.mac);
      
      if (known) {
        onlineKnown.push({
          ...device,
          name: known.name || device.hostname,
          icon: known.icon,
          vendor: known.vendor || vendor,
          status: 'online',
          known: true
        });
      } else {
        onlineUnknown.push({
          ...device,
          name: 'Unknown',
          icon: 'default',
          vendor: vendor,
          status: 'online',
          known: false
        });
      }
    });

    // find offline known devices
    knownDevices.forEach(known => {
      if (!onlineMacs.has(known.mac_address)) {
        const vendor = this.macLookup.getVendor(known.mac_address);
        offlineKnown.push({
          ip: '-',
          mac: known.mac_address,
          hostname: '-',
          name: known.name,
          icon: known.icon,
          vendor: known.vendor || vendor,
          status: 'offline',
          known: true
        });
      }
    });

    return {
      onlineKnown,
      onlineUnknown,
      offlineKnown
    };
  }
}

export default DeviceMonitor;