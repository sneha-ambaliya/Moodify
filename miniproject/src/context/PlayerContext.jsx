import { createContext, useEffect, useRef, useState } from "react";
import api from "../utils/api";

export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef(null);
  const seekBg = useRef(null);
  const seekBar = useRef(null);

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  /* ---------------- PLAY CONTROLS ---------------- */

  const play = () => {
    audioRef.current?.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    const selectedTrack = songsData.find((item) => item._id === id);
    if (!selectedTrack) return;

    setTrack(selectedTrack);
    setTimeout(() => {
      audioRef.current?.play();
      setPlayStatus(true);
    }, 200);
  };

  const previous = () => {
    const index = songsData.findIndex(
      (item) => item._id === track?._id
    );

    if (index > 0) {
      setTrack(songsData[index - 1]);
      setTimeout(() => {
        audioRef.current?.play();
        setPlayStatus(true);
      }, 200);
    }
  };

  const next = () => {
    const index = songsData.findIndex(
      (item) => item._id === track?._id
    );

    if (index < songsData.length - 1) {
      setTrack(songsData[index + 1]);
      setTimeout(() => {
        audioRef.current?.play();
        setPlayStatus(true);
      }, 200);
    }
  };

  const seekSong = (e) => {
    if (!audioRef.current || !seekBg.current) return;

    const percent =
      e.nativeEvent.offsetX / seekBg.current.offsetWidth;

    audioRef.current.currentTime =
      percent * audioRef.current.duration;
  };

  /* ---------------- FETCH DATA ---------------- */

  const getSongsData = async () => {
    try {
      const response = await api.get("/song/list");
      setSongsData(response.data.songs);

      if (response.data.songs.length > 0) {
        setTrack(response.data.songs[0]);
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const getAlbumsData = async () => {
    try {
      const response = await api.get("/album/list");
      setAlbumsData(response.data.albums);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  /* ---------------- AUDIO TIME UPDATE ---------------- */

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.ontimeupdate = () => {
      if (!audioRef.current.duration) return;

      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;

      seekBar.current.style.width =
        Math.floor((current / total) * 100) + "%";

      setTime({
        currentTime: {
          second: Math.floor(current % 60),
          minute: Math.floor(current / 60),
        },
        totalTime: {
          second: Math.floor(total % 60),
          minute: Math.floor(total / 60),
        },
      });
    };
  }, [track]);

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
    time,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;