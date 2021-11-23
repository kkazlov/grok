import Services from "./services.js";

export default class MembersService extends Services {
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
