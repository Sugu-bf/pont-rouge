/*!*
 **                 _     _                         
 ** __      ___ __ | |   (_)_ __   __ _ _   _  __ _ 
 ** \ \ /\ / / '_ \| |   | | '_ \ / _` | | | |/ _` |
 **  \ V  V /| |_) | |___| | | | | (_| | |_| | (_| |
 **   \_/\_/ | .__/|_____|_|_| |_|\__, |\__,_|\__,_|
 **          |_|                  |___/             
 **
 **        -- wpLingua | WordPress plugin --
 **   Translate and make your website multilingual
 **
 **     https://github.com/julien-jacob/wplingua
 **      https://wordpress.org/plugins/wplingua/
 **              https://wplingua.com/
 **
 **/
jQuery(document).ready(function(e){e("[wplng-help-box], [wplng-help-box-right]").click(function(){let t=e(this).attr("wplng-help-box");null==t&&(t=e(this).attr("wplng-help-box-right")),e(t).slideToggle(),"1"==e(this).attr("wplng-help-box-open")?(e(this).attr("wplng-help-box-open","0"),e(this).attr("style","")):(e(this).attr("wplng-help-box-open","1"),e(this).css("color","#69a8bb"),e(this).css("opacity","1"))});let l=[38,38,40,40,37,39,37,39,66,65],n=0;e(document).keydown(function(t){t.keyCode===l[n++]?n===l.length&&(n=0,e(".wplng-beta-hidden").toggle()):n=0})});//# sourceMappingURL=option-page.js.map
