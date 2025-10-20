// src/components/DeviceCard.jsx
import { useState, useRef } from 'react';
import { devices as devicesApi } from '../services/api';
import IconSelector from './IconSelector';
import './DeviceCard.css';

function DeviceCard({ device, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(device.name || '');
  const [selectedIcon, setSelectedIcon] = useState(device.icon || 'default');
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [saving, setSaving] = useState(false);
  const iconTriggerRef = useRef(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      await devicesApi.update(device.mac, name, selectedIcon);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('error updating device:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(device.name || '');
    setSelectedIcon(device.icon || 'default');
    setIsEditing(false);
    setShowIconSelector(false);
  };

  return (
    <div className={`device-card ${device.status}`}>
      <div className="device-header">
        <div className="device-icon-container">
          <span 
            ref={iconTriggerRef}
            className="device-icon"
            onClick={() => isEditing && setShowIconSelector(!showIconSelector)}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            {getIconEmoji(selectedIcon)}
          </span>
          {showIconSelector && (
            <IconSelector
              selected={selectedIcon}
              triggerRef={iconTriggerRef}
              onSelect={(icon) => {
                setSelectedIcon(icon);
                setShowIconSelector(false);
              }}
              onClose={() => setShowIconSelector(false)}
            />
          )}
        </div>
        
        <div className="device-info">
          {isEditing ? (
            <input
              type="text"
              className="device-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Device name"
              autoFocus
            />
          ) : (
            <h3 className="device-name">{device.name}</h3>
          )}
          <p className="device-hostname">{device.hostname}</p>
        </div>

        {!isEditing && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            ✏️
          </button>
        )}
      </div>

      <div className="device-details">
        <div className="detail-row">
          <span className="detail-label">IP:</span>
          <span className="detail-value">{device.ip}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">MAC:</span>
          <span className="detail-value">{device.mac}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Vendor:</span>
          <span className="detail-value">{device.vendor || 'Unknown'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className={`status-badge ${device.status}`}>
            {device.status === 'online' ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Known:</span>
          <span className={`known-badge ${device.known ? 'yes' : 'no'}`}>
            {device.known ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {isEditing && (
        <div className="device-actions">
          <button 
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            className="cancel-button"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

const AVAILABLE_ICONS = [
  { id: 'default', emoji: '🔳', label: 'Default' },
  { id: 'phone', emoji: '📱', label: 'Phone' },
  { id: 'laptop', emoji: '💻', label: 'Laptop' },
  { id: 'desktop', emoji: '🖥️', label: 'Desktop' },
  { id: 'tablet', emoji: '📟', label: 'Tablet' },
  { id: 'tv', emoji: '📺', label: 'TV' },
  { id: 'watch', emoji: '⌚', label: 'Watch' },
  { id: 'camera', emoji: '📷', label: 'Camera' },
  { id: 'speaker', emoji: '🔊', label: 'Speaker' },
  { id: 'router', emoji: '📡', label: 'Router' },
  { id: 'printer', emoji: '🖨️', label: 'Printer' },
  { id: 'game', emoji: '🎮', label: 'Game' },
  { id: 'server', emoji: '🗄️', label: 'Server' }
];

const ICON_LOOKUP = Object.fromEntries(
  AVAILABLE_ICONS.map(item => [item.id, item.emoji])
);

function getIconEmoji(iconId) {
  return ICON_LOOKUP[iconId] || ICON_LOOKUP['default'];
}



export default DeviceCard;