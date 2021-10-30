import {JetView} from "webix-jet";

import membersDB from "../../models/membersDB";

export default class Members extends JetView {
	config() {
		return {
			view: "datatable",
			columns: [
				{id: "Name", header: "Name", fillspace: 1},
				{id: "Role", header: "Role", fillspace: 1},
				{id: "BirthDate", header: "Birth Date", fillspace: 1},
				{id: "Country", header: "Country", fillspace: 1},
				{id: "Awards", header: "Awards", fillspace: 1}
			]
		};
	}

	init(view) {
		const url = "http://localhost:5000/api/members";
		view.load(url);
	}
}
