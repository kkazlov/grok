class Services {
	constructor(model) {
		this.model = model;
	}

	async create(data) {
		const createdGroup = await this.model.create(data);
		return createdGroup;
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
