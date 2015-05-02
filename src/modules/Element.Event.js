if (!window.CustomEvent) {
	(function () {
		function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
		};

		CustomEvent.prototype = window.Event.prototype;

		window.CustomEvent = CustomEvent;
	})();
}

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
			item.addEventListener(type, e.register(window.event), capture);
		}); 
	} else {	
		var e = new SEvent({'el': this, 'type': type, 'fce': callback});
		this.addEventListener(type, e.register(window.event), capture);
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
	var item, name = "on" + type;

	function fire (item, type) {
		var e = window.getEventCache(item, type);
		if (e && name in window) {
			e.fce.call(item, e.event);
		} else {
			e = document.createEvent("Event");
			e.initEvent(type, true, true); 
			item.dispatchEvent(e);
		}		
	}

	if (this instanceof NodeList) {
		this.each(function(item) {
			fire(item, type);
		});
	} else {
		fire(this, type);
	}
});