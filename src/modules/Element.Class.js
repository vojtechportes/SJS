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
	if (name) {
		function has (item, name) {		
			var passed = true, multiple = false;

			if (/\s/.test(name))
				multiple = true;

			<% if (settings.indexOf('ie') >= 0) { %>

			if (typeof SJS.tokenlist !== 'undefined') {
				if (multiple) {
		            var names = name.split(/\s/), i = 0;
		            while (names[i] && passed) {
		                if (!item.classList.contains(names[i])) passed = false;  
		                i++;  
		            }
		            return passed;
				} else {
					return item.classList.contains(name);
				}
			} else {
				var classes = item.className.split(/\s/);
				if (multiple) {
		            var names = name.split(/\s/), i = 0;
		            while (names[i] && passed) {
		                if (classes.indexOf(name) === -1) passed = false;  
		                i++;  
		            }
		            return passed;							
				} else {
					return (classes.indexOf(name) >= 0) ? true : false;
				}
			}		
			<% } else { %>
			if (multiple) {
	            var names = name.split(/\s/), i = 0;
	            while (names[i] && passed) {
	                if (!item.classList.contains(names[i])) passed = false;  
	                i++;  
	            }
	            return passed;
			} else {
				return item.classList.contains(name);
			}
			<% } %>
		}

		if (this instanceof NodeList) {
			return has(this.first(), name);
		} else {
			return has(this, name);
		}
	} else {
		return false;
	}
});

[NodeList, Node].implement('removeClass', function(name) {
	function remove (item, name) {	
		var multiple = false;

		if (/\s/.test(name))
			multiple = true;

		<% if (settings.indexOf('ie') >= 0) { %>
		if (typeof SJS.tokenlist !== 'undefined') {
			if (multiple) {
				var names = name.split(/\s/);
				$.each(names, function(name){
					item.classList.remove(name);
				});
			} else {
				item.classList.remove(name);
			}
		} else {
			function removeCN (item, name) {
				var classes = item.className.split(/\s/);
				if (classes.indexOf(name)) {
					delete classes[classes.indexOf(name)];
					item.className = classes.join(' ');
				}
			}

			if (multiple) {
				var names = name.split(/\s/);
				$.each(names, function(name){
					removeCN(item, name);
				});
			} else {
				removeCN(item, name);
			}
		}
		<% } else { %>
		if (multiple) {
			var names = name.split(/\s/);
			$.each(names, function(name){
				item.classList.remove(name);
			});
		} else {
			item.classList.remove(name);
		}
		<% } %>
	}

	if (this instanceof NodeList) {
		this.each(function(item) {
			remove(item, name);
		}); 
	} else {
		remove(this, name);
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