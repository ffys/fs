// ================================================================
//                       CHEditor 5.1.2
// ----------------------------------------------------------------
// Author: Na Chang Ho
// Website: http://www.chcode.com
// EMail: support@chcode.com
// Copyright (c) 1997-2014 CHSOFT
// ================================================================
var userAgent = navigator.userAgent.toLowerCase();
var DragWindow = null, prettify = null;
var GB = {
	colors : ["#ffffff", "#000000", "#eeece1", "#1f497d", "#4f81bd", "#c0504d", "#9bbb59", "#8064a2", "#4bacc6", "#f79646",
			  "#f2f2f2", "#7f7f7f", "#ddd9c3", "#c6d9f0", "#dbe5f1", "#f2dcdb", "#ebf1dd", "#e5e0ec", "#dbeef3", "#fdeada",
			  "#d8d8d8", "#595959", "#c4bd97", "#8db3e2", "#b8cce4", "#e5b9b7", "#d7e3bc", "#ccc1d9", "#b7dde8", "#fbd5b5",
			  "#bfbfbf", "#3f3f3f", "#938953", "#548dd4", "#95b3d7", "#d99694", "#c3d69b", "#b2a2c7", "#92cddc", "#fac08f",
			  "#a5a5a5", "#262626", "#494429", "#17365d", "#366092", "#953734", "#76923c", "#5f497a", "#31859b", "#e36c09",
			  "#7f7f7f", "#0c0c0c", "#1d1b10", "#0f243e", "#244061", "#632423", "#4f6128", "#3f3151", "#205867", "#974806",
			  "#c00000", "#ff0000", "#ffc000", "#ffff00", "#92d050", "#00b050", "#00b0f0", "#0070c0", "#002060", "#7030a0"],

	offElements : { IMG:1, HR:1, TABLE:1, EMBED:1, OBJECT:1, INPUT:1, FORM:1, SELECT:1, TEXTAREA:1, BUTTON:1, FIELDSET:1 },
	emptyElements : { area:1, base:1, basefont:1, col:1, frame:1, hr:1, img:1, br:1, input:1, isindex:1, link:1, meta:1,
                      param:1, source:1, track:1, wbr:1, keygen:1, menuitem:1 },
    newLineBefore : '|div|p|table|tbody|tr|td|th|title|head|body|script|comment|li|meta|h1|h2|h3|h4|h5|h6|hr|ul|ol|option|link|',
    lineHeightBlock : '|address|blockquote|dd|div|dl|h1|h2|h3|h4|h5|h6|li|p|pre|td|',
    xhtmlDTD : '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
	browser     : { msie    : /msie/.test(userAgent) && !/opera/.test(userAgent),
                    iegecko :  /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/i.test(userAgent),
					ver     : (userAgent.match(/.+(?:rv|it|ra|ie|version)[\/: ]([\d.]+)/))[1],
					gecko   : /gecko/.test(userAgent),
					opera   : /opera/.test(userAgent),
                    chrome  : /chrome/.test(userAgent),
					safari  : /webkit/.test(userAgent),
					mozilla : (/mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)) || /firefox/.test(userAgent)
	},

	popupWindow : {ImageUpload :    { tmpl : 'image.html',          width : 700, posv: 420, title : '내 PC 사진 넣기' },
				   ImageUrl :       { tmpl : 'image_url.html',      width : 350, posv: 380, title : '웹 사진 넣기' },
				   Embed :          { tmpl : 'media.html',          width : 430, posv: 380, title : '미디어' },
				   Table :          { tmpl : 'table.html',          width : 430, posv: 390, title : '표 만들기' },
				   ModifyTable :    { tmpl : 'table_modify.html',   width : 430, posv: 390, title : '표 고치기' },
				   Layout :         { tmpl : 'layout.html',         width : 430, posv: 420, title : '레이아웃' },
				   Link :           { tmpl : 'link.html',           width : 350, posv: 200, title : '하이퍼링크' },
				   EmotionIcon :    { tmpl : 'icon.html',           width : 300, posv: 200, title : '표정 아이콘' },
				   Symbol :         { tmpl : 'symbol.html',         width : 450, posv: 300, title : '특수 문자' },
				   GoogleMap :      { tmpl : 'google_map.html',     width : 538, posv: 450, title : '구글 지도' },
				   ColorPicker :	{ tmpl : 'color_picker.html',	width : 420, posv: 200, title : '색상 선택' },
				   FlashMovie :     { tmpl : 'flash.html',          width : 584, posv: 474, title : '플래쉬 동영상' }},

	fontName    : { 'kr' : ['맑은 고딕', '돋움', '굴림', '바탕', '궁서'],
					'en' : ['Arial', 'Comic Sans MS', 'Courier New', 'Georgia',
					        'Lucida Sans Unicode', 'Tahoma', 'Times New Roman', 'Verdana'] },

    fontSize    : { '1' : '8pt',
                    '2' : '10pt',
                    '3' : '12pt',
                    '4' : '14pt',
                    '5' : '18pt',
                    '6' : '24pt',
                    '7' : '36pt',
                    'null' : null,
                    '10px' : '8pt',
                    '12px' : '9pt',
                    '13px' : '10pt',
                    '16px' : '12pt',
                    '18px' : '14pt',
                    '24px' : '18pt',
                    '32px' : '24pt',
                    '48px' : '36pt'},

    formatBlock   : { 'P' : 'Normal (P)',
					'H1' : 'Heading 1',
					'H2' : 'Heading 2',
					'H3' : 'Heading 3',
					'H4' : 'Heading 4',
					'H5' : 'Heading 5',
					'H6' : 'Heading 6',
					'ADDRESS' : 'Address',
                    'DIV' : 'DIV',
					'PRE' : 'Preformatted (PRE)' },
	lineHeight  : { '한 줄 간격': 1, '1.15': 1.15, '1.5': 1.5, '1.7': 1.7, '1.8': 1.8, '두 줄 간격': 2 },
    textBlock    : [['1px #dedfdf solid','#f7f7f7'],
				   ['1px #aee8e8 solid','#bfffff'],
				   ['1px #d3bceb solid','#e6ccff'],
				   ['1px #e8e88b solid','#ffff99'],
				   ['1px #c3e89e solid','#d6ffad'],
				   ['1px #e8c8b7 solid','#ffdcc9'],
				   ['1px #666666 dashed','#ffffff'],
				   ['1px #d4d4d4 solid','#ffffff'],
				   ['1px #cccccc inset','#f7f7f7']],

    node         : {ELEMENT_NODE                :  1,
					ATTRIBUTE_NODE              :  2,
					TEXT_NODE                   :  3,
					CDATA_SECTION_NODE          :  4,
					ENTITY_REFERENCE_NODE       :  5,
					ENTITY_NODE                 :  6,
					PROCESSING_INSTRUCTION_NODE :  7,
					COMMENT_NODE                :  8,
					DOCUMENT_NODE               :  9,
					DOCUMENT_TYPE_NODE          : 10,
					DOCUMENT_FRAGMENT_NODE      : 11,
					NOTATION_NODE               : 12},

	selection   : { SELECTION_NONE              : 1,
					SELECTION_TEXT              : 2,
					SELECTION_ELEMENT           : 3 },
    readyState  : { 0 : 'uninitialized', 1 : 'loading', 2 : 'loaded', 3 : 'interactive', 4 : 'complete' }
};

function URI (uri) {
	this.scheme    = null;
	this.authority = null;
	this.path      = '';
	this.query     = null;
	this.fragment  = null;

	this.parseUri = function (uri) {
		var m = uri.match(/^(([A-Za-z][0-9A-Za-z+.\-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);
		this.scheme    = m[3] ? m[2] : null;
		this.authority = m[5] ? m[6] : null;
		this.path      = m[7];
		this.query     = m[9] ? m[10] : null;
		this.fragment  = m[12]? m[13] : null;
		return this;
	};

	this.azToString = function () {
		var result = '';
		if (this.scheme    !== null) { result = result +      this.scheme + ':'; }
		if (this.authority !== null) { result = result +'//'+ this.authority; }
		if (this.path      !== null) { result = result +      this.path; }
		if (this.query     !== null) { result = result + '?'+ this.query; }
		if (this.fragment  !== null) { result = result + '#'+ this.fragment; }
		return result;
	};

	this.toAbsolute = function (location) {
		var baseUri = new URI(location);
		var URIAbs = this;
		var target = new URI();
		var removeDotSegments = function (path) {
			var result = '', rm;
			while (path) {
				if (path.substr(0,3) === '../' || path.substr(0,2) === './') {
					path = path.replace(/^\.+/,'').substr(1);
				}
				else if (path.substr(0,3) === '/./' || path === '/.') {
					path = '/'+path.substr(3);
				}
				else if (path.substr(0,4) === '/../' || path === '/..') {
					path = '/'+path.substr(4);
					result = result.replace(/\/?[^\/]*$/, '');
				}
				else if (path === '.' || path === '..') {
					path = '';
				}
				else {
					rm = path.match(/^\/?[^\/]*/)[0];
					path = path.substr(rm.length);
					result = result + rm;
				}
			}
			return result;
		};

		if (baseUri.scheme === null) { return false; }
		if (URIAbs.scheme !== null && URIAbs.scheme.toLowerCase() === baseUri.scheme.toLowerCase()) {
			URIAbs.scheme = null;
		}

		if (URIAbs.scheme !== null) {
			target.scheme    = URIAbs.scheme;
			target.authority = URIAbs.authority;
			target.path      = removeDotSegments(URIAbs.path);
			target.query     = URIAbs.query;
		}
		else {
			if (URIAbs.authority !== null) {
				target.authority = URIAbs.authority;
				target.path      = removeDotSegments(URIAbs.path);
				target.query     = URIAbs.query;
			}
			else {
				if (URIAbs.path === '') {
					target.path = baseUri.path;
					target.query = URIAbs.query || baseUri.query;
				}
				else {
					if (URIAbs.path.substr(0,1) === '/') {
						target.path = removeDotSegments(URIAbs.path);
					}
					else {
						if (baseUri.authority !== null && baseUri.path == '') {
							target.path = '/' + URIAbs.path;
						}
						else {
							target.path = baseUri.path.replace(/[^\/]+$/,'') + URIAbs.path;
						}
						target.path = removeDotSegments(target.path);
					}
					target.query = URIAbs.query;
				}
				target.authority = baseUri.authority;
			}
			target.scheme = baseUri.scheme;
		}
		target.fragment = URIAbs.fragment;
		return target;
	};

	if (uri) {
        this.parseUri(uri);
    }
}

function setConfig () {
    var config = {
        editorWidth     : '100%',
        editorHeight    : '300px',
        editorFontSize  : '9pt',
        editorFontName  : '맑은 고딕, 굴림, Malgun Gothic, gulim',
        editorFontColor : '#000',
        editorBgColor   : '#fff',
        imgCaptionText	: 'margin: 5px 0px; color: #333',
        lineHeight      : 1.5,
        editAreaMargin  : '5px 10px',
        tabIndex        : 0,
        editorPath      : null,
        fullHTMLSource  : false,
        linkTarget      : '_blank',
        showTagPath     : false,
        colorToHex		: true,
        imgMaxWidth     : 640,
        imgUploadNumber : 12,
        imgUploadSortName : false,
        uploadImgSpacer : true,
        makeThumbnail   : false,
        thumbnailWidth  : 120,
        thumbnailHeight : 90,
        imgBlockMargin  : '5px 0px',
        includeHostname : true,
        ieEnterMode     : 'css', // [css, div, br, default]
        outputXhtml     : true,
        xhtmlLang		: 'utf-8',
        xhtmlEncoding	: 'utf-8',
        docTitle		: '내 문서',
        template        : 'template.xml',

        // 버튼 사용 유무
        useSource       : true,
        usePreview      : true,
        usePrint        : true,
        useNewDocument  : true,
        useUndo         : true,
        useRedo         : true,
        useCopy         : true,
        useCut          : true,
        usePaste        : true,
        usePasteFromWord: true,
        useSelectAll    : true,
        useStrikethrough: true,
        useUnderline    : true,
        useItalic       : true,
        useSuperscript  : false,
        useSubscript    : false,
        useJustifyLeft  : true,
        useJustifyCenter: true,
        useJustifyRight : true,
        useJustifyFull  : true,
        useBold         : true,
        useOrderedList  : true,
        useUnOrderedList: true,
        useOutdent      : true,
        useIndent       : true,
        useFontName     : true,
        useFormatBlock  : true,
        useFontSize     : true,
        useLineHeight   : true,
        useBackColor    : true,
        useForeColor    : true,
        useRemoveFormat : true,
        useClearTag     : true,
        useSymbol       : true,
        useLink         : true,
        useUnLink       : true,
        useFlash        : true,
        useMedia        : false,
        useImage        : true,
        useImageUrl     : false,
        useSmileyIcon   : true,
        useHR           : true,
        useTable        : true,
        useModifyTable  : true,
        useMap          : true,
        useTextBlock    : true,
        useFullScreen   : true,
        usePageBreak    : false,
        allowedScript   : false,
        allowedOnEvent  : false
    };

    if (config.editorPath === null) {
        var base = location.href, editorUri, locationAbs;
        var e = document.getElementsByTagName('base'), i;
        for (i=0; i<e.length; i++) {
            if (e[i].href) {
                base = e[i].href;
            }
        }
        e = document.getElementsByTagName('script');
        for (i=0; i < e.length; i++) {
            if (e[i].src) {
                editorUri = new URI(e[i].src);
                if(/\/cheditor\.js$/.test(editorUri.path)) {
                    locationAbs = editorUri.toAbsolute(base).azToString();
                    delete locationAbs.query;
                    delete locationAbs.fragment;
                    config.editorPath = locationAbs.replace(/[^\/]+$/, '');
                }
            }
        }

        if (config.editorPath === null) {
            throw "CHEditor 경로가 바르지 않습니다.\nmyeditor.config.editorPath를 설정하여 주십시오.";
        }
    }

	this.cheditor           = {};
	this.inputForm          = null;
	this.range              = null;
	this.images             = [];
	this.editImages         = {};
	this.setFullScreenMode  = false;
	this.modalElementZIndex = 1001;
	this.toolbar            = {};
	this.pulldown           = {};
	this.tempTimer          = null;
	this.currentRS          = {};
	this.resizeEditor       = {};
    this.config             = config;
    this.templateFile       = config.template;
    this.templatePath       = config.editorPath + config.template;
    this.storedSelections   = [];
    this.W3CRange           = window.getSelection;
}

function cheditor () {
    var msg = null;

    this.toType = (function (global) {
        var toString = cheditor.prototype.toString;
        var re = /^.*\s(\w+).*$/;
        return function(obj) {
            if (obj === global) {
                return "global";
            }
            return toString.call(obj).replace(re, '$1').toLowerCase();
        };
    }(this));

    this.undefined = (function(global) {
        return function(obj) {
            return obj === void 0;
        };
    }(this));

	if (this.undefined(document.execCommand)) {
		msg = "현재 브라우저가 execCommand를 지원하지 않습니다.\nCHEditor를 사용할 수 없습니다.";
	}
	if (GB.browser.msie && GB.browser.ver < 6) {
		msg = "\nCHEditor는 MSIE 6 이하 버전을 지원하지 않습니다.";
	}
	if (GB.browser.gecko) {
		if (navigator.productSub < 20030107) {
			msg = "CHEditor는 현재 사용 중인 브라우저를 지원하지 않습니다.";
        }
	}

    if (msg !== null) {
        alert(msg);
		return null;
    }

    try {
	    setConfig.call(this);
    } catch (e) {
        alert(e.toString());
        return null;
    }

    return this;
}

cheditor.prototype = {
//----------------------------------------------------------------
resetData : function () {
	this.resetEditArea();
	if (GB.browser.msie || GB.browser.iegecko) {
		try { document.execCommand('BackgroundImageCache', false, true); }
		catch (ignore) {}
	}
},

appendContents : function (contents) {
	this.editAreaFocus();
	var div = this.doc.createElement('div');
	div.innerHTML = String(this.trimSpace(contents));

    while (div.hasChildNodes()) {
		this.doc.body.appendChild(div.firstChild);
    }

	this.editAreaFocus();
},

insertContents : function (contents) {
	this.editAreaFocus();
	this.doCmdPaste(String(this.trimSpace(contents)));
},

replaceContents : function (contents) {
	this.editAreaFocus();
	this.doc.body.innerHTML = '';
	this.loadContents(contents);
	this.editAreaFocus();
},

loadContents : function (contents) {
	if (typeof contents === 'string') {
		contents = this.trimSpace(contents);
		if (contents !== '') {
			this.cheditor.editArea.style.visibility = 'hidden';
			this.doc.body.innerHTML = contents;
			this.cheditor.editArea.style.visibility = 'visible';
		}
	}
},

loadScript : function (path) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = path;
	var head = document.getElementsByTagName("head")[0] || document.documentElement;
	var done = false;

	script.onload = script.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"))
		{
		    done = true;
		    head.removeChild(script);
		}
	};

	head.appendChild(script);
},

setFolderPath : function () {
	if (this.config.editorPath.charAt(this.config.editorPath.length-1) !== '/') {
		this.config.editorPath += '/';
    }

	this.config.iconPath  = this.config.editorPath + 'icons/';
	this.config.cssPath   = this.config.editorPath + 'css/';
	this.config.popupPath = this.config.editorPath + 'popup/';
},

checkInputForm : function () {
	var textarea = this.$(this.inputForm);
	if (!textarea) {
		throw("ID가 '"+this.inputForm+"'인 textarea 개체를 찾을 수 없습니다.");
    }

	textarea.style.display = 'none';
	this.cheditor.textarea = textarea;
},

setDesignMode : function (designMode) {
	if (GB.browser.msie) {
        this.doc.body.contentEditable = designMode;
	}
	else {
        this.doc.designMode  = designMode ? "on" : "off";
	}
},

openDoc : function (doc, contents) {
	doc.open();
	var html = '<html><head><title>'+this.config.docTitle+'</title><style></style></head><body>';

	if (typeof contents === 'string') {
		html += this.trimSpace(contents);
	}

	html += '</body></html>';
	doc.write(html);
	doc.close();
},

getWindowHandle : function (iframeObj) {
	var iframeWin;
	if (iframeObj.contentWindow) {
		iframeWin = iframeObj.contentWindow;
    }
	else {
		throw '현재 브라우저에서 에디터를 실행할 수 없습니다.';
    }
	return iframeWin;
},

resetDoc : function () {
	try {
		this.editArea = this.getWindowHandle(this.cheditor.editArea);
		this.doc = GB.browser.msie ? this.editArea.document : this.cheditor.editArea.contentDocument;
		this.resetData();
		return true;
	}
	catch (e) {
		alert(e.toString());
		return false;
	}
},

resetEditArea : function () {
	this.openDoc(this.doc, this.cheditor.textarea.value);
	this.setDesignMode(true);

    if (GB.browser.chrome || GB.browser.safari) {
        this.doc.body.spellcheck = false;
    }

	var oSheet = this.doc.styleSheets[0];
	if (!this.W3CRange) {
		oSheet.addRule('body', 'font-size:' + this.config.editorFontSize +
			';font-family:' + this.config.editorFontName +
			';color:' + this.config.editorFontColor +
			';margin:' + this.config.editAreaMargin +
			';line-height:' + this.config.lineHeight +
			';background-color:' + this.config.editorBgColor);
		oSheet.addRule('table', 'font-size:' + this.config.editorFontSize +
			';line-height:' + this.config.lineHeight);
	}
	else {
		oSheet.insertRule('body {font-size: ' + this.config.editorFontSize +
			';font-family: ' + this.config.editorFontName +
			';color: ' + this.config.editorFontColor +
			';margin: ' + this.config.editAreaMargin +
			';line-height:' + this.config.lineHeight +
			';background-color:' + this.config.editorBgColor + '}', 0);
		oSheet.insertRule('table {font-size: ' + this.config.editorFontSize +
			';line-height:' + this.config.lineHeight + '}', 1);
	}

    var self = this;
    self.cheditor.pasteFunc = function(event) { self.handlePaste(event); };
    this.addEvent(this.doc.body, "paste", self.cheditor.pasteFunc);
},

handlePaste : function (ev) {
    if (this.cheditor.mode === "preview") {
        return;
    }

    this.stopEvent(ev);

    var text = '';
    var clip = (ev.originalEvent || ev).clipboardData;

    if (this.undefined(clip) || clip === null) {
        text = this.trimSpace(window.clipboardData.getData("Text"));
    }
    else {
        text = this.trimSpace(clip.getData('text/plain'));
    }

    if (text !== '') {
        if (this.cheditor.mode === "code") {
            var div = this.doc.createElement('div');
            text = this.htmlEncode(text);
            if (GB.browser.msie && GB.browser.ver < 9) {
                text = text.replace(/[\r]/g, "");
                text = text.replace(/[\n]/g, "<br>");
                text = text.replace(/\t/g, "__CHEDITOR_TAB_SPACE__");
                text = text.replace(/\s/gm, "&nbsp;");
            }
            div.innerHTML = text;
            div.id = "clipboardData";
            this.insertHTML(div);
            prettify.initHighlightingOnLoad(['html', 'javascript', 'css'], this, true);
        }
        else if (this.cheditor.mode === "rich") {
            text = text.replace(/[\r]/g, "");
            text = text.replace(/[\n]/g, "<br>");
            this.insertHTML(text);
        }
    }
},

editAreaFocus : function () {
    this.doc.body.focus();
},

resizeGetY : function (ev) {
	return GB.browser.msie ?
			window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop :
				ev.clientY + window.pageYOffset;
},

resizeStart : function (ev) {
	var self = this;
	self.currentRS.elNode = self.cheditor.editArea;
	self.currentRS.cursorStartY = self.resizeGetY(ev);
	self.currentRS.elStartTop = parseInt(self.currentRS.elNode.style.height, 10);

	if (isNaN(self.currentRS.elStartTop)) {
        self.currentRS.elStartTop = 0;
    }

	ev = ev || window.event;

	self.resizeEditor.stopFunc = function(event) { self.resizeStop(event); };
	self.resizeEditor.moveFunc = function(event) { self.resizeMove(event); };

	if (GB.browser.msie) {
        self.setDesignMode(false);
    }

	self.currentRS.elNode.style.visibility = 'hidden';
	self.addEvent(document, "mousemove", self.resizeEditor.moveFunc);
	self.addEvent(document, "mouseup", self.resizeEditor.stopFunc);
	self.stopEvent(ev);
},

resizeMove : function (ev) {
	var Y = this.resizeGetY(ev);
	var H = this.currentRS.elStartTop + Y - this.currentRS.cursorStartY;
	if (H < 1) {
		this.resizeStop(ev);
		H = 1;
	}
	this.config.editorHeight = this.currentRS.elNode.style.height  = H + 'px';
	this.stopEvent(ev);
},

resizeStop : function (ev) {
	this.removeEvent(document, "mouseup", this.resizeEditor.stopFunc);
	this.removeEvent(document, "mousemove", this.resizeEditor.moveFunc);
	this.stopEvent(ev);
	this.currentRS.elNode.style.visibility = 'visible';
    if (GB.browser.msie) {
        this.setDesignMode(true);
    }
	this.editAreaFocus();
},

switchEditorMode : function (changeMode) {
    var i, className;
    this.editAreaFocus();
	if (this.cheditor.mode === changeMode) {
        return;
    }

	for (i in this.cheditor.modetab) {
        if (this.cheditor.modetab.hasOwnProperty(i)) {
		    className = this.cheditor.modetab[i].className;
		    className = className.replace(/\-off$/,'');
		    if (i !== changeMode) {
			    this.cheditor.modetab[i].className = className + '-off';
		    }
		    else {
			    this.cheditor.modetab[i].className = className;
		    }
        }
	}

	switch (changeMode) {
		case 'rich' :
			this.richMode();
			this.showTagSelector(true);
			break;
		case 'code' :
            this.editMode();
			this.showTagSelector(false);
			break;
		case 'preview' :
			this.previewMode();
			this.showTagSelector(false);
			break;
		default : break;
	}

    this.cheditor.mode = changeMode;
},

initTemplate : function () {
    var self = this;
    var xmlDoc = null;
    var outputError = function(msg) {
        alert(self.templateFile + ' 파일 로딩 중 오류가 발생하였습니다.\n원인: ' + msg);
    };

    if (window.ActiveXObject) {
        xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.onreadystatechange = function() {
            if (xmlDoc.readyState == 4) {
                try {
                    self.xmlDoc = xmlDoc;
                    self.loadTemplate(xmlDoc);
                } catch(e) {
                    outputError(e.toString());
                }
            }
        };

        xmlDoc.load(self.templatePath);
    }
    else if (window.XMLHttpRequest) {
        xmlDoc = new XMLHttpRequest();
        if (xmlDoc.overrideMimeType) {
            xmlDoc.overrideMimeType('text/xml');
        }

        xmlDoc.onload = function() {
            try {
                self.xmlDoc = xmlDoc.responseXML;
                self.loadTemplate(xmlDoc.responseXML);
            } catch(e) {
                outputError(e.toString());
            }
        };

        xmlDoc.open("GET", self.templatePath, false);
        xmlDoc.send('');
    }
    else {
        outputError("현재 브라우저에서 "+self.templateFile+" 파일을 사용할 수 없습니다.");
    }
},

getCDATASection : function (node) {
	var text = node.textContent || node.text;
	text = text.replace(/\n/g, '');
	text = text.replace(/(\s+?)<([^>]*)>/g, '<$2>');
	text = this.trimSpace(text);
	return text;
}, 

setToolbarBgPosition : function (elem, attr) {
	elem.style.backgroundPosition = attr;
},

getToolbarBgPosition : function (elem) {
	var pos;
	switch (elem.className) {
		case 'cheditor-tb-bg'           : pos = 3; break;
		case 'cheditor-tb-bg-last'      : pos = 6; break;
		case 'cheditor-tb-bg-single'    : pos = 9; break;
		case 'cheditor-tb-bg30-first'   : pos = 12; break;
		case 'cheditor-tb-bg30'         : pos = 15; break;
		case 'cheditor-tb-bg30-last'    : pos = 18; break;
		case 'cheditor-tb-bg55'         : pos = 21; break;
		case 'cheditor-tb-bg40'         : pos = 24; break;
        case 'cheditor-tb-bg44'         : pos = 27; break;
		default : pos = 0;
	}
	return pos;
},

toolbarPreviousChecked : function (elem) {
	var prevName = elem.previousSibling.getAttribute('name');
	if (prevName && this.toolbar[prevName]['checked']) {
		return this.toolbar[prevName].button;
	}
	return false;
},

toolbarNextChecked : function (elem) {
	var nextName = elem.nextSibling.getAttribute('name');
	if (nextName && this.toolbar[nextName]['checked']) {
		return this.toolbar[nextName].button;
	}
	return false;
},

toolbarMouseOverUp : function (elem) {
	this.setToolbarBgPosition(elem, "0 " + (~(((this.getToolbarBgPosition(elem) + 1) * elem.getAttribute('btnHeight'))) + 1) + 'px');

	if (elem.getAttribute('name') === 'ForeColor' && elem.previousSibling.checked) {
		this.setToolbarBgPosition(elem.previousSibling, (~(elem.previousSibling.getAttribute('btnWidth')) + 1) + "px " +
            (~((this.getToolbarBgPosition(elem.previousSibling)+2) * elem.previousSibling.getAttribute('btnHeight')) + 1) + 'px');
		return;
	}

	if (elem.previousSibling && elem.previousSibling.getAttribute('btnWidth')) {
		var previous = this.toolbarPreviousChecked(elem);
		if (previous) {
			this.setToolbarBgPosition(previous, (~(previous.getAttribute('btnWidth')) + 1) + "px " +
				(~((this.getToolbarBgPosition(previous) + 2) * previous.getAttribute('btnHeight')) + 1) + 'px');
			return;
		}

		if (elem.previousSibling.className === 'cheditor-tb-bg-first') {
			this.setToolbarBgPosition(elem.previousSibling, (~(elem.previousSibling.getAttribute('btnWidth'))+1) + "px 0");
		}
		else {
			this.setToolbarBgPosition(elem.previousSibling, (~(elem.previousSibling.getAttribute('btnWidth')) + 1) + "px " +
                (~(this.getToolbarBgPosition(elem.previousSibling) * elem.previousSibling.getAttribute('btnHeight')) + 1) + 'px');
		}
	}
},

toolbarMouseDownOut : function (elem, mousedown) {
    var nextElem = this.toolbarNextChecked(elem);
    if (nextElem && !mousedown) {
        this.setToolbarBgPosition(elem, (~(elem.getAttribute('btnWidth')*2) + 1) + "px " +
            (~(this.getToolbarBgPosition(elem) * elem.getAttribute('btnHeight')) + 1) + 'px');
    }

	var prevElem = this.toolbarPreviousChecked(elem);
	if (prevElem) {
		this.setToolbarBgPosition(prevElem, "0 " +
            (~((this.getToolbarBgPosition(prevElem) + 2) * prevElem.getAttribute('btnHeight')) + 1) + 'px');
        return;
	}

    if (mousedown) {
        this.setToolbarBgPosition(elem.previousSibling, (~(elem.previousSibling.getAttribute('btnWidth')*2) + 1) + "px " +
            (~(this.getToolbarBgPosition(elem.previousSibling) * elem.previousSibling.getAttribute('btnHeight')) + 1) + 'px');
    }
    else {
        this.setToolbarBgPosition(elem.previousSibling,
			"0 " + (~(this.getToolbarBgPosition(elem.previousSibling) * elem.previousSibling.getAttribute('btnHeight')) + 1) + 'px');
    }
},

toolbarButtonChecked : function (elem) {
	this.setToolbarBgPosition(elem, "0 " + (~((this.getToolbarBgPosition(elem) + 2) * elem.getAttribute('btnHeight')) + 1) + 'px');
    if (this.toolbarPreviousChecked(elem)) {
        return;
    }
    this.setToolbarBgPosition(elem.previousSibling, (~(elem.previousSibling.getAttribute('btnWidth')*2) + 1) + "px " +
            (~(this.getToolbarBgPosition(elem.previousSibling) * elem.previousSibling.getAttribute('btnHeight')) + 1) + 'px');
},

toolbarButtonUnchecked : function (elem) {
	this.setToolbarBgPosition(elem, "0 " + (~(this.getToolbarBgPosition(elem) * elem.getAttribute('btnHeight')) + 1) + 'px');
},

makeToolbarGrayscale : function (image) {
    var canvas = this.doc.createElement("canvas");
    var context = canvas.getContext("2d");
    var filter = function(pixels) {
        var d = pixels.data, i, r, g, b;

        for (i = 0; i < d.length; i += 4) {
            r = d[i];
            g = d[i + 1];
            b = d[i + 2];
            d[i] = d[i + 1] = d[i + 2] = (r+g+b)/3;
        }
        return pixels;
    };

    var imgWidth = image.width;
    var imgHeight = image.height;

    canvas.width = imgWidth;
    canvas.height =imgHeight;
    context.drawImage(image, 0, 0);

    var imageData = context.getImageData(0,0, imgWidth, imgHeight);
    filter(imageData);
    context.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
},

toolbarSetBackgroundImage : function (elem, disable) {
    var css = elem.firstChild.className;
    css = css.replace(/-disable$/i, "");

    if (disable) {
        if (this.cheditor.toolbarGrayscale && elem.firstChild.style.backgroundImage) {
            elem.firstChild.style.backgroundImage = 'url('+this.cheditor.toolbarGrayscale+')';
        }
        css = css + "-disable";
        elem.style.cursor = 'default';
    }
    else {
        if (this.cheditor.toolbarGrayscale && elem.firstChild.style.backgroundImage) {
            elem.firstChild.style.backgroundImage = 'url('+this.toolbar.icon+')';
        }
        elem.style.cursor = 'pointer';
    }

    elem.firstChild.className = css;
},

toolbarDisable : function (elem, disable) {
	if (disable) {
		this.toolbarSetBackgroundImage(elem, true);
		this.toolbarButtonUnchecked(elem);
		this.toolbarMouseDownOut(elem);
		this.toolbar[elem.getAttribute('name')]['disabled'] = true;
		return true;
	}

	this.toolbarSetBackgroundImage(elem, false);
	this.toolbar[elem.getAttribute('name')]['disabled'] = false;
	return false;
},

colorConvert : function (color, which, opacity) {
    if (!which) {
        which = "rgba";
	}
    color = color.replace(/^\s*#|\s*$/g, "");
	if (color.length == 3) {
        color = color.replace( /(.)/g, "$1$1" );
	}

    color = color.toLowerCase();
	which = which.toLowerCase();

	var colorDefs = [{
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            process: function (bits) {
                return [
                    parseInt(bits[1], 10),
                    parseInt(bits[2], 10),
                    parseInt(bits[3], 10),
                    1
                ];
            }
        },
        {
            re : /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+(?:\.\d+)?|\.\d+)\s*\)/,
            process: function (bits) {
                return [
                    parseInt(bits[1], 10),
                    parseInt(bits[2], 10),
                    parseInt(bits[3], 10),
                    parseFloat(bits[4])
                ];
            }
        },
        {
            re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            process: function (bits) {
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16),
                    1
                ];
            }
        },
        {
            re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            process: function (bits) {
                return [
                    parseInt(bits[1] * 2, 16),
                    parseInt(bits[2] * 2, 16),
                    parseInt(bits[3] * 2, 16),
                    1
                ];
            }
        }
    ];
    var r, g, b, a, i, re, processor, bits, channels, min, rData;
    r = g = b = a = rData = null;

    for (i = 0; i < colorDefs.length; i++) {
        re = colorDefs[i].re;
        processor = colorDefs[i].process;
        bits = re.exec(color);
        if (bits) {
            channels = processor(bits);
            r = channels[0];
            g = channels[1];
            b = channels[2];
            a = channels[3];
        }
    }

    r = (r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r);
    g = (g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g);
    b = (b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b);
    a = (a < 0 || isNaN(a)) ? 0 : ((a > 1) ? 1 : a);

    function hex(x) {
        return ("0" + parseInt(x, 10).toString(16)).slice(-2);
    }

    switch (which) {
        case "rgba":
            if (opacity) {
                a = (255 - (min = Math.min(r, g, b))) / 255;
                r = ((r - min) / a).toFixed(0);
                g = ((g - min) / a).toFixed(0);
                b = ((b - min) / a).toFixed(0);
                a = a.toFixed(4);
            }
            rData = "rgba(" + r + "," + g + "," + b + "," + a + ")";
            break;
        case "rgb":
            rData = "rgb(" + r + "," + g + "," + b + ")";
            break;
        case "hex":
            rData = "#" + hex(r) + hex(g) + hex(b);
            break;
    }
    return rData;
},

toolbarUpdate : function () {
	var toolbar = this.toolbar;
	var range = this.getRange();
	var selectionType = GB.selection.SELECTION_TEXT;
	var pNode, ancestors = [], ancestorsLen = 0;
	var bRangeText = true;

    if (this.W3CRange) {
		try {
            pNode = this.getW3RangeElement(range);
            if (pNode.nodeType === GB.node.ELEMENT_NODE) {
                selectionType = !(range.toString()) ? GB.selection.SELECTION_ELEMENT : GB.selection.SELECTION_TEXT;
            }
            else if (pNode.nodeType === GB.node.TEXT_NODE) {
                selectionType = GB.selection.SELECTION_TEXT;
                pNode = pNode.parentNode;
            }
            else {
                selectionType = GB.selection.SELECTION_NONE;
                pNode = pNode.parentNode;
            }
		} catch (e) {
            pNode = this.doc;
        }

        bRangeText = !range.toString();
        if (bRangeText && !range.collapsed) {
            bRangeText = !GB.offElements[pNode.tagName];
        }
	}
	else {
        selectionType = this.getSelectionType(range);
        if (selectionType === GB.selection.SELECTION_TEXT || selectionType === GB.selection.SELECTION_NONE)
        {
			pNode = range.parentElement();
            bRangeText = range.text == '';
        }
        else if (selectionType === GB.selection.SELECTION_ELEMENT) {
			pNode = range.item(0);
            bRangeText = !GB.offElements[pNode.tagName];
        }
        else {
			pNode = this.doc;
        }
	}

	var isControl = false, isTable = false, i, j, btn, cmd, autoOff, isDisable,
        el, wrapper, fontAttr, oldName, span, newAttr, defaultAttr, state;

	if (selectionType == GB.selection.SELECTION_ELEMENT) {
		isControl = this.W3CRange ? GB.offElements[pNode.nodeName] : true;
	}
	else {
		while (pNode && pNode.nodeType == GB.node.ELEMENT_NODE && pNode.nodeName !== 'BODY') {
			ancestors.push(pNode);
			if (pNode.nodeName === 'TD' || pNode.nodeName === 'TH') {
                isTable = true;
            }
			pNode = pNode.parentNode;
		}
		ancestorsLen = ancestors.length;
	}

	var isNoOff = { 'ImageUpload':1, 'ImageUrl':1, 'EmotionIcon':1, 'Link':1, 'GoogleMap':1, 'SelectAll':1, 'LineHeight':1 };

	if (!isTable && selectionType === GB.selection.SELECTION_ELEMENT &&
        (pNode.nodeName === 'TABLE' || pNode.nodeName === 'TD' || pNode.nodeName === 'TH'))
	{
		isTable = true;
	}

	for (i in toolbar) {
        if (!(toolbar.hasOwnProperty(i))) {
            continue;
        }

        btn = toolbar[i];
        cmd = btn.cmd;
		if (!cmd) {
            continue;
        }

		autoOff = false;
		if (isControl && selectionType === GB.selection.SELECTION_ELEMENT) {
			if (btn.btnGroup !== 'Alignment') {
				autoOff = !(pNode.nodeName === 'IMG' && isNoOff[cmd]);
			}
		}

		if (btn.name === 'ModifyTable') {
			autoOff = !isTable;
		}

		isDisable = this.toolbarDisable(btn.button, autoOff);

		if (btn.name === 'ForeColor' || btn.name === 'BackColor') {
            btn.button.lastChild.style.display = isDisable ? 'none' : 'block';
		}
		if (btn.autocheck === null) {
            continue;
        }

        switch (cmd) {
        case 'Copy' :
        case 'Cut'  :
            this.toolbarDisable(btn.button, bRangeText);
            break;
        case 'UnLink' :
            el = true;
            for (j=0; j < ancestorsLen; j++) {
                if (ancestors[j].nodeName === 'A') {
                    el = false;
                    break;
                }
            }
            this.toolbarDisable(btn.button, el);
            break;
        case 'FormatBlock' :
			wrapper = btn.button.firstChild;
			oldName = wrapper.firstChild;
			el = false;
            span = document.createElement('span');
			for (j=0; j < ancestorsLen; j++) {
				if (GB.formatBlock[ancestors[j].nodeName]) {
                    span.appendChild(document.createTextNode(ancestors[j].nodeName));
					wrapper.replaceChild(span, oldName);
					el = true;
					break;
				}
			}

			if (!el) {
                span.appendChild(document.createTextNode('스타일'));
				wrapper.replaceChild(span, oldName);
			}
            this.unselectionElement(span);
            break;
        case 'ForeColor' :
        case 'BackColor' :
			if (cmd === 'BackColor' && !GB.browser.msie) {
                cmd = 'HiliteColor';
            }
			try {
                fontAttr = this.doc.queryCommandValue(cmd);
                if (fontAttr && !/^[rgb|\#]/.test(fontAttr)) {
                    fontAttr = (((fontAttr & 0x0000ff) << 16) | (fontAttr & 0x00ff00) | ((fontAttr & 0xff0000) >>> 16)).toString(16);
                    fontAttr = "#000000".slice(0, 7-fontAttr.length) + fontAttr;
                }
                else {
                    fontAttr = (cmd == 'ForeColor') ? this.config.editorFontColor : this.config.editorBgColor;
                }
				btn.button.lastChild.style.backgroundColor = fontAttr;
			}
            catch(ignore) {}
            break;
        case 'FontName' :
        case 'FontSize' :
            span = document.createElement('span');
            try {
                wrapper = btn.button.firstChild;
                el = false;
                fontAttr = this.doc.queryCommandValue(cmd);

                if (fontAttr) {
                    newAttr = (cmd === 'FontSize') ? (GB.fontSize[fontAttr] || fontAttr) : fontAttr;
                    newAttr = newAttr.replace(/'/g, '');
                    span.appendChild(document.createTextNode(newAttr));
                    wrapper.replaceChild(span, wrapper.firstChild);
                    el = true;
                }

                if (!el) {
                    defaultAttr = (cmd === 'FontSize') ? this.config.editorFontSize : this.config.editorFontName;
                    if (wrapper.hasChildNodes()) {
                        wrapper.removeChild(wrapper.firstChild);
                    }
                    defaultAttr = defaultAttr.replace(/'/g, '');
                    span.appendChild(document.createTextNode(defaultAttr));
                    wrapper.appendChild(span);
                }
                this.unselectionElement(span);
            }
            catch(ignore) {}
            break;
        case 'LineHeight':
            wrapper = toolbar[i].button.firstChild;
            this.unselectionElement(wrapper.firstChild);
            break;
		default :
			try {
				state = this.doc.queryCommandState(cmd);
				if (state && (selectionType === GB.selection.SELECTION_TEXT || selectionType === GB.selection.SELECTION_NONE)) {
					this.toolbarButtonChecked(btn.button);
                    btn.checked = true;
				}
				else {
					this.toolbarButtonUnchecked(btn.button);
                    btn.checked = false;
				}
			}
			catch(ignore) {}
        }
	}
},

createButton : function (name, attr, group) {
	var self = this;
	var elem = null;
	var method = attr.getElementsByTagName('Execution')[0].getAttribute('method');
	var cmd = attr.getElementsByTagName('Execution')[0].getAttribute('value');
	var check = attr.getAttribute('check');

	elem = document.createElement('div');
	elem.className = attr.getAttribute('class');

	var btnWidth = attr.getAttribute('width');
	elem.style.width = btnWidth + 'px';
	elem.setAttribute('btnWidth', btnWidth);
	elem.setAttribute('name', name);
	elem.setAttribute('method', method);

	var btnHeight = attr.getAttribute('height');
	elem.style.height = btnHeight + 'px';
	elem.setAttribute('btnHeight', btnHeight);

	var obj = {
			'button'    : elem,
			'disabled'  : false,
			'name'      : name,
			'method'    : method,
			'cmd'       : cmd,
			'checked'   : false,
			'btnGroup'  : group,
			'autocheck' : check
	};

	self.toolbar[name] = obj;
	self.addEvent(elem, 'mouseover', function() {
		if ((obj.checked === false && obj.disabled === false)) {
			self.toolbarMouseOverUp(elem);
        }
	});

	self.addEvent(elem, 'mouseup', function(ev) {
		if (obj.checked === false && obj.disabled === false) {
			self.toolbarMouseOverUp(elem);
		}
        self.stopEvent(ev || window.event);
	});

	self.addEvent(elem, 'mousedown', function(ev) {
		if (obj.checked === false && obj.disabled === false) {
			self.toolbarButtonChecked(elem);
			self.toolbarMouseDownOut(elem, true);
        }
        self.stopEvent(ev || window.event);
	});

	self.addEvent(elem, 'click', function(ev) {
		if (obj.disabled) {
            return false;
        }
		switch (obj.method) {
		case 'doCmd' :
            self.setRange(self.getRange());
			self.doCmd(obj.cmd, null);
			break;
		case 'windowOpen' :
			self.windowOpen(obj.cmd);
			break;
		case 'showPulldown' :
			if (obj.checked) {
				obj.checked = false;
				self.boxHideAll();
			}
			else {
				obj.checked = true;
				self.showPulldown(obj.cmd, obj.button);
			}
			if (obj.checked) {
				self.toolbarButtonChecked(elem);
				self.toolbarMouseDownOut(elem, true);
			}
			break;
		default :
            alert('지원하지 않는 명령입니다.');
		}
        self.stopEvent(ev || window.event);
	});

	self.addEvent(elem, 'mouseout', function() {
		if (obj.checked === false) {
			self.toolbarButtonUnchecked(elem);
			self.toolbarMouseDownOut(elem, false);
		}
	});

	return elem;
},

showToolbar : function (toolbar, toolbarWrapper) {
	var self = this;
	toolbarWrapper.className = 'cheditor-tb-wrapper';
    var i, grpName, btn, btnNum, grpDiv, j, attr, btnName, btnIcon, btnElem, icon,
        spacer, pos, text, span, currentColor;
	var toolbarIcon = toolbar.getElementsByTagName('Image').item(0).getAttribute('file');
	var group = toolbar.getElementsByTagName('Group');
	var grpNum = group.length;
	var tmpArr = toolbarIcon.split(/\./);
	self.toolbar.icon = self.config.iconPath + toolbarIcon;
	self.toolbar.iconDisable = self.config.iconPath + tmpArr[0] + '-disable' + '.' + tmpArr[1];

	var appendSpaceBlock = function(pNode) {
		var div = document.createElement('div');
		div.className = 'cheditor-tb-split';
		pNode.appendChild(div);
	};

    var fullscreen = document.createElement('span');
    fullscreen.appendChild(document.createTextNode("\u00a0"));
    if (self.config.useFullScreen == true) {
        fullscreen.className = "cheditor-tb-fullscreen";
        fullscreen.setAttribute("title", "전체 화면");
        fullscreen.onclick = function() {
            if (self.setFullScreenMode) {
                this.className = "cheditor-tb-fullscreen";
                this.setAttribute("title", "전체 화면");
            }
            else {
                this.className = "cheditor-tb-fullscreen-actual";
                this.setAttribute("title", "이전 크기로 복원");
            }
            self.fullScreenMode();
        };
    }
    else {
        fullscreen.className = 'cheditor-tb-fullscreen-disable';
    }

    toolbarWrapper.appendChild(fullscreen);

	for (i=0; i < grpNum; i++) {
        grpName = group[i].getAttribute('name');
		if (grpName == 'Split') {
			 appendSpaceBlock(toolbarWrapper);
			 continue;
		}

		btn = group[i].getElementsByTagName('Button');
		btnNum = btn.length;
		grpDiv = document.createElement('div');

		for (j=0; j < btnNum; j++) {
			attr = btn[j].getElementsByTagName('Attribute')[0];
			btnName = btn[j].getAttribute('name');

			if (self.config['use'+btnName] != true) {
				continue;
			}

			btnIcon = document.createElement('div');
			btnElem = self.createButton(btnName, attr, grpName);
			icon = attr.getElementsByTagName('Icon')[0];

			btnIcon.className = icon.getAttribute('class');
            btnIcon.style.marginLeft = icon.getAttribute('margin') || "3px";

			if (btn[j].getAttribute('tooltip') !== null) {
				btnElem.setAttribute('title', btn[j].getAttribute('tooltip'));
			}

			pos = icon.getAttribute('position');
			if (pos !== null) {
				btnIcon.style.backgroundImage = 'url('+self.toolbar.icon+')';
				btnIcon.style.backgroundRepeat = 'no-repeat';
				self.setToolbarBgPosition(btnIcon, (~pos + 1) + 'px center');
			}
			else {
				text = icon.getAttribute('alt');
				if (text !== null) {
                    span = document.createElement('span');
                    span.appendChild(document.createTextNode(text));
					btnIcon.appendChild(span);
				}
			}

			btnElem.appendChild(btnIcon);

			if (btnName === 'ForeColor' || btnName === 'BackColor') {
				currentColor = document.createElement('div');
				currentColor.className = 'cheditor-tb-color-btn';
				currentColor.style.backgroundColor = attr.getAttribute('default');
				btnElem.appendChild(currentColor);
			}

			grpDiv.appendChild(btnElem);
		}

		if (grpDiv.hasChildNodes() == false) {
            continue;
        }

		if (grpDiv.childNodes.length > 1) {
			grpDiv.firstChild.className = grpDiv.firstChild.className + '-first';
			grpDiv.lastChild.className = grpDiv.lastChild.className + '-last';
			while (grpDiv.hasChildNodes()) {
				toolbarWrapper.appendChild(grpDiv.firstChild);
			}
		}
		else {
			if (grpDiv.firstChild.className === 'cheditor-tb-bg') {
				grpDiv.firstChild.className = grpDiv.firstChild.className + '-single';
			}
			toolbarWrapper.appendChild(grpDiv.firstChild);
		}

		spacer = document.createElement('div');
		spacer.className = 'cheditor-tb-button-spacer';
		toolbarWrapper.appendChild(spacer);
	}

	appendSpaceBlock(toolbarWrapper);

	if (GB.browser.msie) {
		var child = toolbarWrapper.getElementsByTagName('div');
		var len = child.length;
		for (i=0; i < len; i++) {
			self.unselectionElement(child[i]);
		}
		self.unselectionElement(toolbarWrapper);
	}
	else {
		self.unselectionElement(toolbarWrapper);
	}
},

unselectionElement : function (elem) {
	if (GB.browser.msie) {
		elem.setAttribute('unselectable', 'on');
		elem.setAttribute('contentEditable', 'false');
	}
	else {
		elem.onselectstart = new Function('return false');
	}
},

createEditorElement : function (container, toolbar) {
	if (!container.hasChildNodes()) {
        return;
    }
	var child = container.firstChild;
	var self = this, i, id, tab, tabId, editArea, done = false;
	var changeMode = function() {
        self.switchEditorMode(this.getAttribute("mode"));
    };
    var windowResize = function(event) {
        self.resizeStart(event);
    };

	do {
		id = child.getAttribute('id');
		switch (id) {
		case 'toolbar' :
			self.showToolbar(toolbar, child);
			self.cheditor.toolbarWrapper = child;
			break;
		case 'viewMode' :
			self.cheditor[id] = child;
			self.cheditor.mode = 'rich';

			if (child.hasChildNodes()) {
				tab = child.childNodes;
				self.cheditor.modetab = {};

				for (i=0; i < tab.length; i++) {
					tabId = tab[i].getAttribute('id');
					if (!tabId) {
                        continue;
                    }

					if ((tabId === 'code' && self.config.useSource === false) ||
						(tabId === 'preview' && self.config.usePreview === false))
					{
						tab[i].style.display = 'none';
						tab[i].removeAttribute('id');
						continue;
					}

                    tab[i].setAttribute('mode', tabId);
                    tab[i].onclick = changeMode;
					tab[i].removeAttribute('id');
                    self.cheditor.modetab[tabId] = tab[i];
				}
				self.unselectionElement(child);
			}
			break;
		case 'editWrapper' :
			editArea = child.getElementsByTagName('IFRAME').item(0);
			editArea.style.height = self.config.editorHeight;

			if (isNaN(self.config.tagIndex) == false) {
				editArea.tabIndex = self.config.tabIndex;
			}

			self.cheditor.editArea = editArea;
			self.cheditor[id] = child;
			break;
		case 'modifyBlock' :
			self.cheditor.editBlock = child;
			break;
		case 'tagPath' :
			if (self.config.showTagPath) {
				self.cheditor.tagPath = child.firstChild;
				child.style.display = 'block';
			}
			break;
		case 'resizeBar' :
			self.cheditor.resizeBar = child;
			child.onmousedown = windowResize;
			self.unselectionElement(child);
			break;
		default : break;
		}

		child.removeAttribute('id');
		child = child.nextSibling;
	}
	while (child);

	var pNode = self.cheditor.textarea.parentNode,
		nNode = self.cheditor.textarea.nextSibling;

	if (!nNode) {
        pNode.appendChild(container);
    }
	else {
        pNode.insertBefore(container, nNode);
    }

    function ready() {
        if (done) {
            return;
        }
        done = true;
    }

	if (GB.browser.msie) {
		var isFrame = false;
        try {
            isFrame = window.frameElement !== null;
        } catch(ignore) {}

        if (document.documentElement.doScroll && !isFrame) {
            var tryScroll = function() {
                if (done) {
                    return;
                }
                try {
                    document.documentElement.doScroll("left");
                    ready();
                } catch(e) {
                    setTimeout(tryScroll, 10);
                }
            };
            tryScroll();
        }

		self.addEvent(document, 'readystatechange', function() {
            if (document.readyState === "complete") {
				ready();
			}
		});
	}
	else {
		self.addEvent(document, 'DOMContentLoaded', function() {
            ready();
		});
	}

	container.style.width = self.config.editorWidth;
	self.cheditor.container = container;
},

loadTemplate : function (xmlDoc) {
        var cdata, container, dragHandle, html, modalFrame, popupWindow, tmpDiv, tmpl, toolbar;
        tmpl = xmlDoc.getElementsByTagName('Template').item(0);
        if (!tmpl) {
            throw 'Template 노드를 설정할 수 없습니다.';
        }
        cdata = tmpl.getElementsByTagName('Container').item(0).getElementsByTagName('Html').item(0);
        if (!cdata) {
            throw 'XML CDATA 오류';
        }
        html = this.getCDATASection(cdata);
        tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = html;
        container = tmpDiv.firstChild;

        toolbar = tmpl.getElementsByTagName('Toolbar').item(0);
        this.createEditorElement(container, toolbar);

        cdata = tmpl.getElementsByTagName('PopupWindow').item(0).getElementsByTagName('Html').item(0);
        if (!cdata) {
            throw 'XML CDATA 오류';
        }
        html = this.getCDATASection(cdata);
        tmpDiv.innerHTML = html;
        popupWindow = tmpDiv.firstChild;
        this.cheditor.popupElem = popupWindow;

        dragHandle = popupWindow.firstChild;
        this.cheditor.dragHandle = dragHandle;
        this.cheditor.popupTitle = dragHandle.getElementsByTagName('label')[0];
        this.cheditor.popupFrameWrapper = dragHandle.nextSibling;
        container.appendChild(popupWindow);

        modalFrame = document.createElement('div');
        modalFrame.className = 'cheditor-modalPopupTransparent';
        this.cheditor.modalBackground = modalFrame;
        this.cheditor.modalBackground.id = 'popupModalBackground';
        this.cheditor.modalBackground.className = 'cheditor-popupModalBackground';
        container.parentNode.insertBefore(modalFrame, container);

        this.cheditor.htmlEditable = document.createElement('iframe');
        this.cheditor.htmlEditable.style.display = 'none';
        this.cheditor.htmlEditable.style.width = '1px';
        this.cheditor.htmlEditable.style.height = '1px';
        this.cheditor.htmlEditable.style.visibility = 'hidden';
        container.appendChild(this.cheditor.htmlEditable);
    },

imageEvent : function (img, action) {
	var self = this;
	if (GB.browser.msie) {
		if (action == false) {
			img.onmouseup = null;
			return;
		}

		img.onmouseup = function() {
			self.cheditor.editBlock.style.display = "block";
			self.modifyImage(this);
		};
	}
	else {
		var imgev = function() {
			self.cheditor.editBlock.style.display = "block";
			self.modifyImage(this);
		};

		if (action == false) {
			self.removeEvent(img, 'click', imgev);
			return;
		}

		this.addEvent(img, 'click', imgev);
	}
},

setImageEvent : function (action) {
	var images = this.doc.images;
	var len = images.length, i;

	for (i=0; i < len; i++) {
		this.imageEvent(images[i], action);
	}
},

run : function () {
	this.setFolderPath();

	try { this.checkInputForm(); }
	catch(e) {
		alert(e.toString());
		return;
	}

	this.setDefaultCss({cssName: 'ui.css', doc: window.document});
	this.initTemplate();

	if (!this.resetDoc()) {
        return;
    }
	this.editAreaFocus();
	this.setEditorEvent();
	this.setDefaultCss();

    if ((GB.browser.msie && GB.browser.ver > 9) || GB.browser.iegecko) {
        var image = new Image();
        var self = this;
        image.onload = function() {
            self.cheditor.toolbarGrayscale = self.makeToolbarGrayscale(this);
            self.toolbarUpdate();
        };
        image.src = this.toolbar.icon;
        image.width = 750; image.height = 16;
    }
    else {
        this.cheditor.toolbarGrayscale = null;
        this.toolbarUpdate();
    }

    this.setImageEvent(true);
},

fullScreenMode : function () {
	var self = this;
	self.editAreaFocus();
	self.boxHideAll();

	var container = self.cheditor.container;
	self.cheditor.editArea.style.visibility = 'hidden';

	if (self.setFullScreenMode == false) {
        var windowSize;
		container.className = 'cheditor-container-fullscreen';

		if (GB.browser.msie && GB.browser.ver < 7) {
			self.cheditor.fullScreenFlag = document.createElement('span');
			self.cheditor.fullScreenFlag.style.display = 'none';
			container.parentNode.insertBefore(self.cheditor.fullScreenFlag, container);
			document.body.insertBefore(container, document.body.firstChild);
		}

        var child = container.firstChild, except = 0;
        while (child) {
            if (child.className !== "cheditor-editarea-wrapper" &&
                child.className !== 'cheditor-popup-window' &&
                child.className !== '')
            {
                except += child.offsetHeight;
            }
            child = child.nextSibling;
        }

		var containerReSize = function () {
            windowSize = self.getWindowSize();
            container.style.width = windowSize.width + 'px';
            self.cheditor.editArea.style.height = (windowSize.height - except - 6) + 'px';
		};

		window.onresize = containerReSize;
		containerReSize();

		self.cheditor.resizeBar.onmousedown = null;
		self.cheditor.resizeBar.className = "cheditor-resizebar-off";
	}
	else {
		window.onresize = null;
		container.removeAttribute('style');
		container.className = 'cheditor-container';
		container.style.width = self.config.editorWidth;

		var editorHeight = parseInt(self.config.editorHeight, 10);

		if (self.cheditor.mode !== 'rich') {
            var tbHeight = self.cheditor.toolbarWrapper.offsetHeight;
            if (tbHeight == 0) {
                tbHeight = parseInt(self.cheditor.toolbarWrapper.style.height, 10) +
                    parseInt(self.cheditor.toolbarWrapper.style.padding, 10);
            }
			editorHeight += tbHeight;
		}

		self.cheditor.editArea.style.height = editorHeight + 'px';
		self.cheditor.resizeBar.onmousedown = function(event) { self.resizeStart(event); };
		self.cheditor.resizeBar.className = "cheditor-resizebar";

		if (GB.browser.msie && GB.browser.ver < 7) {
			self.cheditor.fullScreenFlag.parentNode.replaceChild(container, self.cheditor.fullScreenFlag);
		}
	}

	self.cheditor.editArea.style.visibility = 'visible';
	self.setFullScreenMode = !(self.setFullScreenMode);
	self.editAreaFocus();
},

showPulldown : function (menu, pNode) {
	switch (menu) {
	case 'FontName' :
		this.showFontTypeMenu(pNode);
		break;
	case 'FontSize' :
		this.showFontSizeMenu(pNode);
		break;
	case 'FormatBlock' :
		this.showFormatBlockMenu(pNode);
		break;
	case 'BackColor' :
        this.showColorMenu(pNode);
        break;
	case 'ForeColor' :
		this.showColorMenu(pNode);
		break;
	case 'TextBlock' :
		this.showTextBlockMenu(pNode);
		break;
	case 'LineHeight' :
		this.showLineHeightMenu(pNode);
		break;
	default : break;
	}
},

setPulldownClassName : function (labels, pNode) {
    var i;
	for (i=0; i < labels.length; i++) {
		if (labels[i].getAttribute('name') === pNode.firstChild.firstChild.firstChild.nodeValue) {
			labels[i].parentNode.style.backgroundImage = 'url('+this.config.editorPath+'icons/checked.png)';
			labels[i].parentNode.style.backgroundPosition = '0 center';
			labels[i].parentNode.style.backgroundRepeat = 'no-repeat';
		}
		else {
			labels[i].parentNode.style.backgroundImage = '';
        }
		labels[i].parentNode.className = 'cheditor-pulldown-mouseout';
	}
},

showColorMenu : function (pNode) {
	var menu = pNode.getAttribute('name');
	var elem = this.pulldown[menu];

	if (!elem) {
		var outputHtml = this.setColorTable(pNode, menu);
		this.createWindow(190, outputHtml);
		this.createPulldownFrame(outputHtml, menu);
		elem = this.pulldown[menu];
		elem.firstChild.className = 'cheditor-pulldown-color-container';
	}

	this.windowPos(pNode, menu);
	this.displayWindow(pNode, menu);
},

showFontTypeMenu : function (pNode) {
	var self = this;
	var menu = pNode.getAttribute('name');
	var elem = self.pulldown[menu];

	if (!elem) {
        var fonts = null, type, i, div, label;
		var outputHtml = self.doc.createElement('div');
        var cmdPopup = function() { self.doCmdPopup("FontName", this.id); };
        var mouseOver = function() { self.pulldownMouseOver(this); };
        var mouseOut = function() { self.pulldownMouseOut(this); };

		for (type in GB.fontName) {
            if (GB.fontName.hasOwnProperty(type)) {
                fonts = GB.fontName[type];
			    for (i=0; i < fonts.length; i++) {
				    div = self.doc.createElement('div');
				    label = self.doc.createElement('label');
				    div.id = fonts[i];
				    div.onclick = cmdPopup;
				    div.onmouseover = mouseOver;
				    div.onmouseout = mouseOut;
				    label.style.fontFamily = fonts[i];//(type !== 'kr') ? fonts[i] : this.config.editorFontName;
				    label.appendChild(self.doc.createTextNode(fonts[i]));
				    label.setAttribute('name', fonts[i]);
				    div.appendChild(label);
				    outputHtml.appendChild(div);
			    }
            }
		}

		self.createWindow(155, outputHtml);
		self.createPulldownFrame(outputHtml, menu);
		elem = self.pulldown[menu];
	}
	self.setPulldownClassName(elem.firstChild.getElementsByTagName('LABEL'), pNode);
	self.windowPos(pNode, menu);
	self.displayWindow(pNode, menu);
},

showFormatBlockMenu : function (pNode) {
	var self = this;
	var menu = pNode.getAttribute('name');
	var elem = self.pulldown[menu];

	if (!elem) {
        var para, label, fontSize, div;
		var outputHtml = document.createElement('div');
        var cmdPopup = function() { self.doCmdPopup("FormatBlock", '<' + this.id + '>'); };
        var mouseOver = function() { self.pulldownMouseOver(this); };
        var mouseOut = function() { self.pulldownMouseOut(this); };
		for (para in GB.formatBlock) {
            if (GB.formatBlock.hasOwnProperty(para)) {
			    div = document.createElement('div');
			    div.id = para;
			    div.onclick = cmdPopup;
			    div.onmouseover = mouseOver;
			    div.onmouseout = mouseOut;

			    label = document.createElement('label');
			    if (para.match(/H[123456]/)) {
			    	fontSize = {'H1':'2em','H2':'1.5em','H3':'1.17em','H4':'1em','H5':'0.83em','H6':'0.75em'};
			    	label.style.fontWeight = 'bold';
			    	label.style.fontSize = fontSize[para];
                    label.style.lineHeight = 1.4;
			    }
			    else if (para === 'ADDRESS') {
			    	label.style.fontStyle = 'italic';
                }

			    label.appendChild(document.createTextNode(GB.formatBlock[para]));
			    div.appendChild(label);

			    label.setAttribute('name', GB.formatBlock[para]);
			    outputHtml.appendChild(div);
            }
		}
		self.createWindow(150, outputHtml);
		self.createPulldownFrame(outputHtml, menu);
		elem = self.pulldown[menu];
	}
	self.setPulldownClassName(elem.firstChild.getElementsByTagName('LABEL'), pNode);
	self.windowPos(pNode, menu);
	self.displayWindow(pNode, menu);
},

showFontSizeMenu : function (pNode) {
    var self = this;
    var menu = pNode.getAttribute('name');
    var elem = self.pulldown[menu];

    if (!elem) {
        var size, div, label, text;
        var outputHtml = document.createElement('div');
        var cmdPopup = function() { self.doCmdPopup("FontSize", this.id); };
        var mouseOver = function() { self.pulldownMouseOver(this); };
        var mouseOut = function() { self.pulldownMouseOut(this); };
        for (size in GB.fontSize) {
            if (!GB.fontSize[size]) { break; }
            div = document.createElement('div');
            label = document.createElement('label');
            text = size == 7 ? '가나다' : '가나다라';

            div.id = size;
            div.onclick = cmdPopup;
            div.onmouseover = mouseOver;
            div.onmouseout = mouseOut;
            div.style.fontSize = GB.fontSize[size];

            label.style.fontFamily = this.config.editorFontName;
            label.setAttribute('name', GB.fontSize[size]);
            label.appendChild(document.createTextNode(text+'('+GB.fontSize[size] +')'));
            div.appendChild(label);
            outputHtml.appendChild(div);
        }
        self.createWindow(320, outputHtml);
        self.createPulldownFrame(outputHtml, menu);
        elem = self.pulldown[menu];
    }
    self.setPulldownClassName(elem.firstChild.getElementsByTagName('LABEL'), pNode);
    self.windowPos(pNode, menu);
    self.displayWindow(pNode, menu);
},

showLineHeightMenu : function (pNode) {
    var self = this;
    var menu = pNode.getAttribute('name');
    var elem = self.pulldown[menu];

    if (!elem) {
        var i, div, label, text;
        var outputHtml = document.createElement('div');
        var cmdPopup = function() { self.doCmdPopup("LineHeight", this.id); };
        var mouseOver = function() { self.pulldownMouseOver(this); };
        var mouseOut = function() { self.pulldownMouseOut(this); };
        for (i in GB.lineHeight) {
            if (!GB.lineHeight[i]) {
                break;
            }
            div = document.createElement('div');
            label = document.createElement('label');
            text = i;

            div.id = GB.lineHeight[i];
            div.onclick = cmdPopup;
            div.onmouseover = mouseOver;
            div.onmouseout = mouseOut;

            label.style.fontFamily = this.config.editorFontName;
            label.setAttribute('name', GB.lineHeight[i]);
            label.appendChild(document.createTextNode(text));
            div.appendChild(label);
            outputHtml.appendChild(div);
        }
        self.createWindow(100, outputHtml);
        self.createPulldownFrame(outputHtml, menu);
        elem = self.pulldown[menu];
    }
    self.setPulldownClassName(elem.firstChild.getElementsByTagName('LABEL'), pNode);
    self.windowPos(pNode, menu);
    self.displayWindow(pNode, menu);
},

showTextBlockMenu : function (pNode) {
	var self = this;
	var menu = pNode.getAttribute('name');
	var elem = self.pulldown[menu];

	if (!elem) {
        var i, wrapper, div, label;
		var outputHtml = document.createElement('div');
        var cmdPopup = function() { self.boxStyle(this); };
        var mouseOver = function() { this.className = 'cheditor-pulldown-textblock-over'; };
        var mouseOut = function() { this.className = 'cheditor-pulldown-textblock-out'; };
		var quote = GB.textBlock;

		for (i=0; i < quote.length; i++) {
			wrapper = document.createElement('div');
			div = document.createElement('div');
			div.onclick = cmdPopup;
			wrapper.onmouseover = mouseOver;
			wrapper.onmouseout = mouseOut;
			wrapper.className = 'cheditor-pulldown-textblock-out';
            div.id = i;
			div.style.border = quote[i][0];
			div.style.backgroundColor = quote[i][1];
			div.style.fontFamily = self.config.editorFontName;

			label = document.createElement('label');
			label.appendChild(document.createTextNode('가나다라 ABC'));
			div.appendChild(label);
			wrapper.appendChild(div);
			outputHtml.appendChild(wrapper);

		}
		self.createWindow(160, outputHtml);
		self.createPulldownFrame(outputHtml, menu);
		elem = self.pulldown[menu];
		elem.firstChild.className = 'cheditor-pulldown-textblock-container';
	}
	self.windowPos(pNode, menu);
	self.displayWindow(pNode, menu);
},

createPulldownFrame : function (contents, id) {
	var div = document.createElement('div');
	div.className = 'cheditor-pulldown-frame';
	div.appendChild(contents);
	this.pulldown[id] = div;
	this.cheditor.container.firstChild.appendChild(div);
},

setDefaultCss : function (ar) {
	if (arguments.length == 0) {
		ar = {cssName: 'ui.css', doc: this.doc};
		//if (GB.browser.msie || GB.browser.opera) {
			ar = {cssName: 'editarea.css', doc: this.doc};
		//}
	}

	var cssFile = this.config.cssPath + ar.cssName,
            head = ar.doc.getElementsByTagName('head')[0], found = false;

	if (this.undefined(head)) {
		return;
    }

	if (head.hasChildNodes()) {
		var child = head.childNodes, i, href;
		for (i = 0; i < child.length; i++) {
			if (child[i].nodeName.toLowerCase() === 'link') {
				href = child[i].getAttribute('href');
				if (href && href === cssFile) {
					found = true;
					break;
				}
			}
		}
	}

	if (!found) {
		var css = head.appendChild(ar.doc.createElement('link'));
		css.setAttribute('type', 'text/css');
		css.setAttribute('rel', 'stylesheet');
		css.setAttribute('media', 'all');
		css.setAttribute('href', this.config.cssPath + ar.cssName);
	}
},

setEditorEvent : function () {
	var self = this;
    var keyArrow = function(event) { self.doOnArrowKeyPress(event); };
    self.addEvent(self.doc, "keydown", keyArrow);

	var keyPress = function(event) { self.doOnKeyPress(event); };
	self.addEvent(self.doc, "keypress", keyPress);

	var editorEvent = function() { self.doEditorEvent(); };
	self.addEvent(self.doc, "mouseup", editorEvent);

	var hideBox = function() { self.boxHideAll(); };
	self.addEvent(self.doc, "mousedown", hideBox);
},

addEvent : function (evTarget, evType, evHandler) {
    if (evTarget.addEventListener) {
        evTarget.addEventListener(evType, evHandler, false);
    }
    else {
        evTarget.attachEvent("on"+evType, evHandler);
    }
},

removeEvent : function (elem, ev, func) {
	if (elem.removeEventListener) {
		elem.removeEventListener(ev, func, false);
    }
	else {
        elem.detachEvent("on" + ev, func);
    }
},

stopEvent : function (ev) {
    if (ev.preventDefault) {
        ev.preventDefault();
        ev.stopPropagation();
    }
    else {
        ev.cancelBubble = true;
        ev.returnValue = false;
    }
},

toolbarButtonOut : function (elemButton, nTop) {
	elemButton.style.top = -nTop + 'px';
},

toolbarButtonOver : function (elemButton) {
	var nTop = elemButton.style.top.substring(0, elemButton.style.top.length - 2);
	elemButton.style.top = nTop - 22 + 'px';
},

changeFontColor : function (color, type) {
	if (type === 'BackColor' && !GB.browser.msie) {
		type = 'HiliteColor';
	}
	this.doCmdPopup(type, color);
},

getElement : function (elem, tag) {
    if (!elem || !tag) {
        return null;
    }

	while (elem && elem.nodeName.toLowerCase() !== tag.toLowerCase()) {
		if (elem.nodeName.toLowerCase() === 'body') { break; }
		elem = elem.parentNode;
	}
	return elem;
},

hyperLink: function (href, target, title) {
    this.editArea.focus();

    var self = this, links = null, i;
    var createLinks = function() {
        var range = null, selectedLinks = [], linkRange, selection = null;
        var container = null, sType = null, k;

        range = self.restoreRange();
        self.setRange(range);
        linkRange = self.createRange();

        if (self.W3CRange) {
            self.doc.execCommand("CreateLink", false, href);

            selection = self.getSelection();
            for (i=0; i < selection.rangeCount; ++i) {
                range = selection.getRangeAt(i);
                container = range.commonAncestorContainer;
                sType = self.getSelectionType(range);

                if (sType === GB.selection.SELECTION_TEXT) {
                    container = container.parentNode;
                }

                if (container.nodeName.toLowerCase() === 'a') {
                    selectedLinks.push(container);
                }
                else {
                    links = container.getElementsByTagName('a');
                    for (k=0; k < links.length; ++k) {
                        linkRange.selectNodeContents(links[k]);
                        if (linkRange.compareBoundaryPoints(range.END_TO_START, range) < 1 &&
                                linkRange.compareBoundaryPoints(range.START_TO_END, range) > -1)
                        {
                            selectedLinks.push(links[k]);
                        }
                    }
                }
            }
            linkRange.detach();
        }
        else {
            range = self.doc.selection.createRange();
            range.execCommand("UnLink", false);
            range.execCommand("CreateLink", false, href);

            sType = self.getSelectionType(range);
            switch (sType) {
            case GB.selection.SELECTION_TEXT :
                container = range.parentElement();
                break;
            case GB.selection.SELECTION_ELEMENT :
                container = range.item(0).parentNode;
                break;
            default : return null;
            }

            if (container.nodeName.toLowerCase() === 'a') {
                selectedLinks.push(container);
            }
            else {
                links = container.getElementsByTagName('a');
                for (i=0; i < links.length; ++i) {
                    linkRange.moveToElementText(links[i]);
                    if (linkRange.compareEndPoints("StartToEnd", range) > -1 &&
                            linkRange.compareEndPoints("EndToStart", range) < 1)
                    {
                        selectedLinks.push(links[i]);
                    }
                }
            }

        }
        return selectedLinks;
    };

    links = createLinks();
    if (links) {
        for (i=0; i < links.length; ++i) {
            if (target) {
                links[i].setAttribute("target", target);
            }
            if (title) {
                links[i].setAttribute("title", title);
            }
        }
    }
},

getOffsetBox : function (el) {
    var box = el.getBoundingClientRect();
    var doc = this.doc.documentElement;
    var body = this.doc.body;
    var scrollTop = doc.scrollTop || body.scrollTop;
    var scrollLeft = doc.scrollLeft || body.scrollLeft;
    var clientTop = doc.clientTop || body.clientTop || 0;
    var clientLeft = doc.clientLeft || body.clientLeft || 0;
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
},

boxStyle: function (el) {
	this.editAreaFocus();
	var range = this.range || this.getRange();
	var quote = this.doc.createElement("blockquote");
    var empty = false;

    quote.style.border = GB.textBlock[el.id][0];
    quote.style.backgroundColor = GB.textBlock[el.id][1];
	quote.style.padding = "5px 10px";

    if (!this.W3CRange) {
		var ctx = range.htmlText;
		quote.innerHTML = ctx || "\u00a0";
        range.select();
        this.insertHTML(quote);
        var textRange = this.getRange();
        textRange.moveToElementText(range.parentElement());
        textRange.collapse(false);
		textRange.select();
	}
	else {
        range.surroundContents(quote);
        if (range.toString().length < 1) {
            empty = true;
            quote.appendChild(this.doc.createTextNode('\u00a0'));
        }

        var br = this.doc.createElement('br');
        quote.parentNode.insertBefore(br, quote);
        br = this.doc.createElement('br');
        quote.parentNode.insertBefore(br, quote);
        quote.parentNode.insertBefore(quote, br);

        this.selectNodeContents(quote);
        var selection = this.getSelection();
        selection.removeAllRanges();

        if (empty && quote.firstChild) {
            range.setStartBefore(quote.firstChild);
        }
        else if (quote.lastChild) {
            range.setStartAfter(quote.lastChild);
        }

        range.collapse(true);
        selection.addRange(range);
	}

	this.boxHideAll();
},

insertFlash: function (elem) {
    this.editArea.focus();
    this.setRange(this.restoreRange());

	if (typeof elem === 'string') {
		var embed = null;
		var div = this.doc.createElement('div');
		elem = this.trimSpace(elem);

		var pos = elem.toLowerCase().indexOf("embed");
		if (pos !== -1) {
			var str = elem.substr(pos);
			pos = str.indexOf(">");
			div.innerHTML = "<" + str.substr(0, pos) + ">";
			embed = div.firstChild;
		}
		else {
			div.innerHTML = elem;
			var object = div.getElementsByTagName('OBJECT')[0];
			if (object && object.hasChildNodes()) {
				var child = object.firstChild;
				var movieHeight, movieWidth, i;
				movieWidth  = (isNaN(object.width) != true) ? object.width : 320;
				movieHeight = (isNaN(object.height)!= true) ? object.height: 240;
				var params = [];

				do {
					if ((child.nodeName == 'PARAM') &&  (!this.undefined(child.name) && !this.undefined(child.value)))
					{
						params.push({key: (child.name == 'movie') ? 'src' : child.name, val: child.value});
					}
					child = child.nextSibling;
				}
				while (child);

				if (params.length > 0) {
					embed = this.doc.createElement('embed');
					embed.setAttribute("width", movieWidth);
					embed.setAttribute("height", movieHeight);
					for (i=0; i<params.length; i++) {
						embed.setAttribute(params[i].key, params[i].val);
                    }
					embed.setAttribute("type", "application/x-shockwave-flash");
				}
			}
		}

		if (embed) {
			if (this.W3CRange) {
                this.insertNodeAtSelection(embed);
			}
			else {
				this.doCmdPaste(embed.outerHTML);
			}
		}
	}
},

insertHtmlPopup: function (elem) {
    this.editArea.focus();
    this.setRange(this.restoreRange());

    if (!this.W3CRange) {
         this.doCmdPaste((this.toType(elem) === 'string') ? elem : elem.outerHTML);
    }
    else {
        this.insertNodeAtSelection(elem);
    }

	this.clearStoredSelections();
},

insertHTML: function (html) {
	if (!this.W3CRange) {
		this.getRange().pasteHTML((this.toType(html) === 'string') ? html : html.outerHTML);
	}
	else {
        this.insertNodeAtSelection(html);
    }
},

selectNodeContents : function (node, pos) {
	var collapsed = !this.undefined(pos);
	var selection = this.getSelection();
	var range = this.getRange();

	if (node.nodeType === GB.node.ELEMENT_NODE) {
		range.selectNode(node);
        if (collapsed) {
            range.collapse(pos);
        }
	}

	selection.removeAllRanges();
	selection.addRange(range);
	return range;
},

insertNodeAtSelection: function (insertNode) {
	var selection = this.getSelection();
	var range = this.getRange();

    selection.removeAllRanges();
	range.deleteContents();

    var frag = this.doc.createDocumentFragment(), elem;
    var lastNode = null;

    if (typeof insertNode === "string") {
        var tmpWrapper = this.doc.createElement('div');
        tmpWrapper.innerHTML = insertNode;

        elem = tmpWrapper.firstChild;
        while (elem) {
            lastNode = frag.appendChild(elem);
            elem = tmpWrapper.firstChild;
        }
    }
    else {
        lastNode = frag.appendChild(insertNode);
    }

    range.insertNode(frag);

    if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        selection.addRange(range);
    }

    this.toolbarUpdate();
    return lastNode;
},

doInsertImage : function (images) {
    var self = this;
	self.editArea.focus();

	var range = self.restoreRange();
    this.setRange(range);

	var tmpWrapper, spacer=null, i, attr, div, cssFloat, newImage;

    var makeSpacer = function() {
         spacer = self.doc.createElement('br');
         return spacer;
    };

    tmpWrapper = self.doc.createElement('div');

	for (i in images) {
        if (!images.hasOwnProperty(i) || self.undefined(images[i])) {
            continue;
        }

        attr = images[i];

        div = self.doc.createElement('div');
		newImage = self.doc.createElement('img');

		newImage.setAttribute('src', attr.fileUrl);
        newImage.style.width = attr.width;
        newImage.style.height = attr.height;
		newImage.setAttribute('alt', attr.alt || attr.origName);
        div.style.textAlign = attr.align;

        div.appendChild(newImage);

		if (attr.align === 'left' || attr.align === 'right') {
			cssFloat = GB.browser.msie ? newImage.style.styleFloat : newImage.style.cssFloat;
			if (cssFloat) {
				cssFloat = attr.align;
            }
		}

        tmpWrapper.appendChild(div);

        if (self.config.uploadImgSpacer == true) {
            tmpWrapper.appendChild(makeSpacer());
        }

        this.images.push(attr);
	}

    if (tmpWrapper.hasChildNodes()) {
        tmpWrapper.insertBefore(makeSpacer(), tmpWrapper.firstChild);

        if (self.config.uploadImgSpacer == false) {
            tmpWrapper.appendChild(makeSpacer());
        }

        if (!self.W3CRange) {
            range.pasteHTML(tmpWrapper.innerHTML);
        }
        else {
            if (range == null) {
                self.editAreaFocus();
                range = self.getRange();
            }
            else {
                range.deleteContents();
            }

            var frag = self.doc.createDocumentFragment(), elem;
            var lastNode = null;

            elem = tmpWrapper.firstChild;
            while (elem) {
                lastNode = frag.appendChild(elem);
                elem = tmpWrapper.firstChild;
            }

            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                var selection = this.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
        this.setImageEvent(true);
    }
},

showTagSelector : function (on) {
	if (this.config.showTagPath !== true) { return; }
	this.cheditor.tagPath.style.display = on ? 'block' : 'none';
},

richMode : function () {
	this.range = null;
	this.cheditor.editArea.style.visibility = 'hidden';
	this.setDesignMode(false);
	this.cheditor.toolbarWrapper.style.display = '';

	if (this.cheditor.mode === 'code') {
		this.putContents(this.makeHtmlContent());
	}

    this.cheditor.toolbarWrapper.className = "cheditor-tb-wrapper";
	this.cheditor.editArea.style.visibility = 'visible';
	this.setDesignMode(true);
	this.editAreaFocus();
	this.setImageEvent(true);
	this.toolbarUpdate();
},

editMode : function () {
	this.range = null;
	this.cheditor.editArea.style.visibility = 'hidden';
	this.cheditor.editBlock.style.display = 'none';
	this.setDesignMode(false);
	var content = this.getContents(this.config.fullHTMLSource);

    if (content !== "") {
        this.doc.body.innerHTML = "";
        if (this.W3CRange) { this.doc.body.textContent = content; }
        else { this.doc.body.innerText = content; }
    }

    prettify.initHighlightingOnLoad(['html', 'javascript', 'css'], this);

    this.cheditor.toolbarWrapper.className = "cheditor-tb-wrapper-code";
	this.cheditor.editArea.style.visibility = 'visible';
	this.setDesignMode(true);

    this.editAreaFocus();

        /*var cursor = this.doc.body.createTextRange();
        cursor.moveToElementText(this.doc.body.firstChild);
        cursor.collapse(true);
        cursor.select();*/

},

makeHtmlContent : function () {
    return this.doc.body.textContent || this.doc.body.innerText;
},

resetStatusBar : function () {
	if (this.config.showTagPath) {
		this.cheditor.tagPath.innerHTML = '&lt;html&gt; &lt;body&gt; ';
    }
},

previewMode : function () {
	this.range = null;
	if (this.config.useSource && this.cheditor.mode === 'code') {
		this.putContents(this.makeHtmlContent());
	}

	this.cheditor.editArea.style.visibility = 'hidden';
	this.cheditor.editBlock.style.display = 'none';
    this.cheditor.toolbarWrapper.className = "cheditor-tb-wrapper-preview";
	this.cheditor.editArea.style.visibility = 'visible';
	this.setImageEvent(false);
	this.setDesignMode(false);
},

putContents : function (content) {
	if (this.config.fullHTMLSource) {
		if (this.config.outputXhtml) {
			content = content.substr(content.search(/<html/ig) + 1);
    		content = content.substr(content.indexOf('>') + 1);
    		content = '<html>' + content;
		}
		this.doc.open();
		this.doc.write("<body>" + content + "</body>");
		this.doc.close();
	}
	else {
        content = "<span>remove_this</span>" + content;
		this.doc.body.innerHTML = content;
        this.doc.body.removeChild(this.doc.body.firstChild);
	}
},

getImages : function () {
	var img = this.doc.body.getElementsByTagName('img');
	var imgNumber = this.images.length;
	var imgArr = [], i, imgid, j;

	for (i=0; i<img.length; i++) {
		if (img[i].src) {
			imgid = img[i].src;
			imgid = imgid.slice(imgid.lastIndexOf("/") + 1);
			for (j=0; j<imgNumber; j++) {
				if (this.images[j]['fileName'] === imgid) {
					imgArr.push(this.images[j]);
					break;
				}
			}
		}
	}
	return imgArr.length > 0 ? imgArr : null;
},

xhtmlParse : function (node, lang, encoding, needNewLine) {
	var i, j;
	var xhtmlText = '', innerText, tagName, child, parts;
	var children = node.childNodes;
	var childLen = children.length;
	var doNewLine = needNewLine ? true : false;
    var attr, attrLen, attrValue, attrName, validAttr, attrLang = false, attrXmlLang = false, attrXmlns = false;
    var reComment = new RegExp();
    var reHyphen = new RegExp();
    var reParsedValue = this.makeRandomString();
    var embedParams, embedAlignCode, mediaAlign = '';
    //var nodeText;
    var cssText, reMake=[], ct, kv, rs;

    reComment.compile("^<!--(.*)-->$");
    reHyphen.compile("-$");

	for (i=0; i < childLen; i++) {
		child = children[i];
        if (GB.browser.msie) {
            if (child.getAttribute && child.getAttribute("re_parsed_attr") === reParsedValue)
            {
                continue;
            }
            if (child.setAttribute) {
                child.setAttribute("re_parsed_attr", reParsedValue);
            }
        }

        if (child.parentNode && node.tagName.toLowerCase() !== child.parentNode.tagName.toLowerCase()) {
            continue;
        }

		switch (child.nodeType) {
			case GB.node.ELEMENT_NODE :
				tagName = child.nodeName.toLowerCase();
				if (/^\W/.test(tagName) || tagName === '') {
                    break;
                }

                if (tagName === 'meta' && child.name.toLowerCase() === 'generator') {
                    break;
                }

                if (tagName === 'html') {
					xhtmlText = '<?xml version="1.0" encoding="' + encoding + '"?>\n' + GB.xhtmlDTD + '\n';
				}

				if (GB.browser.msie) {
					if (tagName === 'embed') {
						embedParams = /align=("[^"]*"|'[^']*'|[^"'\s]*)(\s|>)/i;
						embedAlignCode = child.outerHTML.match(embedParams);
						if (embedAlignCode) {
							//alignCode = embedAlignCode[1];
							mediaAlign = embedAlignCode.replace(/("|')/g, "");
						}
					}
					if (tagName === 'object' && !child.hasChildNodes()) {
						xhtmlText += this.replaceObjectCode(child.outerHTML);
						continue;
					}
				}

                if (tagName === '!') {
                    parts = reComment.exec(child.text);
                    if (parts) {
                        innerText = parts[1];
                        innerText = innerText.replace(/--/g, "__");
                        if (reHyphen.exec(innerText)) {
                            innerText += " ";
                        }
                         innerText = "<!--" + innerText + "-->";
                    }
                    break;
                }

                if (tagName === 'img' && !child.getAttributeNode('alt')) {
                    child.setAttribute("alt", "");
                }

                if (GB.newLineBefore.indexOf('|' + tagName + '|') !== -1) {
                    if ((this.doc.body.firstChild !== child && doNewLine) || (xhtmlText !== '')) {
                        if (!/\n$/.test(xhtmlText)) {
                            xhtmlText += "\n";
                        }
                    }
                    else {
                        doNewLine = true;
                    }
                }

                xhtmlText += '<' + tagName;

                attr = child.attributes;
                attrLen = attr.length;
                validAttr = attrLang = attrXmlLang = attrXmlns = false;
                attrValue = '';

                for (j=0; j < attrLen; j++) {
                    attrName = attr[j].nodeName.toLowerCase();
                    if (attrName === 're_parsed_attr') {
                        continue;
                    }
                    if (!attr[j].specified && attrName !== 'selected' && attrName !== "style" && attrName !== "value" &&
                        attrName !== "shape" && attrName !== "coords" && /^on/.test(attrName) !== -1)
                    {
                        continue;
                    }
                    if ((attrName === "shape" || attrName === "coords") && tagName !== "area") {
                        continue;
                    }
                    if (tagName === "img" && attrName === "complete") {
                        continue;
                    }
                    if ((attrName === "selected" && !child.selected) || (attrName === "style" && child.style.cssText === '')) {
                        continue;
                    }
                    if (attrName === "_moz_dirty" || attrName === "_moz_resizing" || attrName === "_moz-userdefined" || attrName == "_moz_editor_bogus_node" ||
                        (tagName === "br" && attrName === "type" && attr[j].nodeValue === "_moz"))
                    {
                        continue;
                    }

                    validAttr = true;
                    switch (attrName) {
                        case "style" :
                            cssText = child.style.cssText.split(';');
							for (ct=0; ct < cssText.length; ct++) {
								kv = cssText[ct].split(/:/g);
								if (this.trimSpace(kv[0]) !== '' && this.trimSpace(kv[1]) !== '') {
                                    rs = kv.shift().toLowerCase();
                                    rs += ':' + kv.join(':');
									reMake.push(rs);
                                }
							}
                            attrValue = reMake.join(';');
                            reMake = [];
                            break;
                        case "class" :
							attrValue = child.className;
							break;
                        case "noshade" :
                        case "checked" :
                        case "selected" :
                        case "nowrap" :
                        case "disabled" :
                            attrValue = attrName;
                            break;
                        case "name" :
                            attrValue = child.name || child.getAttribute("name");
                            break;
                        case "for" :
                            attrValue = child.htmlFor;
                            break;
                        default :
                            try {
                                if (/^on/.test(attrName)) {
                                    if (this.config.allowedOnEvent) {
                                        attrValue = attr[j].nodeValue;
                                    }
                                    else {
                                        validAttr = false;
                                    }
                                }
                                else {
                                    attrValue = child.getAttribute(attrName, 2);
                                }
                            } catch(e) {
                                validAttr = false;
                            }
                    }

                    if (tagName === "embed") {
						switch (attrName) {
							case "align":
								attrValue = (mediaAlign !== '') ? mediaAlign : eval("child." + attrName);
								break;
							default:
                                attrValue = attr[j].nodeValue;
                                break;
						}
					}

					if (attrName === 'lang' && tagName === 'html') {
						attrLang = true;
						attrValue = lang;
					}

					if (attrName === 'xml:lang') {
						attrXmlLang = true;
						attrValue = lang;
					}

					if (attrName === 'xmlns') {
                        attrXmlns = true;
                    }

					if (tagName === 'object' && attrName === 'src' && GB.browser.msie) {
						attrValue = this.fixObjectSrc(child.outerHTML);
					}

					if (validAttr) {
						if (!(tagName === 'li' && attrName === 'value')) {
							xhtmlText += ' ' + attrName + "=";
							xhtmlText += (/"/.test(attrValue)) ? "'" + this.fixAttribute(attrValue) + "'" : '"' + attrValue + '"';
						}
					}
                }

                if (tagName === 'html') {
					if (!attrLang) {
                        xhtmlText += ' lang="' + lang + '"';
                    }
					if (!attrXmlLang) {
                        xhtmlText += ' xml:lang="' + lang + '"';
                    }
					if (!attrXmlns) {
                        xhtmlText += ' xmlns="http://www.w3.org/1999/xhtml"';
                    }
				}

                if (!GB.emptyElements[tagName] || child.hasChildNodes()) {
                    xhtmlText += '>';
                    innerText = '';
                    if (tagName === "style" || tagName === "title" || tagName === "script") {
                        innerText += (tagName === "script") ? child.text : child.innerHTML;
                        innerText = '\n'+this.trimSpace(innerText)+'\n';
                    }
                    else {
                        innerText += this.xhtmlParse(child, lang, encoding, doNewLine);
                    }

                    if (innerText !== '') {
                        xhtmlText += innerText;
                    }
                    xhtmlText += '</' + tagName + '>';
                }
                else {
                    xhtmlText += ' />';
                }
				break;
			case GB.node.TEXT_NODE :
                xhtmlText += this.htmlEncode(child.nodeValue);
				break;
            case GB.node.COMMENT_NODE :
                xhtmlText += "<!-- " + this.trimSpace(child.nodeValue) + " -->";
                break;
			default: break;
		}
	}
	return xhtmlText;
},

htmlEncode : function (text) {
    //text = text.replace(/\n{2,}$/g, "\n");
    text = text.replace(/&/g, "&amp;");
    text = text.replace(/</g, "&lt;");
    text = text.replace(/>/g, "&gt;");
    text = text.replace(/\u00a0/g, "&nbsp;");
    //text = text.replace(/\x22/g, "&quot;");
    return text;
},

fixAttribute : function (text) {
    return this.htmlEncode(text);
},

fixObjectSrc : function (text) {
	var obj = text.match(/<object ([^>]+)>/i);
	if (obj) {
		var value = obj[1].match(/src="([^"]+)"/i);
		if (!value) {
			value = obj[1].match(/src='([^']+)'/i);
			if (!value) {
                value = obj[1].match(/src=([^ ]+)/i);
            }
		}
		if (value) {
            return value[1];
        }
	}
	return '';
},

replaceObjectCode : function (text) {
	var tmpTxt = String(text);
	tmpTxt = tmpTxt.replace(/ style=/gi, 	' style=');
	tmpTxt = tmpTxt.replace(/ codeBase=/gi, ' codebase=');
	tmpTxt = tmpTxt.replace(/ height=/gi, 	' height=');
	tmpTxt = tmpTxt.replace(/ width=/gi, 	' width=');
	tmpTxt = tmpTxt.replace(/ align=/gi, 	' align=');
	tmpTxt = tmpTxt.replace(/ classid=/gi, 	' classid=');
	tmpTxt = tmpTxt.replace(/ src=/gi, 		' src=');
	tmpTxt = tmpTxt.replace(/ name=/gi, 	' name=');
	tmpTxt = tmpTxt.replace(/ value=/gi, 	' value=');
	tmpTxt = tmpTxt.replace(/ quality=/gi, 	' quality=');
	tmpTxt = tmpTxt.replace(/ type=/gi, 	' type=');
	tmpTxt = tmpTxt.replace(/ pluginspage=/gi, ' pluginspage=');
	tmpTxt = tmpTxt.replace(/<object /gi, 	'<object ');
	tmpTxt = tmpTxt.replace(/<\/object>/gi, '</object>');
	tmpTxt = tmpTxt.replace(/<param /gi, 	'<param ');
	tmpTxt = tmpTxt.replace(/<\/param>/gi, 	'</param>');
	tmpTxt = tmpTxt.replace(/<embed /gi, 	'<embed ');
	tmpTxt = tmpTxt.replace(/<\/embed>/gi, 	'</embed>');
	return tmpTxt;
},

needsClosingTag : function (el) {
	var closingTags = " head script style div span tr td tbody table em strong font a title ";
	return (closingTags.indexOf(" " + el.tagName.toLowerCase() + " ") != -1);
},

stripBaseURL : function (url) {
	var baseURL = this.config.baseURL;
	baseURL = baseURL.replace(/[^\/]+$/, '');

	var baseRe = new RegExp(baseURL);
	url = url.replace(baseRe, "");

	baseURL = baseURL.replace(/^(https?:\/\/[^\/]+)(.*)$/, '$1');
	baseRe = new RegExp(baseURL);

	return url.replace(baseRe, "");
},

checkDocLinks : function () {
	var links = this.doc.links;
	var len = links.length;
	var host = location.host;
    var i, href;
	this.cheditor.links = [];

	for (i=0; i < len; i++) {
		if (!this.config.includeHostname) {
			href = links[i].href;
			if (href.indexOf(host) !== -1) {
				links[i].setAttribute('href', href.substring(href.indexOf(host) + host.length));
			}
		}

		if (this.config.linkTarget !== '' && this.config.linkTarget != null) {
			if (!(links[i].getAttribute('target'))) {
				links[i].setAttribute('target', this.config.linkTarget);
			}
		}

		if (GB.browser.msie) {
			this.cheditor.links.push(links[i]);
		}
	}
},

checkDocImages : function () {
	var img = this.doc.images;
	var len = img.length;
	var host = location.host;
    var i, imgsrc;

	for (i=0; i < len; i++) {
		if (this.config.includeHostname == false) {
			imgsrc = img[i].src;
			if (imgsrc) {
				if (imgsrc.indexOf(host) != -1) {
					img[i].src = imgsrc.substring(imgsrc.indexOf(host) + host.length);
				}
			}
		}
		if (img[i].style.width) {
            img[i].removeAttribute('width');
        }
		if (img[i].style.height) {
            img[i].removeAttribute('height');
        }
	}
},

getContents : function (fullSource) {
	this.checkDocLinks();
	this.checkDocImages();
    var i;

	if ((GB.browser.msie || GB.browser.iegecko || GB.browser.opera) && this.config.ieEnterMode == 'css') {
		var para = this.doc.body.getElementsByTagName('P');
		var len = para.length;

		for (i=0; i < len; i++) {
			if (para[i].style.cssText.toLowerCase().indexOf("margin") == -1) {
				para[i].style.margin = '0px';
			}
		}
	}

	if (this.config.allowedScript == false) {
		var script = this.doc.body.getElementsByTagName('script');
		var remove = [];

		for (i=0; i < script.length; i++) {
			remove.push(script[i]);
		}

		for (i=0; i < remove.length; i++) {
			remove[i].parentNode.removeChild(remove[i]);
		}
	}

	var mydoc;

	if (GB.browser.msie) {
        this.doc.body.removeAttribute('contentEditable');
    }

    if (this.config.outputXhtml) {
        mydoc = this.xhtmlParse(fullSource ? this.doc.documentElement : this.doc.body, this.config.xhtmlLang, this.config.xhtmlEncoding, true);
    }
    else {
        if (fullSource) {
            var content = this.doc.documentElement;
            if (GB.browser.msie) {
                mydoc = content.outerHTML;
            }
            else {
                var div = document.createElement('div');
                div.appendChild(content.cloneNode(true));
                mydoc = div.innerHTML;
            }
        }
        else {
            mydoc = this.doc.body.innerHTML;
        }
    }

	if ((GB.browser.msie || GB.browser.opera) && this.config.ieEnterMode == 'div') {
		mydoc = mydoc.replace(/<(\/?)p([^>]*)>/ig,
				function (a, b, c) {
					if (/^\S/.test(c)) { return a; }
					return '<' + b + 'div' + c + '>';
				});
	}

    mydoc = mydoc.replace(/<p><\/p>/g, "");
    mydoc = mydoc.replace(/<div><\/div>/g, "");

    if (GB.browser.iegecko) {
        if (this.config.ieEnterMode == 'br') {
            mydoc = mydoc.replace(/<p([^>]*)><br(\s+)\/><\/p>/ig, "<p$1></p>");
            mydoc = mydoc.replace(/<p([^>]*)>(.*?)<\/p>/ig, "$2<br />");
        }
        else if (this.config.ieEnterMode == "default" || this.config.ieEnterMode == "css") {
            mydoc = mydoc.replace(/<p([^>]*)><br(\s+)\/><\/p>/ig, "<p$1>&nbsp;</p>");
        }
    }

	var self = this;
    if (this.config.colorToHex) {
        mydoc = mydoc.replace(/([color|background\-color]\s?[:=]).?(rgba?)\(\s*(\d+)\s*,\s*(\d+),\s*(\d+)\)/ig,
                function (a, b, c, d, e, f) {
                    return b + ' ' + self.colorConvert(c+'('+d+','+e+','+f+')', "hex");
                });
    }
    else {
        mydoc = mydoc.replace(/([color|background\-color]\s?[:=])(.?)#([a-fA-F0-9]+)/ig,
                function (a, b, c, d) {
                    return b + c + self.colorConvert(d, "rgb");
                });
    }

	return this.makeAmpTag(mydoc);
},

returnContents : function (mydoc) {
	this.setDesignMode(true);
	this.cheditor.textarea.value = mydoc;
	return mydoc;
},

makeAmpTag 	: function (str) { return str.replace(/&lt;/g, '&amp;lt;').replace(/&gt;/g, '&amp;gt;'); },
removeAmpTag: function (str) { return str.replace (/&amp;lt;/g, '&lt;').replace(/&amp;gt;/g,'&gt;'); },

getOutputContents : function (fullSource) {
	this.resetViewHTML();
	return this.removeAmpTag(this.getContents(fullSource));
},

outputHTML : function () {
	return this.returnContents(this.getOutputContents(true));
},

outputBodyHTML : function () {
	return this.returnContents(this.getOutputContents(false));
},

outputBodyText : function () {
	return this.returnContents(this.getBodyText());
},

getBodyText : function () {
	this.resetViewHTML();
	var rdata = String(GB.browser.msie ? this.doc.body.innerText : this.doc.body.textContent);
	return this.trimSpace(rdata);
},

returnFalse : function () {
	this.editAreaFocus();
	var img = this.doc.images, i;
	for (i=0; i<img.length; i++) {
		if (img[i].src) {
			if (img[i].getAttribute("onload")) {
				img[i].onload = 'true';
			}
		}
		else {
			img[i].removeAttribute("onload");
			img[i].removeAttribute("className");
		}
	}
	return false;
},

trimSpace : function (str) {
	str = str || '';
	return str.replace(/^\s+|\s+$/g, '');
},

makeRandomString : function () {
	var chars = "_-$@!#0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var len = 32;
	var clen = chars.length;
	var rData = '', i, rnum;
	for (i=0; i<len; i++) {
		rnum = Math.floor(Math.random() * clen);
		rData += chars.substring(rnum,rnum+1);
	}
	return rData;
},

strLength : function (str) {
	var len = str.length;
	var mbytes = 0, i, c;
	for (i=0; i<len; i++) {
		c = str.charCodeAt(i);
		if (c > 128) {
            mbytes++;
        }
	}
	return (len-mbytes) + (mbytes*2);
},

resetViewHTML : function () {
	if (this.cheditor.mode === 'code') {
		this.switchEditorMode('rich');
	}
},

contentsLengthAll : function () {
	return this.strLength(this.outputHTML());
},

contentsLength : function () {
	var content = String(this.trimSpace(this.outputBodyHTML()));
	if (!content || content == "") { return 0; }
	return this.strLength(content);
},

inputLength : function () {
	var content = this.getBodyText();
	if (content === '') { return 0; }
	return this.strLength(content);
},

displayWindow : function (pNode, id) {
	this.editAreaFocus();
    this.setRange(this.getRange());
	this.boxHideAll(id);
	var pullDown = this.pulldown[id];
	pullDown.style.visibility = "visible";
	pullDown.style.zIndex = 1002;
    pullDown.focus();
},

pulldownMouseOver : function (el) {
	if (el.className == 'cheditor-pulldown-selected') { return; }
	el.className = "cheditor-pulldown-mouseover";
},
pulldownMouseOut  : function (el) {
	if (el.className == 'cheditor-pulldown-selected') { return; }
	el.className = "cheditor-pulldown-mouseout";
},

windowPos : function (pNode, id) {
	var L = pNode.offsetLeft;
	var boxEl = this.pulldown[id];
	boxEl.style.left = L + 'px';
	boxEl.style.top  = pNode.offsetTop + parseInt(pNode.style.height, 10) + 'px';
},

boxHideAll : function (showId) {
    var menu, elem, ishide;
	for (menu in this.pulldown) {
        if (this.pulldown.hasOwnProperty(menu)) {
		    elem = this.pulldown[menu];
		    if (elem) {
		    	elem.style.visibility = 'hidden';
		    	ishide = this.undefined(showId) ? true : (menu !== showId);
		    	if (this.toolbar && ishide) {
		    		this.toolbar[menu].checked = false;
		    		this.toolbarButtonUnchecked(this.toolbar[menu].button);
		    	}
		    }
        }
	}
},

createWindow : function (width, div) {
	div.className = 'cheditor-pulldown-container';
	div.style.width = width+'px';
},

setColorTable : function (pNode, menu) {
	var self = this;
	var pulldown = document.createElement('div');
	pulldown.className = 'cheditor-pulldown-color-wrapper';

	var h = 70, j, cell, k=0;
	var container = document.createElement('div');
	var selected = document.createElement('div');
	selected.style.backgroundColor = pNode.lastChild.style.backgroundColor;
	var label = document.createElement('label');
	selected.appendChild(label);
	selected.className = 'cheditor-pulldown-color-selected';

	if (label.hasChildNodes()) {
		label.removeChild(selected.firstChild);
    }

	label.appendChild(document.createTextNode(pNode.lastChild.style.backgroundColor));
	container.appendChild(selected);

    var mouseOver = function() {
		this.className = 'cheditor-pulldown-color-over';
        var color = this.id;
        selected.style.backgroundColor = color;
		label.replaceChild(document.createTextNode(color.toUpperCase()), label.firstChild);
    };
    var mouseOut = function() { this.className = 'cheditor-pulldown-color-cell'; };
    var cellCmd = function() {
        self.changeFontColor(this.id, menu);
    };

	for (j=0; j < h; j++) {
		cell = document.createElement('div');
		if (!(j % 10 + 1)) {
			cell.style.clear = 'both';
			container.appendChild(cell);
			h++;
			continue;
		}

		cell.className = 'cheditor-pulldown-color-cell';
        cell.id = GB.colors[k];
		cell.style.backgroundColor = GB.colors[k++];
		cell.onmouseover = mouseOver;
		cell.onmouseout = mouseOut;
		cell.onclick = cellCmd;

		cell.appendChild(document.createTextNode('\u00a0'));
		container.appendChild(cell);

		if (j == 9 || j == 59) {
			cell = document.createElement('div');
			cell.className = 'cheditor-pulldown-color-spacer';
			container.appendChild(cell);
		}
	}

	pulldown.appendChild(container);
	return pulldown;
},

onKeyPressToolbarUpdate : function () {
    var self = this;
    if (self.tempTimer) { clearTimeout(self.tempTimer); }
    self.tempTimer = setTimeout(function() {
        self.toolbarUpdate();
        self.tempTimer = null;
    }, 50);
    if (self.config.showTagPath) { self.doEditorEvent(); }
},

doOnArrowKeyPress : function (ev) {
    var key = ev.keyCode;
    if (key !== 8 && (key < 33 || key > 40)) { return; }
    this.onKeyPressToolbarUpdate();
},

doOnKeyPress : function (ev) {
    if (GB.browser.msie && this.config.ieEnterMode == 'br') {
        var key = this.editArea.event.keyCode;
        if (key && key == 13) {
            if (this.editArea.event.shiftKey == false) {
                var rng = this.getRange();
                this.stopEvent(ev);
                if (this.W3CRange) { // IE 9, 10
                    var br = this.doc.createElement("br");
                    rng.insertNode(br);
                    rng.setStartAfter(br);
                    rng.collapse(false);
                }
                else { // IE < 9
                    rng.pasteHTML("<br>");
                    rng.select();
                    rng.moveEnd("character", 1);
                    rng.moveStart("character", 1);
                    rng.collapse(false);
                }
                return false;
            }
            this.editArea.event.keyCode = 13;
        }
    }
    this.onKeyPressToolbarUpdate();
},

setWinPosition : function (oWin, popupAttr, windowSize) {
	oWin.style.width = popupAttr.width + 'px';
    oWin.style.left = (windowSize.width / 2) - (popupAttr.width / 2) + 'px';
    oWin.style.top = windowSize.scrollY + (windowSize.height/2) - (popupAttr.posv/2) + 'px';
},

getWindowSize : function () {
	var docMode = document.compatMode == 'CSS1Compat';
	var docBody = document.body;
	var docElem = document.documentElement;

	var rData = {
		width   : docMode ? docElem.clientWidth   : docBody.clientWidth,
		height  : docMode ? docElem.clientHeight  : docBody.clientHeight,
        scrollHeight : docMode ? docElem.scrollHeight : docBody.scrollHeight,
        scrollWidth : docMode ? docElem.scrollWidth : docBody.scrollWidth
	};

    if (this.undefined(window.pageXOffset)) {
        var factor = 1;
        if (document.body.getBoundingClientRect) {
            var rect = document.body.getBoundingClientRect ();
            var physicalW = rect.right - rect.left;
            var logicalW = document.body.offsetWidth;
            factor = Math.round ((physicalW / logicalW) * 100) / 100;
        }
        rData.scrollY = Math.round(document.documentElement.scrollTop / factor);
        rData.scrollX = Math.round(document.documentElement.scrollLeft / factor);
    }
    else {
        rData.scrollY = window.pageYOffset;
        rData.scrollX = window.pageXOffset;
    }

    return rData;
},

popupWinLoad : function (popupAttr) {
	var self = this;
    var windowSize = self.getWindowSize();

	if (self.cheditor.popupTitle.hasChildNodes()) {
        self.cheditor.popupTitle.removeChild(self.cheditor.popupTitle.firstChild);
    }

	self.cheditor.popupTitle.appendChild(document.createTextNode(popupAttr['title']));
	self.cheditor.popupElem.style.zIndex = 1002;
    self.setWinPosition(self.cheditor.popupElem, popupAttr, windowSize);

	var iframe = document.createElement("iframe");
	iframe.setAttribute('frameBorder', "0");
    iframe.setAttribute('width', popupAttr['width'] - 22);
	iframe.setAttribute('name', popupAttr['tmpl']);
	iframe.setAttribute('src', self.config.popupPath + popupAttr['tmpl']);
	iframe.style.visibility = 'hidden';
	iframe.id = popupAttr['tmpl'];

	if (self.cheditor.popupFrameWrapper.hasChildNodes()) {
        self.cheditor.popupFrameWrapper.removeChild(self.cheditor.popupFrameWrapper.firstChild);
    }

	self.cheditor.popupFrameWrapper.appendChild(iframe);

	var popWinResizeHeight = function () {
        iframe.style.visibility = 'visible';
        iframe.contentWindow.focus();
        iframe.contentWindow.init.call(self, iframe, popupAttr['argv'] || null);
	};

	if (GB.browser.msie) {
		var done = false;
		iframe.onreadystatechange = function() {
			if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
				done = true;
				popWinResizeHeight();
			}
		};
	}
	else {
		iframe.onload = popWinResizeHeight;
	}

	self.cheditor.popupElem.style.display = 'block';
	self.cheditor.modalBackground.style.zIndex = self.modalElementZIndex;

    if (GB.browser.msie && GB.browser.ver < 10) {
        var modalResize = function() {
            self.cheditor.modalBackground.style.height = (windowSize.scrollHeight > windowSize.height) ?
                windowSize.scrollHeight : windowSize.height + 'px';

            if (window.scrollWidth > window.width) {
                self.cheditor.modalBackground.style.width = windowSize.width + (windowSize.scrollWidth - windowSize.width) + 'px';
            }
            else {
                self.cheditor.modalBackground.style.width = windowSize.width + 'px';
            }

            self.cheditor.modalBackground.style.left = windowSize.scrollX + 'px';
        };

        window.onresize = function() {
            windowSize = self.getWindowSize();
            modalResize();
        };

        modalResize();
        self.cheditor.modalBackground.style.filter = 'alpha(opacity=50)';
    }
    else {
        self.cheditor.modalBackground.style.opacity = 0.5;
    }

    var body = document.getElementsByTagName('body')[0];
	body.insertBefore(self.cheditor.modalBackground, body.firstChild);
	self.cheditor.modalBackground.style.display = 'block';
	body.insertBefore(self.cheditor.popupElem, body.firstChild);
	DragWindow.init(self.cheditor.dragHandle, self.cheditor.popupElem);
},

popupWinCancel : function () {
    this.restoreRange();
    this.popupWinClose();
},

popupWinClose : function () {
	if (this.cheditor.popupElem == null) {
		return;
    }
	this.cheditor.popupElem.style.display = 'none';
	this.cheditor.popupElem.style.zIndex = -1;
	this.cheditor.popupFrameWrapper.src = "";

    if (this.cheditor.popupFrameWrapper.hasChildNodes()) {
		this.cheditor.popupFrameWrapper.removeChild(this.cheditor.popupFrameWrapper.firstChild);
    }

	this.cheditor.modalBackground.style.display = 'none';
	this.cheditor.modalBackground.style.zIndex = -1;

	if (this.modalReSize !== null) {
		if (GB.browser.opera) {
			window.removeEventListener("resize", this.modaReSize, false);
		}
		this.modalReSize = null;
	}

    this.editAreaFocus();
},

clearStoredSelections : function () {
    this.storedSelections.splice(0, this.storedSelections.length);
},

restoreRange : function () {
    var range = null, selection = null;
    if (this.storedSelections[0]) {
        if (this.W3CRange) {
            selection = this.getSelection();
            selection.removeAllRanges();
            selection.addRange(this.storedSelections[0]);
            range = selection.getRangeAt(0);
        }
        else {
            range = this.getRange();
            range.moveToBookmark(this.storedSelections[0]);
            range.select();
        }
    }
    return range;
},

setRange : function (range) {
    var selection = null;

    if (this.W3CRange) {
        selection = this.getSelection();
		if (selection.rangeCount > 0) {
			selection.removeAllRanges();
			selection.addRange(range);
            this.storedSelections[0] = selection.getRangeAt(0);
		}
   }
   else {
        try {
            if (range) {
                this.storedSelections[0] = range.getBookmark();
            }
        } catch(ignore) {}
   }
},

getSelection : function () {
    return this.W3CRange ? this.editArea.getSelection() : this.doc.selection;
},

getRange : function () {
   var selection = this.getSelection();
   var range;

    if (this.W3CRange) {
        if (selection.getRangeAt) {
            range = (selection.rangeCount > 0) ? selection.getRangeAt(0) : this.doc.createRange();
        }
        else {
            range = this.doc.createRange();
            range.setStart(selection.anchorNode, selection.anchorOffset);
            range.setEnd(selection.focusNode, selection.focusOffset);
        }
    }
    else {
        range = selection.createRange ? selection.createRange() : this.doc.createRange();
        if (!range) {
            range = this.doc.body.createTextRange();
        }
    }

    this.range = range;
    return range;
},

createRange : function () {
    var range;

    if (this.W3CRange) {
        range = this.doc.createRange();
    }
    else {
        range = this.doc.createRange ? this.doc.createRange() : this.doc.body.createTextRange();
    }

    return range;
},

getW3RangeElement : function (range) {
    if (!this.W3CRange) { return null; } // IE < 9

    var rootNode = range.commonAncestorContainer;
    var startContainer = range.startContainer;
    var endContainer = range.endContainer;
    var startOffset = range.startOffset;
    var endOffset = range.endOffset;
    var node = startContainer;

    if (GB.browser.msie || GB.browser.iegecko) {
        if (!range.collapsed && rootNode.nodeType === GB.node.ELEMENT_NODE) {
            if (rootNode === endContainer) {
                node = rootNode.childNodes[endOffset-1];
            }
            else if (rootNode === startContainer) {
                node = rootNode.childNodes[startOffset];
            }
            else {
                var len = rootNode.childNodes.length, i;
                for (i=0; i<len; i++) {
                    if (rootNode.childNodes[i] === startContainer) {
                        node = rootNode.childNodes[i].nextSibling;
                        break;
                    }
                }
            }
        }
    }
    else {
        if (!range.collapsed && startContainer === endContainer && startContainer.nodeType === GB.node.ELEMENT_NODE &&
            (endOffset - startOffset) === 1 && startContainer.hasChildNodes())
        {
            node = startContainer.childNodes[startOffset];
        }
    }

    return node;
},

getSelectionType : function (range) {
	if (!range) {
        return null;
    }

    var type = GB.selection.SELECTION_NONE;
    var selection = this.getSelection();
    if (!selection) {
        return type;
    }

	if (this.W3CRange) {
        if (selection.rangeCount == 1) {
            var pNode = this.getW3RangeElement(range);
            if (pNode.nodeType === GB.node.ELEMENT_NODE) {
                type = !(range.toString()) ? GB.selection.SELECTION_ELEMENT : GB.selection.SELECTION_TEXT;
            }
            else if (pNode.nodeType === GB.node.TEXT_NODE) {
                type = GB.selection.SELECTION_TEXT;
            }
            else {
                type = GB.selection.SELECTION_NONE;
            }
        }
	}
	else {
		try {
			var selectionType = selection.type;
            switch (selectionType) {
                case "Text": type = GB.selection.SELECTION_TEXT; break;
                case "Control": type = GB.selection.SELECTION_ELEMENT; break;
                case "None": type = GB.selection.SELECTION_NONE; break;
                default: break;
            }

            if (type == GB.selection.SELECTION_NONE && selectionType.createRange().parentElement())
            {
                type = GB.selection.SELECTION_TEXT;
            }
		}
        catch (ignore) {}
	}

	return type;
},

windowOpen : function (popupName) {
	this.editAreaFocus();
	this.boxHideAll();
	this.setRange(this.getRange());
	if (!(this.undefined(GB.popupWindow[popupName]))) {
		this.popupWinLoad(GB.popupWindow[popupName]);
    }
	else {
        alert('사용할 수 없는 명령입니다.');
    }
},

doCmd : function (cmd, opt) {
    this.editAreaFocus();
	this.boxHideAll();

    var range = null;
    range = this.range;

    if (cmd == 'NewDocument') {
		if (confirm('글 내용이 모두 사라집니다. 계속하시겠습니까?')) {
            this.doc.body.innerHTML = '';
        }

		this.images = [];
		this.editImages = {};
		this.editAreaFocus();
		this.toolbarUpdate();
		return;
	}

	if (cmd == 'ClearTag') {
		if (confirm('모든 HTML 태그를 삭제합니다. 계속하시겠습니까?\n(P, DIV, BR 태그와 텍스트는 삭제하지 않습니다.)')) {
			var content = this.doc.body.innerHTML;
			this.doc.body.innerHTML = content.replace(/<(\/?)([^>]*)>/g,
					function(a, b, c) {
						var el = c.toLowerCase().split(/ /)[0];
						if (el != 'p' && el != 'div' && el != 'br') {
                            return '';
                        }
						return '<'+b+el+'>';
					});
		}

		this.editAreaFocus();
		this.toolbarUpdate();
		return;
	}

	if (cmd == 'Print') {
		this.editArea.print();
		return;
	}

	if (cmd == 'PageBreak') {
		this.printPageBreak();
		this.editAreaFocus();
		return;
	}

	if (this.W3CRange || (!this.W3CRange && (this.getSelectionType(range) === GB.selection.SELECTION_NONE))) {
		range = this.doc;
	}

	if (!GB.browser.msie && (cmd == 'Cut' || cmd == 'Copy' || cmd == 'Paste')) {
		try { range.execCommand(cmd, false, opt); }
		catch (e) {
			var keyboard = '';
			var command = '';
			switch (cmd) {
				case 'Cut'  : keyboard = 'x'; command = '자르기'; break;
				case 'Copy' : keyboard = 'c'; command = '복사'; break;
				case 'Paste': keyboard = 'v'; command = '붙이기'; break;
			}

			alert('사용하고 계신 브라우저에서는 \'' + command + '\' 명령을 사용하실 수 없습니다. \n' +
			'키보드 단축키를 이용하여 주세요. (윈도 사용자: Ctrl + ' + keyboard + ', Mac 사용자: Apple + ' + keyboard + ')');
		}

		this.editAreaFocus();
		return;
	}

	try {
		if (cmd == 'PasteFromWord') {
			if (this.undefined(this.cheditor.tmpdoc)) {
				var tmpframe = this.doc.createElement('iframe');
				tmpframe.setAttribute('contentEditable', "true");
				tmpframe.style.visibility = 'hidden';
				tmpframe.style.height = tmpframe.style.width = '0px';
				tmpframe.setAttribute('frameBorder', "0");
				this.cheditor.editWrapper.appendChild(tmpframe);

				var tmpdoc = tmpframe.contentWindow.document;
				tmpdoc.designMode = 'On';
				tmpdoc.open();
				tmpdoc.close();
				this.cheditor.tmpdoc = tmpdoc;
			}

            var self = this;
            var cleanPaste = function() {
                self.editArea.focus();
                var tmpDoc = self.cheditor.tmpdoc;
                tmpDoc.execCommand("SelectAll");
                tmpDoc.execCommand("Paste");
                return self.cleanFromWord(tmpDoc);
            };
            if (this.W3CRange) {
                var html = cleanPaste();
                range = this.restoreRange();
                this.insertNodeAtSelection(html);
            }
            else {
                range = this.getRange();
                range.pasteHTML(cleanPaste());
                range.select();
            }
		}
		else if (cmd == 'Paste') {
            range.execCommand(cmd);
		}
        else if (cmd == 'InsertHorizontalRule') {
            var hr = this.doc.createElement('hr');
            hr.style.height = '1px';
            hr.style.backgroundColor = "#999";
            hr.style.border = "0";

            if (!this.W3CRange) {
                var div = this.doc.createElement('div');
                div.appendChild(this.doc.createElement('br'));
                div.appendChild(hr);
                div.appendChild(this.doc.createElement('br'));
                this.insertHTML(div.innerHTML);
            }
            else {
                range = this.getRange();
                range.deleteContents();
                range.insertNode(hr);
                range.collapse(false);
                range.setStartAfter(hr);
                var br;
                var nNode = hr.nextSibling;
                if (!nNode || (nNode.nodeType == GB.node.TEXT_NODE && nNode.length == 0)) {
                    br = this.doc.createElement('br');
                    range.insertNode(br);
                    range.setStartBefore(br);
                    range.collapse(true);
                }
                if (!hr.previousSibling) {
                    br = this.doc.createTextNode('\u00a0');
                    hr.parentNode.insertBefore(br, hr);
                }

                var selection = this.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
		else {
            range.execCommand(cmd, false, opt);
		}
	}
	catch (e) {
		alert(cmd + ": 지원되지 않는 명령입니다.");
	}

    this.editAreaFocus();
    this.toolbarUpdate();
},

cleanFromWord : function (tmpDoc) {
	var doc = tmpDoc.body.innerHTML;
	doc = doc.replace(/MsoNormal/g, "");        doc = doc.replace(/<\\?\?xml[^>]*>/g, "");  doc = doc.replace(/<\/?o:p[^>]*>/g, "");
	doc = doc.replace(/<\/?v:[^>]*>/g, "");     doc = doc.replace(/<\/?o:[^>]*>/g, "");     doc = doc.replace(/<\/?st1:[^>]*>/g, "");
	doc = doc.replace(/<!--(.*)-->/g, "");      doc = doc.replace(/<!--(.*)>/g, "");        doc = doc.replace(/<!(.*)-->/g, "");
	doc = doc.replace(/<\\?\?xml[^>]*>/g, "");  doc = doc.replace(/<\/?o:p[^>]*>/g, "");    doc = doc.replace(/<\/?v:[^>]*>/g, "");
	doc = doc.replace(/<\/?o:[^>]*>/g, "");     doc = doc.replace(/<\/?st1:[^>]*>/g, "");   doc = doc.replace(/lang=.?[^" >]*/ig, "");
	doc = doc.replace(/type=.?[^" >]*/g, "");   doc = doc.replace(/href='#[^"]*'/g, "");    doc = doc.replace(/href="#[^"]*"/g, "");
	doc = doc.replace(/name=.?[^" >]*/g, "");   doc = doc.replace(/ clear="all"/g, "");     doc = doc.replace(/id="[^"]*"/g, "");
	doc = doc.replace(/title="[^"]*"/g, "");    doc = doc.replace(/\n/g, "");               doc = doc.replace(/\r/g, "");
    doc = doc.replace(/mso\-[^">;]*/g, "");     doc = doc.replace(/<p[^>]*/ig, "<p");       doc = doc.replace(/windowtext/ig, "#000000");
	doc = doc.replace(/class=table/ig, "");     doc = doc.replace(/<span[^>]*<\/span>/ig, "");
	return doc;
},

printPageBreak : function () {
	var hr = document.createElement('hr');
	hr.style.pageBreakAfter = 'always';
	hr.style.border = '1px #999 dotted';
	this.insertHTML(hr);
    var div = this.doc.createElement("div");
    div.appendChild(this.doc.createTextNode("\u00a0"));
    this.insertHTML(div);
},

doCmdPaste : function (html) {
    this.editAreaFocus();
    if (!this.W3CRange) {
        if (this.range.item) {
            var rng = this.doc.body.createTextRange();
            if (rng) {
                rng.moveToElementText(this.range.item(0));
                rng.select();
                this.range.item(0).outerHTML = html;
            }
            this.toolbarUpdate();
        }
        else {
            this.range.pasteHTML(html);
            this.range.select();
        }
    }
    else {
        this.insertNodeAtSelection(html);
    }
},

getPreviousLeaf : function (node) {
    while (!node.previousSibling) {
        node = node.parentNode;
        if (!node) {
            return node;
        }
    }
    var leaf = node.previousSibling;
    while (leaf.lastChild) {
        leaf = leaf.lastChild;
    }
    return leaf;
},

doCmdPopup : function (cmd, opt) {
    this.editAreaFocus();
    var self = this;
    this.restoreRange();
    var range = this.restoreRange();
    var selectionType = this.getSelectionType(range);

    if (this.W3CRange) {
        range = this.doc;
    }
    else {
        range = (selectionType === GB.selection.SELECTION_NONE) ? this.doc : range;
    }

    try {
        if (cmd === "LineHeight") {
            range = this.getRange();

            var isBlockElement = function(elem) {
                return GB.lineHeightBlock.indexOf('|'+elem.toLowerCase()+'|') !== -1;
            };

            var getNextLeaf = function(node, endLeaf, value) {
                while (!node.nextSibling) {
                    node = node.parentNode;
                    if (!node) {
                        return node;
                    }
                }

                if (node == endLeaf) {
                    return node;
                }

                var leaf = node.nextSibling;
                if (isBlockElement(leaf.nodeName)) {
                    leaf.style.lineHeight = value;
                }

                while (leaf.firstChild) {
                    leaf = leaf.firstChild;
                    if (leaf.nodeType !== GB.node.TEXT_NODE && isBlockElement(leaf.nodeName)) {
                        leaf.style.lineHeight = value;
                    }
                }
                return leaf;
            };

            var startContainer, endContainer;

            if (!this.W3CRange) {
                var getRangeAt = function(range) {
                    var convert = function (result, bStart) {
                        var point = range.duplicate();
                        var span = self.doc.createElement('span');
                        var cursor = self.doc.body.createTextRange();
                        var parent = point.parentElement();

                        point.collapse(bStart);
                        parent.appendChild(span);
                        cursor.moveToElementText(span);

                        var compareStr = bStart ? 'StartToStart' : 'StartToEnd';

                        while (cursor.compareEndPoints(compareStr, point) > 0 && span.previousSibling)
                        {
                            parent.insertBefore(span, span.previousSibling);
                            cursor.moveToElementText(span);
                        }

                        result.container = span.nextSibling || span.previousSibling;
                        parent.removeChild(span);
                    };

                    var start = {}, end = {};
                    convert(start, true); convert(end, false);

                    return { startContainer: start.container, endContainer: end.container };
                };

                var ieRange = getRangeAt(range);
                startContainer = ieRange.startContainer;
                endContainer = ieRange.endContainer;
            }
            else {
                startContainer = range.startContainer;
                endContainer = range.endContainer;
            }

            if (!this.doc.body.hasChildNodes() || !startContainer || !endContainer) {
                throw "Object Error";
            }

            if (startContainer && startContainer.nodeName === "BODY") {
                startContainer = startContainer.firstChild;
            }

            try {
                var startLeaf, endLeaf;
                var para, nextNode;
                var applyBlockElement = function(elem) {
                    while (elem) {
                        if (elem.nodeName === "BODY") {
                            para = self.doc.createElement("p");
                            para.style.lineHeight = opt;

                            if (elem.firstChild) {
                                elem.insertBefore(para, elem.firstChild);
                            }
                            else {
                                elem.appendChild(para);
                                break;
                            }

                            nextNode = para.nextSibling;
                            while (nextNode) {
                                if (isBlockElement(nextNode.nodeName)) {
                                    break;
                                }
                                para.appendChild(nextNode);
                                nextNode = para.nextSibling;
                            }
                            break;
                        }

                        if (isBlockElement(elem.nodeName)) {
                            elem.style.lineHeight = opt;
                            break;
                        }
                        elem = elem.parentNode;
                    }
                };

                if (startContainer == endContainer) {
                    applyBlockElement(startContainer);
                }
                else {
                    startLeaf = startContainer;
                    while (startLeaf) {
                        if (startLeaf.nodeName === "BODY" || isBlockElement(startLeaf.nodeName)) {
                            break;
                        }
                        startLeaf = startLeaf.parentNode;
                    }

                    endLeaf = endContainer;
                    while (endLeaf) {
                        if (endLeaf.nodeName === "BODY" || isBlockElement(endLeaf.nodeName)) {
                            break;
                        }
                        endLeaf = endLeaf.parentNode;
                    }

                    if (startLeaf === endLeaf) {
                        if (isBlockElement(startLeaf.nodeName)) {
                            startLeaf.style.lineHeight = opt;
                        }
                        else {
                            para = this.doc.createElement("P");
                            para.style.lineHeight = opt;
                            startLeaf.insertBefore(para, startLeaf.firstChild);

                            nextNode = para.nextSibling;
                            while (nextNode) {
                                if (isBlockElement(nextNode.nodeName)) {
                                    break;
                                }
                                para.appendChild(nextNode);
                                nextNode = para.nextSibling;
                            }
                        }
                    }
                    else {
                        applyBlockElement(startLeaf);
                        var nextLeaf;
                        while (startLeaf) {
                            nextLeaf = getNextLeaf(startLeaf, endLeaf, opt);
                            if (startLeaf === endLeaf) {
                                break;
                            }
                            startLeaf = nextLeaf;
                        }
                    }
                }
            }
            catch (ignore) {}
        }
        else {
            if (cmd === "FontName" && opt === "맑은 고딕") { opt += ", Malgun Gothic"; }
            range.execCommand(cmd, false, opt);
        }
    }
    catch (ignore) {}

    if (this.tempTimer) {
        clearTimeout(this.tempTimer);
    }

    this.tempTimer = setTimeout(function() {
        self.toolbarUpdate();
        self.tempTimer = null;
    }, 50);

    this.boxHideAll();
},

modifyImage : function (img) {
	var self = this;
	var widthOptions = {'default'   : { size: 'default', desc: '원본 크기'},
						'custom'    : { size: 'input', desc: '직접 입력:'},
						'fitpage'   : { size: '100%', desc: '페이지 크기에 맞춤'},
						'px160'     : { size: 160, desc: '썸네일, 160 픽셀'},
						'px320'     : { size: 320, desc: '작은 크기, 320 픽셀'},
						'px640'     : { size: 640, desc: '중간 크기, 640 픽셀'},
						'px1024'    : { size: 1024, desc: '크게, 1024 픽셀'},
						'px1600'    : { size: 1600, desc: '아주 크게, 1600 픽셀'}
	};
	var imageAlign = {'left'        : '왼쪽',
					  'center'      : '가운데',
					  'right'       : '오른쪽'
	};

	if (img.id == '') {
        img.id = 'image_' + Math.random();
    }

	var selectedWidth = document.createElement('select'), idx;
	for (idx in widthOptions) {
        if (widthOptions.hasOwnProperty(idx)) {
		    selectedWidth.options[selectedWidth.options.length] = new Option(widthOptions[idx].desc, idx);
        }
	}

	selectedWidth.onchange = function() {
		if (this.value == 'custom') {
			inputWidthWrapper.style.display = '';
			inputWidth.focus();
		}
		else {
			inputWidthWrapper.style.display = 'none';
			editImageSubmit();
		}
	};

	var div = document.createElement('div');
	div.style.textAlign="left";
	var ico = new Image();
	ico.src = this.config.iconPath + 'image_resize.png';
	ico.className = 'cheditor-ico';
	div.appendChild(ico);
	div.appendChild(selectedWidth);

	var inputWidthWrapper = document.createElement('span');
	var inputWidth = document.createElement('input');
	inputWidth.setAttribute('type', 'text');
	inputWidth.setAttribute('name', 'inputWidth');
	inputWidth.className = 'user-input-width';

	inputWidthWrapper.appendChild(inputWidth);
	inputWidthWrapper.appendChild(document.createTextNode(' 픽셀'));
	div.appendChild(inputWidthWrapper);

	selectedWidth.value = 'custom';

	var alignIco = new Image();
	alignIco.src = this.config.iconPath + 'image_align_left.png';
	alignIco.className = 'cheditor-ico';
	alignIco.style.marginLeft = '20px';
	div.appendChild(alignIco);

	var selectedAlign = document.createElement('select');
	selectedAlign.style.marginRight = '5px';

	div.appendChild(selectedAlign);

	for (idx in imageAlign) {
        if (imageAlign.hasOwnProperty(idx)) {
		    selectedAlign.options[selectedAlign.options.length] = new Option(imageAlign[idx], idx);
        }
	}

	selectedAlign.onchange = function() {
		alignIco.src = self.config.iconPath + 'image_align_' + this.value + '.png';

		if (this.value == 'center') {
			wrapspan.style.display = 'none';
		}
		else {
			wrapspan.style.display = '';
			wrapIcon.src = self.config.iconPath + 'image_align_' + selectedAlign.value + '_wt.png';
		}
		wrapcheck.checked = false;
	};

	var wrapspan = document.createElement('span');
	var wrapcheck = document.createElement('input');
	wrapcheck.setAttribute('type', 'checkbox');
	wrapcheck.setAttribute('name', 'wrapText');
	wrapcheck.setAttribute('value', '1');
	wrapcheck.className = 'wrap-checked';

	wrapcheck.onclick = function() {
		alignIco.src = self.config.iconPath + 'image_align_' + selectedAlign.value + (this.checked ? '_wt.png' : '.png');
	};

	var cssFloat = GB.browser.msie ? img.style.styleFloat : img.style.cssFloat;
	if (cssFloat) {
		wrapcheck.checked = true;
		selectedAlign.value = cssFloat.toLowerCase();
	}
	else {
		wrapcheck.checked = false;
		var wrapper = img.parentNode;
		if ((wrapper.nodeName == 'DIV' || wrapper.nodeName == 'P') && wrapper.style.textAlign) {
			selectedAlign.value = wrapper.style.textAlign.toLowerCase();
		}
	}

	wrapspan.className = 'wrap-text-desc';
	wrapspan.style.display = (selectedAlign.value != 'center') ? '' : 'none';
	wrapspan.appendChild(wrapcheck);

	var wrapIcon = new Image();
	wrapIcon.className = 'cheditor-ico';
	wrapIcon.src = this.config.iconPath + 'image_align_' + selectedAlign.value + '_wt.png';
	wrapspan.appendChild(wrapIcon);
	div.appendChild(wrapspan);

	var submit = new Image();
	submit.src = this.config.iconPath + 'button/edit_image.gif';
	submit.className = 'input-submit';
	submit.onclick = function() { editImageSubmit(); };
	div.appendChild(submit);

	var deleteSubmit = new Image();
	deleteSubmit.src = this.config.iconPath + 'button/delete_cross.gif';
	deleteSubmit.className = 'delete-submit';
	deleteSubmit.onclick = function() {
		var wrapper = img.parentNode;
		if (wrapper.firstChild == wrapper.lastChild && wrapper.nodeName != 'BODY')
			wrapper.parentNode.removeChild(wrapper);
		else {
			wrapper.removeChild(img);
		}
		self.doEditorEvent();
	};
	div.appendChild(deleteSubmit);

	if (self.undefined(self.editImages[img.src])) {
		self.editImages[img.src] = { width: img.width, height: img.height };
	}

	var editImageSubmit = function() {
		var alt = self.trimSpace(inputAlt.value);
		if (alt != '') img.setAttribute('alt', alt);
		else img.setAttribute('alt', '');

		var setFloat = function(value) {
			var pNode = img.parentNode;
			if (GB.browser.msie) {
				img.style.styleFloat = value;
				if (pNode && pNode.id == img.id + '_caption') {
					pNode.style.styleFloat = value;
				}
			}
			else {
				img.style.cssFloat = value;
				if (pNode && pNode.id == img.id + '_caption') {
					pNode.style.cssFloat = value;
				}
			}
		};

		var setWrapper = function(value) {
			var pNode = img.parentNode;
			if (pNode.id == img.id + '_caption') {
				switch (value) {
				case 'left' :
					pNode.style.margin = '';
					break;
				case 'right' :
					pNode.style.margin = '0px 0px auto auto';
					break;
				default:
					pNode.style.margin = '0px auto';
					break;
				}
				pNode = pNode.parentNode;
			}

			if (pNode.nodeName != 'DIV' && pNode.nodeName != 'P') {
				var newNode = document.createElement('div');
				img.parentNode.insertBefore(newNode, img);
				newNode.appendChild(img);
			}

			pNode.style.textAlign = value;
			pNode.removeAttribute('align');
		};

		if (wrapcheck.checked && selectedAlign.value != 'center') {
			setWrapper('left');
			setFloat(selectedAlign.value);

			if (selectedAlign.value == 'left') {
				img.style.marginRight = '1em';
				img.style.marginLeft = '';
			}
			else if (selectedAlign.value == 'right') {
				img.style.marginLeft = '1em';
				img.style.marginRight = '';
			}
		}
		else {
			setWrapper(selectedAlign.value);
			setFloat('');
			img.style.margin = '';
		}

		var caption = self.trimSpace(fmInputCaption.value);
        var pNode, captionText;
		if (caption != '') {
			pNode = img.parentNode;
			var captionId = img.id + '_caption';
			if (pNode && pNode.id == captionId) {
				captionWrapper = pNode;
				if (GB.browser.msie && img.style.styleFloat != '') {
					captionWrapper.style.styleFloat = img.style.styleFloat;
				}
				if (!GB.browser.msie && img.style.cssFloat != '') {
					captionWrapper.style.cssFloat = img.style.cssFloat;
				}

				captionText = getCaptionText();
				captionText.innerHTML = '';
				captionText.appendChild(document.createTextNode(caption));
			}
			else {
				var captionWrapper = document.createElement('div');
				captionWrapper.style.width = img.width + 'px';
				captionWrapper.id = img.id + '_caption';
				captionWrapper.style.textAlign = 'center';
				captionWrapper.appendChild(img);

				captionText = document.createElement('div');
				captionText.setAttribute('style', self.config.imgCaptionText);
				captionText.id = img.id + '_text';
				captionText.appendChild(document.createTextNode(caption));
				captionWrapper.appendChild(captionText);
				pNode.appendChild(captionWrapper);
			}
		}
		else {
			pNode = img.parentNode;
			if (pNode.id == img.id + '_caption') {
				pNode.parentNode.appendChild(img);
				pNode.parentNode.removeChild(pNode);
			}
		}

		var width = null;
		var height = null;

		if (self.editImages[img.src] && self.editImages[img.src].width != null) {
			width = self.editImages[img.src].width;
			if (self.editImages[img.src] && self.editImages[img.src].height != null) {
				height = self.editImages[img.src].height;
			}
			else {
				height = img.height;
			}
		}
		else if (img.width) {
			width = img.width;
		}
		else {
			return;
		}

		switch (selectedWidth.value) {
		case 'default' :
			width = width + 'px';
			height = (height ? height : img.height) + 'px';
			break;
		case 'fitpage' :
			width = '100%';
			height = 'auto';
			break;
		case 'custom' :
			width = self.trimSpace(inputWidth.value);
			if (width == '') return;

			width = parseInt(inputWidth.value);
			if (isNaN(width) && img.height) {
				width = width + 'px';
				height = height + 'px';
			}
			else {
				height =  Math.round((img.height * width) / img.width) + 'px';
				width += 'px';
			}
			break;
		default:
			width = widthOptions[selectedWidth.value].size;
			if (img.height) {
				height =  Math.round((img.height * width) / img.width) + 'px';

			}
			width += 'px';
		}

		if (width) img.style.width = width;
		if (height) img.style.height = height;
		self.editAreaFocus();
		self.doEditorEvent();
	};

	div.appendChild(document.createElement('br'));
	div.appendChild(document.createTextNode('Alt:'));
	var inputAlt = document.createElement('input');
	inputAlt.setAttribute('type', 'text');
	inputAlt.setAttribute('name', 'inputAlt');
	inputAlt.setAttribute('value', '');
	inputAlt.className = 'user-input-alt';
	div.appendChild(inputAlt);

	div.appendChild(document.createTextNode('캡션:'));
	var fmInputCaption = document.createElement('input');
	fmInputCaption.setAttribute('type', 'text');
	fmInputCaption.setAttribute('name', 'inputCaption');
	fmInputCaption.setAttribute('value', '');
	fmInputCaption.className = 'user-input-caption';
    div.appendChild(fmInputCaption);

	if (img.getAttribute('alt') != '' && img.getAttribute('alt') != null)
		inputAlt.value = img.getAttribute('alt');

	var getCaptionText = function() {
		var ct = img.nextSibling;
		var found = false;
		while (ct) {
			if (ct.id == (img.id + '_text')) {
				found = true;
				break;
			}
			ct = ct.nextSibling;
		}
		return (found) ? ct : null;
	};

	var captionText = getCaptionText();
	fmInputCaption.value = captionText ? captionText.innerHTML : '';

	self.cheditor.editBlock.innerHTML = '';
	self.cheditor.editBlock.appendChild(div);
},

modifyCell : function (ctd) {
    var self = this;
    var ctb = ctd;
    var ctr = ctb;

    while (ctb != null && ctb.tagName.toLowerCase() != "table") ctb = ctb.parentNode;
    while (ctr != null && ctr.tagName.toLowerCase() != "tr") ctr = ctr.parentNode;

    var getCellMatrix = function () {
        var tm = new Array();
        var rows = (ctb.rows && ctb.rows.length > 0) ? ctb.rows : ctb.getElementsByTagName("TR");

        for (var i=0; i < rows.length; i++) {
            tm[i] = new Array();
        }

        for (var i=0; i < rows.length; i++) {
            var jr = 0;
            for (var j=0; j < rows[i].cells.length; j++) {
                while (!(self.undefined(tm[i][jr])))
                    jr++;

                for (var jh=jr; jh < jr + (rows[i].cells[j].colSpan ? rows[i].cells[j].colSpan : 1); jh++) {
                    for (var jv=i; jv < i + (rows[i].cells[j].rowSpan ? rows[i].cells[j].rowSpan : 1); jv++) {
                        tm[jv][jh] = (jv == i) ? rows[i].cells[j].cellIndex : -1;
                    }
                }
            }
        }
        return tm;
    };

    var insertColumn = function() {
        var tm = getCellMatrix();
        var rows = (ctb.rows && ctb.rows.length > 0) ? ctb.rows : ctb.getElementsByTagName("TR");
        var rowIndex = 0, realIndex = 0;

        if (ctr.rowIndex >= 0) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var i=0; i < rows.length; i++) {
                if (rows[i] == ctr) {
                    rowIndex = i;
                    break;
                }
            }
        }

        for (var j=0; j < tm[rowIndex].length; j++) {
            if (tm[rowIndex][j] == ctd.cellIndex) {
                realIndex = j;
                break;
            }
        }

        for (var i=0; i < rows.length; i++) {
            if (tm[i][realIndex] != -1) {
                if (rows[i].cells[tm[i][realIndex]].colSpan > 1) {
                    rows[i].cells[tm[i][realIndex]].colSpan++;
                }
                else {
                    var newc = rows[i].insertCell(tm[i][realIndex]+1);
                    var nc = rows[i].cells[tm[i][realIndex]].cloneNode(false);
                    nc.innerHTML = '&nbsp;';
                    rows[i].replaceChild(nc, newc);
                }
            }
        }
    };

    var insertRow = function(idx) {
        var newr = ctb.insertRow(ctr.rowIndex + 1);
        for (var i=0; i < ctr.cells.length; i++) {
            if (ctr.cells[i].rowSpan > 1) {
                ctr.cells[i].rowSpan++;
            }
            else {
                var newc = ctr.cells[i].cloneNode(false);
                newc.innerHTML = '&nbsp;';
                newr.appendChild(newc);
            }
        }

        for (var i=0; i < ctr.rowIndex; i++) {
            var tempr;
            if (ctb.rows && ctb.rows.length > 0) {
                tempr = ctb.rows[i];
            }
            else {
                tempr = ctb.getElementsByTagName("tr")[i];
            }
            for (var j=0; j < tempr.cells.length; j++) {
                if (tempr.cells[j].rowSpan > (ctr.rowIndex - i))
                    tempr.cells[j].rowSpan++;
            }
        }
    };

    var deleteColumn = function () {
        var tm = getCellMatrix(ctb);
        var rows = (ctb.rows && ctb.rows.length>0) ? ctb.rows : ctb.getElementsByTagName("TR");
        var rowIndex = 0, realIndex = 0;

        if (ctr.rowIndex >= 0) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var i=0; i < rows.length; i++) {
                if (rows[i] == ctr) {
                    rowIndex = i;
                    break;
                }
            }
        }

        if (tm[0].length <= 1) {
            ctb.parentNode.removeChild(ctb);
        }
        else {
            for (var j=0; j < tm[rowIndex].length; j++) {
                if (tm[rowIndex][j] == ctd.cellIndex) {
                    realIndex = j;
                    break;
                }
            }

            for (var i=0; i < rows.length; i++) {
                if (tm[i][realIndex] != -1) {
                    if (rows[i].cells[tm[i][realIndex]].colSpan > 1) {
                        rows[i].cells[tm[i][realIndex]].colSpan--;
                    }
                    else {
                        rows[i].deleteCell(tm[i][realIndex]);
                    }
                }
            }
        }
    };

    var deleteRow = function () {
        var tm = getCellMatrix(ctb);
        var rows = (ctb.rows && ctb.rows.length>0) ? ctb.rows : ctb.getElementsByTagName("TR");
        var rowIndex = 0;

        if (ctr.rowIndex >= 0) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var i=0; i < rows.length; i++) {
                if (rows[i] == ctr) {
                    rowIndex = i;
                    break;
                }
            }
        }

        if (rows.length <= 1) {
            ctb.parentNode.removeChild(ctb);
        }
        else {
            for (var i=0; i < rowIndex; i++) {
                var tempr = rows[i];
                for (var j=0; j < tempr.cells.length; j++) {
                    if (tempr.cells[j].rowSpan > (rowIndex - i))
                        tempr.cells[j].rowSpan--;
                }
            }

            var curCI = -1;
            for (var i=0; i < tm[rowIndex].length; i++) {
                var prevCI = curCI;
                curCI = tm[rowIndex][i];

                if (curCI != -1 && curCI != prevCI && ctr.cells[curCI].rowSpan>1 && (rowIndex+1) < rows.length) {
                    var ni = i;
                    var nrCI = tm[rowIndex+1][ni];
                    while (nrCI == -1) {
                        ni++;
                        nrCI = (ni < rows[rowIndex+1].cells.length) ? tm[rowIndex+1][ni] : rows[rowIndex+1].cells.length;
                    }

                    var newc = rows[rowIndex+1].insertCell(nrCI);
                    rows[rowIndex].cells[curCI].rowSpan--;
                    var nc = rows[rowIndex].cells[curCI].cloneNode(false);
                    rows[rowIndex+1].replaceChild(nc, newc);

                    var cs = (ctr.cells[curCI].colSpan>1) ? ctr.cells[curCI].colSpan : 1;
                    var nj = 0;

                    for (var j=i; j < (i+cs); j++) {
                        tm[rowIndex+1][j] = nrCI;
                        nj = j;
                    }
                    for (var j=nj; j < tm[rowIndex+1].length; j++) {
                        if (tm[rowIndex+1][j] != -1)
                            tm[rowIndex+1][j]++;
                    }
                }
            }

            if (ctb.rows && ctb.rows.length > 0) {
                ctb.deleteRow(rowIndex);
            }
            else {
                ctb.removeChild(rows[rowIndex]);
            }
        }
    };

    var mergeCellRight = function () {
        var tm = getCellMatrix(ctb);
        var rows = (ctb.rows && ctb.rows.length>0) ? ctb.rows : ctb.getElementsByTagName("TR");
        var rowIndex = 0, realIndex = 0;

        if (ctr.rowIndex >= 0) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var i=0; i < rows.length; i++) {
                if (rows[i] == ctr) {
                    rowIndex = i;
                    break;
                }
            }
        }

        for (var j=0; j < tm[rowIndex].length; j++) {
            if (tm[rowIndex][j] == ctd.cellIndex) {
                realIndex = j;
                break;
            }
        }

        if (ctd.cellIndex + 1 < ctr.cells.length) {
            var ccrs = ctd.rowSpan ? ctd.rowSpan : 1;
            var cccs = ctd.colSpan ? ctd.colSpan : 1;
            var ncrs = ctr.cells[ctd.cellIndex+1].rowSpan ? ctr.cells[ctd.cellIndex+1].rowSpan : 1;
            var nccs = ctr.cells[ctd.cellIndex+1].colSpan ? ctr.cells[ctd.cellIndex+1].colSpan : 1;
            var j = realIndex;

            while (tm[rowIndex][j] == ctd.cellIndex)
                j++;

            if (tm[rowIndex][j] == ctd.cellIndex + 1) {
                if (ccrs == ncrs) {
                    if (rows.length > 1) ctd.colSpan = cccs + nccs;
                    var html = self.trimSpace(ctr.cells[ctd.cellIndex + 1].innerHTML);
                    html = html.replace(/^&nbsp;/, '');
                    ctd.innerHTML += html;
                    ctr.deleteCell(ctd.cellIndex + 1);
                }
            }
        }
    };

    var mergeCellDown = function () {
        var tm = getCellMatrix(ctb);
        var rows = (ctb.rows && ctb.rows.length > 0) ? ctb.rows : ctb.getElementsByTagName("TR");
        var rowIndex = 0, crealIndex = 0;

        if (ctr.rowIndex >=0 ) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var i=0; i < rows.length; i++) {
                if (rows[i] == ctr) {
                    rowIndex = i;
                    break;
                }
            }
        }

        for (var i=0; i < tm[rowIndex].length; i++) {
            if (tm[rowIndex][i] == ctd.cellIndex) {
                crealIndex = i;
                break;
            }
        }

        var ccrs = ctd.rowSpan ? ctd.rowSpan : 1;
        var cccs = ctd.colSpan ? ctd.colSpan : 1;

        if (rowIndex + ccrs < rows.length) {
            var ncellIndex = tm[rowIndex + ccrs][crealIndex];
            if (ncellIndex != -1 &&
                (crealIndex == 0 || (crealIndex > 0 && (tm[rowIndex + ccrs][crealIndex-1] != tm[rowIndex + ccrs][crealIndex]))))
            {

                var ncrs = rows[rowIndex + ccrs].cells[ncellIndex].rowSpan ? rows[rowIndex + ccrs].cells[ncellIndex].rowSpan : 1;
                var nccs = rows[rowIndex + ccrs].cells[ncellIndex].colSpan ? rows[rowIndex + ccrs].cells[ncellIndex].colSpan : 1;

                if (cccs == nccs) {
                    var html = self.trimSpace(rows[rowIndex + ccrs].cells[ncellIndex].innerHTML);
                    html = html.replace(/^&nbsp;/, '');
                    ctd.innerHTML += html;
                    rows[rowIndex + ccrs].deleteCell(ncellIndex);
                    ctd.rowSpan = ccrs + ncrs;
                }
            }
        }
    };

    var splitCellVertical = function () {
        var tm = getCellMatrix();
        var rowIndex = 0, realIndex = 0;

        rows = (ctb.rows && ctb.rows.length > 0) ? ctb.rows : ctb.getElementsByTagName("TR");

        if (ctr.rowIndex >= 0) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var ri = 0; ri < rows.length; ri++) {
                if (rows[ri] == ctr) {
                    rowIndex = ri;
                    break;
                }
            }
        }

        for (var j=0; j < tm[rowIndex].length; j++) {
            if (tm[rowIndex][j] == ctd.cellIndex) {
                realIndex = j;
                break;
            }
        }

        if (ctd.colSpan > 1) {
            var newc = rows[rowIndex].insertCell(ctd.cellIndex + 1);
            ctd.colSpan--;
            var nc = ctd.cloneNode(false);
            nc.innerHTML = '&nbsp;';
            rows[rowIndex].replaceChild(nc, newc);
            ctd.colSpan = 1;
            ctd.removeAttribute('colSpan');
        }
        else {
            var newc = rows[rowIndex].insertCell(ctd.cellIndex + 1);
            var nc = ctd.cloneNode(false);
            nc.innerHTML = '&nbsp;';
            rows[rowIndex].replaceChild(nc, newc);

            for (var i=0; i < tm.length; i++) {
                if (i != rowIndex && tm[i][realIndex] != -1) {
                    var cs = (rows[i].cells[tm[i][realIndex]].colSpan > 1) ? rows[i].cells[tm[i][realIndex]].colSpan : 1;
                    rows[i].cells[tm[i][realIndex]].colSpan = cs + 1;
                }
            }
        }
    };

    var splitCellHorizontal = function () {
        var tm = getCellMatrix();
        var rowIndex = 0, realIndex = 0;
        var rows = (ctb.rows && ctb.rows.length > 0) ? ctb.rows : ctb.getElementsByTagName("TR");

        if (ctr.rowIndex >= 0) {
            rowIndex = ctr.rowIndex;
        }
        else {
            for(var i=0; i < rows.length; i++) {
                if (rows[i] == ctr) {
                    rowIndex = i;
                    break;
                }
            }
        }

        for (var j=0; j < tm[rowIndex].length; j++) {
            if (tm[rowIndex][j] == ctd.cellIndex) {
                realIndex = j;
                break;
            }
        }

        if (ctd.rowSpan > 1) {
            var i = realIndex;
            var ni;

            while (tm[rowIndex + 1][i] == -1) {
                i++;
            }

            ni = (i == tm[rowIndex + 1].length) ? rows[rowIndex + 1].cells.length : tm[rowIndex + 1][i];

            var newc = rows[rowIndex + 1].insertCell(ni);
            ctd.rowSpan--;

            var nc = ctd.cloneNode(false);
            nc.innerHTML = '&nbsp;';
            rows[rowIndex + 1].replaceChild(nc, newc);
            ctd.rowSpan = 1;
        }
        else {
            if (ctb.rows && ctb.rows.length > 0) {
                ctb.insertRow(rowIndex+1);
            }
            else {
                if (rowIndex<(rows.length - 1)) {
                    ctb.insertBefore(document.createElement("TR"), rows[rowIndex + 1]);
                }
                else {
                    ctb.appendChild(document.createElement("TR"));
                }
            }

            var rs;
            for (var i=0; i < ctr.cells.length; i++) {
                if (i != ctd.cellIndex) {
                    rs = ctr.cells[i].rowSpan > 1 ? ctr.cells[i].rowSpan : 1;
                    ctr.cells[i].rowSpan = rs + 1;
                }
            }

            for (var i=0; i < rowIndex; i++) {
                var tempr = rows[i];
                for (var j=0; j < tempr.cells.length; j++) {
                    if (tempr.cells[j].rowSpan > (rowIndex - i)) {
                        tempr.cells[j].rowSpan++;
                    }
                }
            }

            var newc = rows[rowIndex+1].insertCell(0);
            var nc = ctd.cloneNode(false);
            nc.innerHTML = '&nbsp;';
            rows[rowIndex+1].replaceChild(nc, newc);
        }
    };

    var tblReflash = function() { self.editAreaFocus(); self.doEditorEvent(); };
    var funcs = {
            'add_cols_after' : { 'icon' : 'table_insert_column.png', 'title' : '열 삽입',
                'func' : function() { insertColumn(ctd.cellIndex); tblReflash(); }},
            'add_rows_after': { 'icon' : 'table_insert_row.png', 'title' : '행 삽입',
                'func' : function() { insertRow(ctr.rowIndex); tblReflash(); }},
            'remove_cols': { 'icon' : 'table_delete_column.png', 'title' : '열 삭제',
                'func' : function() { deleteColumn(ctd.cellIndex); tblReflash(); }},
            'remove_rows': { 'icon' : 'table_delete_row.png', 'title' : '행 삭제',
                'func' : function() { deleteRow(); tblReflash(); }},
            'sp1' : { 'icon' : 'dot.gif' },
            'merge_cell_right': { 'icon' : 'table_join_row.png', 'title' : '오른쪽 셀과 병합',
                'func' : function() { mergeCellRight(); tblReflash(); }},
            'merge_cell_down': { 'icon' : 'table_join_column.png', 'title' : '아래 셀과 병합',
                'func' : function() { mergeCellDown(); tblReflash(); }},
            'split_cell_v': { 'icon' : 'table_split_row.png', 'title' : '셀 열로 나누기',
                'func' : function() { splitCellVertical(); tblReflash(); }},
            'split_cell_h': { 'icon' : 'table_split_column.png', 'title' : '셀 행으로 나누기',
                'func' : function() { splitCellHorizontal(); tblReflash(); }}
    };

    self.cheditor.editBlock.innerHTML = '';
    var div = document.createElement('div');
    div.style.padding = '6px';

    for (var i in funcs) {
        var span = document.createElement('span');
        var icon = document.createElement('img');
        icon.src = self.config.iconPath + funcs[i].icon;
        if (i == 'sp1' || i == 'sp2') {
            icon.className = 'edit-table-ico';
        }
        else {
            icon.setAttribute('title', funcs[i].title);
            icon.className = 'edit-table-ico';
            icon.setAttribute('alt', '');
            icon.onclick = funcs[i].func;
        }
        div.appendChild(span.appendChild(icon));
    }

    /*var deleteTable = function() {
        ctb.parentNode.removeChild(ctb);
        self.doEditorEvent();
    };*/

    var deleteSubmit = new Image();
    deleteSubmit.src = this.config.iconPath + 'delete_table.png';
    deleteSubmit.style.marginLeft = "22px";
    deleteSubmit.className = 'edit-table-ico';
    deleteSubmit.setAttribute('title', '테이블 삭제');
    deleteSubmit.onclick = function() {
        ctb.parentNode.removeChild(ctb);
        self.doEditorEvent();
    };

    div.appendChild(deleteSubmit);

    var attrFuncs = {
        'setWidth' : {
            'txt': '가로폭',
            'id' : 'fm_cell_width',
            'marginRight' : '10px',
            'value' : ctd.getAttribute('width')
        },
        'setHeight' : {
            'txt': '세로폭',
            'id' : 'fm_cell_height',
            'marginRight' : '10px',
            'value' : ctd.getAttribute('height')
        },
        'setBgcolor' : {
            'txt': '배경색',
            'id' : 'fm_cell_bgcolor',
            'marginRight' : '2px',
            'value' : ctd.getAttribute('bgcolor')
        }
    };

    var spliter = document.createElement('div');
    spliter.style.padding = '10px 0px 0px 0px';
    spliter.style.marginTop = '5px';
    spliter.style.borderTop = '1px solid #ccc';
    spliter.style.textAlign = 'center';

    for (var i in attrFuncs) {
        var txt = document.createTextNode(attrFuncs[i].txt + ' ');
        spliter.appendChild(txt);
        var input = document.createElement('input');
        input.style.marginRight = attrFuncs[i].marginRight;
        input.setAttribute('type', 'text');
        input.setAttribute('name', i);
        input.setAttribute('id', attrFuncs[i].id);
        input.setAttribute('size', 7);
        input.setAttribute('value', attrFuncs[i].value ? attrFuncs[i].value : '');
        spliter.appendChild(input);
    }

    var colorPicker = new Image();
    colorPicker.src = this.config.iconPath + 'button/color_picker.gif';
    colorPicker.className = 'color-picker';
    colorPicker.onclick = function() {
        GB.popupWindow.ColorPicker.argv = { func :
            function(color) {
                ctd.setAttribute('bgColor', color);
                self.$('fm_cell_bgcolor').value = color;
            },
            selectedCell : ctd
        };
        self.windowOpen('ColorPicker');
    };
    spliter.appendChild(colorPicker);

    var editSubmit = new Image();
    editSubmit.src = this.config.iconPath + 'button/edit_cell.gif';
    editSubmit.className = 'input-submit';
    editSubmit.style.verticalAlign = 'top';
    editSubmit.onclick = function() {
        ctd.setAttribute('width', self.$('fm_cell_width').value);
        ctd.setAttribute('height', self.$('fm_cell_height').value);
        ctd.setAttribute('bgcolor', self.$('fm_cell_bgcolor').value);
    };

    spliter.appendChild(editSubmit);
    div.appendChild(spliter);
    self.cheditor.editBlock.appendChild(div);
},

doEditorEvent : function () {
	var self = this;
	var modifyBlock = self.cheditor.editBlock;
	var oEditor = self.editArea;
	var cmd = null, el, pNode, ancestors = [];
	var rng = self.getRange();
	var nodeType = self.getSelectionType(rng);

	if (!self.W3CRange) {
		switch (nodeType) {
		case GB.selection.SELECTION_NONE :
		case GB.selection.SELECTION_TEXT :
			pNode = rng.parentElement();
			break;
		case GB.selection.SELECTION_ELEMENT :
			pNode = rng.item(0);
			break;
		default :
			pNode = oEditor.document.body;
		}
	}
	else {
		try {
			pNode = rng.commonAncestorContainer;
			if (!rng.collapsed &&
				rng.startContainer == rng.endContainer &&
				rng.startOffset - rng.endOffset < 2 &&
				rng.startContainer.hasChildNodes())
			{
				pNode = rng.startContainer.childNodes[rng.startOffset];
			}

			while (pNode.nodeType == GB.node.TEXT_NODE) {
				pNode = pNode.parentNode;
			}
		}
		catch (e) { pNode= null; }
	}

	while (pNode && (pNode.nodeType == GB.node.ELEMENT_NODE) && (pNode.tagName.toLowerCase() != 'body')) {
		ancestors.push(pNode);
		if (pNode.tagName.toLowerCase() == 'img') {
			cmd = 'img';
			break;
		}
		else if (pNode.tagName.toLowerCase() == 'td' || pNode.tagName.toLowerCase() == 'th') {
			cmd = 'cell';
			break;
		}
		pNode = pNode.parentNode;
	}

	if (!cmd) {
		modifyBlock.style.display = "none";
		modifyBlock.innerHTML = '';
	}
	else {
        if (cmd === "cell") {
            modifyBlock.style.display = "block";
            self.modifyCell(pNode);
        }
	}

	if (self.config.showTagPath) {
        var statusBar = self.cheditor.tagPath;
		statusBar.innerHTML = '';
		statusBar.appendChild(document.createTextNode('<html> <body> '));
        el = ancestors.pop();
        var alink, span, tag;

        while (el) {
            statusBar.appendChild(document.createTextNode('<'));
            tag = el.tagName.toLowerCase();

            if (nodeType === GB.selection.SELECTION_TEXT) {
                alink = document.createElement("a");
                alink.el = el;
                alink.href = "javascript:void%200";
                alink.className = 'cheditor-tag-path-elem';
                alink.title = el.style.cssText;
                alink.onclick  = function() { self.$('removeSelected').style.display = 'inline'; self.tagSelector(this.el); };
                alink.appendChild(document.createTextNode(tag));
                statusBar.appendChild(alink);
            }
            else {
                statusBar.appendChild(self.doc.createTextNode(tag));
            }

            statusBar.appendChild(document.createTextNode('> '));
            el = ancestors.pop();
        }

		var remove = document.createElement("a");
		remove.href = "javascript:void%200";
		remove.id = "removeSelected";
		remove.style.display = 'none';
		remove.className = 'cheditor-tag-path-elem';
		remove.style.color = '#cc3300';
		remove.appendChild(document.createTextNode('remove'));
		remove.onclick = function () {
            oEditor.document.execCommand("RemoveFormat", false, null);
			remove.style.display = 'none';
			oEditor.focus();
			self.doEditorEvent();
        };

		var span = document.createElement('span');
		span.style.marginTop = '2px';
		span.appendChild(remove);
		self.cheditor.tagPath.appendChild(span);
	}

	var interval = 30;
	if (GB.browser.msie && rng.text !== '' && nodeType !== GB.selection.SELECTION_ELEMENT) {
		interval = 10;
	}
	self.tempTimer = setTimeout(function() {
		self.toolbarUpdate();
		self.tempTimer = null;
	}, interval);
},

tagSelector : function (node) {
	this.editAreaFocus();
	var rng;

	if (GB.browser.msie) {
		rng = this.doc.body.createTextRange();
		if (rng) {
			rng.moveToElementText(node);
			rng.select();
		}
	}
	else {
		var sel = this.editArea.getSelection();
		if (this.undefined(sel)) {
			return;
        }
		try {
			rng = sel.getRangeAt(0);
		} catch(e) { return; }

		rng.selectNodeContents(node);
		sel.removeAllRanges();
		sel.addRange(rng);
	}
},

getBrowser : function () { return GB.browser; },

$ : function (id) { return document.getElementById(id); },
_$ : function (id) { return this.doc.getElementById(id); }
};

DragWindow = {
	    obj : null,
	    init : function (o, oRoot, minX, maxX, minY, maxY) {
            o.style.curser = 'default';
	        o.onmousedown = DragWindow.start;
	        o.onmouseover = function () { this.style.cursor = 'move'; };
	        o.hmode = true ;
	        o.vmode = true ;
	        o.root = oRoot && oRoot != null ? oRoot : o;
	        o.transId = oRoot.id + '_Trans';

	        if (o.hmode  && isNaN(parseInt(o.root.style.left  ))) o.root.style.left   = "0px";
	        if (o.vmode  && isNaN(parseInt(o.root.style.top   ))) o.root.style.top    = "0px";
	        if (!o.hmode && isNaN(parseInt(o.root.style.right ))) o.root.style.right  = "0px";
	        if (!o.vmode && isNaN(parseInt(o.root.style.bottom))) o.root.style.bottom = "0px";

	        o.minX = minX !== undefined ? minX : null;
	        o.minY = minY !== undefined ? minY : null;
	        o.maxX = maxX !== undefined ? maxX : null;
	        o.maxY = maxY !== undefined ? maxY : null;

	        o.root.onDragStart  = new Function();
	        o.root.onDragEnd    = new Function();
	        o.root.onDrag       = new Function();
	    },

	    start : function (e) {
	        var o = DragWindow.obj = this;
	        e = DragWindow.fixE(e);
	        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
	        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
	        o.root.onDragStart(x, y);

	        o.lastMouseX = e.clientX;
	        o.lastMouseY = e.clientY;

	        document.onmousemove = DragWindow.drag;
	        document.onmouseup   = DragWindow.end;

	        if (o.root.lastChild.id == o.transId) return false;

	        var dragTransBg = document.createElement('div');
	        dragTransBg.className = 'cheditor-dragWindowTransparent';

	        if (GB.browser.msie && GB.browser.ver < 10) dragTransBg.style.filter = 'alpha(opacity=0)';
	        else dragTransBg.style.opacity = 0;
	        dragTransBg.id = o.transId;
	        dragTransBg.style.width = o.root.lastChild.firstChild.style.width;
	        dragTransBg.style.height = o.root.lastChild.firstChild.style.height;
	        o.root.appendChild(dragTransBg);

	        return false;
	    },

	    drag : function (e) {
	        e = DragWindow.fixE(e);
	        var o = DragWindow.obj;
	        var ey = e.clientY;
	        var ex = e.clientX;
	        var y = parseInt(o.vmode ? o.root.style.top  : o.root.style.bottom);
	        var x = parseInt(o.hmode ? o.root.style.left : o.root.style.right );
	        var nx, ny;

	        nx = x + ((ex - o.lastMouseX) * (o.hmode ? 1 : -1));
	        ny = y + ((ey - o.lastMouseY) * (o.vmode ? 1 : -1));

	        DragWindow.obj.root.style.left = nx + "px";
	        DragWindow.obj.root.style.top = ny + "px";
	        DragWindow.obj.lastMouseX  = ex;
	        DragWindow.obj.lastMouseY  = ey;
	        DragWindow.obj.root.onDrag(nx, ny);

	        return false;
	    },

	    end : function () {
	        document.onmousemove = null;
	        document.onmouseup   = null;
	        DragWindow.obj.root.onDragEnd(parseInt(DragWindow.obj.root.style[DragWindow.obj.hmode ? "left" : "right"]),
	                parseInt(DragWindow.obj.root.style[DragWindow.obj.vmode ? "top" : "bottom"]));

	        if (DragWindow.obj.root.lastChild.id == DragWindow.obj.transId) {
	            DragWindow.obj.root.removeChild(DragWindow.obj.root.lastChild);
            }
	        DragWindow.obj = null;
	    },

	    fixE : function (e) {
	        if (e === undefined) e = window.event;
	        if (e.layerX === undefined) e.layerX = e.offsetX;
	        if (e.layerY === undefined) e.layerY = e.offsetY;
	        return e;
	    }
};

// --------------------------------------------------------------------------
// TODO: W3C DOM Range
//

// --------------------------------------------------------------------------
// TODO: Table
//

// --------------------------------------------------------------------------
// TODO: Prettify
//
prettify = new function() {
    var LANGUAGES = {};
    var selected_languages = {};
    var doc = null, paste = null;

    function escape(value) { return value.replace(/&/gm, '&amp;').replace(/</gm, '&lt;').replace(/>/gm, '&gt;'); }

    function contains(array, item) {
        var i;
        if (!array) { return false; }
        for (i = 0; i < array.length; i++) {
            if (array[i] == item) {
                return true;
            }
        }
        return false;
    }

    function blockText(block, ignoreNewLines) {
        var result = '', i, chunk;
        for (i = 0; i < block.childNodes.length; i++) {
            if (block.childNodes[i].nodeType == 3) {
                chunk = block.childNodes[i].nodeValue;
                if (ignoreNewLines) {
                    chunk = chunk.replace(/\n/g, '');
                }
                result += chunk;
            }
            else if (block.childNodes[i].nodeName == 'BR') {
                result += '\n';
            }
            else {
                result += blockText(block.childNodes[i]);
            }
        }

        result = result.replace(/\r/g, '\n');
        return result;
    }

    function blockLanguage(block) {
        var classes = block.className.split(/\s+/), i, class_;
        classes = classes.concat(block.parentNode.className.split(/\s+/));
        for (i = 0; i < classes.length; i++) {
            class_ = classes[i].replace(/^language-/, '');
            if (LANGUAGES[class_] || class_ == 'no-prettify') {
                return class_;
            }
        }
    }

    function nodeStream(node) {
        var result = [];
        (function (node, offset) {
            var i;
            for (i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].nodeType == 3) {
                    offset += node.childNodes[i].nodeValue.length;
                }
                else if (node.childNodes[i].nodeName == 'BR') {
                    offset += 1;
                }
                else {
                    result.push({
                        event: 'start',
                        offset: offset,
                        node: node.childNodes[i]
                    });
                    offset = arguments.callee(node.childNodes[i], offset);
                    result.push({
                    event: 'stop',
                    offset: offset,
                    node: node.childNodes[i]
                    });
                }
            }
            return offset;
        })(node, 0);
        return result;
    }

    function mergeStreams(stream1, stream2, value) {
        var processed = 0;
        var result = '';
        var nodeStack = [];
        var i, current;

        function selectStream() {
            if (stream1.length && stream2.length) {
                if (stream1[0].offset != stream2[0].offset) {
                    return (stream1[0].offset < stream2[0].offset) ? stream1 : stream2;
                }
                else {
                    return (stream1[0].event == 'start' && stream2[0].event == 'stop') ? stream2 : stream1;
                }
            }
            else {
                return stream1.length ? stream1 : stream2;
            }
        }

        function open(node) {
            var result = '<' + node.nodeName.toLowerCase(), attribute;
            for (i = 0; i < node.attributes.length; i++) {
                attribute = node.attributes[i];
                result += ' ' + attribute.nodeName.toLowerCase();
                if (attribute.nodeValue != undefined) {
                    result += '="' + escape(attribute.nodeValue) + '"';
                }
            }
            return result + '>';
        }

        function close(node) { return '</' + node.nodeName.toLowerCase() + '>'; }

        while (stream1.length || stream2.length) {
            current = selectStream().splice(0, 1)[0];
            result += escape(value.substr(processed, current.offset - processed));
            processed = current.offset;
            if ( current.event == 'start') {
                result += open(current.node);
                nodeStack.push(current.node);
            }
            else if (current.event == 'stop') {
                i = nodeStack.length;
                do {
                    i--;
                    var node = nodeStack[i];
                    result += close(node);
                } while (node != current.node);

                nodeStack.splice(i, 1);
                while (i < nodeStack.length) {
                    result += open(nodeStack[i]);
                    i++;
                }
            }
        }

        result += value.substr(processed);
        return result;
    }

    function highlight(language_name, value) {
        var language = LANGUAGES[language_name];
        var modes = [language.defaultMode];
        var relevance = 0;
        var keyword_count = 0;
        var result = '';

        function subMode(lexem, mode) {
            var i;
            for (i = 0; i < mode.sub_modes.length; i++) {
                if (mode.sub_modes[i].beginRe.test(lexem)) {
                    return mode.sub_modes[i];
                }
            }
            return null;
        }

        function endOfMode(mode_index, lexem) {
            if (modes[mode_index].end && modes[mode_index].endRe.test(lexem)) {
                return 1;
            }
            if (modes[mode_index].endsWithParent) {
                var level = endOfMode(mode_index - 1, lexem);
                return level ? level + 1 : 0;
            }
            return 0;
        }

        function isIllegal(lexem, mode) {
            return mode.illegalRe && mode.illegalRe.test(lexem);
        }

        function compileTerminators(mode, language) {
            var terminators = [], i;

            for (i = 0; i < mode.sub_modes.length; i++) {
                terminators.push(mode.sub_modes[i].begin);
            }

            var index = modes.length - 1;
            do {
                if (modes[index].end) {
                    terminators.push(modes[index].end);
                }
                index--;
            } while (modes[index + 1].endsWithParent);

            if (mode.illegal) {
                terminators.push(mode.illegal);
            }

            return langRe(language, '(' + terminators.join('|') + ')', true);
        }

        function eatModeChunk(value, index) {
            var mode = modes[modes.length - 1];
            if (!mode.terminators) {
                mode.terminators = compileTerminators(mode, language);
            }
            mode.terminators.lastIndex = index;
            var match = mode.terminators.exec(value);
            if (match) {
                return [value.substr(index, match.index - index), match[0], false];
            }
            else {
                return [value.substr(index), '', true];
            }
        }

        function keywordMatch(mode, match) {
            var match_str = language.case_insensitive ? match[0].toLowerCase() : match[0];
            var className, value;
            for (className in mode.keywordGroups) {
                if (!mode.keywordGroups.hasOwnProperty(className)) {
                    continue;
                }
                value = mode.keywordGroups[className].hasOwnProperty(match_str);
                if (value) {
                    return [className, value];
                }
            }
            return false;
        }

        function processKeywords(buffer, mode) {
            if (!mode.keywords || !mode.lexems) {
                return escape(buffer);
            }
            if (!mode.lexemsRe) {
                var lexems_re = '(' + mode.lexems.join('|') + ')';
                mode.lexemsRe = langRe(language, lexems_re, true);
            }

            var result = '';
            var last_index = 0, match, keyword_match;
            mode.lexemsRe.lastIndex = 0;
            match = mode.lexemsRe.exec(buffer);
            while (match) {
                result += escape(buffer.substr(last_index, match.index - last_index));
                keyword_match = keywordMatch(mode, match);
                if (keyword_match) {
                    keyword_count += keyword_match[1];
                    result += '<span class="'+ keyword_match[0] +'">' + escape(match[0]) + '</span>';
                }
                else {
                    result += escape(match[0]);
                }
                last_index = mode.lexemsRe.lastIndex;
                match = mode.lexemsRe.exec(buffer);
            }
            result += escape(buffer.substr(last_index, buffer.length - last_index));
            return result;
        }

        function processBuffer(buffer, mode) {
            if (mode.subLanguage && selected_languages[mode.subLanguage]) {
                var result = highlight(mode.subLanguage, buffer);
                keyword_count += result.keyword_count;
                relevance += result.relevance;
                return result.value;
            }
            else {
                return processKeywords(buffer, mode);
            }
        }

        function startNewMode(mode, lexem) {
            var markup = mode.noMarkup ? '' : '<span class="' + mode.displayClassName + '">';
            if (mode.returnBegin) {
                result += markup;
                mode.buffer = '';
            }
            else if (mode.excludeBegin) {
                result += escape(lexem) + markup;
                mode.buffer = '';
            }
            else {
                result += markup;
                mode.buffer = lexem;
            }
            modes[modes.length] = mode;
        }

        function processModeInfo(buffer, lexem, end) {
            var current_mode = modes[modes.length - 1];
            if (end) {
                result += processBuffer(current_mode.buffer + buffer, current_mode);
                return false;
            }

            var new_mode = subMode(lexem, current_mode);
            if (new_mode) {
                result += processBuffer(current_mode.buffer + buffer, current_mode);
                startNewMode(new_mode, lexem);
                relevance += new_mode.relevance;
                return new_mode.returnBegin;
            }

            var end_level = endOfMode(modes.length - 1, lexem);
            if (end_level) {
                var markup = current_mode.noMarkup?'':'</span>';
                if (current_mode.returnEnd) {
                    result += processBuffer(current_mode.buffer + buffer, current_mode) + markup;
                }
                else if (current_mode.excludeEnd) {
                    result += processBuffer(current_mode.buffer + buffer, current_mode) + markup + escape(lexem);
                }
                else {
                    result += processBuffer(current_mode.buffer + buffer + lexem, current_mode) + markup;
                }

                while (end_level > 1) {
                    markup = modes[modes.length - 2].noMarkup?'':'</span>';
                    result += markup;
                    end_level--;
                    modes.length--;
                }

                var last_ended_mode = modes[modes.length - 1], i;
                modes.length--;
                modes[modes.length - 1].buffer = '';
                if (last_ended_mode.starts) {
                    for (i = 0; i < language.modes.length; i++) {
                        if (language.modes[i].className == last_ended_mode.starts) {
                            startNewMode(language.modes[i], '');
                            break;
                        }
                    }
                }
                return current_mode.returnEnd;
            }


            if (isIllegal(lexem, current_mode)) {
                throw 'Illegal';
            }
        }

        try {
            var index = 0, mode_info, return_lexem;
            language.defaultMode.buffer = '';
            do {
                mode_info = eatModeChunk(value, index);
                return_lexem = processModeInfo(mode_info[0], mode_info[1], mode_info[2]);
                index += mode_info[0].length;
                if (!return_lexem) {
                    index += mode_info[1].length;
                }
            } while (!mode_info[2]);

            if(modes.length > 1) {
                throw 'Illegal';
            }

            return {
                language: language_name,
                relevance: relevance,
                keyword_count: keyword_count,
                value: result };
        } catch (e) {
            if (e == 'Illegal') {
                return {
                    language: null,
                    relevance: 0,
                    keyword_count: 0,
                    value: escape(value) };
            }
            else {
                throw e;
            }
        }
    }

    function compileModes() {
        var modes, lang, len;

        function compileMode(mode, language) {
            if (mode.compiled) { return; }
            if (mode.begin) { mode.beginRe = langRe(language, '^' + mode.begin); }
            if (mode.end) { mode.endRe = langRe(language, '^' + mode.end); }
            if (mode.illegal) { mode.illegalRe = langRe(language, '^(?:' + mode.illegal + ')'); }
            if (mode.relevance == undefined) { mode.relevance = 1; }
            if (!mode.displayClassName) { mode.displayClassName = mode.className; }
            if (!mode.className) { mode.noMarkup = true; }

            var key, i, j;
            for (key in mode.keywords) {
                if (!mode.keywords.hasOwnProperty(key)) {
                    continue;
                }
                if (mode.keywords[key] instanceof Object) {
                    mode.keywordGroups = mode.keywords;
                }
                else {
                    mode.keywordGroups = {'keyword': mode.keywords};
                }
                break;
            }

            mode.sub_modes = [];
            if (mode.contains) {
                for (i = 0; i < mode.contains.length; i++) {
                    if (mode.contains[i] instanceof Object) {
                        mode.sub_modes.push(mode.contains[i]);
                    }
                    else {
                        for (j = 0; j < language.modes.length; j++) {
                            if (language.modes[j].className == mode.contains[i]) {
                                mode.sub_modes.push(language.modes[j]);
                            }
                        }
                    }
                }
            }
            mode.compiled = true;
            for (i = 0; i < mode.sub_modes.length; i++) {
                compileMode(mode.sub_modes[i], language);
            }
        }

        for (lang in LANGUAGES) {
            if (!LANGUAGES.hasOwnProperty(lang)) {
                continue;
            }
            modes = [LANGUAGES[lang].defaultMode].concat(LANGUAGES[lang].modes);
            for (len = 0; len < modes.length; len++) {
                compileMode(modes[len], LANGUAGES[lang]);
            }
        }
    }

    function initialize() {
        if (initialize.called) { return; }
        initialize.called = true;
        compileModes();
    }

    function highlightBlock(block, tabReplace, useBR) {
        initialize();
        var text = blockText(block, false);

        var language = blockLanguage(block);

        if (language == 'no-prettify') { return; }
        if (language) {
            var result = highlight(language, text);
        }
        else {
            var result = {language: '', keyword_count: 0, relevance: 0, value: escape(text)};
            var second_best = result, key, current;
            for (key in selected_languages) {
                if (!selected_languages.hasOwnProperty(key)) {
                    continue;
                }
                current = highlight(key, text);
                if (current.keyword_count + current.relevance > second_best.keyword_count + second_best.relevance) {
                    second_best = current;
                }
                if (current.keyword_count + current.relevance > result.keyword_count + result.relevance) {
                    second_best = result;
                    result = current;
                }
            }
        }

        var class_name = block.className;
        if (!class_name.match(result.language)) {
            class_name = class_name ? (class_name + ' ' + result.language) : result.language;
        }
        var original = nodeStream(block);
        if (original.length) {
            var pre = doc.createElement('code');
            pre.innerHTML = result.value;
            result.value = mergeStreams(original, nodeStream(pre), text);
        }

        result.value = result.value.replace(/__CHEDITOR_TAB_SPACE__/g, '&nbsp;&nbsp;&nbsp;&nbsp;'); // IE < 9

        if (tabReplace) {
            result.value = result.value.replace(/^((<[^>]+>|\t)+)/gm, function(match, p1, offset, s) {
            return p1.replace(/\t/g, tabReplace); });
        }
        else {
            result.value = result.value.replace(/\t/g, "<span class='cheditor-prettify-space' style='white-space: pre-wrap'>\t</span>");
        }

        if (useBR) {
            result.value = result.value.replace(/\n/g, "<br>\n");
        }

        block.className = class_name;
        block.dataset = {};
        block.dataset.result = {
            language: result.language,
            kw: result.keyword_count,
            re: result.relevance
        };

        if (result) {
            className = block.className;
            if (!className.match(language)) {
                className += ' ' + language;
            }
            result.value = result.value.replace(/^(\s{2,})/gm, "<span class='cheditor-prettify-space' style='white-space: pre-wrap'>$1</span>");

            if (paste) {
                var wrapper = doc.getElementById("clipboardData");
                var code = doc.createElement("code");
                code.className = className;
                code.innerHTML = result.value;
                wrapper.parentNode.replaceChild(code, wrapper);
            }
            else {
                doc.body.innerHTML = '<code class="' + className + '">' + result.value + '</code>';
            }
        }
    }

    function langRe(language, value, global) {
        var mode =  'm' + (language.case_insensitive ? 'i' : '') + (global ? 'g' : '');
        return new RegExp(value, mode);
    }


    function compileKeywords() {
        var i, language, key;
        function compileModeKeywords(mode) {
            if (!mode.keywordGroups) {
                for (key in mode.keywords) {
                    if (mode.keywords.hasOwnProperty(key)) {
                        if (mode.keywords[key] instanceof Object) {
                            mode.keywordGroups = mode.keywords;
                        }
                        else {
                            mode.keywordGroups = {'keyword': mode.keywords};
                        }
                        break;
                    }
                }
            }
        }

        for (i in LANGUAGES) {
            if (LANGUAGES.hasOwnProperty(i)) {
                language = LANGUAGES[i];
                compileModeKeywords(language.defaultMode);
                for (key in language.modes) {
                    if (language.modes.hasOwnProperty(key)) {
                        compileModeKeywords(language.modes[key]);
                    }
                }
            }
        }
    }

    function initHighlighting(lang) {
        initialize();
        var i, text;
        for (i=0; i<lang.length; i++) {
            if (LANGUAGES[lang[i]]) {
                selected_languages[lang[i]] = lang[i];
            }
        }

        text = paste ? doc.getElementById("clipboardData") : doc.body;
        highlightBlock(text, '    ', true);
    }

    function initHighlightingOnLoad(lang, editor, clip) {
        doc = editor.doc;
        paste = clip;
        initHighlighting(lang);
    }

    this.LANGUAGES = LANGUAGES;
    this.initHighlightingOnLoad = initHighlightingOnLoad;
    this.IMMEDIATE_RE = '\\b|\\B';
    this.IDENT_RE = '[a-zA-Z][a-zA-Z0-9_]*';
    this.UNDERSCORE_IDENT_RE = '[a-zA-Z_][a-zA-Z0-9_]*';
    this.NUMBER_RE = '\\b\\d+(\\.\\d+)?';
    this.C_NUMBER_RE = '(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)';
    this.RE_STARTERS_RE = '!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~';
    this.APOS_STRING_MODE = { className: 'string', begin: '\'', end: '\'', illegal: '\\n', contains: ['escape'], relevance: 0 };
    this.QUOTE_STRING_MODE = { className: 'string', begin: '"', end: '"', illegal: '\\n', contains: ['escape'], relevance: 0 };
    this.BACKSLASH_ESCAPE = { className: 'escape', begin: '\\\\.', end: this.IMMEDIATE_RE, noMarkup: true, relevance: 0 };
    this.C_LINE_COMMENT_MODE = { className: 'comment', begin: '//', end: '$', relevance: 0 };
    this.C_BLOCK_COMMENT_MODE = { className: 'comment', begin: '/\\*', end: '\\*/' };
    this.HASH_COMMENT_MODE = { className: 'comment', begin: '#', end: '$' };
    this.NUMBER_MODE = { className: 'number', begin: this.NUMBER_RE, end: this.IMMEDIATE_RE, relevance: 0 };
    this.C_NUMBER_MODE = { className: 'number', begin: this.C_NUMBER_RE, end: this.IMMEDIATE_RE, relevance: 0 };

    this.inherit = function(parent, obj) {
        var result = {}, key;
        for (key in parent) {
             if (parent.hasOwnProperty(key)) {
                result[key] = parent[key];
             }
        }
        if (obj) {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    };

    var XML_IDENT_RE = '[A-Za-z0-9\\._:-]+';
    var PI = { className: 'pi', begin: '<\\?', end: '\\?>', relevance: 10 };
    var DOCTYPE = { className: 'doctype', begin: '<!DOCTYPE', end: '>', relevance: 10 };
    var COMMENT = { className: 'comment', begin: '<!--', end: '-->' };
    var TAG = { className: 'tag', begin: '</?', end: '/?>', contains: ['title', 'tag_internal'] };
    var TITLE = { className: 'title', begin: XML_IDENT_RE, end: this.IMMEDIATE_RE };
    var TAG_INTERNAL = { className: 'tag_internal', begin: this.IMMEDIATE_RE, endsWithParent: true, noMarkup: true, contains: ['attribute', 'value_container'], relevance: 0 };
    var ATTR = { className: 'attribute', begin: XML_IDENT_RE, end: this.IMMEDIATE_RE, relevance: 0 };
    var VALUE_CONTAINER_QUOT = { className: 'value_container', begin: '="', returnBegin: true, end: '"', noMarkup: true,
        contains: [{ className: 'value', begin: '"', endsWithParent: true}] };
    var VALUE_CONTAINER_APOS = {className: 'value_container', begin: '=\'', returnBegin: true, end: '\'', noMarkup: true,
        contains: [{className: 'value', begin: '\'', endsWithParent: true}] };

    this.LANGUAGES.xml = { defaultMode: { contains: ['pi', 'doctype', 'comment', 'cdata', 'tag'] },
        case_insensitive: true, modes: [ { className: 'cdata', begin: '<\\!\\[CDATA\\[', end: '\\]\\]>', relevance: 10 },
      PI, DOCTYPE, COMMENT, TAG, this.inherit(TITLE, {relevance: 1.75}), TAG_INTERNAL, ATTR, VALUE_CONTAINER_QUOT, VALUE_CONTAINER_APOS ] };

    var HTML_TAGS = { 'code': 1, 'kbd': 1, 'font': 1, 'noscript': 1, 'style': 1, 'img': 1, 'title': 1, 'menu': 1, 'tt': 1, 'tr': 1, 'param': 1, 'li': 1, 'tfoot': 1,
    'th': 1, 'input': 1, 'td': 1, 'dl': 1, 'blockquote': 1, 'fieldset': 1, 'big': 1, 'dd': 1, 'abbr': 1, 'optgroup': 1, 'dt': 1, 'button': 1,
    'isindex': 1, 'p': 1, 'small': 1, 'div': 1, 'dir': 1, 'em': 1, 'frame': 1, 'meta': 1, 'sub': 1, 'bdo': 1, 'label': 1, 'acronym': 1, 'sup': 1, 'body': 1,
    'basefont': 1, 'base': 1, 'br': 1, 'address': 1, 'strong': 1, 'legend': 1, 'ol': 1, 'script': 1, 'caption': 1, 's': 1, 'col': 1, 'h2': 1, 'h3': 1,
    'h1': 1, 'h6': 1, 'h4': 1, 'h5': 1, 'table': 1, 'select': 1, 'noframes': 1, 'span': 1, 'area': 1, 'dfn': 1, 'strike': 1, 'cite': 1, 'thead': 1,
    'head': 1, 'option': 1, 'form': 1, 'hr': 1, 'var': 1, 'link': 1, 'b': 1, 'colgroup': 1, 'ul': 1, 'applet': 1, 'del': 1, 'iframe': 1, 'pre': 1,
    'frameset': 1, 'ins': 1, 'tbody': 1, 'html': 1, 'samp': 1, 'map': 1, 'object': 1, 'a': 1, 'xmlns': 1, 'center': 1, 'textarea': 1, 'i': 1, 'q': 1,
    'u': 1, 'section': 1, 'nav': 1, 'article': 1, 'aside': 1, 'hgroup': 1, 'header': 1, 'footer': 1, 'figure': 1, 'figurecaption': 1, 'time': 1,
    'mark': 1, 'wbr': 1, 'embed': 1, 'video': 1, 'audio': 1, 'source': 1, 'canvas': 1, 'datalist': 1, 'keygen': 1, 'output': 1, 'progress': 1,
    'meter': 1, 'details': 1, 'summary': 1, 'command': 1 };

    this.LANGUAGES.html = { defaultMode: { contains: ['comment', 'pi', 'doctype', 'vbscript', 'tag'] },
        case_insensitive: true,
        modes: [
        { className: 'tag', begin: '<style', end: '>', lexems: [this.IDENT_RE],  keywords: {'style': 1}, contains: ['tag_internal'], starts: 'css' },
        { className: 'tag', begin: '<script', end: '>', lexems: [this.IDENT_RE],  keywords: {'script': 1}, contains: ['tag_internal'], starts: 'javascript' },
        { className: 'css', end: '</style>', returnEnd: true, subLanguage: 'css' },
        { className: 'javascript', end: '</script>', returnEnd: true, subLanguage: 'javascript' },
        { className: 'vbscript', begin: '<%', end: '%>', subLanguage: 'vbscript' },
        COMMENT, PI, DOCTYPE, this.inherit(TAG), this.inherit(TITLE, { lexems: [this.IDENT_RE], keywords: HTML_TAGS }),
        this.inherit(TAG_INTERNAL), ATTR, VALUE_CONTAINER_QUOT, VALUE_CONTAINER_APOS,
        { className: 'value_container', begin: '=', end: this.IMMEDIATE_RE,
            contains: [{className: 'unquoted_value', displayClassName: 'value', begin: '[^\\s/>]+', end: this.IMMEDIATE_RE }] }] };

    this.LANGUAGES.javascript = { defaultMode: { lexems: [this.UNDERSCORE_IDENT_RE], contains: ['string', 'comment', 'number', 'regexp_container', 'function'],
        keywords: { 'keyword': {'in': 1, 'if': 1, 'for': 1, 'while': 1, 'finally': 1, 'var': 1, 'new': 1, 'function': 1, 'do': 1, 'return': 1, 'void': 1,
                'else': 1, 'break': 1, 'catch': 1, 'instanceof': 1, 'with': 1, 'throw': 1, 'case': 1, 'default': 1, 'try': 1, 'this': 1, 'switch': 1,
                'continue': 1, 'typeof': 1, 'delete': 1}, 'literal': {'true': 1, 'false': 1, 'null': 1} }},
        modes: [ this.C_LINE_COMMENT_MODE, this.C_BLOCK_COMMENT_MODE, this.C_NUMBER_MODE, this.APOS_STRING_MODE, this.QUOTE_STRING_MODE, this.BACKSLASH_ESCAPE,
        { className: 'regexp_container', begin: '(' + this.RE_STARTERS_RE + '|case|return|throw)\\s*', end: this.IMMEDIATE_RE, noMarkup: true,
            lexems: [this.IDENT_RE], keywords: {'return': 1, 'throw': 1, 'case': 1},
            contains: [ 'comment', { className: 'regexp', begin: '/.*?[^\\\\/]/[gim]*', end: this.IMMEDIATE_RE } ], relevance: 0 },
        { className: 'function', begin: '\\bfunction\\b', end: '{', lexems: [this.UNDERSCORE_IDENT_RE], keywords: {'function': 1},
            contains: [{ className: 'title', begin: '[A-Za-z$_][0-9A-Za-z$_]*', end: this.IMMEDIATE_RE },
            { className: 'params', begin: '\\(', end: '\\)', contains: ['string', 'comment'] }] }]
    };

    this.LANGUAGES.css = { defaultMode: { contains: ['at_rule', 'id', 'class', 'attr_selector', 'pseudo', 'rules', 'comment'], keywords: this.HTML_TAGS,
    lexems: [this.IDENT_RE], illegal: '=' }, case_insensitive: true,
    modes: [
    { className: 'at_rule', begin: '@', end: '[{;]', excludeEnd: true, lexems: [this.IDENT_RE], keywords: {'import': 1, 'page': 1, 'media': 1, 'charset': 1, 'font-face': 1},
      contains: ['function', 'string', 'number', 'pseudo'] },
    { className: 'id', begin: '\\#[A-Za-z0-9_-]+', end: this.IMMEDIATE_RE },
    { className: 'class', begin: '\\.[A-Za-z0-9_-]+', end: this.IMMEDIATE_RE, relevance: 0 },
    { className: 'attr_selector', begin: '\\[', end: '\\]', illegal: '$' },
    { className: 'pseudo', begin: ':(:)?[a-zA-Z0-9\\_\\-\\+\\(\\)\\"\\\']+', end: this.IMMEDIATE_RE },
    { className: 'rules', begin: '{', end: '}',
        contains: [{className: 'rule', begin: '[A-Z\\_\\.\\-]+\\s*:', end: ';', endsWithParent: true, lexems: ['[A-Za-z-]+'],
        keywords: {'play-during': 1, 'counter-reset': 1, 'counter-increment': 1, 'min-height': 1, 'quotes': 1, 'border-top': 1, 'pitch': 1, 'font': 1,
              'pause': 1, 'list-style-image': 1, 'border-width': 1, 'cue': 1, 'outline-width': 1, 'border-left': 1, 'elevation': 1, 'richness': 1,
              'speech-rate': 1, 'border-bottom': 1, 'border-spacing': 1, 'background': 1, 'list-style-type': 1, 'text-align': 1, 'page-break-inside': 1,
              'orphans': 1, 'page-break-before': 1, 'text-transform': 1, 'line-height': 1, 'padding-left': 1, 'font-size': 1, 'right': 1, 'word-spacing': 1,
              'padding-top': 1, 'outline-style': 1, 'bottom': 1, 'content': 1, 'border-right-style': 1, 'padding-right': 1, 'border-left-style': 1,
              'voice-family': 1, 'background-color': 1, 'border-bottom-color': 1, 'outline-color': 1, 'unicode-bidi': 1, 'max-width': 1, 'font-family': 1,
              'caption-side': 1, 'border-right-width': 1, 'pause-before': 1, 'border-top-style': 1, 'color': 1, 'border-collapse': 1, 'border-bottom-width': 1,
              'float': 1, 'height': 1, 'max-height': 1, 'margin-right': 1, 'border-top-width': 1, 'speak': 1, 'speak-header': 1, 'top': 1, 'cue-before': 1,
              'min-width': 1, 'width': 1, 'font-variant': 1, 'border-top-color': 1, 'background-position': 1, 'empty-cells': 1, 'direction': 1, 'border-right': 1,
              'visibility': 1, 'padding': 1, 'border-style': 1, 'background-attachment': 1, 'overflow': 1, 'border-bottom-style': 1, 'cursor': 1, 'margin': 1,
              'display': 1, 'border-left-width': 1, 'letter-spacing': 1, 'vertical-align': 1, 'clip': 1, 'border-color': 1, 'list-style': 1, 'padding-bottom': 1,
              'pause-after': 1, 'speak-numeral': 1, 'margin-left': 1, 'widows': 1, 'border': 1, 'font-style': 1, 'border-left-color': 1, 'pitch-range': 1,
              'background-repeat': 1, 'table-layout': 1, 'margin-bottom': 1, 'speak-punctuation': 1, 'font-weight': 1, 'border-right-color': 1, 'page-break-after': 1,
              'position': 1, 'white-space': 1, 'text-indent': 1, 'background-image': 1, 'volume': 1, 'stress': 1, 'outline': 1, 'clear': 1, 'z-index': 1,
              'text-decoration': 1, 'margin-top': 1, 'azimuth': 1, 'cue-after': 1, 'left': 1, 'list-style-position': 1},
          contains: [{ className: 'value', begin: this.IMMEDIATE_RE, endsWithParent: true, excludeEnd: true, contains: ['function', 'number', 'hexcolor', 'string', 'important', 'comment'] }]
        }, 'comment'],
        illegal: '[^\\s]' },
    this.C_BLOCK_COMMENT_MODE, { className: 'number', begin: this.NUMBER_RE, end: this.IMMEDIATE_RE },
    { className: 'hexcolor', begin: '\\#[0-9A-F]+', end: this.IMMEDIATE_RE },
    { className: 'function', begin: this.IDENT_RE + '\\(', end: '\\)',
        contains: [
        { className: 'params', begin: this.IMMEDIATE_RE, endsWithParent: true, excludeEnd: true, contains: ['number', 'string'] }]},
        { className: 'important', begin: '!important', end: this.IMMEDIATE_RE }, this.APOS_STRING_MODE, this.QUOTE_STRING_MODE, this.BACKSLASH_ESCAPE ]};
}();