import './dlog.css'
import '../i19n/i19n'

/** Application dialog
 * @class
 */
const Dlog = function() {
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

export default Dlog;