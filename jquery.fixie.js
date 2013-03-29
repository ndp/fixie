// jquery.fixie.js: Copyright(c) 2013 NDP Software, Andrew J. Peterson
(function ($) {

  // Simple throttle function decorator.
  var throttle = function (fn, milliseconds) {
    var ctx = this,
        timeout = null,
        lastCallAt = (new Date()).valueOf() - milliseconds;

    return function () {
      var args = Array.prototype.slice.call(arguments);
      var now = (new Date()).valueOf();
      if ((now - lastCallAt) >= milliseconds) {
        fn.apply(ctx, args);
        lastCallAt = now;
      }

      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () {
        fn.apply(ctx, args);
        lastCallAt = (new Date()).valueOf();
      }, milliseconds);
    }
  };

  /* Returns a fn that should be called repeatedly.
   When it is first called, beforeFn is called, and after
   a break of _milliseconds_, will call afterFn. Repeats
   as needed.
   */
  var beforeAndAfter = function (beforeFn, afterFn, milliseconds) {
    var ctx = this, timeout = null;

    return function () {
      var args = Array.prototype.slice.call(arguments);
      if (!timeout) {
        beforeFn.apply(ctx, args);
      }
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () {
        afterFn.apply(ctx, args);
        timeout = null;
      }, milliseconds);
    }
  };


  /* Finally, what we've been looking for */

  $.fn.fixie = function (options) {

    var config = $.extend({}, $.fn.fixie.defaults, options);

    return $(this).each(function () {

      var $target = $(this);
      var margin = $target.position().top - (config.topMargin || 0);

      var strategies = {

        relative: function () {
          $target.css('position', 'relative');
          var moveIt = function () {
            var top = Math.max(0, window.scrollY - margin);
            $target.css('top', top).toggleClass(config.pinnedClass, top > 0);
          };
          $(window).on('scroll', throttle(moveIt, config.throttle));
        },

        relativeWithHiding: function () {
          $target.css('position', 'relative');
          var hideIt = function () {
            $target.stop(true, false).animate({'opacity': 0.01}, 0.05);
          };
          var moveIt = function () {
            var top = Math.max(0, window.scrollY - margin);
            $target.css('top', top).toggleClass(config.pinnedClass, top > 0);
            $target.stop(true, false).animate({'opacity': 1.0}, 'fast', false, false);
          };
          $(window).on('scroll', beforeAndAfter(hideIt, moveIt, config.throttle));
        },

        fixed: function () {
          var fixIt = function () {
            if (window.scrollY > (margin + config.extraScrollPadding)) {
              $target.css({position: 'fixed', top: config.topMargin}).
                  addClass(config.pinnedClass);
            } else
              $target.css({position: 'relative', top: 0}).
                  removeClass(config.pinnedClass);
          };
          $(window).on('scroll', throttle(fixIt, config.throttle));
        }
      };

      strategies[config.strategy]();
    });
  };

  $.fn.fixie.defaults = {
    strategy: 'fixed',
    extraScrollPadding: 0, // make the user scroll extra down the page before the element is fixed?
    topMargin: 0, // how close to the top to pin it?
    pinnedClass: '_pinnedToTop', // any css class to add on when pinned
    throttle: 30                  // how often to adjust position of element
  };


})(jQuery);

