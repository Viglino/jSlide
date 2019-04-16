/**
*	Copyright (c) 2016 Jean-Marc VIGLINO (https://github.com/Viglino),
*	released under the MIT license (French BSD license)
* 
* @file jSlide input/output
* @author Jean-Marc VIGLINO (https://github.com/Viglino)
*/

/**
 * Read from a file
 * @param {File} file
 */
JSlide.prototype.read = function (file) {
  if (!file) return;
  if (/md$/.test(file.name)) {
    this.filename = file.name;
    var reader = new FileReader();
    reader.onload = function() { 
      var res = reader.result;
      this.open(res);
    }.bind(this);
    reader.readAsText(file);
  }
};

/**
 * Open md string
 * @param {string} slide md string
 */
JSlide.prototype.open = function (slide) {
  this.slide = slide;
  this.slide = this.slide.replace(/(\r\n)/g, '\n');
  this.slide = this.slide.split(/\[====/g);
  // Header
  var head = this.slide.shift().split('\n');
  var properties = {};
  head.forEach(function(p) {
    p = p.split(':');
    properties[p.shift().trim()] = p.join(':').trim();
  }.bind(this));
  this.set(properties);
  // 
  this.showPanel();
  // title
  this.current = 0;
  this.show();
};

/** Save md file
 */
JSlide.prototype.save = function () {
  var slide = '';
  for (var i in this.getProperties()) {
    slide += i + ': ' + this.get(i) + '\n';
  }
  slide +=  '==== ' + this.slide.join('[==== ');
  var blob = new Blob([slide], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, this.filename || 'slide.md');
};

/* Drag n drop a new md
 */
JSlide.prototype.ondrop = function (ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  // Load file
  this.read(ev.dataTransfer.files[0]);
};

/* Load file using lcation hash info
 */
JSlide.prototype.onload = function (ev) {
  var doc = document.location.search.replace(/^\?/,'');
  
  if (doc) {
    doc += '.md';
    var c = parseInt(document.location.hash.replace(/^#/,'')) || 1;
    if (doc) {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', doc, true);
      this.filename = doc.split('/').pop();

      // Load complete
      var self = this;
      ajax.onload = function(e) {
        self.open(this.response)
        self.show(c-1);
      };

      // Oops
      ajax.onerror = function() {
      };

      // GO!
      ajax.send();
    }
  }
};
