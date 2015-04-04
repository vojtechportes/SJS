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