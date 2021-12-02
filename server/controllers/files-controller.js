import filesServices from "../services/files-services.js";
import Files from "./extensions/files.js";

class FilesController extends Files {}

export default new FilesController(filesServices);
