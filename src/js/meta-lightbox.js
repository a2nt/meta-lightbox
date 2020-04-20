/*
 * MetaLightbox v0.61
 * https://tony.twma.pro
 *
 */

//=require ../../bower_components/jquery-zoom/jquery.zoom.js

(function($, window, document) {
  var pluginName = 'metaLightbox',
    defaults = {
      effect: 'fade',
      theme: 'default',
      keyboardNav: true,
      clickOverlayToClose: true,
      onInit: function() {},
      beforeShowLightbox: function() {},
      afterShowLightbox: function(lightbox) {},
      beforeHideLightbox: function() {},
      afterHideLightbox: function() {},
      onPrev: function(element) {},
      onNext: function(element) {},
      errorMessage:
        'The requested content cannot be loaded. Please try again later.',
    };

  function MetaLightbox(element, options) {
    /*this.el = element;
    this.$el = $(this.el);*/

    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  MetaLightbox.prototype = {
    init: function() {
      var $this = this,
        $html = $('html');

      this.ajaxLoaded = false;

      // make object globally accessible
      document.MetaLightbox = this;

      // Need this so we don't use CSS transitions in mobile
      if (!$html.hasClass('meta-lightbox-notouch'))
        $html.addClass('meta-lightbox-notouch');
      if ('ontouchstart' in document)
        $html.removeClass('meta-lightbox-notouch');

      // Setup the click
      $(document).on(
        'click',
        '[data-toggle="lightbox"],[data-lightbox-gallery]',
        function(e) {
          e.preventDefault();
          e.stopPropagation();

          $this.showLightbox(this);
          return false;
        },
      );

      // keyboardNav
      if (this.options.keyboardNav) {
        $('body')
          .off('keyup')
          .on('keyup', (e) => {
            var code = e.keyCode ? e.keyCode : e.which;
            // Escape
            if (code === 27) {
              $this.destructLightbox();
            }
            // Left
            if (code === 37) {
              $('.meta-lightbox-prev').trigger('click');
            }
            // Right
            if (code === 39) {
              $('.meta-lightbox-next').trigger('click');
            }
          });
      }

      this.options.onInit.call(this);
    },

    showLightbox: function(element) {
      this.el = element;
      this.$el = $(this.el);

      var $this = this,
        lightbox,
        content,
        currentLink,
        galleryItems;

      this.options.beforeShowLightbox.call(this);

      lightbox = this.constructLightbox();
      if (!lightbox) return;
      content = lightbox.find('.meta-lightbox-content');
      if (!content) return;
      currentLink = this.$el;
      $('body').addClass(`meta-lightbox-body-effect-${this.options.effect}`);

      // Add content
      this.processContent(content, currentLink);

      // Nav
      if (this.$el.data('lightbox-gallery')) {
        galleryItems = $(
          `[data-lightbox-gallery="${this.$el.data('lightbox-gallery')}"]`,
        );

        if (galleryItems.length === 1) {
          $('.meta-lightbox-nav').hide();
        } else {
          $('.meta-lightbox-nav').show();
        }

        // Prev
        $('.meta-lightbox-prev')
          .off('click')
          .on('click', function(e) {
            e.preventDefault();
            var index = galleryItems.index(currentLink);
            currentLink = galleryItems.eq(index - 1);
            if (!$(currentLink).length) currentLink = galleryItems.last();
            $this.processContent(content, currentLink);
            $this.options.onPrev.call(this, [currentLink]);
          });

        // Next
        $('.meta-lightbox-next')
          .off('click')
          .on('click', function(e) {
            e.preventDefault();
            var index = galleryItems.index(currentLink);
            currentLink = galleryItems.eq(index + 1);
            if (!$(currentLink).length) currentLink = galleryItems.first();
            $this.processContent(content, currentLink);
            $this.options.onNext.call(this, [currentLink]);
          });
      }

      setTimeout(function() {
        lightbox.addClass('meta-lightbox-open');
        $this.options.afterShowLightbox.call(this, [lightbox]);
      }, 1); // For CSS transitions
    },

    processContent: function(content, link) {
      var $this = this,
        img,
        video,
        src,
        classTerm,
        iframe,
        wrap;

      href = link.attr('href');
      if (!href) {
        href = link.data('href');
      }

      content.html('').addClass('meta-lightbox-loading');

      // Is HiDPI?
      if (this.isHidpi() && link.data('lightbox-hidpi')) {
        href = link.data('lightbox-hidpi');
      }

      // Image
      if (href.match(/\.(jpeg|jpg|gif|png)$/i) != null) {
        /*if ($(window).width() < 768) {
            window.open(href, '_blank');
        }*/
        img = $('<img>', {
          src: href,
        });
        img.on('load', () => {
          var wrap = $('<div class="meta-lightbox-image"></div>'),
            $content = $('.meta-lightbox-content'),
            imgwrapper = $('<span class="meta-lightbox-zoom-wrapper"></span>');

          imgwrapper.append(img);
          wrap.append(imgwrapper);

          // Vertically center images
          wrap.css({
            'line-height': `${$content.height()}px`,
            height: `${$content.height()}px`, // For Firefox
          });
          $(window).resize(() => {
            wrap.css({
              'line-height': `${$content.height()}px`,
              height: `${$content.height()}px`, // For Firefox
            });
          });

          if (typeof imgwrapper['zoom'] !== 'undefined') {
            imgwrapper.zoom();
          }

          content.html(wrap).removeClass('meta-lightbox-loading');
          $this.contentLoaded();
        });
        /*.each(function () {
                            if (this.complete) $(this).load();
                        });*/

        img.on('error', () => {
          var wrap = $(
            `<div class="meta-lightbox-error"><p>${$this.options.errorMessage}</p></div>`,
          );
          content.html(wrap).removeClass('meta-lightbox-loading');
          $this.contentLoaded();
        });

        // Set the title
        if (link.data('title')) {
          $this.setTitle(link.data('title'));
        } else if (link.attr('title')) {
          $this.setTitle(link.attr('title'));
        } else {
          $('.meta-lightbox-title-wrap').html('');
        }

        // google analytics
        if (typeof ga === 'function') {
          ga('send', 'event', 'meta', 'Image Click', href);
        }
      }
      // Video (Youtube/Vimeo)
      else if (
        (video = href.match(
          /(youtube|youtube-nocookie|youtu|vimeo)\.(com|be)\/(watch\?v=([\w-]+)|([\w-]+))/,
        ))
      ) {
        src = '';
        classTerm = 'meta-lightbox-video';

        if (video[1] == 'youtube') {
          src = `https://www.youtube.com/embed/${video[4]}`;
          classTerm = 'meta-lightbox-youtube';
        }
        if (video[1] == 'youtu') {
          src = `https://www.youtube.com/embed/${video[3]}`;
          classTerm = 'meta-lightbox-youtube';
        }
        if (video[1] == 'youtube-nocookie') {
          src = `https://www.youtube-nocookie.com/embed/${video[4]}`;
          classTerm = 'nivo-lightbox-youtube';
        }
        if (video[1] == 'vimeo') {
          src = `https://player.vimeo.com/video/${video[3]}`;
          classTerm = 'meta-lightbox-vimeo';
        }

        if (src) {
          iframe = $('<iframe>', {
            src,
            class: classTerm,
            frameborder: 0,
            vspace: 0,
            hspace: 0,
            scrolling: 'auto',
          });
          content.html(iframe);
          iframe.on('load', () => {
            content.removeClass('meta-lightbox-loading');
            $this.contentLoaded();
          });
        }

        // Set the title
        if (link.data('title')) {
          $this.setTitle(link.data('title'));
        } else if (link.attr('title')) {
          $this.setTitle(link.attr('title'));
        } else {
          $('.meta-lightbox-title-wrap').html('');
        }

        // google analytics
        if (typeof ga === 'function') {
          ga('send', 'event', 'meta', 'Video Click', video);
        }
      }
      // Inline HTML
      else if (href.substring(0, 1) == '#') {
        if ($(href).length) {
          wrap = $('<div class="meta-lightbox-inline" />');
          wrap.append(
            $(href)
              .clone()
              .show(),
          );

          // Vertically center html
          if (wrap.outerHeight() < content.height()) {
            wrap.css({
              position: 'relative',
              top: '50%',
              'margin-top': `${-(wrap.outerHeight() / 2)}px`,
            });
          }
          $(window).resize(() => {
            if (wrap.outerHeight() < content.height()) {
              wrap.css({
                position: 'relative',
                top: '50%',
                'margin-top': `${-(wrap.outerHeight() / 2)}px`,
              });
            }
          });

          content.html(wrap).removeClass('meta-lightbox-loading');
          $this.contentLoaded();
        } else {
          wrap = $(
            `<div class="meta-lightbox-error"><p>${$this.options.errorMessage}</p></div>`,
          );
          content.html(wrap).removeClass('meta-lightbox-loading');
          $this.contentLoaded();
        }

        $('.meta-lightbox-title-wrap').html('');

        // google analytics
        if (typeof ga === 'function') {
          ga('send', 'event', 'meta', 'inline HTML click', href);
        }
      }
      // AJAX/iFrame (default)
      else {
        $.ajax({
          sync: false,
          async: true,
          url: href,
          dataType: 'html',
          method: 'GET',
          cache: false,
          statusCode: {
            404: function() {
              console.log('page not found');
              window.location.href = url;
            },
            302: function() {
              console.log('redirect 302');
              window.location.href = url;
            },
          },
          error: function(jqXHR) {
            console.log(`AJAX request failure.${jqXHR.statusText}`);

            var wrap = $(
              `<div class="meta-lightbox-error"><p>${$this.options.errorMessage}</p></div>`,
            );
            content.html(wrap).removeClass('meta-lightbox-loading');
            $this.contentLoaded();

            // google analytics
            if (typeof ga === 'function') {
              ga('send', 'event', 'error', 'AJAX ERROR', jqXHR.statusText);
            }
          },
          success: function(data, status, jqXHR) {
            try {
              const dataJson = $.parseJSON(data);
              if (typeof dataJson === 'object') {
                // Replace regions
                if (
                  typeof dataJson['regions'] === 'object' &&
                  typeof dataJson['regions']['LayoutAjax'] !== 'undefinded'
                ) {
                  var wrap = $('<div class="meta-lightbox-ajax" />');
                  wrap.html(dataJson['regions']['LayoutAjax']);
                  content.html(wrap).removeClass('meta-lightbox-loading');
                }

                // trigger events
                /*if (typeof (data['events']) === 'object') {
                    for (var eventName in data.events) {
                        $(document).trigger(eventName, [data['events'][eventName]]);
                    }
                }*/

                var title = jqXHR.getResponseHeader('X-Title'),
                  link = jqXHR.getResponseHeader('X-Link');

                if (
                  title &&
                  title.length &&
                  link &&
                  link.length &&
                  link !== window.location.href &&
                  link.substring(0, link.indexOf('#')) !==
                    window.location.href.replace($('base').attr('href'), '/')
                ) {
                  $('.meta-lightbox-ajax').data('curr-title', document.title);
                  $('.meta-lightbox-ajax').data(
                    'curr-link',
                    window.location.href,
                  );

                  if (
                    typeof window.localStorage !== 'undefined' &&
                    link !== '/'
                  ) {
                    window.localStorage.setItem('current-page', link);
                  }

                  if (
                    document.URL !== link &&
                    document.URL !== $('base').attr('href') + link &&
                    document.URL !== `${$('base').attr('href')}/${link}`
                  ) {
                    window.history.pushState(
                      {
                        title,
                        page: link,
                        ajax: 'true',
                      },
                      title,
                      link,
                    );
                  }

                  // update redirect urls
                  /*var pattern = new RegExp('\\b(redirect_uri=).*?(&|$)');
                  $('a').each(function () {
                      var $this = $(this);
                      $this.attr('href', $this.attr('href').replace(pattern, 'redirect_uri=' + encodeURI($('base').attr('href') + link)));
                  });*/

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
              var wrap = $('<div class="meta-lightbox-ajax" />');
              wrap.append(data);
              content.html(wrap).removeClass('meta-lightbox-loading');
            }

            // Vertically center html
            if (wrap.outerHeight() < content.height()) {
              wrap.css({
                position: 'relative',
                top: '50%',
                'margin-top': `${-(wrap.outerHeight() / 2)}px`,
              });
            }
            $(window).resize(() => {
              if (wrap.outerHeight() < content.height()) {
                wrap.css({
                  position: 'relative',
                  top: '50%',
                  'margin-top': `${-(wrap.outerHeight() / 2)}px`,
                });
              }
            });

            setTimeout(() => {
              $(window).resize();

              if (typeof window.imagesLoaded === 'function') {
                window.imagesLoaded().then(() => {
                  $(window).resize();
                });
              }
            }, 500);

            $this.contentLoaded();
          },
        });
      }
    },

    setTitle: function(text) {
      var titleWrap = $('<div>', {
        class: 'meta-lightbox-title',
      });
      titleWrap.text(text);
      $('.meta-lightbox-title-wrap').html(titleWrap);
    },

    contentLoaded: function() {
      setTimeout(() => {
        $(window).trigger('meta-lightbox-loaded');
      }, 1); // For CSS transitions

      setTimeout(() => {
        $('body').addClass('meta-lightbox-body-effect-fade');
      }, 600);
    },

    constructLightbox: function() {
      var $this = this,
        overlay = $('<div>', {
          class: `meta-lightbox-overlay meta-lightbox-theme-${this.options.theme} meta-lightbox-effect-${this.options.effect}`,
        }),
        wrap = $('<div>', {
          class: 'meta-lightbox-wrap',
        }),
        content = $('<div>', {
          class: 'meta-lightbox-content',
        }),
        nav = $(
          '<a href="#" class="meta-lightbox-nav meta-lightbox-prev"><i class="fa fa-chevron-left"></i> <span class="sr-only">Previous</span></a><a href="#" class="meta-lightbox-nav meta-lightbox-next"><i class="fa fa-chevron-right"></i> <span class="sr-only">Next</span></a>',
        ),
        close = $(
          '<a href="#" class="meta-lightbox-close fa fa-times" title="Close"><span class="sr-only">Close</span></a>',
        ),
        title = $('<div>', {
          class: 'meta-lightbox-title-wrap',
        }),
        isMSIE = /*@cc_on!@*/ 0,
        $overlay = $('.meta-lightbox-overlay');

      if ($overlay.length) return $overlay;

      if (isMSIE) overlay.addClass('meta-lightbox-ie');

      wrap.append(content);
      wrap.append(title);
      overlay.append(wrap);
      overlay.append(nav);
      overlay.append(close);
      $('body').append(overlay);

      if ($this.options.clickOverlayToClose) {
        overlay.on('click', (e) => {
          var $target = $(e.target);

          if (
            $target.hasClass('meta-lightbox-zoom-wrapper') ||
            $target.hasClass('meta-lightbox-content') ||
            $target.hasClass('meta-lightbox-wrap') ||
            $target.hasClass('meta-lightbox-image') ||
            $target.hasClass('meta-lightbox-overlay')
          ) {
            $this.destructLightbox();
          }
        });
      }

      close.on('click', (e) => {
        e.preventDefault();
        $this.destructLightbox();
      });

      return overlay;
    },

    destructLightbox: function() {
      var $this = this,
        $overlay = $('.meta-lightbox-overlay'),
        isMSIE = /*@cc_on!@*/ 0;
      this.options.beforeHideLightbox.call(this);

      var title = $('.meta-lightbox-ajax').data('curr-title'),
        link = $('.meta-lightbox-ajax').data('curr-link');
      if (title && link) {
        if (typeof window.localStorage !== 'undefined' && link !== '/') {
          window.localStorage.setItem('current-page', link);
        }

        if (
          document.URL !== link &&
          document.URL !== $('base').attr('href') + link &&
          document.URL !== `${$('base').attr('href')}/${link}`
        ) {
          window.history.replaceState(
            {
              title,
              page: link,
              ajax: 'true',
            },
            title,
            link,
          );
        }

        // update redirect urls
        /*var pattern = new RegExp('\\b(redirect_uri=).*?(&|$)');
        $('a').each(function () {
            var $this = $(this);
            $this.attr('href', $this.attr('href').replace(pattern, 'redirect_uri=' + encodeURI($('base').attr('href') + link)));
        });*/
      }

      $overlay.removeClass('meta-lightbox-open');
      $('.meta-lightbox-nav').hide();
      $('body').removeClass(
        `meta-lightbox-body-effect-${$this.options.effect}`,
      );
      $('.meta-lightbox-content .meta-lightbox-zoom-wrapper').trigger(
        'zoom.destroy',
      );

      // For IE
      if (isMSIE) {
        $overlay.find('iframe').attr('src', ' ');
        $overlay.find('iframe').remove();
      }
      $('.meta-lightbox-prev').off('click');

      // Remove click handlers
      $('.meta-lightbox-next').off('click');

      // Empty content (for videos)
      $('.meta-lightbox-content').empty();

      $('body').removeClass('meta-lightbox-body-effect-fade');

      this.options.afterHideLightbox.call(this);
    },

    isHidpi: function() {
      var mediaQuery =
        '(-webkit-min-device-pixel-ratio: 1.5),\
          (min--moz-device-pixel-ratio: 1.5),\
          (-o-min-device-pixel-ratio: 3/2),\
          (min-resolution: 1.5dppx)';
      if (window.devicePixelRatio > 1) return true;
      return window.matchMedia && window.matchMedia(mediaQuery).matches;
    },
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new MetaLightbox(this, options));
      }
    });
  };

  $(document).metaLightbox();
})(jQuery, this, document);
