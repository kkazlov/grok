import {JetView} from "webix-jet";

import {groupsURL} from "../../config/urls";
import albumsDB from "../../models/albumsDB";
import groupsDB from "../../models/groupsDB";

export default class Table extends JetView {
	config() {
		const rule = value => webix.rules.isNotEmpty(value) && value.toString().length <= 30;

		return {
			view: "datatable",
			localId: "table",
			select: true,
			editable: true,
			editaction: "custom",
			rules: {
				$all: (value, fields, name) => {
					if (name === "Name" || name === "ReleseDate") {
						return rule(value);
					}
					if (name === "CopiesNumber") {
						return rule(value) && webix.rules.isNumber(value);
					}
					return true;
				}
			},
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
					fillspace: 2,
					template: obj => obj.TrackList.length
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
			gravity: 6,
			onClick: {
				deleteIcon: (e, id) => this.deleteIcon(e, id)
			}
		};
	}

	init(view) {
		this.on(view, "onAfterSelect", (id) => {
			this.app.callEvent("albums:table:select", [id.id]);
			view.editCancel();
		});

		this.on(view, "onItemDblClick", (id) => {
			view.edit(id);
		});

		this.on(view, "onBeforeEditStop", (state, editor, ignore) => {
			const value = editor.getValue();

			if (editor.column === "ReleseDate") {
				state.value = webix.Date.dateToStr("%Y-%m-%d")(value);
			}

			const check = (value !== "" && value.length <= 30);
			if (!ignore && !check) {
				view.validateEditor(editor);
				return false;
			}
			return true;
		});

		this.on(view, "onDataUpdate", (id) => {
			this.app.callEvent("albums:table:select", [id]);
		});
	}

	urlChange(view) {
		const groupId = this.getParam("groupId");

		view.data.sync(albumsDB, () => {
			view.filter(obj => obj.GroupID === groupId);
			this.initSelect(view);
		});
	}

	initSelect(view) {
		const checkTable = view.data.order.length;

		if (checkTable) {
			const initSelect = view.getFirstId();
			view.select(initSelect);
		}
		else {
			this.app.callEvent("albums:table:select", [null]);
		}
	}

	deleteIcon(e, id) {
		const table = this.$$("table");

		webix.confirm({
			title: "Delete",
			text: "Do you want to delete this record?"
		}).then(() => {
			albumsDB.remove(id);
			this.initSelect(table);
			groupsDB.load(groupsURL);
		});
	}
}
