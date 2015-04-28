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
	if (!/\s/.test(elements) && elements.charAt(0) === '#')
		return document.getElementById(elements.substr(1))
	return document.querySelectorAll(elements);
});

Array.implement('clear', function () {
    var dups = {};
    return this.filter(function(el) {
        var hash = el.valueOf();
        var isDup = dups[hash];
        dups[hash] = true;
        return !isDup;
    });
});

Object.implement('isArray', function(data){
	if (Object.prototype.toString.call(data) == '[object Array]')
		return true;
	return false;
});

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
					if (value[0] instanceof Array) {
						$.each(value, function(value, key){
							if (typeof value[2] === 'undefined') value[2] = 'inside';							
							element.inject(new Element(value[0], value[1]), value[2]);
						});
					} else {
						if (typeof value[2] === 'undefined') value[2] = 'inside';							
						element.inject(new Element(value[0], value[1]), value[2]);
					}
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

[Node, NodeList].invoke('getNode', function(){
	if (this instanceof NodeList)
		return this.first();
	return this;
});

Node.implement('setData', function(key, val){
	if (this.dataset !== undefined)
		this.dataset[key] = val;
	this.setAttribute('data-' + key, val);
});

Node.implement('getData', function(key, val){
	if (this.dataset !== undefined)
		return this.dataset[key];
	return this.getAttribute('data-' + key);
});

NodeList.implement('first', function() {
	return this.item(0);
});

NodeList.implement('last', function() {
	return this.item(this.length - 1);
});

[NodeList, Node].invoke('set', function(name, value, type) {
	var item;

	function set (item, name, value, type) {
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

	if (typeof type === 'undefined')
		type = 'attr';

	if (this instanceof NodeList) {		
		this.each(function(item){
			set(item, name, value, type);
		});
	} else {
		set(this, name, value, type);
	}
});	

[NodeList, Node].invoke('get', function(name, type) {
	function get (item, name, type) {
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
	}

	if (typeof type === 'undefined')
		type = 'attr';

	return get(this.getNode(), name, type);
});

[NodeList, Node].invoke('getParent', function(){
	return this.getNode().parentNode;
});

[NodeList, Node].invoke('getElement', function(selector){
	return this.getNode().querySelectorAll(selector).first();
});

[NodeList, Node].invoke('getElements', function(selector){
	return this.getNode().querySelectorAll(selector);
});

[NodeList, Node].invoke('getNext', function(){
	return this.getNode().nextElementSibling;
});	

[NodeList, Node].invoke('getPrevious', function(){
	return this.getNode().previousElementSibling;
});	

[NodeList, Node].invoke('getFirstChild', function(){
	return this.getNode().firstElementChild;
});

[NodeList, Node].invoke('getLastChild', function(){
	return this.getNode().lastElementChild;
});

[NodeList, Node].invoke('getSiblings', function(){
	var elements = [], node, element = this.getNode();

    node = this.getNode().getParent().getFirstChild();

    while(node) {
    	if (node !== element)
    		elements.push(node);
    	node = node.getNext();
    }

    return elements;
});

[NodeList, Node].invoke('inject', function(){
	var tag, object, element, where = 'inside';

	if (typeof arguments[0] === 'string') {
		tag = arguments[0];
	} else if (arguments[0] instanceof Node) {
		element = arguments[0];
	}

	if (arguments[1] instanceof Object) {
		object = arguments[1]
	} else if (typeof arguments[1] === 'string') {
		where = arguments[1]
	}

	if (typeof arguments[2] === 'string')
		where = arguments[2];
	
	if (tag && object && where)
		element = new Element(tag, object);

	parent = this.getNode();

	switch (where) {
		case 'inside':
			parent.appendChild(element);
			break;
		case 'before':
			parent.getParent().insertBefore(element, parent.previousSibling);
			break;
		case 'after':
			parent.getParent().insertBefore(element, parent.nextSibling);
			break;
	}
});

[NodeList, Node].invoke('isChildOf', function(parent){
     var item = this.getNode(), node, parent = $(parent).getNode();

     node = this.getParent();

     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.getParent();
     }
     return false;
});		

[NodeList, Node].invoke('removeElement', function(selector){
	var item, child, inside = false, children;

	function remove (item, selector) {
		if (inside) {
			children = item.getElements(selector);
			children.each(function(child){
				child.remove();
			});
		} else {
			item.remove();
		}
	}

	if (typeof selector !== 'undefined')
		inside = true;

	if (this instanceof NodeList) {
		this.each(function(item){
			remove(item, selector);
		});		
	} else {
		remove(this, selector);
	}
});

[NodeList, Node].invoke('cloneElement', function(){
	return this.getNode().cloneNode(true);
});

[NodeList, Node].invoke('addClass', function(name) {
	if (name.indexOf(' '))
		name = name.split(/\s/)

	if (this instanceof NodeList) {
		var item;
		this.each(function(item, key) {
			if (typeof DOMTokenList !== 'undefined') {
				DOMTokenList.prototype.add.apply(item.classList, name);
			} else {
				var classes = item.className.split(/\s/) || [];
				item.className = classes.concat(name).clear().join(' ');
			}
		}); 
	} else {
		if (typeof DOMTokenList !== 'undefined') {
			DOMTokenList.prototype.add.apply(this.classList, name);
		} else {
			var classes = this.className.split(/\s/) || [];
			this.className = classes.concat(name).clear().join(' ');
		}
	}
});

[NodeList, Node].invoke('hasClass', function(name){
	if (this instanceof NodeList) {
		if (typeof DOMTokenList !== 'undefined') {
			return this.first().classList.contains(name);
		} else {
			return (this.first().className.split(/\s/).indexOf(name)) ? true : false;
		}
	} else {
		if (typeof DOMTokenList !== 'undefined') {
			return this.classList.contains(name);
		} else {
			return (this.className.split(/\s/).indexOf(name)) ? true : false;
		}
	}
});

[NodeList, Node].invoke('removeClass', function(name) {
	if (this instanceof NodeList) {
		this.each(function(item) {
			if (typeof DOMTokenList !== 'undefined') {
				item.classList.remove(name);
			} else {
				var classes = item.className.split(/\s/);
				if (classes.indexOf(name)) {
					delete classes[classes.indexOf(name)];
					item.className = classes.join(' ');
				}
			}
		}); 
	} else {
		if (typeof DOMTokenList !== 'undefined') {
			this.classList.remove(name);
		} else {
			var classes = this.className.split(/\s/);
			if (classes.indexOf(name)) {
				delete classes[classes.indexOf(name)];
				this.className = classes.join(' ');
			}
		}
	}
});

[NodeList, Node].invoke('toggleClass', function(name) {
	var item = this.getNode();
	
	if (item.hasClass(name)) {
		item.removeClass(name);
	} else {
		item.addClass(name);
	}
});	

[NodeList, Node].invoke('setStyle', function(key, val){
	if (this instanceof NodeList) {
		this.each(function(item) {
			item.style[key] = val;
		});
	} else {
		this.style[key] = val;
	}
});

[NodeList, Node].invoke('setStyles', function(object){
	if (this instanceof NodeList) {
		this.each(function(item) {
			$.each(object, function(val, key){
				item.style[key] = val;
			});
		});
	} else {
		var item = this;
		$.each(object, function(val, key){
			item.style[key] = val;
		});
	}
});

[NodeList, Node].invoke('getStyle', function(key) {
	var item = this.getNode();

	if (typeof item.style[key] !== 'undefined')
		return item.style[key];
	return false;
});

[NodeList, Node].invoke('removeStyle', function(key) {
	var item = this.getNode();
	
	if (typeof item.style[key] !== 'undefined')
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
	if (typeof window.eventCache[element] !== 'undefined') {
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

var SEvent = function (object) {
	this.eventID = object.eid || 'e_' + new Date().getTime();
	this.el = object.el || null;
	this.type = object.type || null;
	this.fce = object.fce || null;
	this.event = object.event || null;
}

SEvent.implement('register', function(event){
	if (typeof event !== 'undefined')
		this.event = event;
	if (typeof window.eventCache[this.el] === 'undefined')
		window.eventCache.extend(this.el, {});

	window.eventCache[this.el].extend(this.eventID, {'type': this.type, 'fce': this.fce, 'eid': this.eventID, 'event': this.event});
	return window.eventCache[this.el][this.eventID].fce;
});

SEvent.implement('unregister', function(){
	delete window.eventCache[this.el][this.eventID];
});

[Node, NodeList].invoke('addEvent', function(){
	var type, callback, capture = false, e = false;

	if (typeof arguments[0] === 'string') {
		type = arguments[0];
	} else if (arguments[0] instanceof Object) {
		e = arguments[0];
	}
	if (arguments[1] instanceof Function)
		callback = arguments[1];
	if (arguments[2] instanceof Boolean)
		capture = arguments[2];

	if (e !== false) {
		type = e.type;
		callback = e.fce;
	}

	type = translateEvent(type);

	if (this instanceof NodeList) {
		var item, events;			
		this.each(function(item) {
			var e = new SEvent({'el': item, 'type': type, 'fce': callback});
			item.addEventListener(type, e.register(event), capture);
		}); 
	} else {	
		var e = new SEvent({'el': this, 'type': type, 'fce': callback});
		this.addEventListener(type, e.register(event), capture);
	}
});

[Node, NodeList].invoke('removeEvent', function(type, callback, capture){
	var elEvent;

	type = translateEvent(type);
	
	if (typeof capture === 'undefined')
		capture = false;

	if (this instanceof NodeList) {
		this.each(function(item) {
			elEvent = window.getEventCache(item, type);
			item.removeEventListener(type, elEvent.fce, capture);
			var e = new SEvent({'el': item, 'eid': elEvent.eid});
			e.unregister();
		}); 
	} else {
		elEvent = window.getEventCache(this, type);
		this.removeEventListener(type, elEvent.fce, capture);
		var e = new SEvent({'el': this, 'eid': elEvent.eid});
		e.unregister();
	}
});

[Node, NodeList].invoke('cloneEvent', function() {
	var type = arguments[0], element = false, item = this.getNode();
	if (typeof arguments[1] !== 'undefined')
		element = arguments[1]

	var e = window.getEventCache(item, type);

	if (element) {
		element.addEvent(type, e.fce);
	} else {
		return e;
	}
});

[Node, NodeList].invoke('fireEvent', function(type){
	var item;

	if (this instanceof NodeList) {
		this.each(function(item) {
			var e = window.getEventCache(item, type);
			if (e)
				e.fce.call(item, e.event);
		});
	} else {
		var e = window.getEventCache(this, type);
		if(e)
			e.fce.call(this, e.event);
	}
});

