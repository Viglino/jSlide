import jSlide from './jSlide'
import { saveAs } from 'file-saver';

/**
 * Read from a file
 * @param {File} file
 */
jSlide.read = function (file) {
  if (!file) return;
  if (/md$/.test(file.name)) {
    jSlide.filename = file.name;
    var reader = new FileReader();
    reader.onload = function() { 
      var res = reader.result;
      jSlide.open(res);
    };
    reader.readAsText(file);
  }
};

/**
 * Open md string
 * @param {string} slide md string
 */
jSlide.open = function (slide) {
  this.pathName = '';
  this.slide = slide;
  this.slide = this.slide.replace(/(\r\n)/g, '\n');
  this.slide = this.slide.split(/\n\[====/g);
  // Header
  var head = this.slide.shift().split('\n');
  var properties = {};
  head.forEach(function(p) {
    p = p.split(':');
    properties[p.shift().trim()] = p.join(':').trim();
  });
  this.set(properties);
  // 
  this.showPanel();
  // title
  this.current = 0;
  this.show();
};

/** Save md file
 */
jSlide.save = function () {
  var slide = '';
  for (var i in this.getProperties()) {
    slide += i + ': ' + this.get(i) + '\n';
  }
  slide +=  '[==== ' + this.slide.join('[==== ');
  var blob = new Blob([slide], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, this.filename || 'slide.md');
};

/* Drag n drop a new md
 */
jSlide.ondrop = function (ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  // Load file
  this.read(ev.dataTransfer.files[0]);
};

/* Load file using lcation hash info
 */
jSlide.onload = function (ev) {
  // Look for a file to load
  var doc = document.location.search.replace(/^\?/,'');
  // Load file
  if (doc) {
    const pathName = doc.substr(0,doc.lastIndexOf('/')+1);
    doc = './presentations/'+doc+'.md';
    var c = parseInt(document.location.hash.replace(/^#/,'')) || 1;
    if (doc) {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', doc, true);
      this.filename = doc.split('/').pop();

      // Load complete
      var self = this;
      ajax.onload = function(e) {
        self.open(this.response)
        jSlide.pathName = pathName;
        self.show(c-1);
      };

      // Oops
      ajax.onerror = function() {
      };

      // GO!
      ajax.send();
    }
  } else {
    // Create new one
    this.slide = [' title ]\n\n'+_T('new_presentation')];
    this.current = 0;
    this.showPanel();
    this.show(this.current+1);
  }
};
