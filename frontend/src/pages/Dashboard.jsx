// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { devices, auth } from "../services/api";
import DeviceList from "../components/DeviceList";
import "./Dashboard.css";

function Dashboard() {
  const [deviceData, setDeviceData] = useState({
    onlineKnown: [],
    onlineUnknown: [],
    offlineKnown: [],
  });
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const loadDevices = async (isScanning = false) => {
    if (isScanning) {
      setScanning(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await devices.getAll();
      setDeviceData(response.data);
    } catch (error) {
      console.error("error loading devices:", error);
    } finally {
      if (isScanning) {
        setScanning(false);
      } else {
        setLoading(false);
      }
    }
  };

  const updateDevice = (mac, name, icon) => {
    setDeviceData((prevData) => {
      // Find the device in unknown list
      const unknownDeviceIndex = prevData.onlineUnknown.findIndex(
        (device) => device.mac === mac,
      );

      if (unknownDeviceIndex !== -1) {
        // Device is in unknown list, move it to known list
        const deviceToMove = prevData.onlineUnknown[unknownDeviceIndex];
        const updatedDevice = {
          ...deviceToMove,
          name,
          icon,
          known: true,
        };

        return {
          onlineKnown: [...prevData.onlineKnown, updatedDevice],
          onlineUnknown: prevData.onlineUnknown.filter(
            (device) => device.mac !== mac,
          ),
          offlineKnown: prevData.offlineKnown,
        };
      } else {
        // Device is already known, just update it
        const updateDeviceInList = (deviceList) =>
          deviceList.map((device) =>
            device.mac === mac ? { ...device, name, icon } : device,
          );

        return {
          onlineKnown: updateDeviceInList(prevData.onlineKnown),
          onlineUnknown: updateDeviceInList(prevData.onlineUnknown),
          offlineKnown: updateDeviceInList(prevData.offlineKnown),
        };
      }
    });
  };

  const forgetDevice = (mac) => {
    setDeviceData((prevData) => {
      // Find the device in known lists
      const onlineKnownIndex = prevData.onlineKnown.findIndex(
        (device) => device.mac === mac,
      );
      const offlineKnownIndex = prevData.offlineKnown.findIndex(
        (device) => device.mac === mac,
      );

      if (onlineKnownIndex !== -1) {
        // Device is online known, move it to unknown
        const deviceToMove = prevData.onlineKnown[onlineKnownIndex];
        const forgottenDevice = {
          ...deviceToMove,
          name: "Unknown",
          icon: "default",
          known: false,
        };

        return {
          onlineKnown: prevData.onlineKnown.filter(
            (device) => device.mac !== mac,
          ),
          onlineUnknown: [...prevData.onlineUnknown, forgottenDevice],
          offlineKnown: prevData.offlineKnown,
        };
      } else if (offlineKnownIndex !== -1) {
        // Device is offline known, just remove it (offline devices don't go to unknown)
        return {
          onlineKnown: prevData.onlineKnown,
          onlineUnknown: prevData.onlineUnknown,
          offlineKnown: prevData.offlineKnown.filter(
            (device) => device.mac !== mac,
          ),
        };
      }

      return prevData; // No changes if device not found
    });
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  useEffect(() => {
    loadDevices();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>dexmon</h1>
          <div className="header-actions">
            <button
              className="scan-button"
              onClick={() => loadDevices(true)}
              disabled={scanning}
            >
              {scanning ? "Scanning..." : "🔄 Refresh Network"}
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <DeviceList
          title="Online - Known Devices"
          devices={deviceData.onlineKnown}
          onUpdate={loadDevices}
          onDeviceUpdate={updateDevice}
          onForgetDevice={forgetDevice}
          emptyMessage="No known devices online"
        />

        <DeviceList
          title="Online - Unknown Devices"
          devices={deviceData.onlineUnknown}
          onUpdate={loadDevices}
          onDeviceUpdate={updateDevice}
          onForgetDevice={forgetDevice}
          emptyMessage="No unknown devices found"
          highlight
        />

        <DeviceList
          title="Offline - Known Devices"
          devices={deviceData.offlineKnown}
          onUpdate={loadDevices}
          onDeviceUpdate={updateDevice}
          onForgetDevice={forgetDevice}
          emptyMessage="All known devices are online"
        />
      </main>
    </div>
  );
}

export default Dashboard;
