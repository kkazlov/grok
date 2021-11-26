import {JetView} from "webix-jet";

import {groupsURL} from "../../config/urls";

export default class List extends JetView {
	config() {
		return {
			view: "list",
			select: true,
			template: "#Name#",
			gravity: 2
		};
	}

	init(view) {
		try {
			view.load(groupsURL).then(() => {
				const initSelect = view.getFirstId();
				view.select(initSelect);
			});
		}
		catch (error) {
			webix.message("Server Error. Try later.");
		}

		this.on(view, "onAfterSelect", (id) => {
			const group = view.data.getItem(id);
			this.app.callEvent("albums:list:select", [group]);
		});
	}
}
