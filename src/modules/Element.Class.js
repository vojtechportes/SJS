[NodeList, Node].implement('addClass', function(name) {
	function add (item, name) {	
		<% if (settings.indexOf('ie') >= 0) { %>	
		if (typeof SJS.tokenlist !== 'undefined') {
			DOMTokenList.prototype.add.apply(item.classList, name);
		} else {
			var classes = item.className.split(/\s/) || [];
			item.className = classes.concat(name).clear().join(' ');
		}		
		<% } else { %>
		DOMTokenList.prototype.add.apply(item.classList, name);
		<% } %>	
	}

	if (name.indexOf(' '))
		name = name.split(/\s/)

	if (this instanceof NodeList) {
		var item;
		this.each(function(item, key) {
			add(item, name);
		}); 
	} else {
		add(this, name);
	}
});

[NodeList, Node].implement('hasClass', function(name){
	function has (item, name) {		
		<% if (settings.indexOf('ie') >= 0) { %>
		if (typeof SJS.tokenlist !== 'undefined') {
			return item.first().classList.contains(name);
		} else {
			return (item.first().className.split(/\s/).indexOf(name)) ? true : false;
		}		
		<% } else { %>
		return item.first().classList.contains(name);
		<% } %>
	}

	if (this instanceof NodeList) {
		has(this, name);
	} else {
		has(this, name);
	}
});

[NodeList, Node].implement('removeClass', function(name) {
	function remove (item, name) {		
		<% if (settings.indexOf('ie') >= 0) { %>
		if (typeof SJS.tokenlist !== 'undefined') {
			item.classList.remove(name);
		} else {
			var classes = item.className.split(/\s/);
			if (classes.indexOf(name)) {
				delete classes[classes.indexOf(name)];
				item.className = classes.join(' ');
			}
		}
		<% } else { %>
		item.classList.remove(name);
		<% } %>
	}

	if (this instanceof NodeList) {
		this.each(function(item) {
			remove(item, name);
		}); 
	} else {
		remove(itme, name);
	}
});

[NodeList, Node].implement('toggleClass', function(name) {
	var item = this.getNode();
	
	if (item.hasClass(name)) {
		item.removeClass(name);
	} else {
		item.addClass(name);
	}
});	