String.implement('toCamelCase', function() {
   	var reg = new RegExp(/([^\_\-\s]+)/g), res, str = '';
   	$.each(this.match(reg), function (res) {
   		str += res.charAt(0).toUpperCase() + res.slice(1);
   	});
   	return str;
});

String.implement('firstUpper', function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
});

String.implement('escapeRegex', function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
});