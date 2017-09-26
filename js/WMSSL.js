// Namespace
var WMSSL = {}
WMSSL.sessionNS = '__sys_ssl_data';
WMSSL.encForm = '__sys_form_encrypted_data';
WMSSL.debug = false;
WMSSL.isConnected = false;
WMSSL.connectUrl = null;
WMSSL.rsaPublicKey = '';
WMSSL.ENC_PREFIX = '[##_ENC_##]';
WMSSL.ENC_SEPERATOR = '||^||';

WMSSL.connect = function(url) {
	var res = WMSSL.getRSAPublicKey(url);
	WMSSL.rsaPublicKey = res;
	WMSSL.connectUrl = url;
	WMSSL.isConnected = true;
}

WMSSL.RSA = function() {
	this.bits = 512;
	this.radix = '10001';

	var _rsakey = new JSBN.RSA.RSAKey();
	var _keys = new Array();
	var _dbit = 256;

	this.encrypt = function(plaintext, pk) {
		var res = pk.split('|');
		_rsakey.setPublic(res[0], res[1]);
		var enc = _rsakey.encrypt(plaintext);
		return JSBN.RSA.linebrk(enc, 256); 
	}

	this.generate = function() {
		_rsakey.generate(this.bits, this.radix);
		_keys['n'] = JSBN.RSA.linebrk(_rsakey.n.toString(16),_dbit);
		_keys['d'] = JSBN.RSA.linebrk(_rsakey.d.toString(16),_dbit);
		_keys['p'] = JSBN.RSA.linebrk(_rsakey.p.toString(16),_dbit);
		_keys['q'] = JSBN.RSA.linebrk(_rsakey.q.toString(16),_dbit);
		_keys['dmp1'] = JSBN.RSA.linebrk(_rsakey.dmp1.toString(16),_dbit);
		_keys['dmq1'] = JSBN.RSA.linebrk(_rsakey.dmq1.toString(16),_dbit);
		_keys['coeff'] = JSBN.RSA.linebrk(_rsakey.coeff.toString(16),_dbit);
		_keys['e'] = this.radix;
		return this;
	}

	this.getKeys = function() {
		return _keys;
	}

	this.setKeys = function(keys) {
		if(typeof keys == 'object') _keys = keys;
	}

	this.setPrivateEx = function(n,e,d,p,q,dmp1,dmq1,coeff) {
		_rsakey.setPrivateEx(n, e, d, p, q, dmp1, dmq1, coeff);
	}

	this.setPrivate = function(n,e,d) {
		_rsakey.setPrivate(n, e, d);
	}

	this.decrypt = function(ctext) {
		return _rsakey.decrypt(ctext);
	}

	this.sendPublicKey = function() {
		if(_keys.length < 1) this.generate();
		return _keys['n'] + '|' + _keys['e'];
	}
}

WMSSL.AES = function() {
	this.bits = 256;
	this.keySize = 16;

	this.generateKey = function(nn) {
		var v, n = !nn || isNaN(nn) ? this.keySize : nn, ret = [];
		for (var x=0; x<n; x++) {
			v = Math.floor(Math.random() * 257);
			if (v == 0 || v == 257) { x--; continue; }
			ret[ret.length] = v;
		}
		var s = '';
  		for (var i=0; i<ret.length; i++) s += ret[i].toString(16);
		return s;
	}

	this.encrypt = function(plaintext, key) {
		return Aes.Ctr.encrypt(plaintext, key, this.bits);
	}

	this.decrypt = function(ciphertext, key) {
		return Aes.Ctr.decrypt(ciphertext, key, this.bits);
	}
}

WMSSL.getRSAPublicKey = function(url, callback, conn) {
	var oAjax = new WMSSL.Ajax(url);
	oAjax.async = false;
	oAjax.setParam('mode', 'get_rsa_key');
	if(conn) oAjax.setParam('conn', conn);
	var result = '';
	oAjax.send(function(xhr, text){
		result = text;
	});
	oAjax = null;
	return result;
}

WMSSL.encElement = new Array();
WMSSL.addElement = function(val) {
	WMSSL.encElement.push(val);
}
WMSSL.getElement = function(key) {
	return WMSSL.encElement[key];
}
WMSSL.getElements = function() {
	return WMSSL.encElement;
}

WMSSL.submit = function(form, opts) {
	if(!WMSSL.isConnected) return;
	if(!WMSSL.rsaPublicKey) return;
	if(!opts) opts = {}
	var BUCKET_SIZE = 2048;
	var _mode = (opts.mode)? opts.mode : 'plain';
	var _callback = (opts.callback)? opts.callback : null;
	var aes = new WMSSL.AES();
	var aesKey = aes.generateKey();
	var fe = form.elements;
	var _sendElm = new Array();
	var _files = new Array();
	for(var i=0; i<fe.length; i++) {
		var _ev = '';
		var _et = '';
		var _mustEncrypt = false;
		var _ce = fe[i];
		if(_ce.getAttribute('disabled')) continue;
		var _en = _ce.name;
		if(!_en) continue;
		if(_ce.getAttribute('encrypt') == 'true' || WMSSL.Helper.inArray(WMSSL.getElements(), _en) ) _mustEncrypt = true;
		switch(_ce.nodeName.toLowerCase()) {
			case 'input':
				_et = _ce.getAttribute('type').toLowerCase();
				switch(_et) {
					case 'radio':
					case 'checkbox':
						if(_ce.checked) _ev = _ce.value;
						break;
					case 'file': 
						continue;
						break;
					case 'button':
					case 'submit':
					case 'cancel':
						continue;
						break;
					case 'text':
					case 'password':
					case 'hidden':
					default:
						_ev = _ce.value;
						break;
				}
				break;

			case 'select':
				if(_ce.options && _ce.options.length > 0 && _ce.selectedIndex > -1) _ev = _ce.options[_ce.selectedIndex].value;
				break;

			case 'textarea':
				_ev = _ce.value;
				break;
		}
		
		var _value = '';
		if(_mustEncrypt) {
			var _len = _ev.length;
			var _result = _ev;
			if(_len > BUCKET_SIZE) {
				var _cnt = Math.ceil(_len / BUCKET_SIZE);
				var _buff = new Array();
				for(var i=0; i < _cnt; i++) {
					var _start = i * BUCKET_SIZE;
					var _tmp = aes.encrypt(_ev.substr(_start, BUCKET_SIZE), aesKey);
					_buff.push(_tmp);
				}

				_result = _buff.join(WMSSL.ENC_SEPERATOR);
			} else {
				_result = aes.encrypt(_ev, aesKey);
			}
			_value = WMSSL.ENC_PREFIX + _result;
		}
		else _value = _ev;
		_value = encodeURIComponent(_value);
		if(_ev) _sendElm.push({'name':_en, 'value':_value});
	}
	var rsa = new WMSSL.RSA();
	encAesKey = rsa.encrypt(aesKey, WMSSL.rsaPublicKey);
	_sendElm.push({'name':'__sys_dat_enc_key', 'value':encAesKey});
	switch(_mode) {
		case 'ajax':
			_sendElm.push({'name':'__sys_dat_mode', 'value':'ajax'});
			var oAjax = new WMSSL.Ajax(form.action);
			for(var ii=0; ii<_sendElm.length; ii++) {
				oAjax.setParam(_sendElm[ii].name, _sendElm[ii].value);
			}
			oAjax.send(_callback);
			break;	
		case 'plain':
		default:
			_sendElm.push({'name':'__sys_dat_mode', 'value':'plain'});
			form.onsubmit = function() { return false; }
			var pForm = WMSSL.Helper.createSendForm(_sendElm);
			pForm.action = form.action;
			if(form.method) pForm.method = form.method;
			if(form.target) pForm.target = form.target;
			pForm.submit();
			break;
	}
}

WMSSL.decrypt = function() {
	if(!WMSSL.isConnected) return;
	if(!WMSSL.rsaPublicKey) return;
	if(!document.forms[WMSSL.encForm]) return;
	var oForm = document.forms[WMSSL.encForm];
	var aes = new WMSSL.AES();
	var aesKey = aes.generateKey();

	WMSSL.addDebugMessage('aesKey: ' + aesKey);
	
	var rsa = new WMSSL.RSA();
	WMSSL.addDebugMessage('rsaPublicKey: ' +  WMSSL.rsaPublicKey);
	encAesKey = rsa.encrypt(aesKey, WMSSL.rsaPublicKey);
	WMSSL.addDebugMessage('encAesKey: ' +  encAesKey);
	var oAjax = new WMSSL.Ajax(WMSSL.connectUrl);
	oAjax.setParam('mode', 'get_aes_key');
	oAjax.setParam('pk', encAesKey);
	oAjax.setParam('session_key', oForm.elements['session_key'].value);
	var password = '';
	oAjax.send(function(xhr, text){
		password = text;
	});
	WMSSL.addDebugMessage('password: ' + password);
	password = aes.decrypt(password, aesKey);
	WMSSL.addDebugMessage('password(2): ' + password);



	for(var i=0; i<oForm.elements.length; i++) {
		if(oForm.elements[i].nodeName.toLowerCase() == 'input' && oForm.elements[i].getAttribute('type') == 'hidden') {
			var nodeType, accessor, name;
			var _nameToken = oForm.elements[i].name.split('.');
			if(_nameToken.length > 1) {
				if(_nameToken[0].toLowerCase() != 'form') continue;
				nodeType = 'form';
				accessor = _nameToken[1];
				name = _nameToken[2];
			} else {
				nodeType = 'text';
				accessor = oForm.elements[i].name;
			}
			var value = aes.decrypt(oForm.elements[i].value, password);
				
			switch(nodeType) {
				case 'form':
					if(!document.forms[accessor].elements[name]) continue;
					var _tObj = document.forms[accessor].elements[name];
					var _nodeName;
					if(_tObj.nodeName) {
						_nodeName = _tObj.nodeName.toLowerCase();
					} else if(_tObj.length) {
						_nodeName = _tObj[0].nodeName.toLowerCase();
					} else {
						continue;
					}

					switch(_nodeName) {
						case 'input':
							var _type = '';
							if(_tObj.length) {
								_type = _tObj[0].getAttribute('type').toLowerCase();
							} else {
								_type = _tObj.getAttribute('type').toLowerCase();
							}
							switch(_type) {
								case 'text':
								case 'password':
								case 'hidden':
									_tObj.value = value;
									_tObj.setAttribute('encrypt', 'true');
									break;
								case 'checkbox':
									var _valToken = value.split('|@|');
									for(var j=0; j<_tObj.length; j++) {
										if(value.search(_tObj[j].value) > -1) {
											_tObj[j].setAttribute('checked', 'true');
											_tObj[j].setAttribute('encrypt', 'true');
										}
									}
									break;
								case 'radio':
									for(var j=0; j<_tObj.length; j++) {
										if(_tObj[j].value == value) { 
											_tObj[j].setAttribute('checked', 'true');
											_tObj[j].setAttribute('encrypt', 'true');
										}
									}
									break;
								default:
									continue;
									break;
							}
							break;
						case 'select':
							_tObj.setAttribute('encrypt', 'true');
							for(var j=0; j<_tObj.options.length; j++) {
								if(_tObj.options[j].value == value) _tObj[j].selected = 'selected';
							}
							break;
						case 'textarea':
							_tObj.innerHTML = value;
							_tObj.setAttribute('encrypt', 'true');
							break;
					}
					
					break;
				case 'text':
					if(!document.getElementsByName(accessor)) continue;
					document.getElementsByName(accessor).innerHTML = value;
					break;
			}
			oForm.elements[i].value = '';
		}
	}
	WMSSL.DOM.removeMe(oForm);
}

// DADDY
WMSSL.decryptData = function(data, password) {

	if(!data) return data;
	if(!(data['session_key'] || password)) return data;

	if (!WMSSL.isConnected) return data;
	if (!WMSSL.rsaPublicKey) return data;

		var aes = new WMSSL.AES();

	if( !password ) {
	
		var aesKey = aes.generateKey();
		WMSSL.addDebugMessage('aesKey: ' + aesKey);
	
		var rsa = new WMSSL.RSA();
		WMSSL.addDebugMessage('rsaPublicKey: ' +  WMSSL.rsaPublicKey);
		encAesKey = rsa.encrypt(aesKey, WMSSL.rsaPublicKey);
		WMSSL.addDebugMessage('encAesKey: ' +  encAesKey);
		var oAjax = new WMSSL.Ajax(WMSSL.connectUrl);
		oAjax.setParam('mode', 'get_aes_key');
		oAjax.setParam('pk', encAesKey);
		oAjax.setParam('session_key', data['session_key']);
		var password = '';
		oAjax.send(function(xhr, text){
			password = text;
		});
		WMSSL.addDebugMessage('password: ' + password);
		password = aes.decrypt(password, aesKey);
		WMSSL.addDebugMessage('password(2): ' + password);
	}

	for (key in data) {

		if (!data.hasOwnProperty(key)) {
			continue;
		}

		if (key == 'session_key') {
			continue;
		}
		if (typeof data[key] == 'function') {
			continue;
		}

		if( typeof data[key] == 'object' ) {		
			data[key] = WMSSL.decryptData(data[key], password);
		} else {
			data[key] = aes.decrypt(data[key], password);
		}
	}
	return data;
}

WMSSL.Ajax = function(turl) {
	var _params = new Array();

	this.url = turl;
	this.method = 'POST';
	this.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
	this.async = false;
	this.returnType = 'text';

	this.send = function(callback) {
		var _return;
		var xhr = getHTTPObject();
		if(xhr) {
			xhr.onreadystatechange = function() {
				if(xhr.readyState == 4) {
					if(xhr.status == 200 || xhr.status == 304) {
						var result = null;
						switch(this.returnType) {
							case 'xml':
								result = xhr.resposeXML;
								break;
							case 'json':
								result = eval('(' + xhr.responseText + ')')
								break;
							case 'text':
							default:
								result = xhr.responseText;
								break;
						}
						if(callback) callback(xhr, result);
					}
				}
			}
			xhr.open(this.method.toUpperCase(), this.url, this.async);
			xhr.setRequestHeader('Content-Type', this.contentType);
			xhr.send(createQuery());
			_return = xhr;
		} else {
			_return = false;
		}
		return _return;
	}

	this.setParam = function(key, val) {
		_params.push(key + '=' + val);
	}

	var createQuery = function() {
		var _len = _params.length;
		if(_len < 1) return '';
		return _params.join('&');
	}

	var getHTTPObject = function() {
		if(window.XMLHttpRequest) return new XMLHttpRequest();
		if(window.ActiveXObject) {
			try {
				return new ActiveXObject("Msxm12.XMLHTTP");
			} catch(e) {
				try	{
					return new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					return false;
				}
			}
		}
	}
}

WMSSL.addDebugMessage = function(msg) {
	if(!WMSSL.debug) return;
	if(typeof jQuery == 'undefined') return;
	jQuery(document.body).append('<div>' + msg + '</div>');
}

WMSSL.DOM = {
	removeMe:function(obj) {
		obj.parentNode.removeChild(obj);
	}
}

WMSSL.Helper = {
	inArray : function(array, keyword) {
		if(typeof array != 'object') return;
		if(array.length <=0 ) return;

		var _l = array.length;
		var _return = false;
		for(var i=0; i<_l; i++) {
			if(array[i] == keyword) {
				_return = true;
				break;
			}
		}
		return _return;
	},

	createSendForm : function(_sendElm) {
		var _fn = '__sys_form_whoisssl_plain';
		var oForm = null;
		if(!document.forms[_fn]) {
			var oForm = document.createElement('form');
			oForm.setAttribute('name', _fn);
			oForm.setAttribute('method', 'post');
			oForm.setAttribute('action', '');
			oForm.onsumit = function() {return false;}
			document.body.appendChild(oForm);
		} else {
			oForm = document.forms[_fn];
		}

		for(var i=0;i<_sendElm.length; i++) {
			var inputs = oForm.getElementsByTagName('input');
			var exists = false;
			var _name = _sendElm[i].name.replace('[]', ''); // DADDY
			var _value = _sendElm[i].value;
			for(var j=0; j<inputs.length; j++) {
				if(inputs[j].getAttribute('name') == _name) {
					exists = true;
					inputs[j].value += '|@|' + _value;
					break;
				}
			}

			if(!exists) {
				var oInput = document.createElement('input');
				oInput.setAttribute('type', 'hidden');
				oInput.setAttribute('name', _name);
				oInput.value = _value;
				oForm.appendChild(oInput);
			}
		}
		return oForm;
	},

	createQueryString : function(_sendElm) {
		var buff = new Array();
		for(var i=0; i<_sendElm.length; i++) {
			buff.push(_sendElm[i].name + '=' + _sendElm[i].value);
		}
		return buff.join('&');
	}
}