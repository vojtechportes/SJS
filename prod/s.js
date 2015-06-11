Object.prototype.extend = function (key, val) {
    this[key] = val;
}

Object.prototype.implement = function (key, val) {
    if (this instanceof Array) {
        var items = this,
            item;
        for (var i = 0; item = items[i++];) {
            item.prototype[key] = val;
        }
    } else {
        this.prototype[key] = val;
    }
}

if (window.$ == null) window.extend('$', function (elements) {
    if (!/\s/.test(elements) && elements.charAt(0) === '#') return document.getElementById(elements.substr(1));
    return document.querySelectorAll(elements);
});

window.SJS = {
    "tokenlist": typeof DOMTokenList
}

Array.implement('clear', function () {
    var dups = {};
    return this.filter(function (el) {
        var hash = el.valueOf();
        var isDup = dups[hash];
        dups[hash] = true;
        return !isDup;
    });
});

function getType(item) {
    if (item instanceof Object && !(item instanceof Array)) {
        return 'object';
    } else if (item instanceof Array) {
        return 'array';
    }
    return false;
}

function isSameType(items) {
    var type = getType(items[0]),
        i = 0,
        passed = true;
    while (items[i] && passed) {
        var _type = getType(items[i]);
        if (items.hasOwnProperty(i)) {
            if (_type !== type || ['object', 'array'].indexOf(_type) < 0) passed = false;
            i++;
        }
    }
    return passed;
}

function mergeCopy(a, b, deep) {
    var diff = -1;

    if (a instanceof Array) {
        diff = a.length - b.length;
        var c = [];
    }

    if (diff > 0) {
        for (var i = 0; i < diff; i++) {
            c.push(undefined);
        }
        b = b.concat(c);
    }

    $.each(b, function (item, key) {
        if (item instanceof Object && a[key] instanceof Object && isSameType([item, a[key]]) && deep) {
            return mergeCopy(a[key], item, deep);
        } else if (typeof item !== 'undefined') {
            a[key] = item;
        }
    });

    return a;
}

Object.implement('merge', function (items, deep) {
    if (typeof deep === 'undefined') deep = false;

    if (items.length >= 2 && isSameType(items)) {
        var type = getType(items[0]);

        if (['object', 'array'].indexOf(type) >= 0) {
            $.each(items, function (item, key) {
                if (typeof items[key + 1] !== 'undefined') items[key + 1] = mergeCopy(item, items[key + 1], deep);
            });

            return items[items.length - 1];
        } else {
            console.error('Array or object expected as argument, "' + typeof items[0] + '" given instead.');
        }
    } else {
        if (items.length === 1 && items[0] instanceof Object) {
            return items[0];
        } else {
            console.error('No relevant arguments given');
        }
    }
});

String.implement('toCamelCase', function () {
    var reg = new RegExp(/([^\_\-\s]+)/g),
        res, str = '';
    $.each(this.match(reg), function (res) {
        str += res.charAt(0).toUpperCase() + res.slice(1);
    });
    return str;
});

String.implement('firstUpper', function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
});

[Object, NodeList].implement('each', function () {
    var data, callback, item;

    if (arguments.length == 1) {
        callback = arguments[0];
        data = this;
    } else {
        data = arguments[0];
        callback = arguments[1];
    }

    if (!(data instanceof Array) && !(data instanceof NodeList)) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                callback.call(null, data[key], key);
            }
        }
    } else {
        for (var i = 0; i < data.length; i++) {
            callback.call(data[i], data[i], i);
        }
    }
});


var Element = function (tag, object) {
    var element = document.createElement(tag);

    if (object) {
        $.each(object, function (value, key) {
            switch (key) {
            case 'data':
                $.each(value, function (data, k) {
                    if (data instanceof Object) {
                        element.set(k, JSON.stringify(data), 'data');
                    } else {
                        element.set(k, data, 'data');
                    }
                });
                break;
            case 'events':
                $.each(value, function (data, k) {
                    element.addEvent(k, data);
                });
                break;
            case 'styles':
                element.setStyles(value);
                break;
            case 'html':
                if (value instanceof Array) {
                    if (value[0] instanceof Array) {
                        $.each(value, function (value, key) {
                            if (typeof value[2] === 'undefined') value[2] = 'inside';
                            element.inject(new Element(value[0], value[1]), value[2]);
                        });
                    } else {
                        if (typeof value[2] === 'undefined') value[2] = 'inside';
                        element.inject(new Element(value[0], value[1]), value[2]);
                    }
                } else {
                    element.set(key, value);
                }
                break;
            default:
                element.set(key, value);
                break;
            }
        });
    }

    return element;
};

[Node, NodeList, Object].implement('getNode', function () {
    if (this instanceof NodeList) return this.first();
    return this;
});


Node.implement('setData', function (key, val) {
    if (this.dataset !== undefined) this.dataset[key] = val;
    this.setAttribute('data-' + key, val);
});

Node.implement('getData', function (key, val) {
    if (this.dataset !== undefined) return this.dataset[key];
    return this.getAttribute('data-' + key);
});


[NodeList, Node, Object].implement('size', function (outer) {
    var item = this.getNode();

    if (typeof outer === 'undefined') outer = false;

    if (item.self == window) {
        var obj = {
            'x': (outer) ? item.outerWidth : item.innerWidth,
            'y': (outer) ? item.outerHeight : item.innerHeight
        }
    } else {
        var obj = {
            'x': (outer) ? item.offsetWidth : item.clientWidth,
            'y': (outer) ? item.offsetHeight : item.clientHeight
        }
    }

    return obj;
});

[NodeList, Node].implement('offset', function () {
    var item = this.getNode();

    return {
        'top': item.offsetTop,
        'bottom': $('html').size(true).y - (item.offsetTop + item.size(true).y),
        'left': item.offsetLeft,
        'right': window.size(true).x - (item.offsetLeft + item.size(true).x)
    };
});

[NodeList, Node].implement('offsetParent', function () {
    return this.getNode().offsetParent.offset();
});

NodeList.implement('first', function () {
    return this.item(0);
});

NodeList.implement('last', function () {
    return this.item(this.length - 1);
});

[NodeList, Node].implement('set', function (name, value, type) {
    var item;

    function set(item, name, value, type) {
        if (type == 'data') {

            if (value instanceof Object) {
                item.setData(name, JSON.stringify(value));
            } else {
                item.setData(name, value);
            }

        } else {
            switch (name) {
            case 'html':
                item.innerHTML = value;
                break;
            case 'text':
                item.textContent = value;
                break;
            default:
                item.setAttribute(name, value);
                break;
            }
        }
    }

    if (typeof type === 'undefined') type = 'attr';

    if (this instanceof NodeList) {
        this.each(function (item) {
            set(item, name, value, type);
        });
    } else {
        set(this, name, value, type);
    }
});

[NodeList, Node].implement('get', function (name, type) {
    function get(item, name, type) {
        if (type == 'data') {

            var data = item.getData(name);

            if (typeof data !== 'undefined') {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return data;
                }
            } else {
                return false;
            }
        } else {
            switch (name) {
            case 'tag':
                return item.nodeName;
            case 'html':
                return item.innerHTML;
                break;
            case 'text':
                return item.textContent;
                break;
            default:
                return item.getAttribute(name);
                break;
            }

        }
    }

    if (typeof type === 'undefined') type = 'attr';

    return get(this.getNode(), name, type);
});

[NodeList, Node].implement('getParent', function () {
    return this.getNode().parentNode;
});

[NodeList, Node].implement('getElement', function (selector) {
    return this.getNode().querySelector(selector);
});

[NodeList, Node].implement('getElements', function (selector) {
    return this.getNode().querySelectorAll(selector);
});

[NodeList, Node].implement('getNext', function () {
    return this.getNode().nextElementSibling;
});

[NodeList, Node].implement('getPrevious', function () {
    return this.getNode().previousElementSibling;
});

[NodeList, Node].implement('getFirstChild', function () {
    return this.getNode().firstElementChild;
});

[NodeList, Node].implement('getLastChild', function () {
    return this.getNode().lastElementChild;
});

[NodeList, Node].implement('getSiblings', function () {
    var elements = [],
        node, element = this.getNode();

    node = this.getNode().getParent().getFirstChild();

    while (node) {
        if (node !== element) elements.push(node);
        node = node.getNext();
    }

    return elements;
});

[NodeList, Node].implement('inject', function () {
    var tag, object, elements, element, where = 'inside',
        parent;

    function inject(element, parent, where) {
        switch (where) {
        case 'inside':
            parent.appendChild(element);
            break;
        case 'before':
            parent.getParent().insertBefore(element, parent.previousSibling);
            break;
        case 'after':
            parent.getParent().insertBefore(element, parent.nextSibling);
            break;
        }
        return element;
    }

    if (typeof arguments[0] === 'string') {
        tag = arguments[0];
    } else if (arguments[0] instanceof Node || arguments[0] instanceof Array) {
        element = arguments[0];
    }

    if (typeof arguments[1] === 'undefined') object = {};

    if (arguments[1] instanceof Object) {
        object = arguments[1]
    } else if (typeof arguments[1] === 'string') {
        where = arguments[1]
    }

    if (typeof arguments[2] === 'string') where = arguments[2];

    if (tag && object && where) element = new Element(tag, object);

    parent = this.getNode();

    if (element instanceof Array) {
        elements = element, arr = [];
        $.each(elements, function (element, key) {
            arr.push(inject(element, parent, where));
        });
        return arr;
    } else {
        return inject(element, parent, where);
    }
});

[NodeList, Node].implement('isChildOf', function (parent) {
    var item = this.getNode(),
        node, parent = $(parent).getNode();

    node = this.getParent();

    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.getParent();
    }
    return false;
});

[NodeList, Node].implement('removeElement', function (selector) {
    var item, child, inside = false,
        children;

    function remove(item, selector) {
        if (inside) {
            children = item.getElements(selector);
            children.each(function (child) {
                child.remove();
            });
        } else {
            item.remove();
        }
    }

    if (typeof selector !== 'undefined') inside = true;

    if (this instanceof NodeList) {
        this.each(function (item) {
            remove(item, selector);
        });
    } else {
        remove(this, selector);
    }
});

[NodeList, Node].implement('cloneElement', function () {
    return this.getNode().cloneNode(true);
});

[NodeList, Node].implement('addClass', function (name) {
    function add(item, name) {

        if (typeof SJS.tokenlist !== 'undefined') {
            DOMTokenList.prototype.add.apply(item.classList, name);
        } else {
            var classes = item.className.split(/\s/) || [];
            item.className = classes.concat(name).clear().join(' ');
        }

    }

    if (name.indexOf(' ')) name = name.split(/\s/)

    if (this instanceof NodeList) {
        var item;
        this.each(function (item, key) {
            add(item, name);
        });
    } else {
        add(this, name);
    }
});

[NodeList, Node].implement('hasClass', function (name) {
    if (name) {
        function has(item, name) {
            var passed = true,
                multiple = false;

            if (/\s/.test(name)) multiple = true;



            if (typeof SJS.tokenlist !== 'undefined') {
                if (multiple) {
                    var names = name.split(/\s/),
                        i = 0;
                    while (names[i] && passed) {
                        if (!item.classList.contains(names[i])) passed = false;
                        i++;
                    }
                    return passed;
                } else {
                    return item.classList.contains(name);
                }
            } else {
                var classes = item.className.split(/\s/);
                if (multiple) {
                    var names = name.split(/\s/),
                        i = 0;
                    while (names[i] && passed) {
                        if (classes.indexOf(name) === -1) passed = false;
                        i++;
                    }
                    return passed;
                } else {
                    return (classes.indexOf(name) >= 0) ? true : false;
                }
            }

        }

        if (this instanceof NodeList) {
            return has(this.first(), name);
        } else {
            return has(this, name);
        }
    } else {
        return false;
    }
});

[NodeList, Node].implement('removeClass', function (name) {
    function remove(item, name) {
        var multiple = false;

        if (/\s/.test(name)) multiple = true;


        if (typeof SJS.tokenlist !== 'undefined') {
            if (multiple) {
                var names = name.split(/\s/);
                $.each(names, function (name) {
                    item.classList.remove(name);
                });
            } else {
                item.classList.remove(name);
            }
        } else {
            function removeCN(item, name) {
                var classes = item.className.split(/\s/);
                if (classes.indexOf(name)) {
                    delete classes[classes.indexOf(name)];
                    item.className = classes.join(' ');
                }
            }

            if (multiple) {
                var names = name.split(/\s/);
                $.each(names, function (name) {
                    removeCN(item, name);
                });
            } else {
                removeCN(item, name);
            }
        }

    }

    if (this instanceof NodeList) {
        this.each(function (item) {
            remove(item, name);
        });
    } else {
        remove(this, name);
    }
});

[NodeList, Node].implement('toggleClass', function (name) {
    var item = this.getNode();

    if (item.hasClass(name)) {
        item.removeClass(name);
    } else {
        item.addClass(name);
    }
});

[NodeList, Node].implement('setStyle', function (key, val) {
    if (this instanceof NodeList) {
        this.each(function (item) {
            item.style[key] = val;
        });
    } else {
        this.style[key] = val;
    }
});

[NodeList, Node].implement('setStyles', function (object) {
    if (this instanceof NodeList) {
        this.each(function (item) {
            $.each(object, function (val, key) {
                item.style[key] = val;
            });
        });
    } else {
        var item = this;
        $.each(object, function (val, key) {
            item.style[key] = val;
        });
    }
});

[NodeList, Node].implement('getStyle', function (key) {
    var item = this.getNode();

    if (typeof item.style[key] !== 'undefined') return item.style[key];
    return false;
});

[NodeList, Node].implement('removeStyle', function (key) {
    var item = this.getNode();

    if (typeof item.style[key] !== 'undefined') item.style[key] = null;
    return false;
});

window.extend('eventCache', {});

window.extend('hasReadyPassed', false);

var translateEvent = function (event) {
    var name = event.split('.')[0];
    switch (name) {
    case 'ready':
        return [event, 'DOMContentLoaded'];
        break;
    default:
        return [event, name];
        break;
    }
};

Object.implement('getEventCache', function (element, type) {
    if (typeof window.eventCache[element] !== 'undefined') {
        var events = window.eventCache[element],
            e;
        e = false;

        $.each(events, function (val, key) {
            if (val.type === type) e = val;
        });

        return e;
    } else {
        return false;
    }
});

var SEvent = function (object) {
    this.eventID = object.eid || 'e_' + new Date().getTime();
    this.el = object.el || null;
    this.type = object.type || null;
    this.fce = object.fce || null;
    this.event = object.event || null;
}

SEvent.implement('register', function (event) {
    if (typeof event !== 'undefined') this.event = event;
    if (typeof window.eventCache[this.el] === 'undefined') window.eventCache.extend(this.el, {});

    window.eventCache[this.el].extend(this.eventID, {
        'type': this.type,
        'fce': this.fce,
        'eid': this.eventID,
        'event': this.event
    });
    return window.eventCache[this.el][this.eventID].fce;
});

SEvent.implement('unregister', function () {
    delete window.eventCache[this.el][this.eventID];
});

[Node, NodeList].implement('addEvent', function () {
    var type, callback, capture = false,
        e = false;

    function add(item, type, callback, capture, add) {
        var e = new SEvent({
            'el': item,
            'type': type[0],
            'fce': callback
        });
        if (add) {
            item.addEventListener(type[1], e.register(window.event), capture);
        } else {
            e.register(window.event);
        }
    }

    if (typeof arguments[0] === 'string') {
        type = arguments[0];
    } else if (arguments[0] instanceof Object) {
        e = arguments[0];
    }

    if (arguments[1] instanceof Function) callback = arguments[1];
    if (arguments[2] instanceof Boolean) capture = arguments[2];

    if (e !== false) {
        type = e.type;
        callback = e.fce;
    }

    type = translateEvent(type);
    if (this instanceof NodeList) {
        var item, events;
        this.each(function (item) {
            add(item, type, callback, capture, true);
        });
    } else {
        if (this.nodeName === '#document' && type === 'DOMContentLoaded' && window.hasReadyPassed === true) {
            add(this, type, callback, capture, false);
            callback();
            return;
        }

        add(this, type, callback, capture, true);

        if (this.nodeName === '#document' && type === 'DOMContentLoaded' && window.hasReadyPassed === false) {
            window.extend('hasReadyPassed', true);
        }
    }
});

[Node, NodeList].implement('removeEvent', function (type, callback, capture) {
    var elEvent;

    function remove(item, type) {
        elEvent = window.getEventCache(item, type[0]);
        item.removeEventListener(type[1], elEvent.fce, capture);
        var e = new SEvent({
            'el': item,
            'eid': elEvent.eid
        });
        e.unregister();
    }

    type = translateEvent(type);

    if (typeof capture === 'undefined') capture = false;

    if (this instanceof NodeList) {
        this.each(function (item) {
            remove(item, type);
        });
    } else {
        remove(this, type);
    }
});

[Node, NodeList].implement('cloneEvent', function () {
    var type = arguments[0],
        element = false,
        item = this.getNode();
    if (typeof arguments[1] !== 'undefined') element = arguments[1]

    var e = window.getEventCache(item, type);

    if (element) {
        element.addEvent(type, e.fce);
    } else {
        return e;
    }
});

[Node, NodeList].implement('fireEvent', function (type) {
    var item, name = "on" + type;

    function fire(item, type) {
        var e = window.getEventCache(item, type[0]);
        if (e && name in window) {
            e.fce.call(item, e.event);
        } else {
            e = document.createEvent("Event");
            e.initEvent(type[1], true, true);
            item.dispatchEvent(e);
        }
    }

    type = translateEvent(type);

    if (this instanceof NodeList) {
        this.each(function (item) {
            fire(item, type);
        });
    } else {
        fire(this, type);
    }
});

function Request(object) {
    this.canSend = true, this.documentSupport = true;
    if (typeof object.method === 'undefined') {
        this.method = 'POST';
    } else {
        this.method = object.method;
    }

    if (typeof object.type !== 'undefined') {
        this.type = object.type;
    } else {
        this.type = '';
    }

    if (typeof object.async === 'undefined') {
        this.async = true;
    } else {
        this.async = object.async;
    }

    if (typeof object.url === 'undefined') {
        this.canSend = false;
    } else {
        this.url = object.url;

        if (this.url.indexOf(' ') > 0) {
            this.selector = this.url.substr(this.url.indexOf(' ') + 1);
            this.url = this.url.substr(0, this.url.indexOf(' '));
        }
    }

    if (typeof object.events === 'undefined' || !('complete' in object.events)) {
        this.canSend = false;
    } else {
        this.events = object.events;
    }
}

Request.implement('send', function (query) {
    var response, request = this,
        doc, root;

    if (typeof query === 'undefined') var query = '';

    if (this.canSend) {
        try {
            var xhr = new XMLHttpRequest();
            if (typeof this.type !== 'undefined') {
                try {
                    xhr.responseType = this.type;
                } catch (e) {
                    request.documentSupport = false;
                }
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                    if (request.type === 'document') {
                        if (request.documentSupport) {
                            response = xhr.responseXML;
                        } else {
                            response = xhr.responseText;
                            doc = document.implementation.createHTMLDocument('');
                            root = doc.documentElement;
                            root.innerHTML = response;
                            response = root;
                            //doc.removeElement();
                        }
                        if (typeof request.selector !== 'undefined') {
                            if (response) response = response.getElement(request.selector);
                        }
                        request.events.complete.call(this, response);
                    } else {
                        response = xhr.responseText;

                        try {
                            response = JSON.parse(response);
                        } catch (e) {

                        }

                        request.events.complete.call(this, response);
                    }
                } else if (xhr.readyState == 3) {
                    if ('loading' in request.events) request.events.loading();
                } else if (xhr.status >= 400) {
                    if ('error' in request.events) request.events.error();
                }
            }

            xhr.open(this.method, this.url, this.async);
            if (this.method === 'POST') xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(query);
        } catch (e) {

        }
    } else {
        console.error('No url or events defined.');
    }
});

[NodeList, Node].implement('load', function (url, type) {
    var node = this.getNode();

    if (typeof type === 'undefined') var type = 'default';

    new Request({
        'method': 'GET',
        'type': type,
        'url': url,
        'async': true,
        'events': {
            'complete': function (response) {
                if (type === 'document') {
                    node.inject(response);
                } else {
                    node.set('text', response);
                }
            }
        }
    }).send();
});

function Require(paths, callback) {
    var length, i = 0;

    if (typeof paths === 'string') paths = [paths];
    length = paths.length;

    $.each(paths, function (path, key) {
        var script = new Element('script', {
            "src": path,
            "data": {
                "require": ""
            },
            "type": "text/javascript"
        });

        $('head').inject(script);

        if (typeof callback !== 'undefined') {
            script.addEvent("load", function () {
                i++;
                if (i === length) {
                    callback();
                }
            });
        }
    });


};