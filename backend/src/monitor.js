import DeviceScanner from './scanner.js';
import DeviceIdentifier from './identifier.js';

class DeviceMonitor {
  constructor() {
    this.scanner = new DeviceScanner();
    this.identifier = new DeviceIdentifier();
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
      
      if (known) {
        onlineKnown.push({
          ...device,
          name: known.name || device.hostname,
          icon: known.icon,
          status: 'online',
          known: true
        });
      } else {
        onlineUnknown.push({
          ...device,
          name: 'Unknown',
          icon: 'default',
          status: 'online',
          known: false
        });
      }
    });

    // find offline known devices
    knownDevices.forEach(known => {
      if (!onlineMacs.has(known.mac_address)) {
        offlineKnown.push({
          ip: '-',
          mac: known.mac_address,
          hostname: '-',
          name: known.name,
          icon: known.icon,
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