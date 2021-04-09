(function ($) {
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
		];

	function absolute(time) {
		var then = new Date(time);
		if ($.browser.msie) {
			then = Date.parse(String(time).replace(/( \+)/, " UTC$1"));
		}
		var ampm = "";
		var hour = (function () {
			var s = then.getHours();
			if (s > 0 && s < 13) {
				ampm = "am";
				return s;
			}
			if (s < 1) {
				ampm = "am";
				return 12;
			}
			ampm = "pm";
			return s - 12;
		}());
		var minute = then.getMinutes();

		function day() {
			var s = new Date();
			if (s.getDate() != then.getDate() || s.getYear() != then.getYear() || s.getMonth() != then.getMonth()) {
				return " - " + months[then.getMonth()] + " " + then.getDate() + ", " + then.getFullYear();
			}
			return "";
		}
		return hour + ":" + minute + ampm + day();
	}

	function relative(time) {
		var now = new Date();
		var then = new Date(time);
		if ($.browser.msie) {
			then = Date.parse(String(time).replace(/( \+)/, " UTC$1"));
		}
		var delta = now - then;
		var n = 1000,
			o = n * 60,
			hours = o * 60,
			days = hours * 24;
		if (isNaN(delta) || delta < 0) {
			return "";
		}
		if (delta < n * 2) {
			return "right now";
		}
		if (delta < o) {
			return Math.floor(delta / n) + " seconds ago";
		}
		if (delta < o * 2) {
			return "about 1 minute ago";
		}
		if (delta < hours) {
			return Math.floor(delta / o) + " minutes ago";
		}
		if (delta < hours * 2) {
			return "about 1 hour ago";
		}
		if (delta < days) {
			return Math.floor(delta / hours) + " hours ago";
		}
		if (delta > days && delta < days * 2) {
			return "yesterday";
		}
		if (delta < days * 365) {
			return Math.floor(delta / days) + " days ago";
		}
		// just return the absolute date if it's over a year
		return absolute(time);
		// return "over a year ago";
	}

	$.extend({
		date: {
			'absolute': absolute,
			'relative': relative
		}
	});
}(jQuery));