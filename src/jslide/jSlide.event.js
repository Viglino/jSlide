import jSlide from  './jSlide'
import md2html from  '../md/md2html'
import './jSlide.touchevent'

/** Update slides size
 */
function resize(s){
  var height = s.parentNode.clientHeight;
  var width = s.parentNode.clientWidth;
  s.style.width = jSlide.get('width')+'px';
  s.style.height = jSlide.get('height')+'px';
  s.style.fontSize = jSlide.get('fontSize')+'px';
  jSlide.setSlideFont (s, jSlide.get('fontFamily'));
  var sc = Math.min (width / jSlide.get('width'), height / jSlide.get('height'));
  s.style.webkitTransform = s.style.transform = 'translate(-50%, -50%) scale('+sc+')';
};

jSlide.updateSize = function() {
  document.body.querySelectorAll('div .slide').forEach(resize);
  // Prevent zero height slides
  if (jSlide.slideDiv.clientHeight < 100) {
    jSlide.editor.element.parentNode.style.height = 
    jSlide.slideDiv.style.bottom = 
    jSlide.progressBar.parentNode.style.bottom = Math.round(window.innerHeight/2)+'px';
  }
  if (jSlide.presentation) {
    jSlide.presentation.querySelectorAll('div .slide').forEach(resize);
  }
};

/** Handle keydown avent
 */
jSlide.onkeydown = function(e) {
  // console.log(e.keyCode)
  switch (e.keyCode) {
    // Space arrow left/down
    case 32:
    case 39:
    case 40:
    case 34: {
        jSlide.next();
      e.preventDefault();
      break;
    }
    // End
    case 35: {
      jSlide.show(jSlide.slide.length);
      e.preventDefault();
      break;
    }
    // Arrow right/up
    case 37:
    case 38: 
    case 33: {
      jSlide.prev();
      e.preventDefault();
      break;
    }
    // Start
    case 36: {
      jSlide.show(0);
      e.preventDefault();
      break;
    }
    // Ctrl + O
    case 79: {
      if (e.ctrlKey) {
        e.preventDefault();
      }
      break;
    }
    // ESC: close dialog
    case 27: {
      if (jSlide.dialog.isOpen()) {
        jSlide.dialog.close();
        e.preventDefault();
      }
      break;
    }
    // Help
    case 112: {
      jSlide.dialog.show({
        content: md2html(_T('helpInfo')),
        className: 'dlg-help notransition',
        closeOnClick: true
      })
      e.preventDefault();
      break;
    }
    // Openpresentation
    case 116: {
      jSlide.openPresentation();
      e.preventDefault();
      break;
    }
    // Ctrl + S
    case 83: {
      if (e.ctrlKey) {
        jSlide.save();
        e.preventDefault();
      }
      break;
    }
    default: break;
  }
};


// Resize slide on resize 
window.addEventListener('resize', (e) => {
  jSlide.updateSize(e);
});
// Handle key down 
document.addEventListener('keydown', (e) => {
  jSlide.onkeydown(e);
}, false);

// Handle drag'n'drop
document.body.addEventListener('drop', (e) => {
  jSlide.ondrop(e);
});
document.body.addEventListener('dragover', (e) => { 
  e.preventDefault(); 
});

// Load file onload
window.addEventListener('load', (e) => {
  jSlide.onload(e);
});
