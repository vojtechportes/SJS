Object.prototype.extend = function (key, val) {
	this[key] = val;
}

Object.prototype.implement = function (key, val) {
	if (this instanceof Array) {
		var items = this, item;
		for (var i = 0; item = items[i++];) {
			item.prototype[key] = val;
		}
	} else {
		this.prototype[key] = val;	
	}
}

Object.implement('setSelector', function(value, orig, extend) {
  if (typeof extend === 'undefined')
    extend = false;
  
  if (typeof this.selector === 'undefined')
    this.selector = '';

  if (extend) {  
    this.selector = orig + ' ' + value;
  } else {
    this.selector = value;
  }
  
  return this;
});

if (window.$ == null) window.extend('$', function(elements) {
	var item;
  if (!/\s/.test(elements) && elements.charAt(0) === '#') {
		item = document.getElementById(elements.substr(1)) || [];   
  } else {
	  item = document.querySelectorAll(elements) || [];
  }

  return item.setSelector(elements);
});

window.SJS = {
	"tokenlist": typeof DOMTokenList,
  "data": {
    "object": false
  }
}