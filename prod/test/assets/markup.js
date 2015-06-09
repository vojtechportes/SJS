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

var content = {
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
			"hd": "News",
			"news": function () {
				var hd = this.hd;
				var news = new Request({
					"method": "GET",
					"url": "assets/news.json",
					"events": {
						"complete": function (response) {
							$('#content .content-left').inject(
								[
									new Element('h2', {
										"html": hd
									}),								
									new Element('div', {
										"html": response.news
									}),
									new Element('hr')
								]
							);
						},
						"loading": function () {
							console.log('loading...');
						},
						"error": function () {
							console.log('File not found');
						}
					}
				});
				news.send();
			}
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
			["nav", {
				"id": "navigation",
				"data": {
					"navigation": ""
				}
			}],
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