import {JetView} from "webix-jet";

import {groupsURL} from "../../config/urls";
import stylesDB from "../../models/stylesDB";
import Popup from "./popup";

export default class Groups extends JetView {
	config() {
		const Toolbar = {
			view: "toolbar",
			cols: [
				{},
				{
					view: "button",
					id: "LoadBut",
					value: "Export to excel",
					width: 200,
					click: () => {
						webix.toExcel(this.$$("table"));
					}
				},
				{
					view: "button",
					value: "Refresh",
					width: 200,
					click: () => this.refresh()
				}
			]
		};

		const Table = {
			view: "datatable",
			localId: "table",
			select: true,
			columns: [
				{
					id: "Name",
					header: ["Groups name", {content: "textFilter"}],
					fillspace: 3,
					sort: "string"
				},
				{
					id: "Style",
					header: ["Music style", {content: "selectFilter"}],
					fillspace: 3,
					sort: "string",
					collection: stylesDB,
					template: obj => stylesDB.getItem(obj.Style).value
				},
				{
					id: "Tracks",
					header: ["Number of tracks", {content: "numberFilter"}],
					fillspace: 3,
					sort: "int"
				},
				{
					id: "Date",
					header: ["Creation date", {content: "datepickerFilter"}],
					fillspace: 3,
					format: value => webix.Date.dateToStr("%Y-%m-%d")(value),
					sort: "date"
				},
				{
					id: "Country",
					header: ["Country", {content: "textFilter"}],
					fillspace: 3,
					sort: "string"
				}
			],
			save: `json->${groupsURL}`,
			scheme: {
				$change(obj) {
					obj.Date = webix.Date.strToDate("%Y-%m-%d")(obj.CreationDate);
				}
			},
			css: "webix_data_border webix_header_border"
		};

		return {localId: "layout", rows: [Toolbar, Table]};
	}

	init() {
		this._popup = this.ui(Popup);
		this.table = this.$$("table");

		this.loadGroup();

		this.on(this.table, "onAfterSelect", ({id}) => {
			this.groupId = id;

			const group = this.table.data.getItem(id);
			this._popup.showWindow(group);
		});

		this.on(this.table.data, "onDataUpdate", () => {
			this.table.filterByAll();
		});

		this.on(this.table, "onAfterLoad", () => {
			this.table.filterByAll();
		});

		this.on(this.app, "groups:popup:hide", () => {
			this.table.clearSelection();
		});

		this.on(this.app, "groups:popup:save", (sendObj) => {
			this.table.data.updateItem(this.groupId, sendObj);
		});
	}

	loadGroup() {
		this.table.showOverlay("Loading...");
		this.table.load(groupsURL).then(() => {
			this.table.hideOverlay();
		});
	}

	refresh() {
		this.table.clearAll();
		this.loadGroup();
	}
}
