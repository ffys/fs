// Tab Content
var initVisualTabMenu = function (targetID) {

    var baseObj = jQuery('#' + targetID);

    var tabObj = jQuery('#btn_list', baseObj);
    var vsObj = jQuery('#img_tab', baseObj);
    var objTimer = null;
    var curID = null;
    var changeTime = 3;		// 배너변경 시간(초)
    var fadeVal = 1200; // 패이드값 설정

    jQuery('p', tabObj).each(function () {
        jQuery(this).click(function () {
            clearTimeout(objTimer);
            tabMenuClick(this);
        }).css('cursor', 'pointer');
    });

    jQuery(tabObj).css('z-index', 9500);

    var tabMenuClick = function (obj) {
        var targetID = jQuery(obj).attr('link');
        var oldVisualObj = jQuery('#' + curID, vsObj);
        var curVisualObj = jQuery('#' + targetID, vsObj);

        if (targetID == curID) {
            return false;
        }

        jQuery('p img', tabObj).each(function () {
            jQuery(this).attr('src', jQuery(this).attr('src').replace("_on.png", ".png"));
        });

        jQuery('img', obj).attr('src', jQuery('img', obj).attr('src').replace(".png", "_on.png"));
        jQuery('p', vsObj).css('z-index', 9000).hide();
        jQuery(oldVisualObj).show().css('z-index', 9100);
        jQuery(curVisualObj).hide().css('z-index', 9200).fadeIn(fadeVal);
        curID = targetID;
    };

    tabMenuClick(jQuery('p:first', tabObj));

    objTimer = setInterval(function () {
        var targetObj = null;

        if (jQuery('p[link=' + curID + ']', tabObj).next().size()) {
            targetObj = jQuery('p[link=' + curID + ']', tabObj).next();
        } else {
            targetObj = jQuery('p:first', tabObj);
        }

        tabMenuClick(targetObj);
    }, (1000 * changeTime));

};


var _varCurrentAct = 'info.page/greeting/';

jQuery(document).ready(function(){
    jQuery('#navi .navi_main .navi_main_obj').each(function(){
        if(!jQuery(this).attr('orgsrc')) {
            jQuery(this).attr('orgsrc', jQuery(this).attr('src'));
        }

        jQuery(this).hover(function(){
            _fcNaviControl(jQuery(this).attr('subcode'));
        });
    });

    var curSubCode = _fcNaviControlMap[_varCurrentAct];

    if( curSubCode ) {
        _fcNaviControl(curSubCode);
    }
});

/**************************************************
 *
 * # 상단메뉴 매칭 정보(URL 매개변수 사용)
 *
 * 구성: 'act / pcode / bbs_code':'subcode 번호'
 *
 **************************************************/
var _fcNaviControlMap = {
    'info.page/greeting/'	                                    : '',
    'info.page/sub0102/'	                                    : '',
    'info.page/map/'	                                    : '',
    'info.page/curriculum/'	                                        : '',
    'info.page/teacher/'                                        : '',
    'board//webzine'		                                        : '',
    'board//notice'		                                        : '',
    'board//faq'		                                        : '',
    'mypage.my_qna/list/'                                        : ''
};

var _fcNaviControl = function(selCode) {

    if(!selCode) return;

    jQuery('#navi .navi_main .navi_main_obj').each(function(){
        jQuery('#navi .navi_sub_'+jQuery(this).attr('subcode')).hide();
        jQuery(this).attr('src', jQuery(this).attr('orgsrc'));

    });

    jQuery('#navi .navi_main .navi_main_obj[subcode='+selCode+']').attr('src', jQuery('#navi .navi_main .navi_main_obj[subcode='+selCode+']').attr('oversrc'));
    jQuery('#navi .navi_sub_'+selCode).show();

};