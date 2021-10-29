import {JetView} from "webix-jet";

import groupsDB from "../../models/groupsDB";

export default class Popup extends JetView {
	config() {
		const name = {
			view: "text",
			label: "Group name",
			name: "Name",
			required: true
		};

		const style = {
			view: "text",
			label: "Music Style",
			name: "Style",
			required: true
		};

		const country = {
			view: "text",
			label: "Country",
			name: "Country",
			required: true
		};

		const date = {
			view: "datepicker",
			localId: "date",
			format: "%d %M %Y",
			label: "Creation date",
			name: "Date",
			required: true
		};


		const actionBtn = {
			view: "button",
			localId: "actionBtn",
			value: "Save",
			width: 120,
			click: () => {
				this.updateDB();
			}
		};

		const cancelBtn = {
			view: "button",
			width: 120,
			value: "Cancel",
			click: () => {
				this.hideWindow();
			}
		};

		return {
			view: "window",
			localId: "window",
			position: "center",
			head: "Edit",
			width: 600,
			body: {
				view: "form",
				localId: "form",
				elements: [
					name,
					style,
					country,
					date,
					{margin: 10, cols: [{}, actionBtn, cancelBtn]}
				],
				rules: {
					Name: value => value.length <= 30,
					Style: value => value.length <= 30,
					Country: value => value.length <= 30
				},
				elementsConfig: {
					labelWidth: 120,
					invalidMessage: "Error! A value is empty or more than 30 chars"
				},
				on: {
					onChange() {
						this.clearValidation();
					}
				}
			}
		};
	}


	updateDB() {
		const form = this.$$("form");
		const values = form.getValues();

		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(values.Date);
		delete values.Date;

		const sendObj = {...values, CreationDate: dateStr};

		const validation = form.validate();

		if (validation) {
			groupsDB.waitSave(() => {
				groupsDB.updateItem(this._id, sendObj);
			});

			this.hideWindow();
		}
	}

	showWindow(id, table, layout) {
		this._id = id;
		this._table = table;
		this._layout = layout;

		const form = this.$$("form");

		this._layout.disable();

		groupsDB.waitData.then(() => {
			const values = groupsDB.getItem(id);
			form.setValues(values);
		});

		this.getRoot().show();
	}

	hideWindow() {
		const form = this.$$("form");

		form.clear();
		form.clearValidation();

		this.getRoot().hide();
		this._table.clearSelection();
		this._layout.enable();
	}
}

