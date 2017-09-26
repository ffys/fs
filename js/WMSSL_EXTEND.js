WMSSL.extend = {
	
	// show loading bar
	loading:function() {

		if(typeof SSL_LOADING != 'undefined' && SSL_LOADING === false) {
			return false;
		}

		var cssText		= "";
		var cssObj		= document.createElement('style');	
		var viewObj		= document.createElement('div');
		var headObj		= document.getElementsByTagName('head')[0];   
		var bodyObj		= document.getElementsByTagName('body')[0];   
		var limitTime = 30;
		var loadingTimer;

		if( $q('#divWMSSLLoading') ) {
			return false;
		}

		var timeCheck = function() {		

			if(limitTime > 0 ) {				
				$q('#divWMSSLLoading #divWMSSLLoadingTxtSec').innerHTML = limitTime;
				limitTime--;			
			} else {	
				loadingClose();
			}
		}
		
		var loadingClose = function() {		
			clearTimeout(loadingTimer);
			Element.hide($q('#divWMSSLLoading'));
		}

		cssText+='#divWMSSLLoading{position:fixed;';
		cssText+='_position:absolute;';
		cssText+='z-index:1000;';
		cssText+='width:100%;';
		cssText+='text-align:center;';
		cssText+='bottom:0px;';
		cssText+='right:0px;';

		// OPTION
		cssText+='background-color:silver;width:133px;height:90px;background-color: ;padding:5px;';

		if(typeof document.compatMode!='undefined'&&document.compatMode!='BackCompat'){
			cssText+="_top:expression(document.documentElement.scrollTop+document.documentElement.clientHeight-this.clientHeight);_left:expression(document.documentElement.scrollLeft + document.documentElement.clientWidth - offsetWidth);}";
		}else{
			cssText+="_top:expression(document.body.scrollTop+document.body.clientHeight-this.clientHeight);_left:expression(document.body.scrollLeft + document.body.clientWidth - offsetWidth);}";
		}

		viewObj.innerHTML = ""
		+"<div id='divWMSSLLoading'>"
		+"<div style='width:133px; height:90px;background-color: #FFFFFF;'>"
		+"<div class='img-loader' style='padding: 0; text-align: center;'><img alt='암호화모듈 작동 중....' src='/ssl/library/js/images/indicator.gif'></div>"
		+"</div>"
		+"</div>";
		
		cssObj.setAttribute("type", "text/css");   

		if(cssObj.styleSheet){
			cssObj.styleSheet.cssText = cssText;   
		} else {
			cssObj.appendChild(document.createTextNode(cssText));   
		}   
		
		headObj.appendChild(cssObj);
		bodyObj.appendChild(viewObj);

		$l($q('#divWMSSLLoading'), 'click', function() {
			loadingClose();
		});

		//loadingTimer = setInterval(timeCheck, 1000);
	}

};