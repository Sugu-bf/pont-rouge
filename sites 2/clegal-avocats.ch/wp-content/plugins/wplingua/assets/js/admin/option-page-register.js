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
jQuery(document).ready(function(t){var e;if((e=new Date).setTime(e.getTime()+2592e6),document.cookie="wplingua=1;expires="+e.toUTCString()+";path=/",t("#wplng-language-website").length){let a="<option disabled selected value></option>";function l(){var e=t("#wplng-language-website").val();t("#wplng-language-target option").attr("disabled",!1),t("#wplng-language-target option[value="+e+"]").attr("disabled",!0),t("#wplng-language-website").val()==e&&(t("#wplng-language-target option").attr("selected",!1),t("#wplng-language-target option[value!="+e+"]").first().attr("selected",!0))}wplngAllLanguages.forEach(e=>{a+='<option value="'+e.id+'">'+e.name+"</option>"}),t("#wplng-language-website").html(a),t("#wplng-language-target").html(a),t("#wplng-language-website option[value="+t("#wplng-website-locale").text()+"]").attr("selected",!0),l(),t("#wplng-language-website").on("input",function(e){l()}),t("#wplng-get-free-api-submit").on("click",function(e){var a;t("#wplng-website-url, #wplng-email, #wplng-language-website, #wplng-language-target, #wplng-accept-eula").attr("required",!0),a={request:"register",mail_address:t("#wplng-email").val(),website:t("#wplng-website-url").val(),language_original:t("#wplng-language-website").val(),languages_target:t("#wplng-language-target").val(),accept_eula:t("#wplng-accept-eula").is(":checked")},t("#wplng_request_free_key").val(JSON.stringify(a))}),t("a[href*='#wplng-']:not([href='#'])").click(function(){var e;location.hostname==this.hostname&&this.pathname.replace(/^\//,"")==location.pathname.replace(/^\//,"")&&(e=(e=t(this.hash)).length?e:t("[name="+this.hash.slice(1)+"]")).length&&t("html, body").animate({scrollTop:e.offset().top-50},1e3)})}});//# sourceMappingURL=option-page-register.js.map
