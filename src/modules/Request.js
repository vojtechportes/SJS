function Request (object) {
	this.canSend = true,
	this.documentSupport = true;
	if (typeof object.method === 'undefined') {
		this.method = 'POST';
	} else {
		this.method = object.method;
	}

	if (typeof object.type !== 'undefined') {
		this.type = object.type;
	} else {
		this.type = 'default';
	}

	if (typeof object.async === 'undefined') {
		this.async = true;	
	} else {
		this.async = object.async;
	}

	if (typeof object.url === 'undefined') {
		this.canSend = false;
	} else {
		this.url = object.url;

		if (this.url.indexOf(' ') > 0) {
			this.selector = this.url.substr(this.url.indexOf(' ') +1);
			this.url = this.url.substr(0, this.url.indexOf(' '));
		}
	}

	if (typeof object.events === 'undefined' || !('complete' in object.events)) {
		this.canSend = false;
	} else {
		this.events = object.events;
	}
}

Request.implement('send', function(query){
	var response, request = this, doc, root;

	if (typeof query === 'undefined')
		var query = '';

	if (this.canSend) {
		try {
			var xhr = new XMLHttpRequest();
			if (typeof this.type !== 'undefined') {
				try {
					xhr.responseType = this.type;
				} catch (e) {
					request.documentSupport = false;	
				}
			}

			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			  	if (request.type === 'document') {
			  		if (request.documentSupport) {
			  			response = xhr.responseXML;
			  		} else {
			  			response = xhr.responseText;
			  			doc = document.implementation.createHTMLDocument('');
			  			root = doc.documentElement;
			  			root.innerHTML = response;
			  			response = root;
			  			//doc.removeElement();
			  		}
			  		if (typeof request.selector !== 'undefined') {
			  			if (response)
			  				response = response.getElement(request.selector);
			  		}
			  		request.events.complete.call(this, response);
			  	} else {
			  		response = xhr.responseText;

			  		try {
			  			response = JSON.parse(response);
			  		} catch (e) {

			  		}

			  		request.events.complete.call(this, response);	
			  	}
			  } else if (xhr.readyState == 3) {
			  	if ('loading' in request.events)
			  		request.events.loading();
			  } else if (xhr.status >= 400) {
			  	if ('error' in request.events)
			  		request.events.error();	  	
			  }
			}

			xhr.open(this.method, this.url, this.async);
			xhr.send(query);
		} catch (e) {

		}
	} else {
		console.error('No url or events defined.');
	}
});

[NodeList, Node].implement('load', function(url, type){
	var node = this.getNode();

	if (typeof type === 'undefined')
		var type = 'default';

	new Request({
		'method': 'GET',
		'type': type,
		'url': url,
		'async': true,
		'events': {
			'complete': function(response) {
				if (type === 'document') {
					console.log(response);
					node.inject(response);	
				} else {
					node.set('text', response);
				}
			}
		}
	}).send();
});

function Require (paths, callback) {
	var length, i = 0;

	if (typeof paths === 'string') {
		paths = [paths];
	}

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