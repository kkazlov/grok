import Router from "express";
import albumController from "../controllers/album-controller.js";


const albumRouter = new Router();

albumRouter.post("/albums", albumController.create);
albumRouter.get("/albums", albumController.getAll);
albumRouter.get("/albums/:id", albumController.getOne);
albumRouter.put("/albums/:id", albumController.update);
albumRouter.delete("/albums/:id", albumController.delete);

export default albumRouter;