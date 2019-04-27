import jSlide from './jSlide'

// Create panel
const panel = document.createElement('DIV');
panel.id = 'panel';
document.body.appendChild(panel);

/** Show slides in left panel
 */
jSlide.showPanel = function (slide) {
  if (slide) {
    var li = document.querySelectorAll('#panel > li > div');
    jSlide.drawSlide(li[slide],slide);
  } else {
    panel.innerHTML = '';
    jSlide.slide.forEach(function(s, i) {
      var li = document.createElement('LI');
      var element = document.createElement('DIV');
      panel.appendChild(li);
      li.appendChild(element);
      jSlide.drawSlide(element,i);
      li.addEventListener('click', function(){
        jSlide.show(i);
      });
    });
  }
};
