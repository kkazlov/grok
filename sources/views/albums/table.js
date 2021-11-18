import {albumsURL} from "../../config/urls";
import albumsDB from "../../models/albumsDB";
import AlbumsTableConstr from "../album-table-constr";

export default class Table extends AlbumsTableConstr {
	config() {
		const inheritedCols = super.config().columns;

		const SongsCol = {
			id: "Songs",
			header: "Tracks",
			fillspace: 2,
			template: obj => obj.TrackList.length
		};

		const tableCols = [
			...inheritedCols.slice(0, 2),
			SongsCol,
			...inheritedCols.slice(2)
		];

		return {
			...super.config(),
			select: true,
			editable: true,
			editaction: "custom",
			columns: tableCols,
			gravity: 6

		};
	}

	init(view) {
		super.init(view);

		albumsDB.load(albumsURL);

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
		const groupId = this.getParam("groupId");

		view.data.sync(albumsDB, () => {
			view.filter(obj => obj.GroupID === groupId);
			this.initSelect(view);
		});
	}

	initSelect(view) {
		const checkTable = view.data.order.length;

		if (checkTable) {
			const initSelect = view.getFirstId();
			view.select(initSelect);
		}
		else {
			this.app.callEvent("albums:table:select", [null]);
		}
	}

	deleteAlbum(id) {
		const table = this.$$("table");
		albumsDB.remove(id);
		this.initSelect(table);
	}
}
