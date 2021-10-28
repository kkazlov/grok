const groupsDB = new webix.DataCollection({
	url: "http://localhost:5000/api/groups",
	save: "json->http://localhost:5000/api/groups"
});

export default groupsDB;
