import jSlide from '../jslide/jSlide'
import Dlog from './dlog'

const dlog = new Dlog();

const content = document.createElement('UL');
let values = {};

function getContent(settings) {
  content.innerHTML = '';
  values = {};
  Object.keys(settings).forEach((p) => {
    const li = document.createElement('LI');
    content.appendChild(li);
    li.className = 'li-'+settings[p].type;
    const label = document.createElement('LABEL');
    li.appendChild(label);
    const span = document.createElement('SPAN');
    span.innerText = _T('settings_'+p);
    label.appendChild(span);
    values[p] = jSlide.get(p);
    switch (settings[p].type) {
      case 'select': {
        const select = document.createElement('SELECT');
        li.appendChild(select);
        settings[p].vals.forEach((v) => {
          const option = document.createElement('OPTION');
          option.innerText = v;
          option.value = v;
          if (jSlide.get(p) === v) option.selected = true;
          select.appendChild(option);
        });
        select.addEventListener('change', (e) => {
          values[p] = select.value;
        });
        break;
      }
      case 'checkbox': {
        const input = document.createElement('INPUT');
        input.setAttribute ('type', settings[p].type);
        input.checked = jSlide.get(p);
        label.insertBefore(input, span);
        input.addEventListener('change', (e) => {
          values[p] = input.value;
        });
        break;
      }
      default: {
        const input = document.createElement('INPUT');
        input.setAttribute ('type', settings[p].type);
        input.value = jSlide.get(p);
        li.appendChild(input);
        input.addEventListener('change', (e) => {
          values[p] = input.value;
        })
        break;
      }
    }
  });
  return content;
};

/** Settings dialog
 */
export default {
  show: (title, settings, onchange) => {
    dlog.show({ 
      className: 'settings',
      title: title,
      content: getContent(settings),
      buttons: {
        // Save params
        ok: () => { onchange(values); },
        cancel: true
      }
    })
  },
  close: () => { dlog.close();  }
}