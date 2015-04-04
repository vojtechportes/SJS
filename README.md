# SJS

Simple javascript library

## Core

### extend

Extends type Object

´´´
window.extend('$', function(){
	// Some code
});
´´´

### implement

Implements new prototype extension to type Object

´´´
Node.implement('method', function(){
	// Some code
});
´´´

### invoke

Implements new prototype extensions to type Object

´´´
[Node, NodeList].invoke('method', function(){
	// Some code
});
´´´

### Dollar selector

Dollar selector is an funciton which return html collection

´´´
$('body div');
´´´

## Each

### each

A generic iterator function which can be used on arrays, objects or arrays

Array
´´´
$.each([1,2,3], function(value, key){
	// Some code
});
´´´

HTML collection 
´´´
$('div').each(function(value, key){
	// Some code
});
´´´

## Element

### Element constructor

arguments:

* tag
* object

Argument object can contain multiple key types: attribute (eg. class, id, href), data, text, html, styles and events. html can be an array with another element constructor or html.

´´´
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
´´´ 
### first

Select first element from html collection

´´´
$('div').first();
´´´

### last

Select last element from html collection

´´´
$('div').last();
´´´

### set

Set attribute or data attribute to element

Arguments:

* name - name of attribute
* value - value of attribute
* type - type of attribute - data or attr (default)

´´´
$('div').set('href', 'http://www.domain.tld');
´´´

### get

Get attribute or data attribute from element

Arguments:

* name - name of attribute
* type - type of attribute data or attr (default)

´´´
// <div data-content='{"heading": "lorem ipsum", "text": "dolor sit amet"}'></div>

$('div').get('content', 'data');

// return {"heading": "lorem ipsum", "text": "dolor sit amet"}
´´´
### getParent

Get parent of element

´´´
$('div.someElement').getParent();
´´´

### getElement

Return first html element

Arguments:

* selector

´´´
$('body div.wrapper').getElement('div')
´´´

### getElemens

Return all html elements as html collection

Arguments:

* selector

´´´
$('body div.wrapper').getElements('div')
´´´

### removeElement

Remove html element or collection of elements

Arguments:

* selector

´´´
$('body div.wrapper').removeElement('div')
´´´

### inject

Inject element to current element

Arguments:

* tag
* object - see Element constructor
* where - before, after, inside (default)

´´´
$('body div.wrapper').inject('div', {
		'class': 'inner',
		'text': 'lorem ipsum dolor sit amet...'
	}, 'after');
´´´
