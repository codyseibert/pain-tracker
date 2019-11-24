// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/hyperapp/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = exports.h = exports.Lazy = void 0;
var RECYCLED_NODE = 1;
var LAZY_NODE = 2;
var TEXT_NODE = 3;
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var map = EMPTY_ARR.map;
var isArray = Array.isArray;
var defer = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : setTimeout;

var createClass = function (obj) {
  var out = "";
  if (typeof obj === "string") return obj;

  if (isArray(obj) && obj.length > 0) {
    for (var k = 0, tmp; k < obj.length; k++) {
      if ((tmp = createClass(obj[k])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (var k in obj) {
      if (obj[k]) {
        out += (out && " ") + k;
      }
    }
  }

  return out;
};

var merge = function (a, b) {
  var out = {};

  for (var k in a) out[k] = a[k];

  for (var k in b) out[k] = b[k];

  return out;
};

var batch = function (list) {
  return list.reduce(function (out, item) {
    return out.concat(!item || item === true ? 0 : typeof item[0] === "function" ? [item] : batch(item));
  }, EMPTY_ARR);
};

var isSameAction = function (a, b) {
  return isArray(a) && isArray(b) && a[0] === b[0] && typeof a[0] === "function";
};

var shouldRestart = function (a, b) {
  if (a !== b) {
    for (var k in merge(a, b)) {
      if (a[k] !== b[k] && !isSameAction(a[k], b[k])) return true;
      b[k] = a[k];
    }
  }
};

var patchSubs = function (oldSubs, newSubs, dispatch) {
  for (var i = 0, oldSub, newSub, subs = []; i < oldSubs.length || i < newSubs.length; i++) {
    oldSub = oldSubs[i];
    newSub = newSubs[i];
    subs.push(newSub ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1]) ? [newSub[0], newSub[1], newSub[0](dispatch, newSub[1]), oldSub && oldSub[2]()] : oldSub : oldSub && oldSub[2]());
  }

  return subs;
};

var patchProperty = function (node, key, oldValue, newValue, listener, isSvg) {
  if (key === "key") {} else if (key === "style") {
    for (var k in merge(oldValue, newValue)) {
      oldValue = newValue == null || newValue[k] == null ? "" : newValue[k];

      if (k[0] === "-") {
        node[key].setProperty(k, oldValue);
      } else {
        node[key][k] = oldValue;
      }
    }
  } else if (key[0] === "o" && key[1] === "n") {
    if (!((node.actions || (node.actions = {}))[key = key.slice(2).toLowerCase()] = newValue)) {
      node.removeEventListener(key, listener);
    } else if (!oldValue) {
      node.addEventListener(key, listener);
    }
  } else if (!isSvg && key !== "list" && key in node) {
    node[key] = newValue == null ? "" : newValue;
  } else if (newValue == null || newValue === false || key === "class" && !(newValue = createClass(newValue))) {
    node.removeAttribute(key);
  } else {
    node.setAttribute(key, newValue);
  }
};

var createNode = function (vdom, listener, isSvg) {
  var ns = "http://www.w3.org/2000/svg";
  var props = vdom.props;
  var node = vdom.type === TEXT_NODE ? document.createTextNode(vdom.name) : (isSvg = isSvg || vdom.name === "svg") ? document.createElementNS(ns, vdom.name, {
    is: props.is
  }) : document.createElement(vdom.name, {
    is: props.is
  });

  for (var k in props) {
    patchProperty(node, k, null, props[k], listener, isSvg);
  }

  for (var i = 0, len = vdom.children.length; i < len; i++) {
    node.appendChild(createNode(vdom.children[i] = getVNode(vdom.children[i]), listener, isSvg));
  }

  return vdom.node = node;
};

var getKey = function (vdom) {
  return vdom == null ? null : vdom.key;
};

var patch = function (parent, node, oldVNode, newVNode, listener, isSvg) {
  if (oldVNode === newVNode) {} else if (oldVNode != null && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    if (oldVNode.name !== newVNode.name) node.nodeValue = newVNode.name;
  } else if (oldVNode == null || oldVNode.name !== newVNode.name) {
    node = parent.insertBefore(createNode(newVNode = getVNode(newVNode), listener, isSvg), node);

    if (oldVNode != null) {
      parent.removeChild(oldVNode.node);
    }
  } else {
    var tmpVKid;
    var oldVKid;
    var oldKey;
    var newKey;
    var oldVProps = oldVNode.props;
    var newVProps = newVNode.props;
    var oldVKids = oldVNode.children;
    var newVKids = newVNode.children;
    var oldHead = 0;
    var newHead = 0;
    var oldTail = oldVKids.length - 1;
    var newTail = newVKids.length - 1;
    isSvg = isSvg || newVNode.name === "svg";

    for (var i in merge(oldVProps, newVProps)) {
      if ((i === "value" || i === "selected" || i === "checked" ? node[i] : oldVProps[i]) !== newVProps[i]) {
        patchProperty(node, i, oldVProps[i], newVProps[i], listener, isSvg);
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldHead])) == null || oldKey !== getKey(newVKids[newHead])) {
        break;
      }

      patch(node, oldVKids[oldHead].node, oldVKids[oldHead], newVKids[newHead] = getVNode(newVKids[newHead++], oldVKids[oldHead++]), listener, isSvg);
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldTail])) == null || oldKey !== getKey(newVKids[newTail])) {
        break;
      }

      patch(node, oldVKids[oldTail].node, oldVKids[oldTail], newVKids[newTail] = getVNode(newVKids[newTail--], oldVKids[oldTail--]), listener, isSvg);
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(createNode(newVKids[newHead] = getVNode(newVKids[newHead++]), listener, isSvg), (oldVKid = oldVKids[oldHead]) && oldVKid.node);
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldVKids[oldHead++].node);
      }
    } else {
      for (var i = oldHead, keyed = {}, newKeyed = {}; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey(oldVKid = oldVKids[oldHead]);
        newKey = getKey(newVKids[newHead] = getVNode(newVKids[newHead], oldVKid));

        if (newKeyed[oldKey] || newKey != null && newKey === getKey(oldVKids[oldHead + 1])) {
          if (oldKey == null) {
            node.removeChild(oldVKid.node);
          }

          oldHead++;
          continue;
        }

        if (newKey == null || oldVNode.type === RECYCLED_NODE) {
          if (oldKey == null) {
            patch(node, oldVKid && oldVKid.node, oldVKid, newVKids[newHead], listener, isSvg);
            newHead++;
          }

          oldHead++;
        } else {
          if (oldKey === newKey) {
            patch(node, oldVKid.node, oldVKid, newVKids[newHead], listener, isSvg);
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patch(node, node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node), tmpVKid, newVKids[newHead], listener, isSvg);
              newKeyed[newKey] = true;
            } else {
              patch(node, oldVKid && oldVKid.node, null, newVKids[newHead], listener, isSvg);
            }
          }

          newHead++;
        }
      }

      while (oldHead <= oldTail) {
        if (getKey(oldVKid = oldVKids[oldHead++]) == null) {
          node.removeChild(oldVKid.node);
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i].node);
        }
      }
    }
  }

  return newVNode.node = node;
};

var propsChanged = function (a, b) {
  for (var k in a) if (a[k] !== b[k]) return true;

  for (var k in b) if (a[k] !== b[k]) return true;
};

var getTextVNode = function (node) {
  return typeof node === "object" ? node : createTextVNode(node);
};

var getVNode = function (newVNode, oldVNode) {
  return newVNode.type === LAZY_NODE ? ((!oldVNode || oldVNode.type !== LAZY_NODE || propsChanged(oldVNode.lazy, newVNode.lazy)) && ((oldVNode = getTextVNode(newVNode.lazy.view(newVNode.lazy))).lazy = newVNode.lazy), oldVNode) : newVNode;
};

var createVNode = function (name, props, children, node, key, type) {
  return {
    name: name,
    props: props,
    children: children,
    node: node,
    type: type,
    key: key
  };
};

var createTextVNode = function (value, node) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, node, undefined, TEXT_NODE);
};

var recycleNode = function (node) {
  return node.nodeType === TEXT_NODE ? createTextVNode(node.nodeValue, node) : createVNode(node.nodeName.toLowerCase(), EMPTY_OBJ, map.call(node.childNodes, recycleNode), node, undefined, RECYCLED_NODE);
};

var Lazy = function (props) {
  return {
    lazy: props,
    type: LAZY_NODE
  };
};

exports.Lazy = Lazy;

var h = function (name, props) {
  for (var vdom, rest = [], children = [], i = arguments.length; i-- > 2;) {
    rest.push(arguments[i]);
  }

  while (rest.length > 0) {
    if (isArray(vdom = rest.pop())) {
      for (var i = vdom.length; i-- > 0;) {
        rest.push(vdom[i]);
      }
    } else if (vdom === false || vdom === true || vdom == null) {} else {
      children.push(getTextVNode(vdom));
    }
  }

  props = props || EMPTY_OBJ;
  return typeof name === "function" ? name(props, children) : createVNode(name, props, children, undefined, props.key);
};

exports.h = h;

var app = function (props) {
  var state = {};
  var lock = false;
  var view = props.view;
  var node = props.node;
  var vdom = node && recycleNode(node);
  var subscriptions = props.subscriptions;
  var subs = [];

  var listener = function (event) {
    dispatch(this.actions[event.type], event);
  };

  var setState = function (newState) {
    if (state !== newState) {
      state = newState;

      if (subscriptions) {
        subs = patchSubs(subs, batch([subscriptions(state)]), dispatch);
      }

      if (view && !lock) defer(render, lock = true);
    }

    return state;
  };

  var dispatch = (props.middleware || function (obj) {
    return obj;
  })(function (action, props) {
    return typeof action === "function" ? dispatch(action(state, props)) : isArray(action) ? typeof action[0] === "function" || isArray(action[0]) ? dispatch(action[0], typeof action[1] === "function" ? action[1](props) : action[1]) : (batch(action.slice(1)).map(function (fx) {
      fx && fx[0](dispatch, fx[1]);
    }, setState(action[0])), state) : setState(action);
  });

  var render = function () {
    lock = false;
    node = patch(node.parentNode, node, vdom, vdom = getTextVNode(view(state)), listener);
  };

  dispatch(props.init);
};

exports.app = app;
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"index.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"Slider.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hyperapp = require("hyperapp");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Slider(_ref) {
  var state = _ref.state,
      min = _ref.min,
      max = _ref.max,
      value = _ref.value,
      step = _ref.step,
      key = _ref.key,
      onChange = _ref.onChange;

  var onDragStart = function onDragStart(state, _ref2) {
    var target = _ref2.target,
        x = _ref2.x;
    var ox = x - target.getBoundingClientRect().left + (target.getBoundingClientRect().right - target.getBoundingClientRect().left) / 2;
    var width = target.parentElement.getBoundingClientRect().right - target.parentElement.getBoundingClientRect().left;
    var dx = x - target.parentElement.getBoundingClientRect().left;
    var segmentWidth = width / (max / step - min + 1);
    var ex = (target.getBoundingClientRect().right - target.getBoundingClientRect().left) / 2;
    return _objectSpread({}, state, {
      isTracking: key,
      ex: ex,
      segmentWidth: segmentWidth,
      position: {
        sx: x,
        dx: dx,
        x: x,
        ox: ox
      }
    });
  };

  var getLeft = function getLeft() {
    if (state.isTracking === key) {
      return "".concat(state.position.dx + state.position.ox, "px");
    } else {
      return "".concat(state.segmentWidth * state.value, "px");
    }
  };

  var points = new Array(max / step - min + 1).fill(null).map(function (_, i) {
    return i * step + min;
  });
  return (0, _hyperapp.h)("div", {
    style: {
      height: '20px'
    }
  }, (0, _hyperapp.h)("div", {
    onMouseDown: onDragStart,
    style: {
      cursor: 'pointer',
      borderRadius: '50%',
      backgroundColor: 'orange',
      height: '15px',
      width: '15px',
      left: getLeft(),
      position: state.isTracking === key ? 'absolute' : 'relative'
    }
  }), (0, _hyperapp.h)("div", {
    style: {
      borderBottom: '1px solid black'
    }
  }), (0, _hyperapp.h)("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, points.map(function (point) {
    return (0, _hyperapp.h)("div", {
      style: {
        display: 'inline-block'
      }
    }, point);
  })));
}

var _default = Slider;
exports.default = _default;
},{"hyperapp":"../node_modules/hyperapp/src/index.js"}],"Main.jsx":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hyperapp = require("hyperapp");

var _Slider = _interopRequireDefault(require("./Slider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Main(_ref) {
  var state = _ref.state,
      actions = _ref.actions;

  var getValue = function getValue(key, time) {
    return state.entries[key] ? state.entries[key][time] : '';
  };

  var getNoteValue = function getNoteValue(key) {
    return state.entries[key] ? state.entries[key].note : '';
  };

  var onNoteChange = function onNoteChange(state, _ref2) {
    var key = _ref2.key,
        note = _ref2.note;

    if (!state.entries[key]) {
      state.entries[key] = {};
    }

    var updatedEntry = _objectSpread({}, state.entries[key], {
      note: note
    });

    var updatedEntries = _objectSpread({}, state.entries, _defineProperty({}, key, updatedEntry));

    var updatedState = _objectSpread({}, state, {
      entries: updatedEntries
    });

    window.localStorage.setItem('entries', JSON.stringify(updatedEntries));
    return updatedState;
  };

  var sliderChanged = function sliderChanged(state, value) {
    console.log('state', state);
    console.log('value', value);
    return state;
  };

  var renderSlider = function renderSlider(id, timeOfDay) {
    return (0, _hyperapp.h)("div", {
      className: "row mb-4"
    }, (0, _hyperapp.h)("div", {
      className: "col-md-3"
    }, (0, _hyperapp.h)("label", {
      htmlFor: "exampleFormControlSelect1"
    }, timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1))), (0, _hyperapp.h)("div", {
      className: "col-md-9"
    }, (0, _hyperapp.h)(_Slider.default, {
      key: id + timeOfDay,
      state: state,
      min: 0,
      max: 10,
      value: 0,
      step: 1,
      onChange: sliderChanged
    })));
  };

  return (0, _hyperapp.h)("div", {
    className: "mt-4"
  }, state.daysInMonth.map(function (day) {
    return (0, _hyperapp.h)("div", {
      key: day.id,
      className: "card mb-4 shadow-sm"
    }, (0, _hyperapp.h)("div", {
      className: "row"
    }, (0, _hyperapp.h)("div", {
      className: "col-md-2 date"
    }, (0, _hyperapp.h)("h6", {
      className: "mb-3"
    }, day.month), (0, _hyperapp.h)("h5", null, day.dayNumber, ' ', day.day)), (0, _hyperapp.h)("div", {
      className: "col-md-6 entry"
    }, renderSlider(day.id, 'morning'), renderSlider(day.id, 'afternoon'), renderSlider(day.id, 'night')), (0, _hyperapp.h)("div", {
      className: "col-md-4 entry"
    }, (0, _hyperapp.h)("h6", null, "Notes"), (0, _hyperapp.h)("textarea", {
      value: getNoteValue(day.id),
      onChange: [onNoteChange, function (e) {
        return {
          key: day.id,
          note: event.target.value
        };
      }]
    }))));
  }), (0, _hyperapp.h)("div", {
    className: "text-center mt-4 mb-4"
  }, (0, _hyperapp.h)("h3", null, "End of Entries...")));
}

var _default = Main;
exports.default = _default;
},{"hyperapp":"../node_modules/hyperapp/src/index.js","./Slider":"Slider.jsx"}],"../node_modules/@hyperapp/events/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.targetChecked = exports.targetValue = exports.eventKey = exports.stopPropagation = exports.preventDefault = exports.eventOptions = exports.onBlur = exports.onFocus = exports.onKeyUp = exports.onKeyDown = exports.onTouchEnd = exports.onTouchMove = exports.onTouchStart = exports.onMouseOut = exports.onMouseOver = exports.onMouseMove = exports.onMouseLeave = exports.onMouseEnter = exports.onMouseDown = exports.onMouseUp = exports.onAnimationFrame = void 0;

var throttledEvent = function (name) {};

var rawEvent = function (name) {
  return function (fx) {
    return function (action) {
      return [fx, {
        action: action
      }];
    };
  }(function (dispatch, props) {
    var listener = function (event) {
      dispatch(props.action, event);
    };

    addEventListener(name, listener);
    return function () {
      removeEventListener(name, listener);
    };
  });
}; // AnimationFrame


var onAnimationFrame = function (fx) {
  return function (action) {
    return [fx, {
      action: action
    }];
  };
}(function (dispatch, props) {
  var id = requestAnimationFrame(function frame(timestamp) {
    id = requestAnimationFrame(frame);
    dispatch(props.action, timestamp);
  });
  return function () {
    cancelAnimationFrame(id);
  };
}); // Mouse


exports.onAnimationFrame = onAnimationFrame;
var onMouseUp = rawEvent("mouseup");
exports.onMouseUp = onMouseUp;
var onMouseDown = rawEvent("mousedown");
exports.onMouseDown = onMouseDown;
var onMouseEnter = rawEvent("mouseenter");
exports.onMouseEnter = onMouseEnter;
var onMouseLeave = rawEvent("mouseleave");
exports.onMouseLeave = onMouseLeave;
var onMouseMove = rawEvent("mousemove");
exports.onMouseMove = onMouseMove;
var onMouseOver = rawEvent("mouseover");
exports.onMouseOver = onMouseOver;
var onMouseOut = rawEvent("mouseout"); // Touch

exports.onMouseOut = onMouseOut;
var onTouchStart = rawEvent("touchstart");
exports.onTouchStart = onTouchStart;
var onTouchMove = rawEvent("touchmove");
exports.onTouchMove = onTouchMove;
var onTouchEnd = rawEvent("touchend"); // Keyboard

exports.onTouchEnd = onTouchEnd;
var onKeyDown = rawEvent("keydown");
exports.onKeyDown = onKeyDown;
var onKeyUp = rawEvent("keyup"); // Window

exports.onKeyUp = onKeyUp;
var onFocus = rawEvent("focus");
exports.onFocus = onFocus;
var onBlur = rawEvent("blur"); // Event options

exports.onBlur = onBlur;

var eventOptions = function (fx) {
  return function (props) {
    return [fx, props];
  };
}(function (dispatch, props) {
  if (props.preventDefault) props.event.preventDefault();
  if (props.stopPropagation) props.event.stopPropagation();
  if (props.action != undefined) dispatch(props.action, props.event);
});

exports.eventOptions = eventOptions;

var preventDefault = function (action) {
  return function (state, event) {
    return [state, eventOptions({
      preventDefault: true,
      action: action,
      event: event
    })];
  };
};

exports.preventDefault = preventDefault;

var stopPropagation = function (action) {
  return function (state, event) {
    return [state, eventOptions({
      stopPropagation: true,
      action: action,
      event: event
    })];
  };
}; // Other


exports.stopPropagation = stopPropagation;

var eventKey = function (event) {
  return event.key;
};

exports.eventKey = eventKey;

var targetValue = function (event) {
  return event.target.value;
};

exports.targetValue = targetValue;

var targetChecked = function (event) {
  return event.target.checked;
};

exports.targetChecked = targetChecked;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _hyperapp = require("hyperapp");

require("./index.css");

var _Main = _interopRequireDefault(require("./Main"));

var _events = require("@hyperapp/events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getDaysArray = function getDaysArray() {
  var names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var date = new Date();
  var year = date.getFullYear();
  var result = [];
  var curMonth = date.getMonth();
  var totalDays = 0;

  while (date.getFullYear() === year && totalDays < 60) {
    totalDays++;
    result.push({
      id: "".concat(date.getYear(), "-").concat(date.getMonth(), "-").concat(date.getDate()),
      dayNumber: date.getDate(),
      day: names[date.getDay()],
      month: monthNames[date.getMonth()],
      year: date.getFullYear()
    });
    date.setDate(date.getDate() - 1);

    if (date.getMonth() !== curMonth) {
      curMonth = date.getMonth();
    }
  }

  return result;
};

var sx = 0;

var MouseMoved = function MouseMoved(state, _ref) {
  var x = _ref.x;
  var sx = state.position.sx;
  var ox = state.position.ox;
  var dx = x - sx;
  return _objectSpread({}, state, {
    position: {
      sx: sx,
      dx: dx,
      x: x,
      ox: ox
    }
  });
};

var MouseUp = function MouseUp(state, _ref2) {
  var x = _ref2.x;
  var ox = state.position.ox;
  var sx = state.position.sx;
  var dx = x - sx;
  var value = parseInt((dx + state.ex) / state.segmentWidth);
  return _objectSpread({}, state, {
    value: value,
    isTracking: false,
    position: {
      sx: sx,
      dx: dx,
      x: x,
      ox: ox
    }
  });
};

(0, _hyperapp.app)({
  init: {
    entries: JSON.parse(window.localStorage.getItem('entries') || '{}'),
    daysInMonth: getDaysArray(),
    isTracking: false,
    value: 0,
    segmentWidth: 0,
    position: {
      y: 0
    }
  },
  view: function view(state) {
    return (0, _hyperapp.h)("div", {
      class: "container"
    }, "".concat(state.isTracking), (0, _hyperapp.h)("div", {
      class: "row"
    }, (0, _hyperapp.h)("div", {
      class: "col-md-2"
    }), (0, _hyperapp.h)("div", {
      class: "col-md-8 pt-4"
    }, (0, _hyperapp.h)("h1", null, "Pain Tracker"), (0, _hyperapp.h)(_Main.default, {
      state: state
    })), (0, _hyperapp.h)("div", {
      class: "col-md-2"
    })));
  },
  subscriptions: function subscriptions(state) {
    return [state.isTracking && (0, _events.onMouseMove)(MouseMoved), state.isTracking && (0, _events.onMouseUp)(MouseUp)];
  },
  node: document.getElementById("root")
});
},{"hyperapp":"../node_modules/hyperapp/src/index.js","./index.css":"index.css","./Main":"Main.jsx","@hyperapp/events":"../node_modules/@hyperapp/events/src/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51129" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map