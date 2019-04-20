/**
 * jSlide object
 */
var JSlide = function() {
  this._param = {};
  this.fonts = {};
  this.progressBar = document.getElementById('progress').querySelector('div');
  this.setDefault();
  this.addListeners();
  this.setEditor();
  this.addBar();
  this.dialog = new Dlog();
};

/** Default title  */
JSlide.prototype.title = 'jSlide';
/** Default size  */
JSlide.prototype.size = [1200,900];
/** Default font size  */
JSlide.prototype.fontSize = 35;
/** Default footer  */
JSlide.prototype.footer = '| %TITLE% | %PAGE%/%LENGTH%';

/** Set property
 * @param {string|Object} k key value or a key value object
 * @param {string} v value
 */
JSlide.prototype.set = function(k,v) {
  if (typeof k === 'string') {
    if (k) {
      this._param[k] = v || this[k] || '';
      if (k==='format') {
        switch (v) {
          case '16:9': this._param.size = [1600,900]; break;
          case '4:3': this._param.size = [1200,900]; break;
          default: this._param.size = this.size;
        }
      }
    }
  } else {
    for (i in k) this.set(i, k[i]);
  }
};

/** Get propertie
 * @param {string} k key
 * @return {string} value
 */
JSlide.prototype.get = function(k) {
  switch(k) {
    case 'width': return this._param.size[0];
    case 'height': return this._param.size[1];
    default: return this._param[k];
  }
};

/** Get properties as an object
 * @return {object}
 */
JSlide.prototype.getProperties = function() {
  return this._param;
};

/** Set default properties
 */
JSlide.prototype.setDefault = function() {
  ['title', 'size', 'fontSize', 'footer'].forEach(function(p){
    this.set(p);  
  }.bind(this));
};

/**
 * 
 */
JSlide.prototype.drawSlide = function (content, page, slideshow) {
  var slide = this.slide[page];
  var pos = slide.search(']');
  var head = slide.substr(0,pos).trim().split('\n');
  var md = slide.substr(pos+1);
  var data = {
    TITLE: this.title,
    PAGE: page+1,
    LENGTH: this.slide.length
  };

  // Get slide parameters
  if (!/:/.test(head[0])) head[0] = 'className:'+head[0];
  var param = { className:'' };
  head.forEach(function(h) {
    var p = h.split(':');
    param[p.shift().trim()] = p.join(':').trim();
  });

  var element = content;
  content.className = (slideshow ? 'slideshow ' + (param.transition||'') : '').trim();

  var element = document.createElement('DIV');
  element.className = 'content';

  // Add Slide
  var div = document.createElement('DIV');
  div.className = ('slide '+param.className).trim();
  div.innerHTML = '<div class="md">'+md2html(md, data)+'</div>';
  // Create steps
  div.querySelectorAll('.step').forEach(function(e){
    var prop = e.getAttribute('data-anim');
    if (prop) {
      prop = prop.split(',');
      if (prop[0] && !/:/.test(prop[0])) {
        e.className = 'step '+prop.shift().trim();
      }
      prop.forEach(function(p) {
        p = p.split(':');
        p[0] = p[0].trim();
        switch (p[0]) {
          case 'step': 
          case 'delay': {
            e.setAttribute('data-'+p[0], p[1].trim());
            break;
          }
        }
      });
    }
  });

  // element.innerHTML = '';
  // Switch slides
  var old = content.querySelectorAll('.content');
  old.forEach(function(node) {
    node.className = node.className+' hidden';
  });
  setTimeout(function() {
    old.forEach(function(node) {
      node.remove();
    });
  }, 500);
  setTimeout(function() {
    element.className = element.className + ' visible';
  },100);

  content.appendChild(element);
  element.appendChild(div);

  this.updateSize();
  if (param.bgImage) {
    var img, d = (/\bfullscreen\b/.test(div.className)) ? element : div;
    if (/^linear-gradient|^radial-gradient/.test(param.bgImage)) {
      img = document.createElement('DIV');
      img.className = 'bgImage';
      img.style.backgroundImage = param.bgImage;
    } else {
      img = document.createElement('IMG');
      img.className = 'bgImage';
      img.src = param.bgImage;
      var setSize = function() {
        var r = d.getBoundingClientRect();
        if (r.width/img.width > r.height/img.height) img.style.width = '100%';
        else img.style.height = '100%';
      }.bind(this);
      if (img.width) setSize();
      else img.onload = setSize;
    }
    d.insertBefore(img, d.lastChild);
  }
  if (param.color) {
    div.className += ' resetColor';
    div.style.color = param.color;
  }
  if (param.fontSize) {
    div.querySelector('.md').style.fontSize = param.fontSize+'px';
  }
  this.setSlideFont(div, param.fontFamily);

  if (window.twttr) twttr.widgets.load(div);

  // Set Footer
  var footer = document.createElement('DIV');
  footer.className = 'footer';
  var c = this.get('footer').split('|');
  footer.innerHTML = '<div class="left">'+md2html(c[0]||'', data)+'</div>'
  +'<div class="middle">'+md2html(c[1]||'', data)+'</div>'
  +'<div class="right">'+md2html(c[2]||'', data)+'</div>';
  div.appendChild(footer);
};

/**
 * 
 */
JSlide.prototype.setSlideFont = function (div, font) {
  if (font) {
    div.style.fontFamily = font;
    this.loadFont(font);
  }
};

/** Show slides in left panel
 */
JSlide.prototype.showPanel = function (slide) {
  if (slide) {
    var li = document.querySelectorAll('#panel > li > div');
    this.drawSlide(li[slide],slide);
  } else {
    var panel = document.getElementById('panel');
    panel.innerHTML = '';
    this.slide.forEach(function(s, i) {
      var li = document.createElement('LI');
      var element = document.createElement('DIV');
      panel.appendChild(li);
      li.appendChild(element);
      this.drawSlide(element,i);
      li.addEventListener('click', function(){
        this.show(i);
      }.bind(this));
    }.bind(this));
  }
};

/** Show a slide
 * @param {number} n position, default current slide
 */
JSlide.prototype.show = function (n) {
  if (!this.slide || !this.slide.length) return;
  var element = document.getElementById('slide');
  // current slide
  if (n!==undefined) this.current = n;
  this.current = Math.max(0, Math.min(this.current, this.slide.length-1));

  // Set location
  if (history.replaceState) history.replaceState(null, null, '#'+(this.current+1));
  else location.hash = '#'+(this.current+1);

  // Draw slide
  this.drawSlide(element, this.current, this.slideshow);

  // Select current slide in the panel
  var li = document.querySelectorAll('#panel > li');
  li.forEach(function (l, i) {
    if (i===this.current) {
      l.className='selected';
      var r = l.getBoundingClientRect();
      var ul = document.getElementById('panel');
      ul.scrollTop = l.offsetTop + r.height/2 - ul.getBoundingClientRect().height/2;
    } else {
      l.className = '';
    }
  }.bind(this));

  // Insert edition
  this.editor.setText('[===='+this.slide[this.current]);

  // Set progress bar
  this.progressBar.style.width = (100 * this.current / (this.slide.length-1)||0)+'%';

  if (this.presentation) {
    this.drawSlide(this.presentation, this.current, this.slideshow);
    var p = this.presentation.ownerDocument.getElementById('progress').querySelector('div');
    p.style.width = (100 * this.current / (this.slide.length-1)||0)+'%';
  }
};

/** Show next step
 * @param {Element} elt DOM element to searchin
 */
JSlide.prototype.nextStep = function (elt) {
  var step = [];
  // Get all steps (visible)
  elt.querySelectorAll('.step').forEach(function(e){
    if (!/visible/.test(e.className)) step.push(e);
  });
  if (step.length) {
    // Sort steps by count
    step = step.sort(function(a,b) {
      return parseInt(a.getAttribute('data-step')||0) - parseInt(b.getAttribute('data-step')||0);
    });
    step[0].className = step[0].className+' visible';
    // Show delay steps
    function delayShow(s) {
      setTimeout(function(){
        s.className = s.className+' visible';
      }, parseInt(100*s.getAttribute('data-delay')));
    }
    for (var i=1; i<step.length; i++) {
      if (step[i].getAttribute('data-delay')) {
        delayShow(step[i]);
      } else break;
    };
    return true;
  }
  return false;
}

/** Go to previous Step
 * @param {Element} elt DOM element to searchin
 */
JSlide.prototype.prevStep = function (elt) {
  // Get all steps (visible)
  var step = [];
  elt.querySelectorAll('.step').forEach(function(e){
    if (/visible/.test(e.className)) step.push(e);
  });
  if (step.length) {
    // Show delay steps
    step = step.sort(function(a,b) {
      return parseInt(a.getAttribute('data-step')||0) - parseInt(b.getAttribute('data-step')||0);
    });
    // Remove
    step[step.length-1].className = step[step.length-1].className.replace('visible','').trim();
    return true;
  }
  return false;
}

/** Show next slide
 */
JSlide.prototype.next = function () {
  // Get next step
  if (this.slideshow) {
    if (this.nextStep(document.getElementById('slide'))) {
      if (this.presentation) this.nextStep(this.presentation);
      return;
    }
  }
  if (this.current < this.slide.length-1) this.show(++this.current);
};

/** Show previous slide
 */
JSlide.prototype.prev = function () {
  if (this.slideshow) {
    if (this.prevStep(document.getElementById('slide'))) {
      if (this.presentation) this.prevStep(this.presentation);
      return;
    }
  }
  if (this.current) this.show(--this.current);
};

/** Update slides size
 */
JSlide.prototype.updateSize = function() {
  var resize = function (s){
    var height = s.parentNode.clientHeight;
    var width = s.parentNode.clientWidth;
    s.style.width = this.get('width')+'px';
    s.style.height = this.get('height')+'px';
    s.style.fontSize = this.get('fontSize')+'px';
    this.setSlideFont (s, this.get('fontFamily'));
    var sc = Math.min (width / this.get('width'), height / this.get('height'));
    s.style.webkitTransform = s.style.transform = 'translate(-50%, -50%) scale('+sc+')';
  }.bind(this);
  document.body.querySelectorAll('.slide').forEach(resize);
  if (this.presentation) {
    this.presentation.querySelectorAll('.slide').forEach(resize);
  }
};

/** Handle keydown avent
 */
JSlide.prototype.onkeydown = function(e) {
  switch (e.keyCode) {
    case 39:
    case 40:
    case 34: {
      this.next();
      e.preventDefault();
      break;
    }
    case 37:
    case 38:
    case 33: {
      this.prev();
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

JSlide.prototype.addListeners = function() {
  // Resize slide on resize 
  window.addEventListener('resize', this.updateSize.bind(this));
  // Handle key down 
  document.addEventListener('keydown', this.onkeydown.bind(this), false);
  // Handle drag'n'drop
  document.body.addEventListener('drop', this.ondrop.bind(this));
  document.body.addEventListener('dragover', function (ev) {
    ev.preventDefault();
  });
  // Load file onload
  window.addEventListener('load', this.onload.bind(this));
};

JSlide.prototype.loadFont = function(font, doc) {
  if (!doc) {
    this.loadFont(font, document);
    if (this.presentation) this.loadFont(font, this.presentation.ownerDocument);
    return;
  } else {
    var elt = doc.getElementById('font-'+font);
    if (!elt) {
      var fileref = doc.createElement("link");
      fileref.setAttribute('id', 'font-'+font);
      fileref.setAttribute('rel', 'stylesheet');
      fileref.setAttribute('type', 'text/css');
      fileref.setAttribute('href', 'https://fonts.googleapis.com/css?family='+font);
      doc.getElementsByTagName('head')[0].appendChild(fileref)
    }
  }
};
var i19n = {
  lang: (navigator.language || navigator.userLanguage).split('-').shift(),
  en: {}
};

function _T(k) {
  return (i19n[i19n.lang] || i19n.en)[k] || i19n.en[k] || k;
};
/**
 * @class
 */
var Dlog = function() {
  this.element = this.createElement('DIV', document.body);
  this.element.className = 'dlog-back';
  this.dlog = this.createElement('DIV', this.element);
  this.dlog.className = 'dlog';
};

/** Create an element
 */
Dlog.prototype.createElement = function(el, parent, html){
  var d = document.createElement(el);
  if (html) d.innerHTML = html;
  parent.appendChild(d);
  return d;
};

/** Show a dialog
 * @param {*} options
 *  @param {string|Element} options.title
 *  @param {string|Element} options.content
 *  @param {*} options.buttons a list of buttons
 */
Dlog.prototype.show = function(options) {
  this.element.className = 'dlog-back visible';
  if (options) {
    this.dlog.innerHTML = '';
    if (options.title) {
      if (typeof options.title === 'string') {
        this.createElement('H1', this.dlog, options.title)
      } else {
        this.dlog.appendChild(options.title);
      }
    }
    if (options.content) {
      if (typeof options.content === 'string') {
        this.createElement('DIV', this.dlog, options.content)
      } else {
        this.dlog.appendChild(options.content);
      }
    }
    if (options.buttons) {
      var bar = this.createElement('DIV', this.dlog);
      bar.className = 'buttons';
      for (var b in options.buttons) {
        var but = this.createElement('BUTTON', bar, _T(b));
        if (typeof options.buttons[b] === 'function') but.addEventListener('click', options.buttons[b]);
        but.addEventListener('click', function(){ this.hide() }.bind(this));
      };
    }
  }
};

/** Hide the dialog
 */
Dlog.prototype.hide = function() {
  this.element.className = 'dlog-back';
};

i19n.en = {
  ok: 'OK',
  cancel: 'Cancel',
  show_presentation: `
    <div class="edition">edition</div>
    <div class="inside">presentation</div>
    <div class="duplicate">clone view</div>
  `
}
i19n.fr = {
  ok: 'OK',
  cancel: 'Annuler'
}
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
/**
*	Copyright (c) 2016 Jean-Marc VIGLINO (https://github.com/Viglino),
*	released under the MIT license (French BSD license)
* 
* @file jSlide editor
* @author Jean-Marc VIGLINO (https://github.com/Viglino)
*/
/** JSlide editor
 */
JSlide.editor = function(jslide) {
  this.jSlide = jslide;
  this.element = document.getElementById('editor').querySelector('textarea');
  // Add listeners
  this.element.addEventListener('keydown', this.onkeydown.bind(this));
  this.element.addEventListener('change', this.onchange.bind(this));
};

/**
 * Get the editor text
 * @return {string}
 */
JSlide.editor.prototype.getText = function() {
  return this.element.value;
};

/** Set editor text
 * @param {string} md
 */
JSlide.editor.prototype.setText = function(md) {
  this.element.value = md;
};

/** Insert char at current position
 * @param {char} c
 */
JSlide.editor.prototype.insertChar = function(c) {
  if (this.element.selectionStart || this.element.selectionStart == '0') {
    var startPos = this.element.selectionStart;
    var endPos = this.element.selectionEnd;
    this.element.value = this.element.value.substring(0, startPos)
      + c
      + this.element.value.substring(endPos, this.element.value.length);
      this.element.selectionEnd = this.element.selectionStart = startPos+1;
  } else {
    this.element.value += c;
  }
};

/** Something as changed
 */
JSlide.editor.prototype.onchange = function(panel) {
  this.jSlide.slide[this.jSlide.current] = this.getText().replace(/^\[====/,'');
  this.jSlide.show();
  if (panel) this.jSlide.showPanel(this.jSlide.current);
};

/** Handle keydown event
 * @param {Event} e
 */
JSlide.editor.prototype.onkeydown = function(e) {
  if (e.keyCode === 116) return;
  if (!e.ctrlKey || e.keyCode < 60) {
    e.stopPropagation();
    switch (e.keyCode) {
      case 9: { 
        this.insertChar('\t');
        e.preventDefault()
        break;
      }
      case 13:
        this.insertChar('\n');
      case 27: {
        this.onchange(false);
        e.preventDefault();
        break;
      }
      default: break;
    }
  }
};

/** Set editor
 */
JSlide.prototype.setEditor = function() {
  this.editor = new JSlide.editor(this);
};
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
  // Look for a file to load
  var doc = document.location.search.replace(/^\?/,'');
  // Load file
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
  } else {
    // Create new one
    this.slide = [' title ]\n# New presentation\n## Subtitle'];
    this.current = 0;
    this.showPanel();
    this.show(this.current+1);
  }
};

/*
*  Copyright (c) 2016 Jean-Marc VIGLINO (https://github.com/Viglino),
*  released under the MIT license (French BSD license)
*/
/*eslint no-useless-escape: "off" */
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/

/** Simple markdown to html convertor
 * @param {String} md the markdown text
 * @param {} data a list of key value to replace in the markdown %key%
 * @return {HTMl} HTML code
 */
var md2html = function (md, data) {
  var i;
  data = data || {};
  // Encoder les URI
  for (i in data) {
    if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(data[i])
      && !/%/.test(data[i])){
      data[i] = encodeURI(data[i]).replace(/\'/g,"%27");
    }
  }

  // md string
  md = "\n" + md +"\n";

  // Handle icons
  md = md2html.doIcons(md);

  // Table management
  md = md2html.doTable(md);
  // Data management
  md = md2html.doData(md, data);
  // RegEpx rules
  for (i=0; i<md2html.rules.length; i++) {
    md = md.replace(md2html.rules[i][0], md2html.rules[i][1]);
  }
  // Handle blocks
  md = md2html.doBlocks(md);
  // Clean up
  md = md2html.cleanUp(md);
//  console.log(md)

  // Floating images
  md = md2html.floatingImages(md);
  return md;
};

/** Transform md to simple text
 * /
var md2text = function (md, data) {
    return md2html.doData(md, data);

    //return $("<div>").html(md2html(md, data)).text();
}
/**/

/** 
 * floating images
 */
md2html.floatingImages = function (md) {
  md = md.replace (/<div class='right'><img([^\<]*)<\/div>/g,"<img class='floatRight' $1");
  md = md.replace (/<div class='left'><img([^\<]*)<\/div>/g,"<img class='floatLeft' $1");
  md = md.replace (/<a ([^\<]*)<br \/><img/g,"<a $1<img");
  return md;
};

/**
 * Create animated blocks
 */
md2html.doBlocks = function (md) {
  md = md.replace(/\[--(\(([^\)]*)\))?\n?/g, '<div class="step" data-anim="$2">');
  md = md.replace(/\--\]\n/g, '</div><br/>');
  md = md.replace(/\--\]/g, '</div>');
  return md;
};


/** Add new rule
*  @param {RegExp} rex RegExp to use in replacement
*  @param {string} rep replacement string
*  @return {string} result md
*/
md2html.addRule = function(rex, rep) {
  md2html.rules.push(rex, rep);
};

/**
 * Create icon font
 */
md2html.doIcons = function(md) {
  md = md.replace(/:([a-z]*)-([_,a-z,0-9,-]*):(([a-z,0-9,-]*)?( ([a-z,0-9,-]+))?:)?(([#,0-9,a-z,A-Z]*):)?/g, '<i class="fa fa-fw $1-$2 fa-$4 fa-$6" style="color:$8"></i>');
  return md;
};

/** A list of key value to replace as %key% > value in md
*  @param {string} md the markdown
*  @param {Objevt} data list of key/value
*  @return {string} result md
*/
md2html.doData = function(md, data) {
  for (var i in data) if (data[i]) {
    md = md.replace(new RegExp("%"+i+"%",'g'), data[i]);
  }
  return md;
};

/** Table handler
*  @param {string} md the markdown
*  @return {string} result md
*/
md2html.doTable = function(md) {
  // Detect ---- | ----
  md = md.replace(/\n\ ?-{3,}\ ?\|/g, '<table></table>|');
  while (/<\/table>\|\ ?-{3,}/.test(md)) {
    md = md.replace(/<\/table>\|\ ?-{3,}\ ?/g, '</table>');
  }
  // Header
  md = md.replace(/(.*)<table>/g, '<table><tr><td>$1</td></tr>');
  while (/<td>(.*)\|/.test(md)) {
    md = md.replace(/<td>(.*)\|/g, '<td>$1</td><td>');
  }
  // Lines
  while (/<\/table>\n([^\n]*)\|/.test(md)) {
    md = md.replace(/<\/table>\n(.*)/g, '<tr><td>$1</td></tr></table>');
    while (/<td>(.*)\|/.test(md)) {
      md = md.replace(/<td>(.*)\|/g, '<td>$1</td><td>');
    }
  }
  md = md.replace(/<\/table>\n/g,"</table>");
  md = md.replace(/<td>\t/g,"<td class='center'>");
  return md;
};

/** Clean endl
*  @param {string} md the markdown
*  @return {string} result md
*/
md2html.cleanUp = function(md) {  
  md = md.replace(/(\<\/h[1-5]\>)\n/g, "$1");
  md = md.replace(/^\n/, '');
  if (md==='\n') md = '';

  // Remove timeline tweet
  md = md.replace(/data-tweet-limit\=\"\"/g,'data-tweet-limit="1"');
  md = md.replace (/<div class='right'><a class="twitter-/g,"<div class='floatRight'><a class=\"twitter-")
  md = md.replace (/<div class='left'><a class="twitter-/g,"<div class='floatLeft'><a class=\"twitter-")
  md = md.replace (/<div class='right'><blockquote /g,"<div class='floatRight' style=\"min-width:200px\"><blockquote ")
  md = md.replace (/<div class='left'><blockquote /g,"<div class='floatLeft' style=\"min-width:200px\"><blockquote ")
  // Facebook
  md = md.replace (/URL_PAGE_CARTE/g, encodeURIComponent(window.location.href));
  
  // Collapsible blocks
  md = md.replace(/mdBlockTitle\">\n/g,'mdBlockTitle">');
  md = md.replace(/mdBlockContent\">\n/g,'mdBlockContent">');
  md = md.replace(/\n<\/label>/g,'</label>');
  md = md.replace(/\n<\/div><\/div>/g,'</div><\/div>');
  md = md.replace(/<\/div>\n/g,'</div>');

//  md = md.replace(/<\/ul>\n{1,2}/g, '</ul>');
//  md = md.replace(/\<\/ol\>\n{1,2}/g, '</ol>');

  md = md.replace(/<\/p>\n/g, '</p>');

  md = md.replace(/(\<\/h[0-9]>)\n/g, '$1');
  md = md.replace(/(\<hr \/>)\n/g, '$1');
  md = md.replace(/^\n/, '');
  md = md.replace(/^\n/, '');
  md = md.replace(/\n$/, '');
  md = md.replace(/\n/g, '<br />');
  md = md.replace(/\t/g, ' ');
  md = md.replace(/\<\/ol><br \/>/g, '</ol>');
  md = md.replace(/\<\/ul><br \/>/g, '</ul>');

  return md;
};

/** Array of RegExp rules for conversion
*/
md2html.rules = [
  // Headers
  [/#?(.*)\n={5}(.*)/g, "<h1>$1</h1>"],        // h1
// [/#?(.*)\n\-{5}(.*)/g, "<h2>$1</h2>"],        // h2

  [/\n#{6}(.*)/g, "\<h6>$1</h6>"],          // h5
  [/\n#{5}(.*)/g, "\n<h5>$1</h5>"],          // h5
  [/\n#{4}(.*)/g, "\n<h4>$1</h4>"],          // h4
  [/\n#{3}(.*)/g, "\n<h3>$1</h3>"],          // h3
  [/\n#{2}(.*)/g, "\n<h2>$1</h2>"],          // h2
  [/\n#{1}(.*)/g, "\n<h1>$1</h1>"],          // h1

  [/<h([1-6])>\t/g, "<h$1 class='center'>"],      // Center header with tab

  // Blocks
  [/\n\&gt\;(.*)/g, '<blockquote>$1</blockquote>'],  // blockquotes
  [/\<\/blockquote\>\<blockquote\>/g, '\n'],      // fix
  [/\n-{5,}/g, "\n<hr />"],              // hr

  // Lists
  [/\n\* (.*)/g, '\n<ul><li>$1</li></ul>'],      // ul lists
  [/\n {1,}\*\ ([^\n]*)/g, '<ul2><li>$1</li></ul2>'],  // ul ul lists
  [/\n\t\*\ ([^\n]*)/g, '<ul2><li>$1</li></ul2>'],  // ul ul lists
  [/<\/ul2><ul2>/g, ''],                // concat
  [/<\/ul><ul2>([^\n]*)<\/ul2>\n/g, '<ul>$1</ul></ul>'],// indent
  [/\n\<ul\>/g, '<ul>'],                // fix
  [/<\/ul><ul>/g, ''],                // concat

  // Ordered list
  [/\n[0-9]+\.(.*)/g, '<ol><li>$1</li></ol>'],    // ol lists
  [/\<\/ol\>\<ol\>/g, ''],              // fix

  // Automatic links
  [/([^\(])([ |\n]https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))( ?)/g, '$1<a href=\'$2\' target="_blank">$2</a>'],
  // Mailto
  [/([^\(])\bmailto\b\:(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)/gi, '$1<a href=\'mailto:$2\'>$2</a>'],


  /* Twitter */

  // Twitter Share
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/share ?(\d+)?x?(\d+)?\)/g,
    '<a href="https://twitter.com/share" data-text="$2" data-hashtags="macarte" data-related="IGNFrance" class="twitter-share-button" data-size="large" data-show-count="true">Tweet</a>'],

  // User timeline
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^\/)]*)\/timeline ?(\d+)?x?(\d+)?\)/g,
    '<a class="twitter-timeline" href="https://twitter.com/$3" data-tweet-limit="$4" data-width="$5"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],
  // Twitter timeline
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^\/)]*)\/timelines\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<a class="twitter-timeline" href="https://twitter.com/$3/timelines/$4" data-tweet-limit="$5" data-width="$6"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],
  // Twitter grid
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^\/)]*)\/timegrid\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<a class="twitter-grid" href="https://twitter.com/$3/timelines/$4" data-limit="$5"  data-width="$6"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],
  // Tweet
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<blockquote class="twitter-tweet" data-cards="$4hidden" data-dnt="true" data-width="$5" width="$5"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],

  // FaceBook like
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/www.facebook.com\/like ?(\d+)?x?(\d+)?\)/g,
    '<iframe src="https://www.facebook.com/plugins/like.php?href=URL_PAGE_CARTE&width=136&layout=button_count&action=like&size=small&show_faces=false&share=true&height=20&appId" width="136" height="20" class="facebook-share-button" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'],

  // Page FaceBook
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/www.facebook.com\/([^\/)]*)\/posts\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F$3%2Fposts%2F$4&width=$5&height=$6" width="$5" height="$6" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'],
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/www.facebook.com\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F$3&tabs=timeline&width=$4" width="$4" height="$5" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'],

  /* Media */

  // INA.fr
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/player.ina.fr\/player\/embed\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" width="300" height="180" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="overflow:hidden;width:$4px; height:$5px;" src="https://player.ina.fr/player/embed/$3/wide/0" allowfullscreen></iframe>'],
  // INA/Jalon
  [ /\!(\[([^\[|\]]+)?\])?\(InaEdu([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" width="300" height="180" style="width:$4px; height:$5px;" src="https://fresques.ina.fr/jalons/export/player/InaEdu$3/360x270" allowfullscreen></iframe>'],
  // Youtube
  [ /\!(\[([^\[|\]]+)?\])?\(https?:\/\/youtu.be\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" width="300" height="180" style="width:$4px; height:$5px;" src="https://www.youtube.com/embed/$3" frameborder="0" allowfullscreen></iframe>'],
  // Dailymotion
  [ /\!(\[([^\[|\]]+)?\])?\(https?:\/\/dai.ly\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" frameborder="0" width="300" height="180" style="width:$4px; height:$5px;" src="https://www.dailymotion.com/embed/video/$3" allowfullscreen></iframe>'],
  // Vimeo
  [ /\!(\[([^\[|\]]+)?\])?\(https?:\/\/vimeo.com\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" frameborder="0" width="300" height="180" style="width:$4px; height:$5px;" src="https://player.vimeo.com/video/$3" allowfullscreen></iframe>'],

  // Audio
  [/\!(\[([^\[|\]]+)?\])?\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\(\)]*)\.mp3) ?(\d+)?x?(\d+)?\)/g,
    '<audio controls style="width:$6px; height:$7px;" title="$2"><source src="$3" type="audio/mpeg">Your browser does not support the audio element.</audio>'],
  // Video
  [/\!(\[([^\[|\]]+)?\])?\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\(\)]*)\.mp4) ?(\d+)?x?(\d+)?\)/g,
    '<video controls style="width:$6px; height:$7px;" title="$2"><source src="$3" type="video/mp4">Your browser does not support the video tag.</video>'],

  // Internal images
  [/\!(\[([^\[|\]]+)?\])?\((.*\.(jpe?g|png|gif|svg)) ?(\d+)?x?(\d+)?\)/g,
    '<img style="width:$5px; height:$6px;" src="$3" title="$2" />'],

  // Images
  [/!(\[([^[|\]]+)?\])?\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=()]*)) ?(\d+)?x?(\d+)?\)/g,
    '<img style="width:$6px; height:$7px;" src="$3" title="$2" />'],
  // Local images
  [/!(\[([^[|\]]+)?\])?\((file:\/\/\/([-a-zA-Z0-9@:%_+.~#?&//=()]*)) ?(\d+)?x?(\d+)?\)/g,
    '<img style="width:$5px; height:$6px;" src="$3" title="$2" />'],

  // links
  [/\[([^[]+)?\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))( ?)([^)]*)\)/g,
    '<a href=\'$2\' title="$6" target="_blank">$1</a>'],
  [/\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))( ?)([^)]*)\)/g,
    '<a href=\'$1\' title="$5" target="_blank">$1</a>'],
  // Mailto
  [/\[([^[]+)?\]\(\bmailto\b:(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)\)/gi, '<a href=\'mailto:$2\'>$1</a>'],
  [/\(\bmailto\b:(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)\)/gi, '<a href=\'mailto:$1\'>$1</a>'],
  // tel
  [/\[([^[]+)?\]\(tel:([0-9+-]+)\)/g, '<a href=\'tel:$2\'>$1</a>'],
  [/\(tel:([0-9+-]+)\)/g, '<a href=\'tel:$1\'>$1</a>'],

  // Code
  [/`(.*?)`/g, '<code>$1</code>'],              // inline code
  [/\n {4,}(.*)/g, '<pre>$1</pre>'],            // Code
  [/\n\t(.*)/g, '<pre>$1</pre>'],               // Code
  [/<\/pre><pre>/g, '<br/>'],                   // fix
  [/<\/pre>\n/g, '</pre>'],                     // fix

  // format
  [/(\\\*)/g, '&#42;'],                         // escape *
  [/(\*\*)([^]*?)\1/g, '<strong>$2</strong>'],  // bold
  [/(\*)([^]*?)\1/g, '<em>$2</em>'],            // emphasis
  [/<strong><\/strong>/g, '****'],              // fix bold
  [/<em><\/em>/g, '**'],                        // fix em
  [/(__)(.*?)\1/g, '<u>$2</u>'],                // underline
  [/(~~)(.*?)\1/g, '<del>$2</del>'],            // del

  // alignement https://github.com/jgm/pandoc/issues/719
  [/\n\|<>([^\n]*)/g, "\n<pc>$1</pc>"],       // center |<>
  [/\n\|\t([^\n]*)/g, "\n<pc>$1</pc>"],       // center |[tab]
  [/\n\|<([^\n]*)/g, "\n<pl>$1</pl>"],        // left |<
  [/\n\|>([^\n]*)/g, "\n<pr>$1</pr>"],        // rigth |>
  [/<\/pc>\n<pc>/g, "<br/>"],
  [/<\/pl>\n<pl>/g, "<br/>"],
  [/<\/pr>\n<pr>/g, "<br/>"],
  [/<pc>/g, "<div class='center'>"],          // fix
  [/<pl>/g, "<div class='left'>"],            // fix
  [/<pr>/g, "<div class='right'>"],           // fix
  [/<\/pc>|<\/pl>|<\/pr>/g, "</div>"],        // fix

  //
  [/\(c\)/g, "&copy;"],                 // (c)
  [/\(r\)/g, "&reg;"],                  // (R)
  [/\(TM\)/g, "&trade;"]                // (TM)

];

