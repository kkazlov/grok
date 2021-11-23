import Member from "../models/member.js";
import serverFilter from "./server-filter.js";
import serverSort from "./server-sort.js";
import Services from "./services.js";


class MembersService extends Services {
	async dynamicLoading(req) {
		const {start = 0, count = 50, filter = {}, sort = {}} = req.query;

		const dbCount = await this.model.count();

		const dataFilter = serverFilter(filter);
		const dataSort = serverSort(sort);

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
}

export default new MembersService(Member);
