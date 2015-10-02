function Require (paths, callback) {
	var length, i = 0;

	if (typeof paths === 'string')
		paths = [paths];
	length = paths.length;

	$.each(paths, function(path, key){
		var script = new Element('script', {
			"src": path,
			"data": {
				"require": ""
			},
			"type": "text/javascript"
		});

		$('head').inject(script);

		if (typeof callback !== 'undefined') {
			script.addEvent("load", function(){ 
				i++;
				if (i === length) {
					callback();
				}
			});
		}
	});


};