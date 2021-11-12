const host = process.env.DB_HOST;

const groupsAPI = process.env.GROUPS_API;
const membersAPI = process.env.MEMBERS_API;
const albumsAPI = process.env.ALBUMS_API;
const stylesAPI = process.env.STYLES_API;
const filesAPI = process.env.FILES_API;

const groupsURL = `${host}${groupsAPI}`;
const membersURL = `${host}${membersAPI}`;
const albumsURL = `${host}${albumsAPI}`;
const stylesURL = `${host}${stylesAPI}`;
const filesURL = `${host}${filesAPI}`;

export {
	groupsURL,
	membersURL,
	albumsURL,
	stylesURL,
	filesURL,
	host
};
