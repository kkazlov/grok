/* import Router from "express";

import ControllerConstr from "../controllers/controller-constr.js";
import Style from "../models/style.js";
import ServicesConstr from "../services/services-constr.js";

const styleService = new ServicesConstr(Style);
const styleController = new ControllerConstr(styleService);
const styleRouter = new Router();

styleRouter.post("/styles", (req, res) => styleController.create(req, res));
styleRouter.get("/styles", (req, res) => styleController.getAll(req, res));
styleRouter.get("/styles/:id", (req, res) => styleController.getOne(req, res));
styleRouter.put("/styles/:id", (req, res) => styleController.update(req, res));
styleRouter.delete("/styles/:id", (req, res) => styleController.delete(req, res));

export default styleRouter;
 */