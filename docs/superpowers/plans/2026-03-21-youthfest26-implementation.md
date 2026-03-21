# YouthFest26 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a shared calendar + todo + notification app for YouthFest 2026, deployed to GitHub Pages with Firebase Realtime Database backend.

**Architecture:** Create React App serves a single-page app with four sections: nickname entry (localStorage + Firebase), calendar grid (May–Oct 2026), shared append-only todo list, and notification system with real-time badge. Firebase Realtime Database stores all data with open read/write rules. Deployed to GitHub Pages via `gh-pages`.

**Tech Stack:** React 18, Firebase 9+ (Realtime Database), Create React App, gh-pages

**Spec:** `docs/superpowers/specs/2026-03-21-youthfest26-design.md`

---

## File Structure

```
youthfest26/
  .env.example                  # Template for Firebase env vars
  .gitignore                    # Already exists, update for CRA
  package.json                  # Recreated by CRA, add gh-pages + homepage
  public/
    index.html                  # CRA default (replace existing broken one)
  src/
    index.js                    # CRA entry point
    index.css                   # Global styles
    firebase.js                 # Firebase init from env vars
    App.js                      # Root component, nickname gate, section layout
    App.css                     # App-level styles
    components/
      NicknamePrompt.js         # Nickname entry modal
      NicknamePrompt.css
      Calendar.js               # Month grid with navigation
      Calendar.css
      DatePopup.js              # Popup for setting date status
      DatePopup.css
      TodoList.js               # Shared append-only todo list
      TodoList.css
      NotificationBell.js       # Bell icon with unread count badge
      NotificationBell.css
      NotificationPopup.js      # Popup showing unread notifications
      NotificationPopup.css
      SendNotification.js       # Form to send manual notification
      SendNotification.css
```

---

## Chunk 1: Project Setup & Firebase

### Task 1: Reinitialize as Create React App

The existing files are broken boilerplate. We need a proper CRA setup.

**Files:**
- Recreate: `package.json`
- Recreate: `public/index.html`
- Recreate: `src/index.js`
- Create: `src/index.css`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] **Step 1: Initialize CRA in a temp directory and copy over**

We can't run `npx create-react-app` in an existing repo with files, so we'll manually set up CRA-compatible files.

Replace `package.json` with:
```json
{
  "name": "youthfest26",
  "version": "1.0.0",
  "private": true,
  "homepage": "https://0xjaqbek.github.io/youthfest26",
  "dependencies": {
    "firebase": "^10.7.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "devDependencies": {
    "gh-pages": "^6.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  },
  "browserslist": {
    "production": [">0.2%", "not dead", "not op_mini all"],
    "development": ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
  }
}
```

- [ ] **Step 2: Replace `public/index.html`**

```html
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="YouthFest 2026 - Kalendarz i lista zadań" />
    <title>YouthFest 2026</title>
</head>
<body>
    <noscript>Musisz włączyć JavaScript aby uruchomić tę aplikację.</noscript>
    <div id="root"></div>
</body>
</html>
```

- [ ] **Step 3: Replace `src/index.js`**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 4: Create `src/index.css`**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}
```

- [ ] **Step 5: Create `.env.example`**

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_DATABASE_URL=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

- [ ] **Step 6: Update `.gitignore` for CRA**

Replace with standard CRA gitignore plus `.env`:
```
/node_modules
/.pnp
.pnp.js
/coverage
/build
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

- [ ] **Step 7: Run `npm install` and verify `npm start` works**

Run: `npm install`
Run: `npm start` (should open dev server — will show empty page, that's fine)

- [ ] **Step 8: Commit**

```bash
git add package.json public/index.html src/index.js src/index.css .env.example .gitignore
git commit -m "feat: reinitialize as Create React App with proper tooling"
```

### Task 2: Firebase Configuration

**Files:**
- Rewrite: `src/firebase.js`

- [ ] **Step 1: Rewrite `src/firebase.js` to use env vars**

```js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
```

- [ ] **Step 2: Commit**

```bash
git add src/firebase.js
git commit -m "feat: firebase config reading from .env variables"
```

---

## Chunk 2: Nickname System & App Shell

### Task 3: Nickname Prompt Component

**Files:**
- Create: `src/components/NicknamePrompt.js`
- Create: `src/components/NicknamePrompt.css`

- [ ] **Step 1: Create `src/components/` directory**

- [ ] **Step 2: Create `src/components/NicknamePrompt.js`**

```jsx
import React, { useState } from 'react';
import './NicknamePrompt.css';

function NicknamePrompt({ onNicknameSet }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onNicknameSet(trimmed);
    }
  };

  return (
    <div className="nickname-overlay">
      <div className="nickname-modal">
        <h2>Witaj w YouthFest 2026!</h2>
        <p>Podaj swój nick, aby kontynuować:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Twój nick..."
            maxLength={30}
            autoFocus
          />
          <button type="submit" disabled={!name.trim()}>
            Wejdź
          </button>
        </form>
      </div>
    </div>
  );
}

export default NicknamePrompt;
```

- [ ] **Step 3: Create `src/components/NicknamePrompt.css`**

```css
.nickname-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.nickname-modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nickname-modal h2 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.nickname-modal p {
  margin-bottom: 1rem;
  color: #666;
}

.nickname-modal input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.nickname-modal input:focus {
  border-color: #3498db;
}

.nickname-modal button {
  padding: 0.75rem 2rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.nickname-modal button:hover:not(:disabled) {
  background: #2980b9;
}

.nickname-modal button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/NicknamePrompt.js src/components/NicknamePrompt.css
git commit -m "feat: add NicknamePrompt component with Polish UI"
```

### Task 4: App Shell with Nickname Gate

**Files:**
- Rewrite: `src/App.js`
- Rewrite: `src/App.css`

- [ ] **Step 1: Rewrite `src/App.js`**

```jsx
import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './firebase';
import NicknamePrompt from './components/NicknamePrompt';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import NotificationBell from './components/NotificationBell';
import './App.css';

function App() {
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('youthfest_nickname') || '';
  });

  const handleNicknameSet = (name) => {
    localStorage.setItem('youthfest_nickname', name);
    setNickname(name);
    // Register in Firebase
    set(ref(db, `users/${name}`), true);
  };

  const handleChangeNickname = () => {
    localStorage.removeItem('youthfest_nickname');
    setNickname('');
  };

  useEffect(() => {
    if (nickname) {
      set(ref(db, `users/${nickname}`), true);
    }
  }, [nickname]);

  if (!nickname) {
    return <NicknamePrompt onNicknameSet={handleNicknameSet} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>YouthFest 2026</h1>
        <div className="header-right">
          <NotificationBell nickname={nickname} />
          <span className="nickname-display">
            {nickname}
            <button onClick={handleChangeNickname} className="change-nick-btn">
              Zmień nick
            </button>
          </span>
        </div>
      </header>
      <main className="app-main">
        <section className="section">
          <h2>Kalendarz</h2>
          <Calendar nickname={nickname} />
        </section>
        <section className="section">
          <h2>Lista zadań</h2>
          <TodoList nickname={nickname} />
        </section>
      </main>
    </div>
  );
}

export default App;
```

Note: `Calendar`, `TodoList`, and `NotificationBell` don't exist yet — they'll be stub components initially (created in next tasks). The app won't compile until those are created.

- [ ] **Step 2: Rewrite `src/App.css`**

```css
.app {
  min-height: 100vh;
}

.app-header {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.app-header h1 {
  font-size: 1.5rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nickname-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.change-nick-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.change-nick-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.app-main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1.5rem;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}
```

- [ ] **Step 3: Create stub components so the app compiles**

Create minimal stub files for `Calendar.js`, `TodoList.js`, and `NotificationBell.js` (just returning `null` or a placeholder `<div>`). These will be implemented in subsequent tasks.

`src/components/Calendar.js`:
```jsx
function Calendar({ nickname }) {
  return <div>Kalendarz — w budowie</div>;
}
export default Calendar;
```

`src/components/TodoList.js`:
```jsx
function TodoList({ nickname }) {
  return <div>Lista zadań — w budowie</div>;
}
export default TodoList;
```

`src/components/NotificationBell.js`:
```jsx
function NotificationBell({ nickname }) {
  return <span>🔔</span>;
}
export default NotificationBell;
```

- [ ] **Step 4: Run `npm start` and verify app loads with nickname prompt**

Expected: Dev server starts, shows nickname modal. After entering a name, shows app shell with header, "Kalendarz" and "Lista zadań" sections with placeholder text.

- [ ] **Step 5: Commit**

```bash
git add src/App.js src/App.css src/components/Calendar.js src/components/TodoList.js src/components/NotificationBell.js
git commit -m "feat: app shell with nickname gate and section layout"
```

---

## Chunk 3: Calendar Component

### Task 5: Calendar Grid

**Files:**
- Rewrite: `src/components/Calendar.js`
- Create: `src/components/Calendar.css`
- Create: `src/components/DatePopup.js`
- Create: `src/components/DatePopup.css`

- [ ] **Step 1: Create `src/components/Calendar.css`**

```css
.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.calendar-nav button {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.calendar-nav button:hover:not(:disabled) {
  background: #2980b9;
}

.calendar-nav button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.calendar-nav .month-label {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-grid .day-header {
  text-align: center;
  font-weight: bold;
  padding: 0.5rem;
  background: #ecf0f1;
  font-size: 0.8rem;
  color: #666;
}

.calendar-grid .day-cell {
  min-height: 60px;
  border: 1px solid #ecf0f1;
  padding: 4px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
}

.calendar-grid .day-cell:hover {
  background: #eaf2f8;
}

.calendar-grid .day-cell.empty {
  cursor: default;
  background: transparent;
  border: none;
}

.calendar-grid .day-cell.empty:hover {
  background: transparent;
}

.day-number {
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
}

.day-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 2px;
}

.day-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.day-dot.pasuje {
  background: #27ae60;
}

.day-dot.nie-pasuje {
  background: #e74c3c;
}

.day-dot.inne {
  background: #f39c12;
}

.day-overflow {
  font-size: 0.65rem;
  color: #999;
}

.date-summary {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.date-summary h4 {
  margin-bottom: 0.5rem;
}

.date-summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}

.date-summary-item .status-badge {
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
}

.status-badge.pasuje {
  background: #27ae60;
}

.status-badge.nie-pasuje {
  background: #e74c3c;
}

.status-badge.inne {
  background: #f39c12;
}
```

- [ ] **Step 2: Create `src/components/DatePopup.css`**

```css
.date-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
}

.date-popup {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 350px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.date-popup h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.date-popup-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.date-popup-options button {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.15s;
}

.date-popup-options button:hover {
  border-color: #3498db;
}

.date-popup-options button.pasuje {
  border-color: #27ae60;
  color: #27ae60;
}

.date-popup-options button.pasuje:hover {
  background: #27ae60;
  color: white;
}

.date-popup-options button.nie-pasuje {
  border-color: #e74c3c;
  color: #e74c3c;
}

.date-popup-options button.nie-pasuje:hover {
  background: #e74c3c;
  color: white;
}

.date-popup-options button.inne {
  border-color: #f39c12;
  color: #f39c12;
}

.date-popup-options button.inne:hover {
  background: #f39c12;
  color: white;
}

.event-name-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #f39c12;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  outline: none;
}

.date-popup .cancel-btn {
  width: 100%;
  padding: 0.5rem;
  background: #ecf0f1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
}
```

- [ ] **Step 3: Create `src/components/DatePopup.js`**

```jsx
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
            ✅ Pasuje
          </button>
          <button className="nie-pasuje" onClick={() => handleSelect('nie pasuje')}>
            ❌ Nie pasuje
          </button>
          <button className="inne" onClick={() => setShowEventInput(true)}>
            📅 Inne wydarzenie
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
              style={{ width: '100%', marginTop: '0.5rem' }}
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
```

- [ ] **Step 4: Rewrite `src/components/Calendar.js` with full implementation**

```jsx
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

const START_DATE = new Date(2026, 4, 1); // May 1
const END_DATE = new Date(2026, 9, 1);   // Oct 1

function formatDate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function Calendar({ nickname }) {
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
    set(ref(db, `calendar/${dateStr}/${nickname}`), entry);
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

    // Empty cells before first day
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
            {entries.slice(0, maxDots).map(([user, entry]) => {
              const status = typeof entry === 'object' ? entry.status : entry;
              const cls = status === 'pasuje' ? 'pasuje' :
                          status === 'nie pasuje' ? 'nie-pasuje' : 'inne';
              return <div key={user} className={`day-dot ${cls}`} title={user} />;
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
    ? calendarData[selectedDate]?.[nickname] || null
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
          onSave={handleSave}
          onClose={() => setSelectedDate(null)}
        />
      )}

      {selectedDate && calendarData[selectedDate] && (
        <div className="date-summary">
          <h4>Wpisy na {selectedDate}:</h4>
          {Object.entries(calendarData[selectedDate]).map(([user, entry]) => {
            const status = entry.status || entry;
            const cls = status === 'pasuje' ? 'pasuje' :
                        status === 'nie pasuje' ? 'nie-pasuje' : 'inne';
            return (
              <div key={user} className="date-summary-item">
                <strong>{user}</strong>
                <span className={`status-badge ${cls}`}>{status}</span>
                {entry.eventName && <span>— {entry.eventName}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Calendar;
```

- [ ] **Step 5: Verify calendar renders and navigation works**

Run: `npm start`
Expected: Calendar grid for May 2026, navigation between months May–Oct.

- [ ] **Step 6: Commit**

```bash
git add src/components/Calendar.js src/components/Calendar.css src/components/DatePopup.js src/components/DatePopup.css
git commit -m "feat: calendar component with month grid, date popup, Firebase sync"
```

---

## Chunk 4: Todo List

### Task 6: Todo List Component

**Files:**
- Rewrite: `src/components/TodoList.js`
- Create: `src/components/TodoList.css`

- [ ] **Step 1: Create `src/components/TodoList.css`**

```css
.todo-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.todo-form input[type="text"] {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
}

.todo-form input[type="text"]:focus {
  border-color: #3498db;
}

.todo-assign-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.todo-assign-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.todo-assign-list label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

.todo-assign-list label:has(input:checked) {
  background: #eaf2f8;
  border-color: #3498db;
}

.todo-form button {
  padding: 0.75rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.todo-form button:hover:not(:disabled) {
  background: #219a52;
}

.todo-form button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.todo-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.todo-item {
  padding: 1rem;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  background: white;
}

.todo-item.done {
  opacity: 0.6;
}

.todo-item.done .todo-text {
  text-decoration: line-through;
}

.todo-text {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.todo-meta {
  font-size: 0.8rem;
  color: #999;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.todo-assigned {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.todo-assigned-tag {
  background: #eaf2f8;
  color: #2980b9;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.todo-done-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.todo-done-btn:hover {
  background: #219a52;
}

.todo-done-info {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #27ae60;
}
```

- [ ] **Step 2: Rewrite `src/components/TodoList.js`**

```jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { db } from '../firebase';
import './TodoList.css';

function TodoList({ nickname }) {
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);

  useEffect(() => {
    const todosRef = ref(db, 'todos');
    const unsub = onValue(todosRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([id, todo]) => ({ id, ...todo }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setTodos(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsers(Object.keys(data));
    });
    return () => unsub();
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTodo = {
      text: text.trim(),
      assignedTo: assignedTo.length > 0 ? assignedTo : [],
      addedBy: nickname,
      createdAt: Date.now(),
      done: false,
      doneBy: null,
      doneAt: null,
    };

    const todosRef = ref(db, 'todos');
    push(todosRef, newTodo).then((newRef) => {
      // Create notifications for assigned users
      if (assignedTo.length > 0) {
        assignedTo.forEach((user) => {
          const notifRef = ref(db, `notifications/${user}`);
          push(notifRef, {
            message: `Przypisano ci zadanie: ${newTodo.text}`,
            from: nickname,
            createdAt: Date.now(),
            read: false,
          });
        });
      }
    });

    setText('');
    setAssignedTo([]);
  };

  const handleToggleAssign = (user) => {
    setAssignedTo((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleMarkDone = (todoId) => {
    update(ref(db, `todos/${todoId}`), {
      done: true,
      doneBy: nickname,
      doneAt: Date.now(),
    });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nowe zadanie..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div>
          <div className="todo-assign-label">Przypisz do:</div>
          <div className="todo-assign-list">
            {users.map((user) => (
              <label key={user}>
                <input
                  type="checkbox"
                  checked={assignedTo.includes(user)}
                  onChange={() => handleToggleAssign(user)}
                />
                {user}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={!text.trim()}>
          Dodaj zadanie
        </button>
      </form>

      <div className="todo-items">
        {todos.map((todo) => (
          <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''}`}>
            <div className="todo-text">{todo.text}</div>
            {todo.assignedTo && todo.assignedTo.length > 0 && (
              <div className="todo-assigned">
                {todo.assignedTo.map((user) => (
                  <span key={user} className="todo-assigned-tag">{user}</span>
                ))}
              </div>
            )}
            <div className="todo-meta">
              <span>Dodał/a: {todo.addedBy}</span>
              <span>• {formatDate(todo.createdAt)}</span>
            </div>
            {todo.done ? (
              <div className="todo-done-info">
                ✅ Zrobione przez {todo.doneBy} — {formatDate(todo.doneAt)}
              </div>
            ) : (
              <button className="todo-done-btn" onClick={() => handleMarkDone(todo.id)}>
                Oznacz jako zrobione
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList;
```

- [ ] **Step 3: Verify todo list renders, adding and marking done works**

Run: `npm start`
Expected: Todo form visible, can add tasks with user assignment. Tasks appear in reverse chronological order. Can mark as done.

- [ ] **Step 4: Commit**

```bash
git add src/components/TodoList.js src/components/TodoList.css
git commit -m "feat: shared append-only todo list with user assignment and done marking"
```

---

## Chunk 5: Notification System

### Task 7: Notification Bell & Popup

**Files:**
- Rewrite: `src/components/NotificationBell.js`
- Create: `src/components/NotificationBell.css`
- Create: `src/components/NotificationPopup.js`
- Create: `src/components/NotificationPopup.css`

- [ ] **Step 1: Create `src/components/NotificationBell.css`**

```css
.notification-bell {
  position: relative;
  cursor: pointer;
  font-size: 1.3rem;
  background: none;
  border: none;
  color: white;
  padding: 0.25rem;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: #e74c3c;
  color: white;
  font-size: 0.65rem;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
```

- [ ] **Step 2: Rewrite `src/components/NotificationBell.js`**

```jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import NotificationPopup from './NotificationPopup';
import './NotificationBell.css';

function NotificationBell({ nickname }) {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!nickname) return;
    const notifRef = ref(db, `notifications/${nickname}`);
    const unsub = onValue(notifRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([id, n]) => ({ id, ...n }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotifications(list);

      // Auto-show popup if there are unread notifications
      const hasUnread = list.some((n) => !n.read);
      if (hasUnread) {
        setShowPopup(true);
      }
    });
    return () => unsub();
  }, [nickname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <button className="notification-bell" onClick={() => setShowPopup(true)}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      {showPopup && (
        <NotificationPopup
          nickname={nickname}
          notifications={notifications}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default NotificationBell;
```

- [ ] **Step 3: Create `src/components/NotificationPopup.css`**

```css
.notif-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
}

.notif-popup {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 450px;
  width: 90%;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.notif-popup h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.notif-empty {
  color: #999;
  text-align: center;
  padding: 1rem;
}

.notif-item {
  padding: 0.75rem;
  border: 1px solid #ecf0f1;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.notif-item.unread {
  background: #eaf2f8;
  border-color: #3498db;
}

.notif-message {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.notif-meta {
  font-size: 0.8rem;
  color: #999;
}

.notif-ok-btn {
  margin-top: 0.25rem;
  padding: 0.3rem 0.75rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.notif-ok-btn:hover {
  background: #2980b9;
}

.notif-close-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background: #ecf0f1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
}

.notif-close-btn:hover {
  background: #ddd;
}
```

- [ ] **Step 4: Create `src/components/NotificationPopup.js`**

```jsx
import React from 'react';
import { ref, update } from 'firebase/database';
import { db } from '../firebase';
import './NotificationPopup.css';

function NotificationPopup({ nickname, notifications, onClose }) {
  const handleMarkRead = (notifId) => {
    update(ref(db, `notifications/${nickname}/${notifId}`), { read: true });
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-popup" onClick={(e) => e.stopPropagation()}>
        <h3>Powiadomienia</h3>
        {notifications.length === 0 ? (
          <div className="notif-empty">Brak powiadomień</div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
              <div className="notif-message">{n.message}</div>
              <div className="notif-meta">
                Od: {n.from} • {formatDate(n.createdAt)}
              </div>
              {!n.read && (
                <button className="notif-ok-btn" onClick={() => handleMarkRead(n.id)}>
                  OK
                </button>
              )}
            </div>
          ))
        )}
        <button className="notif-close-btn" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
}

export default NotificationPopup;
```

- [ ] **Step 5: Commit**

```bash
git add src/components/NotificationBell.js src/components/NotificationBell.css src/components/NotificationPopup.js src/components/NotificationPopup.css
git commit -m "feat: notification bell with badge and popup for reading notifications"
```

### Task 8: Send Notification Component

**Files:**
- Create: `src/components/SendNotification.js`
- Create: `src/components/SendNotification.css`
- Modify: `src/App.js` — add SendNotification section

- [ ] **Step 1: Create `src/components/SendNotification.css`**

```css
.send-notif-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.send-notif-form textarea {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  outline: none;
}

.send-notif-form textarea:focus {
  border-color: #3498db;
}

.send-notif-target {
  font-size: 0.85rem;
  color: #666;
}

.send-notif-users {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.send-notif-users label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
}

.send-notif-users label:has(input:checked) {
  background: #eaf2f8;
  border-color: #3498db;
}

.send-all-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
}

.send-notif-form button[type="submit"] {
  padding: 0.75rem;
  background: #8e44ad;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.send-notif-form button[type="submit"]:hover:not(:disabled) {
  background: #7d3c98;
}

.send-notif-form button[type="submit"]:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
```

- [ ] **Step 2: Create `src/components/SendNotification.js`**

```jsx
import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase';
import './SendNotification.css';

function SendNotification({ nickname }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      setUsers(Object.keys(data));
    });
    return () => unsub();
  }, []);

  const handleToggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const targets = sendToAll ? users : selectedUsers;
    if (targets.length === 0) return;

    const notif = {
      message: message.trim(),
      from: nickname,
      createdAt: Date.now(),
      read: false,
    };

    targets.forEach((user) => {
      push(ref(db, `notifications/${user}`), notif);
    });

    setMessage('');
    setSelectedUsers([]);
    setSendToAll(false);
  };

  const canSend = message.trim() && (sendToAll || selectedUsers.length > 0);

  return (
    <form className="send-notif-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Treść powiadomienia..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <div className="send-notif-target">
        <label className="send-all-label">
          <input
            type="checkbox"
            checked={sendToAll}
            onChange={(e) => setSendToAll(e.target.checked)}
          />
          Wyślij do wszystkich
        </label>
        {!sendToAll && (
          <div className="send-notif-users">
            {users.map((user) => (
              <label key={user}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user)}
                  onChange={() => handleToggleUser(user)}
                />
                {user}
              </label>
            ))}
          </div>
        )}
      </div>
      <button type="submit" disabled={!canSend}>
        Wyślij powiadomienie
      </button>
    </form>
  );
}

export default SendNotification;
```

- [ ] **Step 3: Update `src/App.js` to include SendNotification section**

Add import at top:
```jsx
import SendNotification from './components/SendNotification';
```

Add section in `<main>` after the todo list section:
```jsx
<section className="section">
  <h2>Powiadomienia</h2>
  <SendNotification nickname={nickname} />
</section>
```

- [ ] **Step 4: Verify notifications work end-to-end**

Run: `npm start`
Expected: Can send notification, bell shows badge, popup shows unread notifications, OK marks as read.

- [ ] **Step 5: Commit**

```bash
git add src/components/SendNotification.js src/components/SendNotification.css src/App.js
git commit -m "feat: send notification form with user/broadcast targeting"
```

---

## Chunk 6: Final Polish & Deployment Setup

### Task 9: Verify Full App & Clean Up

- [ ] **Step 1: Remove `whatisabout.txt` from repo (development artifact)**

```bash
git rm whatisabout.txt
```

- [ ] **Step 2: Run `npm start` and manually verify all features**

Checklist:
- Nickname prompt appears on first visit
- Nickname stored in localStorage (persists on reload)
- "Zmień nick" works
- Calendar grid shows May–Oct with navigation
- Date popup with 3 options works
- Date entries show as colored dots
- Date summary shows on click
- Todo list: add task, assign users, mark done
- Notifications: auto-created on task assignment
- Send notification to specific users and all
- Bell badge updates in real-time
- Notification popup shows and marks read

- [ ] **Step 3: Commit cleanup**

```bash
git commit -m "chore: remove development artifact whatisabout.txt"
```

### Task 10: Deployment Configuration

- [ ] **Step 1: Verify `homepage` in `package.json` is correct**

Should be: `"homepage": "https://0xjaqbek.github.io/youthfest26"`

- [ ] **Step 2: Test production build**

Run: `npm run build`
Expected: Build completes successfully, `build/` directory created.

- [ ] **Step 3: Commit any final changes**

- [ ] **Step 4: Deploy to GitHub Pages**

Run: `npm run deploy`
Expected: `gh-pages` branch created/updated, site live at the homepage URL.

Note: User must add Firebase credentials to `.env` before deployment for the app to connect to the database.
