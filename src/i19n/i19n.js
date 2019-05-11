/*
 * Copyright (c) 2019 Jean-Marc VIGLINO (https://github.com/Viglino),
 * released under the MIT license (French BSD license)
 */
/** Define a global function to translate
 * 
 * @author Jean-Marc VIGLINO (https://github.com/Viglino)
 */
// Global i19n
const i19n = window.i19n = {
  lang: (navigator.language || navigator.userLanguage).split('-').shift(),
  en: {}
};

// Global function
window._T = function(k) {
  return (i19n[i19n.lang] || i19n.en)[k] || i19n.en[k] || k;
};

// Load languages
function addScript( src ) {
  const s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  document.body.appendChild( s );
}
addScript('./i19n/i19n.en.js');
addScript('./i19n/i19n.'+i19n.lang+'.js');

export default i19n