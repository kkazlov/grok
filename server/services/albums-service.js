import Album from "../models/album.js";
import Files from "./extensions/files.js";

class AlbumService extends Files {
	async updateMany(data) {
		if (!data.length) throw new Error("No data");

		data.forEach(async (item) => {
			if (!item._id) throw new Error("No ID");
			await this.model.findByIdAndUpdate(item._id, item, {
				new: true
			});
		});

		return data;
	}
}

export default new AlbumService(Album);
