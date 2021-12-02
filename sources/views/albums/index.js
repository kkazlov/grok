import {JetView} from "webix-jet";

import Info from "./info";
import List from "./list";
import Table from "./table";


export default class Albums extends JetView {
	config() {
		return {
			cols: [List, Table, Info]
		};
	}
}
