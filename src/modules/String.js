String.implement('toCamelCase', function() {
    return this.replace(/-\D/g, function(match){
		return match.charAt(1).toUpperCase();
	});
});

String.implement('firstUpper', function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
});