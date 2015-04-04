# SJS

Simple javascript library

## Core

### extend

Extends type Object

```
window.extend('$', function(){
	// Some code
});
```

### implement

Implements new prototype extension to type Object

```
Node.implement('method', function(){
	// Some code
});
```

### invoke

Implements new prototype extensions to type Object

```
[Node, NodeList].invoke('method', function(){
	// Some code
});
```

### Dollar selector

Dollar selector is an funciton which return html collection

```
$('body div');
```

### DOM Ready

```
document.addEvent('ready', function(){
	// Some code
});
```

## Each

### each

A generic iterator function which can be used on arrays, objects or arrays

Array
```
$.each([1,2,3], function(value, key){
	// Some code
});
```

HTML collection 
```
$('div').each(function(value, key){
	// Some code
});
```

## Element

### Element constructor

arguments:

* tag
* object

Argument object can contain multiple key types: attribute (eg. class, id, href), data, text, html, styles and events. html can be an array with another element constructor or html.

```
new Element('div', {
	'class': 'item first',
	'data': {
		'content': [1, 2, 3],
		...
	},
	'styles': {
		'background-color': 'yellow',
		'font-size': '42px'
	},
	'events': {
		'click': function () {
			event.preventDefault();
			console.log('click');
		}
	},
	'html': ['div', {
		'class': 'inner',
		'text': 'lorem ipsum dolor sit amet...'
	}]
});
``` 
### first

Select first element from html collection

```
$('div').first();
```

### last

Select last element from html collection

```
$('div').last();
```

### set

Set attribute or data attribute to element

Arguments:

* name - name of attribute
* value - value of attribute
* type - type of attribute - data or attr (default)

```
$('div').set('href', 'http://www.domain.tld');
```

### get

Get attribute or data attribute from element

Arguments:

* name - name of attribute
* type - type of attribute data or attr (default)

```
// <div data-content='{"heading": "lorem ipsum", "text": "dolor sit amet"}'></div>

$('div').get('content', 'data');

// return {"heading": "lorem ipsum", "text": "dolor sit amet"}
```
### getParent

Get parent of element

```
$('div.someElement').getParent();
```

### getElement

Return first html element

Arguments:

* selector

```
$('body div.wrapper').getElement('div')
```

### getElemens

Return all html elements as html collection

Arguments:

* selector

```
$('body div.wrapper').getElements('div')
```

### removeElement

Remove html element or collection of elements

Arguments:

* selector

```
$('body div.wrapper').removeElement('div')
```

### inject

Inject element to current element

Arguments:

* tag
* object - see Element constructor
* where - before, after, inside (default)

```
$('body div.wrapper').inject('div', {
		'class': 'inner',
		'text': 'lorem ipsum dolor sit amet...'
	}, 'after');
```

## Element Class

### addClass

Add class to element/s

Arguments:

* name - class name/s

```
$('div').addClass('item first');
```

### hasClass

Returns true or false

Arguments:

* name - class name

```
$('div').hasClass('item');
```

### removeClass

Remove class from element/s

Arguments:

* name - class name

```
$('div').removeClass('item');
```

### toggleClass

Toggle class on element

Arguments:

* name - class name

```
$('div').toggleClass('active');
```

## Element style

### setStyle

Add style to element/s

Arguments:

* property
* value

```
$('div').setStyle('background-color', 'blue');
```

### setStyles

Add style object to element/s

Arguments:

* object - style object

```
$('div').setStyles({
	'background-color': 'blue',
	'font-size': '48px',
	'color': 'white'
});
```
### getStyle

Return style value or false in case element has no such style

Arguments:

* property

```
$('div').getStyle('background-color');
```

### removeStyle

Remove style from element or return files in case element has no such style

```
$('div').removeStyle('color');
```

## Element Event

All events are stored on window object. They are accesible on window.eventCache.

### getEventCache

Return all informations about element event from window object

Arguments:

* element
* type - type of event (eg. click, scroll etc.)

```
window.getEventCache($('div').first(), 'click');

// return eg.: {'type': 'click', 'fce': function(){ console.log('click') }, 'eid': 'e_78354214568'} 
```

### Event constructor (cache)

```
new Event(object)
```

#### register

Add event to cache

```
var e = new Event({
	'el': $('div').first(),
	'type': 'click',
	'fce': function(){
		console.log('click');
	}});
e.register();
```

### unregister

Remove event from cache

```
var e - new Event({'el': $('div').first(), 'eid': 'e_78354214568'});
```

### addEvent

Add event to element/s

Arguments:

* type - eg. click, scroll etc.
* callback
* capture - true or false (default)

```
$('div').first().addEvent('click', function(){
	event.stopPropagation();
	console.log('click');
});
```

### removeEvent

Remove event from element/s

Arguments:

* type - eg. click, scroll etc.
* capture - true or false (default)

```
$('div').first().removeEvent('click');
```

## String

### toCamelCase

Return camel case string

```
'lorem ipsum'.toCamelCase();

// return LoremIpsum
```

### firstUpper

Return string with first letter in upper case format

```
'lorem ipsum'.firstUpper();

// return Lorem ipsum
```

## Type

### isArray

Check if argument is an array and return true. In oposite case return false.

Arguments:

* data

```
var a = [1, 2, 3];
$.isArray(a);

// Return true

var b = 'lorem ipsum';
$.isArray(b);

// Return false
```

### (function) typeOf

Return type of argument.

Function has following extra types:

* nodelist
* node
* htmlcollection
* array
* object

Arguments:

* data

```
typeOf($('div'));

// Return nodelist

typeOf($('div').first());

// Return node
```

