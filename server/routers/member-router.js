import Router from "express";

import MemberController from "../controllers/member-controller.js";


const memberRouter = new Router();

memberRouter.post("/members", MemberController.create);
memberRouter.get("/members", MemberController.getAll);
memberRouter.get("/members/:id", MemberController.getOne);
memberRouter.put("/members/:id", MemberController.update);
memberRouter.delete("/members/:id", MemberController.delete);

export default memberRouter;
