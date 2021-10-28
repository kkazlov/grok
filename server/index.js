import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

import groupRouter from "./routers/group-router.js";
import memberRouter from "./routers/member-router.js";
import albumRouter from "./routers/album-router.js";

const PORT = 5000;
const DB_URL = `mongodb+srv://kkazlov:xbsoftware@cluster0.v5mkn.mongodb.net/firstdb`;
const app = express();

app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use(cors());

app.use("/api", groupRouter);
app.use("/api", memberRouter);
app.use("/api", albumRouter);

async function startApp() {
	try {
		await mongoose.connect(DB_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		});
		app.listen(PORT, () => {
			console.log("server is running...");
		});
	} catch (error) {
		console.log(error);
	}
}

startApp();
