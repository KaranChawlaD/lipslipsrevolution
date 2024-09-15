import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  console.log(req)
  const {searchParams} = new URL(req.url);
  const name = searchParams.get('name');
  if (!name) {
    return new Response(JSON.stringify({ok: false, error: "Missing query param `name`"}), { status: 400 });
  }
  
  const client = await clientPromise;
  const db = client.db('Leaderboard');
  const collection = db.collection('scores');
  
  const leaderboard = await collection.find({}).sort({ score: -1 }).toArray();

  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].username === name) {
      return new Response(JSON.stringify({ ok: true, rank: i + 1, score: leaderboard[i].score }), { status: 200 });
    }
  }
  
  return new Response(JSON.stringify({ ok: false, error: "User not found" }), { status: 404 });
}