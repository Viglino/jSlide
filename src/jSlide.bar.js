/**
*	Copyright (c) 2016 Jean-Marc VIGLINO (https://github.com/Viglino),
*	released under the MIT license (French BSD license)
* 
* @file Editor bar
* @author Jean-Marc VIGLINO (https://github.com/Viglino)
*/
/** Set the editor bar
 */
JSlide.prototype.addBar = function() {
  var bar = document.getElementById('header');
  // Add button to the bar
  function addButton(className, click) {
    var b = document.createElement('BUTTON');
    // Save
    b.className = className;
    b.addEventListener('click', click);
    bar.appendChild(b);
    return b;  
  }
  addButton('addSlide', function() {
    this.slide.splice(this.current+1,0,']');
    this.showPanel();
    this.show(this.current+1);
  }.bind(this));
  addButton('open');
  addButton('save', this.save.bind(this));
  addButton('present', this.openPresentation.bind(this));
  addButton('slideshow', this.showPresentation.bind(this));
};

/** Show presentation
 */
JSlide.prototype.showPresentation = function() {
  this.slideshow = !this.slideshow;
  this.step = 0;
  this.show();
};

/** Open in a new window */
JSlide.prototype.openPresentation = function() {
  this.dialog.show({
    content: _T('show_presentation'),
    buttons: {
      cancel: 1
    }
  });
  return;
  var w = window.open ('./presentation.html'+(this.presentation?'#':''), 'jSlidePresentation', 'channelmode=0, directories=0, location=0, menubar=0, status=0, titlebar=0, toolbar=0, copyhistory=no');
  w.document.title = window.document.title;
  var pres = w.document.querySelector('div');
  // Create presentation page
  var create = function(){
    this.presentation = w.document.querySelector('div');
    w.addEventListener('resize', this.updateSize.bind(this));
    w.document.addEventListener('keydown', this.onkeydown.bind(this), false);
    w.document.addEventListener('click', function() {
      this.next();
    }.bind(this));
    w.document.addEventListener('keydown', function(e) {
      // F5 = fullscreen
      if (e.keyCode===116 && w.document.documentElement.requestFullscreen) {
        if (w.fullScreen) {
          w.document.exitFullscreen();
          w.fullScreen = false;
          this.updateSize();
        }
        else {
          w.document.documentElement.requestFullscreen();
          w.fullScreen = true;
          this.updateSize();
        }
        e.preventDefault();
      }
    }.bind(this));
    this.show();
  }.bind(this);
  if (!this.presentation && pres) {
    setTimeout (create, 500);
  }
  w.onload = create;
  // Remove preentation on unload
  w.onunload = function() {
    this.presentation = null;
  }.bind(this);
};