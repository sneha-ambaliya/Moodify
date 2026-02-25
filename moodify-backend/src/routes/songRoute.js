import { addSong, listSong, removeSong, searchSong } from "../controllers/songController.js";
import express from 'express'
import upload from "../middleware/multer.js";
import songModel from "../models/songModel.js";

const songRouter = express.Router();



songRouter.post('/add',upload.fields([{name:'image',maxCount:1},{name:'audio',maxCount:1}]), addSong);
songRouter.get('/list',listSong);
songRouter.post('/remove',removeSong);
songRouter.get('/search',searchSong);
songRouter.put("/update/:id", upload.fields([{ name: "image" , maxCount:1}, { name: "audio" , maxCount:1 }]), async (req, res) => {
  try {
    const { id } = req.params;

    // Build updated data object
    const updatedData = {
      name: req.body.name,
      desc: req.body.desc,
      album: req.body.album,
      mood: req.body.mood,
    };

    if (req.files?.image) {
      updatedData.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.audio) {
      updatedData.audio = `/uploads/${req.files.audio[0].filename}`;
    }

    // Update in DB
    const updatedSong = await songModel.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedSong) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    res.json({ success: true, message: "Song updated", song: updatedSong });
   
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});




// POST: Get songs by mood from JSON body
songRouter.post('/by-mood', async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json({ success: false, message: "Mood is required" });
    }

    const songs = await songModel.find({ mood });

    res.status(200).json({
      success: true,
      songs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch songs',
      error: error.message,
    });
  }
});




export default songRouter;
