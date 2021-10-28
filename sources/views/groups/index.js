import {JetView} from "webix-jet";

import albumsDB from "../../models/albumsDB";
import groupsDB from "../../models/groupsDB";

export default class Groups extends JetView {
	config() {
		return {
			rows: [
				{
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
				},
				{
					view: "datatable",
					localId: "table",
					columns: [
						{id: "Name", header: "Groups name", fillspace: 3},
						{id: "Style", header: "Music style", fillspace: 3},
						{
							id: "Albums",
							header: "Albums",
							fillspace: 3,
							collection: albumsDB,
							template(obj) {
								const albumsArr = this.collection.find(o => o.GroupID === obj.id);
								let albumsStr = "";
								albumsArr.forEach((item) => {
									albumsStr += `${item.Name}, `;
								});
								albumsStr += "qweqweqw, asdsa";
								return albumsStr;
							}
						},
						{
							id: "CreationDate",
							header: "Creation date"
						},
						{id: "Country", header: "Country", fillspace: 3},
						{
							id: "del",
							header: "",
							template: "{common.trashIcon()}",
							css: "table-icon",
							fillspace: 1
						},
						{
							id: "edit",
							header: "",
							template: "{common.editIcon()}",
							css: "table-icon",
							fillspace: 1
						}
					],
					css: "webix_data_border webix_header_border table-custom",
					tooltip: true,
				}
			]
		};
	}

	init() {
		const table = this.$$("table");
		table.showOverlay("Loading...");

		albumsDB.waitData.then(() => {
			table.parse(groupsDB);
			table.hideOverlay();
		});
	}
}
