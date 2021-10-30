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
			const {start = 0, count = 50, filter = {}, sort = {}} = req.query;
			const members = await MemberService.getAll();
			const totalCount = members.length;


			let dataChunk = [];
			const check = i => i < count && (+start + i) < totalCount;
			for (
				let i = 0; check(i); i++) {
				dataChunk[i] = members[+start + i];
			}

			const matchValue = (obj, value) => obj.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			const filterKeys = Object.keys(filter);
			let chunkLength = 0;

			filterKeys.forEach((key) => {
				if (filter[key]) {
					dataChunk = dataChunk.filter(item => matchValue(item[key], filter[key]));
					chunkLength = dataChunk.length;
				}
			});

			const sortKeys = Object.keys(sort);
			sortKeys.forEach((key) => {
				if (sort[key]) {
					/* dataChunk = dataChunk.sort((a, b) => {
						if (sort[key] === "asc") {
							console.log(a[key].toLowerCase() - b[key].toLowerCase())
							return a[key].toLowerCase() - b[key].toLowerCase();
						}
						return b[key].toLowerCase() - a[key].toLowerCase();
					}); */
					dataChunk.sort((a, b) => {
						const _a = a[key].toLowerCase();
						const _b = b[key].toLowerCase();

						if (sort[key] === "asc") {
							if (_a > _b) return 1;
							if (_a === _b) return 0;
							if (_a < _b) return -1;
						}
						else {
							if (_b > _a) return 1;
							if (_b === _a) return 0;
							if (_b < _a) return -1;
						}
					});
				}
			});


			const webixObj = {
				data: [...dataChunk],
				pos: start,
				total_count: chunkLength || totalCount
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
