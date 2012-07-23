Site.Me = (function () {
	var initialized = false,
		registered = [];
	return {
		init: function () {
			if (registered.length > 0) {
				var i;
				while (i = registered.pop()) {
					i.init.call(this);
				}
			}
			initialized = true;
		},

		register: function (obj) {
			if (initialized) {
				obj.init.call(this);
			} else if (registered.indexOf(obj) === -1) {
				registered.push(obj);
			}
		}
	};
})();