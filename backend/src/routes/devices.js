import express from 'express';
import DeviceMonitor from '../monitor.js';
import DeviceIdentifier from '../identifier.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const monitor = new DeviceMonitor();
const identifier = new DeviceIdentifier();

router.get('/devices', authenticateToken, async (req, res) => {
  try {
    const devices = await monitor.getDeviceStatus();
    res.json(devices);
  } catch (error) {
    console.error('device status error:', error);
    res.status(500).json({ error: 'failed to get device status' });
  }
});

router.post('/devices/update', authenticateToken, (req, res) => {
  try {
    const { mac, name, icon } = req.body;

    if (!mac) {
      return res.status(400).json({ error: 'mac address required' });
    }

    const known = identifier.isKnown(mac);
    
    if (known) {
      identifier.updateDevice(mac, name || '', icon || 'default');
    } else {
      identifier.addDevice(mac, name || '', icon || 'default');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('update error:', error);
    res.status(500).json({ error: 'failed to update device' });
  }
});

router.post('/scan', authenticateToken, async (req, res) => {
  try {
    const devices = await monitor.getDeviceStatus();
    res.json(devices);
  } catch (error) {
    console.error('scan error:', error);
    res.status(500).json({ error: 'scan failed' });
  }
});

export default router;