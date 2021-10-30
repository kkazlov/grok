import Router from "express";

import AlbumController from "../controllers/album-controller.js";


const albumRouter = new Router();

albumRouter.post("/albums", AlbumController.create);
albumRouter.get("/albums", AlbumController.getAll);
albumRouter.get("/albums/:id", AlbumController.getOne);
albumRouter.put("/albums/:id", AlbumController.update);
albumRouter.delete("/albums/:id", AlbumController.delete);

export default albumRouter;
