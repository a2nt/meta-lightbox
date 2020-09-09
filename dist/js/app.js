/*! For license information please see app.js.LICENSE.txt */
!function(t){var e={};function a(o){if(e[o])return e[o].exports;var n=e[o]={i:o,l:!1,exports:{}};return t[o].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=e,a.d=function(t,e,o){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(a.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)a.d(o,n,function(e){return t[e]}.bind(null,n));return o},a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/mnt/data/srv/dist/repositories/meta-lightbox/dist",a(a.s="./src/js/app.js")}({"./src/js/_events.js":function(t,e){t.exports={AJAX:"ajax-load",AJAXMAIN:"ajax-main-load",MAININIT:"main-init",TABHIDDEN:"tab-hidden",TABFOCUSED:"tab-focused",OFFLINE:"offline",ONLINE:"online",LOADED:"load",SWIPELEFT:"swipeleft panleft",SWIPERIGHT:"swiperight panright",ALLERTAPPEARED:"alert-appeared",ALERTREMOVED:"alert-removed",LODEDANDREADY:"load-ready",LAZYIMAGEREADY:"image-lazy-bg-loaded",LAZYIMAGESREADY:"images-lazy-loaded",MAPLOADED:"map-loaded",MAPAPILOADED:"map-api-loaded",MAPMARKERCLICK:"map-marker-click",MAPPOPUPCLOSE:"map-popup-close",SCROLL:"scroll",RESIZE:"resize",CAROUSEL_READY:"bs.carousel.ready",SET_TARGET_UPDATE:"set-target-update",RESTORE_FIELD:"restore-field",FORM_INIT_BASICS:"form-basics",FORM_INIT_STEPPED:"form-init-stepped",FORM_INIT_VALIDATE:"form-init-validate",FORM_INIT_VALIDATE_FIELD:"form-init-validate-field",FORM_INIT_STORAGE:"form-init-storage",FORM_VALIDATION_FAILED:"form-validation-failed",FORM_STEPPED_NEW_STEP:"form-new-step",FORM_STEPPED_FIRST_STEP:"form-first-step",FORM_STEPPED_LAST_STEP:"form-last-step",FORM_FIELDS:"input,textarea,select"}},"./src/js/app.js":function(t,e,a){"use strict";a.r(e);a("./src/scss/app.scss");var o=a("jquery"),n=a.n(o),i=a("./src/js/_events.js"),r=a.n(i);function c(t){return(c="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function l(t,e){for(var a=0;a<e.length;a++){var o=e[a];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}var s,d,f,u,p,h,m,g;s=n.a,d=window,f=s(d),u=document,p=s("body"),h="MetaLightboxUI",m='<div class="meta-lightbox-error"><div class="alert alert-error alert-danger">Connection failure.</div></div>',g=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,a,o;return e=t,o=[{key:"init",value:function(){console.log("".concat(h,": init ..."));var t=this;t.isMSIE=0;try{t.isHidpi=t.is_hdpi()}catch(e){console.log("".concat(h,": catch"))}s(".js".concat(h,',[data-toggle="lightbox"],[data-lightbox-gallery]')).on("click",(function(e){e.preventDefault(),e.stopPropagation();var a=s(e.currentTarget);t.show(a)}))}},{key:"is_hdpi",value:function(){return console.log("".concat(h,": isHidpi")),d.devicePixelRatio>1||d.matchMedia&&d.matchMedia("(-webkit-min-device-pixel-ratio: 1.5),          (min--moz-device-pixel-ratio: 1.5),          (-o-min-device-pixel-ratio: 3/2),          (min-resolution: 1.5dppx)").matches}},{key:"show",value:function(t){console.log("".concat(h,": show"));var e=this;if(e.constructLightbox()){var a=e.$content;if(a){if(p.addClass("meta-lightbox-body-effect-fade"),e.process(a,t),t.data("lightbox-gallery")){var o=s('[data-lightbox-gallery="'.concat(t.data("lightbox-gallery"),'"]'));1===o.length?s(".meta-lightbox-nav").hide():s(".meta-lightbox-nav").show(),s(".meta-lightbox-prev").off("click").on("click",(function(a){a.preventDefault();var n=o.index(t),i=o.eq(n-1);i.length||(i=o.last()),setTimeout((function(){e.show(i)}),10)})),s(".meta-lightbox-next").off("click").on("click",(function(a){a.preventDefault();var n=o.index(t),i=o.eq(n+1);i.length||(i=o.first()),setTimeout((function(){e.show(i)}),10)}))}setTimeout((function(){e.$overlay.addClass("meta-lightbox-open")}),1)}}}},{key:"constructLightbox",value:function(){console.log("".concat(h,": constructLightbox"));var t=this,e=s("<div>",{class:"meta-lightbox-overlay meta-lightbox-theme-default meta-lightbox-effect-fade"}),a=s("<div>",{class:"meta-lightbox-wrap"}),o=s("<div>",{class:"meta-lightbox-content"}),n=s('<a href="#" class="meta-lightbox-nav meta-lightbox-prev"><i class="fas fa fa-chevron-left"></i> <span class="sr-only">Previous</span></a><a href="#" class="meta-lightbox-nav meta-lightbox-next"><i class="fa fas fa-chevron-right"></i> <span class="sr-only">Next</span></a>'),i=s('<a href="#" class="meta-lightbox-close fas fa fa-times" title="Close"><span class="sr-only">Close</span></a>'),r=s("<div>",{class:"meta-lightbox-title-wrap"});return t.$overlay||(t.isMSIE&&e.addClass("meta-lightbox-ie"),a.append(o),a.append(r),e.append(a),e.append(n),e.append(i),p.append(e),e.on("click",(function(e){e.preventDefault(),t.hide()})),i.on("click",(function(e){e.preventDefault(),t.hide()})),t.$overlay=e,t.$content=o,t.$title=r),t.$overlay}},{key:"setTitle",value:function(t){this.$title.html(t)}},{key:"process",value:function(t,e){console.log("".concat(h,": process"));var a=this,o=e.attr("href").length?e.attr("href"):e.data("href");a.$content.attr("class","meta-lightbox-content"),a.$content.addClass(e.data("lightbox-class")),o.length||(console.log(e),console.error("".concat(h,": href(attr/data) is missing")));var n=s("#PageLoading .loading-spinner"),i=n.length?n.clone():"";if(a.$content.append(i).addClass("meta-lightbox-loading"),o.match(/\.(jpeg|jpg|gif|png|svg)$/i)){s.ajax({url:o,success:function(){var e=s("<img>",{src:o}),n=s('<div class="meta-lightbox-image"></div>'),i=s('<span class="meta-lightbox-zoom-wrapper"></span>');i.append(e),n.append(i),n.css({"line-height":"".concat(t.height(),"px"),height:"".concat(t.height(),"px")}),f.resize((function(){n.css({"line-height":"".concat(t.height(),"px"),height:"".concat(t.height(),"px")})})),"undefined"!==typeof i.zoom?i.zoom():i.addClass("no-zoom"),a.$content.html(n),a.contentLoaded()},error:function(t,e){var o=s(m);a.$content.html(o),a.contentLoaded()}});var r=e.data("title")?e.data("title"):e.attr("title");a.setTitle(r),"function"===typeof ga&&ga("send","event","meta","Image Click",o)}else if(o.match(/(youtube|youtube-nocookie|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/)){var l,p=o.match(/(youtube|youtube-nocookie|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/),g="meta-lightbox-video";"youtube"==p[1]&&(l="https://www.youtube.com/embed/".concat(p[4]),g="".concat(g," meta-lightbox-youtube")),"youtu"==p[1]&&(l="https://www.youtube.com/embed/".concat(p[3]),g="".concat(g," meta-lightbox-youtube")),"youtube-nocookie"==p[1]&&(l="https://www.youtube-nocookie.com/embed/".concat(p[4]),g="".concat(g," meta-lightbox-youtube")),"vimeo"==p[1]&&(l="https://player.vimeo.com/video/".concat(p[3]),g="".concat(g," meta-lightbox-vimeo")),l&&a.loadIframe(l,g);var b=e.data("title")?e.data("title"):e.attr("title");a.setTitle(b),"function"===typeof ga&&ga("send","event","meta","Video Click",p)}else if("#"==o.substring(0,1))s(o).length?(wrap=s('<div class="meta-lightbox-inline" />'),wrap.append(s(o).clone().show()),wrap.outerHeight()<a.$content.height()&&wrap.css({position:"relative",top:"50%","margin-top":"".concat(-wrap.outerHeight()/2,"px")}),f.resize((function(){wrap.outerHeight()<a.$content.height()&&wrap.css({position:"relative",top:"50%","margin-top":"".concat(-wrap.outerHeight()/2,"px")})})),a.$content.html(wrap),a.contentLoaded()):(wrap=s(m),a.$content.html(wrap),a.contentLoaded()),s(".meta-lightbox-title-wrap").html(""),"function"===typeof ga&&ga("send","event","meta","inline HTML click",o);else{if(e.data("force-iframe"))return console.log("".concat(h,": IFrame forced")),a.loadIframe(o,"meta-lightbox-iframe-content");console.log("".concat(h,": loading AJAX")),s.ajax({sync:!1,async:!0,url:o,dataType:"html",method:"GET",cache:!1,statusCode:{404:function(){console.log("".concat(h,": page not found")),d.location.href=url},302:function(){console.log("".concat(h,": redirect 302")),d.location.href=url}},error:function(t,e){console.log("".concat(h,": AJAX request failure.").concat(t.statusText));var o=s(m);a.$content.html(o),a.contentLoaded(),"function"===typeof ga&&ga("send","event","error","AJAX ERROR",t.statusText)},success:function(t,e,o){try{var n=s.parseJSON(t);if("object"===c(n)){if("object"===c(n.regions)&&"undefinded"!==typeof n.regions.LayoutAjax){var i=s('<div class="meta-lightbox-ajax" />');i.html(n.regions.LayoutAjax),a.$content.html(i),a.contentLoaded()}var r=o.getResponseHeader("X-Title"),l=o.getResponseHeader("X-Link");r&&r.length&&l&&l.length&&l!==d.location.href&&l.substring(0,l.indexOf("#"))!==d.location.href.replace(s("base").attr("href"),"/")&&(s(".meta-lightbox-ajax").data("curr-title",u.title),s(".meta-lightbox-ajax").data("curr-link",d.location.href),"undefined"!==typeof d.localStorage&&"/"!==l&&d.localStorage.setItem("current-page",l),u.URL!==l&&u.URL!==s("base").attr("href")+l&&u.URL!=="".concat(s("base").attr("href"),"/").concat(l)&&d.history.pushState({title:r,page:l,ajax:"true"},r,l),s(".meta-lightbox-title-wrap").html(""),"function"===typeof ga&&(ga("set",{page:l.replace(s("base").attr("href"),""),title:r}),ga("send","pageview")))}}catch(p){var f=s('<div class="meta-lightbox-ajax" />');f.append(t),a.$content.html(f),a.contentLoaded()}a.contentLoaded()}})}}},{key:"loadIframe",value:function(t,e){var a=this,o=s("<iframe>",{src:t,class:e,frameborder:0,vspace:0,hspace:0,scrolling:"auto",allowtransparency:"true"});console.log("".concat(h,": loading iframe")),p.append('<div id="IFramePreload" class="hidden d-none iframe-preload" style="display:none"></div>');var n=s("#IFramePreload");return n.html(o),o.on("load",(function(){console.log("".concat(h,": the iframe was loaded")),n.html(""),n.remove(),a.$content.addClass("iframe-delay"),a.$content.html(o),a.contentLoaded(),setTimeout((function(){a.$content.removeClass("iframe-delay")}),1e3)})),o}},{key:"contentLoaded",value:function(){this.$content.removeClass("meta-lightbox-loading"),setTimeout((function(){f.trigger("meta-lightbox-loaded")}),1),setTimeout((function(){p.addClass("meta-lightbox-body-effect-fade")}),600)}},{key:"hide",value:function(t){var e=this.$overlay,a=s(".meta-lightbox-ajax").data("curr-title"),o=s(".meta-lightbox-ajax").data("curr-link");a&&o&&("undefined"!==typeof d.localStorage&&"/"!==o&&d.localStorage.setItem("current-page",o),u.URL!==o&&u.URL!==s("base").attr("href")+o&&u.URL!=="".concat(s("base").attr("href"),"/").concat(o)&&d.history.replaceState({title:a,page:o,ajax:"true"},a,o)),e.removeClass("meta-lightbox-open"),p.removeClass("meta-lightbox-body-effect-fade"),s(".meta-lightbox-content .meta-lightbox-zoom-wrapper").trigger("zoom.destroy"),this.isMSIE&&(e.find("iframe").attr("src"," "),e.find("iframe").remove()),s(".meta-lightbox-prev").off("click"),s(".meta-lightbox-next").off("click"),s(".meta-lightbox-content").empty(),p.removeClass("meta-lightbox-body-effect-fade")}}],(a=null)&&l(e.prototype,a),o&&l(e,o),t}(),f.on("MetaLightboxUI.init ".concat(r.a.AJAX," ").concat(r.a.LOADED),(function(){g.init()})),d.MetaLightboxUI=g},"./src/scss/app.scss":function(t,e,a){},jquery:function(t,e){t.exports=jQuery}});
//# sourceMappingURL=app.js.map