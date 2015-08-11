var Element = function (tag, object) {
	var element = document.createElement(tag);

	if (object) {
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
        <% if (typeof modules['Element.Event'] !== 'undefined') { %>  
				case 'events':
					$.each(value, function(data, k){
						element.addEvent(k, data);
					});
					break;
        <% } %>
        <% if (typeof modules['Element.Style'] !== 'undefined') { %>
				case 'styles':
					element.setStyles(value);
					break;
        <% } %>
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
	}

	return element;
};

[Node, NodeList, Object].implement('getNode', function(){
	if (this instanceof NodeList)
		return this.first();
	return this;
});

<% if (settings.indexOf('ie') >= 0) { %>
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
<% } %>

NodeList.implement('first', function() {
	return this.item(0);
});

NodeList.implement('last', function() {
	return this.item(this.length - 1);
});

[NodeList, Node].implement('set', function(name, value, type) {
	var item;

	function set (item, name, value, type) {
		if (type == 'data') {
			<% if (settings.indexOf('ie') >= 0) { %>
			if (value instanceof Object) {
				item.setData(name, JSON.stringify(value));
			} else {
				item.setData(name, value);
			}
			<% } else { %>
			if (value instanceof Object) {
				item.dataset[name] = JSON.stringify(value);
			} else {
				item.dataset[name] = value;
			}
			<% } %>
		} else {
			switch (name) {
				case 'html':
					item.innerHTML = value;
					break;
				case 'text':
					item.textContent = value;
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

[NodeList, Node].implement('get', function(name, type) {
	function get (item, name, type) {
		if (type == 'data') {
			<% if (settings.indexOf('ie') >= 0) { %>
			var data = item.getData(name);
			<% } else { %>
			var data = item.dataset[name];
			<% } %>
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
				case 'tag':
					return item.nodeName;
				case 'html':
					return item.innerHTML;
					break;
				case 'text':
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

[NodeList, Node].implement('getParent', function(){
	return this.getNode().parentNode;
});

[NodeList, Node].implement('getElement', function(selector){
	return this.getNode().querySelector(selector);
});

[NodeList, Node].implement('getElements', function(selector){
	return this.getNode().querySelectorAll(selector);
});

[NodeList, Node].implement('getNext', function(){
	return this.getNode().nextElementSibling;
});	

[NodeList, Node].implement('getPrevious', function(){
	return this.getNode().previousElementSibling;
});	

[NodeList, Node].implement('getFirstChild', function(){
	return this.getNode().firstElementChild;
});

[NodeList, Node].implement('getLastChild', function(){
	return this.getNode().lastElementChild;
});

[NodeList, Node].implement('getSiblings', function(){
	var elements = [], node, element = this.getNode();

    node = this.getNode().getParent().getFirstChild();

    while(node) {
    	if (node !== element)
    		elements.push(node);
    	node = node.getNext();
    }

    return elements;
});

[NodeList, Node].implement('inject', function(){
	var tag, object, elements, element, where = 'inside', parent;

	function inject (element, parent, where) {
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
		return element;
	}

	if (typeof arguments[0] === 'string') {
		tag = arguments[0];
	} else if (arguments[0] instanceof Node || arguments[0] instanceof Array) {
		element = arguments[0];
	}

	if (typeof arguments[1] === 'undefined')
		object = {};

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

	if (element instanceof Array) {
		elements = element, arr = [];
		$.each(elements, function(element, key){
			arr.push(inject(element, parent, where));
		});
		return arr;
	} else {
		return inject(element, parent, where);		
	}
});

[NodeList, Node].implement('isChildOf', function(parent){
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

[NodeList, Node].implement('removeElement', function(selector){
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

[NodeList, Node].implement('cloneElement', function(){
	return this.getNode().cloneNode(true);
});