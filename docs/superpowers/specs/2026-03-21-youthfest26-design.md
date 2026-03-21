# YouthFest26 — Calendar & Todo App Design

## Overview

A shared calendar and task management app for organizing YouthFest 2026. Users access via link (no authentication), enter a nickname, and can mark date availability, manage shared tasks, and send notifications. All UI in Polish.

## Tech Stack

- **React 18** via Create React App
- **Firebase Realtime Database** (free tier)
- **GitHub Pages** deployment via `gh-pages`
- Firebase credentials stored in `.env` (gitignored)

## Section 1: Nickname Entry

- On first visit, user enters a nickname — stored in `localStorage`
- Header shows current nickname with a "Zmień nick" (change nickname) option
- Nickname is the sole identifier — no authentication
- Nicknames are registered in Firebase `users/` node for assignment dropdowns

## Section 2: Calendar (1 maja – 1 października 2026)

- **Month grid layout** with prev/next navigation (Maj → Czerwiec → ... → Wrzesień, partial Październik)
- Click a date → popup with 3 options:
  - **Pasuje** (available) — green indicator
  - **Nie pasuje** (unavailable) — red indicator
  - **Inne wydarzenie** — yellow indicator, with text input for event name
- Each date cell shows colored dots for all users who marked that date
- Clicking a date shows a summary list: who marked what
- Users can only set/change their own entries (matched by nickname)
- Cannot modify or delete other users' entries

## Section 3: Todo List (Shared, Append-Only)

- Shared across all users — anyone with the link can view and add
- **No delete, no edit** — entries are permanent
- Add a todo with:
  - Task description (text input)
  - Assigned to: multi-select from known nicknames
  - Added by: auto-filled from current nickname
- Each entry displays: task text, assigned users, who added it, timestamp
- Entries can be marked "Zrobione" (done) — records who marked it and when
- Done entries stay visible (strikethrough style) — not removable

## Section 4: Notification System

- **Auto-notifications**: When a todo is assigned to a user, a notification is created for them automatically
- **Manual notifications**: Any user can send a custom message to:
  - Specific user(s) — selected from nickname list
  - All users — broadcast
- **On app visit**: If unread notifications exist, a popup modal appears showing them
  - Each notification shows: message, from whom, timestamp
  - User confirms/dismisses with "OK" button (marks as read)
- "Wyślij powiadomienie" (Send notification) button in the UI

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
      text: "Zarezerwuj salę"
      assignedTo: ["Kuba", "Ania"]
      addedBy: "Marek"
      createdAt: 1716000000
      done: false
      doneBy: null
      doneAt: null
  notifications/
    "Kuba"/
      "-Nxyz789"/
        message: "Przypisano ci zadanie: Zarezerwuj salę"
        from: "Marek"
        createdAt: 1716000000
        read: false
    "__all__"/
      "-Nxyz800"/
        message: "Spotkanie organizacyjne w piątek!"
        from: "Marek"
        createdAt: 1716000000
  users/
    "Kuba": true
    "Ania": true
    "Marek": true
```

## UI Language

All text in Polish:
- "Kalendarz" (Calendar)
- "Lista zadań" (Todo list)
- "Powiadomienia" (Notifications)
- "Pasuje" / "Nie pasuje" / "Inne wydarzenie"
- "Dodaj zadanie" (Add task)
- "Zrobione" (Done)
- "Wyślij powiadomienie" (Send notification)
- "Zmień nick" (Change nickname)
- "Twój nick" (Your nickname)

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
