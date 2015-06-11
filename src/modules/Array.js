Array.implement('clear', function () {
    var dups = {};
    return this.filter(function(el) {
        var hash = el.valueOf();
        var isDup = dups[hash];
        dups[hash] = true;
        return !isDup;
    });
});

function getType (item) {
	if (item instanceof Object && !(item instanceof Array)) {
		return 'object';
	} else if (item instanceof Array) {
		return  'array';
	}	
	return false;
}

function isSameType (items) {
	var type = getType(items[0]), i = 0, passed = true;
	while(items[i] && passed) {
		var _type = getType(items[i]);
		if (items.hasOwnProperty(i)) {
			if (_type !== type || ['object', 'array'].indexOf(_type) < 0) passed = false;
			i++;
		}
	}
	return passed;
}

function mergeCopy (a, b, deep) {
	var diff = -1;

	if (a instanceof Array) {
		diff = a.length - b.length;
		var c = [];
	}

	if (diff > 0) {
		for (var i = 0; i < diff; i++) {
			c.push(undefined);
		}
		b = b.concat(c);
	}

	$.each(b, function(item, key){
		if (item instanceof Object && a[key] instanceof Object && isSameType([item, a[key]]) && deep) {
			return mergeCopy(a[key], item, deep);
		} else if (typeof item !== 'undefined') {
			a[key] = item;
		}
	});

	return a;	
}

Object.implement('merge', function (items, deep) {
	if (typeof deep === 'undefined')
		deep = false;

	if (items.length >= 2 && isSameType(items)) {
		var type = getType(items[0]);

		if (['object', 'array'].indexOf(type) >= 0) {
			$.each(items, function(item, key){
				if (typeof items[key + 1] !== 'undefined')
					items[key + 1] = mergeCopy(item, items[key + 1], deep);
			});
			
			return items[items.length - 1];
		} else {
			console.error('Array or object expected as argument, "' + typeof items[0] + '" given instead.');
		}
	} else {
		if (items.length === 1 && items[0] instanceof Object) {
			return items[0];
		} else {
			console.error('No relevant arguments given');
		}
	}
});