window.extend('eventCache', {});

window.extend('hasReadyPassed', false);

var translateEvent = function (event) {
	var name = event.split('.')[0];
	switch (name) {
		case 'ready':
			return [event, 'DOMContentLoaded'];
			break;
		default:
			return [event, name];
			break;
	}
};

Object.implement('getEventCache', function(element, type) {
	if (typeof window.eventCache[element] !== 'undefined') {
		var events = window.eventCache[element], e = {};
    var pattNmsp = new RegExp(type.escapeRegex() + "$");
    var patt = new RegExp(type.escapeRegex() + "\..*$");
    
		$.each(events, function(val, key){
        if (type.charAt(0) === '.') {
          if (pattNmsp.test(val.type))
    				e[key] = val;
        } else if (patt.test(val.type) || type === val.type) {
          e[key] = val
        }
		});

		return e;
	} else {
		return false;
	}
});

var SEvent = function (object) {
  var r = function() {return (((1+Math.random())*0x10000)|0).toString(16).substring(1);};
  var token = (r()+r()+"-"+r()+"-"+r()+"-"+r()+"-"+r()+r()+r());

	this.eventID = object.eid || 'e_' + new Date().getTime() + '_' + token;
	this.el = object.el || null;
	this.type = object.type || null;
	this.fce = object.fce || function (){};
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

[Object, Node, NodeList].implement('addEvent', function(){
	var type, callback, capture = false, e = false;

	function add (item, type, callback, capture, add) {
		var e = new SEvent({'el': item, 'type': type[0], 'fce': callback});
		if (add) {
			item.addEventListener(type[1], e.register(window.event), capture);	
		} else {
			e.register(window.event);
		}	
	}

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
			add(item, type, callback, capture, true);
		}); 
    
    return this;
	} else {	
		if (this.nodeName === '#document' && type === 'DOMContentLoaded' && window.hasReadyPassed === true) {
			add(this, type, callback, capture, false); callback(); return;
		}

		add(this, type, callback, capture, true);

		if (this.nodeName === '#document' && type === 'DOMContentLoaded' && window.hasReadyPassed === false) {
			window.extend('hasReadyPassed', true);
		}
    
    return this;
	}
});

[Object, Node, NodeList].implement('removeEvent', function(type, callback, capture){
	var elEvent;

	function remove (item, type) {
		elEvent = window.getEventCache(item, type[0]);
    $.each(elEvent, function (elv) {
  			item.removeEventListener(type[1], elv.fce, capture);
  			var e = new SEvent({'el': item, 'eid': elv.eid});
  			e.unregister();		
    });
	}

	type = translateEvent(type);
	
	if (typeof capture === 'undefined')
		capture = false;

	if (this instanceof NodeList) {
		this.each(function(item) {
			remove(item, type);
		}); 
    return this;
	} else {
		remove(this, type);
    return this;
	}
});

[Object, Node, NodeList].implement('cloneEvent', function() {
	var type = arguments[0], element = false, item = this.getNode();
	if (typeof arguments[1] !== 'undefined')
		element = arguments[1]

	var e = window.getEventCache(item, type);

	if (element) {
    $.each(e, function(evt) {
		  element.addEvent(type, evt.fce);
    });
	} else {
		return e;
	}
});

[Object, Node, NodeList].implement('fireEvent', function(type){
	var item, name;

	function fire (item, type) {
		var e = window.getEventCache(item, type);
    $.each(e, function(evt){
      type = translateEvent(evt.type);
      name = "on" + type[1];
  		if (evt && name in window) {
  			evt.fce.call(item, evt.event);
  		} else {
  			evt = document.createEvent("Event");
  			evt.initEvent(type[1], true, true); 
  			item.dispatchEvent(evt);
  		}		
    });
	}

  //if (type.indexOf('.') >= 0)
	 //type = translateEvent(type)[0];

	if (this instanceof NodeList) {
		this.each(function(item) {
			fire(item, type);
		});
	} else {
		fire(this, type);
	}
});