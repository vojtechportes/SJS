(function () {
	var Navigation = function (element) {
		this.element = element;
	}

	Navigation.implement('toggle', function(){
		var nav = this.element.getElement('[data-navigationtoggle]');
		$('body').toggleClass('nav-open');
		if ($('body').hasClass('nav-open')) {
			nav.set('text', 'Close navigation');
		} else {
			nav.set('text', 'Open navigation');			
		}
	});

	Navigation.implement('init', function(){
		var $this = this;

		this.element.inject(new Element('a', {
			"href": "#toggle",
			"text": "Open navigation",
			"data": {
				"navigationtoggle": ""
			},
			"events": {
				"click": function (event) {
					$this.toggle();
					console.log(event);
				}
			}
		}))
	});

	function Plugin (action) {
		var nav = new Navigation(this);
		nav.init();
	}

	document.addEvent('ready', function(){
		Plugin.call($('[data-navigation]'));
	});
})();