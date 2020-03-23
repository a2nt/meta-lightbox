//=require ../../bower_components/jquery-zoom/jquery.zoom.js

"use strict";

import $ from 'jquery';

const Events = {
  AJAX: 'ajax-load',
  LOADED: 'load',
};

const MetaUI = (($) => {
  // Constants
  const W = window;
  const D = document;
  const $Body = $('body');

  const NAME = 'jsMetaUI';
  const DATA_KEY = NAME;

  class MetaUI {

    constructor(el) {
      const ui = this;
      const $el = $(el);

      ui.$el = $el;

      $el.on('click', () => {
        ui.showLightbox();
      });

      $el.addClass(`${NAME}-active`);
    }

    // Static methods
    static init() {
      this.dispose();

      console.log(`Initializing: ${NAME}`);
    }

    static showLightbox(el) {
      this.el = el;
      this.$el = $(this.el);

      var $this = this,
        lightbox, content, currentLink, galleryItems;

      this.options.beforeShowLightbox.call(this);

      lightbox = this.constructLightbox();
      if (!lightbox) return;
      content = lightbox.find('.meta-lightbox-content');
      if (!content) return;
      currentLink = this.$el;
      $('body').addClass(`meta-lightbox-body-effect-${  this.options.effect}`);

      // Add content
      this.processContent(content, currentLink);

      // Nav
      if (this.$el.data('lightbox-gallery')) {
        galleryItems = $(`[data-lightbox-gallery="${  this.$el.data('lightbox-gallery')  }"]`);

        if (galleryItems.length === 1) {
          $('.meta-lightbox-nav').hide();
        } else {
          $('.meta-lightbox-nav').show();
        }

        // Prev
        $('.meta-lightbox-prev').off('click').on('click', function(e) {
          e.preventDefault();
          var index = galleryItems.index(currentLink);
          currentLink = galleryItems.eq(index - 1);
          if (!$(currentLink).length) currentLink = galleryItems.last();
          $this.processContent(content, currentLink);
          $this.options.onPrev.call(this, [currentLink]);
        });

        // Next
        $('.meta-lightbox-next').off('click').on('click', function(e) {
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
    }

    static dispose() {
      console.log(`Destroying: ${NAME}`);
    }

    static _jQueryInterface() {
      return this.each(function() {
        // attach functionality to el
        const $el = $(this);
        let data = $el.data(DATA_KEY);

        if (!data) {
          data = new MetaUI(this);
          $el.data(DATA_KEY, data);
        }
      });
    }
  }

  // jQuery interface
  $.fn[NAME] = MetaUI._jQueryInterface;
  $.fn[NAME].Constructor = MetaUI;
  $.fn[NAME].noConflict = function() {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return MetaUI._jQueryInterface;
  };

  // auto-apply
  $(window).on(`${Events.AJAX} ${Events.LOADED}`, () => {
    $('[data-toggle="lightbox"]').jsMetaUI();
  });

  return MetaUI;
})($);

export default MetaUI;
