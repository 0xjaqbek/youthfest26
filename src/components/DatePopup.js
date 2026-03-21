import React, { useState } from 'react';
import './DatePopup.css';

function DatePopup({ dateStr, currentStatus, dayEntries, onSave, onClose }) {
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

  const entries = dayEntries ? Object.entries(dayEntries) : [];

  return (
    <div className="date-popup-overlay" onClick={onClose}>
      <div className="date-popup" onClick={(e) => e.stopPropagation()}>
        <h3>{dateStr}</h3>

        {entries.length > 0 && (
          <div className="date-popup-entries">
            <div className="date-popup-entries-title">Wpisy:</div>
            {entries.map(([entryUid, entry]) => {
              const status = entry.status || entry;
              const cls = status === 'pasuje' ? 'pasuje' :
                          status === 'nie pasuje' ? 'nie-pasuje' : 'inne';
              return (
                <div key={entryUid} className="date-popup-entry">
                  <strong>{entry.nickname || entryUid}</strong>
                  <span className={`status-badge ${cls}`}>{status}</span>
                  {entry.eventName && <span className="entry-event-name">— {entry.eventName}</span>}
                </div>
              );
            })}
          </div>
        )}

        {currentStatus && (
          <div className="date-popup-your-status">
            Twój obecny wpis: <strong>{currentStatus.status}</strong>
            {currentStatus.eventName && <span> — {currentStatus.eventName}</span>}
          </div>
        )}

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
              className="save-event-btn"
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
