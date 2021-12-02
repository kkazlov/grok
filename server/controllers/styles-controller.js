import stylesService from "../services/styles-service.js";
import Controllers from "./controllers.js";

class StylesController extends Controllers {}

export default new StylesController(stylesService);

