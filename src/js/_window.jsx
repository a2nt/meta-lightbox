/*
 * Lightbox window
 */

import Events from './_events';
import { Component } from 'react';
import Swipe from 'react-easy-swipe';
import KeyboardJS from 'keyboardjs';

import Embed, { defaultProviders } from 'react-tiny-oembed';

const W = window;

const InstagramProvider = {
    provider_name: 'Instagram',
    provider_url: 'https://instagram.com',
    endpoints: [{
            schemes: [
                'http://instagram.com/*/p/*,',
                'http://www.instagram.com/*/p/*,',
                'https://instagram.com/*/p/*,',
                'https://www.instagram.com/*/p/*,',
                'http://instagram.com/p/*',
                'http://instagr.am/p/*',
                'http://www.instagram.com/p/*',
                'http://www.instagr.am/p/*',
                'https://instagram.com/p/*',
                'https://instagr.am/p/*',
                'https://www.instagram.com/p/*',
                'https://www.instagr.am/p/*',
                'http://instagram.com/tv/*',
                'http://instagr.am/tv/*',
                'http://www.instagram.com/tv/*',
                'http://www.instagr.am/tv/*',
                'https://instagram.com/tv/*',
                'https://instagr.am/tv/*',
                'https://www.instagram.com/tv/*',
                'https://www.instagr.am/tv/*',
            ],
            url: 'https://graph.facebook.com/v9.0/instagram_oembed',
            formats: ['json'],
        },
        {
            schemes: [
                'http://instagram.com/*/p/*,',
                'http://www.instagram.com/*/p/*,',
                'https://instagram.com/*/p/*,',
                'https://www.instagram.com/*/p/*,',
                'http://instagram.com/p/*',
                'http://instagr.am/p/*',
                'http://www.instagram.com/p/*',
                'http://www.instagr.am/p/*',
                'https://instagram.com/p/*',
                'https://instagr.am/p/*',
                'https://www.instagram.com/p/*',
                'https://www.instagr.am/p/*',
                'http://instagram.com/tv/*',
                'http://instagr.am/tv/*',
                'http://www.instagram.com/tv/*',
                'http://www.instagr.am/tv/*',
                'https://instagram.com/tv/*',
                'https://instagr.am/tv/*',
                'https://www.instagram.com/tv/*',
                'https://www.instagr.am/tv/*',
            ],
            url: 'https://api.instagram.com/oembed',
            formats: ['json'],
        },
    ],
};

const axios = require('axios');

class MetaWindow extends Component {
    state = {
        content: '',
        type: [],
        shown: false,
        loading: false,
        error: false,
        embed: false,
        collections: [],
        current: null,
    };

    constructor(props) {
        super(props);

        const ui = this;
        ui.name = ui.constructor.name;
        console.log(`${ui.name}: init`);
        ui.axios = axios;

        W.dispatchEvent(new Event(`{ui.name}.init`));
    }

    _currIndex = () => {
        const ui = this;
        const el = ui.state.current;
        const gallery = el.getAttribute('data-gallery');

        return ui.state.collections[gallery].indexOf(el);
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

    load = (link) => {
        const ui = this;
        const axios = ui.axios;

        ui.reset();
        ui.setState({ loading: true });
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
                        ui.setContent(
                            `<img src="data:${
                                resp.headers['content-type']
                            };base64,${ui._imageEncode(resp.data)}" />`,
                            'image',
                        );
                        break;
                    case 'application/json':
                    case 'application/ld+json':
                        // irregular types:
                    case 'application/json; charset=UTF-8':
                        const json = JSON.parse(ui._abToString(resp.data));
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

                ui.setState({ error: msg });

                W.dispatchEvent(new Event(`{ui.name}.error`));
            })
            .then(() => {
                ui.setState({ loading: false });
            });
    };

    _abToString = (arrayBuffer) => {
        return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
    };

    _imageEncode = (arrayBuffer) => {
        let u8 = new Uint8Array(arrayBuffer);
        let b64encoded = btoa(
            [].reduce.call(
                new Uint8Array(arrayBuffer),
                function(p, c) {
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

        ui.setState({ content: html, type: typeArr });
    };

    show = () => {
        const ui = this;
        console.log(`${ui.name}: show`);

        ui.setState({ shown: true });
        W.dispatchEvent(new Event(`{ui.name}.show`));
    };

    hide = () => {
        const ui = this;

        console.log(`${ui.name}: hide`);

        KeyboardJS.withContext(name, () => {
            KeyboardJS.unbind('left', ui.prev);
            KeyboardJS.unbind('right', ui.next);
        });

        KeyboardJS.setContext('index');

        ui.setState({ shown: false });
        W.dispatchEvent(new Event(`{ui.name}.hide`));
    };

    getHtml = () => {
        const ui = this;
        return { __html: ui.state.content };
    };


    onSwipeMove(position, event) {
        const ui = this.ui;
        const x = position.x;

        if (ui.locked || Math.abs(x) < 50) {
            return;
        }

        ui.locked = true;
        setTimeout(() => {
            ui.locked = false;
        }, 1000);

        if (x > 0) {
            console.log(`${ui.name}: swipe right`);
            ui.prev();
        } else {
            console.log(`${ui.name}: swipe left`);
            ui.next();
        }
    }


    render() {
        const ui = this;
        const name = ui.name;

        let navs = null;
        const el = ui.state.current;
        KeyboardJS.setContext(name);
        KeyboardJS.withContext(name, () => {
            KeyboardJS.unbind('left', ui.prev);
            KeyboardJS.unbind('right', ui.next);
        });

        if (el) {
            const gallery = el.getAttribute('data-gallery');
            if (gallery && ui.state.collections[gallery].length > 1) {
                navs = (
                    <nav className="meta-navs">
                        <button
                            className="meta-nav meta-nav-arrow meta-nav-arrow__prev a"
                            onClick={ui.prev}
                        >
                            <i className="fa fas fa-chevron-left"></i>
                            <span className="sr-only">Previous</span>
                        </button>
                        <button
                            className="meta-nav meta-nav-arrow meta-nav-arrow__next a"
                            onClick={ui.next}
                        >
                            <i className="fa fas fa-chevron-right"></i>
                            <span className="sr-only">Next</span>
                        </button>
                    </nav>
                );

                KeyboardJS.withContext(name, () => {
                    KeyboardJS.bind('left', ui.prev);
                    KeyboardJS.bind('right', ui.next);
                });
            }
        }

        const content = ui.state.embed ? (
            <section className="meta-wrap typography">
                <Embed
                    url={ui.state.embed}
                    providers={[...defaultProviders, InstagramProvider]}
                    LoadingFallbackElement=<div className="meta-spinner_embed">
                        ... Loading ...
                    </div>
                />
            </section>
        ) : (
            <section
                className="meta-wrap typography"
                dangerouslySetInnerHTML={ui.getHtml()}
            ></section>
        );

        const className = `meta-${name} meta-${name}__${ui.state.type.join(
            ` meta-${name}__`,
        )}`;

        const overlayClassName = `meta-${name}-overlay${
            ui.state.shown ? ` meta-${name}-overlay__open` : ''
        }${ui.state.loading ? ` meta-${name}-overlay__loading` : ''}${
            ui.state.error ? ` meta-${name}-overlay__error` : ''
        }`;

        return (
            <Swipe className={className} ui={ui} onSwipeMove={ui.onSwipeMove}>
                <div className={overlayClassName}>
                    <article className="meta-content">
                        {navs}
                        <button
                            className="meta-nav meta-close a"
                            onClick={ui.hide}
                        >
                            <i className="fa fas fa-times"></i>
                            <span className="sr-only">Close</span>
                        </button>

                        <div className="meta-spinner">... Loading ...</div>
                        <div className="meta-error alert alert-danger">
                            {ui.state.error}
                        </div>

                        {content}
                    </article>
                </div>
            </Swipe>
        );
    }
}

export default MetaWindow;
