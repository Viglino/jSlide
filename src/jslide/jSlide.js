import settings from './jSlide.settings'

/**
 * jSlide
 */
const jSlide = {
  _param: {},
  fonts: {}
};

/** Set property
 * @param {string|Object} k key value or a key value object
 * @param {string} v value
 */
jSlide.set = function(k,v) {
  if (typeof k === 'string') {
    if (k) {
      jSlide._param[k] = v || (settings[k].hasOwnProperty('default') ? settings[k].default : '');
      if (k==='format') {
        switch (v) {
          case '16:9': {
            jSlide._param.size = [1600,900]; 
            break;
          }
          case '4:3': 
          default: {
            jSlide._param.size = [1200,900]; 
            break;
          }
        }
      }
      if (k==='title') {
        document.title = v;
      }
    }
  } else {
    for (let i in k) jSlide.set(i, k[i]);
  }
};

/** Get propertie
 * @param {string} k key
 * @return {string} value
 */
jSlide.get = function(k) {
  switch(k) {
    case 'width': return jSlide._param.size[0];
    case 'height': return jSlide._param.size[1];
    default: return jSlide._param[k];
  }
};

/** Get properties as an object
 * @return {object}
 */
jSlide.getProperties = function() {
  return jSlide._param;
};

/** Set default properties */
Object.keys(settings).forEach((p) => {
  jSlide.set(p, settings[p].default);  
});

/** Set presentation mode
 * @param {string} mode play | edit
 * @param {string} options
 */
jSlide.setMode = function (mode, options) {
  options = options || {};
  if (jSlide.timer) {
    clearTimeout(jSlide.timer);
  }
  jSlide.timer = !!options.timer;
  jSlide.random = !!options.random;
  document.body.setAttribute('data-mode', mode);
  jSlide.slideshow = /play/.test(mode);
  jSlide.step = 0;
  jSlide.show();
};

/** Get presentation mode
 * @return {string} current mode: play | edit
 */
jSlide.getMode = function () {
  return document.body.getAttribute('data-mode') || 'edit';
};

// Create dialog
import Dlog from '../dialog/dlog'
jSlide.dialog = new Dlog();

// Create slide
const slide = document.createElement('DIV');
slide.id = 'slide';
document.body.appendChild(slide);
jSlide.slideDiv = slide;

// Export slide
export default jSlide
