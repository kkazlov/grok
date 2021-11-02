import Router from "express";

import ControllerConstr from "../controllers/controller-constr.js";
import albumService from "../services/album-service.js";

const albumRouter = new Router();
const albumController = new ControllerConstr(albumService);

albumRouter.post("/albums", (req, res) => albumController.createWithFile(req, res));
albumRouter.get("/albums", (req, res) => albumController.getAll(req, res));
albumRouter.get("/albums/:id", (req, res) => albumController.getOne(req, res));
albumRouter.put("/albums/:id", (req, res) => albumController.update(req, res));
albumRouter.delete("/albums/:id", (req, res) => albumController.delete(req, res));

export default albumRouter;
