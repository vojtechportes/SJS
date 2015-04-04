	Object.implement('isArray', function(data){
		if (Object.prototype.toString.call(data) == '[object Array]')
			return true;
		return false;
	});