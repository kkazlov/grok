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
		this.GroupID = this.getParam("groupId");
		if (this.GroupID) {
			this.loadAlbums().then((albums) => {
				view.clearAll();
				view.parse(albums);
				this.initSelect(view);
			});
		}
	}

	async loadAlbums() {
		const data = await webix.ajax()
			.get(albumsURL, {GroupID: this.GroupID});
		return data.json();
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
