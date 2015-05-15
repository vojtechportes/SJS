(function () {
	var Navigation = function (element) {
		this.element = element;
	}

	Navigation.implement('toggle', function(){
		console.log('click nav');
	});

	Navigation.implement('init', function(){
		this.element.inject(new Element('a', {
			"href": "#toggle",
			"text": "Toggle navigation",
			"data": {
				"navigationToggle": "a"
			}
		}))
	});


	function Plugin (action) {
		var nav = new Navigation(this);
		switch (action) {
			case 'init':
				nav.init();
				break;
			case 'toggle':
				nav.toggle();
				break;
		}
	}

	document.addEvent('ready', function(){
		console.log('ready nav');
		Plugin.call($('[data-navigation]'), 'init');
	});


	$('[data-navigation-toggle]').addEvent('click', function(){
		Plugin.call(this, 'toggle');
	});


	console.log('test');
})();