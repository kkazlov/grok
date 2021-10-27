import Album from "../models/album.js";


class albumService {
	async create(album) {
		const createdAlbum = await Album.create(album);
		return createdAlbum;
    }

    async getAll() {
		const albums = await Album.find();
		return albums;
    }

    async getOne(id) {
		if (!id) throw new Error("ID не указан")
		const album = await Album.findById(id);
		return album;
    }

    async update(album) {
		if (!album._id) throw new Error("ID не указан")
		const updatedAlbum = await Album.findByIdAndUpdate(album._id, album, {new: true})
		return updatedAlbum;
    }

    async delete(id) {
		if (!id) throw new Error("ID не указан")
		const album = await Album.findByIdAndDelete(id);
		return album;
    }
}

export default new albumService();