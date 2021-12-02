import mongoose from "mongoose";

mongoose.set("toJSON", {
	virtuals: true
});

const Album = new mongoose.Schema({
	GroupID: {type: String, required: true},
	Name: {type: String, required: true},
	File: {type: String},
	ReleseDate: {type: String, required: true},
	Country: {type: String, required: true},
	Awards: {type: String, required: true},
	TrackList: {type: Array, required: true},
	CopiesNumber: {type: Number, required: true}
});

export default mongoose.model("Album", Album);
