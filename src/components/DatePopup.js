import React, { useState } from 'react';
import './DatePopup.css';

function DatePopup({ dateStr, currentStatus, onSave, onClose }) {
  const [eventName, setEventName] = useState(
    currentStatus?.status === 'inne wydarzenie' ? currentStatus.eventName || '' : ''
  );
  const [showEventInput, setShowEventInput] = useState(false);

  const handleSelect = (status) => {
    if (status === 'inne wydarzenie') {
      setShowEventInput(true);
      return;
    }
    onSave(dateStr, { status });
  };

  const handleSaveEvent = () => {
    if (eventName.trim()) {
      onSave(dateStr, { status: 'inne wydarzenie', eventName: eventName.trim() });
    }
  };

  return (
    <div className="date-popup-overlay" onClick={onClose}>
      <div className="date-popup" onClick={(e) => e.stopPropagation()}>
        <h3>{dateStr}</h3>
        <div className="date-popup-options">
          <button className="pasuje" onClick={() => handleSelect('pasuje')}>
            Pasuje
          </button>
          <button className="nie-pasuje" onClick={() => handleSelect('nie pasuje')}>
            Nie pasuje
          </button>
          <button className="inne" onClick={() => setShowEventInput(true)}>
            Inne wydarzenie
          </button>
        </div>
        {showEventInput && (
          <div>
            <input
              className="event-name-input"
              type="text"
              placeholder="Nazwa wydarzenia..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              autoFocus
            />
            <button
              className="pasuje"
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem', border: '2px solid #27ae60', borderRadius: '8px', background: '#27ae60', color: 'white', cursor: 'pointer', fontSize: '0.95rem' }}
              onClick={handleSaveEvent}
              disabled={!eventName.trim()}
            >
              Zapisz
            </button>
          </div>
        )}
        <button className="cancel-btn" onClick={onClose} style={{ marginTop: '0.5rem' }}>
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default DatePopup;
