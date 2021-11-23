const serverFilter = (filterParams) => {
	const dataFilter = {};
	const filterKeys = Object.keys(filterParams);

	const escapeRegexp = string => string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

	filterKeys.forEach((key) => {
		if (filterParams[key]) {
			dataFilter[key] = new RegExp(escapeRegexp(filterParams[key]), "i");
		}
	});
	return dataFilter;
};
export default serverFilter;
