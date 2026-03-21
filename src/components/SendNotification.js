import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase';
import './SendNotification.css';

function SendNotification({ uid, nickname }) {
  const [users, setUsers] = useState([]); // [{uid, nickname}]
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]); // UIDs
  const [sendToAll, setSendToAll] = useState(false);

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([userUid, val]) => ({
        uid: userUid,
        nickname: val.nickname || userUid,
      }));
      setUsers(list);
    });
    return () => unsub();
  }, []);

  const handleToggleUser = (userUid) => {
    setSelectedUsers((prev) =>
      prev.includes(userUid) ? prev.filter((u) => u !== userUid) : [...prev, userUid]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const targetUids = sendToAll ? users.map((u) => u.uid) : selectedUsers;
    if (targetUids.length === 0) return;

    const notif = {
      message: message.trim(),
      from: nickname,
      createdAt: Date.now(),
      read: false,
    };

    targetUids.forEach((userUid) => {
      push(ref(db, `notifications/${userUid}`), notif);
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
            {users.map((u) => (
              <label key={u.uid}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.uid)}
                  onChange={() => handleToggleUser(u.uid)}
                />
                {u.nickname}
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
