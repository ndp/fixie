"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixie = void 0;
/**
 * Quick rewrite of my JQuery plugin, fixie.

 */
const throttle = function (fn, milliseconds) {
    let timeout = null, lastCallAt = (new Date()).valueOf() - milliseconds;
    return (...args) => {
        const now = (new Date()).valueOf();
        if ((now - lastCallAt) >= milliseconds) {
            fn(...args);
            lastCallAt = now;
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            fn(...args);
            lastCallAt = (new Date()).valueOf();
        }, milliseconds);
    };
};
/* Returns a fn that should be called repeatedly.
 When it is first called, beforeFn is called, and after
 a break of _milliseconds_, will call afterFn. Repeats
 as needed.
 */
const beforeAndAfter = function (beforeFn, afterFn, milliseconds) {
    let timeout = null;
    return (...args) => {
        if (!timeout) {
            beforeFn(...args);
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            afterFn(...args);
            timeout = null;
        }, milliseconds);
    };
};
function toggleClass(target, className, applyNow) {
    target.classList[applyNow ? 'add' : 'remove'](className);
}
const applyPinnedClass = function (target, pinnedNow, config) {
    toggleClass(target, config.pinnedClass, pinnedNow);
    if (config.pinnedBodyClass)
        toggleClass(document.body, config.pinnedBodyClass, pinnedNow);
};
const strategies = {
    relative: function (target, config) {
        // $target.css('position', 'relative')
        target.style.position = 'relative';
        const moveIt = function () {
            const top = Math.max(0, window.scrollY - config.originalY + config.topMargin);
            target.style.top = `${top}px`;
            // $target.css('top', top)
            applyPinnedClass(target, top > config.pinSlop, config);
        };
        window.addEventListener('scroll', throttle(moveIt, config.throttle));
    },
    relativeWithHiding: function (target, config) {
        target.style.position = 'relative';
        const startMoving = function () {
            const top = Math.max(0, window.scrollY - config.originalY + config.topMargin);
            if (top < config.pinSlop)
                return;
            if (config.movingClass)
                target.classList.add(config.movingClass);
            else
                target.style.opacity = '0.01';
            applyPinnedClass(target, false, config);
        };
        const repositionIt = function () {
            let top = Math.max(0, window.scrollY - config.originalY + config.topMargin);
            if (top <= config.pinSlop)
                top = 0;
            target.style.top = `${top}px`;
            applyPinnedClass(target, top > 0, config);
            if (config.movingClass)
                target.classList.remove(config.movingClass);
            else
                target.style.opacity = '1.0';
        };
        window.addEventListener('scroll', beforeAndAfter(startMoving, repositionIt, config.throttle));
    },
    fixed: function (target, config) {
        const fixIt = function () {
            if ((window.scrollY - config.pinSlop) > (config.originalY - config.topMargin)) {
                target.style.position = 'fixed';
                target.style.top = `${config.topMargin}px`;
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
const defaults = {
    strategy: 'fixed',
    pinSlop: 0,
    topMargin: 0,
    pinnedClass: '_pinnedToTop',
    movingClass: undefined,
    pinnedBodyClass: undefined,
    throttle: 30 // how often to adjust position of element
};
const fixie = function (el, options) {
    const config = Object.assign(Object.assign(Object.assign({}, defaults), options), { originalY: el.offsetTop });
    strategies[config.strategy](el, config);
};
exports.fixie = fixie;
//# sourceMappingURL=fixie.js.map