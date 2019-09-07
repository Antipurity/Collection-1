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
    "(a b c) to js['a', 'b', 'c']"
    let lA = '('.codePointAt(0), rA = ')'.codePointAt(0)
    "{a b c} to js['first', 'a', 'b', 'c']"
    let lF = '{'.codePointAt(0), rF = '}'.codePointAt(0)
    "[a b c] to js['last', 'a', 'b', 'c']"
    let lL = '['.codePointAt(0), rL = ']'.codePointAt(0)

    let L = get(lL), F = get(lF)
    if (!L && !F && !get(lA)) return
    let arr = []
    L && arr.push('last'), F && arr.push('first')
    while (at < str.length) {
      let x = expr()
      if (x == null)
        return get(L ? rL : F ? rF : rA) ? arr : void 0
      else
        arr.push(x)
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
    if (str.codePointAt(at-1) !== q) return
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
    if (typeof s === 'string')
      return /^[a-z.A-Z]+$/.test(s) ? s : "(label '" + s.replace(/'/g, "''") + "')"
    if (s instanceof Array) {
      if (s.length === 1) return serialize(s[0])
        // Optimize this little case.

      if (s[0] === 'string' && typeof s[1] === 'string' && s[2] == null)
        return "'" + s[1].replace(/'/g, "''") + "'"
      if (s[0] === 'last')
        return '[' + s.slice(1).map(x => serialize(x)).join(' ') + ']'
      if (s[0] === 'first')
        return '{' + s.slice(1).map(x => serialize(x)).join(' ') + '}'
      return '(' + s.map(x => serialize(x)).join(' ') + ')'
    }
    return JSON.stringify(s, null, 2)
  }

  function step(x) {
    // Transform x into what it is defined to become.
    if (x instanceof Array) {
      if (x[0] === 'do' && x[2] == null)
        return ['do', x[1] === 'z' ? 'x' : 'z']
      // Branch on its first element, a string that could be 'first', 'last', or a call to another function…
      // All that's left is to plug in the semantics.
    }
    throw ['error', ['join', 'No semantics defined for', x]]
  }

  // The interpreter loop.

  let x, id
  let show = x => {
    try { resultArea.setValue(serialize(x)) }
    catch (e) { resultArea.setValue(serialize(['error', 'Cannot serialize'])) }
  }

  const schedule = requestAnimationFrame, cancel = cancelAnimationFrame
  const time = performance.now.bind(performance)
  let lastEnd = time(), used = 0, total = 0
  const rememberCoef = .9

  const onChange = (() => {
    try { x = parse(codeArea.getValue()) }
    catch (e) { x = null, show(['error', 'Cannot parse']) }
    cancel(id)
    id = schedule(function loop() {
      const start = time()

      // Continue the loop later.
      id = schedule(loop)

      const max = timeUsed.value / 100
      if (used < total * max) {
        const end = start + (Math.min(10, (total * max - used) / (1 - max)) || 0)
          // end + used = (end + total)*max
            //(...Can't we basically support this usage in binding too, via searching every alternative/equivalency until a satisfactory one (with only the one unknown on one side) is found?)
          // Limit to 10ms to hopefully ensure smoothness (10ms is likely less than 1 animation frame minus any browser work).

        // Iterate until we are out of budget for this frame:
        do {
          // Do one interpretation step (loop iteration).
          try { x = step(x) }
          catch (e) { x = e || ['error', 'Cannot step'], cancel(id) }
        } while (time() < end)

        // Show the intermediate result, for instant feedback.
        show(x)
      }

      // Track used/total times, forgetting.
      used *= rememberCoef, total *= rememberCoef
      const now = time()
      used += now - start
      total += now - lastEnd, lastEnd = now

      // Show used/total times.
      timeUsedLabel.textContent = `${(max*100).toFixed(0)}% needed, ${(used/total*100).toFixed(0)}% actual`
    })
})

  codeArea.on('changes', onChange)
  onChange()
})()
