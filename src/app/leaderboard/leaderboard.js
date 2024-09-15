'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard(props) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selfIndex, setSelfIndex] = useState(-1);

  const name = props.name;

  useEffect(() => {
    async function fetchLeaderboard() {
      const res = await fetch('/api/challenge');
      const data = await res.json();
      setLeaderboard(data);
      return data;
    }

    fetchLeaderboard()
    .then((lboard) => {
      console.log(lboard)
      let sIndex = selfIndex;
      lboard.forEach((player, index) => {
        if (player.username == name && sIndex === -1) {
          sIndex = index;
          setSelfIndex(index);
        }
      });

      if (sIndex === -1) {
        setLeaderboard((lb) => lb.slice(0, 8));        
        fetch(`/api/pos?name=${encodeURIComponent(name)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok) {
            setLeaderboard((prev) => [...prev, {gap: true}, { username: name, score: data.score, rank: data.rank }]);
            setSelfIndex(lboard.length-1);
          }
        });
      }
    });

  }, []);

  return (
    <>
    <img className='mt-4 ml-8 h-[63px]' src='/images/logo.png'>
    </img>
    <div className="max-w-lg mx-auto mt-8">
      {/* <h1 className="mb-4 text-3xl font-bold text-center">Leaderboard</h1> */}
      <ul className="text-white bg-black divide-y divide-gray-400 rounded-lg">
        {leaderboard.map((player, index) => (
          <li key={index} className={`${index==selfIndex ? "bg-white text-black" : (index == 0 ? "text-cyan-400" : (index == 1 ? " text-cyan-200" : (index == 2 ? "text-cyan-100" : "text-white")))} flex justify-between px-5 py-4 font-sans text-2xl`}>
            {player.gap ? (
              <>
                <span class="text-center w-full">...</span>
              </>
            ) : (
              <>
                <span>{player.rank ? player.rank : (index + 1).toString().padStart(2, "0")}. {player.username}</span>
                <span>{player.score}%</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
