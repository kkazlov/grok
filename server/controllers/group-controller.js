import GroupService from "../services/group-service.js";

class GroupController {
	async create(req, res) {
		try {
			const group = await GroupService.create(req.body);
			res.json(group);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}

	async getAll(req, res) {
		try {
			const groups = await GroupService.getAll();
			res.json(groups);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}

	async getOne(req, res) {
		try {
			const {id} = req.params;
			const group = await GroupService.getOne(id);
			res.json(group);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}

	async update(req, res) {
		try {
			const group = req.body;
			const updatedGroup = await GroupService.update(group);
			res.json(updatedGroup);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async delete(req, res) {
		try {
			const {id} = req.params;
			const group = await GroupService.delete(id);
			res.json(group);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}
}

export default new GroupController();
