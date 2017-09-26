/*
	SkyJS Rama Version

	Copyright (c) 2010 Seo, Jaehan <daddyofsky@gmail.com>

	Referred to
		ui javascript framework - gony <gonom9@gmail.com>
		Prototype javascript framework - Sam Stephenson <sam@conio.net>
		Swaf javascript framework - reizes <reizes@nate.com>
		jQuery javascript framework - John Resig (jquery.com)
*/

// Class //////////////////////////////////////////////////////////////////////

	var Class = function() {
		var obj = function() {
			if (this.init) this.init.apply(this, arguments);
		}
		if (arguments[0]) Class.extend(obj.prototype, arguments[0]);
		return obj;
	}

	Class.extend = function(obj) {
		for(var i=1; i<arguments.length; i++) {
			if (arguments[i]) {
				for (var x in arguments[i]) {
					obj[x] = arguments[i][x];
				}
			}
		}
		return obj;
	}

// Extend Function ////////////////////////////////////////////////////////////

	Class.extend(Function.prototype, {
		bind : function(obj) {
			var func = this;
			var arg = $a(arguments); arg.shift();
			return function() {
				return func.apply(obj, arg.concat($a(arguments)));
			}
		},
		bindForEvent : function(obj) {
			var func = this;
			return function(evt, el) {
				return func.call(obj, evt, el);
			}
		}
	});

// Extend Array ///////////////////////////////////////////////////////////////

	Class.extend(Array.prototype, {
		exists : function(value) {
			for (var i=0; i<this.length; i++) {
				if (this[i] == value) return true;
			}
			return false;
		},
		search : function(value) {
			for (var i=0; i<this.length; i++) {
				if (this[i] == value) return i;
			}
			return -1;
		},
		copy : function(obj) {
			if (typeof obj == 'undefined') obj = this;
			if (typeof obj == 'string' || typeof obj.length == 'undefined') obj = [obj];
			var ret = [];
			for (var i=0; i<obj.length; i++) {
				ret.push(obj[i]);
			}
			return ret;
		},
		filter : function(func, applyResult) {
			var ret = [];
			if (typeof func == 'boolean') {
				for (var i=0; i<this.length; i++) {
					if (!this[i] == !func) ret.push(this[i]);
				}
			} else if (typeof func == 'function') {
				if (applyResult) {
					for (var i=0; i<this.length; i++) {
						var result = func(this[i], i);
						if (result !== false) ret.push(result);
					}
				} else {
					for (var i=0; i<this.length; i++) {
						if (func(this[i], i)) ret.push(this[i]);
					}
				}
			} else {
				ret = this;
			}
			return ret;
		},
		each : function(func) {
			if (typeof func == 'function') {
				for (var i=0; i<this.length; i++) {
					this[i] = func(this[i], i);
				}
			} else {
				for (var i=0; i<this.length; i++) {
					this[i] = func;
				}
			}
			return this;
		},
		merge : function(obj) {
			for (var i=0; i<obj.length; i++) {
				if (!this.exists(obj[i])) {
					this.push(obj[i]);
				}
			}
			return this;
		},
		intersect : function(obj) {
			var ret = [];
			for (var i=0; i<obj.length; i++) {
				if (this.exists(obj[i])) {
					ret.push(obj[i]);
				}
			}
			return ret;
		},
		diff : function(obj) {
			var ret = [];
			for (var i=0; i<obj.length; i++) {
				if (!this.exists(obj[i])) {
					ret.push(obj[i]);
				}
			}
			return ret;
		}
	});
	Array.prototype.has = Array.prototype.exists;

// Extend String //////////////////////////////////////////////////////////////

	Class.extend(String.prototype, {
		trim : function() {
			return this.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		stripTags : function() {
			return this.replace(/<\/?[^>]+>/gi, '');
		},
		validHTML : function() {
			var div = document.createElement('div');
			div.innerHTML = this;
			return div.innerHTML;
		},
		escapeHTML: function() {
			var div = document.createElement('div');
			var text = document.createTextNode(this);
			div.appendChild(text);
			return div.innerHTML;
		},
		unescapeHTML: function() {
			var div = document.createElement('div');
			div.innerHTML = this.stripTags();
			return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
		},
		decodeQuery : function(isUrl) {
			if (isUrl) {
				var tmp = this.substring(this.indexOf('?')+1).match(/^\??(.*)$/)[1].split('&');
			} else {
				var tmp = this.match(/^\??(.*)$/)[1].split('&');
			}
			var ret = {};
			for (var i=0; i<tmp.length; i++) {
				var pair = tmp[i].split('=');
				if (pair[0]) ret[pair[0]] = pair[1];
			}
			return ret;
		},
		encodeQuery : function(param, base) {
			var tmp = [];
			for (var x in param) {
				var key = base ? base+'['+x+']' : x;
				if (typeof param[x] == 'function') {
					continue;
				} else if (typeof param[x] == 'string' || typeof param[x] == 'number') {
					tmp.push(key+'='+param[x]);
				} else {
					tmp.push(this.encodeQuery(param[x], key));
				}
			}
			return tmp.join('&');
		},
		// Copyright (c) 2007-2013 Alexandru Marasteanu <hello at alexei dot ro> | 3 clause BSD license
		// https://github.com/alexei/sprintf.js
        sprintf : function() {
			this.format = function(parse_tree, argv) {
				var cursor = 0, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
				for (i = 0; i < tree_length; i++) {
					node_type = this.get_type(parse_tree[i]);
					if (node_type === 'string') {
						output.push(parse_tree[i]);
					}
					else if (node_type === 'array') {
						match = parse_tree[i]; // convenience purposes only
						if (match[2]) { // keyword argument
							arg = argv[cursor];
							for (k = 0; k < match[2].length; k++) {
								if (!arg.hasOwnProperty(match[2][k])) {
									throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
								}
								arg = arg[match[2][k]];
							}
						}
						else if (match[1]) { // positional argument (explicit)
							arg = argv[match[1]];
						}
						else { // positional argument (implicit)
							arg = argv[cursor++];
						}

						if (/[^s]/.test(match[8]) && (this.get_type(arg) != 'number')) {
							throw(sprintf('[sprintf] expecting number but found %s', this.get_type(arg)));
						}
						switch (match[8]) {
							case 'b': arg = arg.toString(2); break;
							case 'c': arg = String.fromCharCode(arg); break;
							case 'd': arg = parseInt(arg, 10); break;
							case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
							case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
							case 'o': arg = arg.toString(8); break;
							case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
							case 'u': arg = arg >>> 0; break;
							case 'x': arg = arg.toString(16); break;
							case 'X': arg = arg.toString(16).toUpperCase(); break;
						}
						arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
						pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
						pad_length = match[6] - String(arg).length;
						pad = match[6] ? this.str_repeat(pad_character, pad_length) : '';
						output.push(match[5] ? arg + pad : pad + arg);
					}
				}
				return output.join('');
			};
			this.cache = null;
			this.parse = function(fmt) {
				var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
				while (_fmt) {
					if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
						parse_tree.push(match[0]);
					}
					else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
						parse_tree.push('%');
					}
					else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
						if (match[2]) {
							arg_names |= 1;
							var field_list = [], replacement_field = match[2], field_match = [];
							if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
								field_list.push(field_match[1]);
								while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
									if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
										field_list.push(field_match[1]);
									}
									else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
										field_list.push(field_match[1]);
									}
									else {
										throw('[sprintf] huh?');
									}
								}
							}
							else {
								throw('[sprintf] huh?');
							}
							match[2] = field_list;
						}
						else {
							arg_names |= 2;
						}
						if (arg_names === 3) {
							throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
						}
						parse_tree.push(match);
					}
					else {
						throw('[sprintf] huh?');
					}
					_fmt = _fmt.substring(match[0].length);
				}
				return parse_tree;
			};

			this.get_type = function(variable) {
				return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
			}
			this.str_repeat = function(input, multiplier) {
				for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
				return output.join('');
			}

			if (!this.cache) {
				this.cache = this.parse(this.valueOf());
			}
			return this.format(this.cache, arguments);
        }
	});
	String.prototype.parseQuery = String.prototype.decodeQuery;

// Event //////////////////////////////////////////////////////////////////////

	var Event = {
		__funcId : 0,
		bind : function(func, obj) {
			if (typeof obj.__evtFunc == 'undefined') {
				obj.__evtFunc = {};
			}
			if (!func.__funcId) {
				func.__funcId = this.__funcId++;
			}
			if (typeof obj.__evtFunc[func.__funcId] != 'function') {
				obj.__evtFunc[func.__funcId] = function(evt) {
					func(evt, obj);
				}
			}
			return obj.__evtFunc[func.__funcId];
		},
		addListener : function(obj, handler, func) {
			if (!(obj instanceof Array)) obj = [obj];
			for (var i=0; i<obj.length; i++) {
				var el = $id(obj[i]);
				if (el) {
					var evtFunc = Event.bind(func, el);
					if (el.addEventListener) {
						el.addEventListener(handler, evtFunc, false);
					} else if(el.attachEvent) {
						el.attachEvent('on'+handler, evtFunc);
					}
				} else {
					Debug.error(el);
				}
			}
		},
		delListener : function(obj, handler, func) {
			if (!(obj instanceof Array)) obj = [obj];
			for (var i=0; i<obj.length; i++) {
				var el = $id(obj[i]);
				if (el) {
					var evtFunc = Event.bind(func, el);
					if (el.removeEventListener) {
						el.removeEventListener(handler, evtFunc, false);
					} else if(el.detachEvent) {
						el.detachEvent('on'+handler, evtFunc);
					}
				} else {
					Debug.error(el);
				}
			}
		},
		stop : function(evt) {
			var e = evt || window.event;
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			} else {
				e.returnValue = false;
				e.cancelBubble = true;
			}
		},
		element : function(evt) {
			var e = evt || window.event;
			return e.currentTarget || e.target || e.srcElement;
		},
		getPosition : function(evt, from) {
			var e = evt || window.event;
			var b = document.body;
			var scroll = Util.getScrollOffset();
			var pos = {
				x : e.pageX || e.clientX+scroll.x-b.clientLeft,
				y : e.pageY || e.clientY+scroll.y-b.clientTop
			}
			if (from) {
				var p = Element.getPosition(from);
				pos.x -= p.x;
				pos.y -= p.y;
			}
			return pos;
		},
		extend : function(evt) {
			if (typeof evt.initEvent != 'function' && typeof evt.keyCode != 'number') return false;
			if (typeof evt.extended != 'undefined') return evt;
			var e = evt || window.event;
			var b = document.body;
			Class.extend(e, {
				extended : true,
				element  : Element.extend(e.currentTarget || e.target || e.srcElement),
				mouse    : {
					isLeft   : (e.which && e.button==0) || (e.button&1 != 0),
					isMiddle : (e.which && e.button==1) || (e.button&4 != 0),
					isRight  : (e.which && e.button==2) || (e.button&2 != 0)
				},
				key      : {
					isAlt   : e.altKey,
					isCtrl  : e.ctrlKey,
					isShift : e.shiftKey,
					isUp    : [38,104].exists(e.keyCode),
					isDown  : [40,98].exists(e.keyCode),
					isLeft  : [37,100].exists(e.keyCode),
					isRight : [39,102].exists(e.keyCode),
					isEnter : (e.keyCode==13),
					isTab : (e.keyCode==9),
					isEsc : (e.keyCode==27)
				},
				stop     : function() {
					if (this.preventDefault) {
						this.preventDefault();
						this.stopPropagation();
					} else {
						this.returnValue = false;
						this.cancelBubble = true;
					}
				}
			});

			// Opera safe
			if (typeof e.x == 'undefined') {
				Class.extend(e, {
					x : e.pageX || e.clientX+b.scrollLeft-b.clientLeft,
					y : e.pageY || e.clientY+b.scrollTop-b.clientTop
				});
			}
			return e;
		}
	}
	Event.pos = Event.getPosition;

	// Element ////////////////////////////////////////////////////////////////////
	var ramaElement = {
		show : function(obj, display) {
			if (display != 'block' && display != 'inline') display = '';
			$id(obj).style.display = display;
			if (obj.blocker) this.updateBlocker(obj);
		},
		hide : function(obj) {
			$id(obj).style.display = 'none';
			if (obj.blocker) this.updateBlocker(obj);
		},
		toggle : function(obj, display) {
			this.visible(obj) ? this.hide(obj) : this.show(obj, display);
		},
		visible : function(obj) {
			return ($id(obj).style.display != 'none');
		},
		getPosition : function(obj, from) {
			obj = $id(obj);
			var x = obj.offsetLeft;
			var y = obj.offsetTop;
			var p = obj.offsetParent;
			while (p && p != document.body) {
				x += p.offsetLeft;
				y += p.offsetTop;
				p = p.offsetParent;
			}
			var pos = { x:x, y:y };
			if (from) {
				var p = Element.getPosition(from);
				pos.x -= p.x;
				pos.y -= p.y;
			}
			return pos;
		},
		getCenter : function(obj, x, y) {
			var objPos = this.getPosition(obj);
			var objSize = this.getSize(obj);
			var docSize = Util.getClientSize();
			var docScroll = Util.getScrollOffset();
			var x = (typeof x == 'number') ? x : (x === false ? objPos.x : docScroll.x+(Math.abs(docSize.width-objSize.width))/2);
			var y = (typeof y == 'number') ? y : (y === false ? objPos.y : docScroll.y+(Math.abs(docSize.height-objSize.height))/2);
			return { x:x, y:y };
		},
		setPosition : function(obj, posX, posY) {
			obj = $id(obj);
			if (!obj.style.position) obj.style.position = 'absolute';
			if (arguments.length == 2) {
				obj.style.left = (typeof arguments[1].x == 'number') ? arguments[1].x + 'px' : arguments[1].x;
				obj.style.top = (typeof arguments[1].y == 'number') ? arguments[1].y + 'px' : arguments[1].y;
			} else {
				obj.style.left = (typeof posX == 'number') ? posX+'px' : posX;
				obj.style.top = (typeof posY == 'number') ? posY+'px' : posY;
			}
			if (obj.blocker) this.updateBlocker(obj);
		},
		moveBy : function(obj, x, y) {
			obj = $id(obj);
			obj.style.left = (parseInt(obj.style.left, 10) + x) + 'px';
			obj.style.top = (parseInt(obj.style.top, 10) + y) + 'px';
			if (obj.blocker) this.updateBlocker(obj);
		},
		getSize : function(obj) {

			var w = 0;
			var h = 0;

			obj = $id(obj);		

			if(obj) {
				w = obj.offsetWidth || obj.scrollWidth;
				h = obj.offsetHeight || obj.scrollHeight;
			}

			return { width:w, height:h };
		},
		setSize : function(obj, width, height) {
			obj = $id(obj);
			if (arguments.length == 2) {
				obj.style.width = (typeof arguments[1].width == 'number') ? arguments[1].width + 'px' : arguments[1].width;
				obj.style.height = (typeof arguments[1].height == 'number') ? arguments[1].height + 'px' : arguments[1].height;
			} else {
				width = parseInt(width, 10) || 'auto';
				height = parseInt(height, 10) || 'auto';
				obj.style.width = (typeof width == 'number') ? width + 'px' : width;
				obj.style.height = (typeof height == 'number') ? height + 'px' : height;
			}
			if (obj.blocker) this.updateBlocker(obj);
		},
		getStyle : function(obj, name) {
			obj = $id(obj);
			if (name == 'opacity' && Util.isIE) {
				var filter = obj.style['filter'];
				if (filter) {
					var match = filter.match(/opacity=([0-9]+)/);
					if (match) {
						return '' + (match[1] / 100);
					}
				}
				return '1';
			} else {
				var value = obj.style[name];
				if (value == '') {
					if (obj.currentStyle) {
						value = obj.currentStyle[name];
					} else if (window.getComputedStyle) {
						value = window.getComputedStyle(obj, null).getPropertyValue(name.replace(/([A-Z])/, '-$1').toLowerCase());
						if (value.indexOf('rgb(') == 0) {
							value = Util.rgbToHex(value);
						}
					}
				}
				return value;
			}
		},
		setStyle : function(obj, style, value) {
			obj = $id(obj);

			if( !obj ) return;

			if (arguments.length == 3) {
				if (style == 'opacity' && Util.isIE) {
					//obj.style['filter'] = 'alpha(opacity='+ (parseFloat(value)*100) + ')';
					obj.style['filter'] = 'progid:DXImageTransform.Microsoft.Alpha(opacity='+ (parseFloat(value)*100) + ')';
				} else {
					obj.style[style] = value;
				}
			} else {
				if (typeof style.opacity != 'undefined' && Util.isIE) {
					//style['filter'] = 'alpha(opacity='+ (parseFloat(style.opacity)*100) + ')';
					style['filter'] = 'progid:DXImageTransform.Microsoft.Alpha(opacity='+ (parseFloat(style.opacity)*100) + ')';
				}
				Class.extend(obj.style, style);
			}
			if (obj.blocker) this.updateBlocker(obj);
		},
		classExists : function(obj, className) {
			return $id(obj).className.split(/\s+/).exists(className);
		},
		setClass : function(obj, className) {
			$id(obj).className = className;
			if (obj.blocker) this.updateBlocker(obj);
		},
		addClass : function(obj, className) {
			obj = $id(obj);
			if (!this.classExists(obj, className)) {
				obj.className = (obj.className + ' ' + className).replace(/^\s+/,'');
				if (obj.blocker) this.updateBlocker(obj);
			}
		},
		delClass : function(obj, className) {
			obj = $id(obj);
			obj.className = obj.className.replace(new RegExp('(^|\\s+)'+className+'($|\\s+)','g'),'');
			if (obj.blocker) this.updateBlocker(obj);
		},
		getRect : function(obj) {
			var p = this.getPosition(obj);
			var s = this.getSize(obj);
			return { left:p.x, top:p.y, right:p.x+s.width, bottom:p.y+s.height };
		},
		hitTest : function(obj, target) {
			var o = this.getRect(obj);
			var t = this.getRect(target);
			return !(o.left > t.right || o.right < t.left || o.top > t.bottom || o.bottom < t.top);
		},
		inTest : function(obj, target) {
			var o = this.getRect(obj);
			var t = this.getRect(target);
			return (o.left >= t.left && o.right <= t.right && o.top >= t.top && o.bottom <= t.bottom);
		},
		addBefore : function(obj, src) {
			obj.parentNode.insertBefore(src, obj);
			if (obj.blocker) this.updateBlocker(obj);
		},
		addAfter : function(obj, src) {
			if (obj.nextSibling) {
				obj.parentNode.insertBefore(src, obj.nextSibling);
			} else {
				obj.parentNode.appendChild(src);
			}
			if (obj.blocker) this.updateBlocker(obj);
		},
		clone : function(obj, deep) {
			return obj.cloneNode(deep);
		},
		remove : function(obj) {
			if (obj.blocker) this.hide(obj.blocker);
			obj.parentNode.removeChild(obj);
		},
		attachBlocker : function(obj, group) {
			if (!Util.isIE) return; // IE only
			if (!obj.blocker) {
				var iframeId = '__blocker_' + (group || 'default');
				var iframe = $id(iframeId);
				if (!iframe) {
					iframe = $c('iframe');
					iframe.setAttribute('src', 'about:blank');
					iframe.setAttribute('id', iframeId);
					iframe.setAttribute('frameBorder', '0');
					this.setStyle(iframe, {
						position : 'absolute',
						width : '0px',
						height : '0px',
						filter : 'alpha(opacity=0)'
					});
					document.body.appendChild(iframe);
				}
				obj.blocker = iframe;
			}
		},
		updateBlocker : function(obj) {
			var iframe = obj.blocker;
			if (!iframe) return;
			var display = this.getStyle(obj, 'display');
			if (display == 'none') {
				this.hide(iframe);
			} else {
				this.show(iframe);
				this.setPosition(iframe, this.getPosition(obj));
				this.setSize(iframe, this.getSize(obj));
				var zIndex = parseInt(this.getStyle(obj, 'zIndex'), 10);
				if (!zIndex) {
					zIndex = 1000;
					this.setStyle(obj, 'zIndex', zIndex)
				}
				this.setStyle(iframe, 'zIndex', zIndex-1);
			}
		},
		extend : function(obj) {
			obj = $id(obj);
			if (typeof obj.extended != 'undefined') return obj;
			for (var func in this) {
				if (func == 'extend') continue;
				if (!this[func].bind) continue;
				obj[func] = this[func].bind(this, obj);
			}
			obj.extended = true;
			return obj;
		}
	}
	ramaElement.pos = ramaElement.getPosition;
	ramaElement.moveTo = ramaElement.setPosition;
	
	if (typeof Element != 'undefined') {
		Element = Class.extend(Element, ramaElement);
	} else {
		Element = ramaElement;
	}

// Selector ///////////////////////////////////////////////////////////////////

/*
	[ selector syntax ]

	- basic
		#id
		tag
		.class
		*

	- hierarchy
		E F     - F descendant of E
		E > F   - F child of E
		E + F   - F next sibling of E
		E ~ F   - F previouse sibling of E 
		E @ F   - F ancestor of E

	- filter : E:filter
		first
		last
		even
		odd
		only
		nth(index)
		eq(index), indexe(index), lt(index), gt(index), le(index), ge(index)
		=index, !index, !=index, <index, >index, <=index, >=index

	- attribute filter : E[filter]
		attr        - have
		attr!       - not have
		attr=value  - same
		attr!=value - not same
		attr*=value - match part
		attr^=value - start with
		attr$=value - end with
*/

	var Selector = {
		patternA : /((?:^|[\s]+)(?:[>+~@][\s]+)?)([^ ]+)/g,
		patternB : /([\.\[:])([^\.:\[\]]+)/g,
		query : function(selector, context) {
			// none
			if (!selector) {
				return [];
			}

			// dom object
			if (selector.nodeType) {
				return [selector];
			}

			// query
			if (typeof selector == 'string') {
				var result = [];
				var sList = selector.split(/[\s]*,[\s]*/);
				for (var i=0; i<sList.length; i++) {
					result.merge(Selector._query(sList[i], context));
				}
				return result;
			} else {
				return [];
			}
		},
		_query : function(selector, context) {
			var result = context || document;
			if (result.nodeType) {
				result = [result];
			}
			var match = Selector.regExecAll(Selector.patternA, selector);
			for (var i=0; i<match.length; i++) {
				var m = Selector.parsePart(match[i][2]);
				var d = match[i][1].trim();
				if (d == '') {
					result = Selector.findDescendant(m[0], m[1], result);
				} else if (d == '>') {
					result = Selector.findChildNodes(m[0], m[1], result);
				} else if (d == '+') {
					result = Selector.findNextSibling(m[0], m[1], result);
				} else if (d == '~') {
					result = Selector.findPrevSibling(m[0], m[1], result);
				} else if (d == '@') {
					result = Selector.findParent(m[0], m[1], result);
				}
				if (!result.length) {
					break;
				}
			}
			return result;
		},
		findDescendant : function(type, filter, list) {
			var result = [];
			if (type.charAt(0) == '#') {
				var obj = document.getElementById(type.slice(1));
				if (obj) {
					for (var i=0; i<list.length; i++) {
						if (Selector.isAncestor(obj, list[i])) {
							result.merge(Selector.filter(obj, filter));
							break;
						}
					}
				}
			} else {
				for (var i=0; i<list.length; i++) {
					result.merge(Selector.filter(list[i].getElementsByTagName(type), filter));
				}
			}
			return result;
		},
		findChildNodes : function(type, filter, list) {
			var result = [];
			if (type.charAt(0) == '#') {
				var obj = document.getElementById(type.slice(1));
				if (obj) {
					for (var i=0; i<list.length; i++) {
						if (obj.parentNode == list[i]) {
							result.merge(Selector.filter(obj, filter));
							break;
						}
					}
				}
			} else {
				for (var i=0; i<list.length; i++) {
					result.merge(Selector.filter(Selector.getChildNodes(list[i], type), filter));
				}
			}
			return result;
		},
		findNextSibling : function(type, filter, list) {
			var result = [];
			if (type.charAt(0) == '#') {
				var obj = document.getElementById(type.slice(1));
				if (obj) {
					for (var i=0; i<list.length; i++) {
						if (Selector.isNextSibling(list[i], obj)) {
							result.merge(Selector.filter(obj, filter));
							break;
						}
					}
				}
			} else {
				for (var i=0; i<list.length; i++) {
					result.merge(Selector.filter(Selector.getNextSiblings(list[i], type), filter));
				}
			}
			return result;
		},
		findPrevSibling : function(type, filter, list) {
			var result = [];
			if (type.charAt(0) == '#') {
				var obj = document.getElementById(type.slice(1));
				if (obj) {
					for (var i=0; i<list.length; i++) {
						if (Selector.isNextSibling(obj, list[i])) {
							result.merge(Selector.filter(obj, filter));
							break;
						}
					}
				}
			} else {
				for (var i=0; i<list.length; i++) {
					result.merge(Selector.filter(Selector.getPrevSiblings(list[i], type), filter));
				}
			}
			return result;
		},
		findParent : function(type, filter, list) {
			var result = [];
			if (type.charAt(0) == '#') {
				var obj = document.getElementById(type.slice(1));
				if (obj) {
					for (var i=0; i<list.length; i++) {
						if (Selector.isAncestor(list[i], obj)) {
							result.merge(Selector.filter(obj, filter));
							break;
						}
					}
				}
			} else {
				for (var i=0; i<list.length; i++) {
					result.merge(Selector.filter(Selector.getParents(list[i], type), filter));
				}
			}
			return result;
		},
		filter : function(obj, filter) {
			if (!obj) {
				return [];
			}
			if (obj.nodeType) {
				obj = [obj];
			}

			for (var i=0; i<filter.length; i++) {
				var k = filter[i][1];
				var v = filter[i][2];
				if (k == '.') {
					obj = Selector.filterClass(obj, v);
				} else if (k == ':') {
					if (v.indexOf('node') > -1) {
						obj = Selector.filterNode(obj, v);
					} else if (v.indexOf('child') > -1) {
						obj = Selector.filterChild(obj, v);
					} else {
						obj = Selector.filterList(obj, v);
					}
				} else if (k == '[') {
					obj = Selector.filterAttr(obj, v);
				}
			}
			return obj;
		},
		filterClass : function(obj, className) {
			if (!obj) {
				return [];
			}
			if (obj.nodeType) {
				obj = [obj];
			}
			var result = [];
			for (var i=0; i<obj.length; i++) {
				if (obj[i].className && typeof obj[i].className.split === 'function' && obj[i].className.split(/\s+/).exists(className)) {
					result.push(obj[i]);
				}
			}
			return result;
		},
		filterNode : function(obj, filter) {
			if (!obj) {
				return [];
			}
			if (obj.nodeType) {
				obj = [obj];
			}

			var result = [];
			var nodeType = parseInt(filter.split('=').pop(), 10) || 1;
			for (var i=0; i<obj.length; i++) {
				if (obj[i].nodeType == nodeType) {
					result.push(obj[i]);
				}
			}
			return result;
		},
		filterChild : function(obj, filter) {
			if (!obj) {
				return [];
			}
			if (obj.nodeType) {
				obj = [obj];
			}

			filter = filter.replace(/[-]?child/, '');
			var result = [];
			for (var i=0; i<obj.length; i++) {
				if (obj[i].nodeType == 1 && obj[i].childNodes.length) {
					result.merge(Selector.filterList(obj[i].childNodes, filter));
				}
			}
			return result;
		},
		filterList : function(obj, filter) {
			if (!obj) {
				return [];
			}
			if (obj.nodeType) {
				obj = [obj];
			}

			var result = [];
			if (filter == 'first') {
				if (obj.length > 0) {
					result.push(obj[0]);
				}
			} else if (filter == 'last') {
				if (obj.length > 0) {
					result.push(obj[obj.length-1]);
				}
			} else if (filter == 'even') {
				for (var i=0; i<obj.length; i+=2) {
					result.push(obj[i]);
				}
			} else if (filter == 'odd') {
				for (var i=1; i<obj.length; i+=2) {
					result.push(obj[i]);
				}
			} else if (filter == 'only') {
				if (obj.length == 1) {
					result.push(obj[0]);
				}
			} else {
				var match = filter.match(/([!><=]+|(?:nth|eq|lt|gt|ne|le|ge))?[\(]?([^\(\)]+)[\}]?/);
				if (match) {
					if (!match[1] || match[1] == '=' || match[1] == 'eq') {
						var index = parseInt(match[2], 10);
						if (typeof obj[index] != 'undefined') {
							 result.push(obj[index]);
						}
					} else if (match[1] == 'nth') {
						try {
							do {
								var index = eval(match[2]);
								if (typeof obj[index] != 'undefined') {
									result.push(obj[index]);
								}
							} while (index < obj.length);
						} catch (e) {}
					} else {
						if (!(obj instanceof Array)) {
							obj = $a(obj);
						}
						var index = parseInt(match[2], 10);
						switch (match[1]) {
							// not equal
							case '!' :
							case '!=' :
							case 'ne' :
								result = obj.splice(index, 1);
								break;
							// greater than
							case '>' :
							case 'gt' :
								result = obj.slice(index+1);
								break;
							// greater than or equal
							case '>=' :
							case 'ge' :
								result = obj.slice(index);
								break;
							// less than
							case '<' :
							case 'lt' :
								result = obj.slice(0, index);
								break;
							// less than or equal
							case '<=' :
							case 'le' :
								result = obj.slice(0, index+1);
								break;
						}
					}
				}
			}

			return result;
		},
		filterAttr : function(obj, attr, value) {
			if (!obj) {
				return [];
			}
			if (obj.nodeType) {
				obj = [obj];
			}
			if (arguments.length == 2) {
				var tmp = attr.split('=');
				var attr = tmp[0];
				var value = tmp[1];
			}

			var result = [];
			if (!value) {
				if (attr.slice(-1) == '!') {
					attr = attr.slice(0, -1);
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && obj[i].getAttribute(attr) == null) {
							result.push(obj[i]);
						}
					}
				} else {
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && obj[i].getAttribute(attr) != null) {
							result.push(obj[i]);
						}
					}
				}
				return result;
			}

			// + means space
			value = value.replace(/([^\\])\+/, '$1 ').replace('\\+', '+');

			var type = attr.slice(-1);
			var reg = null;
			switch (type) {
				// not match
				case '!' :
					attr = attr.slice(0, -1);
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && obj[i].getAttribute(attr) != value) {
							result.push(obj[i]);
						}
					}
					break;
				// match part
				case '*' :
					attr = attr.slice(0, -1);
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && obj[i].getAttribute(attr) && obj[i].getAttribute(attr).indexOf(value) > -1) {
							result.push(obj[i]);
						}
					}
					break;
				// start with
				case '^' :
					attr = attr.slice(0, -1);
					reg = new RegExp('^' + value);
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && reg.test(obj[i].getAttribute(attr))) {
							result.push(obj[i]);
						}
					}
					break;
				// end with
				case '$' :
					attr = attr.slice(0, -1);
					reg = new RegExp(value + '$');
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && reg.test(obj[i].getAttribute(attr))) {
							result.push(obj[i]);
						}
					}
					break;
				// match exact
				default :
					for (var i=0; i<obj.length; i++) {
						if (obj[i].nodeType == 1 && obj[i].getAttribute(attr) == value) {
							result.push(obj[i]);
						}
					}
			}

			return result;
		},
		isAncestor : function(obj, target) {
			var flag = false;
			var p = obj.parentNode;
			while (p) {
				if (p == target) {
					flag = true;
					break;
				}
				p = p.parentNode;
			}
			return flag;
		},
		isNextSibling : function(obj, target) {
			var flag = false;
			var o = obj.nextSibling;
			while (o) {
				if (o == target) {
					flag = true;
					break;
				}
				o = o.nextSibling;
			}
			return flag;
		},
		getNextSiblings : function(obj, tag) {
			tag = tag.toUpperCase();
			var result = [];
			var o = obj.nextSibling;
			while (o) {
				if (tag == '*' || (o.tagName && o.tagName == tag)) {
					result.push(o);
				}
				o = o.nextSibling;
			}
			return result;
		},
		getPrevSiblings : function(obj, tag) {
			tag = tag.toUpperCase();
			var result = [];
			var o = obj.previousSibling;
			while (o) {
				if (tag == '*' || (o.tagName && o.tagName == tag)) {
					result.push(o);
				}
				o = o.previousSibling;
			}
			return result;
		},
		getParents : function(obj, tag) {
			tag = tag.toUpperCase();
			var result = [];
			var o = obj.parentNode;
			while (o) {
				if (tag == '*' || (o.tagName && o.tagName == tag)) {
					result.push(o);
				}
				o = o.parentNode;
			}
			return result;
		},
		getChildNodes : function(obj, tag) {
			if (!tag || tag == '*') {
				return obj.childNodes;
			} else {
				tag = tag.toUpperCase();
				var result = [];
				for (var i=0; i<obj.childNodes.length; i++) {
					if (obj.childNodes[i].tagName && obj.childNodes[i].tagName == tag) {
						result.push(obj.childNodes[i]);
					}
				}
				return result;
			}
		},
		parsePart : function(str) {
			var pos = str.search(/[\.\[:]/);
			if (pos > -1) {
				var o = str.slice(0, pos) || '*';
				var x = Selector.regExecAll(Selector.patternB, str.slice(pos));
			} else {
				var o = str;
				var x = [];
			}
			return [o, x];
		},
		regExecAll : function(reg, str) {
			reg.lastIndex = 0;

			var match = [];
			var tmp = null;
			while (tmp = reg.exec(str)) {
				match.push(tmp);
			}
			return (match.length) ? match : null;
		}
	}

// Ajax ///////////////////////////////////////////////////////////////////////

	var Ajax = Class({
		init : function(options) {
            Class.extend(this, {
				url : '',
				method : 'GET',  // GET, POST
				type : 'TEXT',   // TEXT, HTML, JSON, XML
                userid : null,
                password : null,
                header : {},
				param : {},
                callback : null,
                target : null,
                repeat : 1,
                delay : 5
			});
            this.http = null;
            this.postData = null;
            this.timer = null;
            this.count = 0;

            this.initHTTP();
            if (options) {
                this.request(options);
            }
		},
    	initHTTP : function() {
            if (!this.http) {
                if (window.XMLHttpRequest) {
                    this.http = new XMLHttpRequest();
                    this.httpType = 'XMLHttpRequest';
                } else if (window.ActiveXObject) {
                    var pid = ['MSXML2.XMLHTTP', 'Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'MSXML3.XMLHTTP'];
                    for (var i=0; i<pid.length; i++) {
                        try {
                            this.http = new ActiveXObject(pid[i]);
                            this.httpType = pid[i];
                            break;
                        } catch (e) {
                            // nothing
                        }
                    }
                }
            }
        },
        setUrl : function(url) {
            var pos = url.indexOf('?');
            if (pos != -1) {
                var query = url.substring(pos+1);
                var param = query.parseQuery(false);
                for (var key in param) {
                    this.param[key] = param[key];
                }
                url = url.substring(0, pos);
            }
            this.url = url;
        },
        setMethod : function(method) {
            this.method = (typeof method == 'string' && method.toUpperCase() == 'POST') ? 'POST' : 'GET';
        },
        setParam : function(param) {
            this.param = param;
        },
        addParam : function(key, value) {
            this.param[key] = value;
        },
        setHeader : function() {
            this.header = header;
        },
        addHeader : function(key, value) {
            this.header[key] = value;
        },
        setCallback : function(callback) {
            if (typeof callback == 'function') {
                this.callback = callback;
            }
        },
        applyParam : function() {
            var query = '';
            query = query.encodeQuery(this.param);
            this.requestUrl = this.url;
            this.postData = null;
            if (this.method == 'POST') {
                this.postData = query;
            } else {
                if (query) this.requestUrl += '?' + query;
            }
        },
        applyHeader : function() {
            if (this.method == 'POST') {
                this.header['Content-type'] = 'application/x-www-form-urlencoded';
            }
            // See Mozilla Bugzilla #246651.
            if (this.http.overrideMimeType) {
                this.header['Connection'] = 'close';
            }

            for (var key in this.header) {
                this.http.setRequestHeader(key, this.header[key]);
            }
        },
        request : function(options) {
            if (options) {
                Class.extend(this, options);
            }
            this.setMethod(this.method);
            this.setUrl(this.url);
            this.applyParam();

            this.http.open(this.method, this.requestUrl, true, this.userid, this.password);
            this.http.onreadystatechange = this.onComplete.bind(this);

            this.applyHeader();
            this.http.send(this.postData);
        },
        stop : function() {
            if (this.http) this.http.abort();
            if (this.timer) clearTimeout(this.timer);
        },
        onComplete : function() {
            if (this.http.readyState == 4) {
                // TODO : redirect

                this.count++;
                var response = new Ajax.Response(this);
                if (typeof this.callback == 'function') {
                    this.callback.call(this, response);
                } else if (this.target) {
                    $id(this.target).innerHTML = response.getValue('HTML');
                }
                this.http.onreadystatechange = function(){};
                if (this.count < this.repeat) {
                    if (this.delay < 1) this.delay = 1;
                    this.addParam('ajax_count', this.count);
                    this.timer = setTimeout(this.request.bind(this), this.delay*1000);
                }
            }
        }
    });

    Ajax.Response = Class({
        init : function(ajax) {
            Class.extend(this, {
                http : ajax.http,
                type : ajax.type,
                status : ajax.http.status,
                header : ajax.http.getAllResponseHeaders(),
                body : ajax.http.responseText,
                xml : ajax.http.responseXML
            });
            this.value = this.getValue();
        },
        isSuccess : function() {
            return (this.status == 200 || this.status == 0) ? true : false;
        },
        getHeader : function(key) {
            if (key) {
                return this.http.getResponseHeader(key);
            } else {
                return this.header();
            }
        },
        getBody : function() {
            return this.body;
        },
        getValue : function(type) {
            if (!type) type = this.type;
            switch (type.toUpperCase()) {
                case 'XML' :
                    var value = this.xml || this.body;
                    break;
                case 'JSON' :
										var value = eval('('+this.body+')');
                    break;
                case 'HTML' :
                case 'TEXT' :
                default :
                    var value = this.body;
            }
            return value;
        }
    });


// Drag ///////////////////////////////////////////////////////////////////////

	var Drag = Class({
		init : function(obj, options) {
			this.object = Element.extend(obj);
			this.options = Class.extend({
				handler : [],
				area : null,
				onStart : null,
				onMove : null,
				onEnd : null,
				zIndex : 7777
			}, options);

			this.onmousedown = this.onMouseDown.bindForEvent(this);
			this.onmouseup = this.onMouseUp.bindForEvent(this);
			this.onmousemove = this.onMouseMove.bindForEvent(this);

			var opt = this.options;
			if (!opt.handler.length) {
				$l(this.object, 'mousedown', this.onmousedown);
			} else {
				for(var i=0; i<opt.handler.length; i++) {
					$l($id(opt.handler[i]), 'mousedown', this.onmousedown);
				}
			}

            if (opt.area) {
                if (opt.area instanceof Array && opt.area.length == 4) {
                    this.area = {
                        left   : opt.area[0],
                        top    : opt.area[1],
                        right  : opt.area[2],
                        bottom : opt.area[3]
                    }
                } else if (typeof opt.area.left == 'number' && typeof opt.area.top == 'number' && typeof opt.area.right == 'number' && typeof opt.area.bottom == 'number') {
                    this.area = opt.area;
                } else {
                    var obj = Element.extend(opt.area);
                    if (obj) {
                        this.area = obj.getRect();
                    }
                }
            }
		},
		onMouseDown : function(evt) {
            Event.stop(evt);

            $l(document, 'mousemove', this.onmousemove);
            $l(document, 'mouseup', this.onmouseup);

            var opt = this.options;
            var epos = Event.pos(evt);
            var opos = this.object.pos();
            this.gapX = epos.x - opos.x;
            this.gapY = epos.y - opos.y;

            this.zIndex = this.object.getStyle('zIndex');

			// callback
            var ret;
			if (typeof this.options.onStart == 'function') {
				ret = this.options.onStart.call(this, evt);
            }
            if (ret !== false) {
	            this.object.setStyle('zIndex', this.options.zIndex);
			}
		},
		onMouseMove : function(evt) {
            Event.stop(evt);

            var epos = Event.pos(evt);
			var newX = epos.x - this.gapX;
			var newY = epos.y - this.gapY;

			if (this.area) {
				var size = this.object.getSize();
				if (newX > this.area.right - size.width) newX = this.area.right - size.width;
				if (newY > this.area.bottom - size.height) newY = this.area.bottom - size.height;
				if (newX < this.area.left) newX = this.area.left;
				if (newY < this.area.top) newY = this.area.top;
			}
			this.newX = newX;
			this.newY = newY;

			// callback
            var ret;
			if (typeof this.options.onMove == 'function') {
				ret = this.options.onMove.call(this, evt);
			}
            if (ret !== false) {
                this.object.setPosition(this.newX, this.newY);
            }            
		},
		onMouseUp : function(evt) {
            Event.stop(evt);

			$lx(document, 'mousemove', this.onmousemove);
      $lx(document, 'mouseup', this.onmouseup);
			this.object.setStyle('zIndex', this.zIndex);

			// callback
			if (typeof this.options.onEnd == 'function') {
				this.options.onEnd.call(this, evt);
			}
		}
	});

// Debug //////////////////////////////////////////////////////////////////////

/*
	Only works when console is available!
	
	You can get information about firebug at http://getfirebug.com/
*/

	var Debug = {
		use : false,
		log : function(obj) {
			if (this.use && typeof console != 'undefined') {
				console.log(obj);
			}
		},
		error : function(obj) {
			if (this.use && typeof console != 'undefined') {
				console.error(obj);
			}
		}
	}

// Util ///////////////////////////////////////////////////////////////////////

	var Util = {
		// brower
		isIE : (window.navigator.userAgent.search(/(Trident|msie)/i) != -1),
		isFF : (window.navigator.userAgent.search(/firefox/i) != -1),
		isOpera : (window.navigator.userAgent.search(/opera/i) != -1),
		isSafari : (window.navigator.userAgent.search(/safari/i) != -1),
		userAgent : window.navigator.userAgent,
		appName : ( (new RegExp('(rv:|msie |firefox/|opera/|safari/|kakaotalk )([0-9.]+)', 'i')).exec(window.navigator.userAgent) ? (new RegExp('(rv:|msie |firefox/|opera/|safari/|kakaotalk )([0-9.]+)', 'i')).exec(window.navigator.userAgent)[1].slice(0, -1) : '' ),
		appVersion : ( (new RegExp('(rv:|msie |firefox/|opera/|safari/|kakaotalk )([0-9.]+)', 'i')).exec(window.navigator.userAgent) ? (new RegExp('(rv:|msie |firefox/|opera/|safari/|kakaotalk )([0-9.]+)', 'i')).exec(window.navigator.userAgent)[2] : '' ),
		// window, document
		getClientSize : function(win) {
			if (!win) win = self;
			var w = win.innerWidth || win.document.documentElement.clientWidth || win.document.body.clientWidth;
			var h = win.innerHeight || win.document.documentElement.clientHeight || win.document.body.clientHeight;
			return { width:w, height:h };
		},
		getDocSize : function(win) {
			if (!win) win = self;
			var docSize = Element.getSize(win.document.body);
			var w = Math.max(win.document.body.scrollWidth, docSize.width);
			var h = Math.max(win.document.body.scrollHeight, docSize.height);
			return { width:w, height:h };
		},
		getScrollOffset : function(win) {
			if (!win) win = self;
			var x = win.pageXOffset || win.document.body.scrollLeft || document.documentElement.scrollLeft || 0;
			var y = win.pageYOffset || win.document.body.scrollTop || document.documentElement.scrollTop || 0;
			return { x:x, y:y };
		},
		getDocumentWindow : function(doc) {
			return doc.defaultView || doc.parentWindow;
		},
		// iframe
		getIframeDoc : function(iframe) {
			if (iframe.contentWindow) {
				return iframe.contentWindow.document;
			} else if (iframe.contentDocument) {
				return iframe.contentDocument.documentElement;
			} else {
				return null;
			}
		},
		getIframeDocSize : function(iframe) {
			iframe = $id(iframe);
			var doc = this.getIframeDoc(iframe);
			var win = this.getDocumentWindow(doc);
			return this.getDocSize(win);
		},
		autoResizeIframe : function(iframe, noWidth, noHeight) {
			this.resizeIframe(iframe, !noWidth, !noHeight);
		},
		resizeIframe : function(iframe, width, height) {
			iframe = $id(iframe);
			if (width === true || height === true) {
				var docSize = this.getIframeDocSize(iframe);
			}
			if (width) {
				width = (width === true) ? docSize.width : width;
				Element.setStyle(iframe, 'width', (typeof width == 'number') ? width + 'px' : width);
			}
			if (height) {
				height = (height === true) ? docSize.height : height;
				Element.setStyle(iframe, 'height', (typeof height == 'number') ? height + 'px' : height);
			}
		},
		// math
		random : function(min, max) {
			if (typeof min == 'number' && typeof max == 'number') {
				return Math.floor(Math.random() * (max-min) + min);
			} else {
				return Math.floor(Math.random() * 10);
			}
		},
		randomId : function(cipher, prefix) {
			if (typeof cipher != 'number') {
				cipher = 7;
			} else if (cipher > 15) {
				cipher = 15;
			}
			var min = parseInt('100000000000000'.substr(0, cipher), 10);
			var max = parseInt('999999999999999'.substr(0, cipher), 10);
			return (prefix) ? prefix+'_'+Util.random(min, max) : Util.random(min, max);
		},
		// cookie
		getCookie : function(name) {
			var re = new RegExp(name + '=([^;]+)');
			var value = re.exec(document.cookie);
			return (value != null) ? unescape(value[1]) : null;
		},
		setCookie : function(name, value, expire, path, domain) {
			expire = parseInt(expire, 10);
			if (!path) path = '/';
			if (expire) {
				var today = new Date();
				var expiry = new Date(today.getTime() + expire * 1000);
				var cookie = name + '=' + escape(value) + '; expires=' + expiry.toGMTString() + '; path=' + path;
			} else {
				var cookie = name + '=' + escape(value) + '; path=' + path;
			}
			if (domain) cookie += '; domain=' + domain;
			document.cookie = cookie;
		},
		// link style sheet
		linkStyle : function(href, id) {
			var link = id ? ($id(id) || $c('link')) : $c('link');
			if (link.id) {
				link.setAttribute('href', href);
			} else {
				if (id) link.setAttribute('id', id);
				link.setAttribute('type', 'text/css');
				link.setAttribute('rel', 'stylesheet');
				link.setAttribute('href', href);

				var head = document.getElementsByTagName('head')[0];
				head.appendChild(link);
			}
			return link;
		},
		linkCSS : function(href, id) {
			return this.linkStyle(href, id);
		},
		// js path
		getJSPath : function(jsFile) {
			if (!jsFile) jsFile = 'sky.rama.js';
			var scripts = document.getElementsByTagName('script');
			for (var i=0; i<scripts.length; i++) {
				var src = scripts[i].getAttribute('src');
				if (src && src.search(jsFile) != -1) {
					var path = src.replace(/\/[^\/]+$/, '');
					return path;
				}
			}
			return false;
		},
		// rgb() to #hex
		rgbToHex : function(str) {
			str = str.replace(/[^0-9,]/g, '').split(',');
			str[0] = ('0' + parseInt(str[0], 10).toString(16).toLowerCase()).slice(-2);
			str[1] = ('0' + parseInt(str[1], 10).toString(16).toLowerCase()).slice(-2);
			str[2] = ('0' + parseInt(str[2], 10).toString(16).toLowerCase()).slice(-2);

			return ('#' + str.join(''));
		},
		// debug
		dump : function(obj) {
			if (obj.toString && (typeof obj == 'string' || typeof obj == 'number' || obj instanceof Array)) {
				return obj.toString();
			} else {
				var str = '';
				for (x in obj) {
					str += x + ' : ' + obj[x] + "\n";
				}
				return str;
			}
		}
	}

// Special functions //////////////////////////////////////////////////////////

	// get element by id
	function $id(obj) {
		if (obj && obj instanceof Array) {
			var ret = [];
			for (var i=0; i<obj.length; i++) {
				ret.push((typeof obj[i] == 'string') ? document.getElementById(obj[i]) : obj[i]);
			}
			return ret;
		} else {
			return (typeof obj == 'string') ? document.getElementById(obj) : obj;
		}
	}

	// get elements by css style selector
	function $qList(selector, context) {
		return Selector.query(selector, context);
	}
	function $q(selector, context) {
		return Selector.query(selector, context)[0];
	}

	// get elements by id pattern
	function $$(id, range) {
		var p = /([#]+)/.exec(id);
		if (p[1]) {
			var cipher = p[1].length;
			var pattern = p[1];
		} else{
			var cipher = 1;
			var pattern = '#';
		}
		var zero = pattern.replace(/#/g, '0');
		if (range instanceof Array) {
			var start = range[0];
			var end = range[1] || false;
		} else if (arguments.length == 3) {
			var start = arguments[1];
			var end = arguments[2];
		} else {
			var start = 0;
			var end = range;
		}
		var loop = (end) ? end : Math.pow(10, cipher) - 1;
		var ret = [];
		for (var i=start; i<=loop; i++) {
			var el = document.getElementById(id.replace(pattern, (zero+i).slice(-cipher)));
			if (el) {
				ret.push(el);
			} else if (!end && i>0) {
				break;
			}
		}
		return ret;
	}

	// extend
	function $e(obj) {
		if (typeof obj == 'string' || (typeof obj.nodeType == 'number' && obj.nodeType == 1)) {
			obj = Element.extend(obj);
		} else if (typeof obj.initEvent == 'function' || typeof obj.keyCode == 'number') {
			obj = Event.extend(obj);
		} else {
			obj = Class.extend.apply(Class, arguments);
		}
		return obj;
	}

	// create element
	function $c(tag) {
		return document.createElement(tag);
	}

	// array function
	$a = Array.prototype.copy;
	function $array(obj) {
		return (obj instanceof Array) ? obj : [obj];
	}

	// event function
	function $l(obj, handler, func) {
		Event.addListener(obj, handler, func);
	}
	function $lx(obj, handler, func) {
		Event.delListener(obj, handler, func);
	}

	function $load(func) {
		if (!(this.__window_load_func instanceof Array)) {
			this.__window_load_func = [];
		}
		if (typeof func == 'function') {
			this.__window_load_func.push(func);
			if (this.__window_load_func.length == 1) {
				$l(window, 'load', __window_load_init);
			}
		}
	}
	function __window_load_init(evt, obj) {
		for (var i=0; i<__window_load_func.length; i++) {
			__window_load_func[i](evt, obj);
		}
	}

	// get form
	function $form(name) {
		if (typeof name == 'string') {
			return document.forms[name] || document.getElementById(name);
		} else {
			return name;
		}
	}

	// get form element value
	function $v(obj) {
		obj = $id(obj);
		if (obj.type) {
			var type = obj.type;
		} else if (obj.length) {
			var type = obj[0] ? obj[0].type : false;
		} else {
			var type = false;
		}
		if (!type) return false;

		switch (type.toLowerCase()) {
			case 'radio' :
				var value = $a(obj).filter(function(e) { return e.checked ? e.value : false; }, true);
				value = (value.length) ? value[0] : '';
				break;
			case 'checkbox' :
				var value = $a(obj).filter(function(e) { return e.checked ? e.value : false; }, true);
				break;
			case 'select-one' :
				var value = $a(obj.options).filter(function(e) { return e.selected ? e.value : false; }, true);
				value = (value.length) ? value[0] : '';
				break;
			case 'select-multiple' :
				var value = $a(obj.options).filter(function(e) { return e.selected ? e.value : false; }, true);
				break;
			default :
				var value = $a(obj).each(function(e) { return e.value; });
				if (value.length == 1) value = value[0];
				break;
		}
		return value;
	}

	// set form element value
	function $vset(obj, value) {
		obj = $id(obj);
		if (obj.type) {
			var type = obj.type;
		} else if (obj.length) {
			var type = obj[0] ? obj[0].type : false;
		} else {
			var type = false;
		}
		if (!type) return false;

		switch (type.toLowerCase()) {
			case 'radio' :
				$a(obj).each(function(e) { if (e.value == value) e.checked = true; });
				break;
			case 'checkbox' :
				$a(value).each(function(v) {
					var tmp = $a(obj);
					if (tmp[0].getAttribute('bitwise') != null) {
						v = parseInt(v, 10);
						tmp.each(function(e) { if (parseInt(e.value, 10) & v) { e.checked = true; } else { e.checked = false; } });
					} else if (tmp[0].getAttribute('withall') != null) {
						tmp.each(function(e) { if (e.value == v || v == 'ALL') { e.checked = true; } else { e.checked = false; } });
					} else {
						tmp.each(function(e) { if (e.value == v) { e.checked = true; } else { e.checked = false; } });
					}
				});
				break;
			case 'select-one' :
				$a(obj.options).each(function(e) { if (e.value == value) e.selected = true; });
				break;
			case 'select-multiple' :
				$a(value).each(function(v) {
					$a(obj.options).each(function(e) { if (e.value == v) e.selected = true; });
				});
				break;
			default :
				var e = $a(obj);
				$a(value).each(function(v, i) {
					if (typeof e[i] != 'undefined') e[i].value = v;
				});
				break;
		}
	}

	// get selected option object
	function $select(obj) {
		obj = $id(obj);
		if (typeof obj.options == 'undefined') return false;
		var option = $a(obj.options).filter(function(e) { return e.selected ? e : false; }, true);
		if (obj.type.toLowerCase() == 'select-one') option = (option.length) ? option[0] : false;
		return option;
	}

	function $resolve()
	{
		if (typeof jQuery != 'undefined') {
			jQuery.noConflict();
		}
		window.$ = $id;
	}
	$resolve();