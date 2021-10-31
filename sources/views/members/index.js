import {JetView} from "webix-jet";


export default class Members extends JetView {
	config() {
		return {
			view: "datatable",
			editable: true,
			save: "json->http://localhost:5000/api/members",
			url: "http://localhost:5000/api/members",
			rules: {
				BirthDate: webix.rules.isNotEmpty
			},
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
					editor: "date",
					fillspace: 1,
					template: obj => obj.BirthDate.slice(0, 11) || "No date",
					suggest: {
						type: "calendar",
						body: {
							maxDate: new Date()
						}
					}
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
		this.on(view, "onAfterEditStop", () => {
		})
	}
}
