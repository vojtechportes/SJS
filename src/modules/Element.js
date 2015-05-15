var Element = function (tag, object) {
	var element = document.createElement(tag);

	$.each(object, function(value, key){
		switch (key) {
			case 'data':
				$.each(value, function(data, k){
					if (data instanceof Object) {
						element.set(k, JSON.stringify(data), 'data');
					} else {
						element.set(k, data, 'data');
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
	if (this instanceof NodeList) {
		return this.first();
	} else {
		return this;
	}
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
			if (value instanceof Object) {
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
					if (item.innerText) {
						item.innerText = value;
					} else {
						item.textContent = value;
					}
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
					if (item.innerText)
						return item.innerText;
					return item.textContent;
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
	var tag, object, elements, element, where = 'inside', parent;

	if (typeof arguments[0] === 'string') {
		tag = arguments[0];
	} else if (arguments[0] instanceof Node || arguments[0] instanceof Array) {
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
	
	elements = element;
	if (element instanceof Node) {
		elements = [element];
	}

	$.each(elements, function(element, key){
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