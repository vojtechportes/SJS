[Object, NodeList].implement('each', function() {
	var data, callback, item;

	if (arguments.length == 1) {
		callback = arguments[0];
		data = this;
	} else {
		data = arguments[0];
		callback = arguments[1];
	}

	if (!(data instanceof Array) && !(data instanceof NodeList)) {
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				callback.call(null, data[key], key);
			}
		}
	} else {
		for (var i = 0; i < data.length; i++) {
			callback.call(data[i], data[i], i);
		}
	}
});
