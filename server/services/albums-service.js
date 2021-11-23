import Album from "../models/album.js";
import Files from "./extensions/files.js";

class AlbumService extends Files {}

export default new AlbumService(Album);
