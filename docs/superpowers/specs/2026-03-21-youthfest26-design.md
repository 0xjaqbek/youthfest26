# YouthFest26 — Calendar & Todo App Design

## Overview

A shared calendar and task management app for organizing YouthFest 2026. Users access via link (no authentication), enter a nickname, and can mark date availability, manage shared tasks, and send notifications. All UI in Polish.

## Tech Stack

- **React 18** via Create React App (`react`, `react-dom`, `react-scripts`)
- **Firebase Realtime Database** (free tier, `firebase` package)
- **GitHub Pages** deployment via `gh-pages`
- Firebase credentials stored in `.env` (gitignored)
- No `react-calendar` library — custom month grid component

## Section 1: Nickname Entry

- On first visit, user enters a nickname — stored in `localStorage`
- Header shows current nickname with a "Zmien nick" (change nickname) option
- Nickname is the sole identifier — no authentication
- Nicknames are registered in Firebase `users/` node for assignment dropdowns
- **Known limitation**: nicknames are not unique-enforced. If two people use the same name, their entries overlap. Accepted tradeoff for simplicity (no auth).

## Section 2: Calendar (1 maja – 1 pazdziernika 2026, inclusive)

- Date range: May 1, 2026 through October 1, 2026 (both endpoints included)
- **Custom month grid layout** with prev/next navigation (Maj through Pazdziernik)
- Click a date -> popup with 3 options:
  - **Pasuje** (available) — green indicator
  - **Nie pasuje** (unavailable) — red indicator
  - **Inne wydarzenie** — yellow indicator, with text input for event name
- Each date cell shows colored dots for all users who marked that date (max 5 dots + "+N" overflow)
- Clicking a date shows a summary list: who marked what
- Users can only set/change their own entries (matched by nickname)
- Cannot modify or delete other users' entries

## Section 3: Todo List (Shared, Append-Only)

- Shared across all users — anyone with the link can view and add
- **No delete, no edit** — entries are permanent
- Display order: newest first
- Add a todo with:
  - Task description (text input)
  - Assigned to: multi-select from known nicknames
  - Added by: auto-filled from current nickname
- Each entry displays: task text, assigned users, who added it, timestamp
- Entries can be marked "Zrobione" (done) by anyone — records who marked it and when
- Marking done is **permanent** (no undo), consistent with append-only philosophy
- Done entries stay visible (strikethrough style) — not removable

## Section 4: Notification System

- **Auto-notifications**: When a todo is assigned to user(s), a **separate notification is created in each assigned user's node**
- **Broadcast notifications**: When sending to "all users", a separate notification is copied into **each currently registered user's node** at send time (simple, avoids shared read-state issues)
- **Manual notifications**: Any user can send a custom message to:
  - Specific user(s) — selected from nickname list
  - All users — broadcast (copied to each user's node)
- **On app visit**: If unread notifications exist, a popup modal appears showing them
  - Each notification shows: message, from whom, timestamp
  - User confirms/dismisses with "OK" button (marks as read)
- **Real-time badge**: A bell icon with unread count in the header, updated via Firebase listener (not just on visit)
- "Wyslij powiadomienie" (Send notification) button in the UI

## Firebase Data Structure

```
youthfest26/
  calendar/
    "2026-05-15"/
      "Kuba"/
        status: "pasuje"
      "Ania"/
        status: "inne wydarzenie"
        eventName: "Urodziny"
  todos/
    "-Nabc123"/
      text: "Zarezerwuj sale"
      assignedTo: ["Kuba", "Ania"]
      addedBy: "Marek"
      createdAt: 1716000000
      done: false
      doneBy: null
      doneAt: null
  notifications/
    "Kuba"/
      "-Nxyz789"/
        message: "Przypisano ci zadanie: Zarezerwuj sale"
        from: "Marek"
        createdAt: 1716000000
        read: false
  users/
    "Kuba": true
    "Ania": true
    "Marek": true
```

No `__all__` node — broadcasts are copied to each user's node at send time.

## Firebase Security Rules

Open read/write (test mode) — required since there is no authentication:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Note**: This is intentionally open. Acceptable for a small group coordination tool. For production apps, proper auth would be needed.

## Firebase Configuration

The `firebase.js` must include `databaseURL` (required for Realtime Database):

```js
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};
```

## UI Language

All text in Polish:
- "Kalendarz" (Calendar)
- "Lista zadan" (Todo list)
- "Powiadomienia" (Notifications)
- "Pasuje" / "Nie pasuje" / "Inne wydarzenie"
- "Dodaj zadanie" (Add task)
- "Zrobione" (Done)
- "Wyslij powiadomienie" (Send notification)
- "Zmien nick" (Change nickname)
- "Twoj nick" (Your nickname)

## Deployment

- `homepage` field in `package.json`: `https://0xjaqbek.github.io/youthfest26`
- `npm run build` generates static files
- `npm run deploy` pushes build to `gh-pages` branch
- Accessible at `https://0xjaqbek.github.io/youthfest26`

## Environment Variables (.env)

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_DATABASE_URL=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```
