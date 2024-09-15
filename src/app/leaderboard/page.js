"use client";

import Leaderboard from './leaderboard';

import { Suspense } from 'react'


export default function LeaderboardPage() {

  return (
    <div className="container mx-auto">
      {/* <h1 className="my-8 text-4xl font-bold text-center">Game Leaderboard</h1> */}
      {/* <AddScore /> */}

    <Suspense fallback={<p>Loading...</p>}>
      <Leaderboard/>
    </Suspense>
    </div>
  );
}
