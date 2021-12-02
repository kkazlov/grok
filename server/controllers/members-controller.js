import membersService from "../services/members-service.js";
import Controllers from "./controllers.js";

class MembersController extends Controllers {
	async dynamicLoading(req, res) {
		try {
			const data = await this.service.dynamicLoading(req);
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}
}

export default new MembersController(membersService);
