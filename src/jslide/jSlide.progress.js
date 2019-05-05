import jSlide from './jSlide'

// Add progress bar
const progress = document.createElement('DIV');
progress.id = 'progress';
document.body.appendChild(progress);

jSlide.progressBar = document.createElement('DIV');
progress.appendChild(jSlide.progressBar);

/** Resize text area using progress bar
 */
let resizing = 0;
function move(e) {
  if (resizing) {
    const pageY = e.changedTouches ?  e.changedTouches[0].pageY : e.pageY;
    if (pageY > 200) {
      jSlide.editor.element.parentNode.style.height = 
      jSlide.slideDiv.style.bottom = 
      jSlide.progressBar.parentNode.style.bottom = Math.max(50, window.innerHeight - pageY -2)+'px';
      jSlide.updateSize();
    }
  }
};

progress.addEventListener('mousedown', () => { resizing=true; } );
progress.addEventListener('touchstart', () => { resizing=true; } );
document.addEventListener('mousemove', move);
document.addEventListener('touchmove', move);
document.addEventListener('mouseup', () => { resizing=false; } );
document.addEventListener('touchend', () => { resizing=false; } );