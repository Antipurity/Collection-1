'use strict'

let c = {
  string: 'string',
  ax: 'ax',
}

;(() => {
  let str, at
  let _ = /[ \n\r\t]*/y

  function get(s) {
    let ok = false
    if (typeof s === 'string') {
      if (s.length === 1)
        return get(s.codePointAt(0))
      else if (str.slice(at, at + s.length) === s)
        at += s.length, ok = true
    } else if (s instanceof RegExp) {
      s.lastIndex = at
      if (s.test(str))
        at = s.lastIndex, ok = true
    } else if (typeof s === 'number')
      str.codePointAt(at) === s && (++at, ok = true)
    else
      return str.codePointAt(at)
    return ok
  }

  function ax() {
    "(a 'zx' ()) to js['a', ['string', 'zx'], []]"
    let l = '('.codePointAt(0), r = ')'.codePointAt(0)
    if (!get(l)) return
    let arr = []
    while (at < str.length) {
      arr.push(expr())
      if (arr[arr.length - 1] == null)
        return arr.pop(), get(r) ? arr : void 0
    }
  }
  function label() {
    "ab to js'ab'"
    "(Labels should be far more common than strings, so they are represented directly.)"
    let a = 'a'.codePointAt(0), z = 'z'.codePointAt(0)
    let A = 'A'.codePointAt(0), Z = 'Z'.codePointAt(0)
    let dot = '.'.codePointAt(0)
    let from = at
    while (at < str.length) {
      let c = get()
      if (a<=c && c<=z || A<=c && c<=Z || c === dot) ++at
      else break
    }
    if (from === at) return
    return str.slice(from, at)
  }
  function string() {
    "'zxcv' to js['string', 'zxcv']."
    "'zx''cv' to js['string', 'zx\'cv']."
    "'\n' to js['string', '\\n']."
    let q = "'".codePointAt(0)
    if (!get(q)) return
    let from = at
    while (at < str.length) {
      if (get(q)) {
        if (get(q)) continue
        else break
      }
      ++at
    }
    if (str.codePointAt(at) !== q) return
    return ['string', str.slice(from, at-1).replace(/''/g, "'")]
  }

  function expr() {
    get(_)
    const r = ax() || label() || string()
    get(_)
    return r
  }

  function parse(s) {
    str = s, at = 0
    const r = expr()
    if (r == null)
      return ['error', 'parse failed to pierce ' + str.slice(at)]
    if (at === str.length)
      return r
    return ['eval', r, ['string', str.slice(at)]]
  }

  function serialize(s) {
    // Must turn it into what it would parse into — parse(serialize(…)) should mean the same thing.
    return JSON.stringify(s, null, 2)
  }

  function step(x) {
    // Transform x into what it is defined to become.
    return x
  }

  // The interpreter loop.

  let x, id
  let show = x => {
    try { resultArea.setValue(serialize(x)) }
    catch (e) { resultArea.setValue(serialize(['error', 'Cannot serialize'])) }
  }

  let lastStart = performance.now(), used = 0, total = 0
  const rememberCoef = .9

  let onChange = (() => {
    try { x = parse(codeArea.getValue()) }
    catch (e) { x = null, show(['error', 'Cannot parse']) }
    cancelAnimationFrame(id)
    id = requestAnimationFrame(function loop() {
      const start = performance.now()

      // Continue the loop next time.
      id = requestAnimationFrame(loop)

      const max = timeUsed.value / 100
      if (used < total * max) {
        const end = start + (Math.min(15, (total * max - used) / (1 - max)) || 0)
          // Limit to 10ms to hopefully ensure smoothness (10ms is likely less than 1 animation frame minus any browser work).

        // Iterate until we are out of budget for this frame:
        do {
          // Do one interpretation step (loop iteration).
          try { x = step(x) }
          catch (e) { x = ['error', 'Cannot step'], cancelAnimationFrame(loop) }
        } while (performance.now() < end)

        // Show the intermediate result, for instant feedback.
        show(x)
      }

      // Track used/total times, forgetting.
      used *= rememberCoef, total *= rememberCoef
      used += performance.now() - start
      total += performance.now() - lastStart
      lastStart = start

      // Show used/total times.
      timeUsedLabel.textContent = `${(max*100).toFixed(0)}% needed, ${(used/total*100).toFixed(0)}% actual`
    })
})

  codeArea.on('changes', onChange)
  onChange()
})()
