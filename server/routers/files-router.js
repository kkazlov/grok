import Router from "express";

import filesController from "../controllers/files-controller.js";

const filesRouter = new Router();

filesRouter.post("/files", (req, res) => filesController.createWithFile(req, res));
filesRouter.get("/files", (req, res) => filesController.getAll(req, res));
filesRouter.get("/files/:id", (req, res) => filesController.getOne(req, res));
filesRouter.put("/files/:id", (req, res) => filesController.update(req, res));
filesRouter.delete("/files/:id", (req, res) => filesController.deleteWithFile(req, res));

export default filesRouter;
