import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import albumRouter from "./routers/album-router.js";
import groupRouter from "./routers/group-router.js";
import memberRouter from "./routers/member-router.js";


const PORT = 5000;
const DB_URL = "mongodb+srv://kkazlov:xbsoftware@cluster0.v5mkn.mongodb.net/firstdb";
const app = express();

app.use(express.json({limit: "16mb", extended: true}));
app.use(express.urlencoded({limit: "16mb", extended: false}));
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
	}
	catch (error) {
		console.log(error);
	}
}

startApp();
