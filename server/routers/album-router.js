import Router from "express";

import albumsController from "../controllers/albums-controller.js";

const albumRouter = new Router();

albumRouter.post("/albums", (req, res) => albumsController.createWithFile(req, res));
albumRouter.get("/albums", (req, res) => albumsController.getDataForGroup(req, res));
albumRouter.get("/albums/:id", (req, res) => albumsController.getOne(req, res));
albumRouter.put("/albums/:id", (req, res) => albumsController.update(req, res));
albumRouter.post("/albums/updateMany", (req, res) => albumsController.updateMany(req, res));
albumRouter.post("/albums/deleteMany", (req, res) => albumsController.deleteMany(req, res));
albumRouter.delete("/albums/:id", (req, res) => albumsController.deleteWithFile(req, res));

export default albumRouter;
