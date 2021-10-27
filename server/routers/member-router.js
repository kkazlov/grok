import Router from "express";
import memberController from "../controllers/member-controller.js";


const memberRouter = new Router();

memberRouter.post("/members", memberController.create);
memberRouter.get("/members", memberController.getAll);
memberRouter.get("/members/:id", memberController.getOne);
memberRouter.put("/members/:id", memberController.update);
memberRouter.delete("/members/:id", memberController.delete);

export default memberRouter;