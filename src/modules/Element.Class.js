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
		var item;
		if (this instanceof NodeList) {
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