/*
 * MetaLightbox
 * https://tony.twma.pro
 *
 */

import Events from './_events';
import MetaWindow from './_window';

const ui = new MetaWindow();
const container = document.getElementById('MetaLightboxApp');
if (!container) {
  console.log(`MetaWindow: missing container`);
}

const init = () => {
  ui.init(container);
};

window.addEventListener(`${Events.LOADED}`, init);
window.addEventListener(`${Events.AJAX}`, init);
window.addEventListener(`MetaWindow.initLinks`, init);

/*function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context('../img/', false, /\.(png|jpe?g|svg)$/),
);*/

export default ui;
