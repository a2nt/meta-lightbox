/*
 * Lightbox window
 */

import Events from './_events';

const W = window;
const axios = require('axios');

class MetaWindow {
    state = {
      content: '',
      type: [],
      shown: false,
      loading: false,
      error: false,
      embed: false,
      collections: [],
      current: null,
      target: null,
    };

    init() {
      const ui = this;
      console.log(`MetaWindow: [links] init`);

      // collect new collections
      document.querySelectorAll('[data-toggle="lightbox"],[data-gallery="${gallery}"]').forEach((el) => {
        const gallery = el.getAttribute('data-gallery');
        if (gallery) {
          ui.state.collections[gallery] = [];
          document
            .querySelectorAll(
              `[data-toggle="lightbox"][data-gallery="${gallery}"]`,
            )
            .forEach((el) => {
              ui.state.collections[gallery].push(el);
            });
        }

        // click handler
        el.addEventListener('click', (e) => {
          e.preventDefault();
          console.log(`MetaWindow: [link] click`);

          const el = e.currentTarget;
          const link =
                    el.getAttribute('href') || el.getAttribute('data-href');
          const embed = el.getAttribute('data-embed');
          ui.state.current = el;

          if (embed) {
            ui.embed(link);
          } else {
            ui.load(link);
          }

          const title = el.getAttribute('data-title');
          if (title) {
            ui.setCaption(title);
          }
        });
      });
    }

    constructor(state = {
      shown: false,
    }, action) {
      const ui = this;

      ui.name = ui.constructor.name;
      console.log(`${ui.name}: init`);
      ui.axios = axios;

      ui.setState(state);
      switch (action) {
        case 'show':
          ui.hide();
          break;
        case 'hide':
          ui.hide();
          break;
      }

      W.dispatchEvent(new Event(`{ui.name}.init`));
    }

    show = () => {
      const ui = this;
      console.log(`${ui.name}: show`);

      ui.setState({
        shown: true,
      });
      W.dispatchEvent(new Event(`{ui.name}.show`));
    };

    hide = () => {
      const ui = this;

      console.log(`${ui.name}: hide`);
      ui.setState({
        shown: false,
      });
      W.dispatchEvent(new Event(`{ui.name}.hide`));
    };

    next = () => {
      const ui = this;
      const el = ui.state.current;
      const gallery = el.getAttribute('data-gallery');

      let i = ui._currIndex();
      if (i < ui.state.collections[gallery].length - 1) {
        i++;
      } else {
        i = 0;
      }

      ui.state.collections[gallery][i].click();

      console.log(`${ui.name}: next`);
      W.dispatchEvent(new Event(`{ui.name}.next`));
    };

    prev = () => {
      const ui = this;
      const el = ui.state.current;
      const gallery = el.getAttribute('data-gallery');

      let i = ui._currIndex();
      if (i > 0) {
        i--;
      } else {
        i = ui.state.collections[gallery].length - 1;
      }

      ui.state.collections[gallery][i].click();

      console.log(`${ui.name}: prev`);
      W.dispatchEvent(new Event(`{ui.name}.prev`));
    };

    reset = () => {
      const ui = this;

      ui.setState({
        content: '',
        type: [],
        shown: false,
        loading: false,
        error: false,
        embed: false,
      });
    };

    load = (link) => {
      const ui = this;
      const axios = ui.axios;

      ui.reset();
      ui.setState({
        loading: true,
      });
      ui.show();

      axios
        .get(link, {
          responseType: 'arraybuffer',
        })
        .then((resp) => {
          // handle success
          console.log(
            `${ui.name}: response content-type: ${resp.headers['content-type']}`,
          );
          const json = false;

          switch (resp.headers['content-type']) {
            case 'image/jpeg':
            case 'image/png':
            case 'image/svg+xml':
            case 'image/bmp':
            case 'image/gif':
            case 'image/tiff':
            case 'image/webp':
              // irregular types:
            case 'image/jpg':
            case 'image/svg':
              //json = JSON.parse(ui._abToString(resp.data));
              ui.setContent(
                `<img src="data:${resp.headers['content-type']};base64,${ui._imageEncode(resp.data)}" />`,
                'image',
              );
              break;
            case 'application/json':
            case 'application/ld+json':
              // irregular types:
            case 'application/json; charset=UTF-8':
              ui.setContent(`${json['Content']}`, 'text html json');

              break;
            case 'text/html':
            case 'application/xhtml+xml':
            case 'text/plain':
              // irregular types:
            case 'text/html; charset=UTF-8':
            case 'application/xhtml+xml; charset=UTF-8':
            case 'text/plain; charset=UTF-8':
              ui.setContent(
                ui._abToString(resp.data),
                'text html pajax',
              );
              break;
            default:
              console.warn(
                `${ui.name}: Unknown response content-type!`,
              );
              break;
          }

          W.dispatchEvent(new Event(`{ui.name}.loaded`));
        })
        .catch((error) => {
          console.error(error);

          let msg = '';

          if (error.response) {
            switch (error.response.status) {
              case 404:
                msg = 'Not Found.';
                break;
              case 500:
                msg = 'Server issue, please try again latter.';
                break;
              default:
                msg = 'Something went wrong.';
                break;
            }
          } else if (error.request) {
            msg = 'No response received';
          } else {
            console.warn('Error', error.message);
          }

          ui.setState({
            error: msg,
          });

          W.dispatchEvent(new Event(`{ui.name}.error`));
        })
        .then(() => {
          ui.setState({
            loading: false,
          });
        });
    };

    _currIndex = () => {
      const ui = this;
      const el = ui.state.current;
      const gallery = el.getAttribute('data-gallery');

      return ui.state.collections[gallery].indexOf(el);
    };

    embed = (link) => {
      const ui = this;
      console.log(`${ui.name}: embed`);

      ui.reset();
      ui.setState({
        embed: link,
        loading: false,
        type: ['embed', 'video'],
      });
      ui.show();
    };

    setCaption = (title) => {
      const ui = this;
      console.log(`${ui.name}: setCaption`);

      ui.state.caption = title;
    };

    getCaption = () => {
      const ui = this;
      return ui.state.caption;
    }

    _abToString = (arrayBuffer) => {
      return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
    };

    _imageEncode = (arrayBuffer) => {
      const u8 = new Uint8Array(arrayBuffer);
      const b64encoded = btoa(
        [].reduce.call(
          new Uint8Array(arrayBuffer),
          (p, c) => {
            return p + String.fromCharCode(c);
          },
          '',
        ),
      );

      return b64encoded;
    };

    setContent = (html, type) => {
      const ui = this;
      console.log(`${ui.name}: setContent`);

      let typeArr = type ? type : ['html', 'text'];
      if (!Array.isArray(typeArr)) {
        typeArr = type.split(' ');
      }

      ui.setState({
        content: html,
        type: typeArr,
      });
    };

    getHtml = () => {
      const ui = this;
      return ui.state.content;
    };

    setState(state) {
      const ui = this;
      ui.state = Object.assign({}, ui.state, state);
      ui.render();
    }

    render() {
      const ui = this;
      const name = ui.name;

      const navs = null;
      const el = ui.state.current;

      ui.state.target.innerHTML = '';
      const meta = document.createElement('div');
      meta.classList.add(`meta-${name}`, `meta-${name}__${ui.state.type.join(` meta-${name}__`)}`);
      ui.state.target.append(meta);

      const metaOverlay = document.createElement('div');
      metaOverlay.classList.add(`meta-${name}-overlay`);
      if (ui.state.shown) {
        metaOverlay.classList.add(`meta-${name}-overlay__open`);
      }
      if (ui.state.loading) {
        metaOverlay.classList.add(`meta-${name}-overlay__loading`);
      }
      if (ui.state.error) {
        metaOverlay.classList.add(`meta-${name}-overlay__error`);
      }
      meta.append(metaOverlay);

      const metaContent = document.createElement('div');
      metaContent.classList.add('meta-content');
      metaOverlay.append(metaContent);

      const btnClose = document.createElement('button');
      btnClose.classList.add('meta-nav', 'meta-close', 'a');
      btnClose.innerHTML =
            '<i class="icon fa fas fa-times"></i>' +
            ' <span class="visually-hidden">Close</span>';
      btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        ui.hide();
      });
      metaContent.append(btnClose);

      if (el) {
        const gallery = el.getAttribute('data-gallery');
        if (gallery && ui.state.collections[gallery].length > 1) {
          const navs = document.createElement('nav');
          navs.classList.add('meta-navs');

          const prevBtn = document.createElement('button');
          prevBtn.classList.add('meta-nav', 'meta-nav-arrow', 'meta-nav-arrow__prev', 'a');
          prevBtn.innerHTML = '<i class="icon fa fas fa-chevron-left"></i>' +
                    ' <span class="visually-hidden">Previous</span>';
          prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            ui.prev();
          });
          navs.append(prevBtn);

          const nextBtn = document.createElement('button');
          nextBtn.classList.add('meta-nav', 'meta-nav-arrow', 'meta-nav-arrow__next', 'a');
          nextBtn.innerHTML = '<i class="icon fa fas fa-chevron-right"></i>' +
                    ' <span class="visually-hidden">Next</span>';
          nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            ui.next();
          });
          navs.append(nextBtn);

          metaContent.append(navs);
        }
      }

      let content = '';
      if (ui.state.embed) {
        content = '<section class="meta-wrap typography">' +
                '<Embed url={ui.state.embed} providers={[...defaultProviders, InstagramProvider]}' +
                ' LoadingFallbackElement=<div className="meta-spinner_embed"> ... Loading ... </div>' +
                '</section>';
      } else {
        const content = document.createElement('section');
        content.classList.add('meta-wrap', 'typography');
        content.innerHTML = ui.getHtml();
        metaContent.append(content);
      }

      if (ui.state.error) {
        const error = document.createElement('div');
        error.classList.add('meta-error');
        error.innerHTML = ui.state.error;
        metaContent.append(error);
      } else if (ui.state.caption) {
        const caption = document.createElement('div');
        caption.classList.add('meta-caption');
        caption.innerHTML = ui.getCaption();
        metaContent.append(caption);
      }

      return ui;
    }
}

export default MetaWindow;
