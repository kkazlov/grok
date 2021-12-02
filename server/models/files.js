import mongoose from "mongoose";

mongoose.set("toJSON", {
	virtuals: true
});

const Files = new mongoose.Schema({
	GroupID: {type: String, required: true},
	Name: {type: String, required: true},
	File: {type: String, required: true}
});

export default mongoose.model("Files", Files);
