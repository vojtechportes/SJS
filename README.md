# SJS
<small>version 1.0.34</small>

Simple javascript library for **modern browsers**.

<strong>[s.js](https://github.com/vojtechportes/SJS/blob/master/prod/s.js)	~ 12.7kb</strong><br>
<strong>[s.min.js](https://github.com/vojtechportes/SJS/blob/master/prod/s.min.js)	~ 7.7kb</strong>

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

- [Core](#core)
	- [Dollar selector](#dollar-selector)
	- [DOM Ready](#dom-ready)
- [Each](#each)
- [Element](#element)
	- [x] cloneElement
	- [x] inject
		- [ ] inject before
		- [ ] inject after 
- [Element Class](#element-class)
- [Element Style](#element-style)
- [Element Event](#element-event)
	- [ ] fireEvent
	- [x] cloneEvent
- [Type](#type)
- [Array](#array)
- [String](#string)

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

#### invoke

Implement new prototype extensions to type Object

```javascript
[Node, NodeList].invoke('method', function(){
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

If selector contains only id of element, getElementById is used instead of queryStringAll and Node is returned instead of NodeList

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

Node.dataset wrapper

Arguments:

* key
* value

```javascript
$('div').first().setData('content', ['a', 'b']);
```

#### getData

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

#### removeElement

Remove html element or collection of elements

Arguments:

* selector

```javascript
$('body div.wrapper').removeElement('div')
```

#### inject

Inject element to current element

Arguments:

* tag
* object - see Element constructor
* where - before, after, inside (default)

- [ ] inject before
- [ ] inject after

or 

* element - Node
* where - before, after, inside (default)

```javascript
$('body div.wrapper').inject('div', {
	'class': 'inner',
	'text': 'lorem ipsum dolor sit amet...'
}, 'after');
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

* name - class name

```javascript
$('div').hasClass('item');
```

#### removeClass

Remove class from element/s

Arguments:

* name - class name

```javascript
$('div').removeClass('item');
```

#### toggleClass

Toggle class on element

Arguments:

* name - class name

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
new Event(object)
```

##### register

Add event to cache

```javascript
var e = new Event({
	'el': $('div').first(),
	'type': 'click',
	'fce': function(){
		console.log('click');
	}});
e.register();
```

##### unregister

Remove event from cache

```javascript
var e - new Event({'el': $('div').first(), 'eid': 'e_78354214568'});
```

#### addEvent

Add event to element/s

Arguments:

* type - eg. click, scroll etc.
* callback
* capture - true or false (default)

or 

* cache event object

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

Remove event from element/s

Arguments:

* type - eg. click, scroll etc.
* capture - true or false (default)

```javascript
$('div').first().removeEvent('click');
```

#### cloneEvent

Return event cache object of element

Arguments

* type - eg. click, scroll etc.
* element - element/s on which will be event cloned (optional)

```javscript
$('div').first().cloneEvent('click');

// return eg.: {'type': 'click', 'fce': function(){ console.log('click') }, 'eid': 'e_78354214568'}
```

```javascript
$('div').first().cloneEvent('click', $('p'));

// clone click event from first div element in DOM and apply it to all paragraph elements in DOM
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

Type
----

#### isArray

Check if argument is an array and return true. In oposite case return false.

Arguments:

* data

```javascript
var a = [1, 2, 3];
$.isArray(a);

// Return true

var b = 'lorem ipsum';
$.isArray(b);

// Return false
```

Array
-----

#### clear

Clear duplicites in array

```javascript
['a', 'b', 'a'].clear();

// return ['a', 'b']
```

