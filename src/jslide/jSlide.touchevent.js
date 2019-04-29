import jSlide from './jSlide'

// Swipe on the slides
let touchstart = [0,0];
let touchend = [0,0];
const threshold = 150;      // required min distance traveled to be considered swipe
const restraint = 100;      // maximum distance allowed at the same time in perpendicular direction
const allowedTime = 300;    // maximum time allowed to travel that distance
// Longtouch event
const minDist = 5;          // min distance to be considered as no move on longtouch
const longtouchDelay = 600;  // time allowed for a longtouch
let timer;

/** Longtouch on the slide > openPresentationDlog
 */
jSlide.ontouchstart = function(e) {
//  e.preventDefault();
  touchstart = touchend = [e.changedTouches[0].pageX, e.changedTouches[0].pageY, new Date()];
  if (timer) clearTimeout(timer);
  // Longtouch
  timer = setTimeout(function() {
    if (Math.abs(touchstart[0] - touchend[0]) < minDist 
     && Math.abs(touchstart[1] - touchend[1]) < minDist) {
      e.preventDefault();
      jSlide.closePresentation();
      jSlide.openPresentationDlog();
    }
  }, longtouchDelay);
};

/** prevent scrolling when inside DIV
 */
jSlide.ontouchmove = function(e) {
  e.preventDefault();
};

/** Swipe left/right
 */
jSlide.ontouchend = function(e) {
  if (timer) clearTimeout(timer); 

  touchend = [e.changedTouches[0].pageX, e.changedTouches[0].pageY, new Date()];
  // Test slide
  if (touchend[2] - touchstart[2] < allowedTime
    && Math.abs(touchstart[1] - touchend[1]) < restraint) {
      // left
      if (touchstart[0] - touchend[0] > threshold) {
        touchstart[2] = 0;
        if (timer) clearTimeout(timer); 
        jSlide.next()
        console.log('next')
        e.preventDefault();
      }
      // right
      if (touchstart[0] - touchend[0] < -threshold) {
        touchstart[2] = 0;
        if (timer) clearTimeout(timer); 
        jSlide.prev();
        console.log('prev')
        e.preventDefault();
      }
  }
};

document.getElementById('slide').addEventListener("touchstart", jSlide.ontouchstart, false);
document.getElementById('slide').addEventListener("touchmove", jSlide.ontouchmove, false);
document.getElementById('slide').addEventListener("touchend", jSlide.ontouchend, false);
