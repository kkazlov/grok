import albumsService from "../services/albums-service.js";
import Files from "./extensions/files.js";

class AlbumsController extends Files {
	async updateMany(req, res) {
		try {
			const data = req.body;
			const updatedData = await this.service.updateMany(data);
			res.json(updatedData);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async deleteMany(req, res) {
		try {
			const data = req.body;
			const deleteMany = await this.service.deleteMany(data);
			res.json(deleteMany);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}
}

export default new AlbumsController(albumsService);
