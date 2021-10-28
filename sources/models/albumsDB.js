const albumsDB = new webix.DataCollection({
	url: "http://localhost:5000/api/albums",
	save: "json->http://localhost:5000/api/albums"
});

export default albumsDB;
