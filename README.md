fixie
=====

jQuery plugin to fix elements vertically as the page scrolls down. Configurable, reusable.
"Pin" the given element to the top of the page on vertical scroll. Also know as
"conditional fixed placement".

### Demo
http://ndpsoftware.com/fixie/demo.html

## Usage
```
  $('#menu').fixie();   // defaults
  $('header').fixie({ topMargin: '20px' });
```

### Options
Accepts an options object, which may contain (with `defaults`):
* strategy: `fixed`  Choose an implementation. See below.
* topMargin: `0` Specifies how close to the top to pin the element.
  Usually you want elements pinned to the top, but sometimes they need to
  be below some other element, such as a fixed header.
* pinnedClass: `_pinnedToTop` Any css class to add on to the element when it is pinned.
* pinnedBodyClass: `undefined` A CSS class to add to the body element when
  this element is pinned. Default is to add no class.
* throttle: `30` (ms)  How often to adjust position of element
* pinSlop: `0` Usually when the user scrolls an element to the top
  of the page, it becomes "fixed". This "slop" value allows it to go past,
  or become fixed before it's actually at the top.


### Strategies
There are various strategies available:
* `relative`: simply make the element positioned relative and
  adjust position whenever the user scrolls. Works with simple elements
* `relativeWithHiding`: same as above, except fades out and shows
  elements as they move
* `fixed`: makes the element fixed positioned. This is very performant, but
  it has a couple drawbacks. First, you must take care that when the element
  becomes "fixed", that it maintains its natural width. This is better done
  with your CSS than fixie itself, so that the pinned element can respond
  well to browser resizing. Often this is only a "width: 100%" statement.


## License
Copyright (c) 2013 NDP Software. Andrew J. Peterson
MIT License; see LICENSE.txt


## History
* 1.0.1: add bower file
* 1.0.0: first release

## References
* http://github.com/ndp/jsutils for tests
* http://www.gregjopa.com/2011/07/conditional-fixed-positioning-with-jquery/
