String.prototype._template = function (data) {
	var prop, result = this;
	data = data || {};
	for (prop in data) {
		if (data.hasOwnProperty(prop)) {
			result = result.replace('<%' + prop + '%>', data[prop]);
		}
	}
	return result.replace(/<%.+?%>/ig, '');
};