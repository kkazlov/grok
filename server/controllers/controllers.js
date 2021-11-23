class Controllers {
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
}

export default Controllers;
