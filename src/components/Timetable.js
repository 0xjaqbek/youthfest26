import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';
import './Timetable.css';

const SLOTS = [];
for (let h = 10; h < 22; h++) {
  SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  SLOTS.push(`${String(h).padStart(2, '0')}:30`);
}

function Timetable({ uid, nickname }) {
  const [timetableData, setTimetableData] = useState({});
  const [editingSlot, setEditingSlot] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const ttRef = ref(db, 'timetable');
    const unsub = onValue(ttRef, (snapshot) => {
      setTimetableData(snapshot.val() || {});
    });
    return () => unsub();
  }, []);

  const handleSave = (slot) => {
    if (!editText.trim()) {
      // Clear entry
      set(ref(db, `timetable/${slot}`), null);
    } else {
      set(ref(db, `timetable/${slot}`), {
        text: editText.trim(),
        setBy: uid,
        setByName: nickname,
        updatedAt: Date.now(),
      });
    }
    setEditingSlot(null);
    setEditText('');
  };

  const handleEdit = (slot) => {
    const existing = timetableData[slot];
    setEditText(existing ? existing.text : '');
    setEditingSlot(slot);
  };

  const handleKeyDown = (e, slot) => {
    if (e.key === 'Enter') {
      handleSave(slot);
    } else if (e.key === 'Escape') {
      setEditingSlot(null);
      setEditText('');
    }
  };

  return (
    <div className="timetable">
      <div className="timetable-grid">
        <div className="timetable-header">
          <span className="tt-col-time">Godzina</span>
          <span className="tt-col-event">Wydarzenie</span>
        </div>
        {SLOTS.map((slot) => {
          const entry = timetableData[slot];
          const isEditing = editingSlot === slot;
          const isHour = slot.endsWith(':00');

          return (
            <div
              key={slot}
              className={`timetable-row ${isHour ? 'hour' : 'half'} ${entry ? 'filled' : ''}`}
              onClick={() => !isEditing && handleEdit(slot)}
            >
              <span className="tt-col-time">{slot}</span>
              <span className="tt-col-event">
                {isEditing ? (
                  <input
                    type="text"
                    className="tt-edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, slot)}
                    onBlur={() => handleSave(slot)}
                    placeholder="Wpisz wydarzenie..."
                    autoFocus
                  />
                ) : entry ? (
                  <div className="tt-entry">
                    <span className="tt-entry-text">{entry.text}</span>
                    <span className="tt-entry-meta">({entry.setByName})</span>
                  </div>
                ) : (
                  <span className="tt-empty">—</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <p className="tt-hint">Kliknij na slot, aby dodać lub edytować wydarzenie. Enter = zapisz, Esc = anuluj.</p>
    </div>
  );
}

export default Timetable;
