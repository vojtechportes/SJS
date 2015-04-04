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