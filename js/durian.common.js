/***************************************************************************************
* comon function
***************************************************************************************/

function i18n_error(e){

	if('object' != typeof e){
		return '';
	}

	if(window.console && window.console.log){
		window.console.log(e.stack);
	}

	return '';
}

function load_i18n(pName, pLang) {
	try{
		jQuery.i18n.properties({
			name : pName,
			path : '/common/js/i18n/files/',
			mode : 'both',
			language : pLang,
			async : false
		});
	}catch(e){
		return i18n_error(e);
	}
}

function i18n(msg) {
	try{
		var args = msg.split(':');
		var key_name = args[0];
		var key_prop = "\""+ args[0] + "\"";

		var result = eval("jQuery.i18n.prop(" + key_prop + ")");

		if (result == '' || result == key_name || result == '['+ key_name +']') {
			if (args.length > 1) {
				args.splice(0, 1);
				result = args.join(':');
			}
		}
		return result;
	}catch(e){
		return i18n_error(e);
	}
}




try{
	if('undefined' != typeof __SUB_SITE_LANG_TYPE__){
		load_i18n("durian.common", __SUB_SITE_LANG_TYPE__);
	}else{
		load_i18n("durian.common", 'ko');
	}

}catch(e){}



var Durian = {

	dialogForm: function(args) {

		var defaultVal = {
			target: '',
			title: '',
			width: 300
		};

		var opt = jQuery.extend(defaultVal, args);

		jQuery(opt.target).dialog({
			modal: true,
			width: opt.width,
			title: opt.title,
			buttons: {
				'확인': function() {
					if( jQuery.isFunction(opt.callBack) ) {
						opt.callBack.call();
					}
				},
				'취소': function() {
					jQuery( this ).dialog( "close" );
				}
			},
			close: function(event, ui) {

			}
		});

		var cssData= {
			'.ui-dialog-title': {'font-weight':'bold', 'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-content': {'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset': {'height':'30px','font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset button': {'height':'25px', 'padding':'0'},
			'.ui-dialog-buttonset button span': {'line-height':'12px'}
		};

		Durian.setTargetCss(cssData);
	},

	dialogPopup: function(args) {

		var defaultVal = {
			'target': '',
			'title': '',
			'width': 300
		};

		var opt = jQuery.extend(defaultVal, args);

		jQuery(opt.target).dialog({
			modal: true,
			width: opt.width,
			title: opt.title,
			buttons: {
				'닫기': function() {
					jQuery( this ).dialog( "close" );
				}
			},
			close: function(event, ui) {
				if( jQuery.isFunction(opt.closeCallBack) ) {
					opt.closeCallBack.call(this);
				}
			},
			open : function(event, ui) {
				if( jQuery.isFunction(opt.openCallBack) ) {
					opt.openCallBack.call(this);
				}
			}
		});

		var cssData= {
			'.ui-dialog-title': {'font-weight':'bold', 'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-content': {'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset': {'height':'30px','font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset button': {'height':'25px', 'padding':'0'},
			'.ui-dialog-buttonset button span': {'line-height':'12px'}
		};

		Durian.setTargetCss(cssData);
	},

	imageViewer: function(src, args) {

		var defaultVal = {
			objID: '__imgViwer__',
			minSize: 230,
			title: i18n('lang.durian.common.look_image:이미지 보기'),
			useZoom: true
		};

		var opt = jQuery.extend(defaultVal, args);

		/*
		opt.width = jQuery(document).width()-100;
		opt.height = jQuery(document).height()-100;
		*/
		// fixed size
		opt.width = 980;
		opt.height = 720;

		var initUI = function() {

			if( !jQuery('#'+opt.objID).length ) {

				var zoomControl = '';

				var cssData= {
					'#__imgViwer__': {'display':'','width': opt.minSize+'px', 'z-index':'9999', 'top':'0', 'left':'0', 'position':'absolute'},
					'#__imgViwer__ b': {'display':'block', 'height':'1px', 'overflow':'hidden'},
					'#__imgViwer__ b, #__imgViwer__ .r5': {'background': '#F5F5F5'},
					'#__imgViwer__ .r1': {'background': '#B4B4B4', 'margin':'0px 5px 0px 5px'},
					'#__imgViwer__ .r2': {'border-left':'2px solid #B4B4B4','border-right':'2px solid #B4B4B4','margin':'0px 3px 0px 3px'},
					'#__imgViwer__ .r3, #__imgViwer__ .r4, #__imgViwer__ .r5': {'border-left':'1px solid #B4B4B4','border-right':'1px solid #B4B4B4'},
					'#__imgViwer__ .r3' : {'margin':'0px 2px 0px 2px'},
					'#__imgViwer__ .r4': {'height':'2px', 'margin': '0px 1px 0px 1px'},
					'#__imgViwer__ .r5': {'padding':'5px','font-family':'dotum,Verdana,Arial,sans-serif', 'font-size':'11px', 'color':'#7f7f7f', 'position':'relative'},
					'#__imgViwer__ .msg': {'padding': '0', 'background':'#FFFFFF', 'text-align':'center', 'vertical-align':'middle', 'position':'relative'},
					'#__imgViwer__ .title': {'color':'#000000','height':'20px', 'cursor':'move'},
					'#__imgViwer__ .buttons': { 'position':'absolute', 'top':'0', 'right':'0'},
					'#__imgViwer__ .buttons .close': {'width': '16px', 'height': '16px', 'margin':'3px 10px 0 0', 'background': 'transparent url(/common/js/jquery/theme/base/images/ui-icons_454545_256x240.png) no-repeat', 'background-position':'-95px -130px', 'cursor': 'pointer', 'border':'0'},
					'#__imgViwer__ .buttons .zoom': {'width': '16px', 'height': '16px', 'margin':'3px 5px 0 0', 'background': 'transparent url(/common/js/jquery/theme/base/images/ui-icons_454545_256x240.png) no-repeat', 'background-position':'-175px -193px', 'cursor': 'pointer', 'border':'0'}
				};

				if( opt.useZoom ) {
					zoomControl = '<input type="button" class="zoom" title="'+ i18n('lang.durian.common.org:원본') +'" />';
				}

				jQuery('body').append(jQuery('<div id="'+opt.objID+'"><b class="r1"></b><b class="r2"></b><b class="r3"></b><b class="r4"></b><div class="r5"><div class="buttons"><input type="button" class="zoom" title="'+ i18n('lang.durian.common.org:원본') +'" /><input class="close" type="button" title="'+ i18n('lang.durian.common.close:닫기') +'" /></div><div class="title"><span class="icon"></span><span class="titleTxt"></span></div><div class="msg"></div></div><b class="r4"></b><b class="r3"></b><b class="r2"></b><b class="r1"></b></div>'));
				jQuery('#'+opt.objID+' .msg').append('<span class="loading"><p><img src="/admin/images/common/pre_loader2_wite_15px.gif" align="absmiddle" />&nbsp;&nbsp;'+ i18n('lang.durian.common.load_image_info:이미지 정보를 불러오고있습니다.') +'</p></span >');
				Durian.setCenter('#'+opt.objID+' .msg', '#'+opt.objID+' .msg .loading');

				Durian.setTargetCss(cssData);
				jQuery('#'+opt.objID).draggable({ cancel: '#'+opt.objID+' .msg' });

				jQuery('#'+opt.objID+' .close').click(closeViewer);

				jQuery('#'+opt.objID+' .zoom').click(function() {
					closeViewer();

					var winInnerHtml = '<img src=\''+jQuery('#'+opt.objID+' .contentImg').attr('src')+'\' />';

					if(typeof(SITE_RIGHT_CLICK) != 'undefined') {
						winInnerHtml += '<script>document.oncontextmenu=new Function("return false");document.onselectstart=new Function("return false");</script>';
					}

					win = window.open();

					win.document.write(winInnerHtml);
				});
			}

		};

		var initViewer = function() {
			jQuery('#'+opt.objID).hide();
			jQuery('#'+opt.objID+' .titleTxt').html(opt.title);
			jQuery('#'+opt.objID+' .zoom').hide();
			jQuery('#'+opt.objID+' .contentImg').remove();
			jQuery('#'+opt.objID+' .loading').hide();
			jQuery('#'+opt.objID).css({'top':'0', 'left':'0', 'width': opt.minSize+'px'});
			Durian.setCenter(document, '#'+opt.objID, true);
		};

		var loadBegin = function() {
			jQuery('#'+opt.objID).show();
			jQuery('#'+opt.objID+' .loading').show();
		};

		var loadEnd = function() {
			if( opt.useZoom ) {
				jQuery('#'+opt.objID+' .zoom').show();
			}
			jQuery('#'+opt.objID+' .loading').hide();
		};

		var closeViewer = function() {
			Durian.imageViewerClose();
		};

		initUI();
		initViewer();
		loadBegin();

		jQuery('#'+opt.objID+' .msg').append('<img class="contentImg" style="display:none" src=\''+src+'\' />');

		var loadHandle = jQuery('#'+opt.objID+' .contentImg').bind('load', function() {

				loadEnd();

				jQuery(this).click(closeViewer).css({'cursor': 'pointer'}).show();

				jQuery('#'+opt.objID).show();

				mod.gallery.reSize('#'+opt.objID+' .contentImg', opt.width, opt.height);

				width = jQuery('#'+opt.objID+' .contentImg').width();

				width = width < opt.minSize ? opt.minSize : width;

				jQuery('#'+opt.objID).css({
					'top':0,
					'left':0,
					'width': (width + 15)+'px'
				});

				Durian.setCenter(document, '#'+opt.objID, true);
		});

	},

	imageViewerClose: function() {

		var opt = {
			objID: '__imgViwer__'
		};

		jQuery('#'+opt.objID).hide();
		jQuery('#'+opt.objID+' .contentImg').unbind('load');
	},

	smallNotice: function(msg) {
		var target='body';

		var cssData= {
			'.__snotice__': {'width': '170px', 'z-index':'9999', 'display':'none', 'bottom':'10px', 'left':'10px', 'position':'fixed'},
			'.__snotice__ b': {'display':'block', 'height':'1px', 'overflow':'hidden'},
			'.__snotice__ b, .__snotice__ .r5': {'background': '#F5F5F5'},
			'.__snotice__ .r1': {'background': '#B4B4B4', 'margin':'0px 5px 0px 5px'},
			'.__snotice__ .r2': {'border-left':'2px solid #B4B4B4','border-right':'2px solid #B4B4B4','margin':'0px 3px 0px 3px'},
			'.__snotice__ .r3, .__snotice__ .r4, .__snotice__ .r5': {'border-left':'1px solid #B4B4B4','border-right':'1px solid #B4B4B4'},
			'.__snotice__ .r3' : {'margin':'0px 2px 0px 2px'},
			'.__snotice__ .r4': {'height':'2px', 'margin': '0px 1px 0px 1px'},
			'.__snotice__ .r5': {'padding':'5px','font-family':'dotum,Verdana,Arial,sans-serif', 'font-size':'11px', 'color':'#7f7f7f', 'position':'relative'},
			'.__snotice__ .msg': {'padding': '5px 0 0 0'},
			'.__snotice__ .title': {'color':'#000000'},
			'.__snotice__ .close': { 'position':'absolute', 'top':'0', 'left': '148px'},
			'.__snotice__ .close input': {'width': '16px','height': '16px', 'margin':'0 5px 0 0', 'background':'transparent url(/common/js/jquery/theme/base/images/ui-icons_454545_256x240.png) no-repeat', 'background-position':  '-80px -130px', 'cursor':'pointer', 'border':'0' }
		};

		var html = '<div class="__snotice__"><b class="r1"></b><b class="r2"></b><b class="r3"></b><b class="r4"></b><div class="r5"><div class="close"><input type="button" /></div><div class="title">'+ i18n('lang.durian.common.notice_msg:알림 메시지') +'</div><div class="msg"></div></div><b class="r4"></b><b class="r3"></b><b class="r2"></b><b class="r1"></b></div>';

		if( !jQuery(target).children().is('.__snotice__') ) {
			jQuery(target).append(jQuery(html));

			Durian.setTargetCss(cssData);
		}

		clearTimeout(this.smallNoticeTimer);

		jQuery('.__snotice__ .msg').html(msg);

		jQuery('.__snotice__ .close input').click(function() {
			clearTimeout(this.smallNoticeTimer);
			jQuery('.__snotice__').hide();
		});

		if( jQuery('.__snotice__').css('position') != 'fixed' ) {

			var topSize = jQuery(window).height() - jQuery('.__snotice__').height() - 20 + jQuery(window).scrollTop();

			jQuery('.__snotice__').css({
				'position':'absolute',
				'top': topSize+'px',
				'left':'10px'
			});
		}

		jQuery('.__snotice__').fadeIn();


		this.smallNoticeTimer = setTimeout(function (){
        jQuery('.__snotice__').fadeOut();
    },3000);
	},

	loadingSmallWhite: function(obj) {

		jQuery.blockUI.defaults.overlayCSS.color = '#fff';

		var options = {
			'msg': '<img src="/admin/images/common/pre_loader2_white_20px.gif" align="absmiddle" />',
			'backgroundColor':'',
			'opacity': 0.5,
			'overlay_backgroundColor': '#fff'
		};

		Durian.loading(obj, options);
	},

	loadingSmallWhite13: function(obj) {

		jQuery.blockUI.defaults.overlayCSS.color = '#fff';

		var options = {
			'msg': '<img src="/admin/images/common/pre_loader2_white_13px.gif" align="absmiddle" />',
			'backgroundColor':'',
			'opacity': 0.5,
			'overlay_backgroundColor': '#fff'
		};

		Durian.loading(obj, options);
	},

	loadingSmallWhiteMsg: function(obj, msg) {

		jQuery.blockUI.defaults.overlayCSS.color = '#fff';

		var options = {
			'msg': msg,
			'backgroundColor':'',
			'opacity': 0.5,
			'overlay_backgroundColor': '#fff',
			'padding':5,
			'margin':0,
			'width': '95%',
			'color': '#000000'
		};

		Durian.loading(obj, options);
	},

	loadingSmallBlack: function(obj) {

		jQuery.blockUI.defaults.overlayCSS.color = '#fff';

		var options = {
			'msg': '<img src="/admin/images/common/pre_loader2_gray_20px.gif" align="absmiddle" />',
			'backgroundColor':'',
			'opacity': 0.7,
			'overlay_backgroundColor': '#000'
		};

		Durian.loading(obj, options);
	},

	loadingProgressTxt: function(count, total) {
		jQuery('.blockMsg .progress').html(count+'/<strong>'+total+'</strong>');
	},

	loading: function(obj, options) {

			var defaultVal = {
				'zIndex': '999999',
				'msg': '<img src="/admin/images/common/pre_loader2_15px.gif" align="absmiddle" />&nbsp;처리 중입니다. 잠시만 기다려주십시오.<span class="progress" style="padding-left:10px;"></span>',
				'border': '0',
				'padding': '15px',
				'backgroundColor': '#000',
				'radius': '8px',
				'opacity': 0.7,
				'color': '#fff',
				'overlay_backgroundColor': '#000',
				'overlay_opacity': 0.6
			}

			var opt = jQuery.extend(defaultVal, options);

			if( obj ) {

				jQuery(obj).block({
					message: opt.msg,
					css: {
						'zIndex': opt.zIndex,
						'border': opt.border,
						'width': opt.width,
						'padding': opt.padding,
						'backgroundColor': opt.backgroundColor,
						'-webkit-border-radius': opt.radius,
						'-moz-border-radius': opt.radius,
						'border-radius': opt.radius,
						'opacity': opt.opacity,
						'color': opt.color
					},
					overlayCSS:  {
						backgroundColor: opt.overlay_backgroundColor,
						opacity: opt.overlay_opacity
					}

				});

			} else {

				jQuery.blockUI.defaults.baseZ = '1000000';

				jQuery.blockUI({
					message: opt.msg,
					css: {
						'zIndex': opt.zIndex,
						'border': opt.border,
						'width': opt.width,
						'padding': opt.padding,
						'backgroundColor': opt.backgroundColor,
						'-webkit-border-radius': opt.radius,
						'-moz-border-radius': opt.radius,
						'border-radius': opt.radius,
						'opacity': opt.opacity,
						'color': opt.color
					},
					overlayCSS:  {
						backgroundColor: opt.overlay_backgroundColor,
						opacity: opt.overlay_opacity
					}
				});

			}

	},

	loadingClose: function(obj) {

		if( obj ) {
			jQuery(obj).unblock();
		} else {
			jQuery.unblockUI();
		}
	},

	alert : function(msg, type, callBack) {

		if( Durian.isMobile() ) {

			msg = msg.replace(/\<br( *\/? *)\>/gi, '\n').stripTags();

			alert(msg);

			if( Durian.alertCloseMode ) {
				Durian.alertClose();
			}

			return;
		}

		if( !jQuery('#__dlgAlert__').length ) {
			jQuery('body').append("<div id='__dlgAlert__' title=''><p style='font-size:12px;line-height:16px;'></p<</div>");
		}

		jQuery('#__dlgAlert__').attr('title',i18n('lang.durian.common.notice_msg:알림 메시지'));
		jQuery('#__dlgAlert__ p').html(msg);

		jQuery('#__dlgAlert__').dialog({
			modal: true,
			minHeight: 230,
			buttons: {
				'확인': function() {
					jQuery( this ).dialog( "close" );
				}
			},
			close: function(event, ui) {
				if( jQuery.isFunction(callBack) ) {
					callBack.call();
				} else {
					Durian.alertClose();
				}
			}

		});

		var cssData= {
			'.ui-dialog-title': {'font-weight':'bold', 'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-content': {'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset': {'height':'30px','font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset button': {'height':'25px', 'padding':'0'},
			'.ui-dialog-buttonset button span': {'line-height':'12px'}
		};

		Durian.setTargetCss(cssData);

	},

	confirm : function(msg, callBackDone, callBackCancel) {

		if( Durian.isMobile() ) {

			msg = msg.replace(/\<br( *\/? *)\>/gi, '\n').stripTags();

			if( confirm(msg) ) {
				if( jQuery.isFunction(callBackDone) ) {
						callBackDone.call();
				}
			} else {
				if( jQuery.isFunction(callBackCancel) ) {
						callBackCancel.call();
				}
			}

			return;
		}

		if( !jQuery('#__dlgConfirm__').length ) {
			jQuery('body').append("<div id='__dlgConfirm__' title=''><p></p></div>");
		}

		jQuery('#__dlgConfirm__').attr('title',i18n('lang.durian.common.notice_msg:알림 메시지'));
		jQuery('#__dlgConfirm__ p').html(msg);

		jQuery('#__dlgConfirm__').dialog({
			modal: true,
			minHeight: 200,
			buttons: {
				'확인': function() {
					if( jQuery.isFunction(callBackDone) ) {
							callBackDone.call();
					}

					try{
						jQuery( this ).dialog( "close" );
					} catch(e){}
				},
				'취소': function() {
					if( jQuery.isFunction(callBackCancel) ) {
							callBackCancel.call();
					}

					try{
						jQuery( this ).dialog( "close" );
					} catch(e){}
				}
			},
			close: function(event, ui) {
				Durian.alertClose();
			}

		});

		var cssData= {
			'.ui-dialog-title': {'font-weight':'bold', 'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-content': {'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset': {'height':'30px','font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset button': {'height':'25px', 'padding':'0'},
			'.ui-dialog-buttonset button span': {'line-height':'12px'}
		};

		Durian.setTargetCss(cssData);

	},

	confirmShopLogin : function(msg, callBackDone, callBackCancel) {
		/*
		if( Durian.isMobile() ) {

			msg = msg.replace(/\<br( *\/? *)\>/gi, '\n').stripTags();

			if( confirm(msg) ) {
				if( jQuery.isFunction(callBackDone) ) {
						callBackDone.call();
				}
			} else {
				if( jQuery.isFunction(callBackCancel) ) {
						callBackCancel.call();
				}
			}

			return;
		}
		*/

		if( !jQuery('#__dlgConfirm__').length ) {
			jQuery('body').append("<div id='__dlgConfirm__' title=''><p></p></div>");
		}

		jQuery('#__dlgConfirm__').attr('title',i18n('lang.durian.common.notice_msg:알림 메시지'));
		jQuery('#__dlgConfirm__ p').html(msg);

		jQuery('#__dlgConfirm__').dialog({
			modal: true,
			minHeight: 200,
			buttons: {
				'로그인': function() {
					if( jQuery.isFunction(callBackDone) ) {
							callBackDone.call();
					}

					try{
						jQuery( this ).dialog( "close" );
					} catch(e){}
				},
				'비회원 구매': function() {
					if( jQuery.isFunction(callBackCancel) ) {
							callBackCancel.call();
					}

					try{
						jQuery( this ).dialog( "close" );
					} catch(e){}
				}
			},
			close: function(event, ui) {
				Durian.alertClose();
			}

		});

		var cssData= {
			'.ui-dialog-title': {'font-weight':'bold', 'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-content': {'font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset': {'height':'30px','font-size':'12px', 'font-family':'Verdana,Arial,sans-serif'},
			'.ui-dialog-buttonset button': {'height':'25px', 'padding':'0'},
			'.ui-dialog-buttonset button span': {'line-height':'12px'}
		};

		Durian.setTargetCss(cssData);

	},

	alertLayer : function(layer, msg) {
		Durian.showLayer(layer, {
			center : true,
			key : true,
			block : true
		})
		$id('__alert_msg__').innerHTML = msg;
	},
	alertCloseMode : 0,
	alertCloseFocusObject : null,
	block : true,
	alertClose : function() {

		if (/^[+-]?[0-9]$/.test(Durian.alertCloseMode)) {
			Durian.alertCloseMode = parseInt(Durian.alertCloseMode, 10);
		}
		if (typeof Durian.alertCloseMode == 'string' && Durian.alertCloseMode != '') {
			location.href = Durian.alertCloseMode;
		} else if (typeof Durian.alertCloseMode == 'number') {

			switch (Durian.alertCloseMode) {
				case -2 : self.close(); break;
				case -1 : history.back(); break;
				case 1 : location.reload(true); break;
				case 2 : opener.location.reload(); self.close(); break;
			}

			//jQuery.unblockUI();

			if (Durian.alertCloseFocusObject) {
				try { Durian.alertCloseFocusObject.focus(); } catch (e) {}
				Durian.alertCloseFocusObject = null;
			}
		}
	},
	alertCallback : function(r) {
		if (r.isSuccess()) {
			var layer = $c('div');
			layer.id = '__alert__';
			Element.setStyle(layer, {
				padding : '0 0 0 0'
			})
			document.body.appendChild(layer);
			layer.innerHTML = r.value;
			Durian.alertLayer(layer, this.param.msg);
		} else {
			alert(this.param.msg);
		}
	},
	showIf : function(obj, value) {
		if (value) {
			Element.show(obj);
		} else {
			Element.hide(obj);
		}
	},
	showHide : function(show, hide, display) {
		if (hide) {
			hide = $array(hide);
			for (var i=0; i<hide.length; i++) {
				Element.hide(hide[i]);
			}
		}
		if (show) {
			show = $array(show);
			for (var i=0; i<show.length; i++) {
				Element.show(show[i], display);
			}
		}
	},
	showLayer : function(obj, option) {
		obj = $id(obj);
		Element.show(obj);

		if (typeof option.style == 'string') {
			obj.style.cssText = option.style;
		} else if (typeof option.style == 'object') {
			Element.setStyle(obj, option.style);
		}
		if (option.fixed) {
			Element.setStyle(obj, 'position', 'fixed');
		} else {
			Element.setStyle(obj, 'position', 'absolute');
		}

		var key = ['width', 'height', 'left', 'top', 'right', 'bottom'];
		for (var i=0; i<key.length; i++) {
			if (typeof option[key[i]] != 'undefined') {
				Element.setStyle(obj, key[i], option[key[i]]);
			}
		}
		Element.setStyle(obj, {
			zIndex : 2000
		});
		if (option.block) {
			Durian.blockPage(1000, '#000000', option.blockBindEvents);
			obj.blockPage = true;
		} else {
			obj.blockPage = false;
		}

		if (option.center) {
			var pos = Element.getCenter(obj);
			Element.moveTo(obj, pos);
		}

		if (Util.isIE) {
			var group = obj.id || Util.randomId();
			Element.attachBlocker(obj, group);
		}
		if (option.drag) {
			obj.drag = new Drag(obj, {
				handler : option.handler || []
			});
		}
		if (option.key && !obj.getAttribute('inited')) {
			$l(document, 'keypress', function(evt) {
				evt = Event.extend(evt);
				if (evt.key.isEnter || evt.key.isEsc) {
					Durian.alertClose();
				}
			});
		}

		obj.setAttribute('inited', true);

	},
	showLayerClose : function(obj) {
		jQuery(obj).remove();
		jQuery.unblockUI();
	},
	showFrameLayer : function(url, option) {
		if (!option.id) {
			option.id = 'common';
		}
		var id = '__frame_layer_' + option.id;
		var obj = $id(id);
		if (obj) {
			obj.iframe.src = url;
		} else {
			obj = $c('div');
			obj.id = id;
			obj.option = option;
			document.body.appendChild(obj);

			obj.innerHTML = '<iframe src="' + url + '" onload="Durian.autoResizeIframe(this);" allowTransparency="true" frameborder="0" scrolling="no"></iframe>';
			obj.iframe = obj.childNodes[0];

			// show layer
			this.showLayer(obj, option);

			// url
			if (typeof option.url == 'string') {
				obj.iframe.src = option.url;
			}
		}
	},
	closeFrameLayer : function(id) {
		id = '__frame_layer_' + (id || 'common');
		var obj = $id(id);
		Durian.showLayerClose(obj);
	},
	autoResizeIframe : function(iframe) {
		Util.autoResizeIframe(iframe);
		var obj = iframe.parentNode;
		if (obj.option) {
			if (obj.option.center) {
				var pos = Element.getCenter(obj);
				Element.moveTo(obj, pos);
			}
		}
	},

	// iframe resizing
	resizeIframe : function(iframe, height) {
		var iframe = $id(iframe);
		if (typeof iframe != 'undefined') {
			if (height > 0) {
				Element.setStyle(iframe, 'height', height);
			} else {
				Util.autoResizeIframe(iframe, true, false);
				//Durian.autoResizeIframe(iframe);
			}
		}
	},

	resizeImage : function(image, width, index) {
		var list = $array(image).filter(function(img) {

			img.style.display = "";

			img.size = Element.getSize(img);

			if (img.size.width > 0 && img.size.width > width) {
				var rate = width / img.size.width;
				img.style.width = width + 'px';
				img.style.height = Math.round(img.size.height * rate) + 'px';

				return false;
			}

			return true;
		});

		index = index || 0;
		index++;
		if (list.length && index <= 10) {
			setTimeout(function() {
				Durian.resizeImage(list, width, index);
			}, 200);
		}
	},

	// parent : 1 base offset
	searchParentTag : function(obj, tag, offset) {
		tag = tag.toLowerCase();
		var count = 0;
		var p = obj.parentNode;
		while (p != document.body) {
			if (p.tagName.toLowerCase() == tag) {
				count++;
				if (count == offset) {
					return p;
				}
			}
			p = p.parentNode;
		}
		return false;
	},

	// child : 1 base offset
	searchChildTag : function(obj, tag, offset) {
		var list = obj.getElementsByTagName(tag);

		if (typeof list[offset-1] != 'undefined') {
			return list[offset-1];
		} else {
			return false;
		}
	},

	// prev : 1 base offset
	searchPrevSameTag : function(obj, offset, parent) {
		var tag = obj.tagName;
		var list = (parent || document).getElementsByTagName(tag);

		var key = -1;
		for (var i=0; i<list.length; i++) {
			if (list[i] == obj) {
				key = i;
				break;
			}
		}
		if (key > -1 && key >= offset) {
			return list[key - offset];
		} else {
			return false;
		}
	},

	// next : 1 base offset
	searchNextSameTag : function(obj, offset, parent) {
		var tag = obj.tagName;
		var list = (parent || document).getElementsByTagName(tag);

		var key = -1;
		for (var i=0; i<list.length; i++) {
			if (list[i] == obj) {
				key = i;
				break;
			}
		}
		if (key > -1 && key + offset < list.length) {
			return list[key + offset];
		} else {
			return false;
		}
	},

	searchByClassName : function(obj, className) {
		var list = obj.getElementsByTagName('*');
		var result = [];
		for (var i=0; i<list.length; i++) {
			if (Element.classExists(list[i], className)) {
				result.push(list[i]);
			}
		}

		if (result.length) {
			if (result.length == 1) {
				return result[0];
			} else {
				return result;
			}
		} else {
			return false;
		}
	},

	// popup window
	win : {},
	openWin : function(name, url, x, y, sc) {
		if (this.win[name] && !this.win[name].closed) {
			var w = this.win[name];
			w.location.href = url;
		} else {
			if (arguments.length > 2) {
				var winl = (screen.width - x) / 2;
				var wint = (screen.height - y) / 2;
				var w = window.open(url, name, 'scrollbars=' + sc + ', resizable=yes, width=' + x + ', height=' + y + ', top='+wint+', left='+winl);
			} else {
				var w = window.open(url, name);
			}
			this.win[name] = w;
		}

		if (w) {
			w.focus();
		}

		return w;
	},

	// modal window
	openModalWin : function(url, x, y, resize, arg) {
		if (window.showModalDialog) {
			return Durian.openWin('', url, x, y, resize);
		} else {
			return window.showModalDialog(url, arg || self, 'dialogHeight: '+y+'px; dialogWidth: '+x+'px; edge: Raised; center: Yes; help: No; resizable: '+resize+'; status: No; scroll: No;');
		}
	},

	// clipboard copy - ZeroClipboard
	attachClipCopy : function(obj, callback, endCallback) {
		if (obj instanceof Array) {
			if (!obj.length) {
				return;
			}
		} else if (obj) {
			obj = [obj];
		} else {
			return;
		}

		ZeroClipboard.setMoviePath('/common/js/ZeroClipboard/ZeroClipboard.swf');
		var clip = new ZeroClipboard.Client();
		clip.setHandCursor(true);

		clip.addEventListener('mousedown', callback);
		if (endCallback) {
			clip.addEventListener('complete', endCallback);
		}

		clip.glue(obj[0]);
		obj.each(function(el) {
			el.clip = clip;
			return el;
		});

		$l(obj, 'mouseover', Durian._attachClipCopy.bindForEvent(clip));
	},
	_attachClipCopy : function(evt, obj) {
		//if (this.domElement != obj) {
			this.reposition(obj);
		//}
	},

	imgDefault : function(img, src, widthParam) {
		src = decodeURIComponent(src);
		if (!src || /^[0-9]+$/.test(src) || img.src.search(src) > -1) {

			var width = 100;
			var default_prefix = 'default_';

			if( widthParam ) {
				size = widthParam;
			} else {
				size = parseInt((src || img.width || img.getAttribute('width')), 10) || 100;
			}

			if( src == '#lock' ) {
				default_prefix = 'lock_';
			}

			if (size <= 50) {
				fixSize = 50;
			} else if (size <= 100) {
				fixSize = 100;
			} else if (size <= 300) {
				fixSize = 300;
			} else {
				fixSize = 500;
			}

			src = '/images/default/common/'+default_prefix+fixSize+'.gif';
		}

		if (img.src.search(src) == -1) {
			img.src = src;
		}
	},

	imgResize : function(img, maxW, maxH) {
		if (maxW) {
			if (img.width > maxW) {
				img.width = maxW;
			}
		}
		if (maxH) {
			if (img.width > maxH) {
				img.width = maxH;
			}
		}
	},

	formatPrice : function(value, forceSign) {
		var number = parseInt(value, 10);
		if (number < 0) {
			var sign = '-';
		} else if (forceSign && number > 0) {
			var sign = '+';
		} else {
			var sign = '';
		}

		var value = ('' + value).trim().replace(/[^0-9]/, '');
		var gap = value.length % 3 || 3;
		var str = value.slice(0, gap);
		value = value.slice(gap);
		while (value) {
			str += ',' + value.slice(0, 3);
			value = value.slice(3);
		}
		return sign + str;
	},

	// upload
	checkUploadCount : function(option) {
		option = Class.extend(option || {});

		var max = parseInt(option.max, 10) || 0;
		if (!max) {
			return true;
		}

		var count = count2 = 0;

		if (typeof option.single != 'undefined' && option.single == true) {
			count = !option.file_path ? 0 : 1;
			count2 = !option.db_file_path ? 0 : 1;
		} else {
			if (typeof option.list != 'undefined') {
				var list_child = option.list.childNodes;
				for (i = 0; i < list_child.length; i++) {
					if (list_child[i].nodeType == 1) {
						count++;
					}
				}
			}

			if (typeof option.db_list != 'undefined') {
				var db_list_child = option.db_list.childNodes;
				for (i = 0; i < db_list_child.length; i++) {
					if (db_list_child[i].nodeType == 1) {
						count2++;
					}
				}
			}
		}

		var total = count + count2;
		if (max <= total) {
			alert(i18n('lang.durian.common.limit_uploading_file:첨부파일은 최대') + ' ' + max + i18n('lang.durian.common.permitted_count:개까지 업로드 가능합니다.'));
			return false;
		} else {
			return true;
		}
	},

	openUploadWin : function(option) {

		if( Durian.isHanDomain() || Durian.isMobilePath() ) {
			Durian.openUploadWinSingle(option);
			return;
		}

		option = Class.extend({
			act : 'common.popup_upload_multi',
			ch : 'pop',
			upload_mode : 'FILE'
		}, option || {});

		var domain = 'http://' + Durian.getDomain();
		var img_server = 'http://' + Durian.getImgServer();
		option.domain = domain;
		var query = ''.encodeQuery(option);

		return Durian.openWin('upload', img_server + '/?' + query, 570, 388, 'no');
	},

	openUploadWinSingle : function(option) {
		option = Class.extend({
			act : 'common.popup_upload',
			ch : 'pop',
			upload_mode : 'FILE'
		}, option || {});

		var domain = 'http://' + Durian.getDomain();
		var img_server = 'http://' + Durian.getImgServer();
		option.domain = domain;
		var query = ''.encodeQuery(option);

		return Durian.openWin('upload', img_server + '?' + query, 350, 150, 'no');
	},

	ajaxDeleteFile : function(option, obj) {
		option = Class.extend({
			act : 'common.upload_delete_ajax',
			upload_mode : 'FILE'
		}, option || {});

		new Ajax({
			url : './',
			method : 'post',
			type : 'JSON',
			param : option,
			callback : Durian.ajaxDeleteFileCallback,
			obj : obj
		});
	},

	ajaxDeleteFileCallback : function(r) {
		if (r.isSuccess()) {
			var success = r.value.success;
			if (success) {
				applyDeleteFile(r, this.obj);
			} else {
				alert(r.value.msg);
			}
		}
	},

	getDomain : function() {
		return location.href.split('/')[2];
	},

	getBaseDomain : function() {
		var domain = Durian.getDomain();
		// ip
		if (domain.search(/^[0-9\.]+$/) > -1) {
			return domain;
		}

		return domain.replace(/^(www|img|m|home|desk|mail|contact|calendar|cafe|tax|marketing|site|stat|setting)\./, '');
	},

	isHanDomain : function() {
			var baseDomain = Durian.getBaseDomain();

			var regExp = /^[a-zA-Z0-9_\-.]+$/;

			if ( regExp.test(baseDomain) && baseDomain.substr(0, 4) != 'xn--' ) {
				return false;
			} else {
				return true;
			}
	},

	getImgServer : function() {
		return Durian.getDomain();
	},

	// Editor
	initEditor : function(option) {

		if (option.mode == 'ALL') {
			var area = (option.area) ? $id(option.area) : document;
			option.item = jQuery('textarea', area).get();
		} else {
			if (typeof option.item == 'string') {
				option.item = option.item.split(',');
			} else if (!option.item) {
				// error
				alert('ERROR : Invalid Editor Configuration.');
				return;
			}
		}
		if (!(option.item instanceof Array)) {
			option.item = [option.item];
		}

		// update modified data if exists
		Durian.updateEditor(option.item);

		// remove old editor if exists
		Durian.removeEditor(option.item);

		var defaultEditor = 'cheditor';
		var type = defaultEditor;
		if (option.useType) {
			type = option.type || Util.getCookie('HTML_EDITOR') || defaultEditor;
		}
		var result;
		switch (type) {
			case 'codemirror' :
				result = Durian.initCodeMirror(option);
				break;
			case 'naver' :
				result = Durian.initNaverEditor(option);
				break;
			default :
				type = defaultEditor;
				result = Durian.initCHEditor(option);
				break;
		}

		if (option.useType) {
			Util.setCookie('HTML_EDITOR', type, 86400 & 7, '/', Durian.getBaseDomain());
			jQuery('.editor_change_box button')
				.removeClass('on')
				.filter('button[editorType="' + type + '"]').addClass('on');
		}
		return result;
	},
	initCodeMirror : function(option) {
		for (var i=0; i<option.item.length; i++) {
			var el = $id(option.item[i]);
			var coderOption = {
				obj: el,
				objBackup: null,
				codeType: 'HTML',
				useSyntax: true,
				useBackup: false
			};
			if (option.fontSize) coderOption.fontSize = option.fontSize;
			if (option.fontFamily) coderOption.fontFamily = option.fontFamily;
			if (option.fontColor) coderOption.fontColor = option.fontColor;
			if (option.bgColor) coderOption.bgColor = option.bgColor;

			el.editorCodeMirror = new Durian.CodeMirror(coderOption);
			el.editorType = 'codemirror';
		}
	},
	initNaverEditor : function(option) {
		var skinUrl = "/common/js/smarteditor/SmartEditor2Skin.html";
		var creator = "createSEditor2";

		for (var i=0; i<option.item.length; i++) {
			var el = $id(option.item[i]);
			nhn.husky.EZCreator.createInIFrame({
				elPlaceHolder: el,
				sSkinURI: skinUrl,
				fCreator: creator,
				htParams: { fOnBeforeUnload : function(){}}
			});
			el.editorType = 'naver';
		}
	},
	initCHEditor : function(option) {
		new Durian.CHEditor(option);
		for (var i=0; i<option.item.length; i++) {
			option.item[i].editorType = 'cheditor';
		}

		// focus problem :-(
		setTimeout(function() {
			window.scrollTo(0, 0);
		}, 500);
	},
	updateEditor : function(item) {
		if (!(item instanceof Array)) {
			item = [item];
		}
		for (var i=0; i<item.length; i++) {
			var obj = item[i];
			if (obj.editorType == 'naver') {
				obj.editorNaver.exec("UPDATE_CONTENTS_FIELD", []);
				if (obj.value == '<br>' || obj.value == '<p>&nbsp;</p>') {
					obj.value = '';
				}
			} else {
				// need not
			}

			// fix codemirror confilct
			// change codemirror because codemirror change textarea value when form submit
			if (obj.editorCodeMirror) {
				obj.editorCodeMirror.setValue(obj.value);
			}
		}
	},
	removeEditor : function(item) {
		if (!(item instanceof Array)) {
			item = [item];
		}
		for (var i=0; i<item.length; i++) {
			var obj = item[i];
			obj.editorType = null;

			jQuery(obj).show().nextAll('iframe, div[class^="cheditor"], div.CodeMirror').remove();
		}
	},
	// upload
	initUpload : function(option) {
		return new Durian.SWFUpload(option);
		//return new Durian.TrueUpload(option);
	},
	// display Image or Flash
	displayImageFlash : function(url, width, height) {
		if (url.search(/\.swf$/i) > -1) {
			Durian.displayFlash(url, width, height);
		} else {
			Durian.displayImage(url, width, height);
		}
	},
	displayImage : function(url, width, height) {
		if (width && height) {
			var size = 'width="' + width + '" height="' + height + '"';
		} else {
			var size = '';
		}
		var html = '<img src="' + url + '" ' + size + '>';
		document.write(html);
	},

	// displayFlash
	displayFlash : function(url, width, height, id, vars, wmode, bg, scriptAccess) {
		var html = Durian.getFlashHTML(url, width, height, id, vars, wmode, bg);
		document.write(html);
	},
	getFlashHTML : function(url, width, height, id, vars, wmode, bg, scriptAccess) {
		if (width && height) {
			var size = 'width="' + width + '" height="' + height + '"';
		} else {
			var size = 'width="100%"';
		}
		if (!id) {
			id = Util.randomId(4, 'flash');
		}
		if (!vars) {
			vars = '';
		}
		if (!wmode) {
			wmode = 'transparent';
		}
		if (!bg) {
			bg = '';
		}
		if (!scriptAccess) {
			scriptAccess = 'sameDomain';
		}

		var html = '<object id="' + id + '" ' + size + ' align="middle" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0">'
				 + '<param name="movie" value="' + url + '" />'
				 + '<param name="flashvars" value="' + vars + '" />'
				 + '<param name="wmode" value="' + wmode + '" />'
				 + '<param name="bgcolor" value="' + bg + '" />'
				 + '<param name="AllowScriptAccess" value="' + scriptAccess + '" /> '
				 + '<param name="menu" value="false" / >'
				 + '<param name="quality" value="high" / >'
				 + '<embed id="' + id + '_embed" name="' + id + '" src="' + url + '" ' + size + ' flashvars="' + vars + '" wmode="' + wmode + '" bgcolor="' + bg + '" allowScriptAccess="' + scriptAccess + '"'
				 + ' align="middle" quality="high" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer"'
				 + '></embed>'
				 + '</object>';
		return html;
	},

	// block page
	blockPage : function(zIndex, color, blockBindEvents) {

		if (!zIndex) {
			zIndex = 1000;
		}

		jQuery.blockUI.defaults.overlayCSS = {
			'baseZ':zIndex,
			'cursor': 'default',
			'backgroundColor': color,
			'opacity': 0.5
		};

		jQuery.blockUI({
			message: '',
			bindEvents: blockBindEvents
		});
	},

	// add bookmark
	// refered to http://www.dynamicdrive.com/dynamicindex9/addbook.htm
	bookmark : function(url, title) {
		if (Util.isIE) {
			window.external.AddFavorite(url, title);
		} else if (Util.isFF) {
			window.sidebar.addPanel(title, url, '');
		} else if (Util.isOpera) {
			var elem = document.createElement('a');
			elem.setAttribute('href',url);
			elem.setAttribute('title',title);
			elem.setAttribute('rel', 'sidebar');
			elem.click();
		}
	},

	isMobile : function() {
		// test mode
		//return true;

		if (window.navigator.userAgent.search(/(iphone|samsung|lgtel|mobile)/i) != -1) {
			return true;
		} else {
			return false;
		}
	},

	isMobilePath : function() {
		var thisPath = document.location.pathname;

		if(thisPath == '/mobile/') {
			return true;
		} else {
			return false;
		}
	},

	applyHiddenSubmit : function(formName, debug) {
		var form = document.forms[formName];
		form.target = '__hidden_frame__';

		var iframe = $id('__hidden_frame__')
		if (!iframe) {
			iframe = $c('iframe');
			iframe.id = iframe.name = '__hidden_frame__';
			iframe.setAttribute('width', debug ? '100%' : '0');
			iframe.setAttribute('height', debug ? '100' : '0');
			iframe.setAttribute('frameborder', debug ? '1' : '0');
			iframe.setAttribute('border', debug ? '1' : '0');
			document.body.appendChild(iframe);
		}
	},

	increaseClientAutoSize : function() {

		if (typeof Durian.initCommon.clientOldSize == 'undefined') {
				alert('undefined');
				return false;
		}

		var clientCurSize = Util.getDocSize();
		var increaseX = 0;
		var increaseY = 0;

		if( Durian.initCommon.clientCurSize.width < clientCurSize.width ) {
			increaseX = clientCurSize.width - Durian.initCommon.clientCurSize.width;
		}

		if( Durian.initCommon.clientCurSize.height < clientCurSize.height ) {
			increaseY = clientCurSize.height - Durian.initCommon.clientCurSize.height;
		}

		Durian.initCommon.clientCurSize = clientCurSize;

		window.resizeBy(increaseX, increaseY);
	},

	setHeadCss :function(cssTxt) {

		if(!cssTxt) return false;

		var cssObj = document.createElement('style');
		var headObj = document.getElementsByTagName('head')[0];

		cssObj.setAttribute('type', 'text/css');

		if(cssObj.styleSheet) {
			cssObj.styleSheet.cssText = cssTxt;
		} else {
			cssObj.appendChild(document.createTextNode(cssTxt));
		}

		headObj.appendChild(cssObj);

	},

	setTargetCss: function(cssData) {
		jQuery.each(cssData, function(key) {
			jQuery(key).css(this);
		});
	},

	setCenter : function(baseObj, targetObj, useScroll) {

		if( useScroll ) {
			scrollLeft	= jQuery(window).scrollLeft();
			scrollTop		= jQuery(window).scrollTop();
		} else {
			scrollLeft	= 0;
			scrollTop		= 0;
		}

		var posX = (jQuery(baseObj).width() - jQuery(targetObj).width()+scrollLeft) / 2;
		var posY = (jQuery(baseObj).height() - jQuery(targetObj).height()+scrollTop) /2;

		//alert(jQuery(baseObj).width()+' / '+jQuery(targetObj).width());

		jQuery(targetObj).css({'top':posY+'px', 'left':posX+'px'});
	},

	fixFlash : function() {

		// loop through every embed tag on the site
		var embeds = document.getElementsByTagName('embed');
		for(i=0; i<embeds.length; i++)  {
			 embed = embeds[i];
			 var new_embed;
			 // everything but Firefox & Konqueror
			 if(embed.outerHTML) {
					 var html = embed.outerHTML;
					 // replace an existing wmode parameter
					 if(html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i))
							 new_embed = html.replace(/wmode\s*=\s*('|")window('|")/i,"wmode='transparent'");
					 // add a new wmode parameter
					 else
							new_embed = html.replace(/<embed\s/i,"<embed wmode='transparent' ");
					 // replace the old embed object with the fixed version
					 embed.insertAdjacentHTML('beforeBegin',new_embed);
					 embed.parentNode.removeChild(embed);
			 } else {
					 // cloneNode is buggy in some versions of Safari & Opera, but works fine in FF
					 new_embed = embed.cloneNode(true);
					 if(!new_embed.getAttribute('wmode') || new_embed.getAttribute('wmode').toLowerCase()=='window')
							 new_embed.setAttribute('wmode','transparent');
					 embed.parentNode.replaceChild(new_embed,embed);
			 }
		}
		// loop through every object tag on the site
		var objects = document.getElementsByTagName('object');
		for(i=0; i<objects.length; i++) {
			 object = objects[i];
			 var new_object;
			 // object is an IE specific tag so we can use outerHTML here
			 if(object.outerHTML) {
					 var html = object.outerHTML;
					 // replace an existing wmode parameter
					 if(html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i))
							 new_object = html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i,"<param name='wmode' value='transparent' />");
					 // add a new wmode parameter
					 else
							new_object = html.replace(/<\/object\>/i,"<param name='wmode' value='transparent' />\n</object>");
					 // loop through each of the param tags
					 var children = object.childNodes;
					 for(j=0; j<children.length; j++) {
							try {
								if(children[j].getAttribute('name').match(/flashvars/i)) {
									new_object = new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i,"<param name='flashvars' value='"+children[j].getAttribute('value')+"' />");
								}
							} catch (e) {}
					 }
					 // replace the old embed object with the fixed versiony
					 object.insertAdjacentHTML('beforeBegin',new_object);
					 object.parentNode.removeChild(object);
			 }
		}

	},

	onlyNumericInput : function(selector, useComma, callBack, useMinus) {

		jQuery(selector).keypress(function(event){
			if (event.which && (event.which  > 47 && event.which  < 58 || event.which == 8 || (event.which == 45 && useMinus) )) {
				// true
			} else {
				// false
				event.preventDefault();
			}

			var num = jQuery(this).val().replace(/\,/g,'').replace(/--/g,'-');

			if( num.length > 14 ) {
				event.preventDefault();
			}

		}).focus(function(){
			jQuery(this).select();
		}).keyup(function(){
				if( !jQuery(this).val() ) return false;

				var num = jQuery(this).val().replace(/\,/g,'').replace(/--/g,'-');

				if( useMinus && isNaN(parseInt(num)) ) {
					jQuery(this).val(num);
					return false;
				}

				if(useComma) {
					jQuery(this).val(
						Durian.formatPrice(parseInt(num))
					);
				}

				if( jQuery.isFunction(callBack) ) {
						callBack.call(this);
				}

		}).bind('paste', function(event){ // 숫자만 입력할 경우 붙여넣기 금지
			event.preventDefault();
		}).css({'ime-mode':'disabled'});
	},

	dateFormat : function(dt, fmt) { // dt: new Date()
      return fmt.replace(/(Y|y|m|d|h|H|i|s|am|pm)/gi,
          function($1){
              switch ($1){
                  case 'Y':		return dt.getFullYear();
                  case 'y':		return dt.getFullYear().toString().substr(2);
                  case 'm':		return (m = dt.getMonth()+1) < 10 ? '0'+m : m;
                  case 'd':		return (d = dt.getDate()) < 10 ? '0'+d : d;
                  case 'h':		return (h = dt.getHours() % 12) ? (h < 10 ? '0'+h : h) : 12;
                  case 'H':		return (H = dt.getHours()) < 10 ? '0'+H : H;
                  case 'i':		return (i = dt.getMinutes()) < 10 ? '0'+i : i;
                  case 's':		return (s = dt.getSeconds()) < 10 ? '0'+s : s;
                  case 'am':	return dt.getHours() < 12 ? 'am' : 'pm';
                  case 'pm':	return dt.getHours() < 12 ? 'am' : 'pm';
              }
          }
      );
  },

	debug : function(msg) {

		if( !jQuery('#debug').size() ) {
			jQuery('body').append('<hr/><br/>#DEBUG<br/><div id="debug" style="width:100%; height:200px;background:white;overflow-x:hidden;overflow-y:scroll"></div><br/>');
		}

		jQuery('#debug').html(msg+'<br>'+jQuery('#debug').html() );
	}

}


///////////////////////////////////////////////////////////////////////////////////////////////////
// init common

Durian.initCommon = {
	isCafe : location.href.indexOf('/cafe/') != -1 ? true : false,
	isUser : location.href.indexOf('/admin/') == -1 ? true : false,
	isPopup : location.href.search(/&ch=(pop|iframe)/) > -1 ? true : false,
	clientOldSize: {},
	clientCurSize: {},
	init : function() {
		var D = Durian.initCommon;

		D.clientOldSize = D.clientCurSize = Util.getDocSize();

		// user
		if (D.isUser && !D.isCafe) {
			D.initUser();
		}

		// common

		// inputbox
		//D.initInputBox();
	},

	// user
	initUser : function() {
		var D = Durian.initCommon;
		// fly
		try {
			var obj_fly = ['L_TODAY_GOODS', 'L_QUICK_MENU'];
			for (var i=0; i<obj_fly.length; i++) {
				var obj = $id(obj_fly[i]);
				if (obj && obj.getAttribute('scroll') == '1') {
					D.initScroll(obj);
				}
			}
		} catch (e) {}

		// bbs link
		try {
			var obj_bbs = ['L_NOTICE', 'L_QNA', 'M_AFTERNOTE', 'M_BBS_NOTICE', 'M_BBS_ADD'];
			for (var i=0; i<obj_bbs.length; i++) {
				var obj = $id(obj_bbs[i]);
				if (obj) {
					var list = obj.getElementsByTagName('a');
					for (var j=0; j<list.length; j++) {
						if (list[j].href.indexOf('pop=1') > -1) {
							$l(list[j], 'click', D.onPopViewBBS);
						}
					}
				}
			}
		} catch (e) {}

		// popup launch
		if (!D.isPopup) {
			D.initPopup();
		}

		// ban mouse right button down
		function right(e) {
			return false;
		}

//		document.onmousedown=right;
//		document.oncontextmenu=right;
//		document.ondragstart =right;
//		document.onselectstart=new Function ("return false");

//		if (document.layers) window.captureEvents(Event.MOUSEDOWN);

//		window.onmousedown=right;
	},

	// popup
	initPopup : function() {
		var D = Durian.initCommon;

		// not use in /mobile/ path
		if (typeof __MOBILE__ != 'undefined' && __MOBILE__) {
			return false;
		}

		var data = Util.getCookie('POPUP_DATA');

		if (!data) {
			D.getPopupListAjax();
		} else if (data != '-1') {
			D.applyPopup(data);
		}
	},
	applyPopup : function(data) {
		var D = Durian.initCommon;

		var query = location.href.parseQuery(true);

		var list = data.split('|^|');
		for (var i=0; i<list.length; i++) {
			var row = list[i].split('|');
			var url = row.pop();
			if (url) {
				if (D.checkQueryMatch(query, url.parseQuery())) {
					D.openPopup(row);
				}
			} else {
				// refer to main/index.php for var isMain
				if (typeof isMain != 'undefined' && isMain) {
					D.openPopup(row);
				}
			}
		}
	},
	openPopup : function(data) {
		var seq    = data[0];
		var width  = data[1];
		var height = data[2];
		var left   = data[3];
		var top    = data[4];
		var scroll = data[5];
		var wType  = data[6];
		var bType  = data[7];

		var block_name = 'POPUP_BLOCK_' + seq;
		if (Util.getCookie(block_name)) {
			return;
		}

		var url = '?act=common.event_popup_view&seq=' + seq;
		if (wType == '0') {
			if (scroll == '2' || scroll == '1') {
				scroll = 'yes';
			} else {
				scroll = 'no';
			}

			var win = window.open(url, 'event_' + seq, 'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top + ', scrollbars=' + scroll);
			if (win) {
				win.focus();
			}
		} else {
			if (scroll == '2') {
				scroll = 'auto';
			} else if (scroll == '1') {
				scroll = 'yes';
			} else {
				scroll = 'no';
			}

			var divWrap = $c('div');
			var divArea = $c('div');
			var divBody = $c('div');
			var iframe	= $c('iframe');

			divWrap.setAttribute('id', 'layer_event_' + seq);
			iframe.setAttribute('id', 	divWrap.id + '_iframe');

			Element.setStyle(divWrap, {
				'padding' : '0',
				'margin' : '0 auto',
				'width' : width + 'px',
				'position' : 'absolute',
				'left' : left + 'px',
				'top' : top + 'px',
				'cursor' : 'move',
				'zIndex' : '999999'
			});

			Element.setStyle(divBody, {
				'clear' : 'both',
				'width' : width + 'px',
				'height' : (parseInt(height) + 28) + 'px', // '이 창 다시 열지 않음' 높이 추가..
				'margin' : '0',
				'backgroundColor': '#FFFFFF'
			});

			Element.setStyle(iframe, {
				'width'  : '100%',
				'height' : '100%',
				'border' : '0'
			});

			Element.setStyle(divArea, {
				'clear' : 'both',
				'width' : width + 'px',
				'height': '21px',
				'background':'url(/images/default/common/btn_move.gif) no-repeat right'
			});

			iframe.setAttribute('frameBorder', '0');
			iframe.setAttribute('border', '0');
			iframe.setAttribute('scrolling', scroll);
			iframe.setAttribute('src', url + '&layer=1');

			document.body.appendChild(divWrap);

			if( wType == '1') {
				divWrap.appendChild(divArea);
			}

			divWrap.appendChild(divBody);
			divBody.appendChild(iframe);

			if ( wType == '1' ) {
				var D = Durian.initCommon;
				new Drag(divWrap, {
					onMove : D.onPopupLayerMove,
					onEnd : D.onPopupLayerEnd
				});
			}

			// ie rendering bug fix
			if (Util.isIE) {
				iframe.style.visibility = 'hidden';
				iframe.style.visibility = 'visible';
			}
		}
	},
	closePopup : function(seq) {
		var div = $id('layer_event_' + seq);
		if (div) {
			Element.remove(div);
		}
	},
	onPopupLayerMove : function(evt) {
		var iframe = $id(this.object.id + '_iframe');
		iframe.style.visibility = 'hidden';
	},
	onPopupLayerEnd : function(evt) {
		var iframe = $id(this.object.id + '_iframe');
		iframe.style.visibility = 'visible';
	},
	checkQueryMatch : function(base, part) {
		var flag = true;
		for (var key in part) {
			if (typeof base[key] == 'undefined' || base[key] != part[key]) {
				flag = false;
				break;
			}
		}
		return flag;
	},
	getPopupListAjax : function() {
		var D = Durian.initCommon;

		new Ajax({
			url : '/',
			method : 'POST',
			type : 'TEXT',
			param : {
				act : 'common.event_popup_ajax'
			},
			callback : D.getPopupListAjaxCallback
		});
	},
	getPopupListAjaxCallback : function(r) {
		if (r.isSuccess()) {
			if (r.value) {
				var D = Durian.initCommon;
				D.applyPopup(r.value);

				Util.setCookie('POPUP_DATA', r.value, 0, '/', Durian.getBaseDomain());
			} else {
				Util.setCookie('POPUP_DATA', -1, 0, '/', Durian.getBaseDomain());
			}

		}
	},

	initInputBox : function(obj) {
		var D = Durian.initCommon;
		var list = (obj || document).getElementsByTagName('input');
		for (var i=0; i<list.length; i++) {
			if (list[i].type == 'text' || list[i].type == 'password') {
				$l(list[i], 'focus', D.onInputFocus);
				$l(list[i], 'blur', D.onInputBlur);
			}
		}
	},

	// input box focus/blur action
	onInputFocus : function(evt, obj) {
		//var size = Element.getSize(obj);
		Element.addClass(obj, 'on');
		//Element.setSize(obj, size.width-4, size.height-4);
	},
	onInputBlur : function(evt, obj) {
		//var size = Element.getSize(obj);
		Element.delClass(obj, 'on');
		//Element.setSize(obj, size.width-2, size.height-2);
	},

	// for scroll
	scrollInit : false,
	scrollList : [],
	scrollSleep : 50,
	scrollDelay : 50,
	scrollNow : 0,
	scrollTimer : null,
	scrollPos : {},
	initScroll : function(obj) {
		var D = Durian.initCommon;
		if (!D.scrollList.has(obj)) {
			D.scrollList.push(obj);

			obj.gap = parseInt(Element.getStyle(obj, 'top'), 10) || 0;
		}

		if (!D.scrollInit) {
			$l(window, 'scroll', D.onScroll);
		}
	},
	onScroll : function(evt, obj) {
		var D = Durian.initCommon;
		D.scrollNow = 0;
		if (D.scrollTimer) {
			clearTimeout(D.scrollTimer);
		}
		D.scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
		D.scrollTimer = setTimeout(D.scrollPlay, D.scrollSleep);
	},
	scrollPlay : function() {
		var D = Durian.initCommon;
		D.scrollNow++;
		var flag = false;
		for (var i=0; i<D.scrollList.length; i++) {
			var obj = D.scrollList[i];
			var top = parseInt(obj.style.top, 10) || 0;
			var gap = D.scrollTop + obj.gap - top;
			if (Math.abs(gap) > 1) {
				obj.style.top = (top + parseInt(gap/2, 10)) + 'px';
				flag = true;
				if (typeof Wizard != 'undefined' && obj.observer) {
					Wizard.hideObserver(obj.getAttribute('module'));
				}
			} else {
				obj.style.top = (top + gap) + 'px';
				if (typeof Wizard != 'undefined' && obj.observer) {
					Wizard.refreshObserver(obj.getAttribute('module'));
				}
			}
		}
		if (flag) {
			D.scrollTimer = setTimeout(D.scrollPlay, D.scrollDelay);
		}
	},

	onPopViewBBS : function(evt, obj) {
		Event.stop(evt);

		var url = obj.href;
		var match = url.match(/&bbs_code=([^&]+)/);
		var bbs_code = (typeof match[1] != 'undefined') ? match[1] : 'bbs_dummy';
		Durian.openWin(bbs_code, url, 700, 500, 'yes');
	}
}

/***************************************************************************************
* module function
***************************************************************************************/

// for board
Durian.modBoard = {

	alert : function(type) {

		var txt = '';

		switch(type) {
			case 1:
				txt = i18n('lang.durian.common.this_thread_is_secret:해당게시물은 비밀글입니다.');
				break;
		}

		Durian.alert(txt);
	},

	imgReSize : function(obj, resizeW, resizeH) {

		jQuery(document).ready(function(){

			jQuery(obj).each(function() {

				var width	= jQuery(this).width();
				var height= jQuery(this).height();
				var ratio = Math.min(resizeW/width, resizeH/height);

				if( width > resizeW || height > resizeH) {
					jQuery(this).width(width * ratio);
				}

				jQuery(this).show();

			});
		});

	}
}


/***************************************************************************************
* JSON fucntion
***************************************************************************************/

Durian.Json = {
	encode: function(jsonObject) {
		if (jsonObject.constructor.toString().indexOf('Array') > 0) {
				var a = ['['], b, i, l = jsonObject.length, v;
				for (i = 0; i < l; i += 1) {
					v = jsonObject[i];
					switch (typeof v) {
					case 'undefined':
					case 'function':
					case 'unknown':
						break;
					default:
						if (b) {
							a.push(',');
						}
						a.push(v === null ? "null" : Durian.Json.encode(v));
						b = true;
					}
				}
				a.push(']');
				return a.join('');
			} else if (jsonObject.constructor.toString().indexOf('Boolean') > 0) {
				return String(jsonObject);
			} else if (jsonObject.constructor.toString().indexOf('Date') > 0) {
				function f(n) {
					return n < 10 ? '0' + n : n;
				}
				return '"' + jsonObject.getFullYear() + '-' +
						f(jsonObject.getMonth() + 1) + '-' +
						f(jsonObject.getDate()) + 'T' +
						f(jsonObject.getHours()) + ':' +
						f(jsonObject.getMinutes()) + ':' +
						f(jsonObject.getSeconds()) + '"';
			} else if (jsonObject.constructor.toString().indexOf('Number') > 0) {
					return isFinite(jsonObject) ? String(jsonObject) : "null";
			} else if (jsonObject.constructor.toString().indexOf('Object') > 0) {
				var a = ['{'], b, i, v;
				for (i in jsonObject) {
					if (jsonObject.hasOwnProperty(i)) {
						v = jsonObject[i];
						switch (typeof v) {
						case 'undefined':
						case 'function':
						case 'unknown':
							break;
						default:
							if (b) {
								a.push(',');
							}
							a.push(Durian.Json.encode(i), ':',
									v === null ? "null" : Durian.Json.encode(v));
							b = true;
						}
					}
				}
				a.push('}');
				return a.join('');
			} else if (jsonObject.constructor.toString().indexOf('String') > 0) {
				var m = {
					'\b': '\\b',
					'\t': '\\t',
					'\n': '\\n',
					'\f': '\\f',
					'\r': '\\r',
					'"' : '\\"',
					'\\': '\\\\'
				};
				if (/["\\\x00-\x1f]/.test(jsonObject)) {
					return '"' + jsonObject.replace(/([\x00-\x1f\\"])/g, function(a, b) {
						var c = m[b];
						if (c) {
							return c;
						}
						c = b.charCodeAt();
						return '\\u00' +
							Math.floor(c / 16).toString(16) +
							(c % 16).toString(16);
					}) + '"';
				}
				return '"' + jsonObject + '"';
			} else {
				return null;
			}
	},

	decode: function(jsonString) {
		try {
			if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(jsonString)) {
				return eval('(' + jsonString + ')');
			}
		} catch (e) {
			throw new SyntaxError("parseJSON");
		}
	}
}

/***************************************************************************************
* importFile fucntion
***************************************************************************************/
Durian.importFile = {

	js : function(src) {
		if('function' == typeof jQuery){
			if(jQuery('head').size() > 0){
				jQuery('head').eq(0).append('<script type="text/javascript" src="'+src+'"></script>');
			}else{
				document.write('<script type="text/javascript" src="'+src+'"></script>');
			}

		}else{
			document.write('<script type="text/javascript" src="'+src+'"></script>');

		}
	},

	css : function(src) {

		if('function' == typeof jQuery){
			if(jQuery('head').size() > 0){
				jQuery('head').eq(0).append(jQuery('<link href="'+src+'" type="text/css" rel="stylesheet" />'));
			}else{
				document.write('<link href="'+src+'" type="text/css" rel="stylesheet" />');
			}

		}else{
			document.write('<link href="'+src+'" type="text/css" rel="stylesheet" />');

		}
	}
}

/***************************************************************************************
* normal function
***************************************************************************************/

// for flash wizard
function flashInfo(id, w, h)
{
	var area = $id(id + '_area');
	if (area) {
		if (id == 'L_CATEGORY_flash' && area.getAttribute('design_type') == '03') {
			Element.setSize(area, w, h);
		} else {
			if (area.getAttribute('inited') != '1') {
				Element.setSize(area, w, h);
				area.setAttribute('inited', '1');
			}
		}
	}

	var box = $id(id + '_box');
	if (box) {
		Element.setSize(box, w, h);
	}

	if (Util.isIE) {
		Element.setSize(id, w, h);
	} else {
		Element.setSize(id + '_embed', w, h);
	}
}

/***************************************************************************************
* load event
***************************************************************************************/
$l(window, 'load', Durian.initCommon.init);
/***************************************************************************************/

/***************************************************************************************
* module js Import
***************************************************************************************/
Durian.importFile.js('/common/js/module/mod.gallery.js');
Durian.importFile.js('/common/js/module/mod.smscounsel.js');
/***************************************************************************************/

mod.gallery.widgetResizeLoad = function(a, b, c) {
	jQuery(document).ready(function() {
		jQuery(a).each(function() {
			var src = jQuery(this).attr('src');
			jQuery(this).load(function() {
				mod.gallery.reSize(this, b, c);
				jQuery(this).show()
			}).attr('src',src);
		})
	})
}


