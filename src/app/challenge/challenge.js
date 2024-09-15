import data from "./songinfo";
import { startSymphonic } from "../camera/camera";

async function sleep(sec) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

export async function startChallenge(
  songName,
  setCountDown,
  setIsSongDone,
  setLipPrediction,
  setLipAccuracy,
  setIsLoading,
) {
  console.log("Challenge start");
  const song = data.find((song) => song.name === songName);
  console.log(songName, song);
  playSong(songName);
  setCountDown(5);
  await sleep(1);
  setCountDown(4);
  await sleep(1);
  setCountDown(3);
  await sleep(1);
  setCountDown(2);
  await sleep(1);
  setCountDown(1);
  await sleep(1);
  setCountDown(0);

  let lipResult = startSymphonic("cam", song.duration);
  await sleep(song.duration);
  setIsLoading(true);
  [lipResult] = await Promise.all([lipResult]);
  setIsLoading(false);
  console.log("Lip result:", lipResult);
  setLipPrediction(lipResult);

  const similarity = await compareResult(lipResult, song.lyrics);
  console.log("Similarity:", similarity);
  setLipAccuracy(similarity);

  setIsSongDone(true);
}

function playSong(fileName) {
  console.log("Playing song:", fileName);
  // play an mp3 url
  const audio = new Audio(`./audio2/${fileName}.mp3`);
  audio.play();
}

async function compareResult(result, lyrics) {
  const url = `/api/compare`;

  const response = await fetch(url, { method: "POST", body: JSON.stringify({ a: result, b: lyrics }) })
  if (!response.ok) {
    throw new Error("API response was not ok");
  }
  const data = await response.json();
  console.log("API Response:", data);
  return data.similarity;
}
