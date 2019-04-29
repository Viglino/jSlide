/*
*  Copyright (c) 2016 Jean-Marc VIGLINO (https://github.com/Viglino),
*  released under the MIT license (French BSD license)
*/
/*eslint no-useless-escape: "off" */
/*eslint no-constant-condition: ["error", { "checkLoops": false }]*/

import './md.css'

/** Simple markdown to html convertor
 * @param {String} md the markdown text
 * @param {} data a list of key value to replace in the markdown %key%
 * @return {HTMl} HTML code
 */
const md2html = function (md, data) {
  let result = '';
  // Extract code using ```
  md.split(/\n`{3,}/).forEach((m,i) => {
    if (i%2) {
      const c = m.indexOf('\n');
      const type = m.substr(0,c);
      m = m.substr(c+1);
      result += '<pre class="code"><code class="'+type+'">' + m.replace(/</g,'&lt;') + '</code></pre>';
    } else {
      result += md2html.mdPart(m, data);
    }
  });
  return result;
};

/** Handle md part
 * @param {String} md the markdown text
 * @param {} data a list of key value to replace in the markdown %key%
 * @return {HTMl} HTML code
 */
md2html.mdPart = function (md, data) {
  var i;
  data = data || {};
  // Encoder les URI
  for (i in data) {
    if (/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(data[i])
      && !/%/.test(data[i])){
      data[i] = encodeURI(data[i]).replace(/\'/g,"%27");
    }
  }

  // md string
  md = "\n" + md +"\n";

  // Handle icons
  md = md2html.doIcons(md);

  // Table management
  md = md2html.doTable(md);
  // Data management
  md = md2html.doData(md, data);
  // RegEpx rules
  for (i=0; i<md2html.rules.length; i++) {
    md = md.replace(md2html.rules[i][0], md2html.rules[i][1]);
  }
  // Handle blocks
  md = md2html.doBlocks(md);
  // Clean up
  md = md2html.cleanUp(md, data.PATH);
//  console.log(md)

  // Floating images
  md = md2html.floatingImages(md);

  return md;
};

/** Transform md to simple text
 * /
var md2text = function (md, data) {
    return md2html.doData(md, data);

    //return $("<div>").html(md2html(md, data)).text();
}
/**/

/** 
 * floating images
 */
md2html.floatingImages = function (md) {
  md = md.replace (/<div class='right'><img([^\<]*)<\/div>/g,"<img class='floatRight' $1");
  md = md.replace (/<div class='left'><img([^\<]*)<\/div>/g,"<img class='floatLeft' $1");
  md = md.replace (/<a ([^\<]*)<br \/><img/g,"<a $1<img");
  return md;
};

/**
 * Create animated blocks
 */
md2html.doBlocks = function (md) {
  md = md.replace(/\[--(\(([^\)]*)\))?\n?/g, '<div class="step" data-anim="$2">');
  md = md.replace(/\--\]\n/g, '</div><br/>');
  md = md.replace(/\--\]/g, '</div>');
  return md;
};


/** Add new rule
*  @param {RegExp} rex RegExp to use in replacement
*  @param {string} rep replacement string
*  @return {string} result md
*/
md2html.addRule = function(rex, rep) {
  md2html.rules.push(rex, rep);
};

/**
 * Create icon font
 */
md2html.doIcons = function(md) {
  md = md.replace(/:([a-z]*)-([_,a-z,0-9,-]*):(([a-z,0-9,-]*)?( ([a-z,0-9,-]+))?:)?(([#,0-9,a-z,A-Z]*):)?/g, '<i class="fa fa-fw $1-$2 fa-$4 fa-$6" style="color:$8"></i>');
  return md;
};

/** A list of key value to replace as %key% > value in md
*  @param {string} md the markdown
*  @param {Objevt} data list of key/value
*  @return {string} result md
*/
md2html.doData = function(md, data) {
  for (var i in data) if (data[i]) {
    md = md.replace(new RegExp("%"+i+"%",'g'), data[i]);
  }
  return md;
};

/** Table handler
*  @param {string} md the markdown
*  @return {string} result md
*/
md2html.doTable = function(md) {
  // Detect ---- | ----
  md = md.replace(/\n\ ?-{3,}\ ?\|/g, '<table></table>|');
  while (/<\/table>\|\ ?-{3,}/.test(md)) {
    md = md.replace(/<\/table>\|\ ?-{3,}\ ?/g, '</table>');
  }
  // Header
  md = md.replace(/(.*)<table>/g, '<table><tr><td>$1</td></tr>');
  while (/<td>(.*)\|/.test(md)) {
    md = md.replace(/<td>(.*)\|/g, '<td>$1</td><td>');
  }
  // Lines
  while (/<\/table>\n([^\n]*)\|/.test(md)) {
    md = md.replace(/<\/table>\n(.*)/g, '<tr><td>$1</td></tr></table>');
    while (/<td>(.*)\|/.test(md)) {
      md = md.replace(/<td>(.*)\|/g, '<td>$1</td><td>');
    }
  }
  md = md.replace(/<\/table>\n/g,"</table>");
  md = md.replace(/<td>\t/g,"<td class='center'>");
  return md;
};

/** Clean endl
*  @param {string} md the markdown
*  @return {string} result md
*/
md2html.cleanUp = function(md, localpath) {  
  md = md.replace(/(\<\/h[1-5]\>)\n/g, "$1");
  md = md.replace(/^\n/, '');
  if (md==='\n') md = '';

  // Remove timeline tweet
  md = md.replace(/data-tweet-limit\=\"\"/g,'data-tweet-limit="1"');
  md = md.replace (/<div class='right'><a class="twitter-/g,"<div class='floatRight'><a class=\"twitter-")
  md = md.replace (/<div class='left'><a class="twitter-/g,"<div class='floatLeft'><a class=\"twitter-")
  md = md.replace (/<div class='right'><blockquote /g,"<div class='floatRight' style=\"min-width:200px\"><blockquote ")
  md = md.replace (/<div class='left'><blockquote /g,"<div class='floatLeft' style=\"min-width:200px\"><blockquote ")
  // Facebook
  md = md.replace (/_URL_PAGE_/g, encodeURIComponent(window.location.href));

  // Local images
  let path = window.location.href.split(/[?|#]/).shift();
  path = path.substr(0, path.lastIndexOf('/'))+'/presentations/'+(localpath||'');
  console.log(path)
  md = md.replace (/_LOCAL_IMG_/g, path);

  // Collapsible blocks
  md = md.replace(/mdBlockTitle\">\n/g,'mdBlockTitle">');
  md = md.replace(/mdBlockContent\">\n/g,'mdBlockContent">');
  md = md.replace(/\n<\/label>/g,'</label>');
  md = md.replace(/\n<\/div><\/div>/g,'</div><\/div>');
  md = md.replace(/<\/div>\n/g,'</div>');

//  md = md.replace(/<\/ul>\n{1,2}/g, '</ul>');
//  md = md.replace(/\<\/ol\>\n{1,2}/g, '</ol>');

  md = md.replace(/<\/p>\n/g, '</p>');

  md = md.replace(/(\<\/h[0-9]>)\n/g, '$1');
  md = md.replace(/(\<hr \/>)\n/g, '$1');
  md = md.replace(/^\n/, '');
  md = md.replace(/^\n/, '');
  md = md.replace(/\n$/, '');
  md = md.replace(/\n/g, '<br />');
  md = md.replace(/\t/g, ' ');
  md = md.replace(/\<\/ol><br \/>/g, '</ol>');
  md = md.replace(/\<\/ul><br \/>/g, '</ul>');

  return md;
};

/** Array of RegExp rules for conversion
*/
md2html.rules = [
  // Headers
  [/#?(.*)\n={5}(.*)/g, "<h1>$1</h1>"],        // h1
// [/#?(.*)\n\-{5}(.*)/g, "<h2>$1</h2>"],        // h2

  [/\n#{6}(.*)/g, "\<h6>$1</h6>"],          // h5
  [/\n#{5}(.*)/g, "\n<h5>$1</h5>"],          // h5
  [/\n#{4}(.*)/g, "\n<h4>$1</h4>"],          // h4
  [/\n#{3}(.*)/g, "\n<h3>$1</h3>"],          // h3
  [/\n#{2}(.*)/g, "\n<h2>$1</h2>"],          // h2
  [/\n#{1}(.*)/g, "\n<h1>$1</h1>"],          // h1

  [/<h([1-6])>\t/g, "<h$1 class='center'>"],      // Center header with tab

  // Blocks
  [/\n\&gt\;(.*)/g, '<blockquote>$1</blockquote>'],  // blockquotes
  [/\<\/blockquote\>\<blockquote\>/g, '\n'],      // fix

  // Lists
  [/\n\* (.*)/g, '\n<ul><li>$1</li></ul>'],                 // default list
  [/\n(-+) (.*)/g, '\n<ul><li class="sub$1 minus">$2</li></ul>'],   // 
  [/\n(-*)\+ (.*)/g, '\n<ul><li class="sub-$1 plus">$2</li></ul>'],    // 
  [/\n(-+)o (.*)/g, '\n<ul><li class="sub$1 dot">$2</li></ul>'],    // 
  [/\n(-+)> (.*)/g, '\n<ul><li class="sub$1 arrow">$2</li></ul>'],  // 
  [/\n(-+)x (.*)/g, '\n<ul><li class="sub$1 squares">$2</li></ul>'],  // 
  [/\n(-*)=> (.*)/g, '\n<ul><li class="sub-$1 arrow-o">$2</li></ul>'],    // 
  [/\n(-*)<> (.*)/g, '\n<ul><li class="sub-$1 diamond">$2</li></ul>'],  // 
  [/\n(-*)\[([ |x])\] (.*)/g, '\n<ul><li class="sub-$1 check-$2">$3</li></ul>'],   // check lists
  [/\n(-*)\(([ |x])\) (.*)/g, '\n<ul><li class="sub-$1 radio-$2">$3</li></ul>'],   // check lists

  [/\n\<ul\>/g, '<ul>'],                                // fix
  [/<\/ul><ul>/g, ''],                                  // concat

  [/\n-{5,}/g, "\n<hr />"],              // hr

  // Ordered list
  [/\n[0-9]+\.(.*)/g, '<ol><li>$1</li></ol>'],    // ol lists
  [/\<\/ol\>\<ol\>/g, ''],              // fix

  // Automatic links
  [/([^\(])[ |\n](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))( ?)/g, 
    '$1<a href=\'$2\' target="_blank">$2</a>'],
  // Mailto
  [/([^\(])\bmailto\b\:(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)/gi, '$1<a href=\'mailto:$2\'>$2</a>'],

  /* Github */
    // Github corner
    [/\!\(https:\/\/github.com\/([-a-zA-Z0-9@:%_+.~#?&//=]*)\)\n/, 
    '<a href="https://github.com/$1" class="icss-github-corner" target="_blanck"><i></i></a>'],

  // Github
  [/\!\(https:\/\/github.com\/([-a-zA-Z0-9@:%_+.~#?&=]*)\/([-a-zA-Z0-9@:%_+.~#?&=]*)\/watch ?(\d+)?x?(\d+)?\)/g, 
    '<iframe class="github-btn" src="https://ghbtns.com/github-btn.html?user=$1&repo=$2&type=watch&count=true&size=large&v=2" allowtransparency="true" frameborder="0" scrolling="0" style="width:$3px"></iframe>'],
  [/\!\(https:\/\/github.com\/([-a-zA-Z0-9@:%_+.~#?&=]*)\/([-a-zA-Z0-9@:%_+.~#?&=]*)\/fork ?(\d+)?x?(\d+)?\)/g, 
    '<iframe class="github-btn" src="https://ghbtns.com/github-btn.html?user=$1&repo=$2&type=fork&count=true&size=large&v=2" allowtransparency="true" frameborder="0" scrolling="0" style="width:$3px"></iframe>'],
  [/\!\(https:\/\/github.com\/([-a-zA-Z0-9@:%_+.~#?&=]*)\/follow ?(\d+)?x?(\d+)?\)/g, 
    '<iframe class="github-btn" src="https://ghbtns.com/github-btn.html?user=$1&type=follow&count=true&size=large&v=2" allowtransparency="true" frameborder="0" scrolling="0" style="width:$2px"></iframe>'],

  /* Twitter */

  // Twitter Share
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/share ?(\d+)?x?(\d+)?\)/g,
    '<a href="https://twitter.com/share" data-text="$2" data-hashtags="macarte" data-related="IGNFrance" class="twitter-share-button" data-size="large" data-show-count="true">Tweet</a>'],

  // User timeline
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^\/)]*)\/timeline ?(\d+)?x?(\d+)?\)/g,
    '<a class="twitter-timeline" href="https://twitter.com/$3" data-tweet-limit="$4" data-width="$5"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],
  // Twitter timeline
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^\/)]*)\/timelines\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<a class="twitter-timeline" href="https://twitter.com/$3/timelines/$4" data-tweet-limit="$5" data-width="$6"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],
  // Twitter grid
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^\/)]*)\/timegrid\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<a class="twitter-grid" href="https://twitter.com/$3/timelines/$4" data-limit="$5"  data-width="$6"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],
  // Tweet
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/twitter.com\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<blockquote class="twitter-tweet" data-cards="$4hidden" data-dnt="true" data-width="$5" width="$5"><a href="https://twitter.com/$3?cards=false"></a></blockquote>'],

  // FaceBook like
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/www.facebook.com\/like ?(\d+)?x?(\d+)?\)/g,
    '<iframe src="https://www.facebook.com/plugins/like.php?href=_URL_PAGE_&width=136&layout=button_count&action=like&size=small&show_faces=false&share=true&height=20&appId" width="136" height="20" class="facebook-share-button" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'],

  // Page FaceBook
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/www.facebook.com\/([^\/)]*)\/posts\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2F$3%2Fposts%2F$4&width=$5&height=$6" width="$5" height="$6" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'],
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/www.facebook.com\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2F$3&tabs=timeline&width=$4" width="$4" height="$5" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>'],

  /* Media */

  // INA.fr
  [ /\!(\[([^\[|\]]+)?\])?\(https:\/\/player.ina.fr\/player\/embed\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" width="300" height="180" frameborder="0" marginheight="0" marginwidth="0" scrolling="no" style="overflow:hidden;width:$4px; height:$5px;" src="https://player.ina.fr/player/embed/$3/wide/0" allowfullscreen></iframe>'],
  // INA/Jalon
  [ /\!(\[([^\[|\]]+)?\])?\(InaEdu([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" width="300" height="180" style="width:$4px; height:$5px;" src="https://fresques.ina.fr/jalons/export/player/InaEdu$3/360x270" allowfullscreen></iframe>'],
  // Youtube
  [ /\!(\[([^\[|\]]+)?\])?\(https?:\/\/youtu.be\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" width="300" height="180" style="width:$4px; height:$5px;" src="https://www.youtube.com/embed/$3" frameborder="0" allowfullscreen></iframe>'],
  // Dailymotion
  [ /\!(\[([^\[|\]]+)?\])?\(https?:\/\/dai.ly\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" frameborder="0" width="300" height="180" style="width:$4px; height:$5px;" src="https://www.dailymotion.com/embed/video/$3" allowfullscreen></iframe>'],
  // Vimeo
  [ /\!(\[([^\[|\]]+)?\])?\(https?:\/\/vimeo.com\/([^ |\)]*) ?(\d+)?x?(\d+)?\)/g,
    '<iframe class="video" frameborder="0" width="300" height="180" style="width:$4px; height:$5px;" src="https://player.vimeo.com/video/$3" allowfullscreen></iframe>'],

  // Audio
  [/\!(\[([^\[|\]]+)?\])?\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\(\)]*)\.mp3) ?(\d+)?x?(\d+)?\)/g,
    '<audio controls style="width:$6px; height:$7px;" title="$2"><source src="$3" type="audio/mpeg">Your browser does not support the audio element.</audio>'],
  // Video
  [/\!(\[([^\[|\]]+)?\])?\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\(\)]*)\.mp4) ?(\d+)?x?(\d+)?\)/g,
    '<video controls style="width:$6px; height:$7px;" title="$2"><source src="$3" type="video/mp4">Your browser does not support the video tag.</video>'],

  // Internal images
  [/!(\[([^[|\]]+)?\])?\((\.\.?\/([-a-zA-Z0-9@:%_+.~#?&//=()]*)) ?(\d+)?x?(\d+)?\)/g,
    '<img style="width:$5px; height:$6px;" src="_LOCAL_IMG_$3" title="$2" />'],
  // Images
  [/!(\[([^[|\]]+)?\])?\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=()]*)) ?(\d+)?x?(\d+)?\)/g,
    '<img style="width:$6px; height:$7px;" src="$3" title="$2" />'],

  // links
  [/\[([^[]+)?\]\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))( ?)([^)]*)\)/g,
    '<a href=\'$2\' title="$6" target="_blank">$1</a>'],
  [/\((https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))( ?)([^)]*)\)/g,
    '<a href=\'$1\' title="$5" target="_blank">$1</a>'],
  // Mailto
  [/\[([^[]+)?\]\(\bmailto\b:(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)\)/gi, '<a href=\'mailto:$2\'>$1</a>'],
  [/\(\bmailto\b:(\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)\)/gi, '<a href=\'mailto:$1\'>$1</a>'],
  // tel
  [/\[([^[]+)?\]\(tel:([0-9+-]+)\)/g, '<a href=\'tel:$2\'>$1</a>'],
  [/\(tel:([0-9+-]+)\)/g, '<a href=\'tel:$1\'>$1</a>'],

  // Code
  [/`(.*?)`/g, '<code>$1</code>'],              // inline code
  [/\n {4,}(.*)/g, '<pre>$1</pre>'],            // Code
  [/\n\t(.*)/g, '<pre>$1</pre>'],               // Code
  [/<\/pre><pre>/g, '<br/>'],                   // fix
  [/<\/pre>\n/g, '</pre>'],                     // fix

  // format
  [/(\\\*)/g, '&#42;'],                         // escape *
  [/(\*\*)([^]*?)\1/g, '<strong>$2</strong>'],  // bold
  [/(\*)([^]*?)\1/g, '<em>$2</em>'],            // emphasis
  [/<strong><\/strong>/g, '****'],              // fix bold
  [/<em><\/em>/g, '**'],                        // fix em
  [/(__)(.*?)\1/g, '<u>$2</u>'],                // underline
  [/(~~)(.*?)\1/g, '<del>$2</del>'],            // del

  // alignement https://github.com/jgm/pandoc/issues/719
  [/\n\|<>([^\n]*)/g, "\n<pc>$1</pc>"],       // center |<>
  [/\n\|\t([^\n]*)/g, "\n<pc>$1</pc>"],       // center |[tab]
  [/\n\|<([^\n]*)/g, "\n<pl>$1</pl>"],        // left |<
  [/\n\|>([^\n]*)/g, "\n<pr>$1</pr>"],        // rigth |>
  [/<\/pc>\n<pc>/g, "<br/>"],
  [/<\/pl>\n<pl>/g, "<br/>"],
  [/<\/pr>\n<pr>/g, "<br/>"],
  [/<pc>/g, "<div class='center'>"],          // fix
  [/<pl>/g, "<div class='left'>"],            // fix
  [/<pr>/g, "<div class='right'>"],           // fix
  [/<\/pc>|<\/pl>|<\/pr>/g, "</div>"],        // fix

  //
  [/\(c\)/g, "&copy;"],                 // (c)
  [/\(r\)/g, "&reg;"],                  // (R)
  [/\(TM\)/g, "&trade;"]                // (TM)

];

export default md2html
