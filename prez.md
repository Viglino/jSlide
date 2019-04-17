title: Presentation test
format: 4:3
fontSize: 35
footer:  | **%TITLE%** | %PAGE%/%LENGTH%

[==== title no-footer ]

# jSlide
## Simple, in-browser, markdown slideshow.
|	!(./img/logo.png 100x)

[====]
# Image

Display images in your slides
`!(image_url)`

|	!(https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/AraschniaLevana_f_prorsa.jpg/1280px-AraschniaLevana_f_prorsa.jpg 500)

=====
test

[====]
# Symbol icons

:fa-check-square-o: FontAwesome icons.
test
:fa-eye: test
:fa-pencil: pencil
:fa-desktop: desktop

[==== fontFamily: Dokdo
]

# Google fonts

1. Use Google fonts to enhance your slides.

[==== title
  color: #fff
  bgImage: linear-gradient(#fd0, #e42)
]

# Background
## Add gradient as background

[==== title
  color: #fff
  bgImage: linear-gradient(-36.8deg, #f16529ff, #f16529ff 50%, #e44d26ff 50%)
]

# Background
## Add gradient as background

[==== title fullscreen
  color: #fff
  bgImage: linear-gradient(-36.8deg, #f16529ff, #f16529ff 50%, #e44d26ff 50%)
]

# Background
## Use gradient and fullscreen background

[==== title
  color: white
  bgImage: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/AraschniaLevana_f_prorsa.jpg/1280px-AraschniaLevana_f_prorsa.jpg
]

# Background
## Add bakground images to your slides

[==== title fullscreen
  color: white
  bgImage: https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/AraschniaLevana_f_prorsa.jpg/1280px-AraschniaLevana_f_prorsa.jpg
]
# Background
## Use fullscreen images as background

[==== chapter ]
# Chapter layout

## Chapter 1

The chapter layout lets you place titles on the right
* list item 1
* list item 1

## Better information

This lets you present information on a different way.

[====]
#MP4 video

Insert mp4 video as media in your slide:
`![mp4](http:&#47;/www.w3schools.com/html/mov_bbb.mp4 x540)`

|	![sample video](http://www.w3schools.com/html/mov_bbb.mp4 x400)
|	Video courtesy of [Big Buck Bunny](http://www.bigbuckbunny.org/).

[====]
# !(https://www.youtube.com/yt/about/media/images/brand-resources/icons/YouTube_icon_full-color.svg x45) Youtube video
Insert Youtube video: `!(https:&#47;/youtu.be/YOUTUBE_ID)`

|	!(https://youtu.be/4F0_We5pWa4 640x400)

[==== align-left ]
# Twitter

|>!(https://twitter.com/jmviglino/status/1107291614785998849 1x500)
Add tweets in your presentation:
`!(tweet_url)`

Add a twitter button:
`![share my slides](https:&#47;/twitter.com/share)`

![share my slides](https://twitter.com/share)

[====]
# Twitter timeline

|<!(https://twitter.com/jmviglino/timeline 1x500)
Display your twitter time line in your slides.

[====]

# Animation 
[--
## Amazing [--(zoom,delay: 5) animations --] [--(delay:10) appears --]
--]
[--(zoom)
## slide-up
test 
--]
[--(slide-down,delay:5)
## slide-down
test 
--]
[--(slide-left,step:1)
## slide-left
test 
--]
[--(slide-right)
## slide-right
test 
--]