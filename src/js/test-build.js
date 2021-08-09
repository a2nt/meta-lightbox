/*
 * MetaLightbox
 * https://tony.twma.pro
 *
 */

import ui from './app';
import '../scss/app.scss';
import '../scss/test-build.scss';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(
  require.context('../img/', false, /\.(png|jpe?g|svg)$/),
);

export default ui;
