'use strict'

const def = Symbol('defines')

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
    // parse(serialize(…)) should mean the same thing.
    if (typeof s == 'string')
      return /^[a-z.A-Z]+$/.test(s) ? s : "(label '" + s.replace(/'/g, "''") + "')"
    if (s instanceof Array) {
      //(serialize (string [js String Str])) → (flat '''' (replace.all Str '''' '''''') '''')
      //(serialize (ax last Rest)) → (flat '[' (map Rest serialize) ']')
      //(serialize (ax first Rest)) → (flat '{' (map Rest serialize) '}')
      //(serialize [js Array Rest]) → (flat '(' (map Rest serialize) ')')
      if (s[0] === 'string' && typeof s[1] === 'string' && s[2] == null)
        return "'" + s[1].replace(/'/g, "''") + "'"
      if (s[0] === 'last')
        return '[' + s.slice(1).map(x => serialize(x)).join(' ') + ']'
      if (s[0] === 'first')
        return '{' + s.slice(1).map(x => serialize(x)).join(' ') + '}'
      return '(' + s.map(x => serialize(x)).join(' ') + ')'
    }
    if (typeof s == 'function') {
      if (!serialize.ok(''+s)) return s.name ? '<js ' + s.name + '>' : '<???>'
      s = s.toString()
      return '(js ' + [...serialize.args(s), serialize(serialize.body(s))].join(' ') + ')'
    }
    return '<json ' + JSON.stringify(s, null, 2) + '>' || '<???>'
  }
  serialize.ok = s => s.slice(0,8) != 'function' && s.indexOf(')=>') >= 0
  serialize.args = s => s.slice(s.indexOf('(') + 1, s.indexOf(')')).split(',')
  serialize.body = s => ['string', s.slice(s.indexOf(')=>') + 3)]

  const commands = {
    do(data) { return ['do', x[1] === 'z' ? 'x' : 'z'] },
    js(...args) {
      if (args.length < 1) throw 'Expected at least a body'
      let s = "'use strict'; return ", body = args.pop()
      for (let i = 0; i < args.length; ++i) {
        if (typeof args[i] != 'string') throw 'Expected a string arg'
        if (args[i].indexOf('.') >= 0) throw 'Args cannot have dots inside'
      }
      if (typeof body != 'string') throw 'Expected a string body'
      s += '(' + args + ')=>'
      s += body[0] == '{' ? body : '(' + body + ')'
      return Function(s)()
    },
    bind(a,b) {
      if (a === b) return []
      if (a instanceof Array && b instanceof Array) {
        // (bind (to A B) (to C D)) → {(bind A C) (bind B D)}
        if (a[0] === b[0] && a[0] === 'to' && a.length == 3 && b.length == 3)
          return ['first', ['bind', a[1], b[1]], ['bind', a[2], b[2]]]
        // (bind (label A) (label B)) → (bind A B)
        if (a[0] === b[0] && a[0] === 'label' && a.length == 2 && b.length == 2)
          return ['bind', a[1], b[1]]
      }
      // Native bases of (bind (to A B) (to C D)) → {(bind A C) (bind B D)}
      if (a instanceof Array && a[0] === 'to' && a.length == 3 && typeof b == 'function' && serialize.ok(b))
        return ['first', ['bind', a[1], serialize.args(''+b)], ['bind', a[2], serialize.body(''+b)]]
      if (typeof a == 'function' && serialize.ok(''+a) && b instanceof Array && b[0] === 'to' && b.length == 3)
        return ['first', ['bind', serialize.args(''+a), b[1]], ['bind', serialize.body(''+a), b[2]]]
      if (typeof a == 'function' && serialize.ok(''+a) && typeof b == 'function' && serialize.ok(b) && ''+a == ''+b)
        return []
      // Native bases of (bind (label A) (label B)) → (bind A B)
      if (typeof a == 'string' && b instanceof Array && b[0] === 'label' && b.length == 2 && a == b[1])
        return []
      if (a instanceof Array && a[0] === 'label' && a.length == 2 && typeof b == 'string' && a[1] == b)
        return []
      if (typeof a == 'string' && typeof b == 'string' && a == b)
        return []
      // (bind (label Name) Value) → (to (label Name) Value)
      if (a instanceof Array && a[0] === 'label' && a.length == 2)
        return ['to', a[1], b]
      if (typeof a == 'string')
        return ['to', a, b]
    },
    rewrite(r,x) {
      // (rewrite R (record X)) → (rewrite R X)
      if (x instanceof Array && x[0] === 'record' && x[2] == null)
        return ['rewrite', r, x[1]]
      // (rewrite Ra (rewrite Rb x)) → (rewrite (first Rb Ra) x)
      if (x instanceof Array && x[0] === 'rewrite' && x.length == 3)
        return ['rewrite', ['first', x[1], r], x[2]]
      // (rewrite r (f x)) → ((rewrite r f) (rewrite r x))
      if (x instanceof Array)
        return x.map(e => ['rewrite', r, e])
      // (rewrite r x) → (r x)
      return [r,x]
    },
  }
  delete commands.js.length

  function spaghettify(a) {
    // [F, A,B,C,D,E,F] → [F,A,[F,B,[F,C,[F,D,E]]]]
    let b = a[a.length-1], c
    for (let i = a.length-2; i > 0; --i) {
      c = b, b = new Array(3)
      b[0] = a[0], b[1] = a[i], b[2] = c
    }
    return b
  }

  function step(x) {
    // Transform x into what it is defined to become.
    if (x instanceof Array) {
      if (typeof x[0] == 'string')
        if (commands[x[0]] != null)
          x = [commands[x[0]], ...x.slice(1)]
      if (typeof x[0] == 'function') {
        // Use a native function (ax (js ... Body) Data) as a rule.
        if (x[0].length != null && x[0].length != x.length-1)
          return ['error', `Expected ${x[0].length} arguments to ${serialize(x[0])} but got ${x.length-1}`]
        let r
        try {
          // …Must first evaluate args…
          if (x.length == 1) r = x[0].call(x[0])
          else if (x.length == 2) r = x[0].call(x[0], x[1])
          else if (x.length == 3) r = x[0].call(x[0], x[1], x[2])
          else if (x.length == 4) r = x[0].call(x[0], x[1], x[2], x[3])
          else r = x[0].call(...x)
          if (r === void 0) r = ['error']
        } catch (e) { r = e instanceof Error ? ['error', e.message] : ['error', e] }
        return r
      }
      if (x[0] === 'first') {
        // {X} → X
        if (x.length == 2) return x[1]
        // {X Y} → (do X (js X 'is(X, Err) ? Y : X'))
        if (x.length == 3)
          return onError(x[2]), x[1]
        // (ax first X Rest) → {X (ax first Rest)}, all at once.
        return spaghettify(x)
      }
      if (x[0] === 'last') {
        // [X] → X
        if (x.length == 2) return x[1]
        // [X Y] → (do X (js X 'is(X, Err) ? X : Y'))
        if (x.length == 3)
          return onOk(x[2]), x[1]
        // (ax last X Rest) → [X (ax last Rest)], all at once.
        return spaghettify(x)
      }
      if (x[0] === 'bind' && x.length == 3) {
        // (bind (ax first X Rest) Value) → {(bind X Value) (bind (ax first Rest) Value)}
        // (bind (ax last X Rest) Value) → [(bind X Value) (bind (ax last Rest) Value)]
        if (x[1] instanceof Array && (x[1][0] === 'first' || x[1][0] === 'last'))
          return [x[1][0], ['bind', x[1][1], x[2]], ['bind', [x[1][0], ...x[1].slice(2)], x[2]]]
      }
      if (x[0] instanceof Array) {
        // (ax (ax first X Rest)) Args) → {(ax X Args) (ax (ax first Rest) Args)}
        // (ax (ax last X Rest)) Args) → [(ax X Args) (ax (ax last Rest) Args)]
        if (x[0][0] === 'first' || x[0][0] === 'last')
          return [x[0][0], [x[0][1], ...x.slice(1)], [[x[0][0], ...x[0].slice(2)], ...x.slice(1)]]
      }
      // ...And the rest of the semantics...
    }
    // [(concept Defines) X] → (Defines X)
    if (x && x[def] != null)
      return [x[def], x]
  }

  let x, cc // Know not only the path but also what it is walked for.
  function storeInArray(arr, i) {
    // To finish an array slot then the array, do `x = storeInArray(x = [...x], 2)`.
    // Fill-and-return [1,2]: `let a = x = [0,0]; storeInArray(a,1), x=2; storeInArray(a,0), x=1`.
    function f() {
      f.arr[f.i] = x
      x = f.x, cc = f.cc
    }
    f.arr = arr, f.i = i
    f.x = x, f.cc = cc
    cc = f
    return arr[i]
  }
  function onError(then) {
    function f() {
      if (x instanceof Array && x[0] === 'error') x = f.x
      cc = f.cc
    }
    f.x = then, f.cc = cc, cc = f
  }
  function onOk(then) {
    function f() {
      if (!(x instanceof Array && x[0] === 'error')) x = f.x
      cc = f.cc
    }
    f.x = then, f.cc = cc, cc = f
  }

  (() => { // The interpreter loop.

    let id
    const show = x => {
      try { resultArea.setValue(serialize(x)) }
      catch (e) { resultArea.setValue(serialize(['error', 'Cannot serialize'])) }
    }
    let lastTime = 0
    const showTime = () => {
      let t = used/total*100 | 0
      if (t === lastTime) return
      timeActualLabel.textContent = x != null ? t : '—'
      lastTime = t
    }

    const schedule = requestAnimationFrame, cancel = cancelAnimationFrame
    const time = performance.now.bind(performance)
    let lastEnd = time(), used = 0, total = 0
    const rememberCoef = .9

    function loop() {
      if (x == null) return
      const start = time()
      try {
        // Continue the loop later.
        id = schedule(loop)

        const need = timeNeeded.value / 100
        if (used < total * need) {
          const end = start + (Math.min(10, (total * need - used) / (1 - need)) || 0)
            // end + used = (end + total)*need, where only end is unknown.
            // Limit to 10ms to hopefully ensure smoothness (10ms is likely less than 1 animation frame minus any browser work).

          try {
            // Iterate (interpret expressions, step by step) until we are out of budget for this frame.
            do {
              // If no progress is possible, the current job is done; else continue.
              let y = step(x)
              if (x === y || y == null) cc()
              else x = y
            } while (x != null && time() < end)
          } catch (e) { console.log(e), x = cc = null, show((e instanceof Error) && ['error', e.message, e.stack] || e || ['error', 'Cannot step']) }

          if (x == null) id = void cancel(id)
          else show(x)
        }

        showTime()
      } finally {
        // Track used/total times, forgetting in order to converge.
        used *= rememberCoef, total *= rememberCoef
        const now = time()
        used += now - start
        total += now - lastEnd, lastEnd = now
      }
    }

    const onChange = (() => {
      lastEnd = time()
      try { x = parse(codeArea.getValue()), cc = onDone }
      catch (e) { x = null, show(['error', 'Cannot parse']) }
      show(x)
      cancel(id), id = schedule(loop)
    })
    const onDone = (() => { show(x), x = cc = null })

    codeArea.on('changes', onChange)
    ;(timeNeeded.oninput = () => timeNeededLabel.textContent = timeNeeded.value)()
    onChange()
  })();

  (() => { // Randomness.
    commands.less = function less(n) {
      // Picks a random non-negative integer less than n.
      // An interface to crypto.getRandomValues for generating random numbers on-demand as opposed to in-batches, optimized to request the least amount of random bits required.
      if (n instanceof Array && n[0] === 'string') n = +n[1]
      if (n !== (n>>>0))
        throw 'Expected uint32 as limit of randomness'
      if (n === 0) return bits()
      if (n === 1) return 0
      if (!(n & (n-1))) return bits(count(end))

      let i=0, q0=0, q1=0;
      if (oldn === n) i = oldi, q0 = (1 << i) % n;
      else {
        i = count(n) + 1, q0 = (1 << i) % n, q1 = 2*q0, q1>=n && (q1-=n);
        "Expected bit-cost of i: i / (1 - (2**i)%n/(2**i)). Seek while next is less."
        while (true) {
          if (i >= 32) { i = 32; break }
          'These are tricks to express comparisons by that formula in int arithmetic.'
          if (i <= 15) {
            if ((1<<(2*i+1)) <= ( q1*(i<<i) - q0*((i+1)<<(i+1)) )) break;
          } else if (i <= 20) {
            if ((1<<(2*i-9)) <= ( q1*(i<<(i-9)) - q0*((i+1)<<(i-8)) )) break;
          } else if (i <= 25) {
            if ((1<<(2*i-19)) <= ( q1*(i<<(i-19)) - q0*((i+1)<<(i-18)) )) break;
          } else {
            if (i*(1-(2*2**i)%n/(2*2**i)) <= (i+1)*(1-(2**i)%n/(2**i))) break;
          }
          ++i, q0 = q1, q1 *= 2, q1>=n && (q1-=n);
        }
        oldn = n, oldi = i;
      }
      q1 = (i < 32 ? 1 << i : 2 ** i) - q0;
      do { q0 = bits(i) } while (q0 >= q1);
      return q0 % n
    }

    commands.roll = function(p) {
      // Returns 0 with probability p, else undefined.
      // Equivalent to 'Math.random() < p' with checks on p (it should be 0…1), but faster.
      if (typeof p != 'number') throw 'Expected a number'
      if (p < 0) throw 'Probability is too low: '+p;
      if (p > 1) throw 'Probability is too high: '+p;
      if (p !== p) throw 'Probability is NaN';
      if (p === 1) return 0;
      while (true) {
        const n = Math.floor(p *= 16);
        if (p === n) {
          if (!n) return;
          if (n === n >> 3 << 3) return !bits(1) ? 0 : void 0;
          if (n === n >> 2 << 2) return bits(2) < (n >> 2) ? 0 : void 0;
          if (n === n >> 1 << 1) return bits(3) < (n >> 1) ? 0 : void 0;
        }
        const r = bits(4);
        if (r !== n || p === n) return r < n ? 0 : void 0;
        else p -= n;
      }
      // Generating (up to) 4 bits at a time is not based on past performance measures, or anything.
      // Using 4 bits at a time consumes on average about double the bits that using 1 bit at a time would, but should be much faster.
    }

    function bits(n) {
      if (!n) {
        if (pos >= a.length) pos = 0, fill(a);
        return a[pos++];
      }
      if (n !== (n & 31)) throw 'Expected 0…31 bits to generate (where 0 is 32)';
      if (bits.n === void 0) bits.r = bits.n = 0;
      let r = 0;
      if (n > bits.n) r = bits.r, n -= bits.n, bits.r = bits(), bits.n = 32;
      r = (r << n) | (bits.r & ((1 << n) - 1)), bits.n -= n, bits.r >>>= n;
      return r;
    }

    function fill(a) {
      a = new Uint8Array(a.buffer || a);
      let bytes = a.byteLength
      if (typeof crypto!==''+void 0 && crypto.getRandomValues) {
        const quota = 65536, n = Math.floor(bytes/quota);
        let src = n && new Uint8Array(quota), i;
        for (i = 0; i < n; ++i)
          crypto.getRandomValues(src), a.set(src, i*quota);
        src = new Uint8Array(bytes - n*quota);
        crypto.getRandomValues(src), a.set(src, n*quota);
      } else for (let i = 0; i < a.length; ++i)
        a[i] = (Math.random() * Math.pow(2,32)) >>> 0;
      return a;
    }

    function count(n) { let x=0; while (n >>>= 1) ++x; return x }

    let a = new Uint32Array(1024), pos = 1024, limit = Math.pow(2, 32), oldn = 0, oldi = 0
  })()
})()
