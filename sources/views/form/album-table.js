import AlbumsTableConstr from "../album-table-constr";

export default class AlbumTable extends AlbumsTableConstr {
	constructor(app) {
		super(app);
		this.hideSongsCol = true;
	}

	init(view) {
		super.init(view);

		this.on(this.app, "form:richselect:select", (GroupID) => {
			this.GroupID = GroupID;
			if (GroupID) {
				this.loadAlbums();
			}
		});

		this.on(view, "onAfterEditStart", () => {
			this.app.callEvent("form:table:editorState", [true]);
		});

		this.on(view, "onAfterEditStop", () => {
			this.app.callEvent("form:table:editorState", [false]);
		});

		this.on(view, "onBeforeEditStart", () => {
			view.editCancel();
		});

		/* const updatedAlbums = new Set();
		const deletedAlbums = new Set();



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

		this.on(this.app, "form:table:refresh", (state) => {
			if (state) this.uploadAlbums(view);
		}); */
	}


	/*
	deleteAlbum(id, view) {
		view.data.remove(id);
	} */
}
