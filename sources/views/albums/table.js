import {albumsURL} from "../../config/urls";
import AlbumsTableConstr from "../album-table-constr";

export default class Table extends AlbumsTableConstr {
	config() {
		return {
			...super.config(),
			select: true,
			editable: true,
			editaction: "custom",
			save: `json->${albumsURL}`,
			gravity: 6
		};
	}

	init(view) {
		super.init(view);
		this.table.showOverlay("Loading...");

		this.on(this.app, "albums:list:select", (group) => {
			try {
				const {id, Name} = group;
				this.GroupID = id;
				this.groupName = Name;

				if (this.GroupID) {
					this.table.showOverlay("Loading...");
					this.loadAlbums().then((albums) => {
						this.table.hideOverlay();
						this.table.parse(albums);
						this.selectFirstAlbum();
					});
				}
			}
			catch (error) {
				this.table.showOverlay("Server Error. Try later.");
			}
		});

		this.on(view, "onAfterSelect", (id) => {
			this.sendAlbumInfo(id);
			view.editCancel();
		});

		this.on(view, "onItemDblClick", (id) => {
			view.edit(id);
		});

		this.on(view, "onDataUpdate", (id) => {
			this.sendAlbumInfo(id);
		});
	}


	sendAlbumInfo(albumID) {
		if (albumID) {
			const album = this.table.data.getItem(albumID);
			const albumInfo = {...album, groupName: this.groupName};
			this.app.callEvent("albums:table:select", [albumInfo]);
		}
		else {
			this.app.callEvent("albums:table:select", [null]);
		}
	}

	selectFirstAlbum() {
		const checkTable = this.table.serialize().length;

		if (checkTable) {
			const initSelect = this.table.getFirstId();
			this.table.select(initSelect);
		}
		else {
			this.app.callEvent("albums:table:select", [null]);
		}
	}

	deleteAlbum(id) {
		this.table.remove(id);
		this.selectFirstAlbum();
	}
}
