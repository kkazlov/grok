import {JetView} from "webix-jet";

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
			name: "NearConcert"};

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
			NearConcertElem,
			NextConcertElem,
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
			css: "webix_primary"
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
					localId: "editableLayout",
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
		const layout = this.$$("editableLayout");
		const groupName = this.$$("groupName");
		const checkbox = this.$$("checkbox");
		const nearConcert = this.$$("nearConcert");
		const nextConcert = this.$$("nextConcert");

		this.setParam("groupId", false, true);

		layout.disable();

		this.on(groupName, "onChange", (value) => {
			this.setParam("groupId", value, true);
		});

		this.on(checkbox, "onChange", (value) => {
			if (!value) {
				nearConcert.disable();
				nextConcert.disable();
			}
			else {
				nearConcert.enable();
				nextConcert.enable();
			}
		});
	}

	urlChange() {
		const form = this.$$("form");
		const layout = this.$$("editableLayout");

		const groupId = this.getParam("groupId");

		if (groupId) {
			layout.enable();

			const groupValue = groupsDB.getItem(groupId);
			form.setValues(groupValue);
		}
	}
}
