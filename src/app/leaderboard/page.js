"use client";

import Leaderboard from './leaderboard';

import { useSearchParams } from "next/navigation";

export default function LeaderboardPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name')

  return (
    <div className="container mx-auto">
      {/* <h1 className="my-8 text-4xl font-bold text-center">Game Leaderboard</h1> */}
      {/* <AddScore /> */}
      <Leaderboard name={name}/>
    </div>
  );
}
