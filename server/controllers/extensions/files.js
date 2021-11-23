import Controllers from "../controllers.js";

export default class Files extends Controllers {
	async createWithFile(req, res) {
		try {
			const data = await this.service.createWithFile(req.body, req.files, "File");
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async deleteWithFile(req, res) {
		try {
			const {id} = req.params;
			const data = await this.service.deleteWithFile(id);
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}
}
