import { execAsync } from './utils/exec.js';
import { getNetworkRange, getMacFromArp } from './utils/network.js';

class DeviceScanner {
  async scan() {
    try {
      const networkRange = await getNetworkRange();
      console.log('Scanning network range:', networkRange);
      
      // scan network with nmap - more aggressive options
      const { stdout } = await execAsync(`sudo nmap -sn -T4 -PR ${networkRange} -oG -`);
      console.log('Nmap raw output:', stdout);
      
      const devices = [];
      const lines = stdout.split('\n');

      for (const line of lines) {
        if (line.includes('Host:') && !line.includes('Status: Down')) {
          console.log('Processing line:', line);
          const device = await this._parseLine(line);
          if (device) {
            devices.push(device);
            console.log('Added device:', device);
          }
        }
      }

      console.log(`Total devices found: ${devices.length}`);
      return devices;
    } catch (error) {
      console.error('scan error:', error.message);
      return [];
    }
  }

  async _parseLine(line) {
    const ipMatch = line.match(/Host: (\d+\.\d+\.\d+\.\d+)/);
    const macMatch = line.match(/MAC Address: ([0-9A-F:]{17})/i);
    
    if (!ipMatch) return null;

    const ip = ipMatch[1];
    let mac = macMatch ? macMatch[1].toUpperCase() : null;
    let hostname = null;

    // get hostname
    const hostnameMatch = line.match(/\(([^)]+)\)/);
    if (hostnameMatch) {
      hostname = hostnameMatch[1];
    }

    // if no mac, try to get it from arp
    if (!mac) {
      mac = await getMacFromArp(ip);
    }

    // if still no mac, create a placeholder or skip
    if (!mac) {
      console.log(`No MAC found for ${ip}, skipping`);
      return null;
    }

    return {
      ip,
      mac,
      hostname: hostname || '-'
    };
  }
}

export default DeviceScanner;