import './IconSelector.css';

const AVAILABLE_ICONS = [
  { id: 'default', emoji: '🖥️', label: 'Default' },
  { id: 'phone', emoji: '📱', label: 'Phone' },
  { id: 'laptop', emoji: '💻', label: 'Laptop' },
  { id: 'desktop', emoji: '🖥️', label: 'Desktop' },
  { id: 'tablet', emoji: '📱', label: 'Tablet' },
  { id: 'tv', emoji: '📺', label: 'TV' },
  { id: 'watch', emoji: '⌚', label: 'Watch' },
  { id: 'camera', emoji: '📷', label: 'Camera' },
  { id: 'speaker', emoji: '🔊', label: 'Speaker' },
  { id: 'router', emoji: '📡', label: 'Router' },
  { id: 'printer', emoji: '🖨️', label: 'Printer' },
  { id: 'game', emoji: '🎮', label: 'Game' },
  { id: 'server', emoji: '🖥️', label: 'Server' }
];

function IconSelector({ selected, onSelect, onClose }) {
  return (
    <>
      <div className="icon-selector-overlay" onClick={onClose} />
      <div className="icon-selector">
        <div className="icon-selector-header">
          <h4>Select Icon</h4>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="icon-grid">
          {AVAILABLE_ICONS.map((icon) => (
            <button
              key={icon.id}
              className={`icon-option ${selected === icon.id ? 'selected' : ''}`}
              onClick={() => onSelect(icon.id)}
              title={icon.label}
            >
              <span className="icon-emoji">{icon.emoji}</span>
              <span className="icon-label">{icon.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default IconSelector;