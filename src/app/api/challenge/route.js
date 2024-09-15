import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db('Leaderboard');
  const collection = db.collection('scores');
  
  const leaderboard = await collection.find({}).sort({ score: -1 }).limit(10).toArray();
  
  return new Response(JSON.stringify(leaderboard), { status: 200 });
}

export async function POST(req) {
  const client = await clientPromise;
  const db = client.db('Leaderboard');
  const collection = db.collection('scores');
  
  const { username, score } = await req.json();
  await collection.insertOne({ username, score, timestamp: new Date() });
  
  return new Response(JSON.stringify({ message: 'Score added' }), { status: 201 });
}
