import {albumsURL} from "../../config/urls";
/* import albumsDB from "../../models/albumsDB"; */
import AlbumsTableConstr from "../album-table-constr";

export default class Table extends AlbumsTableConstr {
	config() {
		return {
			...super.config(),
			select: true,
			editable: true,
			editaction: "custom",
			gravity: 6
		};
	}

	init(view) {
		super.init(view);

		/* albumsDB.load(albumsURL); */

		this.on(view, "onAfterSelect", (id) => {
			this.app.callEvent("albums:table:select", [id.id]);


			view.editCancel();
		});

		this.on(view, "onItemDblClick", (id) => {
			view.edit(id);
		});

		this.on(view, "onDataUpdate", (id) => {
			this.app.callEvent("albums:table:select", [id]);
		});
	}

	urlChange(view) {
		const GroupID = this.getParam("groupId");

		webix.ajax()
			.get(albumsURL, {GroupID})
			.then((res) => {
				view.clearAll();
				view.parse(res.json());
			});

		/* view.data.sync(albumsDB, () => {
			view.filter(obj => obj.GroupID === groupId);
			this.initSelect(view);
		}); */
	}

	initSelect(view) {
		const checkTable = view.serialize().length;

		if (checkTable) {
			const initSelect = view.getFirstId();
			view.select(initSelect);
		}
		else {
			this.app.callEvent("albums:table:select", [null]);
		}
	}

	deleteAlbum(id, view) {
		/* albumsDB.remove(id); */
		this.initSelect(view);
	}
}
