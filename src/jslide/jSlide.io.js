import jSlide from './jSlide'
import { saveAs } from 'file-saver';
import settings from './jSlide.settings';

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
    if (p) {
      p = p.split(':');
      properties[p.shift().trim()] = p.join(':').trim();
    }
  });
  this.set(properties);

  // Get slide headers
  this.slide.forEach((slide, i) => {
    var pos = slide.search(']\n');
    var head = slide.substr(0,pos).trim().split('\n');
    var md = slide.substr(pos+2);
    // Get slide parameters
    if (!/:/.test(head[0])) head[0] = 'className:'+head[0];
    var param = { className:'' };
    head.forEach(function(h) {
      var p = h.split(':');
      param[p.shift().trim()] = p.join(':').trim();
    });
    this.slide[i] = {
      head: param,
      md: md
    }
  });

  // 
  this.showPanel();
  // title
  this.current = 0;
  this.show();
};

/** Save md file
 */
jSlide.save = function () {
  let i, slide = '';
  for (i in this.getProperties()) {
    if (i!=='size' && this.get(i) !== settings[i].default) slide += i + ': ' + this.get(i) + '\n';
  }
  this.slide.forEach((s) => {
    slide += '[==== '+s.head.className+'\n';
    for (i in s.head) {
      if (i !== 'className') {
        slide += '  ' + i + ': ' + s.head[i] + '\n';
      }
    }
    slide += ']\n';
    slide += s.md + '\n';
  });
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

/* Load file using location hash info
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
    this.slide = [{
      head: { className: 'title' },
      md: _T('new_presentation')
    }];
    this.current = 0;
    this.showPanel();
    this.show(this.current+1);
  }
};
