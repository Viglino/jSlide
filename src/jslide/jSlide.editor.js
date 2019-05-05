import jSlide from './jSlide'

// Create editor
const editor = jSlide.editor = {
  jSlide: jSlide
};

const editorDiv = document.createElement('DIV');
editorDiv.id = 'editor';
document.body.appendChild(editorDiv);

editor.element = document.createElement('TEXTAREA');
editorDiv.appendChild(editor.element);

/**
 * Get the editor text
 * @return {string}
 */
editor.getText = function() {
  return this.element.value;
};

/** Set editor text
 * @param {string} md
 */
editor.setText = function(md) {
  this.element.value = md;
};

/** Insert char at current position
 * @param {char} c
 */
editor.insertChar = function(c) {
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
function onchange(panel) {
  let t = editor.getText().replace(/^\[====/, '');
  t = t.replace(/\n\[====/g,'\n&#91;====');
  if (t.slice(-1) !== '\n') t += '\n';
  jSlide.slide[jSlide.current] = t;
  jSlide.show();
  if (panel) jSlide.showPanel(jSlide.current);
};

editor.element.addEventListener('change', (e) => { onchange(true); });

/** Handle keydown event
 * @param {Event} e
 */
editor.element.addEventListener('keydown', (e) => {
  if (e.keyCode === 116) return;
  if (!e.ctrlKey || e.keyCode < 60) {
    e.stopPropagation();
    switch (e.keyCode) {
      case 9: { 
        editor.insertChar('\t');
        e.preventDefault()
        break;
      }
      case 13:
      editor.insertChar('\n');
      case 27: {
        onchange(false);
        e.preventDefault();
        break;
      }
      default: break;
    }
  }
});
