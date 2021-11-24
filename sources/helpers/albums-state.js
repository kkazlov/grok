export default function albumsState(app) {
	const service = {
		getState() {
			return this.state;
		},

		setInit(albums) {
			this.state.initAlbums = albums;
		},

		addUpdated(album) {
			this.state.updatedAlbums.add(album);
		},

		addDeleted(album) {
			const {updatedAlbums, deletedAlbums} = this.state;

			deletedAlbums.add(album);

			const isUpdated = updatedAlbums.has(album);
			if (isUpdated) updatedAlbums.delete(album);
		},

		clearState() {
			const {updatedAlbums, deletedAlbums} = this.state;

			this.state.initAlbums = [];
			updatedAlbums.clear();
			deletedAlbums.clear();
		},

		state: {
			initAlbums: [],
			updatedAlbums: new Set(),
			deletedAlbums: new Set()
		}
	};
	app.setService("albumsState", service);
}
