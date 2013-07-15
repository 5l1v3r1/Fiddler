$(function(){"use strict";function e(e){var t=$("#filterMenu li.disabled a").data("type");e.display=t==e.type||t==""?"":"display:none",e.err=e.statusCode>=400?"err":"",e.img=n(e.type),e.lowerMethod=e.method.toLowerCase(),e.shortPath=Fiddler.truncate(e.path,50),e.humanSize=Fiddler.getHumanSize(e.size)||"-";var r=Fiddler.tmpl($("#requestItemTpl").html(),e).trim();return r}function t(e){var t=e.patternType+": "+e.pattern,n=e.replaceType+": "+e.replace,r=$("#ruleItemTpl").html().trim();return r=Fiddler.tmpl(r,{pattern:t,replace:n,checked:e.enable?"checked":""}),r}function n(e){var t={image:"img.png",script:"js.png",stylesheet:"css.png",main_frame:"html.png",sub_frame:"html.png",xmlhttprequest:"xhr.png"},n=t[e]||"blank.png";return"../img/icon/"+n}function r(){var t=$("#requestList table tbody");Fiddler_Resource.on("onCompleted",function(n){var r=n.data,i=e(r);i&&($(i).appendTo(t),$("#requestList")[0].scrollTop=1e6)})}function i(){var e=null,t="headers",n={headers:function(e){var t=Fiddler_Resource.getItem(e),n=Fiddler.queryUrl(t.url),r=!1;for(var i in n)r=!0,n[i]&&n[i].join&&(n[i]="["+n[i].join(", ")+"]");r&&(t.queryUrl=n);var s=Fiddler.tmpl($("#headersTpl").html(),t);$("#tab-headers").html(s)},preview:function(e){var t=Fiddler_Resource.getItem(e),n=t.type;n=="image"?Fiddler_Resource.getSize(e).then(function(e){Fiddler_Resource.getImgRect(t.url).then(function(n){var r=t.url.match(/([^\/\?\#]+)(?:[\?\#].*)?$/)[1],i=Fiddler.tmpl($("#imagePreviewTpl").html(),{url:t.url,filename:r,width:n.width,height:n.height,filesize:Fiddler.getHumanSize(e),display_url:Fiddler.truncateCenter(t.url,30)});$("#tab-preview").html(i)})}):n=="script"?Fiddler_Resource.getContent(e).then(function(e){e=e||"";var t='<div class="content"> <pre class="brush: js;gutter: false">'+Fiddler.encode4Html(e)+"</pre> </div>";$("#tab-preview").html(t),SyntaxHighlighter.highlight()}):n=="stylesheet"&&Fiddler_Resource.getContent(e).then(function(e){e=e||"";var t='<div class="content"> <pre class="brush: css;gutter: false">'+Fiddler.encode4Html(e)+"</pre> </div>";$("#tab-preview").html(t),SyntaxHighlighter.highlight()})},response:function(e){var t=Fiddler_Resource.getItem(e),n=t.method;if(n=="POST")return $("#tab-response").html("can't show POST request response"),!0;Fiddler_Resource.getContent(e).then(function(e){e=e||"",e=Fiddler.encode4Html(e),$("#tab-response").html(e)})},beautify:function(e){var t=Fiddler_Resource.getItem(e),n=t.type;n=="script"?Fiddler_Resource.getContent(e).then(function(e){e=e||"",e=Fiddler.encode4Html(js_beautify(e));var t='<div class="content" style="padding-left:0"> <pre class="brush: js">'+e+"</pre> </div>";$("#tab-beautify").html(t),SyntaxHighlighter.highlight()}):n=="stylesheet"&&Fiddler_Resource.getContent(e).then(function(e){e=e||"",e=Fiddler.encode4Html(css_beautify(e));var t='<div class="content" style="padding-left:0"> <pre class="brush: css">'+e+"</pre> </div>";$("#tab-beautify").html(t),SyntaxHighlighter.highlight()})}},r={image:["headers","preview"],script:["headers","preview","response","beautify"],stylesheet:["headers","preview","response","beautify"],main_frame:["headers","response"],sub_frame:["headers","response"],xmlhttprequest:["headers","response"]};Fiddler.bindEvent($("#requestList"),{"tbody tr td.url":function(){var i=$(this).parents("tr");$("#autoResponseList").removeClass("open"),e&&e.removeClass("info"),i.addClass("info"),e=i;var s=$("#requestDetail");s.hasClass("open")||s.addClass("open"),s.find(".nav-tabs li").removeClass("active").hide(),s.find('.nav-tabs li[data-type="'+t+'"]').addClass("active").show(),$("#tab-headers,#tab-preview,#tab-response,#tab-beautify").removeClass("active").html("");var o=e.attr("data-id"),u=Fiddler_Resource.getItem(o),a=r[u.type]||[];a.forEach(function(e){s.find('.nav-tabs li[data-type="'+e+'"]').show()});var f=$("#tab-"+t).addClass("active").show();f.html()||n[t]&&n[t](o)},"tbody tr a":function(e){e.stopPropagation()},"tbody tr td img.type":function(){$("#autoResponseList").addClass("open"),$("#autoResponseList button.btn-add").trigger("click");var e=$(this).parents("tr").attr("data-id"),t=Fiddler_Resource.getItem(e),n=t.url;$("#rulePattern").val(n)}}),Fiddler.bindEvent($("#requestDetail"),{"i.icon-remove":function(){e&&e.removeClass("info"),$("#tab-headers,#tab-preview,#tab-response,#tab-beautify").html(""),$("#requestDetail").removeClass("open")},".nav-tabs li a":function(t){t.preventDefault();var r=$(this).parents("li");if(r.hasClass("active"))return!0;$("#requestDetail .nav-tabs li.active").removeClass("active"),r.addClass("active"),$("#requestDetail .tab-content .active").removeClass("active").hide();var i=r.attr("data-type"),s=$("#tab-"+i).addClass("active").show();s.html()||n[i]&&n[i](e.attr("data-id"))}})}function o(){Fiddler.bindEvent($("#autoResponseList"),{".rule-edit-item a.btn-select":function(e){e.preventDefault();if($(this).hasClass("disabled"))return!1;var t=$(this).parents(".rule-edit-item").find(".dropdown-menu"),n=t.css("display")=="none";n?t.slideDown():t.slideUp()},"#patternMenu li a":function(e){e.preventDefault();var t=$(this).attr("data-type"),n=s[t]||[],r=$("#replaceMenu li a");r.show(),n.forEach(function(e){$('#replaceMenu li a[data-type="'+e+'"]').hide()}),r.each(function(){var e=$(this);e.css("display")!="none"&&$("#ruleReplaceType").val(e.html())})},".dropdown-menu li a":function(e){e.preventDefault();var t=$(this).html().trim(),n=$(this).parents(".rule-edit-item");n.find("input.rule-input").val(t),n.find(".dropdown-menu").slideUp();var r=$(this).data("value");n.find("input.rule-value").val(r)},"button.btn-add":function(){if($(this).hasClass("disabled"))return!1;$("#autoResponseList .rule-list tbody tr").removeClass("info"),a(!0),$("#autoResponseList .rule-pattern").val("StringToMatch[6]").select(),$("#autoResponseList .rule-replace").val(""),$("#rulePatternType").val("String"),$("#ruleReplaceType").val("File")},".btn-save":function(){if($(this).hasClass("disabled"))return!1;var e={patternType:$("#rulePatternType").val().trim(),pattern:$("#rulePattern").val().trim(),replaceType:$("#ruleReplaceType").val().trim(),replace:$("#ruleReplace").val().trim(),enable:!0};if(!e.pattern)return $("#rulePattern").focus();if(!e.replace&&e.replaceType!="Cancel")return $("#ruleReplace").focus();var n=$("#autoResponseList .rule-list tbody tr.info");if(n.length)n.find("p.pattern").html(e.patternType+": "+e.pattern),n.find("p.replace").html(e.replaceType+": "+e.replace),n.attr("data-info",JSON.stringify(e));else{var r=$(t(e));r.attr("data-info",JSON.stringify(e)),r.appendTo($("#autoResponseList .rule-list tbody"))}$("#rulePattern").val(""),$("#ruleReplace").val(""),l()},".rule-check":function(){l()},".icon-edit":function(e){e.preventDefault();if($(this).hasClass("disabled"))return!1;var t=$(this).parents("tr");$("#autoResponseList .rule-list tbody tr").removeClass("info"),t.addClass("info");var n=JSON.parse(t.attr("data-info"));$("#rulePatternType").val(n.patternType),$("#rulePattern").val(n.pattern),$("#ruleReplaceType").val(n.replaceType),$("#ruleReplace").val(n.replace)},".icon-remove":function(e){if($(this).hasClass("disabled"))return!1;var t=$(this).parents("tr");t.remove(),l()},"#ruleReplace":function(){if($(this).hasClass("disabled"))return!1;var e=$("#ruleReplaceType").val();if(e!="File"&&e!="Path")return!0;var t=h(e);t&&t!="/"&&(t="file://"+t,$(this).val(t))}}),$(document.body).click(function(e){var t=e.target;$("#replaceMenu,#patternMenu").each(function(){var e=$(this).parents(".rule-edit-item");if($.contains(e[0],t))return!0;$(this).slideUp()})}),$("#autoResponseBtn").click(function(){$("#autoResponseList").toggleClass("open")}),$("#enableAutoResponse").click(function(){var e=!!this.checked;Fiddler_Config.setConfig("enable_auto_response",e),a(e),f(e),$("#autoResponseList button.btn-add")[e?"removeClass":"addClass"]("disabled"),l()})}function a(e){var t=$("#autoResponseList .rule-edit"),n=t.find(".rule-input,.rule-value"),r=t.find(".btn-select"),i=t.find(".btn-save");r[e?"removeClass":"addClass"]("disabled"),i[e?"removeClass":"addClass"]("disabled"),n.each(function(){this.disabled=!e})}function f(e){var t=$("#autoResponseList .rule-list tbody tr");t[e?"removeClass":"addClass"]("disabled"),t.each(function(){$(this).find("input.rule-check")[0].disabled=!e,$(this).find("i.icon").each(function(){$(this)[e?"removeClass":"addClass"]("disabled")})})}function l(){var e=[];$("#autoResponseList .rule-list tbody tr").each(function(){var t=JSON.parse($(this).attr("data-info")||"{}"),n=$(this).find(".rule-check")[0].checked;t.enable=n,e.push(t)});var t=$("#enableAutoResponse")[0].checked;Fiddler_Rule.saveRules(e,t);var n=$("#disabledCacheInput")[0].checked;n&&Fiddler_Rule.disableCacheRule()}function c(){Fiddler_Config.init();var e=Fiddler_Config.getRules(),n=$("#autoResponseList .rule-list tbody");e.forEach(function(e){var r=$(t(e));r.attr("data-info",JSON.stringify(e)),r.appendTo(n)});var r=Fiddler_Config.getConfig("disable_cache");r&&($("#disabledCacheInput")[0].checked=!0);var i=Fiddler_Config.getConfig("enable_auto_response");i?l():($("#enableAutoResponse")[0].checked=!1,$("#enableAutoResponse").trigger("click"),$("#enableAutoResponse").trigger("click"))}function h(e){try{var t=document.getElementById("chromefiddler"),n=t.OpenFileDialog("/",e.toLowerCase());return n}catch(r){return""}}function p(){$("#requestList tbody").html(""),$("#requestDetail").removeClass("open"),Fiddler_Resource.clearResource()}function d(){Fiddler.bindEvent($("#toolsMenu"),{"a.clear":function(e){e.preventDefault(),p()},"input.disable-cache":function(e){var t=this.checked;Fiddler_Config.setConfig("disable_cache",t),l()}})}function v(){Fiddler.bindEvent($("#filterMenu"),{"li a":function(e){e.preventDefault();var t=$(this).data("type"),n=$(this).html();$("#filterMenuTitle span").html("Filter ( "+n+" )"),$("#filterMenu li").removeClass("disabled");var r=$(this).parents("li");r.addClass("disabled");var i=$("#requestList tbody tr");t==""?i.show():i.each(function(){var e=$(this),n=e.data("type");t==n?e.show():e.hide()})}})}function m(e){var t=e.data;alert("Fiddler: read file `"+t+"` data error, please check")}function g(){Fiddler_Rule.resouceListening(),Fiddler_Rule.fileErrorListening(m),Fiddler_Event.init(),r(),i(),o(),c(),v(),d()}var s={string:[],regexp:["path"],method:["path"],header:["file","path","redirect"]},u={"firefox-windows":"","firefox-mac":"","chrome-windows":"","chrome-mac":"","chrome-mobile":"","chrome-tablet":"","iphone-ios5":"","ipad-ios5":"",ie10:"",ie9:"",ie8:"",ie7:"",ie6:""};g()})