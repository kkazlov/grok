import MemberService from "../services/member-service.js";

const serverSort = (sort, data) => {
	const sortKeys = Object.keys(sort);
	sortKeys.forEach((key) => {
		if (sort[key]) {
			data.sort((a, b) => {
				const aLow = a[key].toLowerCase();
				const bLow = b[key].toLowerCase();

				const sortFn = (A, B) => {
					if (A > B) return 1;
					if (A === B) return 0;
					return -1;
				};

				if (sort[key] === "asc") {
					return sortFn(aLow, bLow);
				}
				return	sortFn(bLow, aLow);
			});
		}
	});
};

const matchValue = (obj, value) => {
	const objLow = obj.toLowerCase();
	const valueLow = value.toLowerCase();
	return objLow.indexOf(valueLow) !== -1;
};


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
			let totalCount = members.length;

			let dataChunk = [];

			const filterValues = Object.values(filter);
			const checkFilter = filterValues.find(item => item !== "");

			if (!checkFilter) serverSort(sort, members);

			const check = i => i < count && (+start + i) < totalCount;

			for (let i = 0; check(i); i++) {
				dataChunk[i] = members[+start + i];
			}

			if (checkFilter) {
				const filterKeys = Object.keys(filter);
				filterKeys.forEach((key) => {
					if (filter[key]) {
						dataChunk = dataChunk.filter(item => matchValue(item[key], filter[key]));
						totalCount = dataChunk.length;
						serverSort(sort, dataChunk);
					}
				});
			}


			const webixObj = {
				data: [...dataChunk],
				pos: start,
				total_count: totalCount
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
