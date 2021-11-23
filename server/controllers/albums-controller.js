import albumsService from "../services/albums-service.js";
import Files from "./extensions/files.js";

class AlbumsController extends Files {}

export default new AlbumsController(albumsService);
