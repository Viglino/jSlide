/**
*	Copyright (c) 2016 Jean-Marc VIGLINO (https://github.com/Viglino),
*	released under the MIT license (French BSD license)
* 
* @file jSlide editor
* @author Jean-Marc VIGLINO (https://github.com/Viglino)
*/
/** JSlide editor
 */
JSlide.editor = function(jslide) {
  this.jSlide = jslide;
  this.element = document.getElementById('editor').querySelector('textarea');
  // Add listeners
  this.element.addEventListener('keydown', this.onkeydown.bind(this));
  this.element.addEventListener('change', this.onchange.bind(this));
};

/**
 * Get the editor text
 * @return {string}
 */
JSlide.editor.prototype.getText = function() {
  return this.element.value;
};

/** Set editor text
 * @param {string} md
 */
JSlide.editor.prototype.setText = function(md) {
  this.element.value = md;
};

/** Insert char at current position
 * @param {char} c
 */
JSlide.editor.prototype.insertChar = function(c) {
  if (this.element.selectionStart || this.element.selectionStart == '0') {
    var startPos = this.element.selectionStart;
    var endPos = this.element.selectionEnd;
    this.element.value = this.element.value.substring(0, startPos)
      + c
      + this.element.value.substring(endPos, this.element.value.length);
      this.element.selectionEnd = this.element.selectionStart = startPos+1;
  } else {
    this.element.value += c;
  }
};

/** Something as changed
 */
JSlide.editor.prototype.onchange = function(panel) {
  this.jSlide.slide[this.jSlide.current] = this.getText().replace(/^\[====/,'');
  this.jSlide.show();
  if (panel) this.jSlide.showPanel(this.jSlide.current);
};

/** Handle keydown event
 * @param {Event} e
 */
JSlide.editor.prototype.onkeydown = function(e) {
  if (e.keyCode === 116) return;
  if (!e.ctrlKey || e.keyCode < 60) {
    e.stopPropagation();
    switch (e.keyCode) {
      case 9: { 
        this.insertChar('\t');
        e.preventDefault()
        break;
      }
      case 13:
        this.insertChar('\n');
      case 27: {
        this.onchange(false);
        e.preventDefault();
        break;
      }
      default: break;
    }
  }
};

/** Set editor
 */
JSlide.prototype.setEditor = function() {
  this.editor = new JSlide.editor(this);
};