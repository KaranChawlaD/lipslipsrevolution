import Leaderboard from './leaderboard';
import Head from 'next/head';


export default function LeaderboardPage() {
  return (
      <div className="container mx-auto">
        {/* <h1 className="text-center text-4xl font-bold my-8">Game Leaderboard</h1> */}
        {/* <AddScore /> */}
        <Leaderboard />
      </div>
  );
}
