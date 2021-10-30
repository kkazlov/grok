import {JetView} from "webix-jet";

import membersDB from "../../models/membersDB";

export default class Members extends JetView {
	config() {
		return {
			view: "datatable",
			columns: [
				{id: "Name", header: ["Name", {content: "serverFilter"}], fillspace: 1},
				{id: "Role", header: ["Role", {content: "serverFilter"}], fillspace: 1},
				{id: "BirthDate", header: ["Birth Date", {content: "serverFilter"}], fillspace: 1},
				{id: "Country", header: ["Country", {content: "serverFilter"}], fillspace: 1},
				{id: "Awards", header: ["Awards", {content: "serverFilter"}], fillspace: 1}
			]
		};
	}

	init(view) {
		const url = "http://localhost:5000/api/members";
		view.load(url);
	}
}
