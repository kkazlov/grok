import Router from "express";

import stylesController from "../controllers/styles-controller.js";

const styleRouter = new Router();

styleRouter.post("/styles", (req, res) => stylesController.create(req, res));
styleRouter.get("/styles", (req, res) => stylesController.getAll(req, res));
styleRouter.get("/styles/:id", (req, res) => stylesController.getOne(req, res));
styleRouter.put("/styles/:id", (req, res) => stylesController.update(req, res));
styleRouter.delete("/styles/:id", (req, res) => stylesController.delete(req, res));

export default styleRouter;
