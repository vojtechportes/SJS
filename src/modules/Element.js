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

		if (this.typeOf() === 'nodelist') {
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