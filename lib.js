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

var Color = Color || {};
// functions for random colors for the visualization
// copied from/inspired by http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
Color.random = function() {
  var hsvToRgb = function(h, s, v) {
      var h_i = Math.floor(h * 6),
        f = h * 6 - h_i,
        p = v * (1 - s),
        q = v * (1 - f*s),
        t = v * (1 - (1 - f) * s),
        rgb;
      if (h_i == 0) { rgb = [v, t, p]; }
      if (h_i == 1) { rgb = [q, v, p]; }
      if (h_i == 2) { rgb = [p, v, t]; }
      if (h_i == 3) { rgb = [p, q, v]; }
      if (h_i == 4) { rgb = [t, p, v]; }
      if (h_i == 5) { rgb = [v, p, q]; }
      return rgb.map(function(ea) { return Math.floor(ea * 255) });
    };
  this.h = (this.h + this.golden_ratio_conjugate) % 1;
  return hsvToRgb(this.h, 0.5, 0.95)
}
Color.h = Math.random();
Color.golden_ratio_conjugate = 0.618033988749895;

Color.intToStr = function(rgb) {
  return 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')';
};
