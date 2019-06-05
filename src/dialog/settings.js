import Dlog from './dlog'

const dlog = new Dlog();

const content = document.createElement('UL');
let values = {};

function getContent(settings, vals) {
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
    const val = vals[p] || settings[p].default
    switch (settings[p].type) {
      case 'select': {
        const select = document.createElement('SELECT');
        li.appendChild(select);
        settings[p].vals.forEach((v) => {
          const option = document.createElement('OPTION');
          option.innerText = v;
          option.value = v;
          if (val === v) option.selected = true;
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
        input.checked = val;
        console.log(val)
        label.insertBefore(input, span);
        input.addEventListener('change', (e) => {
          values[p] = input.checked;
        });
        break;
      }
      /*
      case 'color': {
        const input = document.createElement('INPUT');
        input.setAttribute ('type', settings[p].type);
        input.value = val;
        li.appendChild(input);
        input.addEventListener('change', (e) => {
          values[p] = input.value;
        });
        const bt = document.createElement('BUTTON');
        bt.innerText = _T('reset');
        li.appendChild(bt);
        bt.addEventListener('click', (e) => {
          values[p] = '';
          input.value = '#f7f5f3';
        });
        break;
      }
      */
      default: {
        const input = document.createElement('INPUT');
        if (settings[p].type==='color') input.setAttribute ('type', 'text');
        else input.setAttribute ('type', settings[p].type);
        input.className = settings[p].type;
        input.value = val;
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
  show: (title, settings, vals, onchange) => {
    dlog.show({ 
      className: 'settings',
      title: title,
      content: getContent(settings, vals),
      buttons: {
        // Save params
        ok: () => { onchange(values); },
        cancel: true
      }
    })
  },
  close: () => { dlog.close();  }
}