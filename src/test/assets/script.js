document.addEvent('ready', function(){
	function createList(items) {
		output = [],

		items.each(function(item, key){
			output.push([
				"li", {
					"class": "item-" + key,
					"html": [
						"a", item
					]
				}
			])
		});			

		return output;		
	}

	content = {
		"navigation": function(){
			var items = [
				{"text": "Home", "href": "#home"},
				{"text": "About us", "href": "#aboutus"},
				{"text": "Portfolio", "href": "#portfolio"},
				{"text": "Contact", "href": "#contact"}
			];

			return createList(items);
		},
		"content": {
			"left": {
				"hd": "News"
			}
		},
		"footer": {
			"navigation": function() {
				var items = [
					{"text": "Home", "href": "#home"},
					{"text": "About us", "href": "#aboutus"},
					{"text": "Portfolio", "href": "#portfolio"},
					{"text": "Contact", "href": "#contact"},
					{"text": "Partners", "href": "#partners"},
					{"text": "FAQ", "href": "#faq"},
					{"text": "Press releases", "href": "#pressreleases"}
				];			

				return createList(items);
			},
			"copy": "&copy; Site name 2010 - " + new Date().getFullYear() + "."
		}
	};

	var markup = {
		"layout": new Element('div', {
			"id": "body-inner",
			"html": [
				["nav", {"id": "navigation"}],
				["section", {
					"id": "content",
					"html": [
						["div", {
							"class": "content-left"
						}],
						["div", {
							"class": "content-right"
						}],
						["div", {
							"class": "clearfix"
						}]
					]
				}],
				["footer", {"id": "footer"}]
			]
		}),
		"navigation": new Element('ul', {
			"html": content.navigation()
		}),
		"content": function() {

		},
		"footer": new Element('div', {
			"html": [
				["div", {
					"class": "footer-top",
					"html": ["ul", {
						"html": content.footer.navigation()
					}]
				}],
				["div", {
					"class": "footer-bottom",
					"html": ["p", {
						"html": content.footer.copy
					}]
				}]
			]
		})		
	};

	$('body').inject(markup.layout);
	$('#navigation').inject(markup.navigation);
	$('#footer').inject(markup.footer);
	//$('.content-left').inject()
});