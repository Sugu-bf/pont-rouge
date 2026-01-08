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
jQuery(document).ready(function(l){function t(){let a=l(window).height()/2;l(".wplng-switcher.style-dropdown").each(function(t){var n,e;l(this).offset().top-l(window).scrollTop()<a?l(this).hasClass("open-bottom")||(l(this).addClass("open-bottom"),l(this).removeClass("open-top"),e=l(".wplng-languages",this).prop("outerHTML"),n=l(".wplng-language-current",this).prop("outerHTML"),l(".switcher-content",this).html(n+e)):l(this).hasClass("open-top")||(l(this).addClass("open-top"),l(this).removeClass("open-bottom"),n=l(".wplng-languages",this).prop("outerHTML"),e=l(".wplng-language-current",this).prop("outerHTML"),l(".switcher-content",this).html(n+e))})}if(l("a[data-wplng-flag][data-wplng-alt]").each(function(){var t="",t=(t=(t=(t+="<img")+(' src="'+l(this).attr("data-wplng-flag")+'" '))+(' alt="'+l(this).attr("data-wplng-alt")+'" '))+' class="wplng-menu-flag"'+"> ";l(this).html(t+l(this).html()),l(this).removeAttr("data-wplng-flag"),l(this).removeAttr("data-wplng-alt")}),l(window).scroll(function(){t()}),l("#wplng_style").on("input",function(){t()}),t(),l("a[data-wplng-lang-id]").on("click",function(t){var n,e=l(this).attr("onclick");e&&"event.preventDefault();"===e.trim()||(e=l(this).data("wplng-lang-id"),(n=new Date).setFullYear(n.getFullYear()+1),document.cookie="wplingua-lang="+e+"; expires="+n.toUTCString()+"; path=/")}),l("#wplng-in-progress-container").length){var e=l("#wplng-in-progress-container").attr("data-wplng-url-load");let n=l("#wplng-in-progress-container").attr("data-wplng-url-reload");e&&""!==e.trim()?l.ajax({url:e,method:"GET",success:function(t){n&&""!==n.trim()?(-1===n.indexOf("?wplng-load=")&&-1===n.indexOf("&wplng-load=")&&(l("#wplng-in-progress-percent").html("100"),l("#wplng-progress-bar-value").animate({width:"100%"},500)),window.location.href=n):console.log("wpLingua ERROR: Load in progress - Invalid reload URL")}}):console.log("wpLingua ERROR: Load in progress - Invalid load URL")}function n(){var t=parseInt(l("#wplng-in-progress-percent").html());t<99&&(t++,l("#wplng-in-progress-percent").html(t),l("#wplng-progress-bar-value").animate({width:t.toString()+"%"},500))}n(),l("#wplng-in-progress-percent").length&&setInterval(n,2e3),l("#wpadminbar").length&&l("#wplng-in-progress-container").length&&l("#wpadminbar").hide(),l("#wplng-overloaded-close").on("click",function(){l("#wplng-overloaded-container").hide()})});//# sourceMappingURL=front.js.map
