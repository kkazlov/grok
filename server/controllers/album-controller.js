import AlbumService from "../services/album-service.js";

class AlbumController {
	async create(req, res) {
		try {
			const album = await AlbumService.create(req.body, req.files);
			res.json(album);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async getAll(req, res) {
		try {
			const albums = await AlbumService.getAll();
			res.json(albums);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async getOne(req, res) {
		try {
			const {id} = req.params;
			const album = await AlbumService.getOne(id);
			res.json(album);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async update(req, res) {
		try {
			const album = req.body;
			const updatedAlbum = await AlbumService.update(album);
			res.json(updatedAlbum);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async delete(req, res) {
		try {
			const {id} = req.params;
			const album = await AlbumService.delete(id);
			res.json(album);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}
}

export default new AlbumController();
