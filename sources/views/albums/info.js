import {JetView} from "webix-jet";

import {host} from "../../config/urls";

export default class Info extends JetView {
	config() {
		return {
			gravity: 3,
			scroll: true,
			template: obj => this.infoTemplate(obj)
		};
	}

	init(view) {
		this.on(this.app, "albums:table:select", (albumInfo) => {
			if (albumInfo) {
				view.parse(albumInfo);
			}
			else view.parse({});
		});
	}

	infoTemplate(obj) {
		const checkObj = Object.keys(obj).length;
		if (!checkObj) return "<h2>No Album</h2>";

		const {
			Name: albumName,
			File,
			Awards,
			TrackList,
			groupName
		} = obj;

		const emptyPhoto = "https://via.placeholder.com/550";
		const photoURl = File ? `${host}${File}` : emptyPhoto;

		const tracks = TrackList
			.map(item => `<li>${item}</li>`)
			.join("");

		return `
			<div class="info">
				<div class="info__header">
					<h2>${groupName}</h2>
					<h3>${albumName}</h3>
				</div>

				<div class="info__photo">
					<img src=${photoURl} onError='src="${emptyPhoto}"' alt="Cover">
				</div>

				<div class="info__tracklist">
					<h4>Track-list</h4>
					<ol>${tracks}</ol>
				</div>

				<div class="info__awards">
					<span>Awards:</span> ${Awards}
				</div>
			</div>
		`;
	}
}
