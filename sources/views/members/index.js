import {JetView} from "webix-jet";

export default class Members extends JetView {
	config() {
		return {
			view: "datatable",
			columns: [
				{
					id: "Name",
					header: ["Name", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1
				},
				{
					id: "Role",
					header: ["Role", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1
				},
				{
					id: "BirthDate",
					header: ["Birth Date", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1
				},
				{
					id: "Country",
					header: ["Country", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1
				},
				{
					id: "Awards",
					header: ["Awards", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1
				}
			]
		};
	}

	init(view) {
		const url = "http://localhost:5000/api/members";
		view.load(url);
	}
}
