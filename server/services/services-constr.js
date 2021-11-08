import filesService from "./files-service.js";

class ServicesConstr {
	constructor(model) {
		this.model = model;
	}

	async create(data) {
		const createdGroup = await this.model.create(data);
		return createdGroup;
	}

	async createWithFile(data, files, file) {
		let createdData;
		if (files) {
			const fileName = filesService.saveFile(files[file]);
			createdData = await this.model.create({...data, [file]: fileName});
			return createdData;
		}
		createdData = await this.model.create(data);
		return createdData;
	}

	async getAll() {
		const data = await this.model.find();
		return data;
	}

	async dynamicLoading(req) {
		const {start = 0, count = 50, filter = {}, sort = {}} = req.query;

		const dbCount = await this.model.count();

		const dataFilter = this.serverFilter(filter);
		const dataSort = this.serverSort(sort);

		const data = await this.model
			.find(dataFilter)
			.sort(dataSort)
			.skip(+start)
			.limit(+count);

		const checkFiler = Object.keys(dataFilter).length;

		return {
			data,
			pos: start,
			total_count: checkFiler ? data.length : dbCount
		};
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

	async deleteWithFile(id) {
		if (!id) throw new Error("No ID");
		const selectedData = await this.model.findById(id);
		filesService.deleteFile(selectedData.Photo);

		const data = await this.model.findByIdAndDelete(id);
		return data;
	}

	serverFilter(filter) {
		const dataFilter = {};
		const filterKeys = Object.keys(filter);

		const escapeRegexp = string => string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

		filterKeys.forEach((key) => {
			if (filter[key]) {
				dataFilter[key] = new RegExp(escapeRegexp(filter[key]), "i");
			}
		});
		return dataFilter;
	}

	serverSort(sort) {
		const dataSort = {};
		const sortKeys = Object.keys(sort);
		sortKeys.forEach((key) => {
			if (sort[key]) {
				dataSort[key] = sort[key];
			}
		});

		return dataSort;
	}
}

export default ServicesConstr;
