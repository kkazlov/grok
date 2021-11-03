import Router from "express";

import ControllerConstr from "../controllers/controller-constr.js";
import Member from "../models/member.js"
import ServicesConstr from "../services/services-constr.js";

const memberService = new ServicesConstr(Member);
const memberController = new ControllerConstr(memberService);
const memberRouter = new Router();

memberRouter.post("/members", (req, res) => memberController.create(req, res));
memberRouter.get("/members", (req, res) => memberController.dynamicLoading(req, res));
memberRouter.get("/members/:id", (req, res) => memberController.getOne(req, res));
memberRouter.put("/members/:id", (req, res) => memberController.update(req, res));
memberRouter.delete("/members/:id", (req, res) => memberController.delete(req, res));

export default memberRouter;
