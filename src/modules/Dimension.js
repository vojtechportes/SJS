[NodeList, Node, Object].implement('size', function(outer) {
	var item = this.getNode();

	if (typeof outer === 'undefined')
		outer = false;

	if (item.self == window) {
		var obj = {
			'x': (outer) ? item.outerWidth : item.innerWidth,
			'y': (outer) ? item.outerHeight : item.innerHeight
		}
	} else {
		var obj = {
			'x': (outer) ? item.offsetWidth : item.clientWidth,
			'y': (outer) ? item.offsetHeight : item.clientHeight
		}
	}

	return obj;
});

[NodeList, Node].implement('offset', function () {
	var item = this.getNode();

	return {
		'top': item.offsetTop,
		'bottom': $('html').size(true).y - (item.offsetTop + item.size(true).y),
		'left': item.offsetLeft,
		'right': window.size(true).x - (item.offsetLeft + item.size(true).x)
	};
});

[NodeList, Node].implement('offsetParent', function() {
	return this.getNode().offsetParent.offset();
});