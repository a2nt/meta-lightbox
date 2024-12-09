/*
 * MetaLightbox
 * https://tony.twma.pro
 *
 */

import Events from './_events'
import MetaWindow from './window'

let container = document.getElementById('MetaLightboxApp');
if (!container) {
  container = document.createElement("div");
  container.setAttribute("id", "MetaLightboxApp");
  document.querySelector("body").append(container);
}

const init = () => {
  let ui = window.MetaWindow

  if (typeof ui === 'undefined') {
    ui = new MetaWindow({
      target: container,
    })

    window.MetaWindow = ui
  }

  ui.init()
}

window.addEventListener(`${Events.LOADEDANDREADY}`, init)
window.addEventListener(`${Events.AJAX}`, init)
window.addEventListener('MetaWindow.initLinks', init)

/* function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context('../img/', false, /\.(png|jpe?g|svg)$/),
); */

export default MetaWindow
