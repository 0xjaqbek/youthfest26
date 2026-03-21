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
