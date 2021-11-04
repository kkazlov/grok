import Router from "express";

import ControllerConstr from "../controllers/controller-constr.js";
import getGroupsController from "../controllers/get-groups-controller.js";
import Group from "../models/group.js";
import ServicesConstr from "../services/services-constr.js";

const groupService = new ServicesConstr(Group);
const groupController = new ControllerConstr(groupService);
const groupRouter = new Router();

groupRouter.post("/groups", (req, res) => groupController.create(req, res));
groupRouter.get("/groups", (req, res) => getGroupsController.getAll(req, res));
groupRouter.get("/groups/:id", (req, res) => groupController.getOne(req, res));
groupRouter.put("/groups/:id", (req, res) => groupController.update(req, res));
groupRouter.delete("/groups/:id", (req, res) => groupController.delete(req, res));

export default groupRouter;
