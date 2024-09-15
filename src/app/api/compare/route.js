import OpenAI from "openai";
import similarity from "compute-cosine-similarity";

const openai = new OpenAI();

export async function POST(req) {

  const { a, b } = await req.json();
  if (!a || !b) {
    return new Response(JSON.stringify({ok: false, error: "Missing required fields `a`, `b`"}), { status: 400 });
  }

  const cleana = cleanText(a);
  const cleanb = cleanText(b);

  const embedding1 = (await getEmbedding(cleana)).data[0].embedding;
  const embedding2 = (await getEmbedding(cleanb)).data[0].embedding;

  const similarity = await compareEmbeddings(embedding1, embedding2);
  const result = {
    ok: true,
    similarity,
  };
  return new Response(JSON.stringify(result), { status: 200 });
}


async function getEmbedding(text) {
    return openai.embeddings.create({
        model: "text-embedding-3-large",
        input: text,
    });
}

async function compareEmbeddings(embedding1, embedding2) {
    return similarity(embedding1, embedding2);
}

function cleanText(text) {
  return text
    .toLowerCase()
    .replace(/[\p{P}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();                   
}