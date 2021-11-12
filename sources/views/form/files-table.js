import {JetView} from "webix-jet";

import {filesURL} from "../../config/urls";
import filesDB from "../../models/filesDB";

export default class FilesTable extends JetView {
	config() {
		return {
			view: "datatable",
			columns: [
				{id: "Name", header: "File name", fillspace: 8},
				{
					id: "download",
					header: "",
					template: () => "<span>Download</span>",
					fillspace: 3,
					css: "table-icon downloadCol",
					tooltip: false
				},
				{
					id: "del",
					header: "",
					template: "{common.trashIcon()}",
					fillspace: 1,
					css: "table-icon deleteIcon",
					tooltip: false
				}
			],
			css: "webix_data_border webix_header_border",
			tooltip: true

		};
	}

	urlChange(view) {
		const groupId = this.getParam("groupId");

		if (groupId) {
			filesDB.load(filesURL);

			view.data.sync(filesDB, () => {
				view.filter(obj => obj.GroupID === groupId);
			});
		}
	}
}
