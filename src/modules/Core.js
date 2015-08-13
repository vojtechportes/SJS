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

if (window.$ == null) window.extend('$', function(elements) {
	if (!/\s/.test(elements) && elements.charAt(0) === '#')
		return document.getElementById(elements.substr(1));
	return document.querySelectorAll(elements);
});

window.SJS = {
	"tokenlist": typeof DOMTokenList,
  "data": {
    "object": false
  }
}