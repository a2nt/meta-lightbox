/*
 * MetaLightbox
 * https://tony.twma.pro
 *
 */

import Events from './_events';
import MetaWindow from './window';

const container = document.getElementById('MetaLightboxApp');
if (!container) {
  console.log(`MetaWindow: missing container #MetaLightboxApp`);
}


const ui = new MetaWindow({
  target: container,
});

const init = () => {
  ui.init();
};

window.addEventListener(`${Events.LOADED}`, init);
window.addEventListener(`${Events.AJAX}`, init);
window.addEventListener(`MetaWindow.initLinks`, init);

window.MetaWindow = ui;
/*function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context('../img/', false, /\.(png|jpe?g|svg)$/),
);*/

export default ui;
