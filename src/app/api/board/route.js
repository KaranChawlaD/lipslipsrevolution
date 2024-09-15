import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('Leaderboard');
  const collection = db.collection('scores');
  
  const leaderboard = await collection.find({}).sort({ score: -1 }).toArray();
  
  return new Response(JSON.stringify(leaderboard), { status: 404 });
}