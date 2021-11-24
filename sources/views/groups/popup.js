import {JetView} from "webix-jet";

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
					Name: value => this.validRule(value),
					Style: value => this.validRule(value),
					Country: value => this.validRule(value)
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

	init() {
		this.form = this.$$("form");
	}


	updateDB() {
		const values = this.form.getValues();
		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(values.CreationDate);
		const sendObj = {...values, CreationDate: dateStr};

		const validation = this.form.validate();

		if (validation) {
			this.app.callEvent("groups:popup:hide");
			this.app.callEvent("groups:popup:save", [sendObj]);

			this.hideWindow();
		}
	}

	showWindow(group) {
		this.form.clear();
		this.form.clearValidation();
		this.form.setValues(group);

		this.getRoot().show();
	}

	hideWindow() {
		this.$$("window").hide();
		this.app.callEvent("groups:popup:hide");
	}

	validRule(value) {
		const isEmpty = webix.rules.isNotEmpty(value);
		const isLong = value.toString().length <= 30;
		const isNotOnlySpace = /\S/g.test(value);

		return isEmpty && isLong && isNotOnlySpace;
	}
}

