[NodeList, Node].implement('setStyle', function(key, val){
	if (this instanceof NodeList) {
		this.each(function(item) {
			item.style[key] = val;
		});
	} else {
		this.style[key] = val;
	}
});

[NodeList, Node].implement('setStyles', function(object){
	if (this instanceof NodeList) {
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

[NodeList, Node].implement('getStyle', function(key) {
	var item = this.getNode();

	if (typeof item.style[key] !== 'undefined')
		return item.style[key];
	return false;
});

[NodeList, Node].implement('removeStyle', function(key) {
	var item = this.getNode();
	
	if (typeof item.style[key] !== 'undefined')
		item.style[key] = null;
	return false;
});