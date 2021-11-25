import Album from "../models/album.js";
import Group from "../models/group.js";
import Services from "./services.js";

class GroupsService extends Services {
	async getAll() {
		const groups = await this.model.find();
		const albums = await Album.find();
		const sendData = [];

		groups.forEach((group) => {
			let trackCounter = 0;
			const groupAlbums = albums.filter(album => album.GroupID === group.id);
			groupAlbums.forEach((item) => {
				trackCounter += item.TrackList.length;
			});
			sendData.push({...group._doc, Tracks: trackCounter, id: group._id});
		});
		return sendData;
	}
}

export default new GroupsService(Group);
