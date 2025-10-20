import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

function IconSelector({ selected, onSelect, onClose, triggerRef }) {
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target) && 
          triggerRef?.current && !triggerRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose, triggerRef]);

  useEffect(() => {
    if (selectorRef.current && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const selector = selectorRef.current;
      
      // Position the selector below the trigger
      selector.style.position = 'fixed';
      selector.style.top = `${triggerRect.bottom + 8}px`;
      selector.style.left = `${triggerRect.left}px`;
      
      // Adjust if it would go off screen
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const selectorWidth = 300;
      const selectorHeight = 320; // Reduced height to ensure it fits better
      
      if (triggerRect.left + selectorWidth > viewportWidth) {
        selector.style.left = `${viewportWidth - selectorWidth - 16}px`;
      }
      
      if (triggerRect.bottom + selectorHeight > viewportHeight) {
        selector.style.top = `${triggerRect.top - selectorHeight - 8}px`;
      }
      
      // Ensure the selector doesn't go above the viewport
      const finalTop = parseInt(selector.style.top);
      if (finalTop < 16) {
        selector.style.top = '16px';
      }
    }
  }, [triggerRef]);

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  const handleSelectorClick = (e) => {
    e.stopPropagation();
  };

  return createPortal(
    <>
      <div className="icon-selector-overlay" onClick={handleOverlayClick} />
      <div className="icon-selector" ref={selectorRef} onClick={handleSelectorClick}>
        <div className="icon-selector-header">
          <h4>Select Icon</h4>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="icon-grid">
          {AVAILABLE_ICONS.map((icon) => (
            <button
              key={icon.id}
              className={`icon-option ${selected === icon.id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(icon.id);
              }}
              title={icon.label}
            >
              <span className="icon-emoji">{icon.emoji}</span>
              <span className="icon-label">{icon.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>,
    document.body
  );
}

export default IconSelector;