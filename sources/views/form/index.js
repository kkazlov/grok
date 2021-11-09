import {JetView} from "webix-jet";

import AlbumTable from "./album-table";

export default class Form extends JetView {
	config() {
		return {
			view: "form",
			elementsConfig: {labelWidth: 150},
			cols: [
				{
					rows: [
						{
							view: "combo",
							label: "Group name",
							options: ["One", "Two", "Three"]
						},
						{
							view: "combo",
							label: "Style",
							options: ["One", "Two", "Three"],
							required: true
						},
						{
							view: "datepicker",
							localId: "date",
							format: "%Y-%m-%d",
							label: "Creation date",
							name: "CreationDate",
							required: true
						},
						{view: "text", label: "Country"},
						{view: "checkbox", label: "In tour"},
						{view: "text", label: "Near concert"},
						{view: "text", label: "Next concert"},
						{
							view: "uploader",
							upload: "//docs.webix.com/samples/server/upload",
							id: "files",
							name: "files",
							value: "Upload a file",
							link: "doclist",
							multiple: false,
							autosend: false // обратите внимание!
						},
						{
							view: "list",
							scroll: false,
							id: "doclist",
							type: "uploader"
						},
						{
							view: "button",
							value: "Cancel"
						},
						{
							view: "button",
							value: "Save"
						}
					]
				},
				AlbumTable
			]
		};
	}
}
