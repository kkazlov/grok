import {JetView} from "webix-jet";

import albumsDB from "../../models/albumsDB";
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
					click: () => {
						this.$$("table").refresh();
					}
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
					header: [
						"Number of tracks",
						{
							content: "textFilter",
							compare: (value, filter, obj) => this.trackCounter(obj)
								.toString()
								.indexOf(filter) === 0
						}
					],
					fillspace: 3,
					collection: albumsDB,
					template: obj => this.trackCounter(obj),
					sort: (a, b) => this.trackCounter(a) - this.trackCounter(b)
				},
				{
					id: "Date",
					header: ["Creation date", {content: "datepickerFilter"}],
					fillspace: 3,
					format: value => webix.i18n.longDateFormatStr(value),
					sort: "date"
				},
				{
					id: "Country",
					header: ["Country", {content: "textFilter"}],
					fillspace: 3,
					sort: "string"
				}
			],
			css: "webix_data_border webix_header_border"
		};

		return {localId: "layout", rows: [Toolbar, Table]};
	}

	init() {
		this._popup = this.ui(Popup);
		const table = this.$$("table");
		const layout = this.$$("layout");

		table.showOverlay("Loading...");

		albumsDB.waitData.then(() => {
			table.parse(groupsDB);
			table.hideOverlay();
		});

		this.on(table, "onAfterSelect", ({id}) => {
			this._popup.showWindow(id, table, layout);
		});
	}

	trackCounter(group) {
		const collection = this.$$("table").config.columns[2].collection;
		const albumsArr = collection.find(album => album.GroupID === group.id);
		let trackCounter = 0;
		albumsArr.forEach((item) => {
			trackCounter += item.TrackList.length;
		});
		return trackCounter;
	}
}
