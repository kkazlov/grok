import {JetView, plugins} from "webix-jet";

export default class TopView extends JetView {
	config() {
		const header = {
			type: "header",
			localId: "header",
			template: obj => `${obj.menuName || ""}`,
			css: "webix_header app_header"
		};

		const menu = {
			view: "menu",
			localId: "menu",
			id: "top:menu",
			css: "main-menu",
			width: 150,
			layout: "y",
			select: true,
			template: "#value#",
			data: [
				{value: "Groups", id: "groups"},
				{value: "Members", id: "members"},
				{value: "Albums", id: "albums"},
				{value: "Form", id: "form"}
			]
		};

		const ui = {
			rows: [
				header,
				{cols: [menu, {$subview: true}]}
			]
		};

		return ui;
	}

	init() {
		this.use(plugins.Menu, "top:menu");
		const menu = this.$$("menu");
		const header = this.$$("header");

		menu.attachEvent("onAfterSelect", () => {
			const value = menu.getSelectedItem().value;
			header.setValues({menuName: value});
		});
	}
}
