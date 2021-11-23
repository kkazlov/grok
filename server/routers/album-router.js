import Router from "express";

import albumsController from "../controllers/albums-controller.js";

const albumRouter = new Router();

albumRouter.post("/albums", (req, res) => albumsController.createWithFile(req, res));
albumRouter.get("/albums", (req, res) => albumsController.getAlbums(req, res));
albumRouter.get("/albums/:id", (req, res) => albumsController.getOne(req, res));
albumRouter.put("/albums/:id", (req, res) => albumsController.update(req, res));
albumRouter.delete("/albums/:id", (req, res) => albumsController.deleteWithFile(req, res));

export default albumRouter;
