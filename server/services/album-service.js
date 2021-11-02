import Album from "../models/album.js";
import filesService from "./files-service.js";

class AlbumService {
	async create(album, files) {
		let createdAlbum;
		if (files) {
			const fileName = filesService.saveFile(files.Photo);
			createdAlbum = await Album.create({...album, Photo: fileName});
			return createdAlbum;
		}
		createdAlbum = await Album.create(album);
		return createdAlbum;
	}

	async getAll() {
		const albums = await Album.find();
		return albums;
	}

	async getOne(id) {
		if (!id) throw new Error("No ID");
		const album = await Album.findById(id);
		return album;
	}

	async update(album) {
		if (!album._id) throw new Error("No ID");
		const updatedAlbum = await Album.findByIdAndUpdate(album._id, album, {
			new: true
		});
		return updatedAlbum;
	}

	async delete(id) {
		if (!id) throw new Error("No ID");
		const selectedAlbum = await Album.findById(id);
		filesService.deleteFile(selectedAlbum.Photo);

		const album = await Album.findByIdAndDelete(id);
		return album;
	}
}

export default new AlbumService();
