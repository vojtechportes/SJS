Array.implement('clear', function () {
    var dups = {};
    return this.filter(function(el) {
        var hash = el.valueOf();
        var isDup = dups[hash];
        dups[hash] = true;
        return !isDup;
    });
});

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
		if (item instanceof Object && a[key] instanceof Object) {
			return mergeCopy(a[key], item, deep);
		} else if (typeof item !== 'undefined') {
			a[key] = item;
		}
	});

	return a;	
} 

Object.implement('merge', function (items, deep) {

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
			if (items.hasOwnProperty(i)) {
				if (getType(items[i]) !== type) passed = false;
				i++;
			}
		}
		return passed;
	}

	if (items.length >= 2 && isSameType(items)) {
		var type = getType(items[0]);

		switch (type) {
			case 'array':
				console.log(type + ':');
				$.each(items, function(item, key){
					if (typeof items[key + 1] !== 'undefined')
						items[key + 1] = mergeCopy(item, items[key + 1], true);
				});
				
				return items[items.length - 1];
				break;
			case 'object':
				console.log(type + ':');
				$.each(items, function(item, key){
					if (typeof items[key + 1] !== 'undefined')
						items[key + 1] = mergeCopy(item, items[key + 1], true);
				});
				return items[items.length - 1];
				break;
			default:
				console.error('not object or array');
				break;
		}
	} else {
		console.error('not same type or requested length');
	}
});