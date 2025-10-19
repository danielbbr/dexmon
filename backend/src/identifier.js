import db from './config/database.js';

class DeviceIdentifier {
  addDevice(macAddress, name = '', icon = 'default') {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO known_devices (mac_address, name, icon)
      VALUES (?, ?, ?)
    `);
    stmt.run(macAddress, name, icon);
  }

  updateDevice(macAddress, name, icon) {
    const stmt = db.prepare(`
      UPDATE known_devices 
      SET name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
      WHERE mac_address = ?
    `);
    stmt.run(name, icon, macAddress);
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