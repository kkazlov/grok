import {unlink} from "fs/promises";
import path from "path";
import * as uuid from "uuid";

import Services from "../services.js";

export default class Files extends Services {
	async createWithFile(data, files, fileName) {
		let createdData;
		if (files) {
			this.saveFile(files[fileName]);
			createdData = await this.model.create({...data, [fileName]: this.serverFileName});
			return createdData;
		}
		createdData = await this.model.create(data);
		return createdData;
	}

	async deleteWithFile(id) {
		if (!id) throw new Error("No ID");
		const selectedData = await this.model.findById(id);
		this.deleteFile(selectedData.File);

		const data = await this.model.findByIdAndDelete(id);
		return data;
	}

	async saveFile(file) {
		try {
			const fileSplit = file.name.split(".");
			const fileExt = fileSplit[fileSplit.length - 1];

			this.serverFileName = `${uuid.v4()}.${fileExt}`;
			const filePath = path.resolve("static", this.serverFileName);
			await file.mv(filePath);
		}
		catch (error) {
			console.log(error.message);
		}
	}

	async deleteFile(name) {
		try {
			if (name) {
				const filePath = path.resolve("static", name);
				await unlink(filePath);
			}
		}
		catch (error) {
			console.log(error.message);
		}
	}
}
