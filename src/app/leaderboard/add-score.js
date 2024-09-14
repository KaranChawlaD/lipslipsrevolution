'use client';

import { useState } from 'react';

export default function AddScore() {
  const [username, setUsername] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, score: parseFloat(score) }),
    });
    setUsername('');
    setScore('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="block w-full p-2 mb-4 border rounded text-black"
      />
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Score"
        required
        className="block w-full p-2 mb-4 border rounded text-black"
      />
      <button type="submit" className="block w-full bg-blue-500 text-white p-2 rounded">
        Submit Score
      </button>
    </form>
  );
}
