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
			],
			on: {
				onBeforeEditStop(state, editor, ignore) {
					const value = editor.getValue();
					const check = (value !== "" && value.length <= 30);
					if (!ignore && !check) {
						this.validateEditor(editor);
						return false;
					}
					return true;
				}
			}
		};
	}

	init(view) {
		let filtersValue = {};

		const matchValue = (obj, value) => {
			const objLow = obj.toString().toLowerCase();
			const valueLow = value.toString().toLowerCase();
			return objLow.indexOf(valueLow) !== -1;
		};

		this.on(view.data, "onDataUpdate", () => {
			const filterKeys = Object.keys(filtersValue);
			filterKeys.forEach((key) => {
				if (filtersValue[key]) {
					view.data.filter(item => matchValue(item[key], filtersValue[key]), "", true);
				}
			});
		});

		this.on(view, "onBeforeFilter", (id, value) => {
			filtersValue[id] = value.toString().toLowerCase();
		});
	}
}
