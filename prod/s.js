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
		if (typeof data !== 'undefined') {
			var string = Object.prototype.toString.call(data);
			var regex = new RegExp(/\[(object NodeList|object Node|object HTMLCollection|object Array|object Object)\]/);
			var match = string.match(regex);
		}

		if (match && typeof data !== 'undefined') {
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

	String.implement('toCamelCase', function() {
	    return this
			.replace(/-\D/g, function(match){
				return match.charAt(1).toUpperCase();
			});
	});

	String.implement('firstUpper', function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
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

	var Element = function (tag, object) {
		var element = document.createElement(tag);

		$.each(object, function(value, key){
			switch (key) {
				case 'data':
					$.each(value, function(data, k){
						if (typeOf(data) === 'object' || typeOf(data) === 'array') {
							element.dataset[k] = JSON.stringify(data);
						} else {
							element.dataset[k] = data;
						}
					});
					break;
				case 'events':
					$.each(value, function(data, k){
						element.addEvent(k, data);
					});
					break;
				case 'styles':
					console.log(value);
					element.setStyles(value);
					break;
				case 'html':
					if (typeOf(value) === 'array') {
						element.inject(value[0], value[1], value[2]);
					} else {
						element.set(key, value);
					}
					break;
				default:
					element.set(key, value);
					break;
			}
		});

		return element;
	};

	NodeList.implement('first', function() {
		return this.item(0);
	});

	NodeList.implement('last', function() {
		return this.item(this.length - 1);
	});

	[NodeList, Node].invoke('set', function(name, value, type) {
		if (typeOf(type) === 'undefined')
			type = 'attr';

		if (typeOf(this) === 'nodelist') {
			var item;
			for (var i = 0; item = this[i++];) {
				if (type == 'data') {
					if (typeOf(value) === 'object' || typeOf(value) === 'array') {
						item.dataset[name] = JSON.stringify(value);
					} else {
						item.dataset[name] = value;
					}
				} else {
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
			} 
		} else {
			if (type == 'data') {
				if (typeOf(value) === 'object' || typeOf(value) === 'array') {
					this.dataset[name] = JSON.stringify(value);
				} else {
					this.dataset[name] = value;
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
		}
	});	

	[NodeList, Node].invoke('get', function(name, type) {
		if (typeOf(type) === 'undefined')
			type = 'attr';

		if (typeOf(this) === 'nodelist') {
			var item = this.first();
			if (type == 'data') {
				var data = item.dataset[name];
				if (typeOf(data) !== 'undefined') {
					try {
						return JSON.parse(data);
					} catch(e) {
						return data;
					}
				} else {
					return false;
				}		
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
				var data = this.dataset[name];
				if (typeOf(data) !== 'undefined') {
					try {
						return JSON.parse(data);
					} catch(e) {
						return data;
					}
				} else {
					return false;
				}	
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

	[NodeList, Node].invoke('getElement', function(selector){
		var item;

		if (typeOf(this) === 'nodelist') {
			item = this.first();
		} else {
			item = this;
		}

		return item.querySelectorAll(selector).first();
	});

	[NodeList, Node].invoke('getElements', function(selector){
		var item;

		if (typeOf(this) === 'nodelist') {
			item = this.first();
		} else {
			item = this;
		}

		return item.querySelectorAll(selector);
	});	

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

	[NodeList, Node].invoke('removeElement', function(){
		var item;
		if (typeOf(this) !== 'nodelist') {
			this.remove();		
		} else {
			this.each(function(item){
				item.remove();
			});	
		}
	});

	[NodeList, Node].invoke('addClass', function(name) {
		if (name.indexOf(' '))
			name = name.split(/\s/)

		if (typeOf(this) === 'nodelist') {
			var item;
			this.each(function(item) {
				DOMTokenList.prototype.add.apply(item.classList, name);
			}); 
		} else {
			DOMTokenList.prototype.add.apply(this.classList, name);
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
			this.each(function(item) {
				item.classList.remove(name);
			}); 
		} else {
			this.classList.add(name);
		}
	});

	[NodeList, Node].invoke('toggleClass', function(name) {
		var item;
		if (typeOf(this) === 'nodelist') {
			item = this.first();					
		} else {
			item = this;
		}

		if (item.hasClass(name)) {
			item.removeClass(name);
		} else {
			item.addClass(name);
		}
	});	

	[NodeList, Node].invoke('setStyle', function(key, val){
		if (typeOf(this) === 'nodelist') {
			this.each(function(item) {
				item.style[key] = val;
			});
		} else {
			this.style[key] = val;
		}
	});

	[NodeList, Node].invoke('setStyles', function(object){
		if (typeOf(this) === 'nodelist') {
			this.each(function(item) {
				$.each(object, function(val, key){
					item.style[key] = val;
				});
			});
		} else {
			var item = this;
			$.each(object, function(val, key){
				console.log(this);
				item.style[key] = val;
			});
		}
	});

	[NodeList, Node].invoke('getStyle', function(key) {
		var item;
		if (typeOf(this) === 'nodelist') {
			item = this.first();
		} else {
			item = this;
		}
		if (typeOf(item.style[key]) !== 'undefined')
			return item.style[key];
		return false;
	});

	[NodeList, Node].invoke('removeStyle', function(key) {
		var item;
		if (typeOf(this) === 'nodelist') {
			item = this.first();
		} else {
			item = this;
		}
		if (typeOf(item.style[key]) !== 'undefined')
			item.style[key] = null;
		return false;
	});

	window.extend('eventCache', {});

	var translateEvent = function (event) {
		switch (event) {
			case 'ready':
				return 'DOMContentLoaded';
				break;
			default:
				return event;
				break;
		}
	};

	Object.implement('getEventCache', function(element, type) {
		if (typeOf(window.eventCache[element]) !== 'undefined') {
			var events = window.eventCache[element], e;
			e = false;

			$.each(events, function(val, key){
				if (val.type === type)
					e = val;
			});

			return e;
		} else {
			return false;
		}
	});

	var Event = function (object) {
		this.eventID = object.eid || 'e_' + new Date().getTime();
		this.el = object.el || null;
		this.type = object.type || null;
		this.fce = object.fce || null;
	}

	Event.implement('register', function(){
		if (typeOf(window.eventCache[this.el]) === 'undefined')
			window.eventCache.extend(this.el, {});

		window.eventCache[this.el].extend(this.eventID, {'type': this.type, 'fce': this.fce, 'eid': this.eventID});
		return window.eventCache[this.el][this.eventID].fce;
	});

	Event.implement('unregister', function(){
		delete window.eventCache[this.el][this.eventID];
	});

	[Node, NodeList].invoke('addEvent', function(type, callback, capture){
		type = translateEvent(type);
		if (typeOf(capture) === 'undefined')
			capture = false;

		if (typeOf(this) === 'nodelist') {
				var item, events;			
				this.each(function(item) {
					var e = new Event({'el': item, 'type': type, 'fce': callback});
					item.addEventListener(type, e.register(), capture);
				}); 
			} else {	
				var e = new Event({'el': this, 'type': type, 'fce': callback});
				this.addEventListener(type, e.register(), capture);
			}
	});

	[Node, NodeList].invoke('removeEvent', function(type, callback, capture){
		var elEvent;
		type = translateEvent(type);
		
		if (typeOf(capture) === 'undefined')
			capture = false;

		if (typeOf(this) === 'nodelist') {
				this.each(function(item) {
					elEvent = window.getEventCache(item, type);
					item.removeEventListener(type, elEvent.fce, capture);
					var e = new Event({'el': item, 'eid': elEvent.eid});
					e.unregister();
				}); 
			} else {
				elEvent = window.getEventCache(this, type);
				this.removeEventListener(type, elEvent.fce, capture);
				var e = new Event({'el': this, 'eid': elEvent.eid});
				e.unregister();
			}
	});

	[Node, NodeList].invoke('fireEvent', function(type){
		// TBD

		if (typeOf(this) === 'nodelist') {
			this.each(function(item) {
			});
		} else {
		}
	});

})();