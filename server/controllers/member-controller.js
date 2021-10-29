import memberService from "../services/member-service.js";

class memberController {
	async create(req, res) {
		try {
			const member = await memberService.create(req.body);
			res.json(member);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async getAll(req, res) {
		try {
            const {pos = 0} = req.query;
			
			const members = await memberService.getAll();
            const webixObj = {
                data: [...members],
                pos,
                total_count: members.length
            }
			return res.json(webixObj);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async getOne(req, res) {
		try {
			const {id} = req.params;
			const member = await memberService.getOne(id);
			return res.json(member);
		} catch (error) {
			res.status(500).json(error);
		}
	}

	async update(req, res) {
		try {
			const member = req.body;
			const updatedMember = await memberService.update(member);
			return res.json(updatedMember);
		} catch (error) {
			res.status(500).json(error.message);
		}
	}

	async delete(req, res) {
		try {
			const {id} = req.params;
			const member = await memberService.delete(id);
			return res.json(member);
		} catch (error) {
			res.status(500).json(error);
		}
	}
}

export default new memberController();
