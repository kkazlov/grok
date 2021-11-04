import {groupsURL} from "../config/urls";

const groupsDB = new webix.DataCollection({
	url: groupsURL,
	save: `json->${groupsURL}`,
	scheme: {
		$change(obj) {
			obj.Date = webix.Date.strToDate("%Y-%m-%d")(obj.CreationDate);
		}
	}
});

export default groupsDB;
