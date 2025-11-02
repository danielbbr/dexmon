import { execAsync } from "./utils/exec.js";
import { getNetworkRange, getMacFromArp } from "./utils/network.js";

class DeviceScanner {
  async scan() {
    try {
      const networkRange = await getNetworkRange();

      // First, refresh the ARP cache by doing a ping sweep
      // This ensures the ARP table is populated before we query it
      await this._refreshArpCache(networkRange);

      // Now scan with nmap
      const { stdout } = await execAsync(
        `sudo nmap -sn -T4 ${networkRange} -oG -`,
      );

      const devices = [];
      const lines = stdout.split("\n");

      for (const line of lines) {
        if (line.includes("Host:") && !line.includes("Status: Down")) {
          const device = await this._parseLine(line);
          if (device) {
            devices.push(device);
            console.log(
              `Found device: ${device.ip} (${device.mac}) - ${device.hostname}`,
            );
          }
        }
      }

      console.log(`Total devices found: ${devices.length}`);
      return devices;
    } catch (error) {
      console.error("scan error:", error.message);
      return [];
    }
  }

  async _refreshArpCache(networkRange) {
    try {
      // Use multiple methods to ensure ARP cache is populated
      console.log("Method 1: Using nmap ARP ping...");

      // ARP ping is most reliable for populating ARP cache on local network
      // -PR forces ARP ping, -n skips DNS resolution for speed
      await execAsync(
        `sudo nmap -sn -n --send-ip ${networkRange} 2>&1 || true`,
      );

      // Give ARP cache a moment to populate
      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("Method 2: Checking ARP cache...");
      const { stdout } = await execAsync(
        `ip neigh show | grep -c REACHABLE || echo 0`,
      );
      console.log(`ARP cache has ${stdout.trim()} REACHABLE entries`);
    } catch (error) {
      console.log(
        "Note: ARP cache refresh encountered an issue, continuing anyway",
      );
    }
  }

  async _parseLine(line) {
    // Extract IP address
    const ipMatch = line.match(/Host: (\d+\.\d+\.\d+\.\d+)/);
    if (!ipMatch) return null;

    const ip = ipMatch[1];

    // Extract MAC address from nmap output (if available)
    const macMatch = line.match(/MAC Address: ([0-9A-F:]{17})/i);
    let mac = macMatch ? macMatch[1].toUpperCase() : null;

    // Extract hostname
    let hostname = null;
    const hostnameMatch = line.match(/\(([^)]+)\)/);
    if (hostnameMatch) {
      hostname = hostnameMatch[1];
    }

    // If no MAC from nmap, get it from ARP table
    if (!mac) {
      mac = await getMacFromArp(ip);
    }

    // If still no MAC, try ip neigh (alternative to arp command)
    if (!mac) {
      mac = await this._getMacFromIpNeigh(ip);
    }

    // If we still don't have a MAC address, skip this device
    if (!mac) {
      console.log(`No MAC found for ${ip}, skipping`);
      return null;
    }

    return {
      ip,
      mac,
      hostname: hostname || "-",
    };
  }

  async _getMacFromIpNeigh(ip) {
    try {
      // Validate IP address
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ip)) {
        return null;
      }

      const { stdout } = await execAsync(
        `ip neigh show ${ip} | awk '{print $5}' | head -1`,
      );
      const mac = stdout.trim();

      // Validate MAC address format
      if (mac && /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac)) {
        return mac.toUpperCase();
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

export default DeviceScanner;
