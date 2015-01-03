// Library functions for code structuring & language extensions

// copies all properties from the second argument into the first argument, including getters and setters
Object.extend = Object.extend || function (destination, source) {
  for (var property in source) {
    if (destination === window && window.hasOwnProperty(property)) {
      console.warn('window already has a property "' + property + '". If needed, it should be set directly and explicitly, not through the use of extend()');
    }
    var getter = source.__lookupGetter__(property),
      setter = source.__lookupSetter__(property);
    if (getter) destination.__defineGetter__(property, getter);
    if (setter) destination.__defineSetter__(property, setter);
    if (getter || setter) continue;
    var sourceObj = source[property];
    destination[property] = sourceObj;
  }
  return destination;
}

// some polyfill and collection interface extensions
Object.extend(Array.prototype, {
    detect: Array.prototype.find || function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            if (i in list) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
        }
        return undefined;
    },
    any: Array.prototype.any || function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.any called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this),
            length = list.length >>> 0,
            thisArg = arguments[1];

        for (var i = 0; i < length; i++) {
            if (i in list && predicate.call(thisArg, list[i], i, list)) {
                return true;
            }
        }
        return false;
    },
    last: function() {
      if (this.length == 0) return undefined;
      return this[this.length-1];
    },
    invoke: function(methodName) {
      return this.map(function(ea) {
        return ea[methodName]();
      })
    }
})

Object.extend(Array, {
  range: function(from) {
    // return array [from, to) or [0, from) in absense of to

    // zero is invalid increment and is the only falsy number
    var increment = arguments[2] || 1;

    var to = arguments[1];
    if (to == undefined) {
      to = from;
      from = 0;
    }
    if (from > to && increment > 0) {
      throw new Error('For a range from ' + from + ' to ' + to + ' increment need be negative.'); }
    var result = []
    for (var i = from; i < to; i += increment) {
      result.push(i);
    }
    return result;
  }
})

var Functions = Functions || {};
Functions.plus = function(a, b) { return a + b; };
Functions.id = function(a) { return a; };

var HTML = HTML || {};
Object.extend(HTML, {
    createElement: function(name, content) {
        var anElement = document.createElement(name);
        this.append(anElement, content);
        return anElement;
    },
    append: function(aNode, content) {
        switch(typeof content) {
            case 'string':
                aNode.appendChild(document.createTextNode(content));
                break;
            case 'object':
                if (Array.isArray(content)) {
                    content.forEach(function(ea) {
                        this.append(aNode, ea);
                    }, this);
                } else if (this.isNode(content)){
                    aNode.appendChild(content);
                }
                break;
            case 'undefined':
            default:
                break;
        }
    },
    isNode: function (aNode){
        // adapted from http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
        return (
            typeof Node === "object"
                ? aNode instanceof Node
                : aNode && typeof aNode === "object"
                    && typeof aNode.nodeType === "number"
                    && typeof aNode.nodeName==="string"
            );
    },
    clear: function(aNode) {
      while (aNode.lastChild) {
          aNode.removeChild(aNode.lastChild);
      }
      return aNode;
    },
    replaceContent: function(aNode, content) {
      this.clear(aNode);
      this.append(aNode, content);
      return aNode;
    },

    createNumber: function(n, onChangeCb, min, max) {
      var aNode = this.createElement('number', n + '');
      aNode.initialValue = n;
      aNode.lastValue = n;
      aNode.addEventListener('mousedown', function(evt) {
        HTML.createSwipeOverlay(function(x, y) {
          var delta = Math.round((x - evt.screenX) / 10),
            newValue = Math.max(min, Math.min(delta + aNode.initialValue, max));
          if (newValue != aNode.lastValue) {
            aNode.lastValue = newValue;
            onChangeCb(newValue);
          }
        });
      });
      return aNode;
    },
    createSwipeOverlay: function(cb) {
      var overlay = this.createElement('overlay');
      overlay.addEventListener('mousemove', function(evt) {
        cb(evt.screenX, evt.screenY);
      });
      overlay.addEventListener('mouseup', function(evt) {
        overlay.parentNode.removeChild(overlay);
      });
      document.body.appendChild(overlay);
    }
});
