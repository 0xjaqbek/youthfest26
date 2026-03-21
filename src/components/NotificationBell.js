import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import NotificationPopup from './NotificationPopup';
import './NotificationBell.css';

function NotificationBell({ uid }) {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const notifRef = ref(db, `notifications/${uid}`);
    const unsub = onValue(notifRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data)
        .map(([id, n]) => ({ id, ...n }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setNotifications(list);

      const hasUnread = list.some((n) => !n.read);
      if (hasUnread) {
        setShowPopup(true);
      }
    });
    return () => unsub();
  }, [uid]);

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
          uid={uid}
          notifications={notifications}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}

export default NotificationBell;
