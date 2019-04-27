import jSlide from './jSlide'

function loadFont(font, doc) {
  if (!doc) {
    loadFont(font, document);
    if (jSlide.presentation) loadFont(font, jSlide.presentation.ownerDocument);
    return;
  } else {
    var elt = doc.getElementById('font-'+font);
    if (!elt) {
      var fileref = doc.createElement("link");
      fileref.setAttribute('id', 'font-'+font);
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', 'https://fonts.googleapis.com/css?family='+font);
      doc.getElementsByTagName('head')[0].appendChild(fileref)
    }
  }
};

/**
 * 
 */
jSlide.setSlideFont = function (div, font) {
  if (font) {
    div.style.fontFamily = font;
    loadFont(font);
  }
};
