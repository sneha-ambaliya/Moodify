import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const ListSong = () => {
  const [data, setData] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [mood, setMood] = useState("happy");

  const [image, setImage] = useState(null);
  const [songFile, setSongFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all songs
  const fetchSongs = async () => {
    try {
      const res = await api.get("/song/list");
      if (res.data.success) {
        setData(res.data.songs);
      }
    } catch (error) {
      toast.error("Error fetching songs");
      console.error(error);
    }
  };

  // Remove song
  const removeSong = async (id) => {
    try {
      const res = await api.post("/song/remove", { id });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchSongs();
      }
    } catch (error) {
      toast.error("Error removing song");
      console.error(error);
    }
  };

  // Open edit modal
  const handleEditClick = (song) => {
    setEditingSong(song);
    setName(song.name);
    setDesc(song.desc);
    setAlbum(song.album || "none");
    setMood(song.mood || "happy");

    setImage(null);
    setSongFile(null);
    setShowForm(true);
  };

  // Update Song
  const updateSong = async (e) => {
    e.preventDefault();
    if (!editingSong) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("desc", desc);
      formData.append("album", album);
      formData.append("mood", mood);

      if (image) formData.append("image", image);
      if (songFile) formData.append("audio", songFile);

      const res = await api.put(
        `/song/update/${editingSong._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Song updated!");
        setShowForm(false);
        fetchSongs();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Error updating song");
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <p className="font-bold text-lg mb-3">All Songs List</p>

      <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_1fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
        <b>Image</b>
        <b>Name</b>
        <b>Album</b>
        <b>Duration</b>
        <b>Action</b>
      </div>

      {data.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_1fr] items-center gap-2.5 p-3 border-gray-300 border text-sm mr-5"
        >
          <img src={item.image} alt="" className="w-12" />
          <p>{item.name}</p>
          <p>{item.album}</p>
          <p>{item.duration}</p>

          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded"
              onClick={() => handleEditClick(item)}
            >
              Edit
            </button>

            <p
              className="cursor-pointer text-red-500"
              onClick={() => removeSong(item._id)}
            >
              x
            </p>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="fixed inset-0 bg-[#F3FFF7] flex justify-center items-center">
          <form
            onSubmit={updateSong}
            className="bg-white p-6 rounded-md flex flex-col gap-4 w-[400px] border border-black"
          >
            <h2 className="text-lg font-bold">Update Song</h2>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Song Name"
              required
              className="border p-2"
            />

            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              required
              className="border p-2"
            />

            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album"
              className="border p-2"
            />

            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="border p-2"
            >
              <option value="happy">happy</option>
              <option value="sad">sad</option>
              <option value="neutral">neutral</option>
              <option value="angry">angry</option>
              <option value="surprised">surprised</option>
            </select>

            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {loading ? "Updating..." : "Update"}
              </button>

              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListSong;