/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Router = __webpack_require__(1);

	var requireTest = __webpack_require__(2);

	function mostra_modulo(nome) {


	    Router.navigate(nome);
	    //var mod = requireTest(nome + '.js');
	    //document.getElementById('content').innerHTML = mod;

	    //    var reqfn = requireTest[nome];
	    //    reqfn(function (mod) {
	    //        document.getElementById('content').innerHTML = mod;
	    //})

	    //    require('./src/' + nome + ".js", function (mod) {
	    //        document.getElementById('content').innerHTML = mod;
	    //})
	}

	//
	//window.addEventListener('hashchange', function () {
	//    var nome = window.location.hash.substr(1);
	//    mostra_modulo('./' + nome);
	//})


	// configuration
	Router.config({
	    root: '',
	    mode: 'history'
	});

	// returning the user to the initial state
	Router.navigate();

	// adding routes
	Router
	    .add(/(.*)\/(.*)/, function (view_name, id) {
	        console.log('products', view_name);
	    })
	    .add(function () {
	        console.log('default');
	    });
	//.check('/products/12/edit/22').listen();

	// forwarding
	//Router.navigate('/about');

	window.mostra_modulo = mostra_modulo;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Router = {
	    routes: [],
	    mode: null,
	    root: '/',
	    config: function (options) {
	        this.mode = options && options.mode && options.mode == 'history' && !!(history.pushState) ? 'history' : 'hash';
	        this.root = options && options.root ? '/' + this.clearSlashes(options.root) + '/' : '/';
	        return this;
	    },
	    getFragment: function () {
	        var fragment = '';
	        if (this.mode === 'history') {
	            fragment = this.clearSlashes(decodeURI(location.pathname + location.search));
	            fragment = fragment.replace(/\?(.*)$/, '');
	            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
	        } else {
	            var match = window.location.href.match(/#(.*)$/);
	            fragment = match ? match[1] : '';
	        }
	        return this.clearSlashes(fragment);
	    },
	    clearSlashes: function (path) {
	        return path.toString().replace(/\/$/, '').replace(/^\//, '');
	    },
	    add: function (re, handler) {
	        if (typeof re == 'function') {
	            handler = re;
	            re = '';
	        }
	        this.routes.push({
	            re: re,
	            handler: handler
	        });
	        return this;
	    },
	    remove: function (param) {
	        for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
	            if (r.handler === param || r.re.toString() === param.toString()) {
	                this.routes.splice(i, 1);
	                return this;
	            }
	        }
	        return this;
	    },
	    flush: function () {
	        this.routes = [];
	        this.mode = null;
	        this.root = '/';
	        return this;
	    },
	    check: function (f) {
	        var fragment = f || this.getFragment();
	        for (var i = 0; i < this.routes.length; i++) {
	            var match = fragment.match(this.routes[i].re);
	            if (match) {
	                match.shift();
	                this.routes[i].handler.apply({}, match);
	                return this;
	            }
	        }
	        return this;
	    },
	    listen: function () {
	        var self = this;
	        var current = self.getFragment();
	        var fn = function () {
	            if (current !== self.getFragment()) {
	                current = self.getFragment();
	                self.check(current);
	            }
	        }
	        clearInterval(this.interval);
	        this.interval = setInterval(fn, 50);
	        return this;
	    },
	    navigate: function (path) {
	        path = path ? path : '';
	        if (this.mode === 'history') {
	            history.pushState(null, null, this.root + this.clearSlashes(path));
	        } else {
	            window.location.href.match(/#(.*)$/);
	            window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
	        }
	        return this;
	    }
	}

	module.exports = Router;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./d.js": 3,
		"./e.js": 4,
		"./qq.js": 5,
		"./router.js": 1,
		"./x.js": 7,
		"./y.js": 8
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 2;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var e = __webpack_require__(4);
	module.exports = 'D' + e;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = 'E';


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {module.export = 'NAO PODE';
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)(module)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = 'X';

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = 'Y';

/***/ }
/******/ ]);
//# sourceMappingURL=main.bundle.js.map
