"use client";

import { useState, useEffect, useRef } from "react";
import "../globals.css";
import jsQR from "jsqr";
import { startChallenge } from "./challenge";
import { isCompositeType } from "graphql";
import data from "./songinfo";
import { useRouter } from 'next/navigation';

export default function ChallengePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isChallengeOn, setIsChallengeOn] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [songSelection, setSongSelection] = useState(null);
  const [countDown, setCountDown] = useState(0);
  const [isSongDone, setIsSongDone] = useState(false);
  const [lipPrediction, setLipPrediction] = useState(null);
  const [lipAccuracy, setLipAccuracy] = useState(-1.0);
  const [scanIntervalVariable, setScanIntervalVariable] = useState(-1);
  const [playerName, setPlayerName] = useState(null);
  const [isQrHidden, setIsQrHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSongSelection(document.getElementById("songDropdown").value);
  };

  const toggleChallenge = () => {
    setIsChallengeOn(!isChallengeOn);
    startChallenge(songSelection, setCountDown, setIsSongDone, setLipPrediction, setLipAccuracy, setIsLoading);
  };

  // const stopScanning = () => {
  //   clearInterval(scanInterval.current);
  //   const video = videoRef.current;
  //   if (video.srcObject) {
  //     video.srcObject.getTracks().forEach((track) => track.stop()); // Stop the video stream
  //   }
  // };

  async function scanQrCode() {
    const canvas = document.getElementById("mirror");
    if (canvas) {

      const context = canvas.getContext("2d");
      if (!context) {
        console.error("Failed to get canvas context");
        return;
      }

      const squareSize = 300;
      const video = document.getElementById("cam");

      if (!video) {
        console.error("Video element not found");
        return;
      }

      canvas.width = squareSize;
      canvas.height = squareSize;

      context.drawImage(
        video,
        (video.videoWidth - squareSize) / 2,
        (video.videoHeight - squareSize) / 2,
        squareSize,
        squareSize,
        0,
        0,
        squareSize,
        squareSize
      );

      const imageData = context.getImageData(0, 0, squareSize, squareSize);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

      if (qrCode) {
        console.log("QR Code found:", qrCode.data);
              
        const parts = qrCode.data.split("/");
        console.log(parts);
        const lastPart = parts[parts.length - 1];
        console.log(lastPart);
        let pName = await getPlayerName(lastPart);
        console.log("pname", pName);
        setPlayerName(pName);
      }
    } else {
      console.error("Canvas not found");
    }
  };

  async function getPlayerName(queryCode) {
    const url = `/api/badge?code=${encodeURIComponent(queryCode)}`;

    let resp = await fetch(url)
    if (!resp.ok) {
      throw new Error("Network response was not ok");
    }
    let data = await resp.json();
    console.log("API Response:", data);
    return data.name;
  }

  function startQR() {
    const scanInterval = setInterval(() => {
      scanQrCode();
    }, 100);
    setScanIntervalVariable(scanInterval);
  }

  const wrapLyricsWithSpans = (lyrics) => {
    if (!lyrics) return "Pick a song";

    return lyrics.split("").map((char, index) => (
      <span key={index} class="character-span">
        {char}
      </span>
    ));
  };

  // https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
  function useDidUpdateEffect(fn, inputs) {
    const isMountingRef = useRef(false);
  
    useEffect(() => {
      isMountingRef.current = true;
    }, []);
  
    useEffect(() => {
      if (!isMountingRef.current) {
        return fn();
      } else {
        isMountingRef.current = false;
      }
    }, inputs);
  }

  useEffect(() => {
    console.log(playerName)
    if (!!playerName) {
      clearInterval(scanIntervalVariable);
      console.log(playerName)

      // Prevent negative scores
      if (lipAccuracy <= 0.0) {
        return;
      }

      const submitScore = async () => {
        // const timestamp = new Date().toISOString();  // Get current timestamp
        const response = await fetch('/api/challenge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: playerName, 
            score: Math.round(parseFloat(lipAccuracy * 100)),  // Ensure score is accurate
            // timestamp,  // Submit the timestamp
          }),
        });
  
        if (response.ok) {
          // Reset player name and accuracy if needed after successful submission
          setPlayerName(null);
          setLipAccuracy(-1.0);

          router.push('/leaderboard');
        } else {
          console.error("Failed to submit the score");
        }
      };
  
      submitScore();
    }
  }, [playerName]);

  useEffect(() => {
    if (!isSongDone) return;
    
    setPlayerName(null);
    setIsQrHidden(false);
    startQR();
  }, [isSongDone]);
  
  useEffect(() => {
    const video = document.getElementById("cam");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();

          //const scanInterval = setInterval(scanQrCode, 500);
        })
        .catch((err) => {
          console.error("Error: " + err);
        });
    }
  }, []);

  return (
    <>
      <img className="mt-4 ml-8 h-[63px]" alt="logo" src="/images/logo.png"></img>
      <div className="relative overflow-hidden bg-black">
        {/* Blurred Background */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black -z-10"></div> */}

        {/* Content */}
        <div className={`${isLoading ? "blur motion-safe:animate-pulse" : "" } relative z-10 flex justify-around px-5 align-middle`}>
          <div className="flex flex-col justify-center align-middle w-[40%] relative">
            <img
              src="/images/phoneframe4.png"
              alt="phone frame"
              className="z-50 w-full px-32 py-12"
            />
            <div className="absolute px-3 py-2 text-center bg-black opacity-40 font-sans text-white text-lg left-[9.5rem] right-[9.5rem] top-auto bottom-[6.5rem] z-40" >
              {songSelection ? wrapLyricsWithSpans(data.find((song) => song.name === songSelection)?.lyrics) : "Pick a song"}
            </div>
            <div
              className={`absolute bg-black left-[8.5rem] right-[8.5rem] top-14 bottom-24 -z-10 rounded-[10%] ${
                isBlurred ? "blur" : ""
              }`}
            >
              <video
                id="cam"
                className="object-cover w-full h-full overflow-clip rounded-[10%]"
                autoPlay
              ></video>
            </div>
            {/* <button
              onClick={() => testQR()}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Start Scanning
            </button> */}
            <button
              onClick={() => {
                toggleChallenge();
                setIsBlurred(!isBlurred);
              }}
            >
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className={`${
                  isChallengeOn ? "hidden" : ""
                } absolute duration-300 z-50 transform -translate-x-1/2 -translate-y-1/2  top-1/2 left-1/2 hover:scale-110`}
              >
                <polygon points="30,20 70,50 30,80" fill="#67e8f9" />
              </svg>
              <p
                className={`${
                  countDown > 0 ? "" : "hidden"
                } absolute text-4xl bg-black/20 rounded-full size-12 flex justify-center items-center aspect-square transition-transform duration-300 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 hover:scale-110`}
              >
                {countDown}
              </p>
            </button>
          </div>
        </div>

        {/* Modal */}

        {isModalOpen && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[70%] md:w-1/3 p-6 bg-gray-800 rounded-lg">
              <h3 className="mb-4 font-sans text-xl font-semibold text-white">
                Choose your song!
              </h3>
              <select
                id="songDropdown"
                className="block w-full py-2 pl-3 pr-10 mt-1 text-base font-bold bg-gray-700 border-white rounded-md text-cyan-400 focus:outline-none focus:ring-white focus:border-white sm:text-sm"
              >
                <option>Easy - Baby by Justin Bieber</option>
                <option>Easy - Uptown Funk by Bruno Mars</option>
                <option>Medium - Umbrella by Rihanna</option>
                <option>Medium - Blinding Lights by The Weeknd</option>
                <option>Hard - Stay by The Kid LAROI</option>
                <option>Hard - Old Town Road by Lil Nas X</option>
                {/* <option>Low</option> */}
              </select>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 ml-2 font-semibold bg-gray-700 rounded-lg text-cyan-400 hover:bg-cyan-400 hover:text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        {isSongDone && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[70%] md:w-1/3 p-6 bg-gray-800 rounded-lg">
              <div className="flex flex-col align-center justify-center mt-4">

                <h3 className="mb-4 font-sans text-center text-xl font-semibold text-white">
                  Scan your QR card to join the leaderboard!
                </h3>
                <p className="self-center font-sans block text-center py-2 px-3 mt-1 mb-4 text-2xl font-bold bg-gray-700 border-white rounded-md text-cyan-400 focus:outline-none focus:ring-white focus:border-white">Your score is <span className="text-white">{Math.round(lipAccuracy*100) > 0.0 ? `${Math.round(lipAccuracy*100)}%` : "Loading"}</span></p>
                  {/* <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 ml-2 font-semibold bg-gray-700 rounded-lg text-cyan-400 hover:bg-cyan-400 hover:text-white"
                  >
                    Submit
                  </button> */}
                <canvas id="mirror" className={isQrHidden ? "hidden" : ""}></canvas>

              </div>
            </div>
          </div>
        )}

          {/* <canvas></canvas> */}
      </div>
    </>
  );
}
