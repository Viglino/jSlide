import jSlide from '../jslide/jSlide'

const bar = {}

// Create the bar
const header = document.createElement('DIV');
header.id = 'header';
document.body.appendChild(header);

window.addEventListener('load', () => {

  const buttons = [{
    title: 'addSlide',
    click: function() {
      jSlide.slide.splice(jSlide.current+1,0,']');
      jSlide.showPanel();
      jSlide.next();
    }
  }, {
    title: 'open',
    click: function() {}
  }, {
    title: 'save',
    click: function() { jSlide.save(); }
  }, {
    title: 'rcontrol',
    click: function() { jSlide.rcontrol.show([200,150]); }
  }];

  buttons.forEach((b) => {
    var button = document.createElement('BUTTON');
    button.className = b.title;
    button.title = _T(b.title);
    button.addEventListener('click', b.click);
    header.appendChild(button);
  });
});

export default bar
