class ControllerConstr {
	constructor(service) {
		this.service = service;
	}

	async create(req, res) {
		try {
			const data = await this.service.create(req.body);
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async createWithFile(req, res) {
		try {
			const data = await this.service.createWithFile(req.body, req.files, "Photo");
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async getAll(req, res) {
		try {
			const data = await this.service.getAll();
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async getOne(req, res) {
		try {
			const {id} = req.params;
			const data = await this.service.getOne(id);
			res.json(data);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async update(req, res) {
		try {
			const data = req.body;
			const updatedData = await this.service.update(data);
			res.json(updatedData);
		}
		catch (error) {
			res.status(500).json(error.message);
		}
	}

	async delete(req, res) {
		try {
			const {id} = req.params;
			const data = await this.service.delete(id);
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

	async dynamicLoading(req, res) {
		try {
			const {start = 0, count = 50, filter = {}, sort = {}} = req.query;

			const members = await this.service.getAll();
			let totalCount = members.length;

			let dataChunk = [];

			const filterValues = Object.values(filter);
			const checkFilter = filterValues.find(item => item !== "");

			if (!checkFilter) this.serverSort(sort, members);

			const checkChunkIndex = i => i < count && (+start + i) < totalCount;

			for (let i = 0; checkChunkIndex(i); i++) {
				dataChunk[i] = members[+start + i];
			}

			if (checkFilter) {
				const filterKeys = Object.keys(filter);
				filterKeys.forEach((key) => {
					if (filter[key]) {
						dataChunk = dataChunk.filter(item => this.findValue(item[key], filter[key]));
						totalCount = dataChunk.length;
						this.serverSort(sort, dataChunk);
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
			res.status(500).json(error.message);
		}
	}

	findValue(obj, value) {
		const objLow = obj.toString().toLowerCase();
		const valueLow = value.toString().toLowerCase();
		return objLow.indexOf(valueLow) !== -1;
	}

	serverSort(sort, data) {
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
	}
}

export default ControllerConstr;
