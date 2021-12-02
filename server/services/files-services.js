import files from "../models/files.js";
import Files from "./extensions/files.js";

class FilesService extends Files {}

export default new FilesService(files);
