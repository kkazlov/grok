import groupsService from "../services/groups-service.js";
import Controllers from "./controllers.js";

class GroupsController extends Controllers {}

export default new GroupsController(groupsService);
