document.addEvent('ready', function(){
	var language = navigator.language || navigator.userLanguage; 		
	$('body').addClass(language);

	Require('assets/markup.js', function(){
		$('body').inject(markup.layout);
		$('#navigation').inject(markup.navigation);
		$('#footer').inject(markup.footer);
		content.content.left.news();
	});

	Require('assets/modules/navigation.js');
	Require('assets/modules/response.js');

	/**/

	var arr1 = [];
	var arr2 = ['a', ['b', 'c'], 8];
	var arr3 = [1, [[1]]];

	var obj1 = {'a': 1};
	var obj2 = {'a': 2, 'c': {'a': 'y'}};
	var obj3 = {'c': {'a': 'x'}};

	console.log($.merge([arr1, arr2, arr3], true));
	console.log($.merge([obj1, obj2, obj3], true));
});