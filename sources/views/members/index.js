import {JetView} from "webix-jet";

import {membersURL} from "../../config/urls";

export default class Members extends JetView {
	config() {
		return {
			view: "datatable",
			editable: true,
			save: `json->${membersURL}`,
			rules: {
				$all: value => this.rule(value)
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
		let filtersValue = {};

		try {
			view.showOverlay("Loading...");
			view.load(membersURL).then(() => {
				view.hideOverlay();
			});
		}
		catch (error) {
			this.table.showOverlay("Server Error. Try later.");
		}

		const findValue = (obj, value) => {
			const objLow = obj.toString().toLowerCase();
			const valueLow = value.toString().toLowerCase();
			return objLow.indexOf(valueLow) !== -1;
		};

		this.on(view.data, "onDataUpdate", () => {
			const filterKeys = Object.keys(filtersValue);
			filterKeys.forEach((key) => {
				if (filtersValue[key]) {
					view.data.filter(item => findValue(item[key], filtersValue[key]), "", true);
				}
			});
		});

		this.on(view, "onBeforeFilter", (id, value) => {
			filtersValue[id] = value.toString().toLowerCase();
		});

		this.on(view, "onBeforeEditStop", (state, editor, ignore) => {
			const value = editor.getValue();

			if (editor.column === "BirthDate") {
				state.value = webix.Date.dateToStr("%Y-%m-%d")(value);
			}

			const check = (value !== "" && value.length <= 30);
			if (!ignore && !check) {
				view.validateEditor(editor);
				return false;
			}
			return true;
		});

		this.on(view, "onDataRequest", () => {
			view.editCancel();
		});
	}

	rule(value) {
		const isEmpty = webix.rules.isNotEmpty(value);
		const isLong = value.toString().length <= 30;
		const isNotOnlySpace = /\S/g.test(value);

		return isEmpty && isLong && isNotOnlySpace;
	}
}
