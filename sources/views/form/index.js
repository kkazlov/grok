import {JetView} from "webix-jet";

import {albumsURL} from "../../config/urls";
import albumsDB from "../../models/albumsDB";
import groupsDB from "../../models/groupsDB";
import stylesDB from "../../models/stylesDB";
import AlbumTable from "./album-table";

export default class Form extends JetView {
	config() {
		const GroupElem = {
			localId: "groupName",
			view: "richselect",
			label: "Group name",
			options: groupsDB
		};

		const StyleElem = {
			view: "combo",
			label: "Style",
			options: stylesDB,
			required: true,
			name: "Style"
		};

		const CreationDateElem = {
			localId: "date",
			view: "datepicker",
			format: "%Y-%m-%d",
			label: "Creation date",
			name: "CreationDate",
			required: true
		};

		const CountryElem = {
			view: "text",
			label: "Country",
			name: "Country"
		};

		const CheckboxElem = {
			localId: "checkbox",
			view: "checkbox",
			label: "In tour",
			name: "InTour"
		};

		const NearConcertElem = {
			localId: "nearConcert",
			view: "text",
			label: "Near concert",
			name: "NearConcert"
		};

		const NextConcertElem = {
			localId: "nextConcert",
			view: "text",
			label: "Next concert",
			name: "NextConcert"
		};

		const UploaderElem = {
			view: "uploader",
			upload: "//docs.webix.com/samples/server/upload",
			localId: "files",
			name: "files",
			value: "Upload a file",
			link: "doclist",
			multiple: false,
			autosend: false // обратите внимание!
		};

		const UploaderListElem = {
			view: "list",
			scroll: false,
			height: 100,
			id: "doclist",
			type: "uploader"
		};

		const formElems = [
			StyleElem,
			CreationDateElem,
			CountryElem,
			CheckboxElem,
			{
				localId: "concertLayout",
				rows: [NearConcertElem, NextConcertElem]
			},
			UploaderElem,
			UploaderListElem
		];

		const CancelBtn = {
			view: "button",
			value: "Cancel"
		};

		const SaveBtn = {
			view: "button",
			value: "Save",
			css: "webix_primary",
			click: () => {
				const checkChanges = this.updatedAlbums.size;
				if (checkChanges) {
					this.dp.on();

					this.updatedAlbums.forEach((albumID) => {
						const album = this.tableData.getItem(albumID);
						albumsDB.updateItem(albumID, album);
					});

					this.dp.off();
				}
			}
		};

		return {
			localId: "form",
			view: "form",
			margin: 30,
			elementsConfig: {labelWidth: 150},
			elements: [
				GroupElem,
				{
					margin: 30,
					localId: "mainLayout",
					rows: [
						{margin: 15, cols: [{rows: formElems}, AlbumTable]},
						{rows: [CancelBtn, SaveBtn]}
					]
				},
				{}
			]
		};
	}

	init() {
		this.dp = webix.dp(albumsDB);
		const mainLayout = this.$$("mainLayout");
		const concertLayout = this.$$("concertLayout");
		const groupName = this.$$("groupName");
		const checkbox = this.$$("checkbox");

		this.dp.off();
		this.setParam("groupId", false, true);

		mainLayout.disable();

		this.on(groupName, "onChange", (value) => {
			this.setParam("groupId", value, true);
		});

		this.on(checkbox, "onChange", (value) => {
			if (!value) concertLayout.disable();
			else concertLayout.enable();
		});

		this.on(this.app, "form:table:data", (updatedAlbums, tableData) => {
			this.updatedAlbums = updatedAlbums;
			this.tableData = tableData;
		});
	}

	urlChange() {
		const form = this.$$("form");
		const mainLayout = this.$$("mainLayout");

		const groupId = this.getParam("groupId");

		if (groupId) {
			const groupValue = groupsDB.getItem(groupId);

			mainLayout.enable();
			form.setValues(groupValue);
		}
	}

	checkChanges() {
		const form = this.$$("form");
		const groupId = this.getParam("groupId");
		const groupData = groupsDB.getItem(groupId);

		const formValues = form.getValues();
		delete formValues.Date;
		delete formValues.files;

		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(formValues.CreationDate);
		const formData = {...formValues, CreationDate: dateStr};

		const dataKeys = Object.keys(formData);
		let checkChanges = false;

		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[i];
			if (formData[key] !== groupData[key]) {
				checkChanges = true;
				break;
			}
		}
	}

	destroy() {
		albumsDB.load(albumsURL);
		this.dp.on();
	}
}
