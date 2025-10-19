import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// get local network range
export async function getNetworkRange() {
  try {
    const { stdout } = await execAsync("ip route | grep default | awk '{print $3}'");
    const gateway = stdout.trim();
    const networkRange = gateway.substring(0, gateway.lastIndexOf('.')) + '.0/24';
    return networkRange;
  } catch (error) {
    console.error('error getting network range:', error.message);
    throw error;
  }
}

// get mac address for ip using arp
export async function getMacFromArp(ip) {
  try {
    const { stdout } = await execAsync(`arp -n ${ip} | awk '{print $3}' | tail -1`);
    const mac = stdout.trim();
    if (mac && mac.includes(':')) {
      return mac.toUpperCase();
    }
    return null;
  } catch (error) {
    return null;
  }
}