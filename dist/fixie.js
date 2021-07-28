"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.fixie = void 0;
/**
 * Quick rewrite of my JQuery plugin, fixie.

 */
var throttle = function (fn, milliseconds) {
    var timeout = null, lastCallAt = (new Date()).valueOf() - milliseconds;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = (new Date()).valueOf();
        if ((now - lastCallAt) >= milliseconds) {
            fn.apply(void 0, args);
            lastCallAt = now;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            fn.apply(void 0, args);
            lastCallAt = (new Date()).valueOf();
        }, milliseconds);
    };
};
/* Returns a fn that should be called repeatedly.
 When it is first called, beforeFn is called, and after
 a break of _milliseconds_, will call afterFn. Repeats
 as needed.
 */
var beforeAndAfter = function (beforeFn, afterFn, milliseconds) {
    var timeout = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!timeout) {
            beforeFn.apply(void 0, args);
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            afterFn.apply(void 0, args);
            timeout = null;
        }, milliseconds);
    };
};
function toggleClass(target, className, applyNow) {
    target.classList[applyNow ? 'add' : 'remove'](className);
}
var applyPinnedClass = function (target, pinnedNow, config) {
    toggleClass(target, config.pinnedClass, pinnedNow);
    if (config.pinnedBodyClass)
        toggleClass(document.body, config.pinnedBodyClass, pinnedNow);
};
var strategies = {
    relative: function (target, config) {
        // $target.css('position', 'relative')
        target.style.position = 'relative';
        var moveIt = function () {
            var top = Math.max(0, window.scrollY - config.originalY + config.topMargin);
            target.style.top = top + "px";
            // $target.css('top', top)
            applyPinnedClass(target, top > config.pinSlop, config);
        };
        window.addEventListener('scroll', throttle(moveIt, config.throttle));
    },
    relativeWithHiding: function (target, config) {
        target.style.position = 'relative';
        var startMoving = function () {
            var top = Math.max(0, window.scrollY - config.originalY + config.topMargin);
            if (top < config.pinSlop)
                return;
            if (config.movingClass)
                target.classList.add(config.movingClass);
            else
                target.style.opacity = '0.01';
            applyPinnedClass(target, false, config);
        };
        var repositionIt = function () {
            var top = Math.max(0, window.scrollY - config.originalY + config.topMargin);
            if (top <= config.pinSlop)
                top = 0;
            target.style.top = top + "px";
            applyPinnedClass(target, top > 0, config);
            if (config.movingClass)
                target.classList.remove(config.movingClass);
            else
                target.style.opacity = '1.0';
        };
        window.addEventListener('scroll', beforeAndAfter(startMoving, repositionIt, config.throttle));
    },
    fixed: function (target, config) {
        var fixIt = function () {
            if ((window.scrollY - config.pinSlop) > (config.originalY - config.topMargin)) {
                target.style.position = 'fixed';
                target.style.top = config.topMargin + "px";
                applyPinnedClass(target, true, config);
            }
            else {
                target.style.position = 'relative';
                target.style.top = '0';
                applyPinnedClass(target, false, config);
            }
        };
        window.addEventListener('scroll', throttle(fixIt, config.throttle));
    }
};
/* Finally, what we've been looking for */
var defaults = {
    strategy: 'fixed',
    pinSlop: 0,
    topMargin: 0,
    pinnedClass: '_pinnedToTop',
    movingClass: undefined,
    pinnedBodyClass: undefined,
    throttle: 30 // how often to adjust position of element
};
var fixie = function (el, options) {
    var config = __assign(__assign(__assign({}, defaults), options), { originalY: el.offsetTop });
    strategies[config.strategy](el, config);
};
exports.fixie = fixie;
//# sourceMappingURL=fixie.js.map