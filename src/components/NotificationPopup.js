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
                Od: {n.from} &bull; {formatDate(n.createdAt)}
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
