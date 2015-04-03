	Object.implement('isArray', function(data){
		if (Object.prototype.toString.call(data) == '[object Array]')
			return true;
		return false;
	})

	var typeOf = function(data) {
		if (typeof data === 'undefined')
			data = this;

		var string = Object.prototype.toString.call(data);
		var regex = new RegExp(/\[(object NodeList|object Node|object HTMLCollection|object Array|object Object)\]/);
		var match = string.match(regex);

		if (match) {
			switch (match[1]) {
				case 'object NodeList':
					return 'nodelist';
					break;
				case 'object Node':
					return 'node';
					break;
				case 'object HTMLCollection':
					return 'htmlcollection';
					break;
				case 'object Array':
					return 'array';
					break;
				case 'object Object':
					return 'object';
					break;
			}
		} else {
			return typeof data;
		}
	};

	types.invoke('typeOf', typeOf);