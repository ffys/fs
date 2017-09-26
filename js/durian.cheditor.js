	try{
	if('undefined' != typeof __SUB_SITE_LANG_TYPE__){
		load_i18n("durian.cheditor", __SUB_SITE_LANG_TYPE__);
	}else{
		load_i18n("durian.cheditor", 'ko');
	}
	
}catch(e){}

	
	
	
	if (typeof Durian == 'undefined') {
		var Durian = {};
	}

	Durian.CHEditor = Class({
		init : function(option) {

			Class.extend(this, {
				//prefix : 'cheditor',
				item : null,
				//editorPath : '/common/js/cheditor/',
				//area : null, // used if item is 'ALL'
				//css : '/common/css/mall_editor.css',
				//action : '/',
				//act : 'common.upload',
				//uploadName : 'file',
				//postName : '__file',
				//width : '',
				//height : ''
				dummy : ''
			}, option || {});
			
			//var url = location.href.split('?')[0];
			//this.domain = url.match(/^([^:]+:\/\/[^\/]+)/)[0];
			//this.css = this.domain + this.css;

			option.editorPath = '/common/js/cheditor/';

			// modify cheditor GB values
			GB.popupWindow.Link.width = 400;

			if (this.item) {
				if (this.item == 'ALL') {
					this.area = $id(this.area) || document;
					this.item = $a(this.area.getElementsByTagName('textarea'));
				}
				this.applyEditor(this.item, option);
			}
		},
		applyEditor : function(item, option) {
			if (!(item instanceof Array)) {
				item = [item];
			}
			for (var i=0; i<item.length; i++) {
				var obj = $id(item[i]);
				if (!obj || !obj.form) {
					// error : invalid item
					continue;
				}

				var editor = new cheditor();
				obj.editor = editor;

				if (typeof obj.id == 'undefined' || !obj.id) {
					obj.id = '_editor_' + i + '_textarea';
				}
				editor.inputForm = obj.id;


				var size = Element.getSize(obj);

				Class.extend(editor.config, {
					editorWidth     : size.width + 'px',
					editorHeight    : size.height + 'px',
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
					imgMaxWidth     : 725,// 2014-11-13. 640에서 725로 조정.
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
					docTitle		: i18n('lang.durian.cheditor.my_document:내 문서'),
					template        : 'template.whois.xml',

					// 버튼 사용 유무
					useSource       : true,
					usePreview      : true,
					usePrint        : false,
					useNewDocument  : false,
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
					useRemoveFormat : false,
					useClearTag     : false,
					useSymbol       : true,
					useLink         : true,
					useUnLink       : true,
					useFlash        : false,
					useMedia        : false,
					useImage        : true,
					useImageUrl     : true,
					useSmileyIcon   : true,
					useHR           : true,
					useTable        : true,
					useModifyTable  : true,
					useMap          : true,
					useTextBlock    : true,
					useFullScreen   : false,
					usePageBreak    : false,
					allowedScript   : true,
					allowedOnEvent  : false
				}, option || {});

				if (Element.classExists(obj, 'design')) {
					editor.config.linkTarget = '';
				}

				editor.templateFile = 'template.whois.xml';
				editor.templatePath = editor.config.editorPath + editor.templateFile;

				editor.run();
				editor.setEditorCallback();
				
				// ie rendering bug fix
				if (Util.isIE) {
					editor.cheditor.toolbarWrapper.style.display = 'none';
					var refresh = editor.toolbarRefresh.bind(editor);
					setTimeout(refresh, 10);
				}
			}
		}
	});


	///////////////////////////////////////////////////////////////////////////////////////////////////
	// customizing

	cheditor.prototype.setEditorCallback = function() {
		var thisLocation = document.location.search;
		var thisPath = document.location.pathname;

		//if(thisPath == '/admin/') {
		if(!Durian.isMobile()) {
			var param = thisLocation.substr(1, thisLocation.length).split('&');
			var styleUrl = '/admin/';
			for(var ii in param) {
				var arg = param[ii];
				if(typeof arg != 'string') continue;

				var prop =arg.split('=');
				if(prop[0] == 'act') {
					if(prop[1] == 'board') {
					styleUrl += '?act=setup.design_board_edit_popup&module_code=board.board_view';
					} else {
						styleUrl += '?act=setup.design_page_edit';
						switch(prop[1]) {
							case 'goods.good_form' : styleUrl += '&module_code=shop.goods_view';break;
							case 'movie' : styleUrl += '&module_code=movie.movie_list';break;
							case 'site.popup_make' : 
							case 'site.popup_modify' : styleUrl += '&module_code=common.event_popup_view';break;
						}
					}
				}

				if(prop[0] == 'bbs_code') styleUrl += '&bbs_code='+prop[1];
			}
			styleUrl += '&ch=get_style';

			var editDoc = this.editArea.document;

			var commonCss = '';

			jQuery.get(styleUrl, function(tag) {
				commonCss += tag;

				jQuery('head', editDoc).append(commonCss);
			});
		}
		//}

		if (typeof(this.evtEditBlur) != 'function') {
			this.evtEditBlur = this.onEditBlur.bindForEvent(this);

			if (!Util.isFF) {
				this.addEvent(this.editArea, 'blur', this.evtEditBlur);
			} else {
				this.addEvent(this.doc, 'blur', this.evtEditBlur);
			}
		}
	};

	cheditor.prototype.onEditBlur = function() {
		this.$(this.inputForm).value = this.getValue();
	};

	cheditor.prototype.getValue = function() {

		if (this.cheditor.mode == 'code') {
			return this.makeHtmlContent();
		} else {
			var html = this.doc.body.innerHTML;

			if (GB.browser.msie || GB.browser.opera) {
				if (this.config.ieEnterMode == 'div') {
					html = html.replace(/<(\/?)P([^>]*)>/ig, 
							function (a, b, c) {
								if (/^\S/.test(c)) return a;
								return '<' + b + 'DIV' + c + '>';
							});
				}
				
				html = html.replace(/<(\/?)STRONG>/ig, "<$1B>");
				html = html.replace(/<(\/?)EM>/ig, "<$1I>");
			}

			return html;
		}
	};

	cheditor.prototype.toolbarRefresh = function(end)
	{
		//this.cheditor.toolbarWrapper.style.visibility = 'hidden';
		this.cheditor.toolbarWrapper.style.display = 'block';
	};


	// 2014-10-20
	cheditor.prototype.removeBom = function (str){
		
		

		var bom = 'FEFF';
		var chrBom = String.fromCharCode(parseInt(bom, 16));
		var regexp = new RegExp(chrBom, "g");
		var newstr = str.replace(regexp, '');
		return newstr;
	};

	cheditor.prototype.makeHtmlContent = function () {
    
	

		if(this.doc.body.textContent){
			return this.removeBom(this.doc.body.textContent);
		}else{
			return this.removeBom(this.doc.body.innerText);
		}
		
	};

	// 2015-02-12
	cheditor.prototype.resetEditArea = function () {
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
    //this.addEvent(this.doc.body, "paste", self.cheditor.pasteFunc);
};

	cheditor.prototype.getContents = function (fullSource) {

		
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


		mydoc = this.removeBom(mydoc);

		
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
};


