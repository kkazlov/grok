import mongoose from "mongoose";

mongoose.set("toJSON", {
	virtuals: true
});

const Style = new mongoose.Schema({
	value: {type: String, required: true}
});

export default mongoose.model("Style", Style);
