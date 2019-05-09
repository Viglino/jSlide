import './dlog.css'
import '../i19n/i19n'

/** Application dialog
 * @class
 */
const Dlog = function(options) {
  options = options || {};
  this.element = this.createElement('DIV', document.body);
  this.element.className = 'dlog';
  this.element.addEventListener('click', function() {
    console.log('click')
    if (/closeOnClick/.test(this.element.className)) {
      this.hide();
    }
  }.bind(this));
  this.dlog = this.createElement('DIV', this.element);
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
 *  @param {string|Element} options.className
 *  @param {*} options.buttons a list of buttons
 *  @param {boolean} options.closeBox add a close box, default false
 *  @param {boolean} options.closeOnClick close when click on the dialog
 */
Dlog.prototype.show = function(options) {
  this.element.className = ('dlog visible ' + (options.closeOnClick ? 'closeOnClick ':'') + (options.className || '')).trim();
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

/** Hide/close the dialog
 */
Dlog.prototype.close =
Dlog.prototype.hide = function() {
    this.element.className = 'dlog';
};

/** Is dialog open
 */
Dlog.prototype.isOpen = function() {
  return (/visible/.test(this.element.className));
};

export default Dlog;