import {JetView} from "webix-jet";

import {albumsURL, filesURL, groupsURL} from "../../config/urls";
import stylesDB from "../../models/stylesDB";
import AlbumTable from "./album-table";
import FilesTable from "./files-table";

export default class Form extends JetView {
	config() {
		const GroupSelector = {
			localId: "groupSelector",
			view: "richselect",
			label: "Group name",
			options: {
				body: {
					save: `json->${groupsURL}`,
					template: "#Name#"
				}
			}
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

		return {
			localId: "form",
			view: "form",
			margin: 30,
			elementsConfig: {labelWidth: 150},
			rules: {
				Country: value => this.rule(value),
				NearConcert: value => !this.checboxValue || this.rule(value),
				NextConcert: value => !this.checboxValue || this.rule(value)
			},
			elements: [
				GroupSelector,
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
		this.groupSelector = this.$$("groupSelector");
		this.groupList = this.groupSelector.getList();
		this.state = this.app.getService("albumsState");

		const concertLayout = this.$$("concertLayout");
		const btnsLayout = this.$$("btnsLayout");
		const checkbox = this.$$("checkbox");

		this.groupList.load(groupsURL);

		this.disableForm();

		this.on(this.groupSelector, "onChange", (GroupID) => {
			this.GroupID = GroupID;

			this.enableForm();
			this.setFormData();
			this.app.callEvent("form:richselect:select", [GroupID]);
		});

		this.on(this.app, "form:table:editorState", (state) => {
			if (state) btnsLayout.disable();
			else btnsLayout.enable();
		});

		this.on(checkbox, "onChange", (value) => {
			this.checboxValue = value;

			if (!value) concertLayout.disable();
			else concertLayout.enable();
		});

		this.on(this.uploader, "onUploadComplete", () => {
			this.uploader.files.clearAll();
			this.app.callEvent("form:uploader:complete", [true]);
		});
	}

	enableForm() {
		this.uploader.files.clearAll();
		this.mainLayout.enable();
	}

	disableForm() {
		this.form.clear();
		this.groupSelector.setValue("");
		this.mainLayout.disable();
	}

	setFormData() {
		const group = this.groupList.data.getItem(this.GroupID);
		this.form.setValues(group);
	}

	saveData() {
		const checkFormChanges = this.checkFormChanges();
		const {
			isGroupChanged,
			isTableUpdates,
			isTableDeletes,
			isFile,
			areAllChanged
		} = checkFormChanges;

		if (isGroupChanged) this.updateGroup();
		if (isTableDeletes) this.deleteAlbums();
		if (isTableUpdates) this.updateAlbums();
		if (isFile) this.sendFile();

		if (!areAllChanged) console.log('no Changed');

		this.state.clearChanged();

		/* if (!areAllChanged) webix.message("No Changes. Nothing to save");
		this.clearChangedAlbums(); */
	}

	restoreData() {
		const checkFormChanges = this.checkFormChanges();
		const {
			isGroupChanged,
			isTableChanged,
			isFile,
			areAllChanged
		} = checkFormChanges;

		if (isGroupChanged) this.setFormData();
		if (isFile) this.uploader.files.clearAll();
		if (isTableChanged) this.restoreTable();
		/* if (areAllChanged) this.message("restore");
		else webix.message("No Changes. Nothing to restore"); */
	}

	checkFormChanges() {
		const isGroupChanged = this.checkGroup();
		const {updated, deleted} = this.state.getState();

		const isTableUpdates = updated.size;
		const isTableDeletes = deleted.size;
		const isFile = this.uploader.files.data.count();

		const isTableChanged = isTableUpdates || isTableDeletes;
		const areAllChanged = isGroupChanged || isTableChanged || isFile;

		return {
			isGroupChanged,
			isTableUpdates,
			isTableDeletes,
			isTableChanged,
			isFile,
			areAllChanged
		};
	}

	checkGroup() {
		const group = this.groupList.data.getItem(this.GroupID);
		const formData = this.getFormData();

		const dataKeys = Object.keys(formData);
		let isGroupChanged = false;

		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[i];
			if (formData[key] !== group[key]) {
				isGroupChanged = true;
				break;
			}
		}

		return isGroupChanged;
	}

	updateGroup() {
		const formData = this.getFormData();
		const sendData = !this.checboxValue ?
			{...formData, NearConcert: "", NextConcert: ""} :
			formData;

		this.groupList.data.updateItem(this.GroupID, sendData);
		this.setFormData();
	}

	getFormData() {
		const formValues = this.form.getValues();
		const dateStr = webix.Date.dateToStr("%Y-%m-%d")(formValues.CreationDate);
		return {...formValues, CreationDate: dateStr};
	}

	deleteAlbums() {
		const state = this.app.getService("albumsState");
		const {deleted} = state.getState();
		const deletedAblums = Array.from(deleted);

		const header = {"Content-type": "application/json"};
		const url = `${albumsURL}/deleteMany`;
		const albumsJSON = JSON.stringify(deletedAblums);

		webix.ajax()
			.headers(header)
			.post(url, albumsJSON);
	}

	updateAlbums() {
		const state = this.app.getService("albumsState");
		const {current, updated} = state.getState();
		const changedAblums = [];

		updated.forEach((id) => {
			const findedAlbum = current.find(album => album.id === id);
			changedAblums.push(findedAlbum);
		});

		const header = {"Content-type": "application/json"};
		const url = `${albumsURL}/updateMany`;
		const albumsJSON = JSON.stringify(changedAblums);

		webix.ajax()
			.headers(header)
			.post(url, albumsJSON);
	}

	sendFile() {
		this.uploader.files.data.each((obj) => {
			const {file, name, id} = obj;

			obj.formData = {
				GroupID: this.GroupID,
				File: file,
				Name: name
			};
			this.uploader.send(id);
		});
	}

	restoreTable() {
		this.state.clearChanged();
		this.app.callEvent("form:albums:restore", [true]);
	}

	message(type) {
		const message = {
			save: "The data has been saved",
			restore: "The data has been restore",
			error: "Server Error. The data has not been saved"
		};
		webix.message(message[type]);
	}

	rule(value) {
		const isEmpty = webix.rules.isNotEmpty(value);
		const isLong = value.toString().length <= 30;
		const isNotOnlySpace = /\S/g.test(value);

		return isEmpty && isLong && isNotOnlySpace;
	}

	FormElems() {
		const StyleElem = {
			view: "combo",
			label: "Style",
			options: stylesDB,
			name: "Style",
			required: true
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
