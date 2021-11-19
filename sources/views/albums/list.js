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

		groupsDB.waitData.then(() => this.selectFirstGroup(view));

		this.on(view, "onAfterSelect", (id) => {
			const parentView = this.getParentView();
			parentView.setParam("groupId", id, true);
		});
	}

	urlChange(view, url) {
		const groupId = url[0].params.groupId;

		groupsDB.waitData.then(() => {
			const isGroupID = groupsDB.getIndexById(groupId) > -1;

			if (!isGroupID) {
				view.unselect();
				this.selectFirstGroup(view);
			}
		});
	}

	selectFirstGroup(view) {
		const initSelect = view.getFirstId();
		view.select(initSelect);
	}
}
