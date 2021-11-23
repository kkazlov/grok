import Router from "express";

import groupsController from "../controllers/groups-controller.js";

const groupRouter = new Router();

groupRouter.post("/groups", (req, res) => groupsController.create(req, res));
groupRouter.get("/groups", (req, res) => groupsController.getAll(req, res));
groupRouter.get("/groups/:id", (req, res) => groupsController.getOne(req, res));
groupRouter.put("/groups/:id", (req, res) => groupsController.update(req, res));
groupRouter.delete("/groups/:id", (req, res) => groupsController.delete(req, res));

export default groupRouter;
