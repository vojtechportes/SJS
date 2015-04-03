	[Node, NodeList].invoke('addEvent', function(type, callback, capture){
		if (typeOf(capture) === 'undefined')
			capture = false;

		if (typeOf(this) === 'nodelist') {
				var item, events;
				for (var i = 0; item = this[i++];) {
					item.addEventListener(type, callback, capture);
				} 
			} else {	
				this.addEventListener(type, callback, capture);
			}
	});

	[Node, NodeList].invoke('removeEvent', function(type, callback, capture){
		/*if (typeOf(this) === 'nodelist') {
				var item;
				for (var i = 0; item = this[i++];) {
					return item['on' + type] = null;
				} 
			} else {
				return this['on' + type] = null;
			}*/
	});