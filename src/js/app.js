/*
 * MetaLightbox
 * https://tony.twma.pro
 *
 */

import Events from './_events';

import React from 'react';
import ReactDOM from 'react-dom';
import MetaWindow from './_window.jsx';

const AppUI = ((W) => {
    const MetaLightbox = ReactDOM.render(
        <MetaWindow />,
        document.getElementById('MetaLightboxApp'),
    );

    const initMetaWindowLinks = () => {
        const ui = MetaLightbox;
        console.log(`MetaWindow: [links] init`);

        document.querySelectorAll('[data-toggle="lightbox"],[data-gallery="${gallery}"]').forEach((el) => {
            // collections
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
    };

    W.addEventListener(`${Events.LOADED}`, initMetaWindowLinks);
    W.addEventListener(`${Events.AJAX}`, initMetaWindowLinks);
    W.addEventListener(`MetaWindow.initLinks`, initMetaWindowLinks);

    return MetaLightbox;
})(window);

export default AppUI;

// display custom HTML content manually using JS
//M.setContent('<b>ZZZZZZZZZAAAA11<a href="/">BBBB</a>122</b>');
//M.show();
