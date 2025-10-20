import db from './config/database.js';
import MacVendorLookup from './utils/macLookup.js';

class DeviceIdentifier {
  constructor() {
    this.macLookup = new MacVendorLookup();
  }

  addDevice(macAddress, name = '', icon = 'default') {
    const vendor = this.macLookup.getVendor(macAddress);
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO known_devices (mac_address, name, icon, vendor)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(macAddress, name, icon, vendor);
  }

  updateDevice(macAddress, name, icon) {
    const vendor = this.macLookup.getVendor(macAddress);
    const stmt = db.prepare(`
      UPDATE known_devices 
      SET name = ?, icon = ?, vendor = ?, updated_at = CURRENT_TIMESTAMP
      WHERE mac_address = ?
    `);
    stmt.run(name, icon, vendor, macAddress);
  }

  getKnownDevices() {
    const stmt = db.prepare('SELECT * FROM known_devices');
    return stmt.all();
  }

  isKnown(macAddress) {
    const stmt = db.prepare('SELECT * FROM known_devices WHERE mac_address = ?');
    return stmt.get(macAddress);
  }

  deleteDevice(macAddress) {
    const stmt = db.prepare('DELETE FROM known_devices WHERE mac_address = ?');
    stmt.run(macAddress);
  }
}

export default DeviceIdentifier;