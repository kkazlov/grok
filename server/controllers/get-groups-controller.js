import Album from "../models/album.js";
import Group from "../models/group.js";
import ServicesConstr from "../services/services-constr.js";

const groupService = new ServicesConstr(Group);
const albumService = new ServicesConstr(Album);

const getGroupsController = {
	async getAll(req, res) {
		try {
			const groups = await groupService.getAll();
			const albums = await albumService.getAll();
			const sendData = [];

			groups.forEach((group) => {
				let trackCounter = 0;
				const groupAlbums = albums.filter(album => album.GroupID === group.id);
				groupAlbums.forEach((item) => {
					trackCounter += item.TrackList.length;
				});
				sendData.push({...group._doc, Tracks: trackCounter});
			});
			res.json(sendData);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}
};

export default getGroupsController;
