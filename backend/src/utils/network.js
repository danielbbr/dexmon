import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// get local network range
export async function getNetworkRange() {
  try {
    // Get the default route with lowest metric (preferred route)
    // Use 'head -1' to get only the first/best default route
    const { stdout } = await execAsync(
      "ip route | grep default | head -1 | awk '{print $3}'",
    );
    const gateway = stdout.trim();

    if (!gateway) {
      throw new Error("No default gateway found");
    }

    // Validate it's a valid IP address
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(gateway)) {
      throw new Error(`Invalid gateway IP: ${gateway}`);
    }

    // Calculate network range (assumes /24)
    const networkRange =
      gateway.substring(0, gateway.lastIndexOf(".")) + ".0/24";

    console.log(`Detected gateway: ${gateway}`);
    console.log(`Scanning network range: ${networkRange}`);

    return networkRange;
  } catch (error) {
    console.error("error getting network range:", error.message);
    throw error;
  }
}

// get mac address for ip using arp
export async function getMacFromArp(ip) {
  try {
    // Validate IP address to prevent command injection
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      console.log(`Invalid IP format for ARP lookup: ${ip}`);
      return null;
    }

    const { stdout } = await execAsync(
      `arp -n ${ip} | awk '{print $3}' | tail -1`,
    );
    const mac = stdout.trim();

    if (mac && mac.includes(":")) {
      return mac.toUpperCase();
    }
    return null;
  } catch (error) {
    return null;
  }
}
