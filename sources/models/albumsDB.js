import {albumsURL} from "../config/urls";

const albumsDB = new webix.DataCollection({
	url: albumsURL,
	save: `json->${albumsURL}`
});

export default albumsDB;
