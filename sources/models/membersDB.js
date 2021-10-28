const membersDB = new webix.DataCollection({
	url: "http://localhost:5000/api/members",
	save: "json->http://localhost:5000/api/members"
});

export default membersDB;
