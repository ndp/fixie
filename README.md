fixie
=====

jQuery plugin to fix elements vertically as the page scrolls down. Configurable, reusable.
"Pin" the given element to the top of the page on vertical scroll. Also know as
"conditional fixed placement".

## Usage
```
  $('#menu').fixie();   // defaults
  $('#menu').fixie({ topMargin: '20px' });
```

### Options
Accepts objects, which are (with defaults):
* strategy: `fixed`  See below.
* extraScrollPadding: `0` Usually when the user scrolls an element to the top
  of the page, it becomes "fixed". This "slop" value allows it to go pass,
  or become fixed before it's actually at the top.
* topMargin: `0` Specifies how close to the top to pin the element. Easily fix elements
  below a fixed header, or below other fixed elements.
* pinnedClass: `_pinnedToTop` Any css class to add on to the element when it is pinned
* throttle: `30` (ms)  How often to adjust position of element


### Strategies
There are various strategies available:
* `relative`: simply make the element positioned relative and
  adjust position whenever the user scrolls. Works with simple elements
* `relativeWithHiding`: same as above, except fades out and shows
  elements as they move
* `fixed`: makes the element fixed positioned.  TODO: insert
  placeholder element


## License
Copyright (c) 2013 NDP Software. Andrew J. Peterson
MIT License; see LICENSE.txt


## References
* http://github.com/ndp/jsutils for tests
* http://www.gregjopa.com/2011/07/conditional-fixed-positioning-with-jquery/
