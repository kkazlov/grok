import {JetView} from "webix-jet";

import {groupsURL} from "../../config/urls";
import groupsDB from "../../models/groupsDB";
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
					header: ["Music style", {content: "textFilter"}],
					fillspace: 3,
					sort: "string"
				},
				{
					id: "Tracks",
					header: ["Number of tracks", {content: "textFilter"}],
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
		const table = this.$$("table");

		table.showOverlay("Loading...");

		groupsDB.waitData.then(() => {
			table.parse(groupsDB);
			table.hideOverlay();
		});

		this.on(table, "onAfterSelect", ({id}) => {
			this._popup.showWindow(id);
		});

		this.on(groupsDB, "onDataUpdate", () => {
			table.filterByAll();
		});

		this.on(table, "onAfterLoad", () => {
			table.filterByAll();
		});

		this.on(this.app, "groups:popup:hide", () => {
			table.clearSelection();
		});
	}

	refresh() {
		const table = this.$$("table");
		table.clearAll();

		table.showOverlay("Loading...");
		table.load(groupsURL).then(() => {
			table.hideOverlay();
		});
	}
}
