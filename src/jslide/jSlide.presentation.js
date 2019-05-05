import jSlide from './jSlide'

jSlide.closePresentation = function() {
  if (jSlide.presentation) jSlide.presentation.ownerDocument.defaultView.close();
};

jSlide.openPresentation = function() {
  var w = window.open ('', 'jSlidePresentation', 'channelmode=0, directories=0, location=0, menubar=0, status=0, titlebar=0, toolbar=0, copyhistory=no');
  
  // Copy head section
  w.document.head.innerHTML = document.head.innerHTML;
  w.jSlide = jSlide;
  // Restore link path
  var links = w.document.querySelectorAll('link');
  document.querySelectorAll('link').forEach((l, i) => {
    if (l.href) {
      links[i].href = l.href;
    }
  });

  // Presentation div
  if (!jSlide.presentation) {
    const slideDiv = w.document.createElement('DIV');
    slideDiv.id = 'slide';
    w.document.body.appendChild(slideDiv);
    jSlide.presentation = slideDiv;

    // Add progress bar
    const progress = document.createElement('DIV');
    progress.id = 'progress';
    w.document.body.appendChild(progress);
    progress.appendChild(document.createElement('DIV'));
    w.document.body.className = 'presentation';
    
    w.addEventListener('resize', (e) => { jSlide.updateSize(e); });
    /* Next slide
    w.document.addEventListener('click', function() {
      jSlide.next();
    });
    */
    // Longtouch / slide
    w.document.getElementById('slide').addEventListener("touchstart", jSlide.ontouchstart, false);
    w.document.getElementById('slide').addEventListener("touchmove", jSlide.ontouchmove, false);
    w.document.getElementById('slide').addEventListener("touchend", jSlide.ontouchend, false);
    // Fullscreen
    w.document.addEventListener('keydown', (e) => {
      // F5 = fullscreen
      if (e.keyCode===116 && w.document.documentElement.requestFullscreen) {
        console.log('fullscreen')
        if (w.fullScreen) {
          w.document.exitFullscreen();
          w.fullScreen = false;
          jSlide.updateSize();
        }
        else {
          w.document.documentElement.requestFullscreen();
          w.fullScreen = true;
          jSlide.updateSize();
        }
        e.preventDefault();
        e.stopPropagation();
      } else {
        jSlide.onkeydown(e);
      }
    });

    // Remove presentation on unload
    w.onunload = function() {
      jSlide.presentation = null;
    };
  }

  jSlide.show();
  setTimeout(() => { jSlide.updateSize(); });
};

/** Start presentation mode
 * @param {boolean} b
 */
jSlide.startPresentation = function(b) {
  jSlide.slideshow = (b!==false);
  jSlide.step = 0;
  jSlide.show();
};

/** Stop presentation mode
 */
jSlide.stopPresentation = function() {
  jSlide.startPresentation(false);
}

/** Open in a new window */
jSlide.openPresentationDlog = function() {
  this.dialog.show({
    content: _T('show_presentation'),
    buttons: {
      cancel: 1
    }
  });
}


