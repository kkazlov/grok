import Router from "express";

import membersController from "../controllers/members-controller.js";

const memberRouter = new Router();

memberRouter.post("/members", (req, res) => membersController.create(req, res));
memberRouter.get("/members", (req, res) => membersController.dynamicLoading(req, res));
memberRouter.get("/members/:id", (req, res) => membersController.getOne(req, res));
memberRouter.put("/members/:id", (req, res) => membersController.update(req, res));
memberRouter.delete("/members/:id", (req, res) => membersController.delete(req, res));

export default memberRouter;
