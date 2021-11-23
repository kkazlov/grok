import albumsService from "../services/albums-service.js";
import Files from "./extensions/files.js";

class AlbumsController extends Files {
	async getAlbums(req, res) {
		try {
			const data = await this.service.getAlbums(req);
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}
}

export default new AlbumsController(albumsService);
