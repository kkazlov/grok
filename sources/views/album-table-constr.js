import {JetView} from "webix-jet";


export default class AlbumsTableConstr extends JetView {
	config() {
		return {
			view: "datatable",
			localId: "table",
			editable: true,
			rules: {
				$all: (value, fields, name) => {
					if (name === "Name" || name === "ReleseDate") {
						return this.validRule(value);
					}
					if (name === "CopiesNumber") {
						return this.copiesRule(value);
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
				deleteIcon: (e, id) => this.deleteIcon(id)
			}
		};
	}

	init(view) {
		this.on(view, "onBeforeEditStop", (state, editor, ignore) => {
			const value = editor.getValue();
			const columnName = editor.column;

			if (columnName === "ReleseDate") {
				state.value = webix.Date.dateToStr("%Y-%m-%d")(value);
			}

			if (columnName === "Name") {
				state.value = value.trim();
			}

			const isValid = columnName !== "CopiesNumber" ?
				this.validRule(value) :
				this.copiesRule(value);

			if (!ignore && !isValid) {
				view.validateEditor(editor);
				return false;
			}
			return true;
		});
	}

	validRule(value) {
		const isEmpty = webix.rules.isNotEmpty(value);
		const isLong = value.toString().length <= 30;
		const isNotOnlySpace = /\S/g.test(value);

		return isEmpty && isLong && isNotOnlySpace;
	}

	copiesRule(value) {
		return this.validRule(value) &&
			webix.rules.isNumber(value);
	}

	deleteIcon(id) {
		webix.confirm({
			title: "Delete",
			text: "Do you want to delete this record?"
		}).then(() => {
			this.deleteAlbum(id);
		});
	}
}