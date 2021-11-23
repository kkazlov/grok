/* import Router from "express";

import ControllerConstr from "../controllers/controller-constr.js";
import Files from "../models/files.js";
import ServicesConstr from "../services/services-constr.js";

const filesRouter = new Router();
const filesService = new ServicesConstr(Files);
const filesController = new ControllerConstr(filesService);

filesRouter.post("/files", (req, res) => filesController.createWithFile(req, res));
filesRouter.get("/files", (req, res) => filesController.getAll(req, res));
filesRouter.get("/files/:id", (req, res) => filesController.getOne(req, res));
filesRouter.put("/files/:id", (req, res) => filesController.update(req, res));
filesRouter.delete("/files/:id", (req, res) => filesController.deleteWithFile(req, res));

export default filesRouter;
 */