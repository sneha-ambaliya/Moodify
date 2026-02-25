import axios from "axios";
import { useEffect, useState } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // this function will call the API whenever query changes
  useEffect(() => {
    const fetchSongs = async () => {
      if (!query.trim()) {
        setSongs([]);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:4000/api/song/search?q=${query}`);
        if (res.data.success) {
          setSongs(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    // Debounce logic: wait 500ms before calling API
    const delayDebounce = setTimeout(() => {
      fetchSongs();
    }, 500);

    // cleanup to cancel old requests if typing continues
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div className="p-5 max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      />

      {loading && <p className="text-gray-500 mt-3">Loading...</p>}

      <div className="mt-4 space-y-3">
        {songs.length > 0 ? (
          songs.map((song) => (
            <div key={song._id} className="border p-3 rounded-lg shadow-sm">
              <img src={song.image} alt={song.name} className="w-16 h-16 rounded-md mb-2" />
              <h3 className="font-semibold">{song.name}</h3>
              <p className="text-sm text-gray-500">{song.album} • {song.mood}</p>
              <audio controls src={song.file} className="mt-2 w-full h-10"></audio>
            </div>
          ))
        ) : (
          !loading && query && <p>No songs found </p>
        )}
      </div>
    </div>
  );
}

export default Search;
