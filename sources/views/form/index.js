import {JetView} from "webix-jet";

import {albumsURL, filesURL} from "../../config/urls";
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
			click: () => {
				this.restoreData();
				this.form.clearValidation();
			}
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

		const rule = (value) => {
			const isEmpty = webix.rules.isNotEmpty(value);
			const isLong = value.toString().length <= 30;
			const isNotOnlySpace = /\S/g.test(value);

			return isEmpty && isLong && isNotOnlySpace;
		};

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
		this.mainLayout = this.$$("mainLayout");
		this.form = this.$$("form");
		this.uploader = this.$$("uploader");
		this.groupName = this.$$("groupName");

		const concertLayout = this.$$("concertLayout");
		const btnsLayout = this.$$("btnsLayout");
		const checkbox = this.$$("checkbox");

		this.updatedAlbumsID = new Set();
		this.deletedAlbumsID = new Set();
		this.tableData = [];

		this.on(this.app, "form:table:data", (changedAlbumsID, tableData) => {
			const {updatedAlbums, deletedAlbums} = changedAlbumsID;
			this.updatedAlbumsID = updatedAlbums;
			this.deletedAlbumsID = deletedAlbums;
			this.tableData = tableData;
		});

		this.setInitGroup();

		this.on(this.app, "form:table:editorState", (state) => {
			if (state) btnsLayout.disable();
			else btnsLayout.enable();
		});

		this.on(this.groupName, "onChange", (value) => {
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
			groupsDB.waitData.then(() => {
				const isGroupID = groupsDB.getIndexById(this.groupId) > -1;

				if (isGroupID) this.enableForm();
				else this.disableForm();
			});
		}
	}


	enableForm() {
		this.setFormData();
		this.uploader.files.clearAll();
		this.mainLayout.enable();
	}

	disableForm() {
		this.setParam("groupId", "", true);
		this.form.clear();
		this.groupName.setValue("");
		this.mainLayout.disable();
	}

	setInitGroup() {
		groupsDB.waitData.then(() => {
			const initGroupId = this.getParam("groupId");
			const isGroupID = groupsDB.getIndexById(initGroupId) > -1;

			if (isGroupID) this.groupName.setValue(initGroupId);
			else {
				this.setParam("groupId", "", true);
				this.mainLayout.disable();
			}
		});
	}

	setFormData() {
		groupsDB.waitData.then(() => {
			const groupValue = groupsDB.getItem(this.groupId);
			this.form.setValues(groupValue);
		});
	}

	getFormData() {
		const formValues = this.form.getValues();
		delete formValues.Date;

		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(formValues.CreationDate);
		return {...formValues, CreationDate: dateStr};
	}

	saveData() {
		const checkFormChanges = this.checkFormChanges();
		const {
			checkGroup,
			checkTableUpdates,
			checkTableDeletes,
			checkFile,
			checkAll
		} = checkFormChanges;


		if (checkGroup) this.updateGroup();
		if (checkTableDeletes) this.deleteAlbums();
		if (checkTableUpdates) this.updateAlbums();
		if (checkFile) this.sendFile();

		if (!checkAll) webix.message("No Changes. Nothing to save");
		this.clearChangedAlbums();
	}

	restoreData() {
		const checkFormChanges = this.checkFormChanges();
		const {
			checkGroup,
			checkTable,
			checkFile,
			checkAll
		} = checkFormChanges;

		if (checkGroup) this.setFormData();
		if (checkTable) this.refreshTableData();
		if (checkFile) this.uploader.files.clearAll();

		if (checkAll) this.message("restore");
		else webix.message("No Changes. Nothing to restore");
	}

	checkFormChanges() {
		const checkGroup = this.checkGroup();
		const checkTableUpdates = this.updatedAlbumsID.size;
		const checkTableDeletes = this.deletedAlbumsID.size;
		const checkFile = this.uploader.files.data.count();

		const checkTable = checkTableUpdates || checkTableDeletes;
		const checkAll = checkGroup || checkTable || checkFile;

		return {
			checkGroup,
			checkTableUpdates,
			checkTableDeletes,
			checkTable,
			checkFile,
			checkAll
		};
	}

	checkGroup() {
		const groupData = groupsDB.getItem(this.groupId);
		const formData = this.getFormData();

		const dataKeys = Object.keys(formData);
		let checkGroup = false;

		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[i];
			if (formData[key] !== groupData[key]) {
				checkGroup = true;
				break;
			}
		}

		return checkGroup;
	}

	updateGroup() {
		const formData = this.getFormData();
		const sendData = !this.checboxValue ?
			{...formData, NearConcert: "", NextConcert: ""} :
			formData;

		groupsDB.updateItem(this.groupId, sendData);
		this.setFormData();
		this.message("save");
	}

	deleteAlbums() {
		try {
			this.deletedAlbumsID.forEach((id) => {
				const url = `${albumsURL}/${id}`;
				webix.ajax()
					.del(url)
					.then(() => {
						this.message("save");
					})
					.catch(() => {
						this.message("error");
						this.refreshTableData();
					});
			});
		}
		catch (error) {
			webix.message(error);
		}
	}

	updateAlbums() {
		try {
			const header = {"Content-type": "application/json"};

			this.updatedAlbumsID.forEach((id) => {
				const album = this.tableData.getItem(id);
				const albumToJSON = JSON.stringify(album);
				const url = `${albumsURL}/${id}`;

				webix.ajax()
					.headers(header)
					.put(url, albumToJSON)
					.then(() => {
						this.message("save");
					})
					.catch(() => {
						this.message("error");
						this.refreshTableData();
					});
			});
		}
		catch (error) {
			webix.message(error);
		}
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

	message(type) {
		const message = {
			save: "The data has been saved",
			restore: "The data has been restore",
			error: "Server Error. The data has not been saved"
		};
		webix.message(message[type]);
	}

	clearChangedAlbums() {
		this.deletedAlbumsID.clear();
		this.updatedAlbumsID.clear();
	}

	refreshTableData() {
		this.tableData.clearAll();
		this.clearChangedAlbums();
		this.app.callEvent("form:table:refresh", [true]);
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
