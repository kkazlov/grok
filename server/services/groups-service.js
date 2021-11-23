import Album from "../models/album.js";
import Group from "../models/group.js";
import Services from "./services.js";

class GroupsService extends Services {
	async getAll() {
		await this.addTracksNumber();

		const data = await this.model.find();
		return data;
	}

	async addTracksNumber() {
		const groups = await this.model.find();

		groups.forEach(async ({_id}) => {
			const groupAlbums = await Album.find({GroupID: _id});
			const Tracks = groupAlbums.reduce((sum, {TrackList}) => sum + TrackList.length, 0);

			if (!_id) throw new Error("No ID");
			await this.model.findOneAndUpdate({_id}, {$set: {Tracks}});
		});
	}
}

export default new GroupsService(Group);
