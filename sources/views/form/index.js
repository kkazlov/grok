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
			value: "Cancel",
			click: () => this.restoreData()
		};

		const SaveBtn = {
			view: "button",
			value: "Save",
			css: "webix_primary",
			click: () => this.saveData()
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
		this.mainLayout = this.$$("mainLayout");
		this.form = this.$$("form");

		const concertLayout = this.$$("concertLayout");
		const groupName = this.$$("groupName");
		const checkbox = this.$$("checkbox");

		this.on(this.app, "form:table:data", (changedAlbumsID, tableData) => {
			const {updatedAlbums, deletedAlbums} = changedAlbumsID;

			this.updatedAlbumsID = updatedAlbums;
			this.deletedAlbumsID = deletedAlbums;
			this.tableData = tableData;
		});

		this.dp.off();

		this.setParam("groupId", false, true);

		this.mainLayout.disable();

		this.on(groupName, "onChange", (value) => {
			this.setParam("groupId", value, true);
		});

		this.on(checkbox, "onChange", (value) => {
			if (!value) concertLayout.disable();
			else concertLayout.enable();
		});
	}

	urlChange() {
		this.groupId = this.getParam("groupId");

		if (this.groupId) {
			this.setFormData();
			this.mainLayout.enable();
		}
	}

	setFormData() {
		const groupValue = groupsDB.getItem(this.groupId);
		this.form.setValues(groupValue);
	}

	getFormData() {
		const formValues = this.form.getValues();
		delete formValues.Date;
		delete formValues.files;

		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(formValues.CreationDate);
		return {...formValues, CreationDate: dateStr};
	}

	checkFormChanges() {
		const groupData = groupsDB.getItem(this.groupId);
		const formData = this.getFormData();

		const dataKeys = Object.keys(formData);
		let checkChanges = false;

		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[i];
			if (formData[key] !== groupData[key]) {
				checkChanges = true;
				break;
			}
		}

		return checkChanges;
	}

	deleteAlbums() {
		this.deletedAlbumsID.forEach((id) => {
			const checkAlbum = this.updatedAlbumsID.has(id);
			if (checkAlbum) this.updatedAlbumsID.delete(id);

			albumsDB.remove(id);
		});
	}

	updateAlbums() {
		this.updatedAlbumsID.forEach((id) => {
			const album = this.tableData.getItem(id);
			albumsDB.updateItem(id, album);
		});
	}

	updateGroup() {
		const formData = this.getFormData();
		groupsDB.updateItem(this.groupId, formData);
	}

	saveData() {
		const checkForm = this.checkFormChanges();
		const checkTableUpdates = this.updatedAlbumsID.size;
		const checkTableDeletes = this.deletedAlbumsID.size;

		const checkTable = checkTableUpdates || checkTableDeletes;

		this.dp.on();

		if (checkForm) this.updateGroup();
		if (checkTableDeletes) this.deleteAlbums();
		if (checkTableUpdates) this.updateAlbums();


		const message = (checkForm || checkTable) ?
			"The data has been updated" :
			"No changes. Nothing to save";

		webix.message(message);

		this.dp.off();
	}

	restoreData() {
		const checkForm = this.checkFormChanges();
		const checkTableUpdates = this.updatedAlbumsID.size;
		const checkTableDeletes = this.deletedAlbumsID.size;

		const checkTable = checkTableUpdates || checkTableDeletes;

		if (checkForm) this.setFormData();

		if (checkTable) {
			this.tableData.clearAll();
			this.deletedAlbumsID.clear();
			this.updatedAlbumsID.clear();

			albumsDB.load(albumsURL);
		}


		const message = (checkForm || checkTable) ?
			"The data has been restored" :
			"No changes. Nothing to cancel";

		webix.message(message);
	}

	destroy() {
		albumsDB.load(albumsURL);
		this.dp.on();
	}
}
