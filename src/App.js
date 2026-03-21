import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { db } from './firebase';
import NicknamePrompt from './components/NicknamePrompt';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import NotificationBell from './components/NotificationBell';
import SendNotification from './components/SendNotification';
import './App.css';

function App() {
  const [nickname, setNickname] = useState(() => {
    return localStorage.getItem('youthfest_nickname') || '';
  });

  const handleNicknameSet = (name) => {
    localStorage.setItem('youthfest_nickname', name);
    setNickname(name);
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
        <section className="section">
          <h2>Powiadomienia</h2>
          <SendNotification nickname={nickname} />
        </section>
      </main>
    </div>
  );
}

export default App;
