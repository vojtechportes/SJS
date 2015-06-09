document.addEvent('ready', function(){

	var times = 1000,
		_times,
		start,
		parent = '#inner',
		actions = ['inject', 'addClass', 'addEvent', 'removeElement', 'request_POST', 'request_GET'];

	actions.each(function(el){
		console.log(el);
		switch (el) {
			case 'inject':
				_times = times;
				start = new Date;
				while(_times--) {
					//console.info(new Date - start);
					$('#inner').inject(new Element('div', {'text': 'test', 'class': 'injected'}));
				}
				$('#result').inject('div', {'html': 'Injecting <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span>'});
				break;
			case 'addClass':
				start = new Date;
				$('.injected').addClass('newClass');
				$('#result').inject('div', {'html': 'Adding class to <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span>'});
				break;
			case 'addEvent':
				start = new Date;
				$('.injected').addEvent('click', function(event){ event.stopPropagation; console.log('click'); });
				$('#result').inject('div', {'html': 'Adding event to <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span>'});
				break;
			case 'removeElement':
				start = new Date;
				$('.injected').removeEvent('click');
				$('.injected').removeElement();
				$('#result').inject('div', {'html': 'Removing events from <span>' + times + '</span> elements and removing <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span>'});
				break;
			case 'request_POST':
				_times = times;
				start = new Date;
				while(_times--) {
					new Request({
						"method": "POST",
						"url": "../test/assets/response.php",
						"events": {
							"complete": function (response) {}
						}
					}).send("id=2");
				}
				$('#result').inject('div', {'html': 'Posting request <span>' + times + '</span> times took <span>' + (new Date - start) + 'ms</span>'});				
				break;
			case 'request_GET':
				_times = times;
				start = new Date;
				while(_times--) {
					new Request({
						"method": "GET",
						"url": "../test/assets/news.json",
						"events": {
							"complete": function (response) {}
						}
					}).send();
				}
				$('#result').inject('div', {'html': 'Get request <span>' + times + '</span> times took <span>' + (new Date - start) + 'ms'});				
				break;				
		}
	});	

});