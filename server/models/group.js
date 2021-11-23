import mongoose from "mongoose";

mongoose.set("toJSON", {
	virtuals: true
});

const Group = new mongoose.Schema({
	Name: {type: String, required: true},
	Style: {type: String, required: true},
	CreationDate: {type: String, required: true},
	Country: {type: String, required: true},
	InTour: {type: Number, required: true},
	Tracks: Number,
	NearConcert: String,
	NextConcert: String
});

export default mongoose.model("Group", Group);
