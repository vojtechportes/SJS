(function(){
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

	Object.implement('isArray', function(data){
		if (Object.prototype.toString.call(data) == '[object Array]')
			return true;
		return false;
	})

	var typeOf = function(data) {
		if (typeof data === 'undefined')
			data = this;

		var string = Object.prototype.toString.call(data);
		var regex = new RegExp(/\[(object NodeList|object Node|object HTMLCollection|object Array|object Object)\]/);
		var match = string.match(regex);

		if (match) {
			switch (match[1]) {
				case 'object NodeList':
					return 'nodelist';
					break;
				case 'object Node':
					return 'node';
					break;
				case 'object HTMLCollection':
					return 'htmlcollection';
					break;
				case 'object Array':
					return 'array';
					break;
				case 'object Object':
					return 'object';
					break;
			}
		} else {
			return typeof data;
		}
	};

	types.invoke('typeOf', typeOf);

	NodeList.implement('first', function() {
		return this.item(0);
	});

	NodeList.implement('last', function() {
		return this.item(this.length - 1);
	});

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

	[NodeList, Node].invoke('addClass', function(name) {
		if (typeOf(this) === 'nodelist') {
			var item;
			for (var i = 0; item = this[i++];) {
				item.classList.add(name);
			} 
		} else {
			this.classList.add(name);
		}
	});

	[NodeList, Node].invoke('hasClass', function(name){
		if (typeOf(this) === 'nodelist') {
			return this.first().classList.contains(name);
		} else {
			return this.classList.contains(name);
		}
	});

	[NodeList, Node].invoke('removeClass', function(name) {
		if (typeOf(this) === 'nodelist') {
			var item;
			for (var i = 0; item = this[i++];) {
				item.classList.remove(name);
			} 
		} else {
			this.classList.add(name);
		}
	});

	[NodeList, Node].invoke('set', function(name, value, type) {
		if (typeOf(type) === 'undefined')
			type = 'attr';

		if (typeOf(this) === 'nodelist') {
			var item;
			for (var i = 0; item = this[i++];) {
				switch (name) {
					case 'html':
						item.innerHTML = value;
						break;
					case 'text':
						item.innerText = value;
						break;
					default:
						item.setAttribute(name, value);
						break;
				}
				
			} 
		} else {
			switch (name) {
				case 'html':
					this.innerHTML = value;
					break;
				case 'text':
					this.innerText = value;
					break;
				default:
					this.setAttribute(name, value);
					break;
			}
		}
	});	

	[NodeList, Node].invoke('get', function(name, type) {
		if (typeOf(type) === 'undefined')
			type = 'attr';

		if (this.typeOf() === 'nodelist') {
			var item = this.first();
			if (type == 'data') {
				return item.dataset[name];
			} else {
				switch (name) {
					case 'html':
						return item.innerHTML;
						break;
					case 'text':
						return item.innerText;
						break;
					default:
						return item.getAttribute(name);
						break;
				}
				
			}
		} else {
			if (type == 'data') {
				return this.dataset[name];
			} else {
				switch (name) {
					case 'html':
						return this.innerHTML;
						break;
					case 'text':
						return this.innerText;
						break;
					default:
						return this.getAttribute(name);
						break;
				}
			}
		}
	});

	[NodeList, Node].invoke('getParent', function(){
		var item;

		if (typeOf(this) === 'nodelist') {
			item = this.first();
		} else {
			item = this;
		}

		return item.parentNode;
	});


	var Element = function (tag, object) {
		var element = document.createElement(tag);

		$.each(object, function(value, key){
			if (key === 'data') {
				$.each(value, function(data, k){
					if (typeOf(data) === 'object' || typeOf(data) === 'array') {
						element.dataset[k] = JSON.stringify(data);
					} else {
						element.dataset[k] = data;
					}
				});
			} else {
				element.set(key, value);
			}
		});

		return element;
	};

	[NodeList, Node].invoke('inject', function(tag, object, where){
		var element = new Element(tag, object), parent;
		if (typeOf(this) === 'nodelist') {
			parent = this.first();
		} else {
			parent = this;
		}


		switch (where) {
			case 'inside':
				parent.appendChild(element);
				break;
			case 'before':
				parent.insertBefore(element);
				break;
			case 'after':
				parent.getParent().insertBefore(element);
				break;
		}
	});		

})();