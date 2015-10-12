var Data = function () {
	if (typeof SJS.data.cache === 'undefined')
		SJS.data.cache = {};
}

Data.implement('set', function(key, value, type){
	if (typeof key === 'undefined')
		return;

	if (typeof type === 'undefined')
		return;

	if (typeof SJS.data.cache[type] === 'undefined')
		SJS.data.cache[type] = {};

	if (typeof key.data === 'undefined')
		key.data = {};

	var cache = SJS.data.cache[type]; var index = Object.keys(cache).length;

	if (typeof key.data[type] === 'undefined')
		key.data[type] = [];

	key.data[type].push(index);
	return cache[index] = {'key': key, 'value': value};
});

Data.implement('update', function(key, value, type){

});

Data.implement('get', function(key, type){
	if (typeof key === 'undefined' || typeof key.data === 'undefined')
		return;

	var data = key.data, _data = {};

	$.each(data, function(k){
		_data[k] = SJS.data.cache[type][k];
	});

	return _data;
});

Data.implement('remove', function(key, type){
	if (typeof key === 'undefined' || typeof type === 'undefined')
		return;

	if (typeof key.data[type] === 'undefined')
		return;

	var data = key.data[type];

	$.each(data, function(k){
		delete SJS.data.cache[type][k];	
	});
	
	delete key.data[type];
});

var DataCache = new Data();