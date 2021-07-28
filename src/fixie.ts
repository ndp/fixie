type Timeout = NodeJS.Timeout

/**
 * Quick rewrite of my JQuery plugin, fixie.

 */
const throttle = function (fn: (...args: any[]) => void, milliseconds: number){

  let timeout: Timeout | null = null,
    lastCallAt = (new Date()).valueOf() - milliseconds

  return (...args: any[]) => {
    const now = (new Date()).valueOf()
    if ((now - lastCallAt) >= milliseconds) {
      fn(...args)
      lastCallAt = now
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(function (){
      fn(...args)
      lastCallAt = (new Date()).valueOf()
    }, milliseconds)
  }
}


/* Returns a fn that should be called repeatedly.
 When it is first called, beforeFn is called, and after
 a break of _milliseconds_, will call afterFn. Repeats
 as needed.
 */
const beforeAndAfter = function (beforeFn: (...args: any[]) => void,
                                 afterFn: (...args: any[]) => void,
                                 milliseconds: number){
  let timeout: Timeout | null = null

  return (...args: any[]) => {
    if (!timeout) {
      beforeFn(...args)
    }
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(function (){
      afterFn(...args)
      timeout = null
    }, milliseconds)
  }
}


type Configuration = {
  pinnedClass: string
  movingClass?: string
  pinnedBodyClass?: string
  strategy: keyof typeof strategies
  originalY: number
  topMargin: number
  pinSlop: number
  throttle: number
}

type Options = Partial<Configuration>

function toggleClass(target: HTMLElement, className: string, applyNow: boolean){
  target.classList[applyNow ? 'add' : 'remove'](className)
}


const applyPinnedClass = function (target: HTMLElement,
                                   pinnedNow: boolean,
                                   config: Configuration){
  toggleClass(target, config.pinnedClass, pinnedNow)
  if (config.pinnedBodyClass) toggleClass(document.body, config.pinnedBodyClass, pinnedNow)
}

const strategies = {

  relative: function (target: HTMLElement, config: Configuration){
    // $target.css('position', 'relative')
    target.style.position = 'relative'
    const moveIt = function (){
      const top = Math.max(0, window.scrollY - config.originalY + config.topMargin)
      target.style.top = `${top}px`
      // $target.css('top', top)
      applyPinnedClass(target, top > config.pinSlop, config)
    }
    window.addEventListener('scroll', throttle(moveIt, config.throttle))
  },

  relativeWithHiding: function (target: HTMLElement, config: Configuration){
    target.style.position = 'relative'
    const startMoving = function (){
      const top = Math.max(0, window.scrollY - config.originalY + config.topMargin)
      if (top < config.pinSlop) return
      if (config.movingClass)
        target.classList.add(config.movingClass)
      else
        target.style.opacity = '0.01'
      applyPinnedClass(target, false, config)
    }
    const repositionIt = function (){
      let top = Math.max(0, window.scrollY - config.originalY + config.topMargin)
      if (top <= config.pinSlop) top = 0
      target.style.top = `${top}px`
      applyPinnedClass(target, top > 0, config)
      if (config.movingClass)
        target.classList.remove(config.movingClass)
      else
        target.style.opacity = '1.0'
    }
    window.addEventListener('scroll', beforeAndAfter(startMoving, repositionIt, config.throttle))
  },

  fixed: function (target: HTMLElement, config: Configuration){
    const fixIt = function (){
      if ((window.scrollY - config.pinSlop) > (config.originalY - config.topMargin)) {
        target.style.position = 'fixed'
        target.style.top = `${config.topMargin}px`
        applyPinnedClass(target, true, config)
      } else {
        target.style.position = 'relative'
        target.style.top = '0'
        applyPinnedClass(target, false, config)
      }
    }
    window.addEventListener('scroll', throttle(fixIt, config.throttle))
  }
}


/* Finally, what we've been looking for */
const defaults = {
  strategy:        'fixed' as keyof typeof strategies,
  pinSlop:         0,              // make the user scroll extra down the page before the element is fixed?
  topMargin:       0,              // how close to the top to pin it?
  pinnedClass:     '_pinnedToTop', // any css class to add on when pinned
  movingClass:     undefined,      // any css class to add on when moving; setting this means the caller is responsible for showing/hiding during movement
  pinnedBodyClass: undefined,
  throttle:        30             // how often to adjust position of element
}


export const fixie = function (el: HTMLElement, options: Options){

  const config: Configuration = { ...defaults, ...options, originalY: el.offsetTop }

  strategies[config.strategy](el, config)
}

