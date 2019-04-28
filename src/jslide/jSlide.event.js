import jSlide from  './jSlide'

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
  document.body.querySelectorAll('.slide').forEach(resize);
  if (jSlide.presentation) {
    jSlide.presentation.querySelectorAll('.slide').forEach(resize);
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
    // Fullscreen
    case 116: {
      this.openPresentation();
      e.preventDefault();
      break;
    }
    // Ctrl + S
    case 83: {
      if (e.ctrlKey) {
        this.save();
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

// Longtouch / slide on the slides
var touchstart = [0,0];
var touchend = [0,0];
var timer;

/** Longtouch on the slide > openPresentationDlog
 */
document.getElementById('slide').addEventListener("touchstart", (e) => {
  touchstart = touchend = [e.touches[0].clientX, e.touches[0].clientY, new Date()];
  if (timer) clearTimeout(timer); 
  timer = setTimeout(function() {
    if (Math.abs(touchstart[0] - touchend[0]) < 5 && Math.abs(touchstart[1] - touchend[1]) < 5) {
      e.preventDefault();
      jSlide.openPresentationDlog();
    }
  }, 800); 
}, false);

/** Swipe left/ritgh
 */
document.getElementById('slide').addEventListener("touchmove", (e) => {
  touchend = [e.touches[0].clientX, e.touches[0].clientY, new Date()];
  if (touchend[2] - touchstart[2] < 100) {
    if (touchstart[0] - touchend[0] > 100) {
      touchstart[2] = 0;
      if (timer) clearTimeout(timer); 
      jSlide.next()
      console.log('next')
    }
    if (touchstart[0] - touchend[0] < -100) {
      touchstart[2] = 0;
      if (timer) clearTimeout(timer); 
      jSlide.prev();
      console.log('prev')
    }
  }
}, false);

/** Prevent longtouch */
document.getElementById('slide').addEventListener("touchend", (e) => {
  if (timer) clearTimeout(timer); 
  e.preventDefault();
}, false);
