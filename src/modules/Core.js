	var types = [NodeList, Node, Object, String, Number];

	Object.prototype.extend = function (key, val) {
		this[key] = val;
	}

	Object.prototype.implement = function (key, val) {
		this.prototype[key] = val;
	}

	Object.prototype.invoke = function (key, val) {
		var items = this, item;
		for (var i = 0; item = items[i++];) {
			item.prototype[key] = val;
		}
	}

	if (window.$ == null) window.extend('$', function(elements) {
		return document.querySelectorAll(elements);
	});