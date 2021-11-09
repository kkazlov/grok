import {JetView} from "webix-jet";

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
					id: "Songs",
					header: "Tracks",
					fillspace: 2
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
			css: "webix_data_border webix_header_border custom-table"
		};
	}
}
