import Router from "express";
import groupController from "../controllers/group-controller.js";


const groupRouter = new Router();

groupRouter.post("/groups", groupController.create);
groupRouter.get("/groups", groupController.getAll);
groupRouter.get("/groups/:id", groupController.getOne);
groupRouter.put("/groups/:id", groupController.update);
groupRouter.delete("/groups/:id", groupController.delete);

export default groupRouter;