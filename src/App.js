import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { db, auth } from './firebase';
import LoginScreen from './components/LoginScreen';
import NicknamePrompt from './components/NicknamePrompt';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';
import NotificationBell from './components/NotificationBell';
import SendNotification from './components/SendNotification';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [nicknameLoading, setNicknameLoading] = useState(false);

  // Listen for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
      if (!firebaseUser) {
        setNickname('');
      }
    });
    return () => unsub();
  }, []);

  // Load nickname from Firebase when user logs in
  useEffect(() => {
    if (!user) return;
    setNicknameLoading(true);
    get(ref(db, `users/${user.uid}/nickname`)).then((snapshot) => {
      if (snapshot.exists()) {
        setNickname(snapshot.val());
      }
      setNicknameLoading(false);
    });
  }, [user]);

  const handleNicknameSet = (name) => {
    setNickname(name);
    set(ref(db, `users/${user.uid}`), { nickname: name });
  };

  const handleChangeNickname = () => {
    setNickname('');
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <p>Ładowanie...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (nicknameLoading) {
    return (
      <div className="loading-screen">
        <p>Ładowanie profilu...</p>
      </div>
    );
  }

  if (!nickname) {
    return <NicknamePrompt onNicknameSet={handleNicknameSet} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>YouthFest 2026</h1>
        <div className="header-right">
          <NotificationBell uid={user.uid} />
          <span className="nickname-display">
            {nickname}
            <button onClick={handleChangeNickname} className="change-nick-btn">
              Zmień nick
            </button>
            <button onClick={handleLogout} className="change-nick-btn">
              Wyloguj
            </button>
          </span>
        </div>
      </header>
      <main className="app-main">
        <section className="section">
          <h2>Kalendarz</h2>
          <Calendar uid={user.uid} nickname={nickname} />
        </section>
        <section className="section">
          <h2>Lista zadań</h2>
          <TodoList uid={user.uid} nickname={nickname} />
        </section>
        <section className="section">
          <h2>Powiadomienia</h2>
          <SendNotification uid={user.uid} nickname={nickname} />
        </section>
      </main>
    </div>
  );
}

export default App;
