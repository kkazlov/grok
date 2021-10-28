const groupsDB = new webix.DataCollection({
	url: "http://localhost:5000/api/groups",
	save: "json->http://localhost:5000/api/groups",
	scheme: {
		$change(obj) {
			obj.Date = webix.Date.strToDate("%Y-%m-%d")(obj.CreationDate);
		}
	}
});

export default groupsDB;
