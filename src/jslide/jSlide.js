/**
 * jSlide
 */
const jSlide = {
  _param: {},
  fonts: {}
};

/** Default values  */
jSlide._default = {
  title: 'jSlide',
  size: [1200,900],
  fontSize: 35,
  footer: '| %TITLE% | %PAGE%/%LENGTH%'
}

/** Set property
 * @param {string|Object} k key value or a key value object
 * @param {string} v value
 */
jSlide.set = function(k,v) {
  if (typeof k === 'string') {
    if (k) {
      jSlide._param[k] = v || jSlide._default[k] || '';
      if (k==='format') {
        switch (v) {
          case '16:9': jSlide._param.size = [1600,900]; break;
          case '4:3': jSlide._param.size = [1200,900]; break;
          default: jSlide._param.size = jSlide.size;
        }
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
['title', 'size', 'fontSize', 'footer'].forEach((p) => {
  jSlide.set(p);  
});


// Create dialog
import Dlog from '../dialog/dlog'
jSlide.dialog = new Dlog();

// Create slide
const slide = document.createElement('DIV');
slide.id = 'slide';
document.body.appendChild(slide);

// Add progress bar
const progress = document.createElement('DIV');
progress.id = 'progress';
document.body.appendChild(progress);

jSlide.progressBar = document.createElement('DIV');
progress.appendChild(jSlide.progressBar);

// Export slide
export default jSlide
