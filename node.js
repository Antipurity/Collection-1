'use strict';(typeof self!=''+void 0?self:global).code=()=>{};


code({
	name:"basicUtility",

	define:{
		equals:{
			txt:"returns true if values of all args are considered equal, false otherwise",
/*
//should probably have caching infrastructure (to allow free-all to be centralized) before this
	var eq = new Map; stop(setInterval(() => eq.clear(), 1234));
	self.equals = function equals(a,b) {
		if (Object.is(a,b) || a && b && (eq.get(a)===b || eq.get(b)===a)) return true;
		if (typeof a !== 'object' || typeof b !== 'object') return false;
		if (Array.isArray(a)) {
			if (!Array.isArray(b) || a.length !== b.length) return false;
			for (var i=0; i<a.length; ++i) if (!equals(a[i], b[i])) return false;
			return eq.set(a,b), eq.set(b,a), true;
		} else if (a instanceof Any || b instanceof Any) {
			for (var i of (a instanceof Any ? a : b).path) if (equals(i,b)) return eq.set(a,b), eq.set(b,a), true; return false;
		} else if (a && b && 'equals' in a && Object.getPrototypeOf(a) === Object.getPrototypeOf(b))
			return a.equals(b) ? (eq.set(a,b), eq.set(b,a), true) : false;
		else return a && b ? equals(Object.keys(a), Object.keys(b)) && equals(Object.values(a), Object.values(b)) && (eq.set(a,b), eq.set(b,a), true) : false; };
*/
			call(...x) {}},
		stack:{
			txt:"returns the current callstack (or of an Error)",
			//should return an array of function references, not of strings of filename:line:column
			call(e = void 0) {}},
		prettify:{
			txt:"",
/*
	self.prettify = (s, i=undefined, arr=undefined) => {
		if (i===undefined && Array.isArray(s)) return typeof s.last==='string' ? s.map(prettify) : [...s, '.'].map(prettify);
		if (typeof s!=='string') return s; if (s[s.length-1] === '/') s = s.slice(0,-1); s = s.replace(/_/g, ' ').replace(/-/g, ' ').trim();
		if (s.indexOf('://')>=0) s = s.slice(s.lastIndexOf('/')+1, s.lastIndexOf('.')>s.lastIndexOf('/') ? s.lastIndexOf('.') : undefined);
		if (!i && s[0]) s = s[0].toUpperCase() + s.slice(1); if ((i===undefined || i===arr.length-1) && !'.!?:'.includes(s[s.length-1])) s += '.';
		return s.replace(/[\.\?\!]\s*./g, s => s.toUpperCase()).replace(/[a-z][A-Z][a-zA-Z]/g, s => s[0] + ' ' + (s[2] === s[2].toLowerCase() ? s[1].toLowerCase() : s[1]) + s[2]); };
	//should only capitalize letters after '.' if there was no whitespace before it and a single whitespace after.
*/
			call() {}},
		unprettify:{
			txt:"",
			call() {}},
		Array:{
			prototype:{
/*
//except, we can't have getters/setters, right?
	push(...a) { ref.of(this) && ref.bytes(8*a.length); push.apply(this,a); return a.last },
	pop() { ref.of(this) && ref.bytes(-8); return pop.call(this) },
	swap(i,j) { [this[i], this[j]] = [this[j], this[i]];  return this },
	filter(pass, thisArg=undefined) {
		try {
			for (var i=0, to=0; i<this.length; ++i)
				if (!pass.call(thisArg, this[i], i, this)) this[i] = void(ref.of(this) && unref(this[i]));
				else to!==i && (this[to] = this[i], this[i] = undefined), ++to;
			ref.of(this) && ref.bytes(8 * (to-this.length));  this.length = to;  return this;
		} catch (err) {
			for (++i; i<this.length; ++i) to!==i && (this[to] = this[i], this[i] = undefined), ++to;
			ref.of(this) && ref.bytes(8 * (to-this.length));  this.length = to;  throw err; } },
	get last() { return this[this.length-1] },  set last(to) { ref.of(this) && to!==this.last && unref(this.last);  this[this.length-1] = to },
	get sum() { for (var s=0, i=0; i<this.length; ++i) s+=this[i]; return s },  set sum(to) { to/=this.sum;  for (var i=0; i<this.length; ++i) this[i]*=to },
	get mult() { for (var s=1, i=0; i<this.length; ++i) s*=this[i]; return s },  set mult(to) { for (var l=this.length, m=Math.pow(to/this.mult,1/l), i=0;i<l;++i) this[i]*=m },
	get min() { for (var s=this[0], i=1; i<this.length; ++i) s = Math.min(s, this[i]); return s },
	get max() { for (var s=this[0], i=1; i<this.length; ++i) s = Math.max(s, this[i]); return s },
	set min(to) { for (var i=0; i<this.length; ++i) if (this[i]<to) this[i]=to },
	set max(to) { for (var i=0; i<this.length; ++i) if (this[i]>to) this[i]=to },
	get sample() {
		for (var s = random()*this.sum, i = 0; i < this.length; ++i)
			if (!(this[i] >= 0) && assert(0, 'sampling from a partly-negative (or NaN) array:', this), (s -= this[i]) <= 0) return i;
		return null; },
*/
			},
		},
	}
});








code({
	name:"diff",
	lcs:{
		txt:"longest common subsequence",
		//should have tests too.
		call(a,b, eq) {
			var costs = {}, editX = {}, editY = {};
			cost(a.length-1, b.length-1);
			var d = [], x = a.length-1, y = b.length-1;
			while (x>=0 || y>=0) {
				while (x>=0 && y>=0 && (!eq ? a[x] === b[y] : eq(a[x], b[y]))) --x, --y;
				if (x<0 || y<0) var i = j = -1;
				else var i = editX[x][y], j = editY[x][y];
				if (i<x || j<y) d.push(i+1, x+1, j+1, y+1);
				[x, y] = [i, j];
			}
			return d;

			function cost(i,j) {
				while (i>=0 && j>=0 && (!eq ? a[i] === b[j] : eq(a[i], b[j]))) --i, --j;
				if (i<0 || j<0) return i>=0 ? i+1 : j+1;
				if (costs[i] && costs[i][j] !== void 0) return costs[i][j];
				var min = i+j+2, mx = -1, my = -1;
				for (var d = 1; d < min; ++d) {
					var x = i>=d ? i-d : 0, y = i>=d ? j : j+i-d;
					for (var cur = 0; x <= i && y >= 0 && y >= j-d; ++x, --y)
						if (!eq ? a[x] === b[y] : eq(a[x], b[y]))
							if ((cur = d + cost(x,y)) < min) min = cur, mx=x, my=y;
				}
				if (!costs[i]) costs[i] = {};  costs[i][j] = min;
				if (!editX[i]) editX[i] = {};  editX[i][j] = mx;
				if (!editY[i]) editY[i] = {};  editY[i][j] = my;
				return min;
			}
		},
		alt:[(a,b,eq) => {
			var al = a.length, bl = b.length, pre = 0, end = 0;
			while (pre < al && pre < bl && a[pre] === b[pre]) ++pre;
			while (end < al-pre && end < bl-pre && a[al-end-1] === b[bl-end-1]) ++end;
			al = al-pre-end, bl = bl-pre-end;
			var l = new Array(al * bl).fill(0);
			for (var i = 0; i < al; ++i)
				for (var j = 0; j < bl; ++j)
					if (!eq ? a[pre+i] === b[pre+j] : eq(a[pre+i], b[pre+i]))
						l[i*bl+j] = (i && j ? l[i*bl+j-bl-1] : 0) + 1;
					else {
						if (i) l[i*bl+j] = l[i*bl+j-bl];
						if (j) l[i*bl+j] = Math.max(l[i*bl+j], l[i*bl+j-1]);
					}
			var i = al-1, j = bl-1, d = [i,i,j,j];
			while (i>=0 || j>=0)
				if ((!eq ? a[pre+i] === b[pre+j] : eq(a[pre+i], b[pre+i])) && i>=0 && j>=0)
					--i, --j;
				else if (i>=0 && (j<=0 || l[i*bl+j] === l[i*bl+j-bl]))
					d[d.length-4]===i-- ? --d[d.length-4] : d.push(i,i+1,j,j);
				else if (j>=0 && (i<=0 || l[i*bl+j] === l[i*bl+j-1]))
					d[d.length-2]===j-- ? --d[d.length-2] : d.push(i,i,j,j+1);
				else break;
			l.length = 0;
			for (var i=0; i<d.length; ++i) d[i] += pre+1;
			return d;
		}]
	},
	define:{
		diff:{
			txt:"get (or apply or merge) the difference D between two strings or arrays; (a,b)->D, (a,D)->b, a<-(D,b), and to combine consecutive diffs: ((a,b), (b,c))->(a,c)",
			extra:"passing a function as a third parameter will have it be used as an equality-checking operator (else, === is used)",
			eqv:[
				(a,b, eq=null) => b === diff(a, diff(a,b, eq), eq),
				(a,b, eq=null) => a === diff(diff(a,b, eq), b, eq),
				(a,b,c) => c === diff(a, diff(diff(a,b), diff(b,c))),
				(a, eq=null) => a === diff(a, diff(a,a, eq), eq) === diff(diff(a,a, eq), a, eq),
			],
			call(a,b, eq = null) {
					//maybe we should also pass in max time to work (if exceeded, give up and try to find rest-of-a's prefix in b)
				if (typeof a!=='string'&&!Array.isArray(a) || typeof b!=='string'&&!Array.isArray(b))
					code.err('invalid types to diff');
				//should also check that eq is null or a function.
				//maybe also check that any diffs's lengths are divisible by 3 (and indexes are rising)?
					//maybe have a function, isDiff? (or diff.is)
					//or maybe make Diff a class?
				if (a.diff === void 0 && b.diff === void 0) {
					var d = this.lcs(a,b,eq);
					if (d.length && (a.length < d[d.length-3] || b.length < d[d.length-1]))
						code.err('lcs implementation produced an out-of-bounds result');
					for (var out = [], s = 0, i = d.length-4; i >= 0; i -= 4)
						s += d[i] + d[i+3] - d[i+1] - d[i+2],
						out.push(d[i], a.slice(d[i], d[i+1]), b.slice(d[i+2], d[i+3]));
					if (a.length + s !== b.length)
						code.err('lcs implementation produced an incorrect-length result');
					out.diff = eq;
					if (!Array.isArray(a))
					if (this.diff(a, out) !== b) throw 'diff implementation is invalid';
					return out;
				} else if (a.diff === void 0) {
					if (b.diff !== eq) code.err('using a different eq than the one used to create the diff, to go forward');
					var out = [], j = 0;
					for (var i=0; i<b.length; i += 3) {
						if (j>b[i]) code.err('invalid diff to go forward — sections overlap');
						out.push(a.slice(j, b[i]), b[i+2]), j = b[i] + b[i+1].length;
					}
					out.push(a.slice(j));
					return Array.isArray(a) ? [].concat(...out) : out.join('');
				} else if (b.diff === void 0) {
					if (a.diff !== eq) code.err('using a different eq than the one used to create the diff, to go back');
					var out = [], j = 0, off = 0;
					for (var i=0; i<a.length; i += 3) {
						if (j>a[i]-off) code.err('invalid diff to go back — sections overlap');
						out.push(b.slice(j, a[i]-off), a[i+1]);
						j = a[i]-off + a[i+2].length;
						off += a[i+1].length - a[i+2].length;
					}
					out.push(b.slice(j));
					return Array.isArray(b) ? [].concat(...out) : out.join('');
				} else {
					//this shouldn't be a parallel-changes merge, this should be consecutive-merge:
						//shift b's indexes, and also, there can be no errors.
					if (a.diff !== b.diff) code.err('merging diffs with different eq functions');
					var res = [], err = null;
					for (var i=0, j=0; i<a.length && j<b.length; ) {
						var a2 = a[i] + a[i+1].length, b2 = b[j] + b[j+1].length;
						//uhh, same-position inserts resolve to the second one (should be err)... why?
							//diff( diff('abc', 'abxxc') , diff('abc', 'abyyc') )->[2,'','yy']
							//and both having smth to remove leads to a nasty infinite cycle.
								//Man, we really do need to finish that sandbox-from-timeouts thing.
						if (Math.min(a2, b2) > Math.max(a[i], b[j])) {
							//should have eq be the resolver (removed, a,b)->a|b|Source|void
							if (!err) err = res, res = null, err.length = 0, err.diff = a.diff;
							var at = Math.max(a[i], b[j]);
							err.push(at);
							err.push((at === a[i] ? a[i+1] : b[i+1]).slice(0, Math.min(a2, b2) - at));
							err.push(a[i+2].slice(at, Math.min(a2, b2) - at));
							err.push(b[j+2].slice(at, Math.min(a2, b2) - at));
						} else if (res) {
							if (b2 === a[i])
								res[res.length-2] += a[i+1], res[res.length-1] += a[i+2], i += 3;
							else if (a2 === b[j])
								res[res.length-2] += b[j+1], res[res.length-1] += b[j+2], j += 3;
							else if (a[i] < b[j])
								res.push(a[i++], a[i++], a[i++]);
							else
								res.push(b[j++], b[j++], b[j++]);
						}
					}
					if (res) {
						while (i<a.length) res.push(a[i++], a[i++], a[i++]);
						while (j<b.length) res.push(b[j++], b[j++], b[j++]);
						//should also check that resulting length is correct.
						return res;
					} else return err;
				}
			},
			//should have diff.merge(a,b, (a,b,i,removed)=>a|b|Source|void)
		}
	},
		//should have it be an object, not a list of names
	report:`Report, 2018.10.10, on a diff algorithm:

A proper implementation of an algorithm that finds the difference of two strings or arrays is very useful in any cases where they both change and are presented to the user.
(Minimal difference (deletions and insertions and their positions) can be computed from the longest common subsequence of inputs; whatever is not in there is deleted or inserted.)
As an example, a (visual) framework which expands values according to rules into an HTML-element tree (for creating an interface) would use it, on update, to determine which elements were removed, inserted, or moved (and may play appropriate animations for those).
Or, a parsed-string editor would be able to use both the parsed structure and the diffs to communicate what changed (since last seen, or since a commit, and so on).
Or, a version-control system would use that.

Anyway, a simple modification of the Wagner-Fischer algorithm (for equal chars, m[i,j] is m[i-1,j-1]+1; else, max(m[i-1,j], m[i,j-1]), and after, trace back steps to get deletion/insertion info) (O(N×M) runtime) exists to optimize runtime for handling few changes (the most common case).
First, a complete fill of N×M matrix is often wasteful. Recursion with memoization can perform better (assuming the overhead is practically neutralized).
The structure of filling allows more compact representations than a full matrix, in cases of equal-substrings (snakes, (i,j)->(i+k, j+k)) and no-equal-chars (no-snake) areas (if we look not for max LCS length but min edits).
So, if we skip to the base of a snake (no count-of-edits change) and then find the best of all equal-edit-distance-to-base snakes (searching an expanding-each-step triangle), we will only need to store info attached to snake bases: (i,j)->(edits, gotoI, gotoJ).
If there aren't many changes between inputs, this should work significantly faster than processing each of N×M matrix elements separately.
However, since no-snake areas can overlap and no memoization is done for this case, processing time may be higher than expected.
How much higher though? Worst case should be, one-length snakes on the diagonal (so, 'ABCDEFG'->'GFEDCBA') (most no-snakes area, and most snakes required); for N=M, its runtime is O(N³).

Further improvements may include:
Improving the worst-case runtime, by memoizing partial results of a best-snake computation, at the two sides of the no-snake area. A lot will be memoized this way though.
Allowing optional runtime guarantees at the expense of quality of a diff.
Optimizations for handling large no-snakes areas better (for strings at least) (by using a set of chars rather than comparing them all pairwise).
Switching from an object-of-objects ({x:{y:costs}}) to a single object ({x*b.length+y: costs}).`
});



code({
	//ref/unref with garbage collection
/*
	function refable(v) { return v && typeof v==='object' && v.byteLength===undefined }
	var refs = new Map, ref = self.ref = (v, n=1, head=false) => {
		if (!refable(v) || !n || !ref.of(v) && n<0) return v;
		if (ref.stacks) (v.stacks || Object.defineProperty(v, 'stacks', { value:[], configurable:true, writable:true }).stacks).push(stack());
		if (!ref.of(v)) { if (!head) ref.values(v, ref); ref.bytes(ref.size(v)), ref.seeing.add(v) }
		if (!ref.of(v,n)) { ref.bytes(-ref.size(v)), ref.visible.delete(v), ref.seeing.delete(v), comp.delete(v), v.size!==undefined && (v.size=0), ref.values(v, unref) }
		else return v; };
	ref.of = (v, n=0) => !refable(v) ? null : !n ? refs.get(v) || 0 : (refs.set(v, (refs.get(v) || 0) + n), refs.get(v)>0 ? true : (refs.delete(v), false));
	ref.values = (v,f=undefined) => {
		if (!f) f=[];  if (!refable(v)) return f;
		var a=Object.keys(v);  for (var i=0; i<a.length; ++i) Array.isArray(f) ? f.push(v[a[i]]) : f.call(a[i], v[a[i]]);  a.length=0;
		a=Object.getOwnPropertySymbols(v);  for (var i=0; i<a.length; ++i) Array.isArray(f) ? f.push(v[a[i]]) : f.call(a[i], v[a[i]]);  a.length=0;
		if (v instanceof Node) for (var k=v.firstChild; k; k=k.nextSibling) if (!call.removed(k)) Array.isArray(f) ? f.push(k) : f(k);  return f; };
	ref.size = v => v && (v.size!==undefined ? v.size : (24 + ref.values(v).length*8)) || 0;  ref.this = v => ref(v, 1, true);
	ref.compact = v => !v.compact && !comp.has(v) && comp.add(v) && async(() => v.size && (v.compact=true) && comp.delete(v) && ref.compact(v), 2); var comp = new Set;
	ref.visible = new Set, ref.seeing = new Set, ref.see = (...v) => { for (var o of v) ref.visible.add(o), ref.seeing.add(o) };
	var id = setTimeout(function garbage() {
		id=null; for (var have of ref.visible) ref.seeing.add(have);  var have = new Set;
		function value(v) { refable(v) && (!ref.of(v) && assert(0,'ref-d object contains link to unref-d',v), !have.has(v) && ref.seeing.add(v)) }
		function then(a) { ref.garbage && ref.garbage(a); a.forEach(v => ref(v, -ref.of(v))) }
		sync(function f() {
			if (ref.seeing.size) for (var v of ref.seeing) { ref.seeing.delete(v), have.add(v), ref.of(v) && ref.values(v, value); break }
			else return have.size < refs.size && then([...refs.keys()].filter(v => !have.has(v))), have.clear(), id = setTimeout(garbage, 5000);
			async(f,2); });
	}, 5000);  stop(() => clearTimeout(id));
		//this thing keeps the node process... should call id.unref - but can't make it an interval...
			//should make ref.garbage a Source-returning function, and should have ref.ongarbage (null to not auto-collect junk)
			//(and collection controller should be separate from collection itself.)
	self.unref = (v => ref(v,-1)).with('later', v => async(() => unref(v)) || v);
	ref.bytes = size => {
		self.document && ref.p===undefined && (ref.p=mem.cur, async(() => ref.p!==mem.cur && log('  memory:', ref.p,'->',mem.cur, ' (△'+(mem.cur-ref.p)+')') || (ref.p=undefined)));
		if (!Number.isInteger(size)) assert(0, 'size should be an integer, got', size);
		return (mem.cur+=size) <= mem.max; };
	var mem = ref.mem = {cur:0, max: 20 * Math.pow(2,20)};
	var c, transfer = ArrayBuffer.transfer || (c = mem.cache = {cur:0, max:1 * Math.pow(2,20), recent:new Set}, (b, sz=b.byteLength) => {
		var copy = new uint8(c[sz] ? c[sz].pop() : new ArrayBuffer(sz)), from = new uint8(b);
		copy.set(copy.length < from.length ? from.subarray(0, copy.length) : from), from.fill(0);
		if (c[sz]) c.cur -= sz, !c[sz].length && (c[sz] = undefined);
		if (b.byteLength>0 && b.byteLength*2 <= c.max) {
			c.cur += b.byteLength; (c[b.byteLength] || (c[b.byteLength] = [])).push(b); c.recent.delete(b.byteLength), c.recent.add(b.byteLength);
			for (var sz of c.recent) { if (c.cur <= c.max) break; c[sz].filter(b => c.cur <= c.max || void ref.bytes(-b.byteLength)); !c[sz].length && (c[sz] = undefined) } }
		return copy.buffer; });
	ref.realloc = (b, size) => {
		if (b instanceof int8.constructor) return new b(ref.realloc(null, size*b.size) || 0);
		if (b && Object.getPrototypeOf(b.constructor) === Object.getPrototypeOf(int8)) return new b.constructor(ref.realloc(b.buffer, size*b.constructor.size) || 0);
		if (!ref.bytes(size - (b && b.byteLength || 0))) return b;
		return !b ? new ArrayBuffer(size) : !(b instanceof ArrayBuffer) || b.byteLength===size ? b : transfer(b,size); };
	ref.stacks = false, ref.garbage = a => assert(0, 'unreachable garbage objects detected:\n', ...a);
		//(and ref.stacks should be more descriptive, like ref.rememberStacks or ref.logStacks)
		//should recursively remove all unref-d descendants of each-of-a
*/
});



code({
	name:"asyncBase",
	//should define CSS.read/.write.
		//detect illegal CSS accesses, to throw (telling to wrap accesses in .read/.write) (fastdom-strict.js)
			//measure/mutate phases; accessors should only get in measure, set in mutate; measure properties should only be called in measure, mutate — in mutate;
				//(if measure has a value-function, wrap its call — else, wrap getter (and mutate))
				/*
				//.style.setProperty/.removeProperty for attached elements are only in mutate;
					//(CSSStyleDeclaration)
					//(document.contains(e))
					//(all style prop getters/setters are in measure/mutate)
				//.classList.add/.remove/.toggle for attached elements are only in mutate;
				//getComputedStyle(e) on an attached e is in measure;
				//scrollBy/scrollTo/scroll are in mutate;

		  		Document: {
		  		  execCommand: Mutate,
		  		  elementFromPoint: Measure,
		  		  elementsFromPoint: Measure,
		  		  scrollingElement: Measure
		  		},

		  		Node: {
				  //Node.appendChild/.insertBefore/.removeChild on an attached e are in mutate;

		  		  textContent: Mutate
		  		},

		  		Element: {
		  		  scrollIntoView: Mutate,
		  		  scrollBy: Mutate,
		  		  scrollTo: Mutate,
		  		  getClientRects: Measure,
		  		  getBoundingClientRect: Measure,
		  		  clientLeft: Measure,
		  		  clientWidth: Measure,
		  		  clientHeight: Measure,
		  		  scrollLeft: Accessor,
		  		  scrollTop: Accessor,
		  		  scrollWidth: Measure,
		  		  scrollHeight: Measure,
		  		  innerHTML: Mutate,
		  		  outerHTML: Mutate,
		  		  insertAdjacentHTML: Mutate,
		  		  remove: Mutate,
		  		  setAttribute: Mutate,
		  		  removeAttribute: Mutate,
		  		  className: Mutate,
		  		  classList: ClassList
		  		},

		  		HTMLElement: {
		  		  offsetLeft: Measure,
		  		  offsetTop: Measure,
		  		  offsetWidth: Measure,
		  		  offsetHeight: Measure,
		  		  offsetParent: Measure,
		  		  innerText: Accessor,
		  		  outerText: Accessor,
		  		  focus: Measure,
		  		  blur: Measure,
		  		  style: Style,
		  		},

		  		CharacterData: {
		  		  remove: Mutate,
		  		  data: Mutate
		  		},

		  		Range: {
		  		  getClientRects: Measure,
		  		  getBoundingClientRect: Measure
		  		},

		  		MouseEvent: {
		  		  layerX: Measure,
		  		  layerY: Measure,
		  		  offsetX: Measure,
		  		  offsetY: Measure
		  		},

		  		HTMLButtonElement: {
		  		  reportValidity: Measure
		  		},

		  		HTMLDialogElement: {
		  		  showModal: Mutate
		  		},

		  		HTMLFieldSetElement: {
		  		  reportValidity: Measure
		  		},

		  		HTMLImageElement: {
		  		  width: Accessor,
		  		  height: Accessor,
		  		  x: Measure,
		  		  y: Measure
		  		},

		  		HTMLInputElement: {
		  		  reportValidity: Measure
		  		},

		  		HTMLKeygenElement: {
		  		  reportValidity: Measure
		  		},

		  		SVGSVGElement: {
		  		  currentScale: Accessor
		  		}
				*/
});



code({
	name:"multikeyCache",
/*
	self.Cache = class Cache {
		constructor(max=undefined) { this.m = new Map, this.a = 0, this.b = max, this.k=null }
		set(...key) {
			var value = key.pop();
			if (this.k==null) this.k = key.length;
			assert(this.k === key.length);
			try {
				if (unref(this.get(...key)) !== undefined) return;
				ref.see(ref(value));
				var a = this.m.get(key[0]) || [];
				this.m.delete(key[0]), this.m.set(key[0], a);
				this.m.get(key[0]).push(...key.slice(1), value), ++this.a;
				while (this.a > this.b) drop(this);
			} catch (err) { if (!this.a) throw err; drop(this); return this.set(...key, value) } }
		get(...key) {
			assert(this.k === key.length || !this.a);
			if (!this.m.has(key[0])) return;
			var a = this.m.get(key[0]);
			search: for (var i=0; i<a.length; i+=this.k) {
				for (var j=1; j < this.k; ++j) if (a[i+j-1] !== key[j]) continue search;
				return ref(a[i + this.k - 1]); } }
		clear() { while (this.a) drop(this) } };
	function drop(c) { for (var [k, arr] of c.m) { ref.visible.delete(unref(arr.pop())); for (var i=1; i<c.k; ++i) arr.pop(); --c.a; if (!arr.length) c.m.delete(k); break } }
*/
});



code({
	name:"streamSources",
	//data sources, like from-url, from-browser-storage, from-data-transfer (or some events or File)
/*
init = (stop, sources) => {
	self.Source = class Source {
		constructor(f,c) { this.c=c, f && async(() => f(!this.t ? null : Source.then.bind(this), !this.o ? null : Source.on.bind(this)), 1); }
		//should have Source.init(f,c), that can re-use a Source from a used-source (all props are undefined) pool (and .cancel should free there)
		on(f)   { assert(typeof f==='function' && !this.o), this.o=f; return this }
		then(f) { assert(typeof f==='function' && !this.t), this.t=f; return this }
		cancel(ended=false) { if (!ended) this.c && this.c.call(), this.t && this.t.call(); this.o=this.t=this.c=undefined }
		static on(...v) { var r = this.o ? this.o.apply(undefined, v) : !v.forEach(unref); r===undefined && this.cancel(); return r }
		static then(...v) { this.t ? unref(this.t.apply(undefined, v)) : !v.forEach(unref); this.cancel(true) }
		static used(s) { return s instanceof Source && !!(s.o || s.t) } };
			//(what about s.c, in used?)

	self.url = (k,v) => {
		assert(typeof k==='string');
		assert(v==null || v instanceof Tensor && v.type===uint8 && v.sizes.length===1);
		if (k.slice(0,7)==='file://' && self.fetch)
			return new Source(then => then && fetch(k, {mode:'same-origin'}).then(r => r.arrayBuffer()).then(b => then(Tensor.from(b))).catch(() => then()));
				//if on Node, reading directories should return an array of filenames, and reading a file should read the file
					//(file:// should refer to current directory)
		var r = new XMLHttpRequest({ mozAnon:true, mozSystem:true }), u = r.upload, total;
		return new Source((then, on) => {
			r.responseType = 'arraybuffer', on && (r.responseType = 'moz-chunked-arraybuffer'), r.mozBackgroundRequest = true;
			if (then || on) u.onloadstart=u.onprogress=u.onloadend = r.onloadstart=r.onprogress=r.onloadend = evt => sync(() => {
				var cur = evt.loaded + (r.response && evt.type!=='loadend' ? r.response.byteLength : 0), max = evt.lengthComputable ? evt.total : undefined;
				assert(max===undefined || cur <= max);
				!total && (total = on ? new Tensor(uint8, cur).finish(true) : Tensor.from(r.response)), on && cur && r.response && total.data.set(new uint8(r.response), evt.loaded);
				total && ref.see(total); on && on(ref(total), cur, max)===undefined && r.abort();
				if (evt.type==='loadend' && then) ref.visible.delete(total), then(total); });
			if (v===undefined) r.open('GET', k);
			else if (v===null) r.open('DELETE', k);
			else r.open('POST', k);
			r.send(v instanceof Tensor ? utf8.from(v) : v); }, () => r.abort()); }

	var db, lcl, arr=[], write=false, idle=false;
	stop(() => db && db.transaction && db.close());
	var store = self.store = (k, v=undefined) => {
		assert(typeof k==='string' || k==null && v===undefined);
		assert(v==null || v instanceof Tensor && v.type===uint8 && v.sizes.length===1);
		return new Source(then => { if (idle) async(flushAll), idle=false; if (v!==undefined) write=true; arr.push(k, v, then) }); };
	function flushAll() {
		if (db && db.transaction && arr.length) try { var s = db.transaction('o', write ? 'readwrite' : 'readonly').objectStore('o') } catch (err) {}
		if (!s) s = lcl;
		for (var i = 0; i < arr.length; ) flush(s, arr[i++], arr[i++], arr[i++]);
		idle=true, write=false, arr.length = 0; }
	function flush(s,k,v,then) {
		if (s.put) {
			if (k == null) var r = s.getAllKeys();
			else if (v === null) r = s.delete(k);
			else if (v === undefined) then && (r = s.get(k));
			else r = s.put(utf8.from(v), k);
			r.onsuccess = () => then && then(k!=null && v!=null ? true : Array.isArray(r.result) ? ref(r.result) : Tensor.from(r.result));
			r.onerror = () => then(k!=null && v!=null ? false : undefined);
		} else if (s.setItem) {
			if (k == null) r = Array.range(s.length, i => s.key(i));
			else if (v === null) r = s.removeItem(k);
			else if (v === undefined) then && (r = Tensor.from(s.getItem(k)));
			else try { s.setItem(k, utf8.slice(v)), unref(v), r=true } catch (err) { unref(v), r=false }
			then ? then(r) : unref(r);
		} else unref(v), then && then(); }
	try {
		lcl = self.localStorage;
		db = indexedDB.open('o'), db.onupgradeneeded = evt => evt.target.result.createObjectStore('o');
		db.onsuccess = db.onerror = evt => {
			if ((db=evt.target.result) && lcl && lcl.length) for (var k of Array.range(lcl.length, i=>lcl.key(i), true)) store(k, Tensor.from(lcl.getItem(k))), lcl.removeItem(k);
			flushAll(); };
	} catch (err) {}

	var keys = { Enter:'\n',10:'\n',13:'\n' };
	var data = self.data = (k, v=undefined) => {
		if (k===undefined || typeof k==='string') return new Source(then => file(k,v,then));
		if (k.data!==undefined) return k.data || null;
		if (k.char!==undefined) return !k.ctrlKey && !k.altKey && !k.metaKey ? k.char : null;
		if (k.key!==undefined && k.key.slice(0,2)!=='U+') return !k.ctrlKey && !k.altKey && !k.metaKey && (k.key.length===1 || !k.shiftKey && keys[k.key]) ? keys[k.key] || k.key : null;
		if (k.charCode!==undefined) return k.charCode >= 32 && k.charCode !== 127 || !k.shiftKey && keys[k.charCode] ? keys[k.charCode] || String.fromCodePoint(k.charCode) : null;
		if (k.dataTransfer || k.clipboardData) return data(k.dataTransfer || k.clipboardData, v);
		if (k.length)
			return assert(v===undefined), new Source(then => {
				if (!then) return; var o = {}, n = k.length;
				for (var f of k) data(f).then(f => {
					if (f) for (var k of Object.keys(f)) { var to=o; for (var p of k.split('/')) to = to[p] || (to[p]={}); ref.see(f[k]), to[p]=f[k] }  if (!--n) then(refd(o)); }); });
		if (k.items && k.items.length && k.files.length)
			return data( Array.range(k.items.length, i => k.items[i]).filter(i => i.kind==='file' && (i.getAsEntry || i.webkitGetAsEntry || i.getAsFile)()) );
		if ((k.entries || k.webkitEntries) && (k.entries || k.webkitEntries).length) return data(k.entries || k.webkitEntries);
		if (k.files && k.files.length) return data(k.files);
		if (k.file) return new Source(then => then && k.file(f => data(f).then(then), () => then()));
		if (k.createReader) return new Source(then => then && k.createReader().readEntries(a => data(a).then(then), () => then()));
		if (k.getData) {
			if (utf8.slice(v)) k.setData('text/plain', utf8.slice(v)), unref(v), r=true;
			else if (v===undefined) {
				var s = k.getData('text/html'), e = s && document.createElement('div').with('innerHTML', s), f = s && document.createDocumentFragment(), r;
				if (s) while (e.firstChild) f.appendChild(e.firstChild);  r = s ? f : k.getData('text/plain');
			} else if (!v.collapsed) {
				var f = v.cloneContents && v.cloneContents();
				k.setData('text/html', v.outerHTML || Array.range(f.childNodes.length, i => f.childNodes[i], true).map(ch => ch.outerHTML).join(''));
				k.setData('text/plain', v.textContent || f.textContent); r=true; }
			return new Source(then => then && then(r)); }
		if (k instanceof File) return new Source(then => {
			if (!then) return; var r=new FileReader; r.onloadend=()=>r.result ? then({ [k.webkitRelativePath || k.name]: Tensor.from(r.result) }) : then(); r.readAsArrayBuffer(k); });
		assert(0, 'unrecognized data key type:', k);
	};
	function refd(o) { var r=[]; !function f(o) { ref.of(o) ? (ref.visible.delete(o), r.push(o)) : Object.values(o).forEach(f) }(o);
		try { return ref(o), r.forEach(unref), o } catch (err) { r.forEach(unref); throw err } }
	function file(k,v,then) {
		if (v===undefined) {
			assert(k===undefined);
			var e = document.createElement('input'), cancel = () => then && then() || (self.removeEventListener('focus', cancel));
			e.type='file', e.multiple=true, e.onchange = () => then && data(e).then(then), self.addEventListener('focus', cancel);
		} else if (v instanceof Tensor && v.type===uint8 && v.sizes.length===1) {
			var e = document.createElement('a'); then && then(true);
			e.target='_blank', e.download=k, e.href = 'data:text/plain;charset=utf8;base64,' + utf8.base64(v), unref(v);
		} else assert(0, 'unknown data type:', v);
		document.body.appendChild(e); e.click(); document.body.removeChild(e); }
};
*/
});



code({
	name:"cssAbstraction",
	//prefix/unprefix, style
});



code({
	name:"animations",
	//an independent-from-CSS animation library (like in anime.js).
		//also, maybe have an animation class, so that style objects (& SVG) could refer to those?
		//okay, what is anime.js's functionality, and what of it should we replicate here?
});



//what about an SVG library?
	//having an <svg viewBox="..." xmlns="http://www.w3.org/2000/svg"><defs> as an offscreen container that contains referencable stuff.
	//svg(k,v)? or svg(v)→k (and svg(k) deletes)? or what?



code({
	name:"expandOnView",
	//node expansion (visual framework is its main application)...
		//top-level expanding rule gets URL elements as its args, like in any web-app
		//exceptions on expanding (message, stack) are shown as an element (red border shadow and such)
/*
init = ((stop, Interface) => {
	if (!self.document) return;
	var css = self.CSS || (self.CSS = {}), finishing=false, run = f => void f();
	css.read  = f => { !r.length && !w.length && async(css.finish), r.push(f) };
	css.write = f => { !r.length && !w.length && async(css.finish), w.push(f) };
	css.finish = () => { if (finishing) return; finishing=true; while (r.length || w.length) r.filter(run), w.filter(run); finishing=false };
	//since we seem to be doing mistakes in CSS reading/writing (or just being sloppy) all the time, we should do that detection-of-inappropriate-read/write, in fastdom-strict.js.

	css.prefix = s => pre[s] || (pre[s] = s.slice(0,2)==='on' ? first('on', s.slice(2), document.body) : first('', unCamelCase(s), document.body.style));
	css.unprefix = s => unpre[s] || (unpre[s] = s.slice(0,2)==='on' ? first('on', s.slice(2)) : camelCase(first('', s)));

	css.style = (k=undefined, v=undefined) => {
		if (k===undefined) return Object.keys(indexes).sort((a,b) => indexes[a]-indexes[b]);
		if (typeof k!=='string') return ruleStyle(k,v);
		if (k.indexOf('::selection')>=0) try { document.querySelector('*,::selection') } catch (err) { k = k.replace('::selection', '::-moz-selection') }
		if (k.slice(0,10) === '@keyframes') css.prefix('animation') !== 'animation' && (k = '@-webkit-' + k.slice(1));
		else try { document.querySelector('*,'+k) } catch (err) { return false }
		if (v === undefined) return indexes[k]!==undefined ? ruleStyle(sheet.cssRules[indexes[k]]) : undefined;
		else if (v === null) {
			if (indexes[k]===undefined) return false;
			ruleStyle(sheet.cssRules[indexes[k]], null);
			return free.push(indexes[k]), indexes[k] = undefined, true;
		} else {
			var i = indexes[k]!==undefined ? indexes[k] : indexes[k] = free.length ? free.pop() : sheet.cssRules.length;
			if (!sheet.cssRules[i] || !matches(sheet.cssRules[i], k, v) || v.content!==undefined && v.content !== sheet.cssRules[i].style.content)
				sheet.cssRules[i] && sheet.deleteRule(i), sheet.insertRule(k + (k[0]!=='@' ? '{}' : '{'+Object.keys(v).map(v => key(v)+'{}').join('')+'}'), i);
			//should also do layout() of all document.querySelectorAll(k))
			return ruleStyle(sheet.cssRules[indexes[k]], v), true; } };

	function first(on,s,o) {
		if (!o) { for (var p of prefixes) if (s[0]===p[0] && s.slice(0, p.length) === p) return on+s.slice(p.length); return on+s }
		else { if (on+s in o) return on+s; for (var p of prefixes) if (on+p+s in o) return on+p+s } }
	function unCamelCase(str) { return str.replace(/[A-Z]/g, ch => '-'+ch.toLowerCase()) }
	function camelCase(str) { return str.replace(/-[a-z]/g, ch => ch.slice(1).toUpperCase()) }

	var pre = Object.create(null), unpre = Object.create(null), prefixes = ['-moz-', 'moz-', 'moz', '-webkit-', 'webkit-', 'webkit', '-ms-', 'ms-', 'ms', '-o-', 'o-'], r=[], w=[];
	var indexes = Object.create(null), free = [], taken = document.styleSheets[0], sheet = taken || document.head.appendChild(document.createElement('style')).sheet;
	stop(() => !taken && sheet.ownerNode.parentNode.removeChild(sheet.ownerNode));
	function key(at) { return at==='from' ? '0%' : at==='to' ? '100%' : at*100+'%' }
	function matches(rule, k, obj) {
		if (rule.cssRules) {
			if (rule.length !== (k = Object.keys(obj)).length) return false;
			for (var i = 0; i < rule.length; ++i) if (!matches(rule[i], k[i], obj[k[i]])) return false; return true;
		} else return rule.selectorText !== undefined ? rule.selectorText === k : rule.keyText !== undefined ? rule.keyText === key(k) : false; }
	function text(v) { if (!v) return ''; var k = Object.keys(v); for (var i=0; i<k.length; ++i) k[i] = css.prefix(k[i])+':'+v[k[i]]; return k.join(';') }
	function ruleStyle(rule, v) {
		if (v===undefined) {
			var o = {}, s=rule.style;
			if (rule.cssRules) for (var i=0; i<rule.cssRules.length; ++i) o[+rule.cssRules[i].keyText.slice(0,-1)/100] = ruleStyle(rule.cssRules[i]);
			else for (var k, i=0; i<s.length; ++i) k = s.getPropertyValue(s.item(i)), o[css.unprefix(s.item(i))] = !isNaN(+k) ? +k : k;
			return o;
		} else if (!rule.cssRules) rule.style.cssText = text(v);
		else for (var i=0, keys = Object.keys(v); i < rule.cssRules.length; ++i) ruleStyle(rule.cssRules[i], v[keys[i]] || null); }


	//should also have a way of adding/removing classes that doesn't leave a class="" attribute behind (we do that in quite a few places).


	var v = Symbol('Element rule/values array'), pos = Symbol('Element layout position'), main, temps = new Map;
	var call = self.call = function(elem, k, ...args) {
		if (!elem) return; assert(elem && typeof k==='string');
		if (k.indexOf('pointer')>=0) CSS.read(() => anchor(elem));
		if (this===true) {
			for (var o=elem, a=[]; o && o !== main.parentNode && o instanceof Node; o=o.parentNode) Array.isArray(o[v]) && typeof o[v][0][k]==='function' && a.push(o);
			for (var r, i=a.length-1; i>=0; --i) if ((r = callAt.call(this, a[i], k, args))!==undefined) return r;
		} else if (this===false) return callAt(elem,k, ...args);
		else { for (var r, o=elem; o && o !== main.parentNode && o instanceof Node; o=o.parentNode) if ((r = callAt(o,k, args))!==undefined) return r; } };
	function callAt(e,k,args) {
		var o = call.override && k in call.override ? call.override : Array.isArray(e[v]) && e[v][0] || typeof e.rule==='function' && e.rule || undefined;
		var r = o && ((args.length ? Object.set(o,k) : Object.get(o,k)) || o[k] || (this ? o.pre : o.on));
		if (typeof r==='function') r = r.apply(e,args);
		if (o) if (args.length ? Object.set(o,k) : Object.get(o,k)) return r!==undefined ? r : false;  return r; }
	call.event = (target, type, ...args) => {
		var r = call.call(true, target, 'pre'+type, ...args);  if (r===undefined) r = call(target, 'on'+type, ...args);
		//maybe we should also allow null, for "can't handle" (like when ctrl-z has no history), acting like true and adding a class? or is this superfluous?
		if (r===undefined || r===false || r===true) return !!r;  else assert(0, 'expected undefined or false/true from an event handler for '+type+', got', r); };
	call.removed = e => e instanceof Element && e[v]===undefined && !ref.of(e) && e.parentNode && ref.of(e.parentNode);
	call.with({ get main() { return main }, set main(r) {
		if (r) { assert(typeof r==='function');  if (!main) main = document.body.appendChild(ref(document.createElement('main'))), ref.see(main);  update(main, [r]);
		} else if (main) call.moved(main), main=null; } });

	self.layout = function layout(e) {
		if (!(e instanceof Element) || call.removed(e)) return;
		//should also handle being removed (call onlayout in such cases too).
		//also, is there any way to not check an element twice if it's spread-from - like a Set or something?
			//and to not overdo work - stop and schedule for later if we've taken too long already?..
		CSS.read(() => {
			var r = e.getClientRects();
			if (r.length>1) var x1 = r[0].x, x2 = r[r.length-1].x + r[r.length-1].width;
			var r = e.getBoundingClientRect(), b = e.parentNode.getBoundingClientRect();
			var x = r.x-b.x + e.parentNode.scrollLeft, y = r.y-b.y + e.parentNode.scrollTop, w = r.width, h = r.height;  x1 -= r.x, x2 -= r.x;
			if (e[pos]) {
				//if it's equal, do nothing.
				//else, replace e[pos] with its new position
					//but won't we have to create two arrays for each layout change to properly call onlayout?
						//well, better than creating an array on each check.
			} else call.call(false, e, 'onlayout', null, e[pos] = ref.this(x1!==undefined ? [x,y,w,h,x1,x2] : [x,y,w,h]));
			//get layout info (x,y,w,h of bounding rect relative to parent, and if .getClientRects().length>1, x1/x2 (relative-to-x coord of the first/last rect's left/right))
				//shouldn't create an actual array unless we have to (!e[pos]).
			//if it's different from e[pos], call.call(false, e, 'onlayout', from, to), and check layout for e's parent, prev/next siblings, and all children.
		});
	}

	call.text = function text(s) {
		if (s===undefined) return this.firstChild.nodeValue;
		else if (s = utf8.slice(s), this instanceof Element) {
			if (!this.firstChild) this.with(ref(document.createTextNode('')));  this.firstChild.nodeValue = s;
			this.firstChild===this.lastChild && s[s.length-1]==='\n' && this.with(ref(document.createElement('div')));
			this.firstChild!==this.lastChild && s[s.length-1]!=='\n' && (unref(this.lastChild), this.removeChild(this.lastChild), ref.of(this) && ref.bytes(-8)); return this;
		} else {
			var sp = document.createElement('span');
			sp.appendChild(document.createTextNode(s));
			s[s.length-1]==='\n' && sp.appendChild(document.createElement('div'));
				//shouldn't append/remove a div in here - should do it in updating-children, so that only the last text node gets the required div.
			return ref(sp); } };
	call.moved = function moved(e, p=null, useCurrentPos=true) {
		//should really handle multiple consecutive elements in a batch.
		if (!(e instanceof Element)) return void(p===null && e.parentNode.removeChild(e));
		if (call.removed(e)) return;
		if (!e[pos] && p) CSS.read(() => {
			touchCornersNear(e), readPos(e);  call.temp(e, { pointerEvents:'none' }), call.temp(e, 0, 'insert', { transition:'none' });
		}); else if (p) CSS.read(() => {
			var dx = e[pos][0]-x(e), dy = e[pos][1]-y(e);  readPos(e);  if (getComputedStyle(e).position==='absolute') return;
			if (dx || dy) touchCornersNear(e), call.temp(e, { position:'relative', pointerEvents:'none' }), call.temp(e,0, { transition:'none', transform:'translate('+dx+'px,'+dy+'px)' });
		}); else update(e), ref.of(e.parentNode) && ref.bytes(-8), sync(() => {
				var s = getComputedStyle(e), mx = parseFloat(s[CSS.prefix('marginLeft')]), my = parseFloat(s[CSS.prefix('marginTop')]), dur = duration(e);
				var w = e.offsetWidth, h = e.offsetHeight, x = !useCurrentPos && e[pos] ? e[pos][0] : e.offsetLeft, y = !useCurrentPos && e[pos] ? e[pos][1] : e.offsetTop;
				if (s[CSS.prefix('display')]==='inline') {
					var r=e.getBoundingClientRect(), b=e.offsetParent.getBoundingClientRect();
					var d = document.createElement('div'), dx = x - r.x+b.x - mx, dy = y - r.y+b.y - my;
					dy += (parseFloat(s[CSS.prefix('lineHeight')]) - parseFloat(s[CSS.prefix('fontSize')]))/2 - parseFloat(s[CSS.prefix('borderTopWidth')]);
					d.appendChild(document.createElement('div')), x -= dx+mx, y -= dy+my, w+=3, h+=3;
					call.temp(d.firstChild, { display:'inline-block', width:dx+'px', height:dy+'px' });
					[e,d]=[d,e], CSS.write(() => { try { d.parentNode.replaceChild(e,d), e.appendChild(d); } catch (err) { log('replacing child:', d, '->', e); throw err } });
						//changing CSS.write to be immediate changes things...
				} else !useCurrentPos && e[pos] ? (x -= mx+w/2, y -= my+h/2) : (x-=mx, y-=my), e.with(pos, void unref(e[pos]));
				call.temp(e, 'remove', { position:'absolute', left:x+'px', width:w+'px', top:y+'px', height:h+'px', pointerEvents:'none', userSelect:'none' });
				setTimeout(() => e.parentNode.removeChild(e), dur); }); }
					//and changing CSS.read to be immediate too changes things even more. but not to the correct conclusion for in-the-middle nodes (they seem to be pushed to the end).
						//(because of a fundamental design flaw - we should use element's stored previous-layout info, and we should NOT read the new position, on deleting.)
	call.temp = (e, ...styles) => {
		assert(e instanceof Element);
		for (var dur, i=0; i<styles.length; ++i) if (typeof styles[i]==='number') { dur = styles[i]; break }
		dur===undefined ? CSS.read(() => addTemps(e, duration(e), styles)) : addTemps(e, dur, styles); };
	function readPos(e) { if (!ref.of(e)) return; var c=e[pos]; c ? (c[0] = x(e), c[1] = y(e)) : e.with(pos, ref([x(e), y(e)])) }
	function duration(e) { return e=getComputedStyle(e), (e.transitionDuration || e.animationDuration || '').split(',').map(s => parseFloat(s) * (s.indexOf('m')>=0?1:1000)).max || 200 }
	function removeTemps(e) {  for (var k of Object.keys(temps.get(e)[2])) e.style.removeProperty(k);  !e.style.length && e.removeAttribute('style');
		for (k of Object.keys(temps.get(e)[3])) e.classList.remove(k);  !e.classList.length && e.removeAttribute('class');  temps.delete(e) }
	function addTemps(e, dur, st) {
		CSS.write(() => {
			//we have an awful lot of for-of loops here.
			if (!dur) {
				for (var s of st) if (typeof s==='object') for (var k of Object.keys(s)) e.style.setProperty(CSS.prefix(k), s[k]); else if (typeof s==='string') e.classList.add(s);
				return CSS.read(() => CSS.write(() => {
					for (var s of st) if (typeof s==='object') for (var k of Object.keys(s)) e.style.removeProperty(CSS.prefix(k)); else if (typeof s==='string') e.classList.remove(s);
				}, e.offsetLeft)); }
			var prev = temps.get(e), props = prev && prev[2] || {}, classes = prev && prev[3] || {};
			for (var s of st)
				if (typeof s==='object') { for (var k of Object.keys(s)) e.style.setProperty(CSS.prefix(k), s[k]), props[CSS.prefix(k)]=true }
				else if (typeof s==='string') e.classList.add(s), classes[s]=true;
			prev && clearTimeout(prev[0]), temps.set(e, [setTimeout(removeTemps, Math.max(prev ? prev[1]-now : 0, dur), e), now+dur, props, classes]); }); }
	function touchCorner(k,e,x,y, rects) {
		for (var r of rects) if (r && r.x <= x+5 && r.y <= y+5 && x-5 <= r.x+r.width && y-5 <= r.y+r.height) return CSS.write(() => e.style.setProperty(CSS.prefix(k),0));
		CSS.write(() => e.style.removeProperty(CSS.prefix(k))); }
	function touchCorners(e, r, ...rects) {
		touchCorner('borderBottomRightRadius',e, r.x+r.width, r.y+r.height, rects);  touchCorner('borderBottomLeftRadius',e, r.x, r.y+r.height, rects);
		touchCorner('borderTopRightRadius',e, r.x+r.width, r.y, rects);  touchCorner('borderTopLeftRadius',e, r.x, r.y, rects); }
	function touchCornersNear(e) { //why does it not round corners of the selection?
			//and, why does it trigger reflow so often... we do call it in CSS.read...
		if (e instanceof Element) touchCorners(e, e.getBoundingClientRect(),
			e.previousSibling instanceof Element && ref.of(e.previousSibling) && e.previousSibling.getBoundingClientRect(),
			e.nextSibling instanceof Element && ref.of(e.nextSibling) && e.nextSibling.getBoundingClientRect()); }

	//should probably also provide the onlayout event (call.override of which also touches corners).
		//should probably also store element's dimensions (and maybe inlineness or something?) on the element, and check them on some events (and onresize, main's and its children too).
			//having just two numbers, center's x/y, isn't enough.
			//element.layout, an array; for inline elements, 6 numbers - [x,y,w,h, startX,endX]; for others, 4 - [x,y,w,h] (of bounding rect, relative to parent).

	function x(e) { return e.offsetLeft + (getComputedStyle(e).display!=='inline' ? e.offsetWidth/2 : 0) }
	function y(e) { return e.offsetTop + (getComputedStyle(e).display!=='inline' ? e.offsetHeight/2 : 0) }
	function anchor(e=undefined) {
		if (e===undefined) {
			if (anchor.e && !anchor.e.isConnected) anchor(null);
			for (var p, e=anchor.e, rx, ry, sx=0, sy=0, i=0; p = e&&e.parentNode, e && p && p !== document; e=p, ++i)
				rx = x(e) - (p===e.offsetParent ? 0 : x(p)), ry = y(e) - (p===e.offsetParent ? 0 : y(p)), sx += anchor.x[i]-rx, sy += anchor.y[i]-ry,
				(sx || sy) && (p.scrollLeft+=sx, p.scrollTop+=sy), anchor.x[i] = rx, anchor.y[i] = ry, sx -= p.scrollLeft, sy -= p.scrollTop;
		} else e && !(e instanceof Element) && (e=e.parentNode), anchor.e = e, !anchor.x && (anchor.x=[]), !anchor.y && (anchor.y=[]), anchor.x.length = anchor.y.length = 0, anchor(); }
	call.layout = f => { CSS.read(() => anchor(anchor.e)), CSS.write(() => CSS.read(anchor) || f()) };

	var textarea = document.documentElement.appendChild(document.createElement('textarea'));  css.style(textarea, { position:'absolute', left:0,top:0,width:0,height:0, opacity:0 });
	//should we have a function canHaveFocus? (e===main || main && main.contains(e) && hasData(e))
	call.focus = function focus(e=undefined) {
		var f = document.getElementById('focus') || main;  if (!f) return;
		if (e===undefined) { //each of these is 5-6ms
			if (f && document.activeElement === (hasData(f, true) ? textarea : f)) return f;  if (!f && document.activeElement) document.activeElement.blur();
			var s = getSelection(), [a,i,b,j] = [s.anchorNode, s.anchorOffset, s.focusNode, s.focusOffset];
			if (f && hasData(f, true)) textarea.focus() || async(() => call.focus()); else if (f) hasData(f) ? f.focus() || async(() => call.focus()) : document.activeElement.blur();
			if (a && b) s.setBaseAndExtent(a,i,b,j);  return f;
		} else if (typeof e==='number') {
			if (e>0) while (true) {
				if (f.firstChild) f = f.firstChild;  else { while (f && f!==main && !f.nextSibling) f=f.parentNode;  f = f===main ? main : f.nextSibling }
				if (f===main || hasData(f)) return focus(f); }
			else while (true) {
				if (f===main || f.previousSibling) { f = f.previousSibling || f;  while (f.lastChild) f = f.lastChild } else f = f.parentNode;
				if (f===main || hasData(f)) return focus(f); }
		} else if (e!==f) {
			while (e && !hasData(e)) e = e.parentNode;
			if (f) f.id = null, f.removeAttribute('id');  if (e) e.id = 'focus'; //does it have performance problems because we remove/add the same class on the same elements each time?
			for (var p = f && f.parentNode; p && p.classList && p.classList.contains('focus'); p=p.parentNode) p.classList.remove('focus'); //or is it because we do CSS.write(focus),
			for (var p = e && e.parentNode; main && p && p!==main.parentNode && p.classList; p=p.parentNode) p.classList.add('focus');		 //without checking if it is already scheduled?
			e && e.scrollIntoView({ block:'nearest', inline:'nearest' }), e && call.temp(e, CSS.style('main.active #focus')); //though most of the work seems to be painting,
			call(f, 'onblur'), call(e, 'onfocus');  CSS.write(focus);  return e; } else focus(); } //and touchCornersNear's reflow.

	function intersects(a,b) { return !(a.x>=b.x+b.width || a.y>=b.y+b.height || b.x>=a.x+a.width || b.y>=a.y+a.height) }
	function visible(r) { return !(r.x>=innerWidth || r.y>=innerHeight || 0>=r.x+r.width || 0>=r.y+r.height) }
	function update(e,a=undefined) { e.tagName==='CANVAS' && (e.width!==a.width || e.height!==a.height) && (e.width=a.width, e.height=a.height);
		//actually, shouldn't have a semi-invisible array to hold rule and in values; should have .rule and .in (parser can also have .out and .len and .max).
		a!==undefined && e instanceof Element && !bg.has(e) && CSS.read(() => bg.has(e) && visible(e.getBoundingClientRect()) && fg.push(e));
		a!==undefined && CSS.read(() => { for (let ch=e.firstChild; ch; ch=ch.nextSibling) if (ch instanceof Element) readPos(ch) });
		a===undefined && (unref(e), e.id==='focus' && call.focus(null), Array.isArray(e[v]) && e[v][0].onremove && e[v][0].onremove.call(e));
		if (Array.isArray(a)) assert(typeof a[0]==='function'), preempt(a[0]), ref.this(a), a[0].alias && CSS.write(() => e.classList.add(a[0].alias));  e.with(v,a);
		a!==undefined && hasData(e) && CSS.write(() => hasData(e, true) ? e.tabIndex=0 : e.draggable=true); //88% of update's runtime is updating the style...
		if (a!==undefined && !bg.has(e)) !fg.length && !bg.size && call.layout(doUpdate), bg.add(e); return e; }
			//would it be better if we preferred to build element trees completely synchronously, rather than making everything async if possible?
	var fg=[], bg=new Set;  function doUpdate() {
		var end = now+15, n = fg.length;  fg.filter((e,i) => now>end || i>=n || bg.has(e) && void(bg.delete(e), children(e)));
		for (var e of bg) if (bg.delete(e), children(e), now>end) break;
		(fg.length || bg.size) && (now>end ? async : sync)(() => call.layout(doUpdate)); }

	function find(e,a) {
		var tagName = Array.isArray(a) ? 'DIV' : typeof a==='string' ? 'SPAN' : 'CANVAS';
		for (var ch of e)
			if (ch.tagName===tagName && ch[pos] && (Array.isArray(a) ? equals(ch[v], a) : typeof a==='string' ? ch.textContent===a : ch.width===a.width && ch.height===a.height))
				return e.delete(ch), update(ch, a);
		return update(ref(document.createElement(tagName)), a); }
	function children(e) {
		if (e[v]===undefined) return;
		if (e.tagName==='CANVAS' && e[v] instanceof ImageData) return e.getContext('2d').putImageData(e[v],0,0);
		if (e.tagName==='CANVAS') return to=e.getContext('bitmaprenderer') ? to.transferFromImageBitmap(e[v]) : e.getContext('2d').drawImage(e[v],0,0);
		if (e.tagName==='SPAN') return call.text.call(e, e[v]);
		if (!Array.isArray(e[v])) return;
		var to=[], prev=new Set;
		for (var ch=e.firstChild; ch; ch=ch.nextSibling) if (!call.removed(ch)) prev.add(ch);
		e[v][0].call(e, (r, ...v) => {
			typeof r!=='function' && v.length && assert(0, 'when adding not-a-function child, no values must be provided - got', v);
			if (r instanceof Node)
				return !prev.has(r) && r.parentNode===e && to.includes(r) && assert(0, 'a child has already been claimed by value-matching:', r), prev.delete(r), to.push(r);
			if (r!=null && utf8.slice(r)!==undefined) return to.push(find(prev, utf8.slice(r)));
			if (r && 'imageData' in r) return to.push(find(prev, r.imageData));
			if (typeof r==='function') return to.push(find(prev, [r, ...v]));
			assert(0, 'unknown child type to add:', r);
		}, ...e[v].slice(1));
		//should really catch exceptions - and in that case, replace element with the first no-exceptions of its .eqv (or an error element that will display the exception string).
		//also, maybe we should interrupt e.rule when we have enough elements, like, every 1000? (then unstall if we interrupted).
		call(e, 'children', to), to.length=0; }

	var active = {}, passive = { passive:true,capture:true }, evt;
	function preempt(r) { if ((preempt.seen || (preempt.seen = new WeakSet)).has(r)) return;  preempt.seen.add(r); var b;
		for (var k of Object.keys(r)) if (k.slice(0,2)==='on' && (b = Function.body(r[k]), b.indexOf('return ')>=0 || b.indexOf('.preventDefault()')>=0)) listen(k.slice(2)); }
	function listen(type, act=true, remove=false) {
		if (type.indexOf('device')>=0 || type==='userproximity' || type==='beforeunload' || type==='unload') return;
		var prev = act ? passive : active[type] ? true : passive, next = act || passive, source = 'on'+type in window ? window : document;  active[type] = act;
		source.removeEventListener(type, onEvent, prev), !remove && source.addEventListener(type, onEvent, next); }
	function onEvent(e) { evt=e, sync(doEvent), css.finish() }
	function doEvent() {
		if (!evt.target || !main) return;  var type = CSS.unprefix('on'+evt.type).slice(2);
		if (type.slice(0,3)!=='key' && evt.target!==document && evt.target!==window && evt.target!==document.activeElement) var target = evt.target;
		else var target = call.focus();
		if (Array.isArray(target[v]) && Object.get(target[v][0], 'for')) target = Object.get(target[v][0], 'for').call(target);
		if (type==='focus' || type==='blur') main && (document.hasFocus() ? main.classList.add('active') : main.classList.remove('active'));
			//if we receive pointerdown, should add active anyway.
		//is it possible, for pointermove events, to generate pointerenter/pointerleave for all elements intersecting a straight line between prev pos and next pos?
		if (!(target instanceof Node) || !main.contains(target) || type==='focus' || type==='blur' || type==='keypress' || evt.eventPhase===0 || drag.from && type==='selectionchange') return;
		defineProperty(evt, 'target', { value:target });
		//maybe we should extend pointer events with .movementX/Y (diff of .screenX/Y), like for pointer-locked events?
			//...except, docs say that they are always available (for mousemove events at least)?..
		type==='transitionend' && target[v] && CSS.read(() => touchCornersNear(target));  evt.stopPropagation();  textarea.value && (textarea.value='');
		if (call.event(target, type, evt)) active[type] ? evt.cancelable && evt.preventDefault() : listen(type); }
	function register(add = false) { for (var k of Object.keys(window)) if (k.slice(0,2)==='on') listen(k.slice(2), false, !add);
		for (var k of Object.keys(Object.getPrototypeOf(Object.getPrototypeOf(document)))) if (k.slice(0,2)==='on') listen(k.slice(2), false, !add);
		for (var k of ['compositionstart', 'compositionupdate', 'compositionend']) listen(k, false, !add); }
	register(true), stop(register);

	var keys = new Map, cmps = new Map, prevMod='', drag = { from:null,src:null,to:null, target(e, disconnect=false) {
		this.to!=e && (this.src&&this.src.cancel(), e ? call.focus(e) : this.src && call.focus(null), this.src = e?new Source:null, e && input(e, this.src), this.to=e);
		var s=this.src; disconnect && (this.src=null); return s; } };
	function copyMove(evt) { var dt=evt.dataTransfer, set=hasData(drag.from, true);
		if (dt) dt.effectAllowed = set ? 'copyMove' : 'copy', dt.dropEffect = evt.ctrlKey || evt.shiftKey || !set ? 'copy' : 'move' }
	function hasData(e, set=false) { return Array.isArray(e[v]) && (!set ? 'data' in e[v][0] : !!Object.set(e[v][0], 'data')) }
	function chMod(e, subkey, mod) {
		for(var o=keys.get(e); e; o=keys.get(e=e.parentNode))
			if (o) for (var k of Object.keys(o)) if (k.indexOf(subkey)>=0)
				Source.then.call(o[k]), delete o[k], call.override.onkey.call(e, mod, k, false); }
	function input(e,s) {
		if (s instanceof Source) var mod=null, key=null, src=s;
		else if (typeof s==='string') src = new Source(t => t && t(s));
		else if (s && s.code) {
			var code = s.code.slice(0,5)==='Shift' || s.code.slice(0,7)==='Control' ? '' : s.code;
			var printed = data(s), mod = s.ctrlKey && s.shiftKey ? 'CtrlShift' : s.ctrlKey ? 'Ctrl' : s.shiftKey ? 'Shift' : '', key = code, src = printed && new Source;
			if (mod!==prevMod) chMod(e, '', mod);  prevMod = mod;
			if (s.type!=='keyup' && (s.metaKey || s.altKey)) return false;
			src && CSS.write(() => Source.then.call(src, printed)); }
		if (!e || e===main) {
			var a=[], found, maybe=new Map;  maybe.set(main,0);
			for (var [e, depth] of maybe) {
				maybe.delete(e);  if (depth>found) break;
				for (var ch=e.firstChild; ch; ch=ch.nextSibling) !call.removed(ch) && maybe.set(ch, depth+1);
				if (call.override.onkey.call(e, mod, key, null)!==undefined || printed && hasData(e, true)) a.push(e), found=depth; }
			if (a.length===1) return call.focus(a[0]), hasData(a[0]) && a[0]!==main && input(a[0],s), true;
			if (s.type==='keydown' && !s.ctrlKey && code==='Tab') return call.focus(s.shiftKey ? -1 : 1), true;
			return a.forEach(e => call.temp(e, 'ambiguous')), !!a.length; }
		if (key && call(e, 'onkey', mod, key, s.type==='keyup')!==undefined) return true;
		if (s.type==='keyup') return true;  if (src && call(e, 'data', src)!==undefined) return true;
		if (s.type==='keydown' && !s.ctrlKey && code==='Tab') return call.focus(s.shiftKey ? -1 : 1), true; }

	call.override = {
		get rule() { return Array.isArray(this[v]) ? this[v][0] : null },
		set rule(r) { Array.isArray(this[v]) ? update(this, [r, ...this[v].slice(1)]) : update(this, [r]) },
		get values() { return Array.isArray(this[v]) && this[v].slice(1) },
		set values(a) { !Array.isArray(this[v]) && assert(0, 'setting values before the rule or any initialization'); update(this, [this[v][0], ...a]) },

		get children() { return this===call.override ? null : this instanceof Node ? Array.range(this.childNodes.length, i => this.childNodes[i], true) : this.children || ref([]) },
		set children(to) {
			if (!(this instanceof Node)) return unref(this.children), this.children = to;
			var adding = new Set; for (var i of to) adding.has(i) && assert(0, 'adding same child twice:', i), i===this && assert(0, 'adding node as its own child:', i), adding.add(i);
			for (var start=0, next=this.firstChild; next===to[start]; ++start) next = next.nextSibling;
			for (var i=start; i<to.length; ++i) to[i].id==='focus' && CSS.write(call.focus), to[i]===next ? (next = next.nextSibling) : this.with(to[i], next);
			for (var i=to.length; i < this.childNodes.length; ++i) call.moved(this.childNodes[i], null, false);
			for (var i of to) call.moved(i, this); },

		onpointerdown(evt) { var a = Array.isArray(this[v]) ? this[v][0] : this.rule; var r = a && a.onpointerdown ? a.onpointerdown.call(this,evt) : undefined;
			return this!==main && !hasData(this) ? r : (CSS.write(() => call.focus(this)), r===undefined ? false : r) },

		onblur(evt) {
			var o=keys.get(this); if (o) for (var k of Object.keys(o)) Source.then.call(o[k], k), delete o[k]; keys.delete(this);
			return Array.isArray(this[v]) && this[v][0].onblur ? this[v][0].onblur.call(this, evt) : undefined; },
		onkey(mod, k, keyup=false) {  var a = Array.isArray(this[v]) ? this[v][0] : this.rule, o;
			if (keyup==null) return a && a.keys && (!!a.keys[mod+k] || typeof a.keys==='function') || undefined;
			if (o=keys.get(this), o && (keyup || Source.used(o[k]))) return o[k] && (!keyup ? Source.on : Source.then).call(o[k], k), keyup && delete o[k], true;
			var f = !keyup && a && a.keys && (a.keys[mod+k] || typeof a.keys==='function' && a.keys);
			if (f) return !keys.has(this) && keys.set(this, o={}), f.call(this, o[k] = new Source, k), true; },

		onkeydown(evt) { return input(this, evt) },  onkeypress(evt) { return input(this, evt) },  onkeyup(evt) { return input(this, evt) },
		oncut(evt) { data(evt, call(this, 'data')), input(this, ''); return true },
		oncopy(evt) { data(evt, call(this, 'data')); return true },
		onpaste(evt) { input(this, data(evt)); return true },
		oncompositionstart(evt) { cmps.has(this) && cmps.get(this).cancel(); cmps.set(this, new Source), input(this, cmps.get(this)); return true },
		oncompositionupdate(evt) { cmps.has(this) && Source.on.call(cmps.get(this), evt.data); return true },
		oncompositionend(evt) { cmps.has(this) && Source.then.call(cmps.get(this), evt.data), cmps.delete(this); return true },
		ondragstart(evt) { if (hasData(this)) return drag.target(), data(evt, call(drag.from=this, 'data') || undefined), copyMove(evt), false },
		ondragend(evt) { if (hasData(this)) return drag.target(), drag.from=null, true },
		ondragleave(evt) { var o; if (hasData(this,true)) if (!(o=evt.explicitOriginalTarget) || o!==this) if (!(o=evt.relatedTarget) || !this.contains(o)) if (o!==drag.to) drag.target() },
		ondragenter(evt) { var s; if (hasData(this,true)) return copyMove(evt), s=drag.target(this), data(evt).then(v => Source.on.call(s,v,evt.clientX,evt.clientY)), true },
		ondragover(evt) { var s; if (hasData(this,true)) return copyMove(evt), s=drag.target(this), Source.on.call(s,evt,evt.clientX,evt.clientY), true },
		ondrop(evt) {
			var s, from = drag.from, move = copyMove(evt) || evt.dataTransfer.dropEffect==='move';  if (hasData(this,true))
				return s=drag.target(this,1), data(evt).then(v => { from && move && input(from, ''), async(() => Source.then.call(s,v,evt.clientX,evt.clientY)) }), true; },
	};
	preempt(call.override);
	if (!self.PointerEvent) {  var capt;
		Element.with({ setPointerCapture(id) { assert(id===0), capt=this }, releasePointerCapture(id) { assert(id===0 && capt), capt=null } });
		function onmouse(e) { e.pointerId=0, e.pointerType='mouse', e.isPrimary=true;  return call(capt||this, e.type.replace('mouse', 'pointer'), e, e.type==='mouseup' && (capt=null)) }
		['mousedown','mouseup','mouseenter','mousemove','mouseleave'].forEach(k => call.override[k] = onmouse); }
	//WHY WAS I ABLE TO CREATE AN UNREACHABLE GARBAGE "* box 2"? I was clicking fast but now can't reproduce it... Does it exist in an unconnected state for a little bit? HOW WOULD I KNOW?
		//I guess I'll find out 3 years from now.
		//I DID IT AGAIN... But now it's gone.
});
//if in Node, we won't have self.document, but we should still attempt to present an interface... how?
	//use its REPL; each time, write the current .main element tree (with a space for each going-up-or-down-between-text-nodes);
		//allow buttons to claim their command sequence (should be highlighted in color; but a base36-counter, or function name if not taken?)
*/
});



code({
	name:"codepointStreamLabeling",
	//pattern matching (parsing) and de-matching
		//is it possible to have classes have obj.match(...info?), and pass the instance for writing and a proxy object for reading (or initing)?
			//or maybe even obj.init(void or f)
});



code({
	name:"englishAltChars",
		//should probably be more general than just that; "unicode"?
	//links: ['https://unicode-table.com/en/blocks']
	/*
		0000 Control character
		0020 Basic Latin
		0080 Latin-1 Supplement
		0100 Latin Extended-A
		0180 Latin Extended-B
		0250 IPA Extensions
		02B0 Spacing Modifier Letters
		0300 Combining Diacritical Marks
		0370 Greek or Coptic
		0400 Cyrillic
		0500 Cyrillic Supplement
		0530 Armenian
		0590 Hebrew
		0600 Arabic
		0700 Syriac
		0750 Arabic Supplement
		0780 Thaana
		07C0 NKo
		0800 Samaritan
		0840 Mandaic
		0860 Syriac Supplement
		0870 ?
		08A0 Arabic Extended-A
		0900 Devanagari
		0980 Bengali
		0A00 Gurmukhi
		0A80 Gujarati
		0B00 Oriya
		0B80 Tamil
		0C00 Telugu
		0C80 Kannada
		0D00 Malayalam
		0D80 Sinhala
		0E00 Thai
		0E80 Lao
		0F00 Tibetan
		1000 Myanmar
		10A0 Georgian
		1100 Hangul Jamo
		1200 Ethiopic
		1380 Ethiopic Supplement
		13A0 Cherokee
		1400 Unified Canadian Aboriginal Syllabics
		1680 Ogham
		16A0 Runic
		1700 Tagalog
		1720 Hanunoo
		1740 Buhid
		1760 Tagbanwa
		1780 Khmer
		1800 Mongolian
		18B0 Unified Canadian Aboriginal Syllabics Extended
		1900 Limbu
		1950 Tai Le
		1980 New Tai Lue
		19E0 Khmer Symbols
		1A00 Buginese
		1A20 Tai Tham
		1AB0 Combining Diacritical Marks Extended
		1B00 Balinese
		1B80 Sundanese
		1BC0 Batak
		1C00 Lepcha
		1C50 Ol Chiki
		1C80 Cyrillic Extended C
		1C90 ?
		1CC0 Sundanese Supplement
		1CD0 Vedic Extensions
		1D00 Phonetic Extensions
		1D80 Phonetic Extensions Supplement
		1DC0 Combining Diacritical Marks Supplement
		1E00 Latin Extended Additional
		1F00 Greek Extended
		2000 General Punctuation
		2070 Superscripts and Subscripts
		20A0 Currency Symbols
		20D0 Combining Diacritical Marks for Symbols
		2100 Letterlike Symbols
		2150 Number Forms
		2190 Arrows
		2200 Mathematical Operators
		2300 Miscellaneous Technical
		2400 Control Pictures
		2440 Optical Character Recognition
		2460 Enclosed Alphanumerics
		2500 Box Drawing
		2580 Block Elements
		25A0 Geometric Shapes
		2600 Miscellaneous Symbols
		2700 Dingbats
		27C0 Miscellaneous Mathematical Symbols-A
		27F0 Supplemental Arrows-A
		2800 Braille Patterns
		2900 Supplemental Arrows-B
		2980 Miscellaneous Mathematical Symbols-B
		2A00 Supplemental Mathematical Operators
		2B00 Miscellaneous Symbols and Arrows
		2C00 Glagolitic
		2C60 Latin Extended-C
		2C80 Coptic
		2D00 Georgian Supplement
		2D30 Tifinagh
		2D80 Ethiopic Extended
		2DE0 Cyrillic Extended-A
		2E00 Supplemental Punctuation
		2E80 CJK Radicals Supplement
		2F00 Kangxi Radicals
		2FE0 ?
		2FF0 Ideographic Descriptions
		3000 CJK Symbols and Punctuation
		3040 Hiragana
		30A0 Katakana
		3100 Bopomofo
		3130 Hangul Compatibility Jamo
		3190 Kanbun
		31A0 Bopomofo Extended
		31C0 CJK Strokes
		31F0 Katakana Phonetic Extensions
		3200 Enclosed CJK Letters and Months
		3300 CJK Compatibility
		3400 CJK Unified Ideographs Extension A
		4DC0 Yijing Hexagram Symbols
		4E00 CJK Unified Ideographs
		A000 Yi Syllables
		A490 Yi Radicals
		A4D0 Lisu
		A500 Vai
		A640 Cyrillic Extended-B
		A6A0 Bamum
		A700 Modifier Tone Letters
		A720 Latin Extended-D
		A800 Syloti Nagri
		A830 Common Indic Number Forms
		A840 Phags-pa
		A880 Saurashtra
		A8E0 Devanagari Extended
		A900 Kayah Li
		A930 Rejang
		A960 Hangul Jamo Extended-A
		A980 Javanese
		A9E0 Myanmar Extended-B
		AA00 Cham
		AA60 Myanmar Extended-A
		AA80 Tai Viet
		AAE0 Meetei Mayek Extensions
		AB00 Ethiopic Extended-A
		AB30 Latin Extended-E
		AB70 Cherokee Supplement
		ABC0 Meetei Mayek
		AC00 Hangul Syllables
		D7B0 Hangul Jamo Extended-B
		D800 High Surrogates
		DB80 High Private Use Surrogates
		DC00 Low Surrogates
		E000 Private Use Area
		F900 CJK Compatibility Ideographs
		FB00 Alphabetic Presentation Forms
		FB50 Arabic Presentation Forms-A
		FDD0 Noncharacters
		FDF0 Arabic Presentation Forms-A
		FE00 Variation Selectors
		FE10 Vertical Forms
		FE20 Combining Half Marks
		FE30 CJK Compatibility Forms
		FE50 Small Form Variants
		FE70 Arabic Presentation Forms-B
		FF00 Halfwidth and Fullwidth Forms
		FFF0 Specials
		10000 Linear B Syllabary
		10080 Linear B Ideograms
		10100 Aegean Numbers
		10140 Ancient Greek Numbers
		10190 Ancient Symbols
		101D0 Phaistos Disc
		10200 ?
		10280 Lycian
		102A0 Carian
		102E0 Coptic Epact Numbers
		10300 Old Italic
		10330 Gothic
		10350 Old Permic
		10380 Ugaritic
		103A0 Old Persian
		103E0 ?
		10400 Deseret
		10450 Shavian
		10480 Osmanya
		104B0 Osage
		10500 Elbasan
		10530 Caucasian Albanian
		10570 ?
		10600 Linear A
		10780 ?
		10800 Cypriot Syllabary
		10840 Imperial Aramaic
		10860 Palmyrene
		10880 Nabataean
		108B0 ?
		108E0 Hatran
		10900 Phoenician
		10920 Lydian
		10940 ?
		10980 Meroitic Hieroglyphs
		109A0 Meroitic Cursive
		10A00 Kharoshthi
		10A60 Old South Arabian
		10A80 Old North Arabian
		10AA0 ?
		10AC0 Manichaean
		10B00 Avestan
		10B40 Inscriptional Parthian
		10B60 Inscriptional Pahlavi
		10B80 Psalter Pahlavi
		10BB0 ?
		10C00 Old Turkic
		10C50 ?
		10C80 Old Hungarian
		10D00 ?
		10E60 Rumi Numeral Symbols
		10E80 ?
		11000 Brahmi
		11080 Kaithi
		110D0 Sora Sompeng
		11100 Chakma
		11150 Mahajani
		11180 Sharada
		111E0 Sinhala Archaic Numbers
		11200 Khojki
		11250 ?
		11280 Multani
		112B0 Khudawadi
		11300 Grantha
		11380 ?
		11400 Newa
		11480 Tirhuta
		114E0 ?
		11580 Siddham
		11600 Modi
		11660 Mongolian Supplement
		11680 Takri
		116D0 ?
		11700 Ahom
		11740 ?
		118A0 Warang Citi
		11900 ?
		11A00 Zanabazar Square
		11A50 Soyombo
		11AB0 ?
		11AC0 Pau Cin Hau
		11B00 ?
		11C00 Bhaiksuki
		11C70 Marchen
		11CC0 ?
		11D00 Masaram Gondi
		11D60 ?
		12000 Cuneiform
		12400 Cuneiform Numbers and Punctuation
		12480 Early Dynastic Cuneiform
		12550 ?
		13000 Egyptian Hieroglyphs
		13430 ?
		14400 Anatolian Hieroglyphs
		14680 ?
		16800 Bamum Supplement
		16A40 Mro
		16A70 ?
		16AD0 Bassa Vah
		16B00 Pahawh Hmong
		16B90 ?
		16F00 Miao
		16FA0 ?
		16FE0 Ideographic Symbols and Punctuation
		17000 Tangut
		18800 Tangut Components
		18B00 ?
		1B000 Kana Supplement
		1B100 Kana Extended-A
		1B130 ?
		1B170 Nushu
		1B300 ?
		1BC00 Duployan
		1BCA0 Shorthand Format Controls
		1BCB0 ?
		1D000 Byzantine Musical Symbols
		1D100 Musical Symbols
		1D200 Ancient Greek Musical Notation
		1D250 ?
		1D300 Tai Xuan Jing Symbols
		1D360 Counting Rod Numerals
		1D380 ?
		1D400 Mathematical Alphanumeric Symbols
		1D800 Sutton SignWriting
		1DAB0 ?
		1E000 Glagolitic Supplement
		1E030 ?
		1E800 Mende Kikakui
		1E8E0 ?
		1E900 Adlam
		1E960 ?
		1EE00 Arabic Mathematical Alphabetic Symbols
		1ED00 ?
		1F000 Mahjong Tiles
		1F030 Domino Tiles
		1F0A0 Playing Cards
		1F100 Enclosed Alphanumeric Supplement
		1F200 Enclosed Ideographic Supplement
		1F300 Miscellaneous Symbols and Pictographs
		1F600 Emoji
		1F650 Ornamental Dingbats
		1F680 Transport and Map Symbols
		1F700 Alchemical Symbols
		1F780 Geometric Shapes Extended
		1F800 Supplemental Arrows-C
		1F900 Supplemental Symbols and Pictographs
		1FA00 ?
		20000 CJK Unified Ideographs Extension B
		2A6E0 ?
		2A700 CJK Unified Ideographs Extension C
		2B740 CJK Unified Ideographs Extension D
		2B820 CJK Unified Ideographs Extension E
		2CEB0 CJK Unified Ideographs Extension F
		2EBF0 ?
		2F800 CJK Compatibility Ideographs Supplement
		2FA20 ?
		E0000 Tags
		E0080 ?
		E0100 Variation Selectors Supplement
		E01F0 ?
			//^ should be in two arrays, starting codepoint and name.

		!~=！～
		00=⁰⁰ 11=¹¹ 23=²³ 49=⁴⁹ 09=₀₉ 09=🄁🄊 00=⓪⓪ 19=①⑨ 09=𝟎𝟗 09=𝟘𝟡 09=𝟢𝟫 09=𝟬𝟵 09=𝟶𝟿
		az=⒜⒵ az=ⓐⓩ az=𝐚𝐳 ag=𝑎𝑔 hh=ℎℎ iz=𝑖𝑧 az=𝒂𝒛 ad=𝒶𝒹 ee=ℯℯ ff=𝒻𝒻 gg=ℊℊ hn=𝒽𝓃 oo=ℴℴ pz=𝓅𝓏 az=𝓪𝔃 az=𝔞𝔷 az=𝕒𝕫 az=𝖆𝖟 az=𝖺𝗓 az=𝗮𝘇 az=𝘢𝘻 az=𝙖𝙯 az=𝚊𝚣
		AZ=ⒶⓏ AZ=🄐🄩 AZ=🄰🅉 AZ=🅐🅩 AZ=🅰🆉 AZ=🇦🇿 AZ=𝐀𝐙 AZ=𝐴𝑍 AZ=𝑨𝒁 AA=𝒜𝒜 BB=ℬℬ CD=𝒞𝒟 EE=ℰℰ FF=ℱℱ GG=𝒢𝒢 HH=ℋℋ II=ℐℐ JK=𝒥𝒦 LL=ℒℒ MM=ℳℳ NQ=𝒩𝒬 RR=ℛℛ SZ=𝒮𝒵 AZ=𝓐𝓩 AB=𝔄𝔅 CC=ℭℭ DG=𝔇𝔊 HH=ℌℌ II=ℑℑ JQ=𝔍𝔔 RR=ℜR SY=𝔖𝔜 ZZ=ℨℨ AB=𝔸𝔹 CC=ℂℂ DG=𝔻𝔾 HH=ℍℍ IM=𝕀𝕄 NN=ℕℕ OO=𝕆𝕆 PP=ℙℙ QQ=ℚℚ RR=ℝℝ SY=𝕊𝕐 ZZ=ℤℤ AZ=𝕬𝖅 AZ=𝖠𝖹 AZ=𝗔𝗭 AZ=𝘈𝘡 AZ=𝘼𝙕 AZ=𝙰𝚉
		AZ=az AA=ᴀᴀ BB=ʙʙ CD=ᴄᴅ EE=ᴇᴇ FF=ꜰꜰ GG=ɢɢ HH=ʜʜ II=ɪɪ JK=ᴊᴋ LL=ʟʟ MM=ᴍᴍ NN=ɴɴ OO=ᴏᴏ PP=ᴘᴘ QQ=ǫǫ RR=ʀʀ TU=ᴛᴜ VW=ᴠᴡ YY=ʏʏ ZZ=ᴢᴢ
			//^ each should become two entries in three arrays, start and end and shift.

		=⁼₌≈≡⩵⩶
		+⁺₊
		-⁻−₋‐‒–—―⸺⸻
		*⁕∗⁎⋅⨯
		/⁄∕⧸
		!¡
		?⸮¿⯑
		;⁏⸵
		,⸲⸴
		.⸳
		(⁽₍⟬⟮⦅⸨
		)⁾₎⟭⟯⦆⸩
		[⟦
		]⟧
		{⦃
		}⦄
		<≺⋖⊰⪡≪⪻⋘⫷‹˂〈⟨⟪⧼
		>≻⋗⊱⪢≫⪼⋙⫸›˃〉⟩⟫⧽
		^˄ˆ⊕
		˅ˇ
		&∧∩
		|∨∪
		~⁓∾∼
		\⧹⧵
		`´‵′‶″‷‴
		'‘’‚‛
		"“”„‟
			//^ should be an array of strings, and an object from character to index.

		//Maybe also do A, B, E, H, K, M, O, P, T, X, Y, for Latin/Greek/Cyrillic?

		// Latin-1 Supplement block.
		A:ÀÁÂÃÄÅ
		a:àáâãäå
		C:Ç  c:ç
		D:Ð  d:ð
		E:ÈÉÊË
		e:èéêë
		I:ÌÍÎÏ
		i:ìíîï
		N:Ñ  n:ñ
		O:ÒÓÔÕÖØ
		o:òóôõöø
		U:ÙÚÛÜ
		u:ùúûü
		Y:Ý  y:ýÿ
		Ae:Æ  ae:æ
		Th:Þ  th:þ
		ss:ß
		// Latin Extended-A block.
		A:ĀĂĄ
		a:āăą
		C:ĆĈĊČ
		c:ćĉċč
		D:ĎĐ  d:ďđ
		E:ĒĔĖĘĚ
		e:ēĕėęě
		G:ĜĞĠĢ
		g:ĝğġģ
		H:ĤĦ  h:ĥħ
		I:ĨĪĬĮİ
		i:ĩīĭįı
		J:Ĵ  j:ĵ
		K:Ķ  k:ķĸ
		L:ĹĻĽĿŁ
		l:ĺļľŀł
		N:ŃŅŇŊ
		n:ńņňŋ
		O:ŌŎŐ
		o:ōŏő
		R:ŔŖŘ
		r:ŕŗř
		S:ŚŜŞŠ
		s:śŝşš
		T:ŢŤŦ
		t:ţťŧ
		U:ŨŪŬŮŰŲ
		u:ũūŭůűų
		W:Ŵ  w:ŵ
		Y:Ŷ  y:ŷŸ
		Z:ŹŻŽ
		z:źżž
		IJ:Ĳ  ij:ĳ
		Oe:Œ  oe:œ
		["'n"]:ŉ
		f:ſ
			//^ .normalize('NFD') will decompose a lot, but not all (not Ĳ and such) — it will also work on other Latin ranges.

		//now; how to put that in data?

		//unicode:
			//block(cp)→name
			//blockRanges(name)→[begin,end, …]
			//similar(f, ...cp or string)
			//utf8
				//forEach(f, cp or string or uint8 or iterable-of-numbers-or-those)
					//(we should probably put f first here always, right?)
				//build(uint8 or void, ...cp)→uint8 or void
					//(what about having some cache for same-size array buffers?)
					//(and what about allocating-more-than-required, and storing actual length?)
				//maybe, write(f, cp)/read(f, byte)?…
					//(how would read store state though? this.state? what to store, exactly?)
				//lengthAt(b,i)?
				//lengthOf(cp) (or size)?
				//get(b,i), set(b,i,cp)? (should definitely be reimagined as some stream-expansion)
				//slice(b, begin, end) (or toString)?
				//seek(s,i, a=null), doing a cp-index → physical-index??
				//base64(s), converting it to utf8 and converting that to base64??
				//cpLength(s)?
				//every(s,f)??
			//utf16
				//forEach(f, cp or string or uint16 or iterable-of-numbers-or-those)
				//build(uint16 or void, ...cp)→uint16
			//utf32
				//forEach(f, cp or string or uint32 or iterable-of-numbers-or-those)
				//build(uint16 or void, ...cp)→uint32
	*/
});



code({
	name:"parsedEditableView",
/*
init = ((stop, parser) => {
	function insert(e) { e.parentNode && call.moved(e, e.parentNode) }  function remove(e) { call.moved(e) }
	function prev(e,s) { while (!e.previousSibling && e!==s) e=e.parentNode; return !e || e===s ? null : e.len===undefined ? remove(e) || prev(e.previousSibling, s) : e.previousSibling }
	function next(e,s) { while (e && !e.nextSibling && e!==s) e=e.parentNode; return !e || e===s ? null : e.len===undefined ? remove(e) || next(e.nextSibling, s) : e.nextSibling }
	function text(e) { return e.tagName==='SPAN' && !!e.firstChild }
	function node(e) { return e===undefined ? ref(document.createElement('div')) : e instanceof Element && !text(e) }
		//should use <node> elements for this, so that their default display is inline.
	function src(s) {
		var c=s, i=0, pos=0, max=0, e,a=[];
		return (p=undefined, cache=undefined, rule=null, incomplete=false) => {
			if (p===undefined) return pos;  if (p===null) return max;  if (p===true) return [c,i];  if (p<0) return void(c=s, i=0, pos=p);
			!(p>=0) && assert(0, 'invalid source position:', p);  if (!c) c=s, i=0;  pos=p, max=Math.max(max,pos);
			if (node(c) || text(c)) do {
				while (c!==s && c === c.parentNode.firstChild && pos >= i+c.parentNode.len) c=c.parentNode;
				while (c && i>pos) c=prev(c,s), i-=c.len;  while (c && pos>=i+c.len) i+=c.len, c=next(c,s);
				if (cache && i===pos && c && !text(c)) if (incomplete && c.tagName==='DIV' || c.rule && c.value!==undefined) {
					cache.set(pos, c.rule, c);  if (rule===undefined || c.rule===rule) return; }
				c && !text(c) && (c = c.firstChild || next(c));
			} while (c && !text(c) || i>pos || c && pos>i+c.len);
			assert(!c || !(c instanceof Element) || text(c));
			assert(i<=pos && (!c || !(c instanceof Element) || !c.len || pos < i+c.len));
			return c!==e && (a.length=0, e=c), utf8.seek(c instanceof Element ? c.firstChild.nodeValue : c, pos-i, a); }; }

	function put(r, ...v) {
		typeof r!=='function' && v.length && assert(0, 'only functions can accept values for arguments - put chars with separate calls');
		if (typeof r==='function') return r(put, ...v);
		if (typeof r==='number') return sz=s.sizes[0], s.extend(sz + utf8.lengthOf(r)), utf8.set(s.data, sz, r), true;
		var sz=s.sizes[0], b=utf8.from(r); s.extend(sz + b.byteLength), s.data.set(b, sz), unref(r); return true; }
	function write(r, ...v) { s = new Tensor(uint8,0); try { put(r, ...v); } catch (err) { s = void unref(s); throw err } return s }

	var LEN='len', MAX='max', RULE='rule', VALUE='value', CLASS='className', L='left', T='top', W='width', H='height', P='px';
	function toText(s) { s = utf8.slice(s); var len=utf8.cpLength(s); return call.text(s).with(LEN,len).with(MAX,len) }
	function replaceChild(e,to) { try { e instanceof Node && e.parentNode && e.parentNode.replaceChild(to,e), unref(e); return to } catch (err) {log('child:',e,'->',to); throw err} }
	function replace(s, ...a) {
		var shouldBe = (s ? s.len : 0);  for (var p of a) shouldBe -= p[1]-p[0] - utf8.cpLength(p[2]);
		if (s instanceof Element && s.tagName==='SPAN') {
			for (var arr=[], str = s.textContent, i=0; i<a.length; ++i) arr.push(utf8.slice(str, prev, a[i][0], prev=a[i][1])), a[i][2]!=null && arr.push(utf8.slice(a[i][2]));
			return arr.push(utf8.slice(str, prev)), call.text.call(s, arr.join('')), s[MAX] = s[LEN] = shouldBe, s; }
		if (!s) s = ref(document.createElement('content'));  s.with(VALUE).with(LEN, shouldBe).with(MAX, shouldBe);
		for (var arr=[], prev=0, pos=0, len=0, ch=s.firstChild; ch; ch=n) {
			var max = Math.max(ch.max, ch.len), n = ch.nextSibling;  if (ch.len===undefined) continue;  while (a[prev] && a[prev][1] < pos) ++prev;
			arr.length=0;  for (var i=prev; i<a.length && a[i][0] < pos+max; ++i) arr.push([Math.max(a[i][0]-pos, 0), Math.min(a[i][1]-pos, ch.len), a[i][2]]), a[i][2]=null;
			pos += ch.len;  if (arr.length) prev += arr.length-1, replace(ch, ...arr);  len += ch.len; }
		while (a[prev]) if (a[prev][2]) s.with(toText(a[prev][2])), ++prev, len += s.lastChild.len; else ++prev;
		len!==shouldBe && assert(0, 'replacing changed length incorrectly');  return s; }

	var s, cache, ctx, st, end, limit, markClosed=true, copies = [], txt = new Map, parsing = new Map;
	function doCopies(...doNotMove) {
		for (var [e,i] of txt) call.text.call(e, call.text.call(e) + i.map(c => String.fromCodePoint(c)).join(''));  txt.clear();
		for (var copied=new Set(doNotMove), i=0; i < copies.length; i+=2) if (ref.of(copies[i+1])) copied.add(copies[i]);
		for (var i=0; i < copies.length; i+=2) if (ref.of(copies[i+1])) {
			for (var p = copies[i]; p && !p.selected; p = p.parentNode) if (copied.has(p)) break;
			if (copied.has(p))
				var e = function copy(e) {
					var c = ref(e instanceof Element ? document.createElement(e.tagName).with(CLASS, e.className) : document.createTextNode(e.nodeValue));
					if (c instanceof Element) c.classList.remove('close'), c.classList.remove('ambiguous');
						//we can't possibly keep in mind ALL the temporary element states; we should have call.copy(elem) (it can then access temporary-things info).
					for (var k of Object.keys(e)) c.with(k, ref(e[k]));  for (var k = e.firstChild; k; k = k.nextSibling) c.with(copy(k));  return c;  }(copies[i]);
			else e = copies[i], ref.of(e) && ref.bytes(-8);
			copies[i+1].parentNode.replaceChild(e, copies[i+1]), unref(copies[i+1]); }
		copies.length = 0; }
	function coverage(from, a,b) {
		if (a<0) a=0;  if (a>from.len) a=from.len;  if (b<0) b=0;  if (b>from.len) b=from.len;
		if (!from.firstChild || from.tagName==='SPAN') return b-a;
		for (var ch=from.firstChild, pos=0, s=0; ch; pos += ch.len || 0, ch=ch.nextSibling)
			if (a < pos + (ch.len || 0) && pos < b) s += coverage(ch, a-pos, b-pos);  return pos+s; }
	function check(cp) { return s(st++)===cp }
	function char(cp) { if (ctx) { var c=ctx.lastChild, s;  (!c || c.tagName!=='SPAN') && ctx.with(c = call.text('').with(LEN,0).with(MAX,0));  ++c.len, ++c.max;
		s = call.text.call(c);  s.length<10 ? call.text.call(c, s + String.fromCodePoint(cp)) : (!txt.has(c) && txt.set(c,[]), txt.get(c)[txt.get(c).length]=cp); } return true }
	//.with is the most time-consuming function for now (half of reflow's time); should have a function that returns a ref-d node with all needed props already set.
		//and it still is.
	function get(r, ...v) {
		typeof r!=='function' && v.length && assert(0, 'only functions can accept values for arguments - get chars with separate calls');
		if (r===undefined) return s(s(), cache);
		if (r===null) { if (ctx) while (ctx.firstChild) unref(ctx.firstChild), ref.bytes(-8), ctx.removeChild(ctx.firstChild); return void(s(st, cache)); }
		if (typeof r==='number') return s(s(), cache)===r && (char(r), s(s()+1, cache, undefined), true);
		//should also have something like parser.suggest(from, i)->[ [lang.number, 'NaN', ['0'..'9'], ...] ].
		//we should be able to request a range of characters, so that suggesting is easier.
			//in fact, maybe should disallow lookahead at all.
		if (typeof r==='function') return apply(r, ...v);
		var start=st, i=s();  st=i;  return utf8.every(r, check) ? (utf8.every(r, char), s(st, cache, undefined), st=start, true) : (st>i+1 && void s(i, cache), st=start, false); }
	function apply(r, ...v) {
		var start=s();  st=start;
		if (end!=null && now>end) throw undefined;  if (limit!=null && start>limit) throw null;
		if (cache && (c=cache.get(s(), r))) s(start + (ctx ? c.len : c[1]), cache, void 0), val = ref(ctx ? c.value : c[0]), unref(c), ctx && (copies.push(c, c=node()), [c,ctx] = [ctx,c]);
		else {
			if (ctx) { var c=ctx; ctx = node().with(RULE,r).with(VALUE).with(LEN,0).with(MAX,0).with(CLASS, r.alias || ''), markClosed && call.temp(ctx, 'close') }
				//...why does it close the string element when we're editing it, before stopStalling arrives? it looks good, but it's not what I imagined would happen?..
					//seriously, it seems to instantly parse to the end despite the limit.
					//And sometimes it doesn't visually close when it should.
			try { var val=r(get,...v) }catch(e){ e==null&&ctx ? c.with(ctx.with(VALUE).with(LEN,s()-start).with(MAX,s(null)-start).with(CLASS,'partial')) : unref(ctx);ctx=c; throw e }
			val!==undefined && cache && cache.set(start, r, ctx ? ctx.with(VALUE, ref(val)).with(LEN,s()-start).with(MAX,s(null)-start) : [val, s()-start]); }
		if (val===undefined) return ctx && (unref(ctx), ctx=c), void s(start, cache);
		if (ctx) c.with(ctx), ctx=c;  return val; }
	//should really have a way to serialize the parse tree, just so I could figure out why it fucking jumps so much on editing.
	function parse(from, rule) {
		if (this) var { tree=true, duration=null, close=true } = this; else var [tree, duration] = [false, null];
		s = src(from), st=0, cache = new Cache(1024), end = duration!=null && (now+duration);  if (typeof tree==='number') limit = tree, tree = true; else limit=null;
		markClosed = close;
		ctx = tree ? ref(document.createElement('content')).with(RULE,rule).with(VALUE).with(LEN,0).with(MAX,0).with(CLASS, rule.alias || '') : undefined;
		try { var value = rule(get) }
		catch (err) {
			if (err!=null) throw cache.clear(), unref(ctx), err;
			if (!ctx) return new Error('parsed up to '+s()); else err===null && (ctx.rule = null), ctx.classList.add('partial'); }
		ctx && ctx.with(VALUE, value).with(LEN, s());  var to=s(), fr=to-1, last = ctx && ctx.lastChild;
		if (last && last.len!==undefined && last.value===undefined)
			if (coverage(from, s() - last.len, s()) > coverage(ctx, s() - last.len, s()))
				fr=to, to -= last.len, unref(last), ctx.removeChild(last), ref.bytes(-8);
		if (s(to)!==undefined) {
			var elem=null, acceptElem = { set(pos,rule,e) { if (elem!==e) elem=e } }, c, e, len;
			if (!ctx) return;  value!==undefined && (ctx.rule = null), ctx.with(VALUE), ctx.classList.add('partial');
			s(fr, null, undefined, true), c = s(to, acceptElem, undefined, true);
			while (elem || c!==undefined) {
				len = elem ? elem.len || 0 : 1;
				if (elem) copies.push(elem, e=node()), ctx.with(e); else char(c);
				e=elem, c = s(s()+len, acceptElem, undefined, true);
				if (elem===e) elem=null, c = s(s(), null, null, true); } }
					//we are desyncing all those indicators of element state all over the place; maybe we should have node(e, rule=null, value=undefined)?
						//or is there any better name, one that doesn't clash with pre-existing things?
		tree ? doCopies(ctx) : (copies.length=0);  from && from.len!==undefined && from.len!==s() && assert(0, 'parsing changed length from', from.len, 'to', s(), ':', ctx);
		return cache.clear(), tree ? replaceChild(from, ctx.with(LEN,s()).with(MAX,s(null))) : value; }

	if (!self.document) return;
	function maxOffset(e) { return e.childNodes.length || e.nodeValue && e.nodeValue.length || 0 }
	function fromDOM(from, elem, offset) {
		if (elem.parentNode && !elem.nodeValue && text(elem.parentNode)) [elem, offset] = [elem.parentNode, 1];
		var i=from.compareDocumentPosition(elem.childNodes[offset] || elem);  if (i&16) i = i & ~6;  assert(from.len>=0, from);
		if (offset>=elem.childNodes.length && (i&8)) return from.len;  if (i&6) return (i&4) ? from.len : 0;  if (!i) return 0;  assert(from.contains(elem),i,elem,offset);
		var i=0;  if (elem.nodeValue) for (var c of elem.nodeValue) { if (!offset--) break; ++i }
		else if (text(elem)) offset && (i += elem.len);
		else for (var c=elem.firstChild; offset--; c=c.nextSibling) i += c.len || 0;
		elem = prev(elem, from);  while (elem) i += elem.len, elem = prev(elem, from);  return i; }
	function toDOM(from, i) {  var s=src(from); s(i); var a=s(true), j=0;
		if (!a[0]) { while (from.lastChild && !text(from)) from = from.lastChild; return [from, maxOffset(from)]; }
		a[0] = a[0].firstChild, a[1] = i-a[1];  for (var c of a[0].nodeValue) { if (!a[1]--) break; j += c.length }  a[1]=j;  return a; }
	function fromPoint(from, x,y) { if (y===undefined) [x,y] = [x.clientX, x.clientY];
		var r = from.getBoundingClientRect();  if (x<r.x) x=r.x;  if (x>r.x+r.width) x=r.x+r.width;  if (y<r.y) y=r.y;  if (y>r.y+r.height) y=r.y+r.height;
		var p = document.caretPositionFromPoint(x,y); return fromDOM(from, p.offsetNode, p.offset) }
	function toPoint(from, i) {
		var [elem, offset] = toDOM(from, i), i = offset === maxOffset(elem) ? offset-1 : offset;
		var r = document.createRange();  r.setStart(elem, i<0 ? 0 : i), r.setEnd(elem, i+1);  r = r.getClientRects(), r = r[r.length-1] || elem.getBoundingClientRect();
		return offset === maxOffset(elem) ? [r.x+r.width, r.y, r.height] : [r.x, r.y, r.height]; }

	function position(e,r) {
		var b=e.offsetParent.getBoundingClientRect(); CSS.write(()=>e.style.with(L, r.x-b.x+P).with(T, r.y-b.y+P).with(W, r.width+P).with(H, r.height+P)); }
	function selection(f,a,b,i=b) {  if (a==null) return;
		var caret = this.firstChild || this.with(ref(document.createElement('caret'))).lastChild, c = this.parentNode.firstChild, [x,y,h] = toPoint(c,i);  f(caret);
		CSS.read(() => { var b = this.offsetParent.getBoundingClientRect();  CSS.write(() => caret.style.with(L, x-b.x+P).with(T, y-b.y+P).with(H, h+P)); });
		call.temp(caret, 0, { animation:'none' });  var rects = [];
		if (a!==b) { var range = document.createRange();  range.setStart(...toDOM(c,a)), range.setEnd(...toDOM(c,b));  range.collapsed && range.setEnd(...toDOM(c,a)); }
		for (var r of a===b ? [{x,y,width:0,height:h}] : a<b ? range.getClientRects() : [...range.getClientRects()].reverse()) {  var l = rects.last;
			if (l && r.y <= l.y && r.y+r.height >= l.y+l.height) r.x>l.x ? (l.width = Math.max(l.width, r.x-l.x)) : (l.width += l.x-r.x-r.width, l.x = r.x+r.width);
			if (l && r.y === l.y && r.height === l.height) r.x>l.x ? (l.width = Math.max(l.x+l.width, r.x+r.width)-l.x) : (l.width += l.x-r.x, l.x = r.x);
			else if (l && r.y >= l.y && r.y+r.height <= l.y+l.height)rects.push({ x:r.x>l.x ? l.x+l.width : r.x, y:r.y, width:r.x>l.x ? r.x+r.width-l.x-l.width : l.x-r.x, height:r.height });
			else rects.push({ x:r.x, y:r.y, width:r.width, height:r.height }); }
		for (var i=0, next = this.firstChild.nextSibling; i<rects.length; ++i) {
			while (next && call.removed(next)) next = next.nextSibling;  if (!rects[i].width && a!==b) rects[i].width=3;
			var [e, next] = next ? [next, next.nextSibling] : [this.with(ref(document.createElement('div'))).lastChild, next];
			position(f(e), rects[i]); } }

	//how to do sticky array commas?
		//we want to put near-to-selected stickies in the get data, with something special (an attribute?), so that we could retrieve the sticky when pasted into certain locations...
			//<div class=array sticky=', '>1,2</div> from get data (if elem.next is a span, take it as sticky - else if elem.prev is a span, take that; else, no sticky)
				//should only take stickies when .rule.sticky, right?
					//...or should we do it always, when we select a div fully? will this have unwanted consequences?
			//insert sticky before if same-class has a span after insertion place, or after if it doesn't: 3,4,5 -> 1,2, 3,4,5;  3,4,5, 1,2;  3,1,2, 4,5;  3, 1,2,4,5


	function parser(f, initial=null, rule, onValue=null) {
		!this.selected && this.with('selected', ref([0,0])).with('history', ref([0]));
		f(this.firstChild || replace(null, [0,0])), f(selection);
		CSS.write(() => { markClosed=false, call(this, 'replace', initial) }); }

	var moved=true, pointing=false, selectionLocked=false;
	parser.onlayout = function() { call(this, 'select') };
	parser.onremove = function() { parsing.has(this) && clearTimeout(parsing.get(this)[3]);  parsing.delete(this) };
	parser.onpointerdown = function(evt) { var from=this.firstChild, i=fromPoint(from, evt);
		if (this.id!=='focus') parser.select.call(this, i);
		else if (!moved) {  this.selected[0]>this.selected[1] && this.selected.swap(0,1);
			var e = selected(from), a = fromDOM(from, e, 0), b = fromDOM(from, e, maxOffset(e));
			while (a===this.selected[0] && b===this.selected[1] && e!==from) e = e.parentNode, a = fromDOM(from, e, 0), b = fromDOM(from, e, maxOffset(e));
			if (e===from) a=b=i; parser.select.call(this, a, b);  return true; }
		pointing=true;  return moved=false; };
	parser.onpointermove = function(evt) { if (Math.abs(evt.movementX) > 1 || Math.abs(evt.movementY) > 1) moved=true };
	parser.onpointerup = function(evt) { pointing=false };
	parser.onselectionchange = function(evt) { if (!selectionLocked) parser.select.call(this, getSelection()), selectionLocked=true, async(()=>selectionLocked=false) };
		//wait - it was somehow locked forever once; is async slightly unstable, rarely?
	parser.onfocus = function() { async(() => parser.select.call(this)) };  parser.onblur = () => void getSelection().removeAllRanges();

	parser.keys = {
		Backspace() { call(this, 'flush');  var [a,b]=this.selected;  call(this, 'replace', a===b ? Math.max(a-1, 0) : a, b, '') },
		Delete() { call(this, 'flush');  var [a,b]=this.selected;  call(this, 'replace', a===b ? Math.min(a+1, this.firstChild.len) : a, b, '') },
		CtrlBackspace() { call(this, 'flush');  var [a,b]=this.selected;  call(this, 'replace', a===b ? seek(this.firstChild, a, -1) : a, b, '') },
		CtrlDelete() { call(this, 'flush');  var [a,b]=this.selected;  call(this, 'replace', a===b ? seek(this.firstChild, a, 1) : a, b, '') },

		ShiftArrowLeft () { var [a,b]=this.selected;  call(this, 'select', a, b-1) },
		ShiftArrowRight() { var [a,b]=this.selected;  call(this, 'select', a, b+1) },
		ArrowLeft () { var [a,b]=this.selected;  call(this, 'select', a===b ? a-1 : Math.min(a,b)) },
		ArrowRight() { var [a,b]=this.selected;  call(this, 'select', a===b ? a+1 : Math.max(a,b)) },
		CtrlShiftArrowLeft () { var [a,b]=this.selected;  call(this, 'select', a, seek(this.firstChild, b,-1)) },
		CtrlShiftArrowRight() { var [a,b]=this.selected;  call(this, 'select', a, seek(this.firstChild, b, 1)) },
		CtrlArrowLeft () { var [a,b]=this.selected;  call(this, 'select', a===b ? seek(this.firstChild, a,-1) : Math.min(a,b)) },
		CtrlArrowRight() { var [a,b]=this.selected;  call(this, 'select', a===b ? seek(this.firstChild, a, 1) : Math.max(a,b)) },

		ArrowUp  () { log('unimplemented') },
		ArrowDown() { log('unimplemented') },
		ShiftArrowUp  () { log('unimplemented') },
		ShiftArrowDown() { log('unimplemented') },
		//...how would we implement them? I know editors have some pixel-space variable for caret's x, so it could hop over small lines, but we have to actually implement that...
			//and call toPoint(this.firstChild, i)... and store the result until it's no longer relevant (when? on parser.select that wasn't caused by up/down arrow)...
			//should we store it on the element itself, or in a map?
				//probably the element, for clarity.

		Home() { log('unimplemented') },  End() { log('unimplemented') },
		ShiftHome() { log('unimplemented') },  ShiftEnd() { log('unimplemented') },
		//how to find the end of a line?
			//visual is more fitting, right? but how to find it?
				//we COULD advance caret position one-by-one to see where its x jumps to left, but that's too slow (besides, it often prefers putting caret on the next line).
				//we could find nearest-to-this parent block-formatting-context (display: block or inline-block) and use fromPoint; x is left/right edge's, y is caret's middle.

		CtrlHome() { call(this, 'select', 0) },  CtrlEnd() { call(this, 'select', this.firstChild.len) },
		CtrlShiftHome() { call(this, 'select', undefined, 0) },  CtrlShiftEnd() { call(this, 'select', undefined, this.firstChild.len) },

		CtrlKeyA() { call(this, 'select', 0, this.firstChild.len) },
		CtrlShiftKeyA() { call(this, 'select', ...this.selectedLast) },

		CtrlKeyZ() {
			if (this.history[0] > 1) {
				call(this, 'flush');  actions.has(this) ? (actions.get(this)[0].history = true) : actions.set(this, [{ history:true }]);
				for (var p of this.history[this.history[0]--])
					call(this, 'replace', p[0], p[0] + utf8.cpLength(p[2]), p[1],  p[0]+(p[1]?1:0)); } },
		CtrlShiftKeyZ() {
			if (1+this.history[0] < this.history.length) {
				call(this, 'flush');  actions.has(this) ? (actions.get(this)[0].history = true) : actions.set(this, [{ history:true }]);
				for (var p of this.history[++this.history[0]])
					call(this, 'replace', p[0], p[0] + utf8.cpLength(p[1]), p[2],  p[0]+(p[2]?1:0)); } },

		CtrlKeyF() { log('unimplemented') },  CtrlKeyH() { log('unimplemented') },
		CtrlKeyG() { log('unimplemented') },  CtrlShiftKeyG() { log('unimplemented') },
	};

	var scheduled = false, actions = new Map;
	function stopStalling(p) {
		actions.has(p) && assert(actions.get(p)[0].timeout!=null);
		!actions.has(p) && actions.set(p, [{}]);  doActionsLater();  var a = actions.get(p);
		a[0].tree = true, a[0].duration = 40, a[0].timeout = startStalling(p, a[0].timeout, true); }
	function startStalling(p, id, dont=false) { clearTimeout(id), p.classList[dont?'remove':'add']('stalling');  return dont?null : setTimeout(stopStalling, parser.stallingTimeout, p) }
	function adjustPosition(j,a) {
		for (var i=0, offset=0; i<a.length; ++i)
			if (a[i][3] <= j && j <= a[i][0] + utf8.cpLength(a[i][2])) return offset + (a[i][3]===j ? j : a[i][0] + utf8.cpLength(a[i][2]));
			else if (a[i][3] <= j) offset -= a[i][1]-a[i][0] - utf8.cpLength(a[i][2]); else break;  return offset+j; }
	function doActionsFor(p) {
		var a = actions.get(p), from = p.firstChild, [_, rule, onValue] = call(p, 'values');  if (!a) return;  assert(from);
		if (a[0].tree!==true) for (var i=1, max = a[0].tree || 0; i<a.length; ++i) if (max<a[i][1]) max=a[i][1];
		if (a.length>1 || !a[0].duration) {
			if (max!==undefined) a[0].timeout = startStalling(p, a[0].timeout);
			a[0].tree = max || true;  markSelection(from, 'remove');
			var prev, s = src(from), [s0,s1] = p.selected, arr = a.slice(1).sort((a,b) => a[0]!==b[0] ? a[0]-b[0] : b[1]-a[1]);
			arr.filter(p => {
				if (p[2]===undefined) return [s0,s1]=p, false;  p[0]>p[1] && p.swap(0,1), p[2] = utf8.slice(p[2]), p[3] = p[0];
				if (p[0]<0) p[0]=0;  if (p[0]>from.len) p[0]=from.len;
				if (p[1]<0) p[1]=0;  if (p[1]>from.len) p[1]=from.len;
				if (p[2]) for (var skip=0, i=0; i < p[2].length && s(p[0]+skip) === p[2].codePointAt(i); ++skip) i += p[2].codePointAt(i)===p[2].charCodeAt(i) ? 1 : 2;
				if (skip) p[0] += skip, p[2] = p[2].slice(i);
				if (prev) {
					prev[0]===p[0] && prev[1]===p[1] && assert(0, 'duplicate replacement indexes:', prev, p);
					prev[1]>p[0] && prev[1]<p[1] && assert(0, 'intersecting replacement indexes:', prev, p);
					if (prev[1]===p[0]) return prev[1]=p[1], prev[2] += p[2], false;
					if (prev[0]<p[1] && p[1]<prev[1]) return false; }
				return prev=p, true; });
			arr.filter(p => { if (p[0]>p[1]) p[0]=p[1];  return p[0]!==p[1] || utf8.cpLength(p[2]) });
			p.selected[0] = adjustPosition(s0, arr), p.selected[1] = adjustPosition(s1, arr);
			if (!a[0].history) {
				while (p.history.length > 1+p.history[0]) unref(p.history.pop());
				s0 = arr[0], s1 = p.history.last[0], a[0].history = false;
				if (arr.length===1 && s0[0]===s0[1] && utf8.cpLength(s0[2])===1 && p.history.last.length===1 && s1 && !s1[1] && s0[0]===s1[0] + utf8.cpLength(s1[2])) s1[2] += s0[2];
				else if (arr.length===1 && s0[0]+1===s0[1] && !s0[2] && p.history.last.length===1 && s1 && !s1[2] && s0[0]===s1[0])
					s1[1] += String.fromCodePoint(s(s0[0]));
				else if (arr.length===1 && s0[0]+1===s0[1] && !s0[2] && p.history.last.length===1 && s1 && !s1[2] && s0[1]===s1[0] + utf8.cpLength(s1[2]))
					--s1[0], s1[1] = String.fromCodePoint(s(s0[0])) + s1[1];
				else if (arr.length) ++p.history[0], p.history.push(ref.this(arr.map(p => {
					for (var a=[], i=p[0]; i<p[1]; ++i) a[a.length] = String.fromCodePoint(s(i));
					return ref.this([p[0], a.join(''), p[2]]); }))); }
			from = replace(from, ...arr), arr.length=0, a.length=1; }
		if (a[0].duration) from = parse.call(a[0], from, rule);
		if (a[0].duration<20) a[0].duration+=3; else if (a[0].duration<100) a[0].duration+=20; else a[0].duration+=100;
		if (a[0].duration > 500 || from.value!==undefined)
			actions.delete(p), (from.rule || a[0].tree===true) && (a[0].timeout = startStalling(p, a[0].timeout, true), onValue && onValue.call(p, from.value));
		call(p, 'select'); }
	function doActions() { for (var [p,a] of actions) doActionsFor(p) }
	function doActionsScheduled() { call.layout(doActions), scheduled=false, doActionsLater() }
		//wait, do we still do multiple doActions per CSS.write? flame chart says so, sometimes, but it can't be true, can it?
			//should check it ourselves... at the end of each CSS.write, if self.ACTIONS>1, log smth (else set it to 0).
	function doActionsLater() { if (!scheduled && actions.size) async(doActionsScheduled), scheduled=true }

	parser.stallingTimeout = 500;
	parser.replace = function(...a) {
		if (!a.length) return;  var from = this.firstChild;  assert(from);
		!actions.has(this) && actions.set(this, [{}]);  doActionsLater();
		for (var to = actions.get(this), i=0; i<a.length; ++i) {
			if (a[i] instanceof Selection)
				to.push([!a[i].anchorNode || a[i].anchorNode===this ? this.selected[0] : fromDOM(from, a[i].anchorNode, a[i].anchorOffset),
					!a[i].focusNode || a[i].focusNode===this ? this.selected[1] : fromDOM(from, a[i].focusNode, a[i].focusOffset), a[++i]]), to.last[0]>to.last[1] && to.last.swap(0,1);
			else if (a[i] instanceof Node) to.push([fromDOM(from, a[i], 0), fromDOM(from, a[i], maxOffset(a[i])), a[++i]]);
			else if (typeof a[i]==='number' && typeof a[i+1]==='number') a[i]>a[i+1] && a.swap(i,i+1), to.push([a[i], a[++i], a[++i]]);
			else if (typeof a[i]==='number') to.push([a[i], a[i], a[++i]]); else to.push([0, from.len, a[i]]); }
		to[0].timeout = startStalling(this, to[0].timeout);
		to[0].duration = 0, to.length>1 && (to[0].close = markClosed);  !markClosed && doActionsFor(this);  markClosed=true; };
	parser.select = function(a,b,i) {
		var from = this.firstChild;  assert(this.selected && from);
		if (a instanceof Node) [a,b] = [fromDOM(from, a, 0), fromDOM(from, a, maxOffset(a))];
		if (a instanceof Selection)
			b = !a.focusNode || a.focusNode===this ? this.selected[1] : fromDOM(from, a.focusNode, a.focusOffset),
			a = !a.anchorNode || a.anchorNode===this ? this.selected[0] : fromDOM(from, a.anchorNode, a.anchorOffset);
		if (b===undefined) b = a===undefined ? this.selected[1] : a;  if (a===undefined) a = this.selected[0];
		if (isNaN(a) || isNaN(b)) assert(0, 'invalid selection indexes:', a,b);
		if (a<0) a=0;  if (a>from.len) a=from.len;  if (b<0) b=0;  if (b>from.len) b=from.len;
		CSS.read(() => call(this.childNodes[1], 'values', i===undefined ? [a,b] : [a,b,i]));
		if (!pointing) !equals(this.selected, this.selectedLast) && this.with('selectedLast', ref([...this.selected]));
		markSelection(from, 'remove'), this.selected[0] = a, this.selected[1] = b, markSelection(from);
		CSS.write(() => { getSelection().setBaseAndExtent(...toDOM(from, a), ...toDOM(from, b)) }); };
	parser.flush = function() { var to = actions.get(this);  if (!to) return;  to[0].duration = 0;  doActionsFor(this) };

	function selected(from, a = Math.min(...from.parentNode.selected), b = Math.max(...from.parentNode.selected)) {
		while (from) {  if (!from.firstChild || from.tagName==='SPAN') return from;
		for (var pos=0, at, ch = from.firstChild; ch; pos += ch.len || 0, ch = ch.nextSibling)
			if (ch.len!==undefined && a < pos+ch.len && pos < b) { if (at) return from; else at = [ch, pos]; }
		if (!at) return from;  from = at[0], a -= at[1], b -= at[1], at = null; } }
	function seek(from,i,d) { if (i<0) return 0;  if (i>from.len) return from.len;  var [e,j]=toDOM(from,i);
		return d>0 ? (maxOffset(e)>1 && j<maxOffset(e) ? fromDOM(from,e,maxOffset(e)) : seek(from,i+1,d)) : (j ? fromDOM(from,e,0) : seek(from,i-1,d)) }
	function markSelection(from, add='add', a,b) { var e = selected(from,a,b);  CSS.write(() => (e instanceof Element ? e : e.parentNode).classList[add]('selected')) }
	function range(from, a,b) {
		if (a>b) [a,b]=[b,a];  var [e,i] = toDOM(from, b);  var p = !i && b && toDOM(from, b-1);  p && (e=p[0], i=maxOffset(e));
		while (e!==from && i===maxOffset(e) && e.parentNode.firstChild===e && e.parentNode.lastChild===e) e = e.parentNode, i=1;
		var r = document.createRange();  r.setStart(...toDOM(from, a)), r.setEnd(e,i);  return r; }

	parser.with({ get data() { return range(this.firstChild, ...this.selected) }, set data(s) {
		actions.has(this) && (actions.get(this)[0].duration = 0), doActionsFor(this);  doActionsLater();
		s.on((w,x,y) => x!==undefined && y!==undefined && call(this, 'select', undefined, undefined, fromPoint(this.firstChild, x,y)) || null)
		.then((w,x,y) => {  if (w===undefined) return;  if (x===undefined || y===undefined) return void call(this, 'replace', ...this.selected, w, Math.min(...this.selected) + (w?1:0));
			var i = fromPoint(this.firstChild, x,y), a=Math.min(...this.selected), b=Math.max(...this.selected);
			if (i<=a || i>=b) call(this, 'replace', i, w, i + (i<a || i>b ? 1 : 0)); });
				//we should really separate the case for drag-and-drop-into-self
					//(alternatively, just make the empty-big-replacing-swallows-contentful-small-replacing prefer content over lack of it)
	}, get for() { return this.firstChild ? selected(this.firstChild) : this } });

	[selection, parser].forEach(f => f.alias = f.name);
	[write, parse, parser].forEach(f => self[f.name] = f);
});
*/
});



code({
	name:"basicElements",
	//like a button
});



code({
	name:"layeredGraphDrawing",
});



code({
	name:"collapsedGraphDrawing",
});



code({
	name:"graphSerialization",
});



code({
	name:"web-workers",
/*
init = (stop, workers) => {
	//function exec(f, ...args) { args.forEach(unref); return new Source(then => setTimeout(then, 1000, 'done')) }

	var m = new Map, funcs = [0], tasks = [0], w, F = Function;
	function claim(a, add=true) { for (var o of a) add ? ref.see(o) : unref(o) }
	function add(a,v) { var i; a[0] ? (i=a[0], [a[0], a[i]] = [a[i], v]) : (i=a.length, a.push(v)); return i }  function remove(a,i) { if (typeof a[i]!=='number') a[i]=a[0], a[0]=i }
	function flush(a, i=null) { if (a.length) i!==null ? w[i].postMessage(a) : !w.length ? w.postMessage(a) : w.forEach(w => w.postMessage(a)); a.forEach(unref), a.length=0; m.clear() }
	function start(a, id=null) {
		if (id!=null) tasks[id] && tasks[id].cancel(), tasks[id] = exec(...Array.range(a.length, i => receive(a[i]), true)).then(v => { flush([id, send(v)]), unref(v) });
		else return claim(a), new Source(then => { id=add(tasks, then), flush([id, a.map(send)], random(w.length)), claim(a, false) }, () => flush([id, null])); }
	function global(p, id) { var o=self; for (var k of p) { if (!o[k]) return void flush([id, null]); o=o[k] } return o }
	function register(o,p,qu=[]) {
		if (!p) { Object.values(init.changes).forEach(a => a.forEach(k => !Object.get(self, k) && register(self[k], ['', k], qu))); return flush(qu) }
		if (!o || typeof o!=='object' && typeof o!=='function' || o.id) return;
		if (typeof o==='function' && !o.id) qu.push(-(o.id = add(funcs, o)), p.join('.'));
		for (var k of Object.keys(o)) p.push(k), !Object.get(o, k) && register(o[k], p, qu), p.pop(); }
	function send(o) { if (!o || typeof o==='string') return o; if (m.has(o)) return m.get(o); if (typeof o==='number') return o;
		if (typeof o==='function') return o.id ? -o.id : flush([-(o.id = add(funcs, o)), o.toString()]); else assert(typeof o==='object');
		if (o instanceof Tensor) return [o.finish().data.length===o.sizes.mult ? o.data : o.data.subarray(0, o.sizes.mult), ...o.sizes];
		var cp = Array.isArray(o) ? [] : {}; for (var k of Object.keys(o)) cp[k] = send(o[k]); return cp; }
	function receive(o) { if (!o || typeof o==='string') return o; if (m.has(o)) return m.get(o);
		if (typeof o==='number') return o<0 ? funcs[-o] : o; else assert(typeof o==='object');
		if (Array.isArray(o) && o[0] && o[0] && Object.getPrototypeOf(o[0].constructor) === Object.getPrototypeOf(int8)) return new Tensor(o[0], ...o.slice(1)).with('data', o[0]);
		var cp = ref(Array.isArray(o) ? [] : {}); ref.bytes(8*Object.keys(o).length); for (var k of Object.keys(o)) cp[k] = undefined;
		try { for (var k of Object.keys(o)) cp[k] = receive(o[k]) } catch (err) { unref(cp); throw err } return cp; }
			//(how to transform objects wrapped with wrap(), and probably other likely-hidden-classes, though?)
				//(should we have an invisible slot for object's prototype, or send [wrap, obj]?)
	function message(evt) {
		for (var i=0; i<evt.data.length; i+=2) {
			var id = evt.data[i], v = evt.data[i+1];
			if (id < 0) self.document ? remove(funcs, -id) : (funcs[-id] = typeof v!=='string' ? ref(v) : v[0]!=='.' ? F.from(F.body(v), ...F.args(v)) : global(v.slice(1).split('.'), id));
			else if (self.document) { var f=tasks[id]; remove(tasks, id); f && f(receive(v)); }  else start(v, id); } }
	if (self.document && self.Worker) {
		try { w = Array.range(navigator.hardwareConcurrency, i => new self.Worker('background.js').with('onmessage', message), true) } catch (err) { return }
		stop(() => w.filter(w => void w.terminate()));
		async(register), self.worker = (...a) => start(a);
	} else w=self, onmessage=message;
};
*/
});



code({
	name:"webgl",
/*
init = (stop, webgl) => {
	stop(deinit);
	if (self.document) (function() {
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = 0;
		canvas.addEventListener('webglcontextcreationerror', e => e.statusMessage && console.warn(e.statusMessage), false);
		var gl = canvas.getContext('webgl2', { depth:false, stencil:false, preserveDrawingBuffer:false, failIfMajorPerformanceCaveat:true });
		if (!gl) return;
		if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT).rangeMax < 127) return;
		if (gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT).rangeMax < 16) return;
		if (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).rangeMax < 127) return;
		if (gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT).rangeMax < 16) return;
		canvas.addEventListener('webglcontextlost', e => e.preventDefault(), false);
		canvas.addEventListener('webglcontextrestored', init, false);
		gl.getExtension('EXT_color_buffer_float');
		addEventListener('unload', deinit);
		self.gl = gl; init(); })();
	function deinit() { if (self.gl && !gl.isContextLost()) { var x = gl.getExtension('WEBGL_lose_context');  x && x.loseContext();  self.gl=null } }
	function init() {
		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, gl.createFramebuffer());
		gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, gl.createFramebuffer());
		gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, gl.createTransformFeedback());
		var rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, rb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.R8, 1,1);
		var attr = 0; defineProperty(gl, 'attr', { set(to) {
			assert(to <= gl.max.vertexAttribs); for (var i=to; i<attr; ++i) gl.disableVertexAttribArray(i); for (var i=attr; i<to; ++i) gl.enableVertexAttribArray(i); attr = to; } });
		defineProperty(gl, 'drawTextures', { set(to) {
			assert(to <= gl.max.colorAttachments && to <= gl.max.drawBuffers); gl.drawBuffers(Array.range(to, i => gl.COLOR_ATTACHMENT0+i)); } });
		gl.max = {};
		for (var k of Object.keys(gl.constructor))
			if (k.slice(0,4) === 'MAX_') gl.max[k.slice(4).toLowerCase().replace(/_./g, s => s.slice(1).toUpperCase())] = gl.getParameter(gl[k]);
		gl.info = { renderer: gl.getParameter(gl.RENDERER), vendor: gl.getParameter(gl.VENDOR), version: gl.getParameter(gl.VERSION) };
		var shaders = new Map, programsByVx = new Map, programsByFg = new Map;
		function shader(v, type, outputNames) {
			if (shaders.has(v) && gl.getShaderParameter(shaders.get(v)[0], gl.SHADER_TYPE) === type && (!outputNames || equals(outputNames, shaders.get(v)[2]))) return shaders.get(v);
			if (typeof v === 'function') {
				var vx = type === gl.VERTEX_SHADER, a = Function.args(v);
				if (vx && !outputNames) outputNames = [];
				vx && a.length > gl.max.vertexAttribs && assert(0, 'too many vertex inputs');
				!vx && a.length > gl.max.varyingVectors && assert(0, 'too many fragment inputs');
				var outs=0, str = Function.body(v).replace(/\s+/g, ' ');
				str = str.replace(/Infinity/g, '9e9999');
				str = str.replace(/return (?!\[)/g, () => assert(!outs || outs===1, outs=1) || vx ? (outputNames[0] = outputNames[0] || 'output0')+'=' : 'gl_FragColor=');
				str = str.replace(/return \[(.+)\](?!\))/g, (_,outputs) => {
					outputs = outputs.splitArgs();
					assert(!outs || outs===outputs.length), outs=outputs.length;
					return '{'+outputs.map((o,i) => vx ? (outputNames[i] = outputNames[i] || 'output'+i)+'='+o : 'gl_FragData['+i+']='+o).join(';')+';return;}'; });
				!outs && assert(outs, 'no outputs');
				if (outputNames && outs !== outputNames.length) assert(0, 'vertex shader outputs do not match fragment shader inputs');
				vx && outs > gl.max.transformFeedbackSeparateAttribs && assert(0, 'too many vertex outputs');
				!vx && outs > gl.max.drawBuffers && assert(0, 'too many fragment outputs');
				str = str.replace(/Tensor\.from\(\[(.+)\]\)/g, (_,from) => { var p = from.splitArgs(); assert(p.length>1 && p.length<=4); return 'vec'+p.length+'('+from+')' });
				str = str.replace(/Math\./g, '').replace(/var /g, 'float ').replace(/let /g, 'float ');
				if (vx) str = 'precision highp float;' + a.map(a => 'attribute float '+a).join(';') + ';' +
						Array.range(outs, i => 'varying float ' + (outputNames[i] || 'output'+i)).join(';') + ';void main(void){' + str + ';}';
				else r = 'precision highp float;' + a.map(a => 'varying float '+a).join(';') + ';void main(void){' + str + ';}';
			} else var str = v != null ? v : 'void main(void){}';
			assert(typeof str === 'string');
			if (shaders.has(str) && gl.getShaderParameter(shaders.get(str)[0], gl.SHADER_TYPE) === type) return shaders.get(str);
			var s = gl.createShader(type);
			gl.shaderSource(s, str);
			gl.compileShader(s);
			var info = gl.getShaderInfoLog(s);
			if (info.length) return gl.deleteShader(s), assert(false, str, ':', info);
			s = [s, a, !outputNames ? outs || 0 : outputNames];
			return shaders.set(v,s), s; }
		class Program {
			constructor(p, attributes, varyings, colors) { this.p = p, this.attributes = attributes, this.varyings = varyings, this.colors = colors }
			use() { gl.useProgram(this.p); if (!this.colors) gl.framebufferRenderbuffer(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rb) } }
		gl.program = (vx=null, fg=null) => {
			if (programsByVx.has(vx)) for (var a = programsByVx.get(vx), i = 0; i < a.length; i += 2) if (a[i] === fg) return a[i+1];
			if (programsByFg.has(fg)) for (var a = programsByFg.get(fg), i = 0; i < a.length; i += 2) if (a[i] === vx) return a[i+1];
			try {
				var p = gl.createProgram(), f = shader(fg, gl.FRAGMENT_SHADER), v = shader(vx, gl.VERTEX_SHADER, f[1]);
				gl.attachShader(p,v[0]), gl.attachShader(p,f[0]);
				gl.transformFeedbackVaryings(p, v[2], gl.SEPARATE_ATTRIBS);
				gl.linkProgram(p);
				var info = gl.getProgramInfoLog(p);
				assert(!info.length, info);
				p = new Program(p, v[1], v[2], f[2]);
				if (!programsByVx.has(vx)) programsByVx.set(vx, [fg, p]); else programsByVx.get(vx).push(fg, p);
				if (!programsByFg.has(fg)) programsByFg.set(fg, [vx, p]); else programsByFg.get(fg).push(vx, p);
				return p;
			} catch (err) { console.error(err); gl.deleteProgram(p), f && gl.deleteShader(f[0]), v && gl.deleteShader(v[0]); throw err }
		}; }
};
*/
});



code({
	name:"tensorsAndOperations",
/*
//should have GPU operations be separate, allowing CPU-on-fail to not create objects if it doesn't need to.
init = tensor => {
	var sizes = {};
	class Tensor {
		constructor(type=float32, ...sz) { this.type=type, this.sizes=Tensor.sizes(...sz), this.data=null; this.buffer=null, this.texture=null; return ref(this) }
		get size() { return !this.sizes.length ? 0 : 64 + (this.data && !Array.isArray(this.data) ? 0 : this.type.size * this.sizes.mult) }
		set size(to) { if (Array.isArray(this.sizes) && !this.sizes.length) console.error('invalid unref-d tensor\'s sizes:', this.sizes.join('×'));
			assert(!to); Array.isArray(this.data) ? unref(this.data) : ref.realloc(this.data,0); this.type=null; this.sizes=unref(this.sizes)&&null; this.data=null }
		get compact() { return !this.data || !Array.isArray(this.data) || this.data.length!==this.sizes.mult } set compact(t) { this.finish() }
		static sizes(...sz) {
			if (!sz.length) sz.push(1);  isNaN(sz.mult) && assert(0, 'invalid tensor sizes:', ...sz);
			var m = sizes[sz.mult], a, b = false;
			if (m) for (var a of m) if (b = b || !ref.of(s), equals(a,sz)) break;  b && m.filter(ref.of);
			if (!equals(a, sz)) (m || (sizes[sz.mult] = [])).push(a = sz);  return a; }

		static sizesOf(arr, out = [], depth = 0) {
			for (var i = 0; i < arr.length; ++i)
				if (Array.isArray(arr[i])) { if (Tensor.sizesOf(arr[i], out, depth+1) == null) return null; }
				else if (typeof arr[i] !== 'number') return null;
			if (!out[depth] && i || i > out[depth]) out[depth] = i;
			return out; }
		static from(arr, sizes = undefined, type = float32) {
			if (arr == null) return undefined;
			if (typeof arr==='string' || arr.byteLength!==undefined) return arr = utf8.from(arr), new Tensor(uint8, arr.byteLength || arr.length).with('data', arr);
			if (sizes===undefined) sizes = Tensor.sizesOf(arr);
			var o = new Tensor(type, ...sizes).finish(true), d = o.data;
			return function assign(v, depth, begin, end) {
				if (begin >= end-1) return d[begin] = type.set(v);
				var size = (end-begin) / sizes[depth];
				for (var i = 0; i < sizes[depth]; ++i)
					assign(!Array.isArray(v) ? v : i>=v.length ? v.last : v[i], depth+1, begin + i*size, begin + i*size + size);
			}(arr, 0, 0, sizes.mult), o; }

		get imageData() { return new self.ImageData(fillImageData(this.finish(), this.data, new Uint8ClampedArray(this.data.length)), this.sizes[1], this.sizes[0]) }
		set imageData(to) { !equals(this.sizes, [to.height, to.width]) && assert(0, 'image width/height are different');  fillImageData(this.finish(true), to.data, this.data) }

		equals(t) { if (this.type !== t.type || !equals(this.sizes, t.sizes)) return false; this.finish(), t.finish();
			for (var len = t.sizes.mult, i = 0; i < len; ++i) if (!Object.is(this.data[i], t.data[i])) return false; return true }

		valueOf() { this.sizes.mult!==1 && assert(0, 'expected a single number, got a tensor sized', this.sizes.join('×')); this.finish(); return this.type.get(this.data[0]) }
		replaceWith(t) {
			if (t === this) return unref(t);
			this.size=0, this.type=t.type, this.sizes=t.sizes, this.data=t.data, this.buffer=t.buffer, this.texture=t.texture;
			t.type=null, t.sizes=null, t.data=null, t.buffer=null, t.texture=null, unref(t);  return this; }
		get copy() {
			this.finish();
			var t = new Tensor(this.type, ...this.sizes);
			if (this.data && !Array.isArray(this.data)) t.finish(true), t.data.set(this.data.subarray(0, t.sizes.mult));
			if (this.buffer)
				!this.data && this.finish(), bufferBind(this), bufferBind(t, gl.COPY_WRITE_BUFFER),
				gl.copyBufferSubData(gl.ARRAY_BUFFER, gl.COPY_WRITE_BUFFER, 0, 0, this.type.size*this.sizes.mult);
			return t; }
		slice(i, into=null) {
			if (!this.data) console.error(this.data);
			if (this.sizes.length <= 1) return this.data[i];
			if (into == null) into = new Tensor(this.type, ...this.sizes.slice(1)).finish(true);
			into.data.set(this.data.subarray(i * this.sizes.mult/this.sizes[0], (i+1) * this.sizes.mult/this.sizes[0]));
			return into; }
		unslice(i,s) {
			assert(i < this.sizes[0]);
			if (this.sizes.length <= 1) assert(typeof s === 'number'), this.data[i] = s;
			else assert(equals(this.sizes.slice(1), s.sizes)), this.data.set(s.data, i*s.sizes.mult); }

		extend(to) {
			if (this.sizes.length !== 1) assert(0, 'can only extend strings (vectors, one-dimensional tensors):', this.sizes.join('×'));
			if (!(to >= 0)) assert(0, 'invalid size to extend to:', to);
			if (!this.data || Array.isArray(this.data)) this.finish(true);
			if (this.sizes[0] >= to) return this;
			if (this.data.byteLength < to * this.type.size) {
				var pow2 = Math.pow(2, Math.ceil(Math.log2(to * this.type.size)));
				if (this.data = ref.realloc(this.data, pow2/this.type.size), this.data.byteLength !== pow2)
					if (ref.realloc(this.data, to), this.data.byteLength !== to * this.type.size)
						assert(0, 'out of memory to resize a tensor', this.data.byteLength, to * this.type.size); }
			if (this.data.byteLength !== to * this.type.size) ref.compact(this);
			var a = this.sizes.slice(1);  unref(this.sizes); this.sizes = Tensor.sizes(to, ...a);
			return this; }

		static operation(name, ...args) {
			if (!(name in cpu)) assert(0, 'no such operation:', name);
			if (name in gpu) {
				try { var output = gpu[name](undefined, ...args); } catch (err) {}
				if (!output) return cpu[name](undefined, ...args);
				var op = [cpu[name], output, ...args.map(a => ref(a))];
				if (Array.isArray(output)) for (var o of output) unref(o.data), o.data = ref(op);
				else unref(output.data), output.data = ref(op);
				return output;
			} else return cpu[name](undefined, ...args); }

		finish(willWrite = false) {
			var op = Array.isArray(this.data) && this.data;
			if (!this.data || Array.isArray(this.data)) ref.bytes(-this.type.size * this.sizes.mult);
			this.data = ref.realloc(!this.data || Array.isArray(this.data) ? this.type : this.data, this.sizes.mult);
			if (!self.gl || gl.isContextLost() || willWrite)
				self.gl && gl.deleteBuffer(this.buffer), self.gl && gl.deleteTexture(this.texture), this.buffer = this.texture = null;
			if (!op) return this;
			if (this.buffer != null && !willWrite) {
				assert(bufferBind(this));
				gl.getBufferSubData(gl.ARRAY_BUFFER, 0, this.data);
				if (gl.isContextLost()) Any.calc(op);
			} else if (this.texture != null && !willWrite) {
				assert(textureBind(this));
				textureSetAt(this,0), gl.readBuffer(gl.COLOR_ATTACHMENT0);
				gl.readPixels(0, 0, this.sizes[1], this.sizes[0], gl.RGBA, this.type.gl, this.data);
				if (gl.isContextLost()) Any.calc(op);
			} else Any.calc(op);
			return op[1] = undefined, unref(op), this; }
	}

	function bufferBind(t, as = gl.ARRAY_BUFFER, usage = gl.STATIC_READ) {
		if (!t.type.gl) return false;
		if (t.buffer == null)
			try {
				Array.isArray(t.data) && t.finish(), gl.bindBuffer(as, t.buffer = gl.createBuffer());
				t.data ? gl.bufferData(as, t.data, usage, 0, t.sizes.mult) : gl.bufferData(as, t.sizes.mult*t.type.size, usage);
			} catch (err) { return false }
		else gl.bindBuffer(as, t.buffer);
		return !gl.isContextLost(); }
	function bufferGetAt(t,i, offset=0) { gl.vertexAttribPointer(i, t.sizes.length === 1 ? 1 : t.sizes.mult/t.sizes[0], t.type.gl, false, 0, offset) }
	function bufferSetAt(t,i) { gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, t.buffer) }
	function textureBind(t, as = gl.TEXTURE_2D) {
		var sz = t.sizes;
		if (t.type !== float32 && t.type !== uint8 || sz.length !== 3 || sz[2] !== 4) return false;
		var f = t.type === float32;
		if (t.texture == null)
			try {
				Array.isArray(t.data) && t.finish(), gl.bindTexture(as, t.texture = gl.createTexture());
				gl.texImage2D(as, 0, f ? gl.RGBA32F : gl.RGBA8UI, sz[1], sz[0], 0, f ? gl.RGBA : gl.RGBA_INTEGER, t.type.gl, t.data || undefined);
			} catch (err) { return false }
		else gl.bindTexture(as, t.texture);
		return !gl.isContextLost(); }
	function textureGetAt(t,i) { gl.framebufferTexture2D(gl.READ_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.texture, 0) }
	function textureSetAt(t,i) { gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.TEXTURE_2D, t.texture, 0) }
	function ready(fb = gl.READ_FRAMEBUFFER) { return gl.checkFramebufferStatus(fb) === gl.FRAMEBUFFER_COMPLETE }
	function fillImageData(t, src, dst) {
		if (!(t.sizes.length === 3 && t.sizes[2] === 4)) assert(0, 'tensor is not image-sized (height,width,4):', t.sizes.join('×'));
		var mult = t.type===float32 || t.type===float64 ? 255 : 255/t.type.max;  dst===t.data && (mult = 1/mult);
		for (var i = 0; i < dst.length; ++i) dst[i] = mult * src[i];  return dst }

	var cpu = {
		random(o, t) {
			if (!o) o = ref.of(t)===1 ? ref(t).finish(true) : new Tensor(t.type, ...t.sizes).finish(true);
			return random.fill(o.data), o;
		},

		sort(o, t, f=null) {
			if (!o) o = ref.of(t)===1 ? ref(t).finish(true) : t.finish().copy;
			if (o.sizes.length > 1) {
				var s1, s2; if (!f) assert(0, 'a non-trivial sort requires a comparison function');
				var order = Array.range(o.sizes[0]);
				order.sort((i,j) => f(s1 = t.slice(i,s1), s2 = t.slice(j,s2)));
				unref(s2);
				for (var len = s1.sizes.mult, i = 0; i < order.length; ++i)
					while (i !== order[i]) {
						s1 = t.slice(order[order[i]],s1);
						t.data.copyWithin(order[order[i]]*len, order[i]*len, (order[i]+1)*len);
						t.data.set(s1.data, order[i]*len);
						order.swap(i,order[i]); }
				unref(s1);
			} else o.data.sort(f || ((a,b) => a-b));
			return o;
		},

		map(o, input, f) {
			assert(!o || Array.isArray(o));
			if (input instanceof Tensor) input = [input];
			assert(Array.isArray(input));
			for (var i = 0; i < input.length; ++i) assert(input[i].sizes[0] === input[0].sizes[0]), input[i].finish();
			var si = new Array(input.length), so;
			try {
				for (var i = 0; i < input[0].sizes[0]; ++i) {
					for (var j = 0; j < input.length; ++j) si[j] = input[j].slice(i, si[j]);
					if (Array.isArray(so) && !ref.of(so)) so.forEach(unref);
					unref(so); so = f(...si, so);
					if (!o) o = new Array(Array.isArray(so) ? so.length : 1); else assert(o.length === (Array.isArray(so) ? so.length : 1));
					for (var j = 0; j < o.length; ++j) {
						if (!o[j]) {
							var sz = Array.isArray(so) && so[j] instanceof Tensor ? [input[0].sizes[0], ...so[j].sizes] : [input[0].sizes[0]];
							for (var k = 0; k < input.length; ++k) if (ref.of(input[k]) === 1 && equals(input[k].sizes, sz)) break;
							o[j] = k < input.length ? ref(input[k].finish(true)) : new Tensor(float32, ...sz).finish(true); }
						o[j].unslice(i, Array.isArray(so) ? so[j] : so); } }
			} catch (err) { o && o.map(unref); throw err }
			return o.length !== 1 ? ref(o) : o[0];
		},

		reduce(o, t, f=null) {
			try {
				if (!o) o = new Tensor(float32);
				t.finish(), o.finish(true);
				for (var s1, r = t.slice(0), i = 1; i < t.sizes[0]; ++i) r = f(s1 = t.slice(i,s1), r);
				s1=unref(s1), o.unslice(0,r), r=unref(r);
				return o;
			} catch (err) { o=unref(o), s1=unref(s1), r=unref(r); throw err }
		},

		//rasterize, reverse; maybe get/set (though those could be emulated with slice+combine)

		//slice ([n, ...], i) -> [...]
		//expand [...] -> [1, ...]
		//combine ([a, ...], [b, ...], ) -> [a+b+, ...]
	};
	var gpu = {
		map(o, input, f) {
			if (input instanceof Tensor) input = [input];
			assert(Array.isArray(input));
			for (var i = 0; i < input.length; ++i) assert(input[i].sizes[0] === input[0].sizes[0]);
			var p = gl.program(f, null); p.use();
			gl.attr = input.length;
			for (var i = 0; i < input.length; ++i) {
				if (input[i].sizes.length > 2 || input[i].sizes[1] > 4) return false;
				if (!bufferBind(input[i])) return false;
				bufferGetAt(input[i],i); }
			if (!o) o = Array.range(p.varyings.length, i => new Tensor(float32, input[0].sizes[0]));
			for (var i = 0; i < o.length; ++i) { if (!bufferBind(o[i], gl.TRANSFORM_FEEDBACK_BUFFER, gl.DYNAMIC_DRAW)) return false;  bufferSetAt(o[i],i) }
			gl.beginTransformFeedback(gl.POINTS);
			gl.drawArrays(gl.POINTS, 0, input[0].sizes[0]);
			gl.endTransformFeedback();
			for (var i = 0; i < o.length; ++i) gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, i, null);
			return o.length !== 1 ? ref(o) : o[0];
		},

		reduce(o, t, f) {
			try {
				var p = gl.program(f, null); assert(p.attributes.length===2 && p.varyings.length===1); p.use();
				gl.attr = 2;
				if (t.type !== float32) return false;
				if (t.sizes.length > 2 || t.sizes[1] > 4 || !bufferBind(t)) return false;
				if (!o) o = new Tensor(float32);
				for (var n = t.sizes[0], r, elemSize = o.type.size * t.sizes.mult/t.sizes[0], bufs=[], inds = []; n > 1; n = half) {
					var half = n>>>1;
					bufferGetAt(t,0, 0), bufferGetAt(t,1, half*elemSize);
					gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, r = gl.createBuffer());
					gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, half*elemSize, n>1 || inds.length ? gl.STREAM_COPY : gl.DYNAMIC_READ);
					gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, r);
					gl.beginTransformFeedback(gl.POINTS);
					gl.drawArrays(gl.POINTS, 0, half);
					gl.endTransformFeedback();
					gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
					if (n%2) bufs.push(o.buffer), inds.push(n-1);
					gl.bindBuffer(gl.ARRAY_BUFFER, o.buffer = r); }
				for (var i = 0; i < bufs.length; ++i) {
					bufferGetAt(t,0, 0), gl.bindBuffer(gl.ARRAY_BUFFER, bufs[i]), bufferGetAt(t,1, inds[i]*elemSize);
					gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, r = gl.createBuffer());
					gl.bufferData(gl.TRANSFORM_FEEDBACK_BUFFER, elemSize, i < bufs.length-1 ? gl.STREAM_COPY : gl.DYNAMIC_READ);
					gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, r);
					gl.beginTransformFeedback(gl.POINTS);
					gl.drawArrays(gl.POINTS, 0, 1);
					gl.endTransformFeedback();
					gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
					gl.bindBuffer(gl.ARRAY_BUFFER, o.buffer = r); }
				return o;
			} catch (err) { console.error(err); unref(o); throw err }
		},
	};
	Tensor[Symbol.toStringTag] = 'Tensor', Tensor.operations = [];
	for (let k of Object.keys(cpu)) {
		Tensor.operations.push(Tensor[k] = Tensor.operation.bind(null, k).with('alias', k));
		Tensor.prototype[k] = function(...args) { var old = this, o = Tensor.operation(k, this, ...args); unref(old); return o }; }
	self.Tensor = Tensor;
};
*/
});



code({
	name:"basicMathFunctions",
/*
init = (stop, _math) => {
	var math = self.math = function(str, ...args) {}; //str is like "(a,b,c) => a + b*Math.sqrt(c)"
	function f(o) {
		for (var k of Object.keys(o)) {
			math[k] = o[k].calc;
			//should probably also have o[k].alt, for math[k] to try if an exception occurs
				//(and probably be able to handle o[k].calc being smth like ['mult', 'x', 'x'])
			math[k].reverse = typeof o[k].reverse === 'string' ? o[o[k].reverse] : o[k].reverse; } }
	function add(a, begin = 0, end = a.length) {
		if (end-begin > 64) return add(a, begin, (begin+end)>>1) + add(a, (begin+end)>>1, end);
		for (var s = 0, i = begin; i < end; ++i) s += a[i];
		return s; }
	function mult() {
		if (end-begin > 64) return mult(a, begin, (begin+end)>>1) * mult(a, (begin+end)>>1, end);
		for (var s = 1, i = begin; i < end; ++i) s *= a[i];
		return s; }
	f({
		add: { calc:(...a) => add(a), reverse:(i, ...a) => 2*a[i]-add(a), change:1, },
			//what does reverse mean here?
		mult: { calc:(...a) => mult(a), reverse:(i, ...a) => a[i]*a[i]/mult(a), change:['mult', 'o', ['reciprocal', 'x']], },
		identity: { calc: a=>a, reverse:'identity', change:1, },
		negate: { calc: a=>-a, reverse:'negate', change:-1, },
		floor: { calc: a=>Math.floor(a), reverse: o=>o+random(), change:1, },
		ceil:  { calc: a=>Math.ceil(a),  reverse: o=>o-random(), change:1, },
		round: { calc: a=>Math.round(a), reverse: o=>o+random()-.5, change:1, },
		sign: { calc: a=>Math.sign(a), reverse: o=>o, change:0, },
		abs: { calc: a=>Math.abs(a), reverse: a => random(2) ? -a : a, change:['sign', 'x'] },
		sqr: { calc: a=>a*a, reverse:'sqrt', change:['add', 'x', 'x'], },
		sqrt: { calc: a=>Math.sqrt(a), reverse:'sqr', change:['reciprocal', ['add', 'o', 'o']], },
		exp: { calc: a=>Math.exp(a), reverse:'log', change:'o', },
		log: { calc: a=>Math.log(a), reverse:'exp', change:['reciprocal', 'x'] },
		reciprocal: { calc: a=>1/a, reverse:'reciprocal', change:['negate', ['reciprocal', ['sqr', 'o']]], },
		cos: { calc: a=>Math.cos(a), reverse:'acos', change:['negate', ['sin', 'x']], },
		sin: { calc: a=>Math.sin(a), reverse:'asin', change:['cos', 'x'], },
		tan: { calc: a=>Math.tan(a), reverse:'atan', change:['add', 1, ['sqr', 'o']], },
		acos: { calc: a=>Math.acos(a), reverse:'cos', change:['negate', ['reciprocal', ['sqrt', ['add', 1, ['negate', ['sqr', 'x']]]]]], },
		asin: { calc: a=>Math.asin(a), reverse:'sin', change:['reciprocal', ['sqrt', ['add', 1, ['negate', ['sqr', 'x']]]]] },
		atan: { calc: a=>Math.atan(a), reverse:'tan', change:['reciprocal', ['add', 1, ['sqr', 'x']]], },
		cosh: { calc: a=>Math.cosh(a), reverse:'acosh', change:['sinh', 'x'], },
		sinh: { calc: a=>Math.sinh(a), reverse:'asinh', change:['cosh', 'x'], },
		tanh: { calc: a=>Math.tanh(a), reverse:'atanh', change:['add', 1, ['negate', ['sqr', 'o']]], },
		acosh: { calc: a=>Math.acosh(a), reverse:'cosh', change:['reciprocal', ['sqrt', ['add', -1, ['sqr', 'x']]]], },
		asinh: { calc: a=>Math.asinh(a), reverse:'sinh', change:['reciprocal', ['sqrt', ['add', 1, ['sqr', 'x']]]], },
		atanh: { calc: a=>Math.atanh(a), reverse:'tanh', change:['reciprocal', ['add', 1, ['negate', ['sqr', 'x']]]], },
		min: { calc: (...a)=>a.min, reverse: (i, ...a) => a[i] + random()*(a.max-a[i]), change:['add', 1, ['sign', ['add', 'x', ['negate', 'o']]]], },
		max: { calc: (...a)=>a.max, reverse: (i, ...a) => a[i] + random()*(a.min-a[i]), change:['add', 1, ['sign', ['add', 'o', ['negate', 'x']]]], },
		hypot: { calc: (...a)=>Math.hypot(...a), reverse: (i, ...a) => a[i]*(a[i]+1)-a.sum, change:['mult', 'x', ['reciprocal', 'o']], },
		pow: { calc: (a,b)=>Math.pow(a,b), reverse: (i,a,b) => i === 0 ? pow(a, 1/b) : log(a)/log(b), change: (o,x,i) => o * (i === 0 ? Math.log(o)/Math.log(x)/x : Math.log(x)) },
	});
};
*/
});



code({
	name:"interpretAndChange",
});



code({
	name:"cryptography/encryption",
});



code({
	name:"compression",
});


'use strict';(function init(self){
	var f = self.Object.freeze;
	var Object = self.Object, Array = self.Array, Number = self.Number, Set = self.Set, Function = self.Function, Error = self.Error, Date = self.Date, process = self.process, performance = self.performance, setTimeout = self.setTimeout, console = self.console, document = self.document;
	var setInterval = self.setInterval, clearInterval = self.clearInterval;

	var name = /[$_a-zA-Z][$\w]*/y, varDecl = /\bvar\b/y;
	var inc = /[\(\[\{]/y, dec = /[\)\]\}]/y;
	var skip = /'(?:[^\\']|\\.)*?'|"(?:[^\\"]|\\.)*?"|\/(?![/*])(?:[^/\\[]|\\.|\[(?:[^\]\\]|\\.)*?\])*?\/(?=(?:[gimuy])*\s*[\.\,\;\)\}\]])/y;
	var comments = /\/\/(.*)|\/\*((?:[^])*?)\*\//y, ws = /\s+/y;
	var extraSeparator = /(?:;(?!\))|,(?!\]))([\]\}\)])/y;
	var keywords = new Set('await break case catch class const continue debugger default delete do else enum export extends false finally for function if implements import in instanceof interface let new null package private protected public return static super switch this throw true try typeof var void while with yield'.split(' '));
	var globals = new Set(typeof global!=''+void 0 ? Object.values(global) : []);
	var find = (function(s,i, inc, dec, ...r) {
		search: for (var depth = 0; i < s.length; ++i) {
			for (var j=0; j < r.length - (depth ? 1 : 0); ++j)
				if (r[j].lastIndex = i, r[j].test(s)) {
					if (j === r.length-1) return i;
					if (r[j].lastIndex > i) i = r[j].lastIndex-1;
					continue search;
				}
			if (inc && (inc.lastIndex = i, inc.test(s)))
				++depth, i = inc.lastIndex-1;
			else if (dec && (dec.lastIndex = i, dec.test(s)))
				--depth, i = dec.lastIndex-1;
		}
		r[r.length-1].lastIndex = i;
		return i;
	});
	var str = (function(s) {
		var body = find(s,0, inc,dec, skip, /\{|=>/y);
		if (find(s, body, null,null, skip, /\[native code\]/y) < s.length) return null;
		if (s[body] === '=') {
			var head = s.slice(0,body);  if (s[0] !== '(') head = '('+head+')';
			var body = s.slice(body+2).trim();  if (body[0] !== '{') body = '{return '+body+'}';
			return 'function self' + head + body;
		} else return 'function self' + s.slice(s.indexOf('('));
	});
	var vars = (function(s) {
		var body = find(s,0, inc,dec, skip, /\{/y);
		find(s, body, null,null, skip, varDecl);
		var i = varDecl.lastIndex, r = new Set;
		while (i < s.length) {
			if (s[i] === '[' || s[i] === '{')
				c.err('destructuring var declarations are forbidden');
			i = find(s, i, inc,dec, skip, name);
			if (i >= s.length) break;
			r.add(s.slice(i, name.lastIndex));
			if (s.slice(i, name.lastIndex) === 'self') c.err('invalid var: self');
			i = find(s, name.lastIndex, inc,dec, skip, /,|;|\}|\)|\sin|\sof/y);
			if (s[i++] !== ',') find(s, i, null,null, skip, varDecl), i = varDecl.lastIndex;
		}
		replace(s, /}catch\((.*)\){/y, a => {
			if (a[1] in self) c.err('catch error name shadows a global var: '+a[1]);
			r.add(a[1]);
		});
		return r;
	});
	var args = (function(s) {
		var body = find(s,0, inc,dec, skip, /\{/y);
		var i = find(s, s.indexOf('(')+1, null,null, name), r = new Set;
		while (i < body) {
			r.add(s.slice(i, name.lastIndex));
			if (s.slice(i, name.lastIndex) === 'self') c.err('invalid arg name: self');
			i = find(s, name.lastIndex, inc,dec, skip, /,|\)|\{/y);
			if (s[i] === ',') i = find(s,i, null,null, name); else break;
		}
		return r;
	});
	var assignment = /=[^=>]|[^<>!=\)\}\]]=|\*\*=|<<=|>>=|>>>=|--|\+\+/y;
	var refs = (function(s) {
		var j = 0;
		var s1 = vars(s) || new Set, s2 = args(s);
		for (var r = new Set, i; (i=find(s, j, null,null, skip, name)) < s.length; ) {
			j = name.lastIndex;
			if (s[i-1] === '.' || s[j] === ':') continue;
			var ref = s.slice(i,j);
			if (keywords.has(ref) || s1.has(ref) || s2.has(ref)) continue;
			if (s.slice(i-6, i) === 'break ' || s.slice(i-9, i) === 'continue ') continue;
			r.add(ref), assignment.lastIndex = 0;
			if (s[j] === '.' || s[j] === '[') continue;
			if (assignment.test(s.slice(j,j+4)) || s.slice(i-2,i)==='--' || s.slice(i-2,i)==='++')
				c.err('writing to refs is forbidden ('+ref+'), make them objects and write to their properties instead: …'+s.slice(i-10)+"\n  (was it because of invalid regex+comments? remove comments after any divisions)\n  (was it because of 'var f=()=>{var p=1}'? declare 'var p' outside the var)");
		}
		return r;
	});
	var func = (f => globals.has(f) ? null : typeof f==='function' ? f : f&&f.call?f.call:null);
	var replace = (function(s, from, to) {
		var j = 0, i, a = [];
		while ((i = find(s, j, null,null, skip, from)) < s.length) {
			var r = typeof to==='function' ? (from.lastIndex = i, to(from.exec(s), s)) : to;
			r ? a.push(s.slice(j,i), r) : a.push(s.slice(j,i));
			j = from.lastIndex;
		}
		return a.push(s.slice(j)), a.join('');
	});
	var minify = (function(s, should) {
		s = replace(s, comments, a => (should && should.push(a[1] || a[2] || ''), ' '));
		s = replace(s, ws, a => {
			var i = a.index, j = ws.lastIndex, noSpace = '@*%?:;!~^&|=,.<>(){}[]\'"`/';
			if (noSpace.includes(s[i-1]) || noSpace.includes(s[j])) return;
			if ((s[i-1] === '+') !== (s[j] === '+')) return;
			if ((s[i-1] === '-') !== (s[j] === '-')) return;
			return ' ';
		});
		return s = replace(s, extraSeparator, a => a[1]);
	});
	var forbidden = /[^$_a-zA-Z0-9\s\+\-\*%\?:;\!~\^&\|=,\.<>\(\)\{\}\[\]'"\/]+|\b(?:function|let|const|debugger|with|import|export|yield|await|code\.at|code\.enter|code\.leave|$[0-9]+|!==|===)\b/y;
	var looseEquals = /[!=]==?/y, strictEquals = /[!=]==/y;
	var branchers = /\b(?:for|do|while|if|else|catch)\b/y, statementEnd = /;|\{|\}/y;
	var decorate = (s => {
		var i=0;
		while ((i = find(s, i+1, null,null, skip, forbidden)) < s.length)
			if (s[i-1] !== '.' && s[forbidden.lastIndex] !== ':')
				c.err('found forbidden '+quote(s.slice(i,forbidden.lastIndex))+' in '+s);
		s = replace(s, looseEquals, a => a[0].length<3 ? a[0]+'=' : a[0]), i=0;
		var a=[], i, j=0, I=0;
		while ((i = find(s, j, null,null, skip, branchers)) < s.length)
			if (s[i-1] !== '.' && s[branchers.lastIndex] !== ':') {
				var b = s.slice(i,i+4)==='case' || s.slice(i,i+7)==='default';
				var post = find(s, branchers.lastIndex, inc,dec, skip, b ? /:/y : /[^\(]/y);
				if (s[post] === ' ') ++post;
				if (s[post] === '{' || b)
					a.push(s.slice(j, j = post+1), 'code.at(self,', ''+I++, ');');
				else if (s[post] === ';' || s[post] === '}')
					a.push(s.slice(j, j = post), '{code.at(self,', ''+I++, ')}');
				else if (s.slice(post,post+3)==='if(')
					a.push(s.slice(j, j = post+3), 'code.at(self,', ''+I++, '),');
				else if (s.slice(post,post+7)==='return;' || s.slice(post,post+7)==='return}')
					a.push(s.slice(j, j = post+6), ' void code.at(self,', ''+I++, ');');
				else if (/return\b/y.test(s.slice(post,post+7)))
					a.push(s.slice(j, j = post+7), 'code.at(self,', ''+I++, '),');
				else if (s.slice(post,post+6)==='throw ')
					a.push(s.slice(j, j = post+6), 'code.at(self,', ''+I++, '),');
				else if (!/(?:for|while|do|var|try|continue|break)\b/y.test(s.slice(post,post+9)))
					a.push(s.slice(j, j = post)),
					s.slice(post-4,post) == 'else' && a.push(' '),
					a.push('code.at(self,', ''+I++, '),');
				else if (/continue\b|break\b/y.test(s.slice(post,post+9)))
					a.push(s.slice(j, j = post), '{code.at(self,', ''+I++, ');'),
					a.push(s.slice(j, j = find(s, j, null,null, /;|\}/y)), '}');
				else a.push(s.slice(j, j = post));
				s[j]===';' && ++j;
			} else a.push(s.slice(j, j = branchers.lastIndex));
		a.push(s.slice(j));
		s = a.join(''), a.length=0;
		var body = find(s,0, inc,dec, skip, /\{/y)+1;
		return s.slice(0,body) + 'try{code.enter(self);' + s.slice(body,-1) + '}finally{code.leave(self)}}';
	});
	decorate.refs = f({self, find, skip, forbidden, quote, replace, looseEquals, inc, dec, branchers});
	var branches = (s => {
		var j=0, i, pos=[];
		while ((i = find(s, j, null,null, skip, branchers)) < s.length)
			if (s[i-1] !== '.' && s[branchers.lastIndex] !== ':') {
				var b = s.slice(i,i+4)==='case' || s.slice(i,i+7)==='default';
				var post = find(s, branchers.lastIndex, inc,dec, skip, b ? /:/y : /[^\(]/y);
				if (s[post] === ' ') ++post;
				if (b || s[post] === ';' || s[post] === '{' || s[post] === '}')
					pos.push(j = post+1);
				else if (!/(?:for|while|do|var|try|continue|break)\b/y.test(s.slice(post,post+9)))
					pos.push(j = post), ++j;
				else if (/continue\b|break\b/y.test(s.slice(post,post+9)))
					pos.push(j = post), j = find(s, j, null,null, /;|\}/y);
			} else j = branchers.lastIndex;
		return pos;
	});
	branches.refs = f({find, skip, branchers, inc, dec});
	var undecorate = (s => {
		s = replace(s, strictEquals, a => a[0].slice(0,2));
		s = replace(s, /return void code\.at\(self,[0-9]+\)/y, 'return');
		s = replace(s, /\bcode\.at\(self,[0-9]+\)[,;]/y, '');
		s = replace(s, /\{code\.at\(self,[0-9]+\)\}/y, ';');
		var body = find(s,0, inc,dec, skip, /\{/y)+1;
		if (s.slice(body, body+21) === 'try{code.enter(self);')
			if (s.slice(-27) === '}finally{code.leave(self)}}')
				s = s.slice(0,body) + s.slice(body+21, -27) + '}';
		return s;
	});
	undecorate.refs = f({replace, strictEquals, find, inc, dec, skip});
	var quote = (s => "'"+s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')+"'");
	var expandable = (v => v && typeof v==='object' &&
		(Array.isArray(v) || Object.prototype === Object.getPrototypeOf(v)));
	var accessor = ((path, k) => {
		if (name.lastIndex = 0, name.test(k)) return path + k;
		else return path.slice(0,-1)+'['+(Number.isInteger(+k) && +k>=0 ? k : quote(k))+']';
	});
	accessor.refs = f({name, quote, Number});

	var define = (function(a, o, at, path, canMerge = true) {
		for (var k in at) if (owns.call(at, k)) {
			if (path != 'self.' && k === 'call') continue;
			var v = at[k], f = func(v), next = accessor(path, k);
			if (f) var s = str(''+f);
			if (!s) f = null;
			if (a.undo && canMerge && path.slice(0,5) === 'self.') {
				var as = '$' + a.index++;
				a.vars.push(as);
				a.push(as, '=', next, ';');
				a.undo.unshift(as, '===void 0?delete ', next, ':', next, '=', as, ';');
			}
			if (f) {
				var should = v.should || [], s = minify(s, should), b = 0;
				var r = refs(s), s = decorate(s);
				if (should.length && !v.should) v.should = should;
				a.push(next, '=(', s, ');');
				if (v.refs) c.err(".refs should not be set manually on function objects:", v.refs);
				a.refs.push(next, '.refs=$0({');
				for (r of r) {
					b && a.refs.push(','), b = 1;
					if (name.lastIndex = 0, name.test(r) || Number.isInteger(+r)&&+r>=0)
						a.refs.push(r);
					else a.refs.push('[', quote(r), ']');
					if (r === 'self') a.refs.push(':', next);
					else if (a[a.length-1]===']') a.refs.push(':', quote(r));
					else if (r in o) !func(o[r]) && !expandable(o[r]) && (a.args[r] = o[r]);
					else if (self[r] !== void 0) a.args[r] = self[r];
					else !(r in args) && a.refs.push(':', quote(r));
				}
				a.refs.push('});');
			} else if (v === void 0) {
				a.push('delete ', next, ';');
			} else if (typeof v === 'number' || typeof v === 'boolean' || v === null) {
				a.push(next, '=', ''+v, ';');
			} else if (typeof v === 'string') {
				a.push(next, '=', quote(v), ';');
			} else if (!expandable(v)) {
				var as = '$' + a.index++;
				a.args[as] = v;
				a.push(next, '=', as, ';');
			}
			if (f || expandable(v)) {
				if (!f) canMerge && a.push('if(!', next, ')'),
					a.push(next, '=', Array.isArray(v)?'[]':'{}', ';');
				define(a, o, v, next + '.', !f && canMerge);
			}
		}
	});
	define.notes = ["functions not directly in brackets are usually parsed lazily, with the full parse performed when the function is actually called; encasing them in brackets forces the full parse in 'most' js engines"];
	var on = (function(a, o, at, path) {
		for (var k in at) if (owns.call(at, k)) {
			var f = func(at[k]), next = accessor(path, k);
			if (f) {
				var as = '$' + a.index++;
				a.vars.push(as), define(a, o, { [as]:f }, '');
				a.push('self.code.on(', quote(next), ',', as, ');');
				a.undo && a.undo.push('self.code.off(', quote(next), ',', as, ');');
			}
			if (f || expandable(at[k])) on(a, o, at[k], next + '.');
		}
	});
	on.refs = f({func, accessor, define, quote, expandable, on});
	var interval = (function(a, o, at) {
		var set = '$' + a.index++, clear = a.undo && ('$' + a.index++);
		a.args[set] = setInterval, clear && (a.args[clear] = clearInterval);
		for (var k in at) if (owns.call(at, k)) {
			if (!Number.isInteger(+k) || +k<0) c.err('invalid interval length:', k);
			var f = '$' + a.index++;
			a.vars.push(f), define(a, o, { [f]:at[k] }, '');
			var id = '$' + a.index++;
			if (a.undo || typeof process!=''+void 0) a.vars.push(id), a.push(id, '=');
			a.push(set, '(', f, ',', k, ');');
			if (typeof process!=''+void 0) a.push(id, '.unref&&', id, '.unref();');
			if (a.undo) a.undo.push(clear, '(', id, ');');
		}
	});
	interval.refs = f({self, setInterval, clearInterval, Number});
	var initLater = (o => {
		var f = () => (initLater.allow = false, c(o));
		typeof process!=''+void 0 ? process.nextTick(f) : setTimeout(f,0);
	});
	initLater.refs = f({self, initLater, process, setTimeout});
	initLater.allow = true;

	var time = { parsing: typeof process!=''+void 0 ? process.uptime()*1000 : performance.now() };
	setTimeout(() => {
		var s=0, n=0;  for (var k in time) s += time[k], ++n;
		for (var k in time) if (time[k] > 2*s/n)
			console.log(k+' took '+time[k].toFixed(2)+' ms ('+(100*time[k]/s).toFixed(0)+'%)');
	}, 0);

	var c = self.code = ((o, revertable = false) => {
		if (!revertable && initLater.allow && evt.document) return initLater(o);
		var start = c.time();
		var a = [];
		a.args = { self, $0:f }, a.index = 1, a.undo = revertable && [], a.refs = [];
		a.vars = typeof process!=''+void 0 ? ['module', 'exports', 'require', '__filename', '__dirname'] : [];
		for (var k in o) if (k !== 'define' && k !== 'on' && k !== 'interval')
			if (func(o[k]) || expandable(o[k]))
				a.vars.push(k), define(a, o, { [k]:o[k] }, '', false);
		o.define && define(a, o, o.define, 'self.');
		o.on && on(a, o, o.on, '');
		o.interval && interval(a, o, o.interval);
		try {
			var s = "'use strict';" + (a.vars.length ? 'var '+a.vars.join(',')+';' : '');
			s += a.join('') + a.refs.join('');
			if (a.undo) s += "return ()=>{" + a.undo.join('') + '}';
			console.log(s);
			return Function(...Object.keys(a.args), s)(...Object.values(a.args));
		} catch (err) {
			console.error('Error when init-ing module', o.name || '<anonymous>');
			console.error('Error with args:', Object.keys(a.args));
			console.error('Error in code:\n', a.join(''));
			console.error('  (was it because of regex regex being oversimplified (visible as parts of code not having been minified)? encase second arg of division in (), or remove comments after any divisions');
			if (err.message.indexOf('Unexpected token')>=0 && err.message.indexOf('{')>=0)
				console.error("  (was it because of 'if(…) (…)'? add {}: 'if (…) {(…)}')");
			throw err;
		} finally { time[o.name || '<anonymous>'] = c.time(start);  a.length = 0 }
	});
	c.init = init;

	var stack = { entry:0, depth:0 };
	var checkTimeout = (function self() {
		var n = Date.now();
		if (n < stack.entry || stack.entry + c.timelimit < n) throw void 0;
	});
	c.timelimit = 300;
	c.at = ((f,i) => {
		checkTimeout();
		c.event('at', f, i);
	});
	c.enter = (f => {
		if (!stack.depth++) stack.entry = Date.now();
		else checkTimeout();
		c.event('enter', f);
	});
	c.leave = (f => {
		--stack.depth;
		c.event('leave', f);
	});
	checkTimeout.refs = f({Date, stack, c});
	c.at.refs = f({checkTimeout, c});
	c.enter.refs = f({checkTimeout, stack, c, Date});
	c.leave.refs = f({stack, c});

	var evt = {}, passive = {passive:true, capture:true}, active = {};
	var onevt = (e => c.event('document', e));
	onevt.refs = f({self});
	(c.on = ((k,f) => {
		(evt[k] || (evt[k] = [])).push(f);
		if (k.indexOf('.')>0)
			try {
				var s,p,next = self;  for (p of k.split('.')) [next,s] = [next[p], s];  s.on(p,f);
			} catch (err) {}
	})).refs = f({evt, self});
	(c.off = ((k,f) => {
		var i = evt[k] && evt[k].indexOf(f);  if (i >= 0) evt[k].splice(i,1);
		if (!evt[k].length) typeof deinit!=''+void 0 && deinit(evt[k]), delete evt[k];
		if (k.indexOf('.')>0)
			try {
				var s,p,next = self;  for (p of k.split('.')) [next,s] = [next[p], s];  s.off(p,f);
			} catch (err) {}
	})).refs = f({evt, self, deinit:'deinit'});
	(c.event = ((k, ...args) => {
		//Oof, allocates a lot of memory.
		if (evt[k]) for (var i=0; i < evt[k].length; ++i) evt[k].apply(void 0, args);
	})).refs = f({evt});
	(c.event.cancelable = ((k, v=void 0) => {
		if (v===void 0) return active[k] || false;
		if (!('on'+k in document) && !('on'+k in self)) return false;
		(k in document?document:self).removeEventListener(k, onevt, active[k]?true:passive);
		(k in document?document:self).addEventListener(k, onevt, (active[k]=v)?true:passive);
	})).refs = f({self, document, onevt, active, passive});

	(c.args = (f => {
		//doesn't seem to work with f=>{}.
		var s = ''+f, body = find(s,0, inc,dec, skip, /\{|=>/y);
		var j = s.indexOf('(')+1, i, a = [];
		while ((i = find(s,j, inc,dec, skip, /,|\)|\{/y)) < body)
			a.push(s.slice(j,i).trim()), j = i+1;
		return a;
	})).refs = f({find, inc, dec, skip});
	(c.body = (f => {
		var s = undecorate(''+f);
		var body = find(s,0, inc,dec, skip, /\{|=>/y);
		return s.slice(body+1, -1);
	})).refs = f({find, inc, dec, skip});
	c.branches = (body => branches(body));
	c.branches.txt = "returns an array A of positions of branch beginnings in body; on at(f,i), A[i] is the position";
	(c.link = ((ref, args, body) => {
		if (!ref) c.err('expected refs to link with, got', ref);
		var s = minify('function self(' + args + '){' + body + '}');
		ref.self = s;
		for (var r of refs(s))
			if (!(r in ref)) c.err('code has a ref not contained in to-link refs:', r);
		s = decorate(s);
		var f = Function(...Object.keys(ref), "'use strict';return("+s+")")(...Object.values(ref));
		f.refs = f(ref), ref.self = f;
		return f;
	})).refs = f({self, minify, refs, decorate, Function, Object});
	c.link.eqvs = [f => f === code.link(f.refs, code.args(f), code.body(f))];

	var handlers = {};
	(c.handlers = ((type, on, off) => {
		//store it in a variable (object) (or two, on & off) somewhere here
	})).refs = f({});
	//should also have c.on/.off(type, p,v, p,v, ...) — except, uh, named differently

	var toString = Object.prototype.toString;
	(c.err = (function(...msg) {
		Object.prototype.toString = toString;
		var err = (!this || !(this.prototype instanceof Error) ? Error : this)(msg.join(' '));
		delete Object.prototype.toString;
		if (c.err.data) err.data = c.err.data();
		throw err;
	})).refs = f({self, toString, Error, Object});
	c.err.txt = "use code.err to specify a condition that requires developer intervention (signalling a detected bug, like an intended-invariant violation)";
	if (typeof process!=''+void 0)
		(c.log = ((...a) => {
			Object.prototype.toString = toString;
			console.log(...a);
			delete Object.prototype.toString;
		})).refs = f({toString, Object, console});
	else if (typeof window!==''+void 0) c.log = console.log;
	else c.log = () => c.err('logging in web-workers is forbidden');
	c.log.txt = "use code.log instead of console.log to log debug-helping info to console";

	if (typeof document!=''+void 0) {
		for (var k in document) if (k.slice(0,2)==='on')
			document.addEventListener(k.slice(2), onevt, passive), active[k.slice(2)]=false;
		for (var k in self)
			if (!(k in document) && k.slice(0,2)==='on' && k.indexOf('unload')<0)
				if (k.indexOf('device')<0 && k!=='onuserproximity' && k.indexOf('unload')<0)
					self.addEventListener(k.slice(2), onevt, passive), active[k.slice(2)]=false;
	}

	var owns = Object.prototype.hasOwnProperty || Object.size.refs.owns;
	(Object.forEach = ((o,f) => { for (var k in o) if (owns.call(o,k)) f.call(o,k,o[k]) })).refs =
		(Object.clear = (o => { for (var k in o) if (owns.call(o,k)) delete o[k] })).refs =
		(Object.size = (o => {var s=0; for (var k in o) if (owns.call(o,k)) ++s; return s})).refs =
		f({owns});
	Object.getOwnPropertyNames(Object.prototype).forEach((k => delete Object.prototype[k]));
	'anchor big blink bold fixed fontcolor fontsize italics link small strike sub substr sup'.split(' ').forEach((k => delete String.prototype[k]));
	(o => {
		for (var k of Object.getOwnPropertyNames(self))
			if (k.slice(0,2) === 'on') delete self[k];
			else if (k.slice(0,3) in o && k.slice(3, 3+o[k.slice(0,3)].length) === o[k.slice(0,3)])
				k !== 'HTMLCanvasElement' && delete self[k];
	})({ Aud:'io', CSS:'', DOM:'', HTM:'L', IDB:'', Med:'ia', Per:'formance', RTC:'', SVG:'',
		Web:'GL', eva:'l' });

	//should change Google Chrome extension API to Firefox extension API: webextension-polyfill.js

	self.browser && browser.notifications.getAll().then(o =>
		Object.keys(o).forEach(id => browser.notifications.clear(id)));

	if (typeof require !== ''+void 0) code.require = require;

	(c.time = (function self(mark = 0) {
		if (typeof performance!=''+void 0)
			return Math.max(0, performance.now() - (mark && mark + self.time));
		if (!mark) return process.hrtime.bigint();
		return Math.max(0, Number(process.hrtime.bigint() - mark)/1e6 - self.time);
	})).refs = f({Number, performance, process});
	c.time.time = 0, c.time(), c.time(), c.time();
	c.time.time = c.time(c.time());
	if (c.time.time > 1) c.time.time = 0;
	c.time.txt = "measures elapsed time: code.time()→mark, code.time(mark)→ms";
	c.time.notes = ["browsers limit timer precision by default (to make users harder to identify by precise timings between keystrokes and such); performance measuring benefits from disabling this behavior: in Firefox, in about:config, privacy.reduceTimerPrecision should be false"];
	if (typeof process !== ''+void 0) {
		(c.mem = (function self(mark = 0) {
			var m = process.memoryUsage();
			return m.rss + m.heapUsed - m.heapTotal - (mark && mark + self.memory);
		})).refs = f({self, process});
		c.mem.memory = 0, c.mem(), c.mem(), c.mem();
		c.mem.memory = c.mem(c.mem());
		if (c.mem.memory > 3000) c.mem.memory = 0;
		c.mem.txt = "measures memory used: code.mem()→mark, code.mem(mark)→bytes";
		c.mem.notes = [
			"the bytes result could be negative (can only get the change of used memory)",
			"garbage collections will make the result less than was allocated — disregard outliers in repeated measurements",
			"code.mem(code.mem()) might not return 0, but will try to anyway",
		];
	} else c.mem = "browsers do not have any way to get current memory usage, not even by changing a preference — so we can't optimize for min of consumed memory not-in-Node-js";

	c.global = self, code.init = init;
	c.txt = "all code should be defined through code({…}), so that function .refs can be automatically set (to make code a transparent network of functions, rather than an opaque blob of text), and more";
	c.notes = [
		"uniting code & description into one network is intended to allow development of either one to go towards the betterment of one cohesive experience. development of good things is hard and quality is rare, and this way maximizes its application",
		"use code({}) to create and init (rewrite/compile) a code module; the object's .define specifies what to make visible to other modules (like public/exported functions), and .on specifies events to listen to (fired with code.event(path, ...args)); other properties specify internally-visible things (like private functions)",
		"if a module (or the initial parse) takes more than double the average time, that time is reported to console on startup",
		"comments in functions are pushed into self.should, and removed from function body",
		"after an event listener is attached on 'document', the rest is init-ed async, as soon as possible — to potentially allow to display something before all init-ing is finished",
		"f.refs is read-only; to change refs, use code.link(refs, args, body)→func",
		"call it like code({…}, true)→undo; undo() will undo the declaring, reverting the code.global-visible network to its pre-init state (do/undo of different modules should enclose each other, not interleave) (effects of called functions are not reversed).",
	];
	c.caveats = [
		"(most of 'do not' rules here are checked automatically and do not need to be memorized)",
		"rewrites and recompiles all js functions to init them, which is slower than not doing it",
		"breaks most automatic semicolon insertions — write all ';' explicitly (except at '}')",
		"removes many js globals and properties, including all in Object.prototype, to make development more focused",
		"inner functions (closures ()=>{}) are not guarded against timeout/…, try to not use them",
		"self refers to the currently-executing function — do not use own function names (like in { f:function a(){ a() } }); to get the global object, use code.global (not global or window) (to check the existence of a global var, use 'typeof Worker!=''+void 0')",
		"timeout protection is not quite full, and is possible to circumvent (but it shouldn't occur non-intentionally) (like, 'for(;;)for(;0;);')",
		"avoid getters/setters, and property descriptors (functions working with them allocate memory carelessly anyway)",
		"do not set any ref directly, make all module vars objects; all state should be visible by traversing the function network, and not hidden in closures",
		"do not use template literals, as they are not shielded from rewritings like strings are (handling them properly was too complex)",
		"do not use let/const, or debugger/with/import/export",
		"do not use generator or async functions (they allocate memory carelessly anyway)",
		"do not declare vars with destructuring assignment",
		"closes all active notifications if loaded as an extension — sometimes opened extension notifications would stay forever when extension reloads (at least in Firefox)",
	];
	c.should = [
		"to module code, pass in not self as self (and code), but code as a $I arg (to be used like $I.at(self, J); $I.handle('define', path, value, path, value, …))",
		"on minify, remove spaces between '} }' too (same-char checks should be for ± only), and after ' too",
		"have handlers for modules; at least: code.handlers(name, on, off), where each function is called with k=[...path], v=value, once for each in o.name",
		"also decorate function exit with code.at (so that only doing premature returns, like in a search-for-occurence for-loop with no occurence-not-found test cases, would not pass the code-coverage test test)",
		"handle of in for-of loops properly (not as a keyword like now, and not as a ref either)",
		"fix the behavior in case of for(…) (a || (a=[])).push(12) (currently inserts code.at before '.push', but should do it before '(a…).push')",
		"code.err should preferably be more informative with undefined (!blank), objects, arrays",
		"have the ability to assemble code.of(knownMap, ...f) into a js string — for the purpose of running in a non-ours, freshly-created, js environment (and maybe also try to split the string-blob into several '(function(…){…})(…)' to MAYBE speed up parsing)",
	];

	c.refs = f({evt, initLater, self, func, define, time, on, interval, process, Object, Function, console});
	find.refs = quote.refs = f({});
	func.refs = f({globals});
	str.refs = f({find, inc, dec, skip});
	vars.refs = f({find, name, varDecl, inc, dec, skip, replace, Set});
	args.refs = f({find, name, inc, dec, skip, Set});
	refs.refs = f({find, vars, args, name, inc, dec, skip, keywords, Set});
	replace.refs = f({find, skip});
	minify.refs = f({replace, comments, ws, extraSeparator});
	expandable.refs = f({Array, Object});
	define.refs = f({name, func, minify, str, refs, quote, expandable, define, accessor, Object, Number, Array});
})(typeof self!=''+void 0?self:global);
//should we rewrite the network to utilize a full js parser?
	//(and rewriting all function calls into .best or call())
	//((and why are there now random too-much-recursion errors? Like, every second or smth…))
	//more structured.
	//more organized.
	//what do we have now? no plan.
`[priority] (how to use it, AND allow customizing it?)
a few variants for code profiling — how to (allow to) choose between them?:
	just replicating the current call stack (and adding it to code.err-created objects),
	just recording function call time,
	recording call timings (Stack: [begin, end, stacks]; maybe only specific ones?),
		maybe, Stack should be .begin:…, .at:[...Number, dur], .ch:[...Stack, self]?
	adjusting predicted function call time (??? how exactly? prediction is '.time: (a,b) => a.length*A + b*B', maybe in '(A,B)=>...', but how to adjust A/B? an array .set, accepting output and returning input for each number? or some class?)
`;
//Need… to specify every function and class in comments first. Precisely.

//Code. Network. Properly parsed.
	//(I think we're looping around the same paths. Eternally.)
	//(But, no stopping. Only text. Interface descriptions only. Find best expansions. Forever.)




































//Lacking details. Should be 10 times more detailed. Function-level description.
	//Network initialization, inlining every reference to a non-prototype function.
		//(so 'code.log'.call(…) becomes inlined, not just code.)

/*
code(module, tmp=false):
	(should be re-done — splitting separate functionality into separate modules)
	code.enter(f)/code.leave(f)/code.at(f,i), code.timelimit;
	code.on(k,f)/code.off(k,f)/code.event(k, …args), code.event.cancelable(k,v);
	code.time, code.mem;
	code.log, code.err;
	code.args(f)/code.body(f)/code.link(refs, args, body), code.branches(body);
		(actually, should just have code.link({ name:funcNode }))
			(funcNode having .refs and .vars) (storing funcNodes on functions themselves)
			(to allow loops to be linked)
		Also, shouldn't linking return, like, a thing that can immediately stand-in in parse tree?
		Yeah, what about linking not being a separate thing, but integrating with the parse tree?
			Maybe ALL functions should be arrays/alts first and callable functions second.
	code.init to get the init-ing base js code, code.global to get the base js global object;
	code.define(k, val, …path)/code.delete(k, define, …path)/code.handlers(k, define, delete).
And what about already-existing things, for completeness sake?
	(These items should be inlined.)
	Like js parsing. Or base tree transforms.
		transform(tree, { nodeName:func }) — searching for a representation that only has those.
			(except, what about + but not +=?)
		js subsequence match (and replace), as-if reordered if allowed (if no side-effects-to-same-places function calls).
		Turn a whole tree into a function-only tree (no operators, only (a,b)=>a+b; no vars, only [withVars, blockStatement] (or turn it stack-based?)).
		A value-flow node type, and converting to/from it when needed.
	or CSS.read/.write, CSS.prefix/.unprefix, CSS.style.
	or delay.
	or call (and Function.prototype.best).
	or expect.
	or random/.bit/.fill.
	or init/deinit.
		(maybe class objects should be functions, like Acyclic(o)→Boolean.)
	or favicon. or notify (except with more args than just body and potentially title).
	or synonyms/antonyms.
	or Heap.
	or unicode (should this be chars?).
	or type info.
	or streams.
		Actually, doesn't it not make sense to have .signal AND read/write streams when needed?
			Should we remove .signal?
			Should we have a .r/.w, source/sink class?
shuffle (i=n-1..1: swap(i, random(i+1)))? sample (by probability — maybe given by map function)?
	and/or copying shuffle (Fisher–Yates shuffle on Wikipedia).
prettify/unprettify; what about camelCase, PascalCase, kebab-case, snake_case, Title Case?
	and deburr (converting Latin-1 Supplement and Latin Extended-A letters to basic Latin letters and removing combining diacritical marks):
		Latin: /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g → …
			…oh man, there are a lot; on a case-by-case basis only.
			Also, maybe we should transform not only Latin, but all known letters/numbers into their base [0-9a-zA-Z] variants?
				And maybe, not JUST into base Latin, but into a given category, like smallcaps.
					That would be best, yes.
		Combo: /[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]/g → ''
	any better name?
		capitalize? Good case, Readable case? capitalize, right?
	and what args? s, sure, but for an array, also want i and a.
Binary buffers init/deinit (with caching).
Graph, Acyclic, Tree; Pool, DeferredDeletePool classes, with .get(…path)/.set(value, …path)?
	Graph, Acyclic: ∞→o→∞;  Tree: 1→o→∞;  Pool, DeferredDeletePool: ∞→o→0.
	And Checked versions of those.
	And serialization for each — and forEach (and build).
	Replacing set(from, to), get(o)→refs.
	Only Graph will actually garbage-collect then, others can specialize.
A class like an eqv forest, to not have to backtrack on failing to match a*(1+2) then a*(1+3)?
Differentiation, integration, error-calculation rewrites (on value-flow (of numbers)).
A rewrite for changing static (number) variables based on what output should be.
Tree/graph structure search, with focus on localized and limited-in-configuration changes.
	Function(s) that have to be called repeatedly with the same args? (and inspecting ones)
		Named what? And with what args?
	A class that encapsulates the search and the tree/graph?
Tarjan algo (toposort-ish).
	Should write the algo here.
Multiprecision.
	Which operations?
Math eqvs (so that we can support multiprecision (and some missing functions in GLSL)).
A call-a-function-repeatedly-to-advance js tree interpreter.
	And visual hooks and controls for it.
store(k,v).
url(k,v).
data(k,v) — but it's both for evt.dataTransfer, and for files.
	Any better name?
diff(a,b) and diff.merge(ab, ac, resolve) — or should this be per-Class.diff(a,b)?
Audio source (microphone/camera) and sink (AudioContext).
In browsers, just a single source stream of all events — and what about a sink?
	A sink that applies all writes… Replacing CSS.write…
In extensions: omnibox, browser/page actions, sidebar, contextMenus, native, webRequest, webNavigation?  content scripts, options, devtools?  downloads.download()?
	(How exactly does one listen to them?)
In Node, use some server API to make streams of read-write and REPL API to make streams of rw.
Web workers — what should their interface be?
CSS?
SVG?
Animations?
Basic compression:
	LZW: https://en.wikipedia.org/wiki/Lempel%E2%80%93Ziv%E2%80%93Welch
		https://rosettacode.org/wiki/LZW_compression#JavaScript
		Should write the algo here.
	Encodings (how numbers are put into and pulled from a stream):
		Huffman or arithmetic encoding. Asymmetric numeral systems (do better?).
		Fixed-bit-width encoding.
			As a base, a return-number-of-bits-to-read-next stream transform; bit-writer f(num, bits).
		utf8/16/32.
node(rule, ...args)→ViewNode (Encapsulating the whole html/css/svg):
	SVG elements can simply be embedded in a <svg> element without xmlns nonsense.
		Linear gradients and filters and such can be in a hidden global <svg> element — like CSS.
		Still, should unify all attributes and CSS/SVG props under a value-flow description, like
			{ x1:this.x, y1:this.y, x2:elem.x, y2:elem.y }.
	node.event(element, type, …args).
		Capturing and bubbling, escapable (potentially cancelling) at any point.
	node.layout(element) for updating its layout??
	node.text(s or element) for managing text-in-spans??
	node.temps(s, 'class', { height:10 })?? (not flexible, though convenient sometimes)
	node.focus(element) (uh, can't this be on a node or something?)
	And drag-drop/copy-paste/composition/keydown/offscreen-textarea text input unification.
	And scroll position anchoring to the last relevant (clicked and such) element.
	And mouse→pointer events.
	And keys (is there any way to unite things like WASD into smth cohesive? Key stream maps?).
	…
	And what about different renderers, like HTML or SVG plaintext HTML?
	…
	…
gpu base (or graphics?):
	…
	Operations on ints and floats and vec2/3/4 and mat2/3/4.
		+ - * /, matrixCompMult, min max clamp mix; abs sign floor ceil fract mod step smoothstep sqrt inversesqrt pow exp exp2 log log2 radians degrees sin cos tan asin acos atan, lessThan, lessThanEqual, greaterThan, greaterThanEqual, equal, notEqual, not; cross, dot, length, distance, normalize, faceforward, reflect; refract.
	Collections of data types: arrays, textures (tensors?…).
	Renderers (webgl/2 canvas, 2d canvas, svg with transforms, css with transforms; a callback).
	gpu.transform(uniforms and textures, attributes)→varyings.
	gpu.raster(uniforms and textures, varyings, targetTexture)→destinationTexture.
		(Uhh, what about instancing?)
			You said this was beginning to make sense and you would tell me more later.
	gpu.link (at a transform or raster node).
Wasm (https://webassembly.org/docs/binary-encoding/) — non-priority.

WHAT AbOuT gRapHing? Like numberStream→neatAnimatedPicture? And renderers, hm.
	Hierarchical pie chart; hierarchical segments-on-line (like in profiler).
What about input methods, like changing button-press events into… something?
What about buttons, and text/boxes/circles/lines/arrows?
	And not just any buttons — ALL buttons: a searchable eqv space for buttons and relevant.
What about collapsed-graph-view, and layered-graph-view?
What about streamOfStringChanges → parsing → streamOfTreeChanges?
*/




































//…Scary. Specification. Scary.
	//Get… away… from… code? Specification… only?
	//Paper? Comments? Separate file?
`
eqvs:
return [F,A,B,C]  (for the calling algo to match) — bad, always-consuming-memory, approach.
	(however, it is very convenient to specify and use, for static cases.)
	(and for non-static, we can specify eqv.any() and eqv.arg(index) and eqv.compute(f))
expect(F,A,B,C) — way better, in that it doesn't consume more memory than it has to.
	(also, if we don't return, we could create many (or 0) eqvs in one call.)
	(we DO need to specify recursive nodes as its own function each, so have to make an object->funcs translator.)
`;
`[no] (for now at least)
Maybe, we should rewrite all network functions to work on a stack?
	Make them accept a stack ref (an array), and make them leave one value there as a result.
	But, we'll need to turn all arg refs into a[i] refs... Maybe all var refs too...
		And turn return X; into {a.length-=args+vars; a.push(X); return}…
		And put 'a.length+=vars;' at the front, and strip all 'var's…
		BUT, we can't turn for-of or for-in loops like this. So… no.
	And, we can't just replace f(...v) with code.call(f, ...v) — we want to be able to be async!
		Otherwise, there's no point to this replacement.
		But if we split code into multiple sub-functions, which we can't do at this level anyway,
			wouldn't the overhead become too much compared to normal execution?
`;
//add '//# sourceURL=hi' to Function(…) to have errors in it show up as hi.
typeof process!=''+void 0 && setImmediate(() => {
	//Garbage collection is about 6MB per second (though it should depend on how much is actually used, this is a good enough mark, since there is no good way to measure it).
	//Node.js, v10.14.2:
	//Any function call, method or not, allocates 16. Even though invoking a getter/setter is free.
	//Mentioning arguments or ...a also allocates !length ? 32 : (48 + 8*length).
	//Also, seems like, 16 bytes per float operation, even like (s-s)+0 if s is .1.

	//Object literals: 56 for empty, 24 + 8*props for same-shape-as-before, 176*props for new-shape.
	//Getting/setting string/symbol properties is free.
	//Setting new props:
		//Setting Numbers (even in arrays) always allocates 24. Getting is free.
		//Empty objects are 56, a header and space for 4 props.
		//Shapeful n-th (allocating a bigger spot and copying):
			//n<=4 || n%3!==2 ? 0 : 16 + 8*(n-2)
		//Shapeless n-th (creating a new shape in addition to shapeful stuff):
			//n==1 ? 192 : n<=3 ? 88 : 120 + 24*n
		//Of course, there is no pre-allocation, so the cost accumulates with many set-s.
			//shapeful: 0,0,0,0, 40,40,40, 104,104,104, 192,192,192, …
			//shapeless: 192, 280, 368, 584, 864, 1128, 1416, 1792, …
	//for-in: !length ? 0 : 56 + 16*length
	//for-of: 120 + 40*length
	//Object.keys: !length ? 64 : 136 + 24*length
	//Object.values: !length ? 64 : 80 + 8*length
	//Reflect.ownKeys: !length ? 48 : about 24 + 24*length (pre-allocated to 16)
	//Object.getOwnPropertyNames: (!length ? 48 : array(length)) + (!symbols ? 0 : 16 + 8*symbols)
	//Object.getOwnPropertySymbols: !length ? 48 : about 24 + 24*length (pre-allocated to 16)
	//Object.getOwnPropertyDescriptor: 16+56
	//__lookupGetter__ / __lookupSetter__: 16
	//Arrays: 16 + 8*length (pre-allocated to at least 16 (or 0) elements)
	//[]: 104, 136, … (no extra memory ever, for some reason?)
	//instanceof: 16

	var a={};
	var s = Symbol('hello');
	a[s] = 5, a = {};
	//Object.defineProperty(Array.prototype, 'push', { set:Array.prototype.push });
	//a[Symbol.iterator] = 12;
	var start = code.mem();
	//for (var i=0; i < 31044; ++i);
	a[s] = 12;
	code.log('test', code.mem(start)), start = code.mem();
})



code({
	a() {
		do {} while (1);
		i++ +  +a;
		var i;
		if (12) 16;
		a!=b;
		for (;;);
	}
})



code({
	name:"randomNumberGeneration",
	buf:{ a:new Uint32Array(1024), limit:Math.pow(2,32), pos:1024 },
	define:{
		random:{
			txt:"with no args, generates a random number from 0 to 1 (0 inclusive). passed an array, returns a random element. passed an integer n, returns any in 0..n-1.",
			call(end = void 0) {
				if (Array.isArray(end)) return end[self(end.length)];
				else if (typeof end == 'object') return end[self(Object.keys(end))];
				var l = buf.limit;
				if (end==void 0) return (self(l) + self(l)/l) / l;
				if (end<=0 || end%1) code.err('expected a positive int - non-inclusive limit of a generated random number, got '+end);
				if (end > l) code.err('provided random number limit is too big: '+end);
				do {
					if (buf.pos >= buf.a.length) buf.a.pos = 0, self.fill(buf.a);
					var x = buf.a[buf.pos++];
				} while (x >= l - l % end);
				return x % end;
			},
			bit() {
				if (!self.n) self.x = random(), self.n = 32;
				var r = self.x & 1;
				self.x >>= 1, --self.n;
				return r;
			},
			fill(a, bytes = void 0) {
				a = new Uint32Array(a.buffer || a);
				if (bytes == void 0) bytes = a.byteLength;
				if (typeof crypto!=''+void 0 && crypto.getRandomValues) {
					var quota = 65536, n = Math.floor(bytes/quota);
					for (var src = n && new Uint32Array(quota), i = 0; i < n; ++i) crypto.getRandomValues(src), a.set(src, i*quota);
					src = new Uint32Array(bytes - n*quota);
					crypto.getRandomValues(src), a.set(src, n*quota);
				} else for (var i = 0; i < a.length; ++i)
					a[i] = Math.floor(Math.random() * buf.limit);
				return a;
			},
		}
	}
})



code({
	define:{
		expect:{
			call(value, ...criterions) {
				if (!criterions.length && value != void 0) return;
				expandExpectations.v = void 0, expandExpectations.f = void 0;
				for (var i=0; i < criterions.length; ++i)
					if (fits(value, criterions[i])) return;
				unexpected(value, criterions);
			}},
		//should probably also have Integer, right? and Index?
	},
	fits(v,f) {
		if (f == String) return typeof v == 'string';
		if (f == Number) return typeof v == 'number';
		if (f == Boolean) return typeof v == 'boolean';
		if (f == Symbol) return typeof v == 'symbol';
		if (f == void 0 || f == null) return v == f;
		if (f == Object) return v && typeof v == 'object';
		if (f == Function) return typeof v == 'function';
		if (f == Array) return Array.isArray(v);
		if (typeof f == 'object') return v instanceof f;
		if (typeof f == 'function' && (!f.name || f.name == 'self')) return !!f(v);
		if (typeof f == 'function') return v instanceof f;
		return v == f;
	},
	string(v) {
		if (typeof v == 'string') return "'" + v.replace(/\'/g, "\\'") + "'";
		if (v == void 0) return 'undefined';  if (v == null) return 'null';
		return v && v.txt || (v && v.toString || code.err.refs.toString).call(v);
	},
	expandExpectations(f) {
		f('Unexpected value type: got'), f(string(self.v));
		if (self.f.length > 1) f('but expected any of: ['); else f('but expected');
		if (!self.f.length) f('something');
		else for (var i=0; i < self.f.length; ++i) f(string(self.f[i]));
		if (self.f.length > 1) f(']');
	},
	unexpected(v,f) { throw expandExpectations.v=v, expandExpectations.f=f, expandExpectations },
})



code({
	name:"callBest",
	define:{
		call:{
			call(thisArg, func, ...args) { return best.call(thisArg, func, args) },
			cost(v = void 0) {  expect(v, void 0, Number);
				return v == void 0 ? costEstimator.cost : costEstimator.cost = v;
			},
		},
		Function:{ prototype:{ best(...args) { return best(this, args) } } }
	},
	get(f,i) { return f instanceof Array ? f[i] : !i ? f : f.alt ? f.alt[i] || f.alt : void 0 },
	cost:{
		txt:"estimates how costly the function will be (opposite of good) — a function with the least cost (most good) will be the one called by best  (uses f.cost, or f.time, or creates a reinforced cost estimator in f.cost)",
		call(alt, args) {  expect(alt, Function), expect(a, Array);
			try {
				if (typeof alt.cost == 'function') return alt.cost.apply(this, args);
				if (typeof alt.time == 'function') return alt.time.apply(this, args);
				return alt.cost = costEstimator(), 0;
			} catch (err) { return Infinity }
		}},
	refd(f, refs) { f.refs = Object.freeze(refs);  return f },
	costEstimator() {
		if (self.cost == void 0) self.cost = 0;
		var p;
		if (random.bit())
			var f = refd(() => { f.cost += self.cost; return f.cost }, {f,self});
		else if (random.bit())
			var f = refd(() => { f.cost += self.cost/2, self.cost /= 2; return f.cost }, {f,self});
		else if (random.bit())
			var f = refd(() => {
				var p = random();
				f.cost += self.cost*p, self.cost*=1-p;
				return f.cost;
			}, {random, f, self});
		else
			var f = refd(() => {
				var p = 1 / code['at'].refs.stack.depth;
				f.cost += self.cost*p, self.cost*=1-p;
				return f.cost;
			}, {code, f, self});
		f.cost = 0;
		f.refs = Object.freeze({ self, f });
		return f;
	},

	isErrorImportant(e) {
		if (e && e.constructor == code.err.refs.Error) return true;
		if (!(e instanceof Error)) return false;
		e = e.message;
		if (e.indexOf('exceeded')>=0 || e.indexOf('too much')>=0)
			if (e.indexOf('stack')>=0 || e.indexOf('recursion')>=0)
				return false;
		return true;
	},

	alwaysFirst(f,a) {  expect(f, Function, Array), expect(a, Array);
		if (cost.call(this, get(f,0), a) == Infinity) throw Infinity;
		return get(f,0).apply(this, a);
	},
	inDefinitionOrder(f,a) {  expect(f, Function, Array), expect(a, Array);
		var e;
		for (var i=0, alt; alt = get(f,i); ++i)
			try { if (cost.call(this, alt, a) != Infinity) return alt.apply(this, a) }
			catch (err) { if (!e && (e=err), isErrorImportant(err)) throw err }
		throw e || Infinity;
	},
	pickRandom(f,a) {  expect(f, Function, Array), expect(a, Array);
		for (var n=0, i; get(f,n); ++n);
		var i = random(n);
		if (cost.call(this, get(f,i), a) == Infinity) throw Infinity;
		return get(f,i).apply(this, a);
	},
	sampleBest(f,a) {  expect(f, Function, Array), expect(a, Array);
		var sum = 0, max = -Infinity, g, e;
		for (var i=0, alt; alt = get(f,i); ++i)
			if (g = cost.call(this, alt, a), g != Infinity)
				max = Math.max(max, g), sum += g;
		sum = (max*n - sum) * random();
		for (var i=0, alt; alt = get(f,i); ++i)
			if (g = cost.call(this, alt, a), g != Infinity)
				try { if ((sum -= max-g) <= 0) return alt.apply(this, a) }
				catch (err) { if (!e && (e=err), isErrorImportant(err)) throw err }
		throw e || Infinity;
	},
	heapBest(f,a) {  expect(f, Function, Array), expect(a, Array);
		try {
			var h = init(Heap), e;
			for (var i=0, alt; alt = get(f,i); ++i)
				h.push(cost.call(this, alt, args), alt);
			while (h.length())
				try { if (h.key() != Infinity) return h.pop().apply(this, a) }
				catch (err) { if (!e && (e=err), isErrorImportant(err)) throw err }
			throw e || Infinity;
		} finally { deinit(h) }
	},
	sortedBest(f,a) {  expect(f, Function, Array), expect(a, Array);
		try {
			var c = init(Array), ind = init(Array), e;
			for (var i=0, alt; alt = get(f,i); ++i)
				c.push(cost.call(this, alt, a)), ind.push(i);
			ind.sort((i,j) => c[i]-c[j]);
			for (var i=0; i < ind.length; ++i)
				try { if (c[ind[i]] != Infinity) return get(f, ind[i]).apply(this, a) }
				catch (err) { if (!e && (e=err), isErrorImportant(err)) throw err }
			throw e || Infinity;
		} finally { deinit(ind), deinit(c) }
	},
	destructivelySortedBest(f,a) {  expect(f, Array), expect(a, Array);
		try {
			var c = init(Array), ind = init(Array), e;
			c.length = ind.length = f.length;
			for (var i=0; i < f.length; ++i)
				c.push(cost.call(this, f[i], a)), ind.push(i);
			ind.sort((i,j) => c[i]-c[j]);
			for (var i=0; i < f.length; ++i)
				while (i != ind[i]) f.swap(ind[i], ind[ind[i]]), ind.swap(i, ind[i]);
			deinit(ind);
			for (var i=0; i < f.length; ++i)
				try { if (c[i] != Infinity) return f[i].apply(this, a) }
				catch (err) { if (!e && (e=err), isErrorImportant(err)) throw err }
			throw e || Infinity;
		} finally { deinit(ind), deinit(c) }
	},
	//…should all-are-unexpected be a recoverable error (the function expandUnexpected), or not?…
	best:{
		txt:"calls the best variant of a function for the given args (and this)",
		report:`2018.11.14:
If a cheap runtime-estimation function is available (or similar), and a function has several equivalent implementations, then a call to it (including recursion) can be replaced with considering all the variants and choosing best.
This allows cheaply constructing hybrid algorithms from just several alt implementations.
For example, there are many sorting algorithms: bubble sort and such (O(N²), but is the fastest on small sequences); radix sort (O(N log N / S + S), requires set-up time but is best with large sequences); merge and quicksort (O(N log N)), etc.
C++ Boost.Sort implements hybrid sort algorithms, that achieve a better performance than any particular implementation.
But simply using f.alt and auto-changing f(...args) → f.best(...args) (or manually) can do the same, but in a much more understandable way.
With some meta-knowledge, combining strengths of all, and weaknesses of none.`,
		call(f,a) {  expect(f, Function, Array), expect(a, Array);
			if (!self.alt) self.alt = [destructivelySortedBest, sortedBest, heapBest, sampleBest, pickRandom, inDefinitionOrder];
			if (!get(f,1)) return alwaysFirst.call(this, f, a);
			if (Array.isArray(f)) return destructivelySortedBest.call(this, f, a);
			return sortedBest.call(this, f, a);
		}},
})



code({
	name:"classesBase",
	define:{
		init:{
			txt:"inits (calling class.init(o, ...)) and returns an object of a class, potentially using a cache of previously-freed objects (to cut down on memory usage in some cases) — prefer init(Array, 1,2,3) to [1,2,3] or new Array",
			call(c, ...args) {
				if (c == Number) return 0;
				if (c == String) return '';
				if (c == Boolean) return false;
				if (!c.init) return Reflect.construct(c, args);
				if (!c.prototype) code.err('attempting to init not-a-class');
				if (c.prototype.constructor != c) c.prototype.constructor = c;
				var o = pop(c);
				return c.init(o, ...args), o;
			}},
		deinit:{
			txt:"deinits (calling class.deinit(o, ...)) an object, to declare that it will not be used again, and can be re-used for an init",
			alt:{call(o, ...args) {  expect(o, void 0, Object);
				o && o.constructor.deinit && o.constructor.deinit(o, ...args), Object.freeze(o);
			}, cost() { return 1 }},
			call(o, ...args) {  expect(o, void 0, Object);
				if (!o) return;
				var c = o.constructor;
				if (!c.deinit) return; else c.deinit(o, ...args);
				push(c,o);
			}},
		replace:{
			txt:"deinits an owned (no other refs to it) object 'from', and returns 'to' — mostly to be used like 'a = replace(a, a[0])'",
			call(from, to) { return deinit(from), to }},
		Object:{ init(o) {}, deinit(o) { Object.clear(o) }, },
		Array:{
			init(a, ...e) { a.length = e.length;  for (var i=0; i<e.length; ++i) a[i]=e[i] },
			deinit(a) { a.length = 0, Object.clear(a) },
			range(n) { var a=init(Array); a.length=n; for (var i=0; i<n; ++i) a[i]=i; return a },
		},
	},
	caches:{ flushing:false, m:new Map }, none:[], setTimeout,
	pop(c) {
		if (caches.m.has(c) && caches.m.get(c).length) return caches.m.get(c).pop();
		else return typeof c=='function' ? Reflect.construct(c, none) : Object.create(c.prototype);
	},
	push(c,o) {
		if (!caches.m.has(c)) caches.m.set(c, init(Array));
		caches.m.get(c).push(o);  flushLater();
	},
	flushLater() {
		if (!caches.flushing) setTimeout(flushNow, 0), caches.flushing = true;
	},
	flushNow() {
		var c,v;
		for ([c,v] of caches.m)
			if (v.length>1024) v.length=1024;
			else caches.m.delete(c), c != Array ? deinit(v) : v.length=0;
		caches.flushing = false;
	},
})



code({
	name:"jsParser",
	//…can't we just NOT use the memory-wasting tree-building, and instead use callbacks?
	define:{
		js:{
			txt:"parses js program source (or a function), outputs an abstract syntax tree with nodes like ['BinaryExpression', '+', […], […]]",
			notes:[
				"uses the Esprima js parser internally",
				["removes many silly little quirks to streamline everything:",
					"loose/strict modes (always strict)",
					"modules (cumbersome, and not transparent to program code (unlike a network of functions))",
					"loose/strict equality (shows up as ==/!=, expands to ===/!==)",
					"(planned:) let in for-loops being a special snowflake and creating a closure for each iteration (hiding state in closures is not how we do things on the open network of functions)",],
				"variable declarations are turned into assignments or removed, and variables are stored in .vars of relevant nodes (like { i:true, j:true })",
				"function declarations & expressions & arrow functions all have the node type 'Function'",
				"a+b+c is turned into (a+b)+c, or ['BinaryExpression', '+', ['BinaryExpression', '+', […a], […b]], […c]];  convenient for interpreting, but could be ugly for representing visually (or, could be useful for showing the order of operations with animations)",
				"assumes no temporal dead zones (like in '{a=5;let a}') are present  (otherwise, the example acts like '{let a;a=5}')",
				"(didn't even consider classes)",
				"relies on the enumeration order of properties being the same as the order they were set in esprima.js",
			],
			call(src) {
				if (write.New.alias != 'New')
					Object.forEach(write, (k,v) => typeof v == 'function' && (v.alias = k));
				try { return parser(src = ''+src) }
				catch (err) { try {return parser('function '+src)} catch (e) {throw err} }
			},

			//should have nodes be instanceof Node (a local class).

			write(tree, f = emit) {
				if (!f.buf) f.buf = init(Array);
				f.last = null;
				f.into = null, f.now = tree, f(tree);
				f.into = f.now = null;
				var s = f.buf.join('');
				f.buf.length = 0;
				return s;
			},

			refsOf(tree) {
				if (!refs.v) refs.v = init(Object);
				refs.r = init(Object);
				refs(tree);
				Object.clear(refs.v);
				return refs.r;
			},

			link(tree, refs) {
				if (tree[0] == 'Program')
					code.err('cannot link', tree[0]);
				var f = Function(Object.keys(refs), "'use strict';return " + js.write(tree));
				return f(...Object.values(refs));
			},
			inline(tree, refs, name, func) {}, //name(…) → func body
			extract(tree, refs, name, func) {}, //all fragments that match func's body → name(…).
			removeUnused(tree) {}, //3;4,log() → log()
			constPropagate(tree, refs) {}, //1+2 → 3;
				//'throw(a=>a*a)(f())' → 'var a9;throw a9=f(),a9*a9'
			//collect-as-much-as-we-can-into-Sequence (from statements before);
			//extract-as-much-as-we-can-from-Sequence (into statements before).
			//turn-if-into-conditional; turn-conditional-into-if.
			//remove-unreferenced-vars (including function name and this).
			//sort-properties and shuffle-props (and swap-props-i-j), at objects/classes only.
			//turn for/for-of/do-while/while into labeled for(;;);
			//turn labeled for(;;) into for/for-of/do-while/while if possible.
		}},
	options:{ attachComment:true },
	parser(s) {
		if (typeof esprima != ''+void 0)
			var tree = transform(esprima.parseScript(s, options));
		else {
			Object.prototype.hasOwnProperty = Object.size.refs.owns;
			var es = code.require('./esprima.js');
			delete Object.prototype.hasOwnProperty;
			var tree = transform(es.parseScript(s, options));
		}
		//should resolveReferences(tree, …) after transforming
		return tree;
	},
	unroll(to, arr, block, body) {
		for (var r, i=0; i < arr.length; ++i)
			if ((r = transform(arr[i], block, body)) != void 0) to.push(r);
	},
	addVar(a,v) { (a.vars || (a.vars = init(Object)))[v] = node(write.Identifier, v) },
	addAssignedVars(a,v) {
		if (!Array.isArray(v)) return;
		if (v[0] == 'Identifier') addVar(a, v[1]);
		else if (v[0] == 'Array') for (var i=1; i < v.length; ++i) self(a, v[i]);
		else if (v[0] == 'Object') for (var i=1; i < v.length; ++i) self(a, v[i][2]);
		else if (v[0] == 'Assign') self(a, v[2]);
		else self(a, v[1]);
	},
	filterOutIdentifiers(from, to) {
		for (var i=0; i < from.length; ++i)
			if (from[i] && from[i][0] != 'Identifier') to.push(from[i]);
		return to;
	},
	node(type, ...v) { var a = init(Array, type, ...v); a.vars=null; return a },
	transform(o, block, body) {
		if (!o || typeof o != 'object' || o instanceof RegExp) return o;
		if (!o.type) code.log(o);
		if (o.type == 'Program') delete o.sourceType;
		if (o.type == 'TemplateElement')
			o.str = o.value.cooked, o.raw = o.value.raw, delete o.value, delete o.tail;
		var a = node(o.type);
		if (a[0] == 'Program' || a[0] == 'BlockStatement' || a[0] == 'ForStatement' || a[0] == 'ForOfStatement' || a[0] == 'ForInStatement') block = a;
		else if (a[0].indexOf('Function') >= 0) body = void 0;
		else if (a[0] == 'VariableDeclaration' && o.kind == 'var') block = body;
		else if (a[0] == 'WithStatement') code.err("illegal 'with' statement:", o);
		else if (a[0] == 'DebuggerStatement') code.err("illegal 'debugger' statement:",o);
		if (!body) body = block;
		var left = Object.size(o);
		Object.forEach(o, (k,v) => {
			if (--left, k == 'type') return;
			if (!Array.isArray(v)) a.push(self(v, block, body) || null);
			else left && a.push(init(Array)), unroll(left ? a[a.length-1] : a, v, block, body);
		});
		if (a[0].slice(-10) == 'Expression') a[0] = a[0].slice(0, -10);
		else if (a[0].slice(-7) == 'Pattern')
			a[0] == 'AssignmentPattern' && a.splice(1,0,'='), a[0] = a[0].slice(0,-7);
		if (a[0] == 'Program' && a[1][0] == 'Literal' && a[1][1] == 'use strict') a.splice(1,1);
		else if (a[0] == 'Binary' && a[1] == '===') a[1] = '==';
		else if (a[0] == 'Binary' && a[1] == '!==') a[1] = '!=';
		else if (a[0] == 'CatchClause') addAssignedVars(a, a[1]);
		else if (a[0] == 'ClassDeclaration') {
			addVar(block, a[1][1]), a[0] = write.Class;
			a = node('Assign', '=', a[1], a);
		} else if (a[0].indexOf('Function') >= 0) {
			if (a[0].slice(-11) == 'Declaration') {
				o = false;
				addVar(block, a[1][1]);
				block.splice(1, 0, node(write.Assign, '=', a[1], a));
			}
			if (a[0].indexOf('Arrow') < 0) addVar(a, 'this');
			a[0] = 'Function';
			if (a[1]) addAssignedVars(a, a[1]);
			if (a[5]) a[3] = node(write.BlockStatement, node(write.ReturnStatement, a[3]));
			a.splice(5,1);
			//maybe should define super too within methods?
				//(or maybe, if super is referenced inside?)
			a[2].forEach(o => addAssignedVars(a, o));
			if (!o) return code.log(a);
		} else if (a[0] == 'Member') {
			!a[1] && (a[3][0] = write.Literal), a.splice(1,1);
		} else if (a[0] == 'Property') {
			!a[2] && (a[1][0] = write.Literal), a.splice(2,1);
			a.length -= 2;
			a[3] == 'init' && --a.length;
		} else if (a[0] == 'VariableDeclaration') {
			--a.length;
			if (a[1].length > 1) {
				a = filterOutIdentifiers(a[1], node(write.Sequence));
				if (a.length == 1) return;
			} else if (a[1].length == 1) {
				if (a[1][0][0] != 'Assign')
					return block[0]=='Program' || block[0]=='BlockStatement' ? void 0 : a[1][0];
				a = a[1][0];
			} else return;
		} else if (a[0] == 'VariableDeclarator') {
			addAssignedVars(block, a[1]);
			if (!a[2]) return a[1]; else a[0] = 'Assign', a.splice(1, 0, '=');
		} else if (a[0] == 'ExpressionStatement') return replace(a, a[1]);
		else if (a[0] == 'EmptyStatement') a[0] = 'BlockStatement';
		else if (a[0] == 'RestElement' || a[0] == 'SpreadElement') a[0] = 'Packed';
		else if (a[0] == 'Object') a.sort(compare);
		else if (a[0] == 'This') a[0] = 'Identifier', a[1] = 'this';
		else if (a[0] == 'MetaProperty') {
			a[0] = 'Member';
			a[1][0] = write.New, a[1].length = 1;
			a[2][0] = write.Literal;
		} else if (a[0] == 'MethodDefinition') {
			!a[2] && (a[1][0] = write.Literal), a.splice(2,1);
			!a[4] && a[3] == 'method' && --a.length;
			a[4] && (a[3] == 'method' ? a[3] = 'static' : a[3] = 'static ' + a[3]);
			--a.length;
			a[0] = 'Property';
		}
		//also turn BlockStatement (with .vars) with a single (.vars-less) ForStatement/ForOfStatement/ForInStatement, into its child with .vars transferred.
		toOperator(a);
		if (!write[a[0]]) code.err("unknown js node type", a[0], "with", Object.keys(o), Object.values(o));
		while ((a[0] == 'Program' || a[0] == 'BlockStatement') && a.length == 2 && !a.vars)
			a = replace(a, a[1]);
		a[0] = write[a[0]];
		if (a.vars) code.log(a);
		return a;
	},
	//what about setting function .refs?
		//(and if we must set .refs, then also disallow writing directly to refs.)
	toOperator(a) {
		if (a[0] == 'Update') a[0] = 'Assign', a[3] ? --a.length : a[3] = true;
		else if (a[0] == 'Unary') a[0] = 'Operator', --a.length;
		else if (a[0] == 'Binary') a[0] = 'Operator';
		else if (a[0] == 'Assignment') a[0] = 'Assign';
	},

	rtl(p) { return p==18 || p==15 || p==4 || p==3 || p==2 },
	precedence(t, op, l, r) {
		if (t == write.Member || t == write.Call) return 19;
		if (t == write.New) return l ? 19 : 18;
		if (t == write.Assign && (op == '++' || op == '--')) return r ? 17 : 16;
		if (t == write.Await) return 16;
		if (t == write.Operator) {
			if (!r) return 16;
			if (op == '**') return 15;
			if (op == '*' || op == '/' || op == '%') return 14;
			if (op == '+' || op == '-') return 13;
			if (op == '<<' || op == '>>' || op == '>>>') return 12;
			if ('< <= > >= in instanceof'.split(' ').includes(op)) return 11;
			if (op == '==' || op == '!=') return 10;
			return op == '&' ? 9 : op == '^' ? 8 : 7;
		}
		if (t == write.Logical) return op == '&&' ? 6 : 5;
		if (t == write.Conditional) return 4;
		if (t == write.Assign) return 3;
		if (t == write.Yield) return 2;
		if (t == write.Sequence) return 1;
		return 0;
	},
	maybeGrouped(f, ...v) {
		var at = precedence(...f.now), into = f.into ? precedence(...f.into) : 0;
		if (at < into) return f('('), f(...v), f(')'), void 0;
		else if (at == into && into) {
			var t = f.into[0];
			if (t == write.Assign || t == write.Logical || t == write.Operator)
				if (f.now != f.into[rtl(into) ? 3 : 2])
					return f('('), f(...v), f(')'), void 0;
		}
		f(...v);
	},

	noSpace:'+-*%?:;!~^&|=,.<>(){}[]\'"`/',
	emit(...v) {
		try {
			var into = self.into, now = self.now;
			for (var i = 0; i < v.length; ++i)
				if (Array.isArray(v[i]))
					self.into = now, self.now = v[i], v[i][0](self, ...v[i].slice(1));
				else {
					var s = ''+v[i];
					if (!s) continue;
					if (self.last == '+' && s[0] == '+') self.buf.push(' ');
					if (self.last == '-' && s[0] == '-') self.buf.push(' ');
					if (!noSpace.includes(self.last) && !noSpace.includes(s[0]))
						self.buf.push(' ');
					self.buf.push(s), self.last = s[s.length-1];
				}
		} finally { self.into = into, self.now = now }
	},
	join(f, a, separator) { f(a[0]);  for (var i=1; i < a.length; ++i) f(separator), f(a[i]) },

	write:{
		//we should also ensure that statement-holding things like ForStatement always have a BlockStatement to hold even one statement (for rewriting convenience).
		Assign(f, op, left, right) { maybeGrouped(f, left, op, right) },
		Array: 'Array',
		Await(f, value) { maybeGrouped(f, 'await', value) },
		Block: 'Block', //value
		BlockStatement: 'BlockStatement', //...expr
			//f.now.vars; how to handle them?
				//if f.into[0] == write.Function, then use var — else use let.
				//preferably, for each var, we should find the first statement assignment where we can insert a 'var' before, and if none fit, create a standalone 'var A,B;' (or 'let A,B;' — but not in child block statements) at the beginning.
		BreakStatement(f, label) { f('break', label) },
		Call: 'Call', //func, ...args
		CatchClause(f, err, body) { f('catch', '(', err, ')', body || '{}') },
		Class: 'Class',
		ClassBody: 'ClassBody',
		Conditional: 'Conditional',
			//should this be merged with IfStatement?
				//or eqvs?
		ContinueStatement(f, label) { f('continue', label) },
		DoWhileStatement: 'DoWhileStatement',
		ForStatement: 'ForStatement',
			//f.now.vars
				//if there are any, write out a for() wrapped in a BlockStatement with these .vars.
		ForOfStatement: 'ForOfStatement',
			//f.now.vars
		ForInStatement: 'ForInStatement',
			//f.now.vars
		Function: 'Function', //name, args, body, generator, async
		Identifier(f, name) { f(name) },
			//we should make referring-to-same-thing identifiers exactly the same objects.
				//by storing distinct objects in .vars, and after .vars is ready, going through the subtree and replacing all refs to a var with it. resolveReferences.
		IfStatement: 'IfStatement',
		Line: 'Line', //value
		Literal(f, value, sourceStr) { f(sourceStr || ''+value) },
		LabeledStatement(f, label, body) { f(label, ':', body) },
		Logical(f, op, left, right) { maybeGrouped(f, left, op, right) },
		Packed(f, id) { f('...', id) },
		Member(f, obj, key) {
			f(obj);
			if (key[0]==write.Literal && typeof key[1]=='string'&&/[$_a-zA-Z][$\w]*/y.test(key[1]))
				f('.', key[1]);
			else f('[', key, ']');
		},
		MethodDefinition: 'MethodDefinition', //key, computed, value, kind, static
			//(for methods of a class)
			//(shouldn't this be merged with Property? except, how to represent static?)
				//(kind:'static', 'static get'?)
			//should be merged with Property.
		New: 'New', //T, ...args
		Object: 'Object', //...property
		Operator(f, op, left, right) {
			right ? maybeGrouped(f, left, op, right) : maybeGrouped(f, op, left);
		},
		Program(f, ...parts) { join(f, parts, ';') },
			//f.now.vars
			//should also output 'use strict' if not there, and add a return to the last statement.
			//also, maybe don't even have Program — or rather, remove it if we can?
		Property: 'Property', //key, value, kind (get/set/void)
		ReturnStatement(f, value) { f('return', value) },
		Sequence: 'Sequence', //...expr
			//comma-separated (join), AND maybeGrouped — how to combine them?
		Super: 'Super',
		SwitchCase: 'SwitchCase',
			//should test if these have a BlockStatement under, cause if not, we need to set block to such nodes in transform (right? to capture let-s? should test)
		SwitchStatement: 'SwitchStatement',
		TaggedTemplate: 'TaggedTemplate',
		TemplateElement: 'TemplateElement',
		TemplateLiteral: 'TemplateLiteral',
		ThrowStatement(f, value) { f('throw', value) },
		TryStatement(f, body, on, then) {
			f('try', body || '{}');
			on && f(on);
			then && f('finally', then || '{}') },
		WhileStatement: 'WhileStatement',
		WithStatement(f,a,b) { f('with', '(', a, ')', b || ';') },
		Yield(f, value, iterated) {
			maybeGrouped(f, 'Yield', iterated ? 'yield*' : 'yield', value || void 0);
		},
	},

	isStatement(t) { return t.alias.slice(-9) != 'Statement' },

	enterVar(vars, id) {
		if (id[0] != write.Identifier) code.err('var is not an identifier:', id);
		var n = id[1];
		if (!vars[n]) vars[n] = id;
		else if (vars[n].vars != void 0) vars[n] = init(Array, vars[n], id);
		else vars[n].push(id);
	},
	lookupVar(vars, id) {
		if (id[0] != write.Identifier) code.err('var is not an identifier:', id);
		var n = id[1];
		if (!vars[n] || vars[n].vars != void 0) return vars[n];
		else return vars[n][vars[n].length - 1];
	},
	leaveVar(vars, id) {
		if (id[0] != write.Identifier) code.err('var is not an identifier:', id);
		var n = id[1];
		if (!vars[n]) code.err("leaving a var scope that we never entered", n);
		if (vars[n].vars != void 0) vars[n].vars = void 0;
		else if (vars[n].length > 1) vars[n].pop();
		else vars[n] = replace(vars[n], vars[n][0]);
	},
	transformRefs(tree, on) {
		//on(lookupVar(vars | labels, id) || id[1], Read/Write/Parent=false/true/Array)
		//what actions should be taken at each node type, precisely?
			//default is, self-recurse into each non-0th child.
			//LabeledStatement?  BreakStatement, ContinueStatement?
			//Assign? (and Array/Object on the left side?)
			//Identifier? Member? Property?
			//any other special things?
	},
	resolveReferences(a, vars = null, labels = null) {
		//(maybe should have vars/labels be self.vars/self.labels?)
			//(and what about having self.refs, so that refs to those can be inlined, or… smth?)
				//(can't just inline refs, right?)
		//search children of a; change references to vars[k] (right of assignments, …) to vars[k];
			//change references to label in break/continue to label.
		//how to handle shadowing vars?
			//have vars[k] be a .vars-less array for any shadowed vars, just the var otherwise?
				//pros: fastest, AND least-memory-used
				//cons: handling it is most complex
					//probably want separate functions for that
						//enterVar(vars, id), lookupVar(vars, id)→id, leaveVar(vars, id)
			//have vars[k] be an array?
				//pros: simple
				//cons: a lot of vars don't shadow, so that's a lot of wasted memory
			//have an array of vars[k], with each shadowing creating a copy of a scope?
				//pros: relatively simple
				//cons: slowest if any shadowing ever happens
	},

	refs(a) {
		//should separate reads and writes; self.r and self.w?
			//after all, reordering two statements/expressions can be done if none read/write the same var, or if both read and don't write the same var.
			//wait, what about functions? how can we really be sure that no called functions do overlapping reads/writes on our precious vars? (and what about return/continue/…?)
			//also, maybe should return Sets of Identifier nodes (post resolving references though).
		if (!Array.isArray(a)) return;
		var vars = self.v, refs = self.r;
		if (a.vars) Object.forEach(a.vars, k => vars[k] = (vars[k] || 0) + 1);
		if (a[0] == 'LabeledStatement') self(a[2]);
		else if (a[0] == 'BreakStatement' || a[0] == 'ContinueStatement') return;
		else if (a[0] == 'Identifier' && !vars[a[1]]) refs[a[1]] = true;
		else if (a[0] == 'Member') self(a[2]);
			//wait, what about a[1] for a member expression?
		else if (a[0] == 'Property' && !a[2] && !a[6]) self(a[3]);
			//Property is different now. no computed, no shorthand
		else for (var i=1; i < a.length; ++i) self(a[i]);
		if (a.vars) Object.forEach(a.vars, k => --vars[k]);
	},

	compare(a,b) {
		if (!a) return -1;  if (!b) return 1;
		if (Array.isArray(a)) {
			if (!Array.isArray(b)) return 1;
			for (var i = 0; i <= a.length && i <= b.length; ++i) {
				var c = self(a[i], b[i]);
				if (c) return c;
			}
			return 0;
		} else if (Array.isArray(b)) return -1;
		if (typeof a != 'string') return typeof b != 'string' ? self(''+a, ''+b) : -1;
		if (typeof b != 'string') return typeof a != 'string' ? self(''+a, ''+b) : 1;
		return a<b ? -1 : a==b ? 0 : 1;
	},
})
//setImmediate(() => code.log(JSON.stringify(js('/*as*/;//as\n;class A{a(){}static b(){} static get c(){}}'), (k,v) => typeof v != 'function' ? v : v.alias, 2)));
//setImmediate(() => code.log(js.write(js('(((1+ +\'2\')+a.b.c+(a[(b.c)]+a.b[\'c\']))*3)**(4**5);throw 2'))));
//setImmediate(() => code.log(js.refsOf(js('search:{for(;;){continue search}}'))));



//and a function (eqv(s)) that turns (a,b,c) => a+(b+c) == (a+b)+c into two eqv functions, or at least, two eqv-structures on which match or replace or smth can be called.
	//(how to handle same-structure, or rather/maybe, have the second eqv-application return the first result?)
		//(have all-potential-parents array attached to each node, through a Map or WeakMap?)
	//(how to organize search in eqv-space? just deepReplace(root)→…eqv, and A*?)
		//(maybe keep the all-potential-parents map attached to the search?)
		//(or maybe, on eqv, replace a node with [Any, new, ...old], and then it's actually search-on-a-graph, not just on-graph-head.)



code({
	name:"synonymsAndAntonyms",
	define:{
		synonyms:{
			call(...words) { return collect(true, ...words) },
			txt:"same-meaning words: gets a list of space-separated groups of synonyms to word/s or variable name/s, like: synonyms('p')→['position pos', 'property prop'], or synonyms('p', 'pos')→['position']"},
		antonyms:{
			call(...words) { return collect(false, ...words) },
				//actually, wait — shouldn't antonyms return a list of antonyms, and not a list of synonyms of antonyms?
			txt:"opposite-meaning words: gets a list of space-separated groups of antonyms to word/s or variable name/s, like: antonyms('key')→['value v'], antonyms('from')→['ensure postcondition to', 'end to end end']"},
	},
	//the data inits too slow. we need… something, for faster init; at least init-on-use.
		//should have an internal class Data, with .build and .init
	data:[
		"init-deinit initialize-deinitialize alloc-dealloc allocate-deallocate create-destroy construct-destruct construct-dispose acquire-release",
		"define-delete add-remove set-unset open-close enter-leave include-exclude choose-forget",
		"get-set read-write load-store load-save get-put pop-push pull-push import-export input-output in-out parse-serialize lookup-change measure-mutate obtain-assign source-sink r-w i-o",
		"contract-expand encode-decode shorten-lengthen pack-unpack compress-decompress zip-unzip deflate-inflate",
		"wrap-unwrap roll-unroll compose-decompose enclose-expand encapsulate-dissect abstract-concretize internalize-externalize",
		"zip-unzip interleave-uninterleave intersperse-unintersperse gather-scatter",
		"push-pop produce-consume produce-filter save-load",
		"expect-ensure precondition-postcondition from-to",
		"next-previous forth-back forward-backward do-undo advance-retreat",
		"up-down",
		"left-right",
		"up down left right",
		"inc-dec increase-decrease",
		"start-end from-to begin-end home-end",
		"continue-stop proceed-cease begin-end",
		"light-dark good-evil",
		"basic-complex simple-intricate common-rare easy-hard",
		"data-code information-analysis state-transition knowledge-viewpoint memory-skills reality-model events-pattern value-type instance-class reference-meaning example-concept body-soul matter-physics",
		"description-code concept-implementation text-function",
		"interface-implementation visible-hidden external-internal",
		"syntax structure type format form shape layout representation notation",
		"theme visuals skin look chrome presentation form shape body layout",
		"alternative variant equivalent same choice supplement extension alt eqv",
		"description text descr txt",
		"pros-cons advantages-disadvantages positive-negative good-bad pluses-minuses",
		"maybe probably possibly potentially",
		"constant-variable const-var static-dynamic unchanging-changing",
		"establish create imagine build compile",
		"pick choose decide resolve determine settle authorize",
		"invariant independent impervious invincible invulnerable",
		"needed necessary required crucial essential mandatory",
		"map transform change",
		"local-global",
		"split-join scatter-gather multiplex-demultiplex",
		"min-max least-most minimum-maximum infimum-supremum bottom-top",
		"less-more sub-super inferior-superior",
		"size length count number amount sz len l cnt c n num",
			//maybe contractions should each be their own eqv-groups
		"yes-no true-false affirmative-negative right-wrong correct-incorrect truth-lie yep-nope",
		"function runnable code algorithm algo calculation operation method way behavior plan handler task callback utility facility module node func f",
		"call apply run do launch execute exec evaluate eval use utilize calculate calc perform process interpret fire",
		"debounce-throttle delay-immediate following-leading falling-rising",
		"name alias id identifier reference label handle designator symbol denotation",
		"key-value k-v",
		"string sequence series stream str s",
		"rule language r",
		"sum s",
		"array a",
		"arguments parameters inputs args a",
		"argument parameter input arg a b c d in",
		"result return output res r out",
		"filter-reject pick-omit",
		"filter criterion condition check cond f",
		"candidate cand",
		"width w",
		"height h",
		"word w",
		"group g",
		"index offset integer i j k",
		"element member coordinate e coord x y z",
		"position pos p",
		"property prop p",
		"object obj o",
		"temporary temp tmp t",
		"references refs",
		"boolean bool b",
		"buffer buf b",
		"codepoint cp",
		"current cur",
		"context ctx",
		"message msg",
		"source src",
		"event evt",
		"error err",
	].map(s => s.split(' ').map(g => g.split('-'))),
	//(what about editing? can we have {words:""?})
		//(it would make more sense if we do code handlers, like, two functions for define/delete eqvs, called like f(k,v) for each path k…)
		//(would this be sufficient, module-based define/delete?)
	//in the meantime, should definitely have add(group)→index, and remove(index).
		//(using a free-index list)
	free:[],
	add(group) {
		//expect(group, String)
		//if free.length, set data[free.pop()] to group.split(' ').map(g => g.split('-'))
			//also check that all antonym groups are either 1-length or 2-length
	},
	remove(index) {},

	index(s = void 0, i = void 0) {
		if (i == void 0) return data.index = {}, data.forEach((s,i) => s.forEach(g => self(g,i)));
		if (!Array.isArray(s) || s.length > 2) code.err('antonym pairs array expected, got', s);
		for (var j=0; j < s.length; ++j) {
			if (!data.index[s[j]]) data.index[s[j]] = [];
			if (data.index[data.index.length-1] != 2*i+j) data.index[s[j]].push(2*i+j);
		}
	},
	find(w,s) {
		for (var r=0; r<s[0].length; ++r)
			for (var i=0; i<s.length; ++i)
				if (s[i][r] == w) return r;
		return -1;
	},
	collect(same, ...words) {
		if (!data.index) index();
		for (var k=0; k < words.length; ++k) if (!data.index[words[k]]) return null;
		var a = init(Array);
		for (var min = 0, k=1; k < words.length; ++k)
			if (data.index[k].length < data.index[min].length) min = k;
		for (var cand of data.index[words[min]]) {
			var i = cand>>1, j = cand&1, w;
			for (var k=0; k < words.length; ++k) if (find(words[k], data[i]) != j) break;
			if (!same) j = 1-j;
			if (k == words.length && data[i][0][j])
				a.push(data[i].map(s => s[j]).filter(w => words.indexOf(w)<0).join(' '));
			//maybe we should also filter out the same words.
				//maybe we should collect data[i] into a Set.
			if (a.length && !a[a.length-1].length) --a.length;
		}
		return a;
	},
})



code({
	name:"browserOnly",
	N: typeof Notification!=''+void 0 && Notification,
	context(x) {
		var ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = x.width, ctx.canvas.height = x.height;
		return x.data && ctx.putImageData(x,0,0), ctx;
	},
	get() {
		var e = document.querySelector('link[rel=icon]') || document.createElement('link');
		return e.rel = 'icon', e;
	},
	set(x) {
		get().href = x; typeof browser!=''+void 0 && browser.browserAction.setIcon({ path:x });
	},
	faviconBlob(blob) { URL.revokeObjectURL(get().href), set(URL.createObjectURL(blob)) },
	close() { this.close() },
	setTimeout,
	last:{ not:0, log:0 },
	sources:{},
	interval:{
		5000() {
			if (typeof document==''+void 0 || typeof fetch==''+void 0) return;
			if (!(document.URL in sources)) {
				sources[document.URL] = void 0;
				for (var i=0; i < document.scripts.length; ++i)
					document.scripts[i].src && (sources[document.scripts[i].src] = void 0);
			}
			Object.forEach(sources, k => {
				if (sources[k] != null)
					fetch(k).then(r => r.text())
					.then(s => !sources[k] ? sources[k]=s : sources[k]!=s && location.reload())
					.catch(() => sources[k] = null);
			});
		}},
	on:{
		error(msg, source, lineno, colno, err) {
			if (err == void 0) return code.log('timed out'), true;
			setTimeout(() => location.reload(), 30000);
			var s = msg + '\n  ' + (err instanceof Error ? err.stack : '(no stack)');
			if (!last.not || code.time(last.not) > 7000) last.not = code.time(), notify(s);
			if (!last.log || code.time(last.log) > 1000) last.log = code.time(), console.log(s);
			else return true;
			return false;
		}},
	define:{
		favicon(ctx) {
			if (ctx instanceof CanvasRenderingContext2D) var c = ctx.canvas;
			else var c = context(ctx.imageData || ctx).canvas;
			c.toBlob ? c.toBlob(faviconBlob) : set(c.toDataURL());
		},
		notify(msg, title = document.title) {
			if (typeof browser!=''+void 0)
				browser.notifications.create({
					type:'basic', iconUrl: icon().href, message: ''+msg, title });
			else {
				if (N.permission != 'granted' && N.permission != 'denied') N.requestPermission();
				new N(title, { body:''+msg, icon:icon().href }).onclick = close;
			}
		},
		/* and sound (we don't have tensors for now though — what to replace them with? Uint8?):
		var lastSrc, sound = self.sound = t => {
			var channels = t.sizes.length != 1 ? t.sizes[0] : 1, len = t.sizes[1] || t.sizes[0];
			if (!(t instanceof Tensor) || t.finish().type != float32) assert(0, 'can only play float32 tensor sound data');
			if (!t.sizes.length || t.sizes.length > 2) assert(0, 'sound data should be linear, with number of channels being either the first size or nonexistent');
			var c = sound.ctx || (self.AudioContext || self.webkitAudioContext) && (sound.ctx = new (self.AudioContext || self.webkitAudioContext)) || undefined;
			if (!c) return; if (c.state == 'suspended') c.resume();
			var buf = c.createBuffer(channels, len, c.sampleRate);
			for (var i = 0; i < channels; ++i) buf.getChannelData(i).set(t.data.subarray(i*len, i*len+len));
			var src = c.createBufferSource();
			src.buffer = buf, src.connect(c.destination), src.start();
			lastSrc && (lastSrc.disconnect(), lastSrc.stop()), lastSrc = src; };
		stop(() => sound.ctx && sound.ctx.close());*/
	}
})



code({
	name:"priorityQueue",
	define:{
		Heap:{
			init(h, cmp=null) { h.k = init(Array), h.v = init(Array), h.cmp = cmp },
			deinit(h) { h.clear(), h.k=deinit(h.k), h.v=deinit(h.v), h.cmp=null },
			forEach(h,f) {
				try {
					var min = init(Heap, h.cmp);
					min.push(h.k[0], 0);
					while (min.length()) {
						var i = min.pop();
						f(h.k[i], h.v[i]);
						i = more(i);
						if (i-1 < h.k.length) min.push(h.k[i-1], i-1);
						if (i < h.k.length) min.push(h.k[i], i);
					}
				} finally { deinit(min) }
			},
			build(h,k,v) { return !h && (h = init(Heap)), h.push(k,v), h },
			prototype:{
				push(k,v) {
					this.k.push(k), this.v.push(v), k=this.k, v=this.v;
					down(this, k.length-1);
				},
				pop() {
					var i = up(this, 0), v = this.v[i];
					if (i < this.k.length-1)
						swap(this, i, this.k.length-1), down(this, i);
					--this.k.length, --this.v.length;
					return v;
				},

				key(k = void 0) {
					return k == void 0 ? this.k[0] : (this.k[0] = k, down(this, up(this, 0)));
				},
				value(v = void 0) { return v == void 0 ? this.v[0] : this.v[0] = v },

				length(l = void 0) {
					if (l != void 0) while (l < this.k.length) this.pop();
					return this.k.length;
				},
				clear() { this.k.length = this.v.length = 0 },
			}
		}
	},
	less(i) { return (i-1)>>1 },
	more(i) { return (i+1)<<1 },
	swap(h, i1, i2) { h.k.swap(i1,i2), h.v.swap(i1,i2) },
	cmp(h, i1, i2) { return !h.cmp ? h.k[i1] < h.k[i2] : h.cmp(h.k[i1], h.k[i2]) },
	down(h,i) { while (i && cmp(h, i, less(i))) swap(h, i, i = less(i)) },
	up(h,i) {
		var a,b;
		while (b = more(i), a = b-1, b < h.k.length)
			swap(h, i, i = cmp(h,a,b) ? a : b);
		if (b == h.k.length) swap(h, i, i = a);
		return i;
	},
})



code({
	name:"delay",
	//actually, why NOT allow args? just push void or smth (or store first-non-undefined offset).
	define:{
		delay:{
			txt:"delays the execution of a function — zero-delay callbacks are executed in order, with CPU usage limited to delay.options.maxTimeUsage; others are executed when requested, as soon as is possible",
			notes:[
				"use delay() over setImmediate or process.nextTick or setTimeout or requestAnimationFrame (unless the delay specifically for animating is wanted)",
				"in browser background tabs, effects of timeout throttling are minimized — scheduling 100 callbacks to fire in a second will fire all in a second or two",
				"callbacks that timed out (throw void 0, usually automatically-inserted) will be called again",
				"scheduled callbacks can not be cancelled",
				"no state can be passed to the callback (schedule own fire-callbacks-as-wanted function if it wasn't already scheduled)",
			],
			options:{ maxTimeUsage:.2 },
			call(ms, func = 0) {
				if (typeof ms == 'function') [ms, func] = [func, ms];
				if (typeof func != 'function') code.err('delay expected a function, got', func);
				if (!(ms >= 0)) code.err('delay ms expected to be a positive number, got', ms);
				if (!ms) imm.push(func), immLater();
				else {
					(info.next || (info.next=init(Heap))).push(code.time(info.origin) + ms, func);
					delayed();
				}
			}
		}
	},
	imm:[],
	info:{ origin:code.time(), immScheduled:false, delayedScheduled:false, next:null, isImm:false, used:0, total:0, immLast:0 },
	immNow() {
		info.immScheduled = false, info.isImm = true;
		var start = code.time(info.origin);
		var max = delay.options.maxTimeUsage;
		info.total += start - info.immLast, info.immLast = start;
		if (info.used >= info.total * max) return immLater();
		var dur = Math.min((info.total * max - info.used) / (1 - max), 10);
		try {
			for (var i=0; i < imm.length && code.time(info.origin) <= start + dur; ++i) {
				if (i >= 128 && imm.length-i <= 8) i-=128, imm.splice(0,128);
				imm[i].call();
			}
		} catch (err) { if (err != void 0) throw imm.splice(0,1), err } finally {
			imm.splice(0,i), immLater(), info.isImm = false;
			dur = code.time(info.origin) - start;
			info.used += dur, info.total += dur, info.immLast += dur;
			info.used /= 2, info.total /= 2;
		}
	},
	immLater() {
		if (!info.immScheduled && imm.length) {
			if (delay.options.maxTimeUsage < .1)
				setTimeout(immNow, 100);
			else if (typeof process != ''+void 0) {
				(info.isImm ? setTimeout : process.nextTick)(immNow, 10);
			} else if (typeof requestAnimationFrame != ''+void 0)
				requestAnimationFrame(immNow);
			else setTimeout(immNow, 10);
			info.immScheduled = true;
		}
	},
	delayed() {
		try {
			while (info.next.key() <= code.time(info.origin))
				info.next.value()(), info.next.pop();
		} catch (err) { if (err != void 0) throw info.next.pop(), err } finally {
			if (info.next.length() && !info.delayedScheduled) {
				setTimeout(delayedTimer, info.next.key() - code.time(info.origin));
				info.delayedScheduled = true;
			}
		}
	},
	delayedTimer() { info.delayedScheduled = false, delayed() },
})



code({
	name:"streams",
	setTimeout, clearTimeout,
	define:{
		Stream:{
			txt:"a class for streams of values",
			init(s,f) {
				s.f = s.o = s.t = s.s = null;
				//.s (signal (cancel and such)) is f's return value
				//launch f as soon as possible, but after sync (delay(f))
					//hmm, we can't just do delay(() => s.s = f())… store it in array, defer proxy?
						//oh man, another proxy. maybe we should have done that delay.proxy().
							//but what is its interface?
							//supporting both CSS.read/.write, and register(f, arg)…
							//delay.proxy(finish(...args)), where each arg is an array?
								//uh, but, then we'll have to make void 0 args desync with their neighbors, and that's good for some and bad for others.
							//delay.proxy(finish(state), { stateProp:registeringFunction })?…
								//(and pass the state object as registeringFunction.state.)
								//ehh, don't we want, say, 2 arrays and 1 registeringFunction, for exec(f, arg)?
							//delay.proxy(finish(state), ...registeringFunction)?
								//(and pass the state object as registeringFunction.state.)
								//how to handle creation of state arrays easily though?
								//also, not very useful for NOT creating extra functions in the scope. Or, for auto-registering finisher on calling a registrator.
							//delay.throttle(finish), where finish is just expected to reference the necessary state itself? Or even finish.throttle()?
								//at this point, why even involve outside abstractions at all?
							//finishLater(f,s)/finishNow() functions here?
			},
			deinit(s) { s.s && s.s();  s.f = s.o = s.t = s.s = null; },

			from:{
				txt:"creates a stream from an object (using its class's .forEach(o,f))",
				call(o, c = o.constructor) {
					var s = init(Stream, () => {
						//uhh, we can't just allocate memory carelessly like this.
							//have to create a one-emit stream, and use an expansion of that.
						c.forEach((...v) => s.emit(...v));
						s.end();
					});
					return s;
				}},

			all:{
				txt:"", //unites both .on and .then (when all .then fire, fires its .then)
				//(with args being (...v1, ...v2, ...))
				call(...s) {}},
			any:{
				txt:"", //passes through any received .on/.then (.then is only once)
				call(...s) {}},

			prototype:{
				on:{
					txt:"",
					call(f) { if (this.o) code.err('.on called twice on a Stream'); this.o=f; return this }},

				emit:{
					txt:"",
					call(...v) { return this.o ? this.o(...v) : void 0 }},
					//should call this.f instead of .o, to allow expand to work properly
				signal:{
					txt:"",
					call(...v) { return this.s ? this.s(...v) : this.end(...v) }},

				clone:{
					txt:"",
					call(n=2) {}}, //→[...streams]
				expand:{
					txt:"",
					call(f) {}}, //.on, f(on, ...v) (on(…v) passes to on); .then, pass ...v to then.
					//(in fact, isn't special ­— should be handled in .emit; here, just set .f)
						//(set .f, or return a new stream with set .f?)
						//(if it's not set, set; else return new)
					//(should this be .control(f) instead, or smth?)
					//(a base function which every one below can be expressed in terms of)

				delay:{
					txt:"", //.on, initiate a timeout to pass it on; in data, store accumulated value sets along with their time-of-giving
					call(n) {}},
					//(should we have a timer facility, that schedules immediately-after-sync (and only uses one timer id at a time — shortest needed)?)
				throttle:{
					txt:"block for a time after emitting",
					call(n) {}},
				debounce:{
					txt:"block for a time before emitting",
					call(n) {}},

				to:{
					txt:"turns a stream into an object (using its class's .build)",
					call(c) {}}, //.on, call c.build(data, ...v)→data; then, return data
				map:{
					txt:"", //.on, emit(f(...v))
					call(f) {}},
				filter:{
					txt:"", //.on, f(...v) && emit(...v)
					call(f) {}},
				reduce:{
					txt:"", //.on, data = f(data, ...v) (or data is this?); if !v.length, emit(data)
					call(f, initial = void 0) {}},

				ranges:{
					//(should this be .same?)
					txt:"", //when f(...v)→value changes, emit(value, begin, end)
						//(should this not accept f, and rely on map for that instead?)
					call(f) {}},

				//Should do smth like .optimize() and .compile()… (or are these the same?)
					//(It'll have to be called at-source tho, not at-sink like all others.)

				//what about streams-of-changes, like string-diffs and such?
					//which in the general case have to re-emit all values, but sometimes (like with parsing) can re-use some previous results, to update the whole…
					//should have smth like, srcs.diffs(f)… and/or diffs.srcs(f)…
						//what about .rememberData(when) or smth?
						//(how to integrate eqvs with them though?)
						//(and aren't those kinda like .reduce?)
				//match(controller)? (for like-in-parser matching, if possible)
					//the usage is like .match(Tensor.read).
					//do not pass on the value until the controller says it's ok.
					//but how would the controller look and work?
					//also, what about Node (with .len, .max, .val, .ch) — re-usable structure?
			}
			//as many eqvs as possible is a must here (to be used for optimization).
		},
		Object:{ build(o,k,v) { return o[k]=v, o } },
		Array:{
			prototype:{ swap(i,j) { var t=this[i]; this[i]=this[j]; this[j]=t; return this } },
			forEach:{
				alt:[(o,f) => { for (var e of o) f(e) }],
				call(o,f) { for (var i=0; i<o.length; ++i) f(o[i]) }},
			build(o,x) { return o.push(x), o } },
		String:{
			forEach:{
				alt:[(o,f) => { for (var c of o) f(c) }],
				call(o,f) {
					for (var i=0; i<o.length; ++i)
						f(o.charCodeAt(i) == o.codePointAt(i) ? o[i] : o[i] + o[++i]);
				}},
			build:{
				alt:[(o,x) => o + x],
				call(o,x) {return !x ? o.join('') : Array.isArray(o) ? (o.push(x),o) : [o,x]} }},
	}
})



//what about having ref/unref, and automatically rewriting every new T to ref(init(T)), and single assignment a=b to unref(a, a=ref(b)) (or to a = transfer(a,b)), and as-if setting all vars going out of scope (or, just-after-last-use) to void 0?



code({
	name:"graph search and sort (a graph is a node→…nodes iterator; can be finite or infinite)",
	//graph operations.
		//rewrite(node→…nodes, node, node→node)->node.
		//graph representation(s) (visual/node), first in toposort first.
		//and checking equality (with eqvs) and making it fit a function (with eqvs) and optimizing?
	define:{
		//graph.search (best-first);
			//variations: depth-first, breadth-first; tree search.
		//graph.sort (tarjan algo)
	}
/*
algorithm tarjan is
  input: graph G = (V, E)
  output: set of strongly connected components (sets of vertices)

  index := 0
  S := empty array
  for each v in V do
	if (v.index is undefined) then
	  strongconnect(v)
	end if
  end for

  function strongconnect(v)
	// Set the depth index for v to the smallest unused index
	v.index := index
	v.lowlink := index
	index := index + 1
	S.push(v)
	v.onStack := true

	// Consider successors of v
	for each (v, w) in E do
	  if (w.index is undefined) then
		// Successor w has not yet been visited; recurse on it
		strongconnect(w)
		v.lowlink  := min(v.lowlink, w.lowlink)
	  else if (w.onStack) then
		// Successor w is in stack S and hence in the current SCC
		// If w is not on stack, then (v, w) is a cross-edge in the DFS tree and must be ignored
		// Note: The next line may look odd - but is correct.
		// It says w.index not w.lowlink; that is deliberate and from the original paper
		v.lowlink  := min(v.lowlink, w.index)
	  end if
	end for

	// If v is a root node, pop the stack and generate an SCC
	if (v.lowlink = v.index) then
	  start a new strongly connected component
	  repeat
		w := S.pop()
		w.onStack := false
		add w to current strongly connected component
	  while (w != v)
	  output the current strongly connected component
	  // They are outputted in a reverse topo-sort order (reverse output to get the right one)
	end if
  end function
*/
})



code({
	name:"utf8Encoding",
	define:{
		utf8:{
			//should have at least .build (and .forEach) — thus, utf8 should be a class
				//(a pseudo-class, that only holds data for assembly of codepoints)
				//also, should probably merge it into the unicode module.
		}
	}
/*
	function realLengthAt(b,i) { i = utf8.lengthAt(b,i);  !i && assert(0, 'incomplete codepoint in a utf8 string');  return i }
	var cacheAt=1024, utf8 = self.utf8 = {
		lengthAt(b,i) { if (!b.length) b = new uint8(b); var c=b[i]; return c<128? 1: c<192? 0: c<224? 2: c<240? 3: c<248? 4: 0 },
		lengthOf: cp => {
			if (typeof cp == 'number') return cp < 0x80 ? 1: cp < 0x800 ? 2: cp < 0x10000 ? 3: cp < 0x200000 ? 4: 0
			if (cp instanceof Tensor) cp = utf8.from(cp);  if (cp.byteLength!=void 0) return cp.byteLength;
			if (typeof cp == 'string') { let length = 0, c; for (c of cp) length += utf8.lengthOf(c.codePointAt(0)); return length }
			else assert(0, cp, 'is not a valid code point, nor a sequence of them'); },
		get: (b,i) => {
			if (!b.length) b = new uint8(b);  var c=b[i++];
			return c<128? c: c<192? 0: c<224? (c-192<<6) + b[i++]-128: c<240? (c-224<<12) + (b[i++]-128<<6) + b[i++]-128:
				c<248? (c-240<<18) + (b[i++]-128<<12) + (b[i++]-128<<6) + b[i++]-128: c<256 ? NaN : undefined; },
		set: (b,i,cp) => {
			if (cp > 0x10ffff || 0xd800<cp && cp<0xe000) assert(0, cp, 'cannot be represented in utf16 - do not use');
			if (b.length==void 0) b = new uint8(b);
			if (cp < 0x80) b[i++] = cp;
			else if (cp < 0x800) b[i++] = 192 + (cp >>> 6), b[i++] = 128 + (cp & 63);
			else if (cp < 0x10000) b[i++] = 224 + (cp >>> 12), b[i++] = 128 + ((cp >>> 6) & 63), b[i++] = 128 + (cp & 63);
			else if (cp < 0x200000) b[i++] = 240 + (cp >>> 18), b[i++] = 128 + ((cp >>> 12) & 63), b[i++] = 128 + ((cp >>> 6) & 63), b[i++] = 128 + (cp & 63);
			else assert(0, cp, 'is not a valid code point');  return i; },
		slice(b, begin = 0, end = undefined) {
			if (!b) return '';  if (typeof b=='string' && !begin && end==void 0) return b;
			if (typeof b=='number') b = String.fromCodePoint(b); if (self.Node && b instanceof Node) b = b.textContent;
			if (end==void 0) end = b.sizes&&b.sizes[0] || b.length || b.byteLength;  if (end==void 0) return;
			var array = new Array(Math.max(end-begin, 0)), cache = new Array(128), i=0;
			return utf8.every(b, cp => (begin<=i && i<end && (array[i] = cache[cp] || (cache[cp] = String.fromCodePoint(cp))), ++i)) ? array.join('') : undefined; },
		from(s) {
			if (self.Tensor && s instanceof Tensor) return s.finish().type!=uint8 || s.sizes.length!=1 ? undefined : s.data.length==s.sizes[0] ? s.data : s.data.subarray(0, s.sizes[0]);
			if (s==void 0 || s==null || s.byteLength!=undefined) return !s || s.constructor==uint8 ? s : new uint8(s.buffer || s);
			if (typeof s=='number') s = String.fromCodePoint(s); if (self.Node && b instanceof Node) b = b.textContent;
			if (typeof s=='string') { var b = new uint8(utf8.lengthOf(s)), i = 0; for (var c of s) i = utf8.set(b, i, c.codePointAt(0)); return b } },
		seek(s,i, a=null) {
			var j = a && a[a.length-2] || 0, k = a && a[a.length-1] || 0, r = Math.round(i/cacheAt);  if (a.length) a.length-=2;  j-i>i && (j=k=0);
			if (a && Math.abs(j-i)>Math.abs(r*cacheAt-i) && a[r-1]!=undefined) k=a[r-1], j=r*cacheAt;
			if (typeof s=='string') {
				for (; k<s.length && j<i; k += s.codePointAt(k)==s.charCodeAt(k) ? 1 : 2, ++j) a && j && !(j%cacheAt) && (a[j/cacheAt-1] = k);
				for (; k>0 && j>i; k -= s.codePointAt(k-2)==s.charCodeAt(k-2) ? 1 : 2, --j) a && j && !(j%cacheAt) && (a[j/cacheAt-1] = k);
				return a && (a[a.length]=j, a[a.length]=k), s.codePointAt(k);
			} else if (s=utf8.from(s)) {
				for (; k<s.length && j<i; k += realLengthAt(s,k), ++j) a && j && !(j%cacheAt) && (a[j/cacheAt-1] = k);
				for (; k>0 && j>i; --j) { a && j && !(j%cacheAt) && (a[j/cacheAt-1] = k); while (k && !utf8.lengthAt(s,--k)); }
				return a && (a[a.length]=j, a[a.length]=k), utf8.get(s,k); } },
		base64(s) {
			s = utf8.from(s); var array = [], cache = new Array(256);
			for (var i=0; i<s.length; ++i) array.push(cache[s[i]] || (cache[s[i]] = String.fromCharCode(s[i])));
			return btoa(array.join('')); },
		cpLength(s) {
			var len=0;  if (typeof s == 'string') for (var c of s) ++len;
			else if ((s=utf8.from(s)) && s && s.byteLength!=void 0) for (var i=0; i<s.byteLength; i+=realLengthAt(s,i)) ++len;
			return len; },
		every(s,f) {
			if (typeof s == 'string') { for (var c of s) if (!f(c.codePointAt())) return false }
			else if ((s=utf8.from(s)) && s && s.byteLength!=void 0) { for (var i=0; i<s.byteLength; i+=realLengthAt(s,i)) if (!f(utf8.get(s,i))) return false; }
			else return false;  return true; },
	};
*/
})



code({
	name:"types .next",
	define:{
		//what about min/max? what about gl (FLOAT; SHORT/BYTE; UNSIGNED_SHORT/UNSIGNED_BYTE)?
		Float64Array:{ next(x) {
				return !isFinite(x) ? x : x != 0 ?
					x+Math.pow(2, Math.max(-1074, Math.floor(Math.log2(Math.abs(x)))-52)) :
					Math.pow(2,-1074);
			}},
		Float32Array:{ next(x) {
				return Math.fround(!isFinite(x) ? x : x != 0 ?
					x+Math.pow(2, Math.max(-149, Math.floor(Math.log2(Math.abs(x)))-23)) :
					Math.pow(2,-149));
			}},
		Int32Array:{ next(x) { return Math.min(x+1, Math.pow(2,31)-1) } },
		Int16Array:{ next(x) { return Math.min(x+1, Math.pow(2,15)-1) } },
		Int8Array:{ next(x) { return Math.min(x+1, Math.pow(2,7)-1) } },
		Uint32Array:{ next(x) { return Math.min(x+1, Math.pow(2,32)-1) } },
		Uint16Array:{ next(x) { return Math.min(x+1, Math.pow(2,16)-1) } },
		Uint8Array:{ next(x) { return Math.min(x+1, Math.pow(2,8)-1) } },
	}
})



code({
	name:"simpleCubicBezierEasing",
	link:"https://github.com/gre/bezier-easing",
	define:{
		bezier:{
			call() {
				//return a function, x→y
					//if x1==y1 && x2==y2, return x
					//return x==0 ? 0 : x==1 ? 1 : calcBezier(getTForX(x), y1, y2)
					//(should we return a class instance instead? read-write is allowed too then…)
						//(and sane init/deinit…)
			},
		}
	},
	//should probably remove all those a* in front, because they are superfluous here.
	A(aA1, aA2) { return 1 - 3*aA2 + 3*aA1 },
	B(aA1, aA2) { return 3*aA2 - 6*aA1 },
	C(aA1) { return 3*aA1 },
	calcBezier(aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; },
	getSlope(aT, aA1, aA2) { return 3 * A(aA1, aA2) * aT * aT + 2 * B(aA1, aA2) * aT + C(aA1) },
	binarySubdivide(aX, aA, aB, mX1, mX2) {
		var curX, curT, i = 0;
		do {
			curT = aA + (aB - aA) / 2.0;
			curX = calcBezier(curT, mX1, mX2) - aX;
			if (curX > 0) aB = curT; else aA = curT;
		} while (Math.abs(currentX) > 0.0000001 && ++i < 10);
		return curT;
	},
	newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
		for (var i = 0; i < 4; ++i) {
			var curSlope = getSlope(aGuessT, mX1, mX2);
			if (curSlope == 0) break;
			var curX = calcBezier(aGuessT, mX1, mX2) - aX;
			aGuessT -= curX / curSlope;
		}
		return aGuessT;
	},
	getTForX(x, x1,y1, x2,y2) {
		//it also needs sampleValues (a Float32Array, of length 11), from which to subdivide…
			//that class idea looks mighty attractive right now.
	},
})
