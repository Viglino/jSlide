import jSlide from './jSlide'
import md2html from '../md/md2html'
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

/** draw a slide in a
 * 
 */
jSlide.drawSlide = function (content, page, slideshow) {
  var slide = this.slide[page];
  var pos = slide.search(']');
  var head = slide.substr(0,pos).trim().split('\n');
  var md = slide.substr(pos+1);
  var data = {
    TITLE: this.get('title'),
    PAGE: page+1,
    LENGTH: this.slide.length,
    PATH: this.pathName
  };

  // Get slide parameters
  if (!/:/.test(head[0])) head[0] = 'className:'+head[0];
  var param = { className:'' };
  head.forEach(function(h) {
    var p = h.split(':');
    param[p.shift().trim()] = p.join(':').trim();
  });

  content.className = (slideshow ? 'slideshow tr-' + (param.transition||'') : '').trim();
  const element = document.createElement('DIV');
  element.className = 'content';

  // Add Slide
  var div = document.createElement('DIV');
  div.className = ('slide '+param.className).trim();
  div.innerHTML = '<div class="md">'+md2html(md, data)+'</div>';
  // Hightlight code blocks
  div.querySelectorAll('pre.code code').forEach((block) => {
    hljs.highlightBlock(block);
  });
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
      };
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
  var c = (param.footer || this.get('footer')).split('|');
  footer.innerHTML = '<div class="left">'+md2html(c[0]||'', data)+'</div>'
  +'<div class="middle">'+md2html(c[1]||'', data)+'</div>'
  +'<div class="right">'+md2html(c[2]||'', data)+'</div>';
  div.appendChild(footer);
};

/** Show a slide
 * @param {number} n position, default current slide
 */
jSlide.show = function (n) {
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
    if (i===jSlide.current) {
      l.className='selected';
      var r = l.getBoundingClientRect();
      var ul = document.getElementById('panel');
      ul.scrollTop = l.offsetTop + r.height/2 - ul.getBoundingClientRect().height/2;
    } else {
      l.className = '';
    }
  });

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
jSlide.nextStep = function (elt) {
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
jSlide.prevStep = function (elt) {
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
jSlide.next = function () {
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
jSlide.prev = function () {
  if (this.slideshow) {
    if (this.prevStep(document.getElementById('slide'))) {
      if (this.presentation) this.prevStep(this.presentation);
      return;
    }
  }
  if (this.current) this.show(--this.current);
};
