/** jSlide remote control
 */
import '../style/rcontrol.css'
import jSlide from './jSlide'
import md2html from '../md/md2html'

// Create control panel
const panel = document.createElement('DIV');
panel.id = 'rcontrol';
document.body.appendChild(panel);

const buttons = [{
    title: _T('edit'),
    icon: 'jslide-edit',
    click: function() {
      jSlide.setMode('edit');
    }
  },{
    title: _T('play'),
    icon: 'jslide-play',
    click: function() {
      jSlide.setMode('play', false);
    }
  },{
    title: _T('duplicate'),
    icon: 'jslide-duplicate',
    click: function() {
      jSlide.openPresentation();
    }
  },{
    title: _T('slideshow'),
    icon: 'jslide-play-time',
    click: function() {
      jSlide.setMode('play', true);
    }
  },{
    title: ''
  },{
    title: _T('help'),
    icon: 'fa fa-question',
    click: function() {
      jSlide.dialog.show({
        content: md2html(_T('helpInfo')),
        className: 'dlg-help notransition',
        closeOnClick: true
      })
    }
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
  icon.className = 'icon-'+i+' '+c.icon;
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
