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
    this.slide.splice(this.current+1,0,'');
    this.showPanel();
    this.show(this.current+1);
  }.bind(this));
  addButton('open');
  addButton('save', this.save.bind(this));
  addButton('present', this.openPresentation.bind(this));
};

/** Open in a new window */
JSlide.prototype.openPresentation = function() {
  var w = window.open ('./presentation.html'+(this.presentation?'#':''), 'jSlidePresentation', 'channelmode=0, directories=0, location=0, menubar=0, status=0, titlebar=0, toolbar=0, copyhistory=no');
  w.document.title = window.document.title;
  var pres = w.document.querySelector('div');
  if (!this.presentation && pres) {
    setTimeout(function() {
      this.presentation = w.document.querySelector('div');
      w.addEventListener('resize', this.updateSize.bind(this));
      w.document.addEventListener('keydown', this.onkeydown.bind(this), false);
      this.show();
    }.bind(this),500)
  }
  w.onload = function() {
    this.presentation = w.document.querySelector('div');
    w.addEventListener('resize', this.updateSize.bind(this));
    w.document.addEventListener('keydown', this.onkeydown.bind(this), false);
    this.show();
  }.bind(this);
  w.onunload = function() {
    this.presentation = null;
  }.bind(this);
};