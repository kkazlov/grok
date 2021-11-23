import Album from "../models/album.js";
import Files from "./extensions/files.js";

class AlbumService extends Files {
	async getAlbums(req) {
		const {GroupID} = req.query;
		if (GroupID) {
			const data = await this.model.find({GroupID});
			return data;
		}
	}
}

export default new AlbumService(Album);
