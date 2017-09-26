/*
	sky.form.checker.js
	2007-04-18 ~ 2008-06-02

	Seo, Jaehan <daddyofsky@gmail.com>

	@dependence sky.base.js

	[ SYNOPSYS ]

	function init() {
		var fc = new Form.Checker({
			form : 'formIdOrName',
			message : '%s in invalid.', // optional. default message format
			preFunc : preCheckFunction, // optional.
			postFunc : postCheckFunction, // optional.
		});

		// add check list
		fc.check('age', /^[0-9]+$/, 'Age', '%s must be number.'); // RegExp object
		fc.check('email', checkEmail, 'Email'); // function
		fc.check('passwd', 'length:4,8', 'Password'); // option string

		// for lib.validate.js style
		fc.scan();
	}
	$l(window, 'load', init);

	[ options for Form.Checker.add() ]
	- RegExp object
	- function
	- option string
		. length:[min,]max - string length
		. byte:[min,]max - string byte
		. range:[min,]max - number range
		. check:[min,]max - checkbox check count // add
		. select:[min,]max - selectbox select count // add

		. alter[:max] - alternative
		. glue:string - glue

		. empty - check if empty. (default)
		. trim - trim value (not applied to original)
		. apply:element - apply value to another element
		. match:element - compare elements value

		. email, homepage, url, jumin, bizno, phone, mobile, number, date - pre defined check function
*/

try{
	if('undefined' != typeof __SUB_SITE_LANG_TYPE__){
		load_i18n("sky.form.checker", __SUB_SITE_LANG_TYPE__);
	}else{
		load_i18n("sky.form.checker", 'ko');
	}
	
}catch(e){}

	if (typeof Form == 'undefined') {
		Form = {};
	}

	Form.Checker = Class({
		init : function(options) {
			Class.extend(this, {
				form : null,
				auto : true,
				message : '%s ' + '항목이 바르지 않습니다.',
				preFunc : null,
				postFunc : null
			}, options);

			this.checkList = {};
			this.funcList = {
				'email' : this.checkEmail,
				'homepage' : this.checkHomepate,
				'url' : this.checkUrl,
				'jumin' : this.checkJumin,
				'foreign' : this.checkForeign,
				'bizno' : this.checkBizNo,
				'phone' : this.checkPhone,
				'mobile' : this.checkMobile,
				'number' : this.checkNumber,
				'date' : this.checkDate
			}

			this.setForm(this.form);
			this.onCheck = this.onSubmit.bindForEvent(this);
			if (this.auto) {
				$l(this.form, 'submit', this.onCheck);
			}
		},
		setForm : function(form) {
			if (typeof form == 'string') {
				this.form = $form(form);
			} else if (typeof form.tagName == 'string' && form.tagName.toLowerCase() == 'form') {
				this.form = form;
			} else {
				this.form = null;
			}
			this.form.Checker = this;
			this.form.setAttribute("autocomplete", "off"); // for Firefox forcus exception error

			return this.form;
		},
		addCheck : function(element, option, name, message, enable) {
			element = this.getElement(element);
			if (!element) {
				return false; // error
			}
			var key = element.id || element.name || element[0].id || element[0].name;
			if (!key) {
				return false; // error
			}
			
			if (this.checkList[key]) {
				this.checkList[key]['enable'] = true;
			} else {
				if (!(element instanceof Array)) element = [element];

				this.checkList[key] = {
					enable : (enable === false) ? false : true,
					element : element,
					option : this.parseOption(option),
					name : name,
					message : message || this.message
				};
			}
			return true;
		},
		delCheck : function(element) {
			element = this.getElement(element);
			var key = element.id || element.name || element[0].id || element[0].name;
			if (this.checkList[key]) {
				this.checkList[key]['enable'] = false;
			}
		},
		toggle : function(element) {
			element = this.getElement(element);
			var key = element.id || element.name || element[0].id || element[0].name;
			if (this.checkList[key]) {
				this.checkList[key]['enable'] = !this.checkList[key]['enable'];
			}
		},
		onSubmit : function(evt) {
			Event.stop(evt);
			this.doSubmit();
		},
		doSubmit : function() {
			if (this.doCheck()) {
				if (typeof this.onSuccess == 'function') {
					this.onSuccess.call(this);
				} else {
					if (this.form.useSSL) {
						// apply SSL
						this.doSSLSubmit();
					} else {
						this.form.submit();
					}
				}
			}
		},
		doSSLSubmit : function() {
			var list = this.form.elements;
			for (var i=0; i<list.length; i++) {
				var el = list[i];
				if (el.name == 'act' || el.name == 'ch') {
					continue;
				}
				WMSSL.addElement(el.name);
			}
			WMSSL.submit(this.form, {'mode':'plain'});
		},
		doCheck : function() {
			// pre function
			if (typeof this.preFunc == 'function') {
				if (!this.preFunc.call(this)) return false;
			}

			for (var x in this.checkList) {
				var check = this.checkList[x];
				if (!check.enable) {
					continue;
				}

				if (typeof check.option.alter != 'undefined') {
					var alter = parseInt(check.option.alter, 10) || 1;
					var success = 0;
					for (var i=0; i<check.element.length; i++) {
						if (this.doCheckOne(check, i)) {
							success++;
						}
					}
					if (success < alter) {
						this.alert(check, check.element[0]);
						return false;
					}
				} else {
					if (!this.doCheckOne(check)) {
						this.alert(check);
						return false;
					}
				}

			}

			// post function
			if (typeof this.postFunc == 'function') {
				if (!this.postFunc.call(this)) return false;
			}

			return true;
		},
		doCheckOne : function(check, index) {
			var element = (typeof index == 'number') ? [check.element[index]] : check.element;
			var type = element[0].type || element[0][0].type;
			if (!type) {
				return false; // error
			}
			var values = [];
			for (var i=0; i<element.length; i++) {
				values.push($v(element[i]));
			}
			value = (typeof values[0] == 'string') ? values.join((check.option.glue || '')) : values[0];
			var flag = true;
			for (var key in check.option) {
				var option = check.option[key];

				// RegExp
				if (option instanceof RegExp) {
					flag = option.test(value);
				// funciton
				} else if (typeof option == 'function') {
					flag = option(value, element);
				// pre defined function
				} else if (typeof this.funcList[key] == 'function') {
					flag = this.funcList[key](value, element);
				// user function name
				} else if (key == 'func') {
					var func = eval(option);
					if (typeof func == 'function') {
						flag = func(value, element);
					} else {
						// invalid user function
						// TODO
					}
				// length, byte, range, check
				} else if (/^(length|byte|range|check|select)$/.test(key)) {
					switch (key) {
						case 'byte' : var cmp = this.getByte(value); break;
						case 'range' : var cmp = parseInt(value, 10) || 0; break;
						default : var cmp = value.length;
					}
					if (option.length == 1) {
						option[0] = parseInt(option[0], 10);
						flag = (cmp <= option[0]) ? true : false;
					} else if (option.length >= 2) {
						option[0] = parseInt(option[0], 10);
						option[1] = parseInt(option[1], 10);
						flag = ((!option[0] || cmp >= option[0]) && (!option[1] || cmp <= option[1])) ? true : false;
					}
				// etc
				} else {
					switch (key) {
						case 'empty' :
							for (var j=0; j<values.length; j++) {
								flag = (values[j] instanceof Array) ? values[j].length : values[j].trim();
								if (!flag) break;
							}
							break;
						case 'optional' :
							for (var j=0; j<values.length; j++) {
								flag = (values[j] instanceof Array) ? values[j].length : values[j].trim();
								if (flag) break;
							}
							if (!flag) {
								return true;
							}
							break;
						case 'trim' :
							if (typeof value == 'string') {
								value = value.trim();
							}
							break;
						case 'apply' :
							if (option) {
								if (option instanceof Array) {
									for (var i=0; i<option.length; i++) {
										var el = this.getElement(option[i]);
										if (el && typeof el.value != 'undefined') el.value = value;
									}
								} else {
									var el = this.getElement(option);
									if (el && typeof el.value != 'undefined') el.value = value;
								}
							}
							break;
						case 'match' :
							if (option) {
								flag = (value == $v(this.getElement(option))) ? true : false;
							}
							break;
					}
				} // if
				if (!flag) {
					return false;
				}
			} // for check.option
			return true;
		},
		getElement : function(element) {
			if (typeof element == 'string') {
				var name = element;
				element = this.form.elements[name] || $id(name);
				if (!element) {
					if (this.form.elements[name + '[]']) {
						element = this.form.elements[name + '[]'];
					} else if (this.form.elements[name + '[0]']) {
						var i = 0;
						element = [];
						do {
							element.push(this.form.elements[name + '[' + i + ']']);
							i++;
						} while (this.form.elements[name + '[' + i + ']']);
					}
				}
			} else if (element instanceof Array) {
				for (var i=0; i<element.length; i++) {
					element[i] = this.getElement(element[i]);
				}
			}
			return element;
		},
		getByte : function(value) {
			var byteTotal = 0;
			for (var i=0; i<value.length; i++) {
				if (value.charCodeAt(i) >= 128) {
					byteTotal += 2;
				} else {
					byteTotal++;
				}
			}
			return byteTotal;
		},
		parseOption : function(option) {
			if (!(option instanceof Array)) option = [option];
			var result = {};
			var index = 0;
			for (var i=0; i<option.length; i++) {
				if (typeof option[i] == 'function' || option[i] instanceof RegExp) {
					result[index++] = option[i];
				} else if (typeof option[i] == 'string') {
					if (option[i].indexOf('/') === 0) {
						result[index++] = new RegExp(option[i].slice(1, -1));
					} else {
						var tmp = option[i].split(/[ ]*:[ ]*/);
						if (/^(length|byte|range|check|select)$/.test(tmp[0])) {
							result[tmp[0]] = (tmp[1]) ? tmp[1].split(/[ ]*,[ ]*/) : [];
						} else {
							result[tmp[0]] = (tmp[1]) ? tmp[1] : '';
						}
					}
				} else if (typeof option[i] == 'object') {
					for (var j in option[i]) {
						result[j] = option[i][j];
					}
				} else if (option[i]) {
					result['empty'] = true;
				}
			}
			return result;
		},
		alert : function(check, element) {
			var el = element || check.element[0];
						
			if (el.length && (el.type != 'select-one' && el.type != 'select-multiple')) {
				el = el[0];
			}
			
			var message = check.message.replace('%s', check.name);
			Durian.block = true;
			Durian.alertCloseMode = 0;
			Durian.alertCloseFocusObject = el;
			Durian.alert(message);

			//try { el.focus(); } catch (e) {}
		},

		// set data
		setData : function(data) {
			if (!data) {
				return;
			}
			if (this.form.useSSL) {
				data = WMSSL.decryptData(data);
			}
			for (var key in data) {
				var el = this.form.elements[key];
				if (typeof el != 'undefined' && data[key] != null) {
					$vset(el, data[key]);
				}
			}
		},

		// load check info
		load : function(info) {
			if (info instanceof Array) {
				for (var i=0; i<info.length; i++) {
					this.addCheck.apply(this, info[i]);
				}
			} else {
				for (var key in info) {
					this.addCheck.apply(this, info[key]);
				}
			}
		},

		// scan lib.validate.js check info
		scan : function() {
			this.form.onsubmit = null;

			for (var x=0; x<this.form.elements.length; x++) {

				var idx = 0;
				var element = this.form.elements[x];
				var required = element.getAttribute('required');
				if (required == null) {
					continue;
				}

				var key = required || element.id || element.name;
				if (typeof this.checkList[key] != 'undefined') {
					continue;
				}
				this.checkList[key] = {
					enable : true,
					element : [this.form.elements[element.name]],
					option : { empty : true },
					name : element.getAttribute('hname') || element.name,
					message : element.getAttribute('errmsg') || this.message
				}

				var span = parseInt(element.getAttribute('span'), 10) || 0;
				if (span > 0) {
					for (var i=x+1; i<x+span; i++) {
						this.checkList[key]['element'].push(this.form.elements[i]);
						this.form.elements[i].setAttribute('required', null);
					}
				}

				var requirenum = parseInt(element.getAttribute('requirenum'), 10)
				if (requirenum > 0) {
					for (var i=0; i<this.form.elements.length; i++) {
						if (i != x && this.form.elements[i].getAttribute('required') == required) {
							this.checkList[key]['element'].push(this.form.elements[i]);
						}
					}
				}

				var option = this.checkList[key].option;
				option['alter'] =  requirenum || undefined;
				option['glue'] = element.getAttribute('glue') || undefined;

				var minbyte = parseInt(element.getAttribute('minbyte'), 10);
				var maxbyte = parseInt(element.getAttribute('maxbyte'), 10);
				if (minbyte || maxbyte) {
					option['byte'] = (minbyte) ? [minbyte, maxbyte] : [maxbyte];
				}

				var mincheck = element.getAttribute('mincheck');
				var maxcheck = element.getAttribute('maxcheck');
				if (mincheck || maxcheck) {
					option['check'] = (mincheck) ? [mincheck, maxcheck] : [maxcheck];
				}

				var pattern = element.getAttribute('pattern');
				if (pattern) {
					option[idx++] = new RegExp(pattern);
				}

				var tmp = element.getAttribute('option');
				if (tmp) {
					func = tmp.split(/[\t\n ]+/);
					for (var i=0; i<func.length; i++) {
						switch (func[i].toLowerCase()) {
							case 'trim' : option['trim'] = ''; break;
							case 'email' : option[idx++] = this.checkEmail; break;
							case 'jumin' : option[idx++] = this.checkJumin; break;
							case 'foreign' : option[idx++] = this.checkForeign; break;
							case 'bizno' : option[idx++] = this.checkBizNo; break;
							case 'phone' : case 'homephone' : option[idx++] = this.checkPhone; break;
							case 'handphone' : option[idx++] = this.checkMobile; break;
							case 'hangul' : option[idx++] = /[가-힣]/; break;
							case 'engonly' : option[idx++] = /^[a-zA-Z]+$/; break;
							case 'number' : option[idx++] = /^[0-9]+$/; break;
							default : option[func[i]] = 'func'; break;
						}
					}
				}

				var match = element.getAttribute('match');
				if (match) {
					this.checkList[match] = {
						enable : true,
						element : [this.getElement(match)],
						option : { match : element },
						name : element.getAttribute('hname') || match,
						message : element.getAttribute('errmsg') || this.message
					}
				}
			}
		},

		// functions for check option
		checkEmail : function(value) {
			if (value instanceof Array) {
				value = value.join('@');
			}
		   return /^[_a-zA-Z0-9-\.]+@[\.a-zA-Z0-9가-힣-]+\.[a-zA-Z0-9가-힣-]+$/.test(value);
		},
		checkHomepage : function(value) {
			return /^http[s]?:\/\/[\.a-zA-Z0-9가-힣-]+\.[a-zA-Z0-9가-힣-]+/.test(value);
		},
		checkUrl : function(value) {
			return /^(http|https|ftp|telnet|news|mms):\/\/[\.a-zA-Z0-9가-힣-]+\.[a-zA-Z]+/.test(value);
		},
		checkJumin : function(value) {
			if (value instanceof Array) {
				value = value.join('-');
			}
			if (!/^([0-9]{6})-?([0-9]{7})$/.test(value)) return false;
			num = value.replace(/[^0-9]/g, '');
			var sum = 0;
			var last = num.charCodeAt(12) - 0x30;
			var bases = "234567892345";
			for (var i=0; i<12; i++) {
				sum += (num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30);
			}
			var mod = sum % 11;
			return ((11 - mod) % 10 == last) ? true : false;
		},
		checkForeign : function(value) {
			var num;
			var sum=0;
			var odd=0;

			if (!/^([0-9]{6})-?([0-9]{7})$/.test(value)) return false;
			num = value.replace(/[^0-9]/g, '');

			var odd = (num.charCodeAt(7) - 0x30) * 10 + (num.charCodeAt(8) - 0x30);
			if(odd%2 != 0) return false;
			if((num.charCodeAt(11) - 0x30) < 6) return false;
			if((num.charCodeAt(6) - 0x30) < 5) return false;

			var last = num.charCodeAt(12) - 0x30;
			var bases = "234567892345";

			for(i=0; i<12; i++) {
				sum += ((num.charCodeAt(i) - 0x30) * (bases.charCodeAt(i) - 0x30));
			}
			sum = 11 - (sum%11);

			if(sum >= 10) sum -= 10;
			sum += 2;
			if(sum >= 10) sum -= 10;

			return sum == last ? true : false;			
		},
		checkBizNo : function(value) {
			if (value instanceof Array) {
				value = value.join('-');
			}
			if (!/(^[0-9]{3})-?([0-9]{2})-?([0-9]{5}$)/.test(value)) return false;
			num = value.replace(/[^0-9]/g, '');
			var cVal = 0;
			for (var i=0; i<8; i++) {
				var cKeyNum = parseInt(((_tmp = i % 3) == 0) ? 1 : ( _tmp == 1 ) ? 3 : 7);
				cVal += (parseFloat(num.substring(i,i+1)) * cKeyNum) % 10;
			}
			var li_temp = parseFloat(num.substring(i,i+1)) * 5 + "0";
			cVal += parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));

			var last_checknum = (cVal % 10) % 10;
			last_checknum = last_checknum > 0 ? 10 - last_checknum : last_checknum;
			return (parseInt(num.substring(9,10)) == last_checknum) ? true : false;
		},
		checkPhone : function(value) {
			if (value instanceof Array) {
				value = value.join('-');
			}
			return (/^([0][0-9]{1,2})-?([1-9][0-9]{2,3})-?([0-9]{4})$/.test(value)) ? true : false;
		},
		checkMobile : function(value) {
			if (value instanceof Array) {
				value = value.join('-');
			}
			return (/^(01[016-9])-?([1-9][0-9]{2,3})-?([0-9]{4})$/.test(value)) ? true : false;
		},
		checkNumber : function(value) {
			return (/^[0-9]+$/.test(value)) ? true : false;
		},
		checkDate : function(value) {
			// YYYY-MM-DD only
			value = value.replace(/[^0-9]/, '-');
			if (!/^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(value)) {
				return false;
			}

			var tmp = value.split('-');
			var date = new Date(tmp[0], tmp[1]-1, tmp[2]);
			return (value == date.getFullYear() + '-' + ('0'+(date.getMonth()+1)).slice(-2) + '-' + ('0'+date.getDate()).slice(-2)) ? true : false;
		}
	});
	Form.Checker.prototype.check = Form.Checker.prototype.addCheck;
