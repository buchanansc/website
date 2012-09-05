/*jshint browser:true jquery:true*/
/*global log, Site*/
Site.Me = (function () {
	var initialized = false,
		registered = [];
	return {
		init: function () {
			if (registered.length > 0) {
				while (registered.length > 0) {
					registered.pop().init.call(this);
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
}());
