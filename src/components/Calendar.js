import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';
import DatePopup from './DatePopup';
import './Calendar.css';

const MONTHS_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
];
const DAYS_PL = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];

const START_DATE = new Date(2026, 4, 1);  // May 1
const END_DATE = new Date(2026, 9, 1);    // Oct 1

function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function Calendar({ uid, nickname }) {
  const [currentMonth, setCurrentMonth] = useState(4); // May = index 4
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const calRef = ref(db, 'calendar');
    const unsub = onValue(calRef, (snapshot) => {
      setCalendarData(snapshot.val() || {});
    });
    return () => unsub();
  }, []);

  const handleSave = (dateStr, entry) => {
    set(ref(db, `calendar/${dateStr}/${uid}`), { ...entry, nickname });
    setSelectedDate(null);
  };

  const getDaysInMonth = (month) => {
    return new Date(2026, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (month) => {
    const day = new Date(2026, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const isInRange = (month, day) => {
    const date = new Date(2026, month, day);
    return date >= START_DATE && date <= END_DATE;
  };

  const renderMonth = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfWeek(currentMonth);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="day-cell empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if (!isInRange(currentMonth, day)) {
        cells.push(<div key={day} className="day-cell empty" />);
        continue;
      }

      const dateStr = formatDate(2026, currentMonth, day);
      const dayData = calendarData[dateStr] || {};
      const entries = Object.entries(dayData);
      const maxDots = 5;

      cells.push(
        <div
          key={day}
          className="day-cell"
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className="day-number">{day}</div>
          <div className="day-dots">
            {entries.slice(0, maxDots).map(([entryUid, entry]) => {
              const status = typeof entry === 'object' ? entry.status : entry;
              const cls = status === 'pasuje' ? 'pasuje' :
                          status === 'nie pasuje' ? 'nie-pasuje' : 'inne';
              return <div key={entryUid} className={`day-dot ${cls}`} title={entry.nickname || entryUid} />;
            })}
            {entries.length > maxDots && (
              <span className="day-overflow">+{entries.length - maxDots}</span>
            )}
          </div>
        </div>
      );
    }

    return cells;
  };

  const canGoPrev = currentMonth > 4;
  const canGoNext = currentMonth < 9;

  const currentStatus = selectedDate
    ? calendarData[selectedDate]?.[uid] || null
    : null;

  return (
    <div>
      <div className="calendar-nav">
        <button onClick={() => setCurrentMonth(m => m - 1)} disabled={!canGoPrev}>
          ← Poprzedni
        </button>
        <span className="month-label">{MONTHS_PL[currentMonth]} 2026</span>
        <button onClick={() => setCurrentMonth(m => m + 1)} disabled={!canGoNext}>
          Następny →
        </button>
      </div>

      <div className="calendar-grid">
        {DAYS_PL.map(d => <div key={d} className="day-header">{d}</div>)}
        {renderMonth()}
      </div>

      {selectedDate && (
        <DatePopup
          dateStr={selectedDate}
          currentStatus={currentStatus}
          dayEntries={calendarData[selectedDate] || null}
          onSave={handleSave}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}

export default Calendar;
