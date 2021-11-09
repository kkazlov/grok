import {JetView} from "webix-jet";

import groupsDB from "../../models/groupsDB";
import stylesDB from "../../models/stylesDB";

export default class Popup extends JetView {
	config() {
		const name = {
			view: "text",
			label: "Group name",
			name: "Name",
			required: true
		};

		const style = {
			view: "combo",
			label: "Music Style",
			name: "Style",
			options: stylesDB,
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
			format: "%Y-%m-%d",
			label: "Creation date",
			name: "CreationDate",
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
			modal: true,
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

		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(values.CreationDate);
		const sendObj = {...values, CreationDate: dateStr};

		const validation = form.validate();

		if (validation) {
			groupsDB.waitSave(() => {
				groupsDB.updateItem(this._id, sendObj);
			});

			this.hideWindow();
		}
	}

	showWindow(id) {
		this._id = id;
		const form = this.$$("form");

		form.clear();
		form.clearValidation();

		groupsDB.waitData.then(() => {
			const values = groupsDB.getItem(id);
			form.setValues(values);
		});

		this.getRoot().show();
	}

	hideWindow() {
		this.$$("window").hide();
		this.app.callEvent("groups:popup:hide");
	}
}

