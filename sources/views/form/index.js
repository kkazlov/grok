import {JetView} from "webix-jet";

import {albumsURL, filesURL} from "../../config/urls";
import albumsDB from "../../models/albumsDB";
import filesDB from "../../models/filesDB";
import groupsDB from "../../models/groupsDB";
import stylesDB from "../../models/stylesDB";
import AlbumTable from "./album-table";
import FilesTable from "./files-table";

export default class Form extends JetView {
	config() {
		const GroupElem = {
			localId: "groupName",
			view: "richselect",
			label: "Group name",
			options: groupsDB
		};

		const CancelBtn = {
			view: "button",
			value: "Cancel",
			click: () => this.restoreData()
		};

		const SaveBtn = {
			view: "button",
			value: "Save",
			css: "webix_primary",
			click: () => {
				const validation = this.form.validate();
				if (validation) this.saveData();
			}
		};

		const rule = value => webix.rules.isNotEmpty(value) && value.toString().length <= 30;

		return {
			localId: "form",
			view: "form",
			margin: 30,
			elementsConfig: {labelWidth: 150},
			rules: {
				Country: value => rule(value),
				NearConcert: value => !this.checboxValue || rule(value),
				NextConcert: value => !this.checboxValue || rule(value)
			},
			elements: [
				GroupElem,
				{
					margin: 30,
					localId: "mainLayout",
					rows: [
						{
							margin: 15,
							cols: [
								{rows: this.FormElems()},
								{rows: [AlbumTable, FilesTable]}
							]
						},
						{localId: "btnsLayout", rows: [CancelBtn, SaveBtn]}
					]
				},
				{}
			],
			on: {
				onChange() {
					this.clearValidation();
				}
			}
		};
	}

	init() {
		this.dp = webix.dp(albumsDB);
		this.mainLayout = this.$$("mainLayout");
		this.form = this.$$("form");
		this.uploader = this.$$("uploader");

		const concertLayout = this.$$("concertLayout");
		const btnsLayout = this.$$("btnsLayout");

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

		this.on(this.app, "form:table:editorState", (state) => {
			if (state) btnsLayout.disable();
			else btnsLayout.enable();
		});

		this.on(groupName, "onChange", (value) => {
			this.setParam("groupId", value, true);
		});

		this.on(checkbox, "onChange", (value) => {
			this.checboxValue = value;

			if (!value) concertLayout.disable();
			else concertLayout.enable();
		});

		this.on(this.uploader, "onUploadComplete", () => {
			this.uploader.files.clearAll();
			filesDB.load(filesURL);
		});
	}

	urlChange() {
		this.groupId = this.getParam("groupId");

		if (this.groupId) {
			this.setFormData();
			this.mainLayout.enable();
			this.uploader.files.clearAll();
		}
	}

	destroy() {
		albumsDB.load(albumsURL);
		this.dp.on();
	}

	setFormData() {
		const groupValue = groupsDB.getItem(this.groupId);
		this.form.setValues(groupValue);
	}

	getFormData() {
		const formValues = this.form.getValues();
		delete formValues.Date;

		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(formValues.CreationDate);
		return {...formValues, CreationDate: dateStr};
	}

	checkFormChanges() {
		const _checkForm = () => {
			const groupData = groupsDB.getItem(this.groupId);
			const formData = this.getFormData();

			const dataKeys = Object.keys(formData);
			let checkForm = false;

			for (let i = 0; i < dataKeys.length; i++) {
				const key = dataKeys[i];
				if (formData[key] !== groupData[key]) {
					checkForm = true;
					break;
				}
			}

			return checkForm;
		};

		const checkForm = _checkForm();
		const checkTableUpdates = this.updatedAlbumsID.size;
		const checkTableDeletes = this.deletedAlbumsID.size;
		const checkFile = this.uploader.files.data.count();

		const checkTable = checkTableUpdates || checkTableDeletes;
		const checkAll = checkForm || checkTable || checkFile;

		return {
			checkForm,
			checkTableUpdates,
			checkTableDeletes,
			checkTable,
			checkFile,
			checkAll
		};
	}

	updateGroup() {
		const formData = this.getFormData();
		const sendData = !this.checboxValue ?
			{...formData, NearConcert: "", NextConcert: ""} :
			formData;

		groupsDB.updateItem(this.groupId, sendData);
		this.setFormData();
	}

	deleteAlbums() {
		this.deletedAlbumsID.forEach((id) => {
			albumsDB.remove(id);
		});
	}

	updateAlbums() {
		this.updatedAlbumsID.forEach((id) => {
			const album = this.tableData.getItem(id);
			albumsDB.updateItem(id, album);
		});
	}

	sendFile() {
		this.uploader.files.data.each((obj) => {
			const {file, name, id} = obj;

			obj.formData = {
				GroupID: this.groupId,
				File: file,
				Name: name
			};
			this.uploader.send(id);
		});
	}

	message(check, type) {
		const ok = type === "save" ? "updated" : "restore";
		const fail = type === "save" ? "save" : "cancel";

		const message = check ?
			`The data has been ${ok}` :
			`No changes. Nothing to ${fail}`;

		webix.message(message);
	}

	clearChangedAlbums() {
		this.deletedAlbumsID.clear();
		this.updatedAlbumsID.clear();
	}

	refreshTableData() {
		this.tableData.clearAll();
		this.clearChangedAlbums();
		albumsDB.load(albumsURL);
	}

	saveData() {
		const checkFormChanges = this.checkFormChanges();
		const {
			checkForm,
			checkTableUpdates,
			checkTableDeletes,
			checkFile,
			checkAll
		} = checkFormChanges;

		this.dp.on();

		if (checkForm) this.updateGroup();
		if (checkTableDeletes) this.deleteAlbums();
		if (checkTableUpdates) this.updateAlbums();
		if (checkFile) this.sendFile();

		this.message(checkAll, "save");

		this.dp.off();

		this.clearChangedAlbums();
	}

	restoreData() {
		const checkFormChanges = this.checkFormChanges();
		const {
			checkForm,
			checkTable,
			checkFile,
			checkAll
		} = checkFormChanges;

		if (checkForm) this.setFormData();
		if (checkTable) this.refreshTableData();
		if (checkFile) this.uploader.files.clearAll();

		this.message(checkAll, "restore");
	}


	FormElems() {
		const StyleElem = {
			view: "combo",
			label: "Style",
			options: stylesDB,
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
			name: "Country",
			required: true
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
			localId: "uploader",
			value: "Add a file",
			link: "doclist",
			upload: filesURL,
			multiple: false,
			autosend: false
		};

		const UploaderListElem = {
			view: "list",
			scroll: false,
			height: 100,
			id: "doclist",
			type: "uploader"
		};

		return [
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
	}
}
