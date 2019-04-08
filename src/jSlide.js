/**
 * jSlide object
 */
var JSlide = function() {
  this._param = {};
  this.fonts = {};
  this.progressBar = document.getElementById('progress').querySelector('div')
  this.setDefault();
  this.addListeners();
  this.setEditor();
  this.addBar();
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
JSlide.prototype.drawSlide = function (element, page) {
  var slide = this.slide[page];
  var pos = slide.search('\n');
  var head = slide.substr(0,pos).trim().split(',');
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

  // Add Slide
  var div = document.createElement('DIV');
  div.className = 'slide '+param.className;
  div.innerHTML = '<div class="md">'+md2html(md, data)+'</div>';
  element.innerHTML = '';
  element.appendChild(div);
  this.updateSize();
  if (param.bgImage) {
    var img = document.createElement('IMG');
    img.className = 'bgImage';
    img.src = param.bgImage;
    var d = (/\bfullscreen\b/.test(div.className)) ? element : div;
    var setSize = function() {
      var r = d.getBoundingClientRect();
      if (r.width/img.width > r.height/img.height) img.style.width = '100%';
      else img.style.height = '100%';
    }.bind(this);
    if (img.width) setSize();
    else img.onload = setSize;
    d.insertBefore(img, d.firstChild);
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
  element.querySelector('div').appendChild(footer);
};

/**
 * 
 */
JSlide.prototype.setSlideFont = function (div, font) {
  if (font) {
    div.style.fontFamily = font;
    if (!this.fonts[font] && typeof WebFont !== undefined) {
      WebFont.load({
        google: { families: [font] } 
      });
      this.fonts[font] = true;
    }
  }
  if (this.presentation) {
    try {
      if (!this.presentationFonts) this.presentationFonts = {};
      if (this.presentation.ownerDocument.defaultView.WebFont 
        && !this.presentationFonts[font]) {
        this.presentation.ownerDocument.defaultView.WebFont.load({
          google: { families: [font] } 
        });
        this.presentationFonts[font] = true
      }
    } catch(e) {}
  } else {
    this.presentationFonts = {};
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
  if (history.pushState) history.pushState(null, null, '#'+(this.current+1));
  else location.hash = '#'+(this.current+1);

  // Draw slide
  element.innerHTML = '';
  this.drawSlide(element, this.current);
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

  // Editor
  this.editor.setText('===='+this.slide[this.current]);
  // Set progress bar
  this.progressBar.style.width = (100 * (this.current+1) / this.slide.length)+'%';

  if (this.presentation) {
    this.presentation.innerHTML = '';
    this.drawSlide(this.presentation, this.current);
  }
};

/** Show next slide
 */
JSlide.prototype.next = function () {
  if (this.current < this.slide.length-1) this.show(++this.current);
};

/** Show previous slide
 */
JSlide.prototype.prev = function () {
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
      break;
    }
    case 37:
    case 38:
    case 33: {
      this.prev();
      break;
    }
    // Ctrl + O
    case 79: {
      if (e.ctrlKey) {
        e.preventDefault();
      }
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
