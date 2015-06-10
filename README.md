# SJS
<small>version 1.0.81</small>

Simple javascript library for **modern browsers**.

## Benchmark

<strong>[results](https://github.com/vojtechportes/SJS/blob/master/prod/benchmark/benchmark.MD)</strong>

## Unit tests

<strong>[results](https://github.com/vojtechportes/SJS/tree/master/prod/unittests)</strong>

## Download

SJS with IE9 support

<strong>[s.js](https://github.com/vojtechportes/SJS/blob/master/prod/s.js)	~ 22.82kb</strong><br>
<strong>[s.min.js](https://github.com/vojtechportes/SJS/blob/master/prod/s.min.js)	~ 11.37kb</strong>

SJS without IE9 support

<strong>[s.modern.js](https://github.com/vojtechportes/SJS/blob/master/prod/s.modern.js)	~ 20.99kb</strong><br>
<strong>[s.modern.min.js](https://github.com/vojtechportes/SJS/blob/master/prod/s.modern.min.js)	~ 10.63kb</strong>

--------------------------------------------------------------------------------------

## Browser support

<table width="100">
	<tr>
		<th width="25">IE</th>
		<th width="25">Chrome</th>
		<th width="25">Firefox</th>
		<th width="25">Safari</th>
	</tr>
	<tr>
		<td width="20">9+</td>
		<td width="20" background="green">8+</td>
		<td width="20" background="green">13+</td>
		<td width="20" background="green">ALL (?)</td>
	</tr>
</table>

--------------------------------------------------------------------------------------

- [Download](#download)
- [Browser support](#browser-support)
- [Core](#core)
	- [Dollar selector](#dollar-selector)
	- [DOM Ready](#dom-ready)
- [Each](#each)
- [Element](#element)
- [Element Class](#element-class)
- [Element Style](#element-style)
- [Element Event](#element-event)
<del>- [Type](#type)</del>
- [Array](#array)
- [String](#string)
- [Request (AJAX + Require)](#request)

Core
----

#### extend

Extend type Object

```javascript
window.extend('$', function(){
	// Some code
});
```

#### implement

Implement new prototype extension to type Object

```javascript
Node.implement('method', function(){
	// Some code
});
```

#### Dollar selector

Dollar selector is an funciton which returns html collection

Arguments:

* selector

```javascript
$('body div');
```

If selector contains only id of element, getElementById is used instead of querySelectorAll and Node is returned instead of NodeList

```javascript
$('#body-inner');
```

#### DOM Ready

```javascript
document.addEvent('ready', function(){
	// Some code
});
```

Each
----

#### each

A generic iterator function which can be used on NodeList, objects or arrays

Array
```javascript
$.each([1,2,3], function(value, key){
	// Some code
});
```

HTML collection 
```javascript
$('div').each(function(value, key){
	// Some code
});
```

Element
-------

#### Element constructor

arguments:

* tag
* object

Argument object can contain multiple key types: attribute (eg. class, id, href), data, text, html, styles and events. html can be an array with another element/s constructor or html.

Return Node.

```javascript
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
	'html': [['div', {
		'class': 'inner',
		'text': 'lorem ipsum dolor sit amet...'
	}], [...]]
});
``` 

#### getNode

Return first element from NodeList or Node

```javascript
$('div').getNode();
```

#### first

Select first element from html collection

```javascript
$('div').first();
```

#### last

Select last element from html collection

```javascript
$('div').last();
```
#### setData

(this method is available in SJS with IE9 support only!)

Node.dataset wrapper

Arguments:

* key
* value

```javascript
$('div').first().setData('content', ['a', 'b']);
```

#### getData

(this method is available in SJS with IE9 support only!)

Node.dataset wrapper

Arguments:

* key

```javascript
$('div').first().getData('content');
```

#### set

Set attribute or data attribute to element

Arguments:

* name - name of attribute
* value - value of attribute
* type - type of attribute - data or attr (default)

```javascript
$('div').set('href', 'http://www.domain.tld');
```

#### get

Get attribute or data attribute from element

Arguments:

* name - name of attribute
* type - type of attribute data or attr (default)

```javascript
// <div data-content='{"heading": "lorem ipsum", "text": "dolor sit amet"}'></div>

$('div').get('content', 'data');

// return {"heading": "lorem ipsum", "text": "dolor sit amet"}
```
#### getParent

Get parent of element

```javascript
$('div.someElement').getParent();
```

#### getElement

Return first html element

Arguments:

* selector

```javascript
$('body div.wrapper').getElement('div')
```

#### getElemens

Return all html elements as html collection

Arguments:

* selector

```javascript
$('body div.wrapper').getElements('div')
```

#### getNext

Return next element or null

```javascript
$('body div.first').getNext();
```

#### getPrevious

Return previous element or null

```javascript
$('body div.first').getPrevious();
```

#### getFirstChild

Return first child element or null

```javascript
$('body div.wrapper').getFirstChild();
```

#### getLastChild

Return last child element or null

```javascript
$('body div.wrapper').getLastChild();
```

#### getSiblings

Return collection of element's siblings

```javascript
$('body div.wrapper div').getSiblings();
```

#### isChildOf

Return true if element is child of parent or return false

Arguments:

* parent

```javascript
$('div.feature').isChildOf('.features');
```

#### removeElement

Remove html element or collection of elements or child elements

Arguments:

* selector

```javascript
// remove all div.wrapper elements

$('body div.wrapper').removeElement();
```

```javascript
// remove all divs inside div.wrapper

$('body div.wrapper').removeElement('div');
```

#### inject

Inject element to current element

Arguments:

* tag
* object - see Element constructor
* where - before, after, inside (default)

or 

* element/s - Node, NodeList
* where - before, after, inside (default)

```javascript
$('body div.wrapper').inject('div', {
	'class': 'inner',
	'text': 'lorem ipsum dolor sit amet...'
}, 'after');

$('body div.wrapper').inject([
	new Element('div'),
	new Element('p')
]);
```

#### cloneElement

Return cloned element without events

```javascript
var element = $('div').first().cloneElement();

// Return element

$('div').first().inject($('div').first());
```

Element Class
-------------

#### addClass

Add class to element/s

Arguments:

* name - class name/s

```javascript
$('div').addClass('item first');
```

#### hasClass

Returns true or false

Arguments:

* name - class name/s

```javascript
$('div').hasClass('item');
```

#### removeClass

Remove class from element/s

Arguments:

* name - class name/s

```javascript
$('div').removeClass('item');
```

#### toggleClass

Toggle class on element

Arguments:

* name - class name/s

```javascript
$('div').toggleClass('active');
```

Element Style
-------------

#### setStyle

Add style to element/s

Arguments:

* property
* value

```javascript
$('div').setStyle('background-color', 'blue');
```

#### setStyles

Add style object to element/s

Arguments:

* object - style object

```javascript
$('div').setStyles({
	'background-color': 'blue',
	'font-size': '48px',
	'color': 'white'
});
```

#### getStyle

Return style value or false in case element has no such style

Arguments:

* property

```javascript
$('div').getStyle('background-color');
```

#### removeStyle

Remove style from element or return false in case element has no such style

```javascript
$('div').removeStyle('color');
```

Element Event
-------------

All events are stored on window object. They are accesible on window.eventCache.

To trigger custom event use method fireEvent. To listen custom event, use addEvent method.

Events can be namespaced in format eventname.namespace[.namespace,...]

#### getEventCache

Return all informations about element event from window object

Arguments:

* element
* type - type of event (eg. click, scroll etc.)

```javascript
window.getEventCache($('div').first(), 'click');

// return eg.: {'type': 'click', 'fce': function(){ console.log('click') }, 'eid': 'e_78354214568'} 
```

#### Event constructor (cache)

```javascript
new SEvent(object)
```

##### register

Add event listener to cache

Arguments:

* event

```javascript
var e = new SEvent({
	'el': $('div').first(),
	'type': 'click',
	'fce': function(){
		console.log('click');
	}});
e.register(event);
```

##### unregister

Remove event listener from cache

```javascript
var e - new SEvent({'el': $('div').first(), 'eid': 'e_78354214568'});
```

#### addEvent

Add event listener to element/s

Arguments:

* type - eg. click, scroll etc.
* callback
* capture - true or false (default)

or 

* cache event listener object

```javascript
$('div').first().addEvent('click', function(){
	event.stopPropagation();
	console.log('click');
});
```

```javascript
var e = $('div').first().cloneEvent('click');
$('p').addEvent(e);
```

#### removeEvent

Remove event listener from element/s

Arguments:

* type - eg. click, scroll etc.
* capture - true or false (default)

```javascript
$('div').first().removeEvent('click');
```

#### cloneEvent

Return event listener cache object of element

Arguments:

* type - eg. click, scroll etc.
* element - element/s on which will be event cloned (optional)

```javscript
$('div').first().cloneEvent('click');

// return eg.: {'type': 'click', 'fce': function(){ console.log('click') }, 'eid': 'e_78354214568'}
```

```javascript
$('div').first().cloneEvent('click', $('p'));

// clone click event listener from first div element in DOM and apply it to all paragraph elements in DOM
```

#### fireEvent

Fire event on element/s.

Arguments:

* type - eg. click, scroll etc.

```javascript
// Fire click event on all div elements

$('div').fireEvent('click');
```

```javascript
// Fire click event on div element

$('div').first().fireEvent('click');
```

String
------

#### toCamelCase

Return camel case string

```javascript
'lorem ipsum'.toCamelCase();

// return LoremIpsum
```

#### firstUpper

Return string with first letter in upper case format

```javascript
'lorem ipsum'.firstUpper();

// return Lorem ipsum
```

Array
-----

#### clear

Clear duplicites in array

```javascript
['a', 'b', 'a'].clear();

// return ['a', 'b']
```

Request
-------

#### Request constructor

Request constructor creates an request object settings. If content of file is in valid JSON format, JSON is returned as response.

Arguments:

* object
* object.method - POST (default) or GET
* object.type - document or none (empty string) (default)
* object.async - true (default) or false
* object.url - url can contain selector in format "url(space)selector"
* object.events - loading, error, complete (complete event is mandatory)
* object.events.loading
* object.events.error
* object.events.complete

```javascript
new Request({
	'method': 'GET',
	'url': 'ajax.html #inner',
	'type': 'document',
	'events': {
		'complete': function(response) {
			console.log(response);
		},
		'loading': function(){
			console.log('loading...');
		},		
		'error': function() {
			console.warn('something bad happend');
		}
	}
});
```

#### send

Send method is method of Request object.

Arguments:

* query - Query string in case POST method is used in Request constructor

```javascript
var r = new Request({
	'method': 'GET',
	'url': 'ajax.html #inner',
	'type': 'document',
	'events': {
		'complete': function(response) {
			console.log(response);
		},
		'loading': function(){
			console.log('loading...');
		},
		'error': function() {
			console.warn('something bad happend');
		}
	}
});

r.send();
```

#### load

Load is method of Node, NodeList. Return responseXML or responseText. Returned value is "loaded" into element on which is method used by injecting or seting text content. If method is called on NodeList, content is loaded to first element of NodeList.

Arguments:

* url
* type - docuemnt or default (default)

```javascript
$('#content').load('ajax.html #inner p', 'document');
```

#### Require

Require is an function loading JavaScript files.

Arguments:

* path/s - single path or array of paths to files
* callback - callback is called when all files are loaded

```javascript
Require(['script1.js', 'script2.js', 'script3.js'], function(){
	console.log('all scripts are loaded.');
});
```

