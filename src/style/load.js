// Default style
import './style.css'
import './githubcorner.css'

import './dialog.css'

import './style.title.css'
import './style.chapter.css'
import './style.list.css'
import './style.transition.css'

// Load assets
function addCSS(filename){
  const style = document.createElement('link');
  style.href = filename;
  style.type = 'text/css';
  style.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].append(style);
}

addCSS('fonts/font-awesome.css');
addCSS('fonts/HackRegular.css');
addCSS('fonts/OpenSans.css');
addCSS('fonts/jslide.css');