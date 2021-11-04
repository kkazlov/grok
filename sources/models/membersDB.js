import {membersURL} from "../config/urls";

const membersDB = new webix.DataCollection({
	url: membersURL,
	save: `json->${membersURL}`
});

export default membersDB;
