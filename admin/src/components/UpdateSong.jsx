import React, { useEffect, useState } from "react";
import uploadsong from "../assets/upload_song.png";
import uploadarea from "../assets/upload_area.png";
import added from "../assets/upload_added.png";
import api from "../utils/api";
import { toast } from "react-toastify";

const UpdateSong = ({ songId }) => {
  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [mood, setMood] = useState("happy");

  // Load existing song
  const loadSongDetails = async () => {
    try {
      const res = await api.get(`/song/${songId}`);
      if (res.data.success) {
        const data = res.data.song;
        setName(data.name);
        setDesc(data.desc);
        setAlbum(data.album || "none");
        setMood(data.mood || "happy");
        setImage(data.imageUrl || false);
        setSong(data.audioUrl || false);
      }
    } catch (error) {
      toast.error("Failed to load song details");
    }
  };

  // Load albums
  const loadAlbumData = async () => {
    try {
      const response = await api.get(`/album/list`);
      if (response.data.success) {
        setAlbumData(response.data.albums);
      } else {
        toast.error("Unable to load albums");
      }
    } catch (error) {
      toast.error("Error loading albums");
    }
  };

  useEffect(() => {
    loadAlbumData();
    if (songId) loadSongDetails();
  }, [songId]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("album", album);
      formData.append("mood", mood);

      if (image && image instanceof File) {
        formData.append("image", image);
      }

      if (song && song instanceof File) {
        formData.append("audio", song);
      }

      const response = await api.put(`/song/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Song updated successfully");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Error occurred");
    }

    setLoading(false);
  };

  return loading ? (
    <div className="grid place-items-center min-h-[80vh]">
      <div className="w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
    </div>
  ) : (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-start gap-8 text-gray-600"
    >
      {/* Form UI remains same */}
      <button
        type="submit"
        className="text-base bg-black text-white py-2.5 px-14 cursor-pointer"
      >
        UPDATE
      </button>
    </form>
  );
};

export default UpdateSong;