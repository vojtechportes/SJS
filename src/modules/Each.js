[Object, NodeList].implement('each', function() {
	var data, callback, item;

	if (arguments.length == 1) {
		callback = arguments[0];
		data = this;
	} else {
		data = arguments[0];
		callback = arguments[1];
	}

	if (this instanceof NodeList === false) {
		for (var key in data) {
			if (data.hasOwnProperty(key) && key !== 'length') {
				callback.call(null, data[key], key);
			}
		}
	} else {
		for (var i = 0; item = data[i++];) {
			callback.call(item, item, i - 1);
		}
	}
});