import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";

const ListAlbum = () => {
  const [data, setData] = useState([]);

  const fetchAlbums = async () => {
    try {
      const response = await api.get("/album/list");

      if (response.data.success) {
        setData(response.data.albums);
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const removeAlbum = async (id) => {
    try {
      const response = await api.post("/album/remove", { id });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchAlbums(); // ✅ fixed here
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div>
      <p>All Albums List</p>
      <br />

      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Album Colour</b>
          <b>Action</b>
        </div>

        {data.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border-gray-300 border text-sm mr-5"
          >
            <img src={item.image} alt="" className="w-12" />
            <p>{item.name}</p>
            <p>{item.desc}</p>
            <input type="color" value={item.bgColour} readOnly />
            <p
              className="cursor-pointer text-red-500"
              onClick={() => removeAlbum(item._id)}
            >
              x
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAlbum;