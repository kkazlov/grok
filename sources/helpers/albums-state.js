export default function albumsState(app) {
	const service = {
		getState() {
			return this.state;
		},

		setInit(albums) {
			this.state.init = albums;
		},

		setCurrent(albums) {
			this.state.current = albums;
		},

		addUpdated(album) {
			this.state.updated.add(album);
		},

		addDeleted(album) {
			const {updated, deleted} = this.state;

			deleted.add(album);

			const isUpdated = updated.has(album);
			if (isUpdated) updated.delete(album);
		},

		clearState() {
			this.state.init = [];
			this.state.current = [];
			this.clearChanged();
		},

		clearChanged() {
			const {updated, deleted} = this.state;
			updated.clear();
			deleted.clear();
		},
		state: {
			init: [],
			current: [],
			updated: new Set(),
			deleted: new Set()
		}
	};
	app.setService("albumsState", service);
}
