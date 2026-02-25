import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import api from "../utils/api";

const Face = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [mood, setMood] = useState("neutral");
  const [songs, setSongs] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [stream, setStream] = useState(null);
  const [activeAudio, setActiveAudio] = useState(null);

  // Load face models + start webcam
  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ]);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
    };

    loadModelsAndStartVideo();
  }, []);

  // Mood detection
  useEffect(() => {
    let intervalId;

    const detectMood = async () => {
      if (!videoRef.current) return;

      const detections = await faceapi
        .detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

      if (detections.length > 0) {
        const expressions = detections[0].expressions;

        const topMood = Object.entries(expressions).sort(
          (a, b) => b[1] - a[1]
        )[0][0];

        if (topMood !== mood) {
          setMood(topMood);
          fetchSongsByMood(topMood);
        }
      }
    };

    const startDetection = () => {
      intervalId = setInterval(detectMood, 1000);
    };

    videoRef.current?.addEventListener("play", startDetection);

    return () => clearInterval(intervalId);
  }, [mood]);

  // Fetch songs from backend
  const fetchSongsByMood = async (detectedMood) => {
    try {
      const res = await api.post("/song/by-mood", {
        mood: detectedMood,
      });

      setSongs(res.data.songs || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  // Countdown + capture
  const handleCaptureWithCountdown = () => {
    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count--;

      if (count === 0) {
        clearInterval(timer);
        captureSnapshot();
        stopCamera();
        setCountdown(0);
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const captureSnapshot = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    setSnapshot(imageData);
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
  };

  const handleRetake = async () => {
    setSnapshot(null);

    const newStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = newStream;
    }

    setStream(newStream);
  };

  const handlePlay = (audioElement) => {
    if (activeAudio && activeAudio !== audioElement) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    }

    setActiveAudio(audioElement);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!snapshot ? (
        <>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              width="320"
              height="240"
              className="rounded shadow-md"
            />

            {countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold bg-black bg-opacity-60">
                {countdown}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <button
            onClick={handleCaptureWithCountdown}
            className="mt-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Capture Snapshot
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src={snapshot}
            alt="Captured"
            width="320"
            height="240"
            className="rounded shadow-md"
          />

          <p className="text-white mt-2 text-sm">
            📸 Snapshot captured!
          </p>

          <button
            onClick={handleRetake}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            Retake
          </button>
        </div>
      )}

      <p className="mt-2 text-lg text-white">
        Detected Mood:{" "}
        <strong className="capitalize text-blue-400">
          {mood}
        </strong>
      </p>

      <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div
              key={song._id}
              className="bg-gray-800 p-4 rounded shadow-md text-white"
            >
              <img
                src={song.image}
                alt={song.name}
                className="w-full h-40 object-cover rounded mb-2"
              />

              <h3 className="text-lg font-semibold">
                {song.name}
              </h3>

              <p className="text-sm mb-2">
                {song.album}
              </p>

              <audio
                controls
                src={song.file}
                className="w-full"
                onPlay={(e) => handlePlay(e.target)}
              />
            </div>
          ))
        ) : (
          <p className="text-white">
            No songs found for mood: {mood}
          </p>
        )}
      </div>
    </div>
  );
};

export default Face;