/**
 * 
 * Find more about the micro-framework at
 * http://cubiq.org/
 *
 * Copyright (c) 2010 Matteo Spinelli, http://cubiq.org/
 * Released under MIT license
 * http://cubiq.org/dropbox/mit-license.txt
 * 
 */

(function() { // Define the core element
	var $ = function(query) {
		return new customNL(query);
	},
		// Custom Node List
		customNL = function(query) {
			if (query.nodeType) { // query is already a Node
				query = [query];
			} else if (typeof query == 'string') { // query is a string
				query = document.querySelectorAll(query);
			} else if (!(query instanceof Array)) { // if none of the above, query must be an array
				return null;
			}
			this.length = query.length;
			for (var i = 0; i < this.length; i++) {
				this[i] = query[i];
			}
			return this;
		},
	
		// Holds all functions to be executed on DOM ready
		readyFn = [],
	
		// Executed on DOMContentLoaded
		DOMReady = function() {
			for (var i = 0, l = readyFn.length; i < l; i++) {
				readyFn[i]();
			}
			readyFn = null;
			document.removeEventListener('DOMContentLoaded', DOMReady, false);
			
		}; // Merge to objects
	
	$.extend = function(obj, target) {
		target = target || customNL.prototype; // To help plugin development
		for (var prop in obj) {
			target[prop] = obj[prop];
		}
	}; // Add feature to the $ class
	
	$.extend({
		hasTouch: ('ontouchstart' in window),
		isIpad: (/ipad/gi).test(navigator.appVersion),
		isIphone: (/iphone/gi).test(navigator.appVersion),
		isAndroid: (/android/gi).test(navigator.appVersion),
		isOrientationAware: ('onorientationchange' in window),
		isHashChangeAware: ('onhashchange' in window),
		isStandalone: window.navigator.standalone,
		has3d: ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix()),
		// Execute functions on DOM ready
		ready: function(fn) {
			if (readyFn.length == 0) {
				document.addEventListener('DOMContentLoaded', DOMReady, false);
			}
			readyFn.push(fn);
		},
		hasClass: function(el, className) {
			return new RegExp('(^|\\s)' + className + '(\\s|$)').test(el.className);
		},
	}, $);
	
	 // Custom NodeList prototypes
	customNL.prototype = {
		each: function(callback) {
			for (var i = 0; i < this.length; i++) {
				callback.call(this[i]);
			}
			return this;
		},
		bind: function(type, fn, capture) {
			return this.each(function() {
				this.addEventListener(type, fn, capture ? true : false);
			});
		},
		unbind: function(type, fn, capture) {
			return this.each(function() {
				this.removeEventListener(type, fn, capture ? true : false);
			});
		},
		// Returns the first element className
		hasClass: function(className) {
			return $.hasClass(this[0], className);
		},
		// Add one or more classes to all elements
		addClass: function() {
			var className = arguments;
			for (var i = 0, l = className.length; i < l; i++) {
				this.each(function() {
					if (!$.hasClass(this, className[i])) {
						this.className = this.className ? this.className + ' ' + className[i] : className[i];
					}
				});
			}
			return this;
		},
		
		// Remove one or more classes from all elements
		removeClass: function() {
			var className = arguments;
			for (var i = 0, l = className.length; i < l; i++) {
				this.each(function() {
					this.className = this.className.replace(new RegExp('(^|\\s+)' + className[i] + '(\\s+|$)'), ' ');
				});
			}
			return this;
		}
	} // Expose $ to the world
	window.$ = $;
})();


/*-------------Boiler Plate Stuff---------------------*/

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function( /* function */ callback, /* DOMElement */ element) {
		return window.setTimeout(callback, 1000 / 60);
	};
})();

window.log = function() {
	log.history = log.history || [];
	log.history.push(arguments);
	arguments.callee = arguments.callee.caller;
	if (this.console) console.log(Array.prototype.slice.call(arguments));
};

(function(b) {
	function c() {}
	for (var d = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), a; a = d.pop();) b[a] = b[a] || c
})(window.console = window.console || {});






/*-------------Helper Methods---------------------*/

function findPos(obj) {
	var curleft = curtop = 0;
	var offset = new Object();
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		offset.X = curleft;
		offset.Y = curtop;
		return offset;
	}
}

function BlockMove(event) {
	event.preventDefault();
}

function set2dTranslate(ele, x, y) {
	var v = "translate(" + x + "," + y + ")";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
	ele.style.msTransform = v;
	ele.style.MozTransform = v;
}

function set3dTranslate(ele, x, y) {
	var v = "translate3d(" + x + "," + y + ", 0px)";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
}

function set2dRotate(ele, degrees) {
	var v = "rotate(" + degrees + "deg)";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
	ele.style.msTransform = v;
	ele.style.MozTransform = v;
}

function set3dRotate(ele, degrees) {
	var v = "rotate3d(0,0,0," + degrees + "deg)";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
}

function set3dScale(ele, sx, sy) {
	var v = "scale3d(" + sx + "," + sy + "0)";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
	ele.style.msTransform = v;
	ele.style.MozTransform = v;
}

function set2dScale(ele, sx, sy) {
	var v = "scale(" + sx + "," + sy + ")";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
	ele.style.msTransform = v;
	ele.style.MozTransform = v;
}

function set2dScaleTranslate(ele, x, y, sx, sy) {
	var v = "scale(" + sx + "," + sy + ") translate(" + x + "," + y + ")";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
	ele.style.msTransform = v;
	ele.style.MozTransform = v;
}

function set3dScaleTranslate(ele, x, y, sx, sy) {
	var v = "scale3d(" + sx + "," + sy + "0) translate(" + x + "," + y + "0)";
	ele.style.transform = v;
	ele.style.WebkitTransform = v;
	ele.style.msTransform = v;
	ele.style.MozTransform = v;
}
