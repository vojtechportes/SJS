document.addEvent('ready', function(){
	var language = navigator.language || navigator.userLanguage; 		
	$('body').addClass(language);

	Require('assets/markup.js', function(){
		$('body').inject(markup.layout);
		$('#navigation').inject(markup.navigation);
		$('#footer').inject(markup.footer);
		content.content.left.news();
	});
});