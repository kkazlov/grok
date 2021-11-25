import {JetView} from "webix-jet";

import {filesURL, host} from "../../config/urls";

export default class FilesTable extends JetView {
	config() {
		return {
			view: "datatable",
			save: `json->${filesURL}`,
			columns: [
				{id: "Name", header: "File name", fillspace: 8},
				{
					id: "download",
					header: "",
					template: obj => `
						<a href="${host}${obj.File}" download>
							Download
						</a>
					`,
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

	init(view) {
		this.table = view;
		this.on(this.app, "form:richselect:select", (GroupID) => {
			this.GroupID = GroupID;
			if (GroupID) {
				this.loadFiles();
			}
		});

		this.on(this.app, "form:uploader:complete", (isComplete) => {
			if (isComplete) {
				this.loadFiles();
			}
		});
	}

	async loadFiles() {
		await webix.ajax()
			.get(filesURL, {GroupID: this.GroupID})
			.then((files) => {
				this.table.clearAll();
				this.table.parse(files);
			});
	}

	deleteIcon(e, id) {
		webix
			.confirm({
				title: "Delete",
				text: "Do you want to delete this file? WARNING! You will not be able to restore this file!"
			})
			.then(() => {
				this.table.data.remove(id);
			});
	}
}
