import {JetView} from "webix-jet";

import albumsDB from "../../models/albumsDB";
import groupsDB from "../../models/groupsDB";

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
					width: 200
				},
				{
					view: "button",
					value: "Refresh",
					width: 200
				}
			]
		};

		const Table = {
			view: "datatable",
			localId: "table",
			columns: [
				{id: "Name", header: "Groups name", fillspace: 3, sort: "string"},
				{id: "Style", header: "Music style", fillspace: 3, sort: "string"},
				{
					id: "Tracks",
					header: "Number of tracks",
					fillspace: 3,
					collection: albumsDB,
					template: obj => this.trackCounter(obj),
					sort: (a, b) => this.trackCounter(a) - this.trackCounter(b)
				},
				{
					id: "Date",
					header: "Creation date",
					fillspace: 3,
					format: value => webix.i18n.longDateFormatStr(value),
					sort: "date"
				},
				{id: "Country", header: "Country", fillspace: 3, sort: "string"},
				{
					id: "edit",
					header: "",
					template: "{common.editIcon()}",
					css: "table-icon",
					fillspace: 1,
					sort: "string"
				}
			],
			css: "webix_data_border webix_header_border table-custom"
		};

		return {rows: [Toolbar, Table]};
	}

	init() {
		const table = this.$$("table");
		table.showOverlay("Loading...");

		albumsDB.waitData.then(() => {
			table.parse(groupsDB);
			table.hideOverlay();
		});
	}

	trackCounter(obj) {
		const collection = this.$$("table").config.columns[2].collection;
		const albumsArr = collection.find(o => o.GroupID === obj.id);
		let trackCounter = 0;
		albumsArr.forEach((item) => {
			trackCounter += item.TrackList.length;
		});
		return trackCounter;
	}
}
