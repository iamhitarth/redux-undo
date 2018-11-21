(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ReduxUndo"] = factory();
	else
		root["ReduxUndo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var ActionTypes = exports.ActionTypes = {
  UNDO: '@@redux-undo/UNDO',
  REDO: '@@redux-undo/REDO',
  JUMP_TO_FUTURE: '@@redux-undo/JUMP_TO_FUTURE',
  JUMP_TO_PAST: '@@redux-undo/JUMP_TO_PAST',
  JUMP: '@@redux-undo/JUMP',
  CLEAR_HISTORY: '@@redux-undo/CLEAR_HISTORY'
};

var ActionCreators = exports.ActionCreators = {
  undo: function undo() {
    return { type: ActionTypes.UNDO };
  },
  redo: function redo() {
    return { type: ActionTypes.REDO };
  },
  jumpToFuture: function jumpToFuture(index) {
    return { type: ActionTypes.JUMP_TO_FUTURE, index: index };
  },
  jumpToPast: function jumpToPast(index) {
    return { type: ActionTypes.JUMP_TO_PAST, index: index };
  },
  jump: function jump(index) {
    return { type: ActionTypes.JUMP, index: index };
  },
  clearHistory: function clearHistory() {
    return { type: ActionTypes.CLEAR_HISTORY };
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseActions = parseActions;
exports.isHistory = isHistory;
exports.distinctState = distinctState;
exports.includeAction = includeAction;
exports.excludeAction = excludeAction;
exports.combineFilters = combineFilters;
exports.groupByActionTypes = groupByActionTypes;
exports.newHistory = newHistory;
// parseActions helper: takes a string (or array)
//                      and makes it an array if it isn't yet
function parseActions(rawActions) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (Array.isArray(rawActions)) {
    return rawActions;
  } else if (typeof rawActions === 'string') {
    return [rawActions];
  }
  return defaultValue;
}

// isHistory helper: check for a valid history object
function isHistory(history) {
  return typeof history.present !== 'undefined' && typeof history.future !== 'undefined' && typeof history.past !== 'undefined' && Array.isArray(history.future) && Array.isArray(history.past);
}

// distinctState helper: deprecated, does nothing in latest beta
/* istanbul ignore next */
function distinctState() {
  console.warn('distinctState is deprecated in beta4 and newer. ' + 'The distinctState behavior is now default, which means only ' + 'actions resulting in a new state are recorded. ' + 'See https://github.com/omnidan/redux-undo#filtering-actions ' + 'for more details.');
  return function () {
    return true;
  };
}

// includeAction helper: whitelist actions to be added to the history
function includeAction(rawActions) {
  var actions = parseActions(rawActions);
  return function (action) {
    return actions.indexOf(action.type) >= 0;
  };
}

// excludeAction helper: blacklist actions from being added to the history
function excludeAction(rawActions) {
  var actions = parseActions(rawActions);
  return function (action) {
    return actions.indexOf(action.type) < 0;
  };
}

// combineFilters helper: combine multiple filters to one
function combineFilters() {
  for (var _len = arguments.length, filters = Array(_len), _key = 0; _key < _len; _key++) {
    filters[_key] = arguments[_key];
  }

  return filters.reduce(function (prev, curr) {
    return function (action, currentState, previousHistory) {
      return prev(action, currentState, previousHistory) && curr(action, currentState, previousHistory);
    };
  }, function () {
    return true;
  });
}

function groupByActionTypes(rawActions) {
  var actions = parseActions(rawActions);
  return function (action) {
    return actions.indexOf(action.type) >= 0 ? action.type : null;
  };
}

function newHistory(past, present, future) {
  var group = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  return {
    past: past,
    present: present,
    future: future,
    group: group,
    _latestUnfiltered: present,
    index: past.length,
    limit: past.length + future.length + 1
  };
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _actions = __webpack_require__(0);

Object.defineProperty(exports, 'ActionTypes', {
  enumerable: true,
  get: function get() {
    return _actions.ActionTypes;
  }
});
Object.defineProperty(exports, 'ActionCreators', {
  enumerable: true,
  get: function get() {
    return _actions.ActionCreators;
  }
});

var _helpers = __webpack_require__(1);

Object.defineProperty(exports, 'parseActions', {
  enumerable: true,
  get: function get() {
    return _helpers.parseActions;
  }
});
Object.defineProperty(exports, 'isHistory', {
  enumerable: true,
  get: function get() {
    return _helpers.isHistory;
  }
});
Object.defineProperty(exports, 'distinctState', {
  enumerable: true,
  get: function get() {
    return _helpers.distinctState;
  }
});
Object.defineProperty(exports, 'includeAction', {
  enumerable: true,
  get: function get() {
    return _helpers.includeAction;
  }
});
Object.defineProperty(exports, 'excludeAction', {
  enumerable: true,
  get: function get() {
    return _helpers.excludeAction;
  }
});
Object.defineProperty(exports, 'combineFilters', {
  enumerable: true,
  get: function get() {
    return _helpers.combineFilters;
  }
});
Object.defineProperty(exports, 'groupByActionTypes', {
  enumerable: true,
  get: function get() {
    return _helpers.groupByActionTypes;
  }
});
Object.defineProperty(exports, 'newHistory', {
  enumerable: true,
  get: function get() {
    return _helpers.newHistory;
  }
});

var _reducer = __webpack_require__(4);

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_reducer).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var __DEBUG__ = void 0;
var displayBuffer = void 0;

var colors = {
  prevState: '#9E9E9E',
  action: '#03A9F4',
  nextState: '#4CAF50'

  /* istanbul ignore next: debug messaging is not tested */
};function initBuffer() {
  displayBuffer = {
    header: [],
    prev: [],
    action: [],
    next: [],
    msgs: []
  };
}

/* istanbul ignore next: debug messaging is not tested */
function printBuffer() {
  var _displayBuffer = displayBuffer,
      header = _displayBuffer.header,
      prev = _displayBuffer.prev,
      next = _displayBuffer.next,
      action = _displayBuffer.action,
      msgs = _displayBuffer.msgs;

  if (console.group) {
    var _console, _console2, _console3, _console4, _console5;

    (_console = console).groupCollapsed.apply(_console, _toConsumableArray(header));
    (_console2 = console).log.apply(_console2, _toConsumableArray(prev));
    (_console3 = console).log.apply(_console3, _toConsumableArray(action));
    (_console4 = console).log.apply(_console4, _toConsumableArray(next));
    (_console5 = console).log.apply(_console5, _toConsumableArray(msgs));
    console.groupEnd();
  } else {
    var _console6, _console7, _console8, _console9, _console10;

    (_console6 = console).log.apply(_console6, _toConsumableArray(header));
    (_console7 = console).log.apply(_console7, _toConsumableArray(prev));
    (_console8 = console).log.apply(_console8, _toConsumableArray(action));
    (_console9 = console).log.apply(_console9, _toConsumableArray(next));
    (_console10 = console).log.apply(_console10, _toConsumableArray(msgs));
  }
}

/* istanbul ignore next: debug messaging is not tested */
function colorFormat(text, color, obj) {
  return ['%c' + text, 'color: ' + color + '; font-weight: bold', obj];
}

/* istanbul ignore next: debug messaging is not tested */
function start(action, state) {
  initBuffer();
  if (__DEBUG__) {
    if (console.group) {
      displayBuffer.header = ['%credux-undo', 'font-style: italic', 'action', action.type];
      displayBuffer.action = colorFormat('action', colors.action, action);
      displayBuffer.prev = colorFormat('prev history', colors.prevState, state);
    } else {
      displayBuffer.header = ['redux-undo action', action.type];
      displayBuffer.action = ['action', action];
      displayBuffer.prev = ['prev history', state];
    }
  }
}

/* istanbul ignore next: debug messaging is not tested */
function end(nextState) {
  if (__DEBUG__) {
    if (console.group) {
      displayBuffer.next = colorFormat('next history', colors.nextState, nextState);
    } else {
      displayBuffer.next = ['next history', nextState];
    }
    printBuffer();
  }
}

/* istanbul ignore next: debug messaging is not tested */
function log() {
  if (__DEBUG__) {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    displayBuffer.msgs = displayBuffer.msgs.concat([].concat(args, ['\n']));
  }
}

/* istanbul ignore next: debug messaging is not tested */
function set(debug) {
  __DEBUG__ = debug;
}

exports.set = set;
exports.start = start;
exports.end = end;
exports.log = log;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = undoable;

var _debug = __webpack_require__(3);

var debug = _interopRequireWildcard(_debug);

var _actions = __webpack_require__(0);

var _helpers = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// createHistory
function createHistory(state, ignoreInitialState) {
  // ignoreInitialState essentially prevents the user from undoing to the
  // beginning, in the case that the undoable reducer handles initialization
  // in a way that can't be redone simply
  var history = (0, _helpers.newHistory)([], state, []);
  if (ignoreInitialState) {
    history._latestUnfiltered = null;
  }
  return history;
}

// lengthWithoutFuture: get length of history
function lengthWithoutFuture(history) {
  return history.past.length + 1;
}

// insert: insert `state` into history, which means adding the current state
//         into `past`, setting the new `state` as `present` and erasing
//         the `future`.
function insert(history, state, limit, group) {
  debug.log('inserting', state);
  debug.log('new free: ', limit - lengthWithoutFuture(history));

  var past = history.past,
      _latestUnfiltered = history._latestUnfiltered;

  var historyOverflow = limit && lengthWithoutFuture(history) >= limit;

  var pastSliced = past.slice(historyOverflow ? 1 : 0);
  var newPast = _latestUnfiltered != null ? [].concat(_toConsumableArray(pastSliced), [_latestUnfiltered]) : pastSliced;

  return (0, _helpers.newHistory)(newPast, state, [], group);
}

// jumpToFuture: jump to requested index in future history
function jumpToFuture(history, index) {
  if (index < 0 || index >= history.future.length) return history;

  var past = history.past,
      future = history.future,
      _latestUnfiltered = history._latestUnfiltered;


  var newPast = [].concat(_toConsumableArray(past), [_latestUnfiltered], _toConsumableArray(future.slice(0, index)));
  var newPresent = future[index];
  var newFuture = future.slice(index + 1);

  return (0, _helpers.newHistory)(newPast, newPresent, newFuture);
}

// jumpToPast: jump to requested index in past history
function jumpToPast(history, index) {
  if (index < 0 || index >= history.past.length) return history;

  var past = history.past,
      future = history.future,
      _latestUnfiltered = history._latestUnfiltered;


  var newPast = past.slice(0, index);
  var newFuture = [].concat(_toConsumableArray(past.slice(index + 1)), [_latestUnfiltered], _toConsumableArray(future));
  var newPresent = past[index];

  return (0, _helpers.newHistory)(newPast, newPresent, newFuture);
}

// jump: jump n steps in the past or forward
function jump(history, n) {
  if (n > 0) return jumpToFuture(history, n - 1);
  if (n < 0) return jumpToPast(history, history.past.length + n);
  return history;
}

// helper to dynamically match in the reducer's switch-case
function actionTypeAmongClearHistoryType(actionType, clearHistoryType) {
  return clearHistoryType.indexOf(actionType) > -1 ? actionType : !actionType;
}

// redux-undo higher order reducer
function undoable(reducer) {
  var rawConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  debug.set(rawConfig.debug);

  var config = {
    initTypes: (0, _helpers.parseActions)(rawConfig.initTypes, ['@@redux-undo/INIT']),
    limit: rawConfig.limit,
    filter: rawConfig.filter || function () {
      return true;
    },
    groupBy: rawConfig.groupBy || function () {
      return null;
    },
    undoType: rawConfig.undoType || _actions.ActionTypes.UNDO,
    redoType: rawConfig.redoType || _actions.ActionTypes.REDO,
    jumpToPastType: rawConfig.jumpToPastType || _actions.ActionTypes.JUMP_TO_PAST,
    jumpToFutureType: rawConfig.jumpToFutureType || _actions.ActionTypes.JUMP_TO_FUTURE,
    jumpType: rawConfig.jumpType || _actions.ActionTypes.JUMP,
    clearHistoryType: Array.isArray(rawConfig.clearHistoryType) ? rawConfig.clearHistoryType : [rawConfig.clearHistoryType || _actions.ActionTypes.CLEAR_HISTORY],
    neverSkipReducer: rawConfig.neverSkipReducer || false,
    ignoreInitialState: rawConfig.ignoreInitialState || false,
    syncFilter: rawConfig.syncFilter || false
  };

  var initialState = config.history;
  return function () {
    for (var _len = arguments.length, slices = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      slices[_key - 2] = arguments[_key];
    }

    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    debug.start(action, state);

    var history = state;
    if (!initialState) {
      debug.log('history is uninitialized');

      if (state === undefined) {
        var clearHistoryAction = { type: _actions.ActionTypes.CLEAR_HISTORY };
        var start = reducer.apply(undefined, [state, clearHistoryAction].concat(slices));

        history = createHistory(start, config.ignoreInitialState);

        debug.log('do not set initialState on probe actions');
      } else if ((0, _helpers.isHistory)(state)) {
        history = initialState = config.ignoreInitialState ? state : (0, _helpers.newHistory)(state.past, state.present, state.future);
        debug.log('initialHistory initialized: initialState is a history', initialState);
      } else {
        history = initialState = createHistory(state, config.ignoreInitialState);
        debug.log('initialHistory initialized: initialState is not a history', initialState);
      }
    }

    var skipReducer = function skipReducer(res) {
      return config.neverSkipReducer ? _extends({}, res, {
        present: reducer.apply(undefined, [res.present, action].concat(slices))
      }) : res;
    };

    var res = void 0;
    switch (action.type) {
      case undefined:
        return history;

      case config.undoType:
        res = jump(history, -1);
        debug.log('perform undo');
        debug.end(res);
        return skipReducer(res);

      case config.redoType:
        res = jump(history, 1);
        debug.log('perform redo');
        debug.end(res);
        return skipReducer(res);

      case config.jumpToPastType:
        res = jumpToPast(history, action.index);
        debug.log('perform jumpToPast to ' + action.index);
        debug.end(res);
        return skipReducer(res);

      case config.jumpToFutureType:
        res = jumpToFuture(history, action.index);
        debug.log('perform jumpToFuture to ' + action.index);
        debug.end(res);
        return skipReducer(res);

      case config.jumpType:
        res = jump(history, action.index);
        debug.log('perform jump to ' + action.index);
        debug.end(res);
        return skipReducer(res);

      case actionTypeAmongClearHistoryType(action.type, config.clearHistoryType):
        res = createHistory(history.present, config.ignoreInitialState);
        debug.log('perform clearHistory');
        debug.end(res);
        return skipReducer(res);

      default:
        res = reducer.apply(undefined, [history.present, action].concat(slices));

        if (config.initTypes.some(function (actionType) {
          return actionType === action.type;
        })) {
          debug.log('reset history due to init action');
          debug.end(initialState);
          return initialState;
        }

        if (history._latestUnfiltered === res) {
          // Don't handle this action. Do not call debug.end here,
          // because this action should not produce side effects to the console
          return history;
        }

        var filtered = typeof config.filter === 'function' && !config.filter(action, res, history);

        if (filtered) {
          // if filtering an action, merely update the present
          var filteredState = (0, _helpers.newHistory)(history.past, res, history.future, history.group);
          if (!config.syncFilter) {
            filteredState._latestUnfiltered = history._latestUnfiltered;
          }
          debug.log('filter ignored action, not storing it in past');
          debug.end(filteredState);
          return filteredState;
        }

        var group = config.groupBy(action, res, history);
        if (group != null && group === history.group) {
          // if grouping with the previous action, only update the present
          var groupedState = (0, _helpers.newHistory)(history.past, res, history.future, history.group);
          debug.log('groupBy grouped the action with the previous action');
          debug.end(groupedState);
          return groupedState;
        }

        // If the action wasn't filtered or grouped, insert normally
        history = insert(history, res, config.limit, group);

        debug.log('inserted new state into history');
        debug.end(history);
        return history;
    }
  };
}
module.exports = exports['default'];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ })
/******/ ]);
});