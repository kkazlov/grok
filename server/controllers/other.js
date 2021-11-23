async createWithFile(req, res) {
	try {
		const data = await this.service.createWithFile(req.body, req.files, "File");
		res.json(data);
	}
	catch (error) {
		res.status(500).json(error.message);
	}
}

async dynamicLoading(req, res) {
	try {
		const data = await this.service.dynamicLoading(req);
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