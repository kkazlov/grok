import {unlink} from "fs/promises";
import path from "path";
import * as uuid from "uuid";


class FileService {
	saveFile(file) {
		try {
			const fileSplit = file.name.split(".");
			const fileExt = fileSplit[fileSplit.length - 1];

			const fileName = `${uuid.v4()}.${fileExt}`;
			const filePath = path.resolve("static", fileName);
			file.mv(filePath);
			return fileName;
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

export default new FileService();
