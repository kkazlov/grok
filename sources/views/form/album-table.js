import {JetView} from "webix-jet";

import {albumsURL} from "../../config/urls";
import albumsDB from "../../models/albumsDB";

export default class AlbumTable extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "table",
			editable: true,
			columns: [
				{
					id: "Name",
					header: "Album name",
					fillspace: 5,
					editor: "text"
				},
				{
					id: "ReleseDate",
					header: "Relese Date",
					fillspace: 3,
					editor: "date",
					suggest: {
						type: "calendar",
						body: {
							maxDate: new Date()
						}
					}
				},
				{
					id: "CopiesNumber",
					header: "Issued copies",
					fillspace: 3,
					editor: "text"
				},
				{
					id: "del",
					header: "",
					template: "{common.trashIcon()}",
					fillspace: 1,
					css: "table-icon deleteIcon"
				}
			],
			css: "webix_data_border webix_header_border custom-table",
			onClick: {
				deleteIcon: (e, id) => this.deleteIcon(e, id)
			}
		};
	}

	init(view) {
		const updatedAlbums = new Set();

		this.on(albumsDB.data, "onStoreUpdated", (id) => {
			if (id) updatedAlbums.add(id);
		});

		this.app.callEvent("form:table:data", [updatedAlbums, view.data]);
	}

	urlChange(view) {
		const groupId = this.getParam("groupId");

		if (groupId) {
			albumsDB.load(albumsURL);

			view.data.sync(albumsDB, () => {
				view.filter(obj => obj.GroupID === groupId);
			});
		}
	}

	deleteIcon(e, id) {
		webix
			.confirm({
				title: "Delete",
				text: "Do you want to delete this record?"
			})
			.then(() => {
				albumsDB.remove(id);
			});
	}
}
