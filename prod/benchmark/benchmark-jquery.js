$(document).ready(function(){

	var times = 1000,
		_times,
		start,
		parent = '#inner',
		actions = ['inject', 'addClass', 'addEvent', 'removeElement', 'request_POST', 'request_GET'];

	$.each(actions, function(key, el){
		console.log(el);
		switch (el) {
			case 'inject':
				_times = times;
				start = new Date;
				while(_times--) {
					$(parent).append('<div class="injected">text</div>');
				}
				$('#result').append('<div>Injecting <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span></div>');
				break;
			case 'addClass':
				start = new Date;
				$('.injected').addClass('newClass');
				$('#result').append('<div>Adding class to <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span></div>');
				break;
			case 'addEvent':
				start = new Date;
				$('.injected').on('click', function(event){ event.stopPropagation; console.log('click'); });
				$('#result').append('<div>Adding event to <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span></div>');
				break;
			case 'removeElement':
				start = new Date;
				$('.injected').off('click');
				$('.injected').remove();
				$('#result').append('<div>Removing events from <span>' + times + '</span> elements and removing <span>' + times + '</span> elements took <span>' + (new Date - start) + 'ms</span></div>');
				break;
			case 'request_POST':
				_times = times;
				start = new Date;
				while(_times--) {
					$.get("../test/assets/response.php", function(data) {});
				}
				$('#result').append('<div>Posting request <span>' + times + '</span> times took <span>' + (new Date - start) + 'ms</span></div>');				
				break;
			case 'request_GET':
				_times = times;
				start = new Date;
				while(_times--) {
					$.get("../test/assets/news.json", "id=2", function(data) {});
				}
				$('#result').append('<div>Get request <span>' + times + '</span> times took <span>' + (new Date - start) + 'ms' + '</div>');				
				break;	
		}
	});	
});