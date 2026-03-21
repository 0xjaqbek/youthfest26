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
