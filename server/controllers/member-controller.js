import MemberService from "../services/member-service.js";

class MemberController {
	async create(req, res) {
		try {
			const member = await MemberService.create(req.body);
			res.json(member);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}

	async getAll(req, res) {
		try {
			const {start = 0, count = 50, filter = {}} = req.query;
			const members = await MemberService.getAll();

			let dataChunk = [];
			for (let i = 0; i < count; i++) {
				dataChunk[i] = members[+start + i];
			}

			const matchValue = (obj, value) => obj.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			const filterKeys = Object.keys(filter);

			filterKeys.forEach((key) => {
				if (key) {
					dataChunk = dataChunk.filter(item => matchValue(item[key], filter[key]));
				}
			});

			const webixObj = {
				data: [...dataChunk],
				pos: start,
				total_count: members.length
			};
			res.json(webixObj);
		}
		catch (error) {
			console.log(error.message);
			res.status(500).json(error);
		}
	}

	async getOne(req, res) {
		try {
			const {id} = req.params;
			const member = await MemberService.getOne(id);
			res.json(member);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}

	async update(req, res) {
		try {
			const member = req.body;
			const updatedMember = await MemberService.update(member);
			res.json(updatedMember);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async delete(req, res) {
		try {
			const {id} = req.params;
			const member = await MemberService.delete(id);
			res.json(member);
		}
		catch (error) {
			res.status(500).json(error);
		}
	}
}

export default new MemberController();
