import Router from "express";

import ControllerConstr from "../controllers/controller-constr.js";
import Album from "../models/album.js";
import ServicesConstr from "../services/services-constr.js";

const albumRouter = new Router();
const albumService = new ServicesConstr(Album);
const albumController = new ControllerConstr(albumService);

albumRouter.post("/albums", (req, res) => albumController.createWithFile(req, res));
albumRouter.get("/albums", (req, res) => albumController.getAll(req, res));
albumRouter.get("/albums/:id", (req, res) => albumController.getOne(req, res));
albumRouter.put("/albums/:id", (req, res) => albumController.update(req, res));
albumRouter.delete("/albums/:id", (req, res) => albumController.deleteWithFile(req, res));

export default albumRouter;
