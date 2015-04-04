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

	var Event = function (object) {
		this.eventID = object.eid || 'e_' + new Date().getTime();
		this.el = object.el || null;
		this.type = object.type || null;
		this.fce = object.fce || null;
	}

	Event.implement('register', function(){
		if (typeof window.eventCache[this.el] === 'undefined')
			window.eventCache.extend(this.el, {});

		window.eventCache[this.el].extend(this.eventID, {'type': this.type, 'fce': this.fce, 'eid': this.eventID});
		return window.eventCache[this.el][this.eventID].fce;
	});

	Event.implement('unregister', function(){
		delete window.eventCache[this.el][this.eventID];
	});

	[Node, NodeList].invoke('addEvent', function(type, callback, capture){
		type = translateEvent(type);
		if (typeof capture === 'undefined')
			capture = false;

		if (this instanceof NodeList) {
				var item, events;			
				this.each(function(item) {
					var e = new Event({'el': item, 'type': type, 'fce': callback});
					item.addEventListener(type, e.register(), capture);
				}); 
			} else {	
				var e = new Event({'el': this, 'type': type, 'fce': callback});
				this.addEventListener(type, e.register(), capture);
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
					var e = new Event({'el': item, 'eid': elEvent.eid});
					e.unregister();
				}); 
			} else {
				elEvent = window.getEventCache(this, type);
				this.removeEventListener(type, elEvent.fce, capture);
				var e = new Event({'el': this, 'eid': elEvent.eid});
				e.unregister();
			}
	});

	[Node, NodeList].invoke('fireEvent', function(type){
		// TBD

		if (this instanceof NodeList) {
			this.each(function(item) {
			});
		} else {
		}
	});