	var Element = function (tag, object) {
		var element = document.createElement(tag);

		$.each(object, function(value, key){
			switch (key) {
				case 'data':
					$.each(value, function(data, k){
						if (data instanceof Object) {
							element.setData(k, JSON.stringify(data));
						} else {
							element.setData(k, data);
						}
					});
					break;
				case 'events':
					$.each(value, function(data, k){
						element.addEvent(k, data);
					});
					break;
				case 'styles':
					element.setStyles(value);
					break;
				case 'html':
					if (value instanceof Array) {
						if (typeof value[2] === 'undefined')
							value[2] = 'inside';
						
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

	Node.implement('setData', function(key, val){
		if (this.dataset !== undefined) {
			this.dataset[key] = val;
		} else {
			this.setAttribute('data-' + key, val);
		}
	});

	Node.implement('getData', function(key, val){
		if (this.dataset !== undefined) {
			return this.dataset[key];
		} else {
			return this.getAttribute('data-' + key);
		}
	});

	NodeList.implement('first', function() {
		return this.item(0);
	});

	NodeList.implement('last', function() {
		return this.item(this.length - 1);
	});

	[NodeList, Node].invoke('set', function(name, value, type) {
		if (typeof type === 'undefined')
			type = 'attr';

		if (this instanceof NodeList) {
			var item;
			for (var i = 0; item = this[i++];) {
				if (type == 'data') {
					if (item instanceof Object) {
						item.setData(name, JSON.stringify(value));
					} else {
						item.setData(name, value);
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
				if (this instanceof Object) {
					this.setData(name, JSON.stringify(value));
				} else {
					this.setData(name, value);
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
		if (typeof type === 'undefined')
			type = 'attr';

		if (this instanceof NodeList) {
			var item = this.first();
			if (type == 'data') {
				var data = item.getData(name);
				if (typeof data !== 'undefined') {
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
				var data = this.getData(name);
				if (typeof data !== 'undefined') {
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

		if (this instanceof NodeList) {
			item = this.first();
		} else {
			item = this;
		}

		return item.parentNode;
	});

	[NodeList, Node].invoke('getElement', function(selector){
		var item;

		if (this instanceof NodeList) {
			item = this.first();
		} else {
			item = this;
		}

		return item.querySelectorAll(selector).first();
	});

	[NodeList, Node].invoke('getElements', function(selector){
		var item;

		if (this instanceof NodeList) {
			item = this.first();
		} else {
			item = this;
		}

		return item.querySelectorAll(selector);
	});	

	[NodeList, Node].invoke('inject', function(tag, object, where){
		var element = new Element(tag, object), parent;
		if (this instanceof NodeList) {
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
		if (this instanceof NodeList) {
			this.remove();		
		} else {
			this.each(function(item){
				item.remove();
			});	
		}
	});