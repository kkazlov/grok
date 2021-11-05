const host = process.env.DB_HOST;

const groupsAPI = process.env.GROUPS_API;
const membersAPI = process.env.MEMBERS_API;
const albumsAPI = process.env.ALBUMS_API;

const groupsURL = host + groupsAPI;
const membersURL = host + membersAPI;
const albumsURL = host + albumsAPI;

export {groupsURL, membersURL, albumsURL, host};
