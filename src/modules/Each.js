	[Object, NodeList].invoke('each', function() {
		var data, callback, item;

		if (arguments.length == 1) {
			callback = arguments[0];
			data = this;
		} else {
			data = arguments[0];
			callback = arguments[1];
		}

		if (typeOf(data) === 'object') {
			for (var key in data) {
				if (data.hasOwnProperty(key))
					callback(data[key], key);
			}
		} else {
			for (var i = 0; item = data[i++];) {
				callback(item, i - 1);
			}
		}
	});