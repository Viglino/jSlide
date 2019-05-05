import '../style/rcontrol.css'
import jSlide from './jSlide'

/** jSlide remote control
 */
// Create panel
const panel = document.createElement('DIV');
panel.id = 'rcontrol';
document.body.appendChild(panel);

const buttons = [{
    title: _T('edit'),
    icon: 'fa-pencil',
    click: function() {
      jSlide.stopPresentation();
    }
  },{
    title: _T('play'),
    icon: 'fa-play-circle-o',
    click: function() {
      jSlide.startPresentation();
    }
  },{
    title: _T('duplicate'),
    icon: 'fa-window-restore',
    click: function() {
      jSlide.openPresentation();
    }
  },{
    title: _T('slideshow'),
    icon: 'fa-clock-o',
    click: function() {
      jSlide.startPresentation();
    }
  },{
    title: ''
  },{
    title: ''
  }
];
buttons.forEach((c,i) => {
  const button = document.createElement('DIV');
  button.className = 'button button-'+i;
  button.title = c.title;
  panel.appendChild(button);
  button.addEventListener('click', () => {
    rcontrol.hide();
    if (c.click) c.click();
  });
  const icon = document.createElement('I');
  icon.className = 'fa icon-'+i+' '+c.icon;
  panel.appendChild(icon);
})

const button = document.createElement('DIV');
button.className = 'center';
panel.appendChild(button);
button.addEventListener('click', () => {
  panel.className = '';
});

const rcontrol = jSlide.rcontrol = {
  show: function(position) {
    if (position) {
      panel.style.left = position[0] + 'px';
      panel.style.top = position[1] + 'px';
      setTimeout(() => {
        panel.className = 'visible';
      });
    } else {
      panel.className = 'visible';
    }
  },
  hide: function() {
    panel.className = '';
  }
}

export default rcontrol
