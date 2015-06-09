QUnit.test('Core', function(assert){
	$('body').set('id', 'body');

	assert.equal($('body') instanceof NodeList, true, 'dollar selector test (NodeList)');
	assert.equal($('body').first() instanceof Node, true, 'dollar selector test (Node)');
	assert.equal($('#body') instanceof Node, true, 'dollar selector test via id selector (Node)');
	assert.equal($('section').length, 0, 'dollar selector test (non existing element)');
});

QUnit.test('Element.Class.hasClass', function(assert){
	$('body').addClass('lorem');

	assert.equal($('body').hasClass('lorem'), true, "has existing class, true excepted");
	assert.equal($('body').hasClass('ipsum'), false, "has non existing class, false excepted");
	assert.equal($('body').hasClass('lorem ipsum'), false, "has set of classes from which one is non existing, false excepted");

	$('body').addClass('ipsum');

	assert.equal($('body').hasClass('lorem ipsum'), true, "has set of existing classes, true excepted");

	assert.equal($('body').hasClass(''), false, "has class passed as empty string, false excepted");
	assert.equal($('body').hasClass(true), false, "has class passed as boolean, false excepted");
});

QUnit.test('Element.Class.removeClass', function(assert){
	function removeClass(name, el) {
		if ($(el).hasClass(name)) {
			$(el).removeClass(name);
			return true;
		} else {
			return false;
		}
	}

	function removeClassMulti (name, el) {
		var passed = false, names = name.split(/\s/), i = 0;

		while (!passed && names[i]) {
			if ($(el).hasClass(names[i])) passed = true;
			i++;
		}

		if (passed) {
			$(el).removeClass(name);
		}

		return passed;
	}

	assert.equal(removeClass('dolor', 'body'), false, "removal of non existing class, false excepted");
	assert.equal(removeClass('ipsum', 'body'), true, "removal of existing class, true excepted");

	$('body').addClass('ipsum');

	assert.equal(removeClassMulti('lorem ipsum dolor', 'body'), true, "removal of multiple existing and non existing classes, true excepted if one of the classes exists");
	assert.equal(removeClassMulti('ipsum dolor', 'body'), false, "removal of multiple non existing, false excepted");

});

QUnit.test('Element.set / Element.get', function(assert){
	function set () {
		$('body').set('test', {"a": "b"}, 'data');

		if (typeof $('body').first().get('test', 'data') === 'object')
			return true;
		return false;
	}

	assert.equal(set(), true, 'element set/get attribute test');
});

QUnit.test('Element.inject / Element constructor', function(assert){
	var el = new Element('div', {
		'class': 'first second',
		'data': {
			'lorem': '',
			'ipsum': 'dolor',
			'sit': '{"amet": 0}'
		},
		'id': 'inner',
		'html': ['div', {
			'id': 'innerItem'
		}]
	});

	assert.equal(el.hasClass('first second'), true, 'has classes added via element constructor');
	assert.equal(el.get('lorem', 'data'), '', 'has data attribute lorem added via element constructor');
	assert.equal(el.get('ipsum', 'data'), 'dolor', 'has data attribute ipsum added via element constructor');
	assert.equal(typeof el.get('sit', 'data'), 'object', 'has data attribute sit added via element constructor');

	$('body').inject(el);

	assert.equal($('#inner') instanceof Node, true, 'is element injected to its parent element, true excepted');
	assert.equal($('#inner > div') instanceof NodeList, true, 'is element injected to its parent element, true excepted');
});



QUnit.test('Element.removeElement', function(assert){
	$('body').removeElement('#inner');

	assert.equal($('#inner') instanceof Node, false, 'was element deleted, false excepted');	
});

QUnit.test('String', function(assert){
	assert.equal('lorem'.firstUpper(), 'Lorem', 'firstUpper method test');	
	assert.equal('lorem ipsum'.toCamelCase(), 'LoremIpsum', 'toCamelCase method test');	
});

QUnit.test('Type', function(assert){
	assert.equal($.isArray(['a']), true, 'isArray method test, true expected');	
	assert.equal($.isArray('a'), false, 'isArray method test, false expected');	
});

QUnit.test('Array', function(assert){
	var data = ['a', 'b', 'a'];
	assert.equal(data.clear().length, 2, 'array clear method test, 2 excepted');	
});