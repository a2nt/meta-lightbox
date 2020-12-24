/*
 * MetaLightbox
 * https://tony.twma.pro
 *
 */

// optional:
//=require ../../bower_components/jquery-zoom/jquery.zoom.js

'use strict';

import $ from 'jquery';

import Events from './_events';

const MetaLightboxUI = (($) => {
  const W = window;
  const $W = $(W);
  const D = document;
  const $Body = $('body');

  const NAME = 'MetaLightboxUI';
  const NETWORK_ERROR =
    '<div class="meta-lightbox-error"><div class="alert alert-error alert-danger">Connection failure.</div></div>';

  class MetaLightboxUI {
    static init() {
      console.log(`${NAME}: init ...`);

      const ui = this;
      ui.isMSIE = /*@cc_on!@*/ 0;
      try {
        ui.isHidpi = ui.is_hdpi();
      } catch (e) {
        console.log(`${NAME}: catch`);
      }

      $(`.js${NAME},[data-toggle="lightbox"],[data-lightbox-gallery]`).on(
        'click',
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          const $link = $(e.currentTarget);

          ui.show($link);
        },
      );

      $(`.js${NAME}-close-inline`).on('click', (e) => {
        const $el = $(e.currentTarget);
        $el.parents('.meta-lightbox-overlay').removeClass('meta-lightbox-open');
      });
    }

    static is_hdpi() {
      console.log(`${NAME}: isHidpi`);
      const mediaQuery =
        '(-webkit-min-device-pixel-ratio: 1.5),\
          (min--moz-device-pixel-ratio: 1.5),\
          (-o-min-device-pixel-ratio: 3/2),\
          (min-resolution: 1.5dppx)';
      if (W.devicePixelRatio > 1) return true;
      return W.matchMedia && W.matchMedia(mediaQuery).matches;
    }

    static show($link) {
      console.log(`${NAME}: show`);
      const ui = this;

      const $lightbox = ui.constructLightbox();
      if (!$lightbox) return;

      const $content = ui.$content;
      if (!$content) return;

      $Body.addClass(`meta-lightbox-body-effect-fade`);

      // Add content
      ui.process($content, $link);

      // Nav
      if ($link.data('lightbox-gallery')) {
        const $galleryItems = $(
          `[data-lightbox-gallery="${$link.data('lightbox-gallery')}"]`,
        );

        if ($galleryItems.length === 1) {
          $('.meta-lightbox-nav').hide();
        } else {
          $('.meta-lightbox-nav').show();
        }

        // Prev
        $('.meta-lightbox-prev')
          .off('click')
          .on('click', (e) => {
            e.preventDefault();
            const index = $galleryItems.index($link);
            let $currentLink = $galleryItems.eq(index - 1);
            if (!$currentLink.length) $currentLink = $galleryItems.last();

            //ui.hide();
            setTimeout(() => {
              ui.show($currentLink);
            }, 10);
          });

        // Next
        $('.meta-lightbox-next')
          .off('click')
          .on('click', (e) => {
            e.preventDefault();
            const index = $galleryItems.index($link);
            let $currentLink = $galleryItems.eq(index + 1);
            if (!$currentLink.length) $currentLink = $galleryItems.first();

            //ui.hide();
            setTimeout(() => {
              ui.show($currentLink);
            }, 10);
          });
      }

      setTimeout(() => {
        ui.$overlay.addClass('meta-lightbox-open');
      }, 1); // For CSS transitions
    }

    static constructLightbox() {
      console.log(`${NAME}: constructLightbox`);
      const ui = this;

      const overlay = $('<div>', {
        class:
          'meta-lightbox-overlay meta-lightbox-theme-default meta-lightbox-effect-fade',
      });
      const wrap = $('<div>', {
        class: 'meta-lightbox-wrap',
      });
      const content = $('<div>', {
        class: 'meta-lightbox-content',
      });
      const nav = $(
        '<a href="#" class="meta-lightbox-nav meta-lightbox-prev"><i class="fas fa fa-chevron-left"></i> <span class="sr-only">Previous</span></a><a href="#" class="meta-lightbox-nav meta-lightbox-next"><i class="fa fas fa-chevron-right"></i> <span class="sr-only">Next</span></a>',
      );
      const close = $(
        '<a href="#" class="meta-lightbox-close fas fa fa-times" title="Close"><span class="sr-only">Close</span></a>',
      );
      const title = $('<div>', {
        class: 'meta-lightbox-title-wrap',
      });

      if (ui.$overlay) return ui.$overlay;

      if (ui.isMSIE) overlay.addClass('meta-lightbox-ie');

      wrap.append(content);
      wrap.append(title);
      overlay.append(wrap);
      overlay.append(nav);
      overlay.append(close);
      $Body.append(overlay);

      overlay.on('click', (e) => {
        e.preventDefault();
        ui.hide();
      });

      close.on('click', (e) => {
        e.preventDefault();
        ui.hide();
      });

      ui.$overlay = overlay;
      ui.$content = content;
      ui.$title = title;

      return ui.$overlay;
    }

    static setTitle(str) {
      const ui = this;

      ui.$title.html(str);
    }

    static process($content, $link) {
      console.log(`${NAME}: process`);
      const ui = this;

      const href =
        $link.attr('href') && $link.attr('href').length
          ? $link.attr('href')
          : $link.data('href');

      // add custom link specific class
      ui.$content.attr('class', 'meta-lightbox-content');
      ui.$content.addClass($link.data('lightbox-class'));

      if (!href.length) {
        console.log($link);
        console.error(`${NAME}: href(attr/data) is missing`);
      }

      const $pageSpinner = $('#PageLoading .loading-spinner');
      const loadingContent = $pageSpinner.length ? $pageSpinner.clone() : '';
      ui.$content.append(loadingContent).addClass('meta-lightbox-loading');

      // Image
      if (href.match(/\.(jpeg|jpg|gif|png|svg)$/i)) {
        $.ajax({
          url: href,
          success: () => {
            const img = $('<img>', { src: href });
            const wrap = $('<div class="meta-lightbox-image"></div>');
            const imgwrapper = $(
              '<span class="meta-lightbox-zoom-wrapper"></span>',
            );

            imgwrapper.append(img);
            wrap.append(imgwrapper);

            // Vertically center images
            wrap.css({
              'line-height': `${$content.height()}px`,
              height: `${$content.height()}px`, // For Firefox
            });

            $W.resize(() => {
              wrap.css({
                'line-height': `${$content.height()}px`,
                height: `${$content.height()}px`, // For Firefox
              });
            });

            if (typeof imgwrapper['zoom'] !== 'undefined') {
              imgwrapper.zoom();
            } else {
              imgwrapper.addClass('no-zoom');
            }

            ui.$content.html(wrap);
            ui.contentLoaded();
          },
          error: (jqXHR, status) => {
            const wrap = $(NETWORK_ERROR);

            ui.$content.html(wrap);
            ui.contentLoaded();
          },
        });

        // Set the title
        const title = $link.data('title')
          ? $link.data('title')
          : $link.attr('title');
        ui.setTitle(title);

        // google analytics
        if (typeof ga === 'function') {
          ga('send', 'event', 'meta', 'Image Click', href);
        }
      }
      // Video (Youtube/Vimeo)
      else if (
        href.match(
          /(youtube|youtube-nocookie|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/,
        )
      ) {
        const video = href.match(
          /(youtube|youtube-nocookie|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/,
        );
        let classTerm = 'meta-lightbox-video';
        let src;

        if (video[1] == 'youtube') {
          src = `https://www.youtube.com/embed/${video[4]}`;
          classTerm = `${classTerm} meta-lightbox-youtube`;
        }
        if (video[1] == 'youtu') {
          src = `https://www.youtube.com/embed/${video[3]}`;
          classTerm = `${classTerm} meta-lightbox-youtube`;
        }
        if (video[1] == 'youtube-nocookie') {
          src = `https://www.youtube-nocookie.com/embed/${video[4]}`;
          classTerm = `${classTerm} meta-lightbox-youtube`;
        }
        if (video[1] == 'vimeo') {
          src = `https://player.vimeo.com/video/${video[3]}`;
          classTerm = `${classTerm} meta-lightbox-vimeo`;
        }

        if (!src) {
          console.warn(`${NAME}: Video loading bad URL`);
          return false;
        }

        const $iframe = ui.loadIframe(src, classTerm);
        if (!$iframe) {
          $link.addClass('meta-offline');
          return false;
        }
        $link.removeClass('meta-offline');

        // Set the title
        const title = $link.data('title')
          ? $link.data('title')
          : $link.attr('title');
        ui.setTitle(title);

        // google analytics
        if (typeof ga === 'function') {
          ga('send', 'event', 'meta', 'Video Click', video);
        }
      }
      // Inline HTML
      else if (href.substring(0, 1) == '#') {
        if ($(href).length) {
          wrap = $('<div class="meta-lightbox-inline" />');
          wrap.append($(href).clone().show());

          // Vertically center html
          if (wrap.outerHeight() < ui.$content.height()) {
            wrap.css({
              position: 'relative',
              top: '50%',
              'margin-top': `${-(wrap.outerHeight() / 2)}px`,
            });
          }
          $W.resize(() => {
            if (wrap.outerHeight() < ui.$content.height()) {
              wrap.css({
                position: 'relative',
                top: '50%',
                'margin-top': `${-(wrap.outerHeight() / 2)}px`,
              });
            }
          });

          ui.$content.html(wrap);
          ui.contentLoaded();
        } else {
          wrap = $(NETWORK_ERROR);
          ui.$content.html(wrap);
          ui.contentLoaded();
        }

        $('.meta-lightbox-title-wrap').html('');

        // google analytics
        if (typeof ga === 'function') {
          ga('send', 'event', 'meta', 'inline HTML click', href);
        }
      }
      // AJAX/iFrame (default)
      else {
        if ($link.data('force-iframe')) {
          console.log(`${NAME}: IFrame forced`);

          const $iframe = ui.loadIframe(href, 'meta-lightbox-iframe-content');
          if (!$iframe) {
            $link.addClass('meta-offline');
            return false;
          }

          $link.removeClass('meta-offline');
          return true;
        }

        console.log(`${NAME}: loading AJAX`);
        $.ajax({
          sync: false,
          async: true,
          url: href,
          dataType: 'html',
          method: 'GET',
          cache: false,
          statusCode: {
            404: function () {
              console.log(`${NAME}: page not found`);
              W.location.href = url;
            },
            302: function () {
              console.log(`${NAME}: redirect 302`);
              W.location.href = url;
            },
          },
          error: function (jqXHR, status) {
            console.log(`${NAME}: AJAX request failure.${jqXHR.statusText}`);

            var wrap = $(NETWORK_ERROR);
            ui.$content.html(wrap);
            ui.contentLoaded();

            // google analytics
            if (typeof ga === 'function') {
              ga('send', 'event', 'error', 'AJAX ERROR', jqXHR.statusText);
            }
          },
          success: function (data, status, jqXHR) {
            console.log(`${NAME}: AJAX success`);

            try {
              const dataJson = $.parseJSON(data);
              if (typeof dataJson === 'object') {
                console.log(`${NAME}: AJAX JSON`);
                // Replace regions
                if (
                  typeof dataJson['regions'] === 'object' &&
                  typeof dataJson['regions']['LayoutAjax'] !== 'undefinded'
                ) {
                  var wrap = $('<div class="meta-lightbox-ajax" />');
                  wrap.html(dataJson['regions']['LayoutAjax']);
                  ui.$content.html(wrap);
                  ui.contentLoaded();
                }

                // trigger events
                /*if (typeof (data['events']) === 'object') {
                    for (var eventName in data.events) {
                        $(D).trigger(eventName, [data['events'][eventName]]);
                    }
                }*/

                var title = jqXHR.getResponseHeader('X-Title'),
                  link = jqXHR.getResponseHeader('X-Link');

                if (
                  title &&
                  title.length &&
                  link &&
                  link.length &&
                  link !== W.location.href &&
                  link.substring(0, link.indexOf('#')) !==
                    W.location.href.replace($('base').attr('href'), '/')
                ) {
                  $('.meta-lightbox-ajax').data('curr-title', D.title);
                  $('.meta-lightbox-ajax').data('curr-link', W.location.href);

                  if (typeof W.localStorage !== 'undefined' && link !== '/') {
                    W.localStorage.setItem('current-page', link);
                  }

                  if (
                    D.URL !== link &&
                    D.URL !== $('base').attr('href') + link &&
                    D.URL !== `${$('base').attr('href')}/${link}`
                  ) {
                    W.history.pushState(
                      {
                        title,
                        page: link,
                        ajax: 'true',
                      },
                      title,
                      link,
                    );
                  }

                  $('.meta-lightbox-title-wrap').html('');

                  // google analytics
                  if (typeof ga === 'function') {
                    ga('set', {
                      page: link.replace($('base').attr('href'), ''),
                      title,
                    });
                    ga('send', 'pageview');
                  }
                }
              }
            } catch (e) {
              console.log(`${NAME}: AJAX HTML`);
              const $wrap = $('<div class="meta-lightbox-ajax" />');
              $wrap.append(data);
              ui.$content.html($wrap);
              ui.contentLoaded();
            }

            // Vertically center html
            /*if (wrap.outerHeight() < ui.$content.height()) {
              wrap.css({
                position: 'relative',
                top: '50%',
                'margin-top': `${-(wrap.outerHeight() / 2)}px`,
              });
            }
            $W.resize(() => {
              if (wrap.outerHeight() < ui.$content.height()) {
                wrap.css({
                  position: 'relative',
                  top: '50%',
                  'margin-top': `${-(wrap.outerHeight() / 2)}px`,
                });
              }
            });*/

            /*setTimeout(() => {
              $W.resize();

              if (typeof W.imagesLoaded === 'function') {
                W.imagesLoaded().then(() => {
                  $W.resize();
                });
              }
            }, 500);*/

            ui.contentLoaded();
          },
        });
      }
    }

    static loadIframe(href, classTerm) {
      const ui = this;

      const $iframe = $('<iframe>', {
        src: href,
        class: classTerm,
        frameborder: 0,
        vspace: 0,
        hspace: 0,
        scrolling: 'auto',
        allowtransparency: 'true',
      });

      console.log(`${NAME}: loading iframe`);

      $Body.append(
        '<div id="MetaIFramePreload" class="hidden d-none iframe-preload" style="display:none"></div>',
      );
      const $preload = $('#MetaIFramePreload');
      $preload.html($iframe);

      $iframe.on('load', () => {
        // don't load on offline
        if ($Body.hasClass('is-offline')) {
          console.warn(`${NAME}: Unable to load iframe offline`);
          return false;
        }
        ui.finishIFrameLoading();
      });

      return $iframe;
    }

    static finishIFrameLoading() {
      const ui = this;

      const $preload = $('#MetaIFramePreload');
      if (!$preload.length) {
        console.warn(`${NAME}: iframe preload not found`);
        return false;
      }

      const $iframe = $preload.find('iframe');
      if (!$iframe.length) {
        console.warn(`${NAME}: iframe preload > iframe not found`);
        return false;
      }

      console.log(`${NAME}: the iframe was loaded`);
      $preload.html('');
      $preload.remove();

      ui.$content.addClass('iframe-delay');

      ui.$content.html($iframe);
      ui.contentLoaded();

      setTimeout(() => {
        ui.$content.removeClass('iframe-delay');
      }, 1000);
    }

    static contentLoaded() {
      const ui = this;

      ui.$content.removeClass('meta-lightbox-loading');

      $(
        `.meta-lightbox-content .js${NAME},.meta-lightbox-content [data-toggle="lightbox"],.meta-lightbox-content [data-lightbox-gallery]`,
      ).on('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const $link = $(e.currentTarget);

        ui.show($link);
      });

      $(`.js${NAME}-close`).on('click', (e) => {
        e.preventDefault();
        ui.hide();
      });

      setTimeout(() => {
        $W.trigger('meta-lightbox-loaded');
      }, 1); // For CSS transitions

      setTimeout(() => {
        $Body.addClass('meta-lightbox-body-effect-fade');
      }, 600);
    }

    static hide(callback) {
      const ui = this;

      const $overlay = ui.$overlay;

      var title = $('.meta-lightbox-ajax').data('curr-title'),
        link = $('.meta-lightbox-ajax').data('curr-link');
      if (title && link) {
        if (typeof W.localStorage !== 'undefined' && link !== '/') {
          W.localStorage.setItem('current-page', link);
        }

        if (
          D.URL !== link &&
          D.URL !== $('base').attr('href') + link &&
          D.URL !== `${$('base').attr('href')}/${link}`
        ) {
          W.history.replaceState(
            {
              title,
              page: link,
              ajax: 'true',
            },
            title,
            link,
          );
        }
      }

      $overlay.removeClass('meta-lightbox-open');
      $Body.removeClass('meta-lightbox-body-effect-fade');
      $('.meta-lightbox-content .meta-lightbox-zoom-wrapper').trigger(
        'zoom.destroy',
      );

      // For IE
      if (ui.isMSIE) {
        $overlay.find('iframe').attr('src', ' ');
        $overlay.find('iframe').remove();
      }
      $('.meta-lightbox-prev').off('click');

      // Remove click handlers
      $('.meta-lightbox-next').off('click');

      // Empty content (for videos)
      $('.meta-lightbox-content').empty();

      $Body.removeClass('meta-lightbox-body-effect-fade');
    }
  }

  $W.on(`MetaLightboxUI.init ${Events.AJAX} ${Events.LOADED}`, () => {
    MetaLightboxUI.init();
  });

  $W.on(`${Events.BACKONLINE}`, () => {
    $('.meta-offline').removeClass('meta-offline');

    console.log(`${NAME}: reloading iframe`);
    MetaLightboxUI.finishIFrameLoading();

    const $iframe = $('.meta-lightbox-content iframe');
    if ($iframe.length) {
      $iframe.attr('src', $iframe.attr('src'));
    }
  });

  W.MetaLightboxUI = MetaLightboxUI;

  return MetaLightboxUI;
})($);

export default MetaLightboxUI;
