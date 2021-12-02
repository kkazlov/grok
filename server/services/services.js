class Services {
	constructor(model) {
		this.model = model;
	}

	async create(data) {
		const createdData = await this.model.create(data);
		return createdData;
	}

	async getAll() {
		const data = await this.model.find();
		return data;
	}

	async getOne(id) {
		if (!id) throw new Error("No ID");
		const data = await this.model.findById(id);
		return data;
	}

	async getDataForGroup(req) {
		const {GroupID} = req.query;
		const data = !GroupID ? await this.model.find() : await this.model.find({GroupID});
		return data;
	}

	async update(data) {
		if (!data._id) throw new Error("No ID");
		const updatedData = await this.model.findByIdAndUpdate(data._id, data, {
			new: true
		});
		return updatedData;
	}

	async delete(id) {
		if (!id) throw new Error("No ID");
		const data = await this.model.findByIdAndDelete(id);
		return data;
	}
}

export default Services;
