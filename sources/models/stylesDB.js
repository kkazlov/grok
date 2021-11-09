import {stylesURL} from "../config/urls";

const stylesDB = new webix.DataCollection({
	url: stylesURL,
	save: `json->${stylesURL}`
});

export default stylesDB;
