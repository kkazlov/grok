import AlbumsTableConstr from "../album-table-constr";

export default class AlbumTable extends AlbumsTableConstr {
	constructor(app) {
		super(app);
		this.hideSongsCol = true;
	}

	init(view) {
		super.init(view);

		const state = this.app.getService("albumsState");

		this.on(this.app, "form:richselect:select", (GroupID) => {
			try {
				this.GroupID = GroupID;

				if (GroupID) {
					state.clearState();
					this.table.showOverlay("Loading...");
					this.loadAlbums().then((albums) => {
						this.table.hideOverlay();
						this.setTableData(albums);
					});
				}
			}
			catch (error) {
				this.table.showOverlay("Server Error. Try later.");
			}
		});

		this.on(view, "onAfterLoad", () => {
			const initAlbums = view.serialize();
			state.setInit(initAlbums);
		});


		this.on(this.app, "form:albums:restore", (isRestore) => {
			if (isRestore) {
				const initAlbums = state.getState().init;
				this.setTableData(initAlbums);
			}
		});

		this.on(view.data, "onStoreUpdated", (id, obj, mode) => {
			if (id) {
				state.setCurrent(view.serialize());

				if (mode === "update") state.addUpdated(id);
				if (mode === "delete") state.addDeleted(id.row);
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
	}

	deleteAlbum(id) {
		this.table.data.remove(id);
	}
}
