import {JetView} from "webix-jet";

import groupsDB from "../../models/groupsDB";

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
		view.parse(groupsDB);

		groupsDB.waitData.then(() => {
			const initSelect = view.getFirstId();
			view.select(initSelect);
		});

		this.on(view, "onAfterSelect", (id) => {
			const parentView = this.getParentView();
			parentView.setParam("groupId", id, true);
		});
	}
}
