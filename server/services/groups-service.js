import Group from "../models/group.js";
import Services from "./services.js";

class GroupsService extends Services {}

export default new GroupsService(Group);
