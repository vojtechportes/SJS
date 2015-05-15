document.addEvent('ready', function(){

	var times = 1000,
		_times,
		start,
		parent = '#inner',
		actions = ['inject', 'addClass', 'addEvent'/*, 'removeElement'*/];

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
				console.log('Injecting ' + times + ' elements took ' + (new Date - start) + 'ms');
				break;
			case 'addClass':
				start = new Date;
				$('.injected').addClass('newClass');
				console.log('Adding class to ' + times + ' elements took ' + (new Date - start) + 'ms');
				break;
			case 'addEvent':
				start = new Date;
				$('.injected').addEvent('click', function(event){ event.stopPropagation; console.log('click'); });
				console.log('Adding event to ' + times + ' elements took ' + (new Date - start) + 'ms');
				break;
			case 'removeElement':
				start = new Date;
				$('.injected').removeEvent('click');
				$('.injected').removeElement();
				console.log('Removing events from ' + times + ' elements and removing ' + times + ' elements took ' + (new Date - start) + 'ms');
				break;
		}
	});	

});