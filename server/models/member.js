import mongoose from "mongoose";

mongoose.set("toJSON", {
	virtuals: true
});

const Member = new mongoose.Schema({
	GroupID: {type: String, required: true},
	Name: {type: String, required: true},
	Role: {type: String, required: true},
	BirthDate: {type: String, required: true},
	Country: {type: String, required: true},
	Awards: {type: String, required: true}
});

export default mongoose.model("Member", Member);
