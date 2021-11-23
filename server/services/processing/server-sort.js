const serverSort = (sortParams) => {
	const dataSort = {};
	const sortKeys = Object.keys(sortParams);
	sortKeys.forEach((key) => {
		if (sortParams[key]) {
			dataSort[key] = sortParams[key];
		}
	});
	return dataSort;
};

export default serverSort;
