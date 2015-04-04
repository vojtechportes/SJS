	Array.implement('clear', function () {
	    var dups = {};
	    return this.filter(function(el) {
	        var hash = el.valueOf();
	        var isDup = dups[hash];
	        dups[hash] = true;
	        return !isDup;
	    });
	});