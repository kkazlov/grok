import {JetView} from "webix-jet";


export default class Members extends JetView {
	config() {
		return {
			view: "datatable",
			editable: true,
			save: "json->http://localhost:5000/api/members",
			url: "http://localhost:5000/api/members",
			rules: {
				$all: value => webix.rules.isNotEmpty(value) && value.toString().length <= 30
			},
			columns: [
				{
					id: "Name",
					header: ["Name", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1,
					editor: "text"
				},
				{
					id: "Role",
					header: ["Role", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1,
					editor: "text"
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
					fillspace: 1,
					editor: "text"
				},
				{
					id: "Awards",
					header: ["Awards", {content: "serverFilter"}],
					sort: "server",
					fillspace: 1,
					editor: "text"
				}
			]
		};
	}

	init(view) {
		/* this.on(webix, "onBeforeAjax", (mode, url) => {
			if (mode === "GET") this._req = url;
		});

		this.on(view, "onAfterEditStop", (state, editor, ignoreUpdate) => {
			console.log(view.getFilter())
			setTimeout(() => {
				view.load(this._req)
			}, 500);
		}); */
	}
}
