import {JetView} from "webix-jet";

import {filesURL, host} from "../../config/urls";
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
					template: obj => `<a href="${host}${obj.File}" download>Download</a>`,
					fillspace: 3,
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
			tooltip: true,
			onClick: {
				deleteIcon: (e, id) => this.deleteIcon(e, id)
			}

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

	/* downloadCol(e, id) {
		if (e.target.tagName === "A") {

		}
	} */

	deleteIcon(e, id) {
		webix
			.confirm({
				title: "Delete",
				text: "Do you want to delete this file? WARNING! You will not be able to restore this file!"
			})
			.then(() => {
				filesDB.remove(id);
			});
	}
}
