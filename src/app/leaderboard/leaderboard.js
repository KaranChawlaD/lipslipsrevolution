'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch('/api/challenge');
      const data = await res.json();
      setLeaderboard(data);
    }

    fetchLeaderboard();
  }, []);

  return (
    <>
    <img className='mt-4 ml-8 h-[63px]' src='/images/logo.png'>
    </img>
    <div className="max-w-lg mx-auto mt-8">
      {/* <h1 className="text-3xl font-bold text-center mb-4">Leaderboard</h1> */}
      <ul className="bg-black rounded-lg divide-y divide-gray-400">
        {leaderboard.map((player, index) => (
          <li key={index} className="py-3 px-5 flex justify-between text-xl font-sans text-white">
            <span>{index + 1}. {player.username}</span>
            <span>{player.score}</span>
          </li>
        ))}
      </ul>
    </div></>
  );
}
