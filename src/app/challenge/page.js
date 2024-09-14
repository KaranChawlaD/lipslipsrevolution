"use client";

import { useState, useEffect, useRef } from "react";
import "../globals.css";
import jsQR from "jsqr";
import { startChallenge } from "./challenge";
import { isCompositeType } from "graphql";
import data from "./songinfo";

export default function ChallengePage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isChallengeOn, setIsChallengeOn] = useState(false);
  const [isBlurred, setIsBlurred] = useState(true);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [qrCodeLastPart, setQrCodeLastPart] = useState(null);
  const [songSelection, setSongSelection] = useState(null);
  const [countDown, setCountDown] = useState(0);
  const [canvas, setCanvas] = useState(null);
  const [video, setVideo] = useState(null);
  const [isSongDone, setIsSongDone] = useState(false);
  const [lipPrediction, setLipPrediction] = useState(null);
  const [lipAccuracy, setLipAccuracy] = useState(0.0);
  const [scanIntervalVariable, setScanIntervalVariable] = useState(-1);
  const [playerName, setPlayerName] = useState(null);
  //const videoRef = useRef(null);
  //const canvasRef = useRef(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSongSelection(document.getElementById("songDropdown").value);
  };

  const toggleChallenge = () => {
    setIsChallengeOn(!isChallengeOn);
    startChallenge(songSelection, setCountDown, setIsSongDone, setLipPrediction, setLipAccuracy);
  };

  // const stopScanning = () => {
  //   clearInterval(scanInterval.current);
  //   const video = videoRef.current;
  //   if (video.srcObject) {
  //     video.srcObject.getTracks().forEach((track) => track.stop()); // Stop the video stream
  //   }
  // };

  async function scanQrCode() {
    if (canvas) {
      // console.log(canvas);
      //const canvas = canvasRef.current;

      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

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
        setQrCodeData(qrCode.data);

        const parts = qrCode.data.split("/");
        const lastPart = parts[parts.length - 1];
        setQrCodeLastPart(lastPart);
        let pName = await getPlayerName(lastPart);
        console.log("pname", pName);
        setPlayerName(pName);
      }
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

  function testQR() {
    //const canvasElement = document.createElement("canvas");
    const canvasElement = document.getElementById("mirror");
    setCanvas(canvasElement);
    setVideo(document.getElementById("cam"));

    const scanInterval = setInterval(() => {
      scanQrCode();
      // console.log(playerName)
      // if (!!playerName) {
      //   let temp = document.getElementById("mirror");
      //   console.log(temp);
      //   temp.remove();
      // }
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
      setIsSongDone(false);
    }
  }, [playerName]);

  useEffect(() => {
    if (!isSongDone) return;
    alert(lipAccuracy);
    testQR();
    testQR();
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
      <div className="relative min-h-screen overflow-hidden bg-black">
        {/* Blurred Background */}
        {/* <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black -z-10"></div> */}

        {/* Content */}
        <div className="relative z-10 flex justify-around px-5 mt-12 align-middle">
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
            <button
              onClick={() => testQR()}
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Start Scanning
            </button>
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
          <div className="flex flex-col text-black">
            <div className="font-sans text-4xl text-htnblue">
              insert lyrics here
            </div>
            <button
              type="button"
              className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2 font-sans text-xl"
              onClick={toggleModal}
            >
              Register Score
            </button>
          </div>
        </div>

        {/* Modal */}

        {isModalOpen && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-1/3 p-6 bg-gray-800 rounded-lg">
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
          //<canvas></canvas>
          <canvas id="mirror"></canvas>
        )}
      </div>
    </>
  );
}
