import jSlide from '../jslide/jSlide'

const bar = {}

// Create the bar
const header = document.createElement('DIV');
header.id = 'header';
document.body.appendChild(header);

// Add button to the bar
function addButton(className, click) {
  var b = document.createElement('BUTTON');
  // Save
  b.className = className;
  b.addEventListener('click', click);
  header.appendChild(b);
  return b;  
}

//
addButton('addSlide', () => {
  jSlide.slide.splice(jSlide.current+1,0,']');
  jSlide.showPanel();
  jSlide.next();
});
addButton('open');
addButton('save', () => { jSlide.save(); });
addButton('present', () => { jSlide.rcontrol.show([200,150]); });
//addButton('slideshow', () => { jSlide.startPresentation(); });

export default bar
