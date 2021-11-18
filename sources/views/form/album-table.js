import {albumsURL} from "../../config/urls";
import AlbumsTableConstr from "../album-table-constr";

export default class AlbumTable extends AlbumsTableConstr {
	init(view) {
		super.init(view);

		const updatedAlbums = new Set();
		const deletedAlbums = new Set();

		this.on(view, "onAfterEditStart", () => {
			this.app.callEvent("form:table:editorState", [true]);
		});

		this.on(view, "onAfterEditStop", () => {
			this.app.callEvent("form:table:editorState", [false]);
		});

		this.on(view, "onBeforeEditStart", () => {
			view.editCancel();
		});

		this.on(view.data, "onStoreUpdated", (id, obj, mode) => {
			if (id) {
				if (mode === "update") updatedAlbums.add(id);

				if (mode === "delete") {
					deletedAlbums.add(id.row);

					const checkUpdated = updatedAlbums.has(id.row);
					if (checkUpdated) updatedAlbums.delete(id.row);
				}

				this.app.callEvent("form:table:data", [
					{updatedAlbums, deletedAlbums},
					view.data
				]);
			}
		});

		this.app.callEvent("form:table:data", [
			{updatedAlbums, deletedAlbums},
			view.data
		]);

		this.on(this.app, "form:table:refresh", (state) => {
			if (state) view.load(albumsURL);
		});
	}

	urlChange(view) {
		const groupId = this.getParam("groupId");

		if (groupId) {
			view.load(albumsURL).then(() => {
				view.filter(obj => obj.GroupID === groupId);
			});
		}
	}

	deleteAlbum(id) {
		const table = this.$$("table");
		table.data.remove(id);
	}
}

