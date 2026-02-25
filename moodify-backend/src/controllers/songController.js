import { v2 as cloudinary } from 'cloudinary';
import songModel from '../models/songModel.js';

const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;

        const audioFile = req.files && req.files.audio ? req.files.audio[0] : null;
        const imageFile = req.files && req.files.image ? req.files.image[0] : null;

        if (!audioFile || !imageFile) {
            return res.status(400).json({ success: false, message: "Audio or image file missing" });
        }

        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`;

        const mood = req.body.mood;

        const songDate = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
            mood
        };

        const song = songModel(songDate);
        await song.save();
        console.log("Mood received:", mood);

        res.json({ success: true, message: "song added" });

    } catch (error) {
        res.json({ success: false });
        console.log(error);

        
    }
};

const searchSong = async (req, res) => {
    try {
        const query = req.query.q; 
        if (!query) {
            return res.status(400).json({ success: false, message: "Search query missing" });
        }

        
        const songs = await songModel.find({
            $or: [
                { name: { $regex: query, $options: "i" } },  
                { album: { $regex: query, $options: "i" } },
                { mood: { $regex: query, $options: "i" } }
            ]
        });

        if (songs.length === 0) {
            return res.json({ success: true, message: "No songs found", data: [] });
        }

        res.json({ success: true, data: songs });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

 
const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({success:true, songs:allSongs});
    } catch (error) {
       res.json({success:false , message:error});
        
    }  

};

const removeSong = async (req,res) =>{
      
    try {
        
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Song removed"});

    } catch (error) {
        res.json({success:false});
    }
}





export { addSong, listSong, removeSong , searchSong};
