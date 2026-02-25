import React, { useEffect, useState } from 'react';
import uploadsong from '../assets/upload_song.png';
import uploadarea from '../assets/upload_area.png';
import added from "../assets/upload_added.png";
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const UpdateSong = ({ songId }) => {
  const [image, setImage] = useState(false);
  const [song, setSong] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);
  const [mood, setMood] = useState("happy");

  // Load existing song details
  const loadSongDetails = async () => {
    try {
      const res = await axios.get(`${url}/api/song/${songId}`);
      if (res.data.success) {
        const data = res.data.song;
        setName(data.name);
        setDesc(data.desc);
        setAlbum(data.album || "none");
        setMood(data.mood || "happy");
        // For image and song, we can show preview URL if needed
        setImage(data.imageUrl || false);
        setSong(data.audioUrl || false);
      }
    } catch (error) {
      toast.error("Failed to load song details");
    }
  };

  // Load album list
  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) setAlbumData(response.data.albums);
      else toast.error("Unable to load albums");
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
      formData.append('name', name);
      formData.append('desc', desc);
      if (image && image instanceof File) formData.append('image', image);
      if (song && song instanceof File) formData.append('audio', song);
      formData.append('album', album);
      formData.append('mood', mood);

      const response = await axios.put(`${url}/api/song/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) toast.success("Song updated successfully");
      else toast.error("Update failed");

    } catch (error) {
      toast.error("Error occurred");
    }
    setLoading(false);
  };

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
      <div className='flex gap-8'>
        <div className='flex flex-col gap-4'>
          <p>Upload Song</p>
          <input onChange={(e) => setSong(e.target.files[0])} type="file" id="song" accept='audio/*' hidden />
          <label htmlFor='song'>
            <img src={song ? (song instanceof File ? added : song) : uploadsong} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Upload Image</p>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
          <label htmlFor='image'>
            <img src={image ? (image instanceof File ? URL.createObjectURL(image) : image) : uploadarea} alt="" className='w-24 cursor-pointer' />
          </label>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Song Name</p>
        <input value={name} onChange={(e) => setName(e.target.value)} type='text' className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' required />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Song Description</p>
        <input value={desc} onChange={(e) => setDesc(e.target.value)} type='text' className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' required />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album</p>
        <select value={album} onChange={(e) => setAlbum(e.target.value)} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]'>
          <option value="none">None</option>
          {albumData.map((item, index) => (
            <option value={item.name} key={index}>{item.name}</option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Mood</p>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
          <option value="happy">happy</option>
          <option value="sad">sad</option>
          <option value="neutral">neutral</option>
          <option value="angry">angry</option>
          <option value="surprised">surprised</option>
        </select>
      </div>

      <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>UPDATE</button>
    </form>
  );
};

export default UpdateSong;
