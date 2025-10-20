import DeviceCard from './DeviceCard';
import './DeviceList.css';

function DeviceList({ title, devices, onUpdate, onDeviceUpdate, emptyMessage, highlight }) {
  if (devices.length === 0) {
    return (
      <section className="device-section">
        <h2>{title}</h2>
        <div className="empty-message">{emptyMessage}</div>
      </section>
    );
  }

  return (
    <section className={`device-section ${highlight ? 'highlight' : ''}`}>
      <h2>{title}</h2>
      <div className="device-grid">
        {devices.map((device) => (
          <DeviceCard
            key={device.mac}
            device={device}
            onUpdate={onUpdate}
            onDeviceUpdate={onDeviceUpdate}
          />
        ))}
      </div>
    </section>
  );
}

export default DeviceList;