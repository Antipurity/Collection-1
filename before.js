'use strict';(function before(self) {
	{"It stands before the beginning", "start/end difference is thinning";
		"Light is slow, dark is fast; used to make a thing to last."}
	before.doc = "Cleans up the global scope, and does a basic compile/link/run to network code.";
	let esprima = self.esprima || require('./esprima.js');  delete self.esprima;
	("Esprima is bad with brackets — (a.b)() is the same as a.b(), and (-1)**2 is an error.")
	let parse = (str => esprima.parseModule(str, {}));

	const Array = self.Array, Object = self.Object, Function = self.Function;
	const Symbol = self.Symbol, Error = self.Error, Infinity = self.Infinity;
	const log = self.console.log;
	const prototype = Symbol('prototype');
	const get = Object.prototype.__lookupGetter__;
	const set = Object.prototype.__lookupSetter__;
	const def = Object.defineProperty, lookup = Object.getOwnPropertyDescriptor;
	Object.defineProperty.doc = `should not ever be used — use .getset or .define instead`;
	Object.getOwnPropertyDescriptor.doc = `should not be used — use .getter or .setter or .writable or .configurable or .enumerable instead`;
	const e = Object.prototype.propertyIsEnumerable;
	const ownNames = Object.getOwnPropertyNames, protoOf = Object.getPrototypeOf;
	const d1 = { configurable:true, enumerable:true, get:void 0, set:void 0 };
	const d2 = { configurable:true, enumerable:true, value:void 0, writable:true };
	Object.owns = Object.prototype.hasOwnProperty;
	Object.owns.doc = `used like Object.owns.call(obj, key)->false/true.`;
	Object.getset = ((obj, k, get=void 0, set=void 0, configurable=true, enumerable=true) => {
		d1.configurable = configurable, d1.enumerable = enumerable;
		d1.get = get, d1.set = set, def(obj, k, d1);
	});
	const getset = Object.getset;
	Object.define = ((obj, k, v, writable=true, configurable=true, enumerable=true) => {
		d2.configurable = configurable, d2.enumerable = enumerable;
		d2.value = v, d2.writable = writable, def(obj, k, d2);
	});
	const look = (function self(o,k) {
		if (o !== self.o || k !== self.k)
			self.d = lookup(self.o = o, self.k = k) || self.none || (self.none = {});
		return self.d;
	});
	const getter = Object.getter = ((obj, k) => get ? get.call(obj, k) : look(obj, k).get);
	const setter = Object.setter = ((obj, k) => set ? set.call(obj, k) : look(obj, k).set);
	Object.writable = ((obj, k) => look(obj, k).writable);
	Object.configurable = ((obj, k) => look(obj, k).configurable);
	Object.enum = e;
	Object.enum.doc = `used like Object.enum.call(obj, k)->false/true`;



	const code = Symbol('code');
	const fr = Object.freeze;
	const args = {
		0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, r:[], l:0, in:0,
		set next(v) {
			if (args.l < 8) args[indexes[args.l]] = v;
			else if (args.l < 16) args.r[indexes[args.l - 8]] = v;
			else args.r[args.l] = v;
			++args.l;
		},
		set spread(iter) {
			"would be great to be able to spread a slice, like in f(...a.slice(1))."
			if (iter[prototype] === Array.prototype) {
				args.r.length = args.l + iter.length <= 8 ? 0 : args.l + iter.length - 8;
				for (let i=0; i < iter.length; ++i) args.next = iter[i];
			} else for (let i of iter) args.next = i;
		},
		set this(o) { args['1'] = o },
		set method(name) { args['0'] = args[1][name]; args.l = 2 },
		get next() {
			if (args.in < args.l)
				return args.in < 8 ? args[args.in++] : args.r[args.in++ - 8];
		},
		get rest() {
			let a = array[0];
			while (args.in < args.l) a.end = args.next;
			return a;
		},
		set rest(a) { array['0'] = a },

		set at(i) { stack.i[indexes[stack.i.length-1] || (stack.i.length-1)] = i },
	};
	const cache = [];
	const array = fr({
		refs: fr({ cache }),
		get 0() {
			let a = cache[cache.length-1];
			return cache.length ? (--cache.length, a) : [];
		},
		set 0(a) { a.length = 0, cache.end = a }
	});
	const stack = [];
	stack.i = [], stack.from = [], stack.from.i = [];
	const indexes = fr({ 0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7' });
	args.refs = fr({ args, array, stack, indexes }), Object.seal(args);
	const func = (() => {
		const f = (function self(...a) {
			args.l = a.length+2, args.r.length = a.length <= 6 ? 0 : a.length - 6;
			args['0'] = self, args['1'] = this;
			for (let i=2; i < args.l && i < 8; ++i) args[indexes[i]] = a[i-2];
			for (let i=8; i < args.l && i < 16; ++i) args.r[indexes[i-8]] = a[i-2];
			for (let i=16; i < args.l; ++i) args.r[i-8] = a[i-2];
			return best[0];
		});
		delete f.name, delete f.length, f[code] = void 0;
		return f;
	});
	const enter = fr({
		refs: fr({ array, args, stack, indexes }),
		get 0() {
			for (let i=0; i < stack.from.length; ++i) array['0'] = stack.from[i];
			stack.from.length = 0;
			stack.from.i.length = 0;
			let a = array[0];
			a.length = args.l;
			for (let i=0; i < a.length && i < 8; ++i) a[indexes[i]] = args[i];
			for (let i=8; i < a.length; ++i) a[i] = args.r[i-8];
			stack.end = a, stack.i.end = 0;
		}
	});
	const leave = fr({
		refs: fr({ Error, stack }),
		get 0() {
			if (!stack.length) throw new Error("Left without entering the call stack");
			let from = stack, to = stack.from;
			to[indexes[to.length-1] || (to.length-1)] = from[from.length-1], --from.length;
			from = stack.i, to = stack.from.i;
			to[indexes[to.length-1] || (to.length-1)] = from[from.length-1], --from.length;
		}
	});
	const restore = fr({
		refs: fr({ args, stack, indexes }),
		get 0() {
			const a = stack[indexes[stack.length-1] || (stack.length-1)];
			f = a[0], args.in = 0;
			args.l = a.length, args.r.length = a.length <= 8 ? 0 : a.length - 8;
			for (let i=0; i < args.l && i < 8; ++i) args[indexes[i]] = a[i];
			for (let i=8; i < args.l && i < 16; ++i) args.r[indexes[i-8]] = a[i];
			for (let i=16; i < args.l; ++i) args.r[i-8] = a[i];
		}
	});
	const cmpCosts = ((i,j) => {
		const c = args[0][code].cost;
		return (restore[0], +c[i]) - (restore[0], +c[j]);
	});
	const best = fr({
		refs: fr({ Infinity, Error, args, array, indexes, enter, leave, restore, code }),
		get 0() {
			"We should also have some global function, that will keep costs in order."
				"Is it a function that calls, or a function that is split into enter/leave?"
			"We may have to integrate more closely with conceptual stuff to do the language, and if we do so, then we might not need best in before — maybe we could get away with it being in after."
			args.in = 0;
			if (!args[0]) return;
			let f = args[0][code];
			if (typeof f==='function') args['0'] = f, f = 0;
			if (!f) { "call it and return its result"
				const a = array[0];
				try {
					a.length = args.l-2;
					let i;
					for (i=0; i < a.length && i < 6; ++i) a[indexes[i]] = args[i+2];
					for (i=6; i < a.length; ++i) a[i] = args.r[i-6];
					return args[0].apply(args[1], a);
				} finally { array['0'] = a }
			}
			else if (!f || typeof f!=='object') throw"Calling not-a-function";
			else if (!(0 in f)) throw"Calling an unimplemented function";

			if (!(1 in f) || !f.cost || typeof f.cost!=='object') {
				("Only one implementation — simply call it, unless its cost is infinite.")
				if (1 in f) return f[0];
				try {
					enter[0];
					if (!(+f.cost[0] < Infinity)) throw Infinity;
					return restore[0], f[0];
				} finally { leave[0] }
			} else
				try { "find the least-cost solution."
					enter[0];
					let mini = 0, min = Infinity, max = -Infinity, f = args[0][code];
					for (let i=0; i in f; ++i) {
						let a = +f.cost[i];
						restore[0];
						if (min > a) min = a, mini = i;
						if (cur < Infinity && max < a) max = a;
					}
					if (!(min < Infinity)) throw Infinity;
					try { return f[mini] }
					catch (err) {
						restore[0];
						if (min < max)
							try {
								let a = array[0];
								for (i=0; i in f; ++i) {
									if (i !== mini && +f.cost[i] < Infinity) a.end = i;
									(i+1) in f && restore[0];
								}
								a[Object.sort] = cmpCosts;
								for (i=0; i < a.length; ++i)
									try { return restore[0], f[a[i]] }
									catch (e) { if (!e || typeof e==='symbol' || e instanceof Error) throw e }
							} finally { array['0'] = a }
						else
							for (i=0; i in f; ++i) {
								if (i !== mini && +f.cost[i] < Infinity)
									try { return restore[0], f[i] }
									catch (e) { if (!e || typeof e==='symbol' || e instanceof Error) throw e }
								(i+1) in f && restore[0];
							}
						throw err;
					}
				} finally { leave[0] }
		},
	});
	func.refs = fr({ args, indexes, best });
	{cannot:{"delay", "wait", "leave and return"} can:"only do"
		is:"A fundamental shortcoming, or a low-level, performance-oriented design?"}



	const isExpandable = (obj => {
		if (typeof obj==='function') return true;
		return obj && typeof obj==='object' && obj[prototype] === Object.prototype;
	});
	const build = ((from, into) => {
		if (from && from[prototype] === Array.prototype) {
			if (into && into[prototype] !== Array.prototype)
				throw "Cannot join an array into not-an-array — define the array first";
			if (!into) into = array[0];
			into.length += from.length;
			for (let i=0; i < from.length; ++i) {
				let v = build(from[i], into[i + into.length-from.length]);
				if (v !== void 0) into[i + into.length-from.length] = v;
			}
			return into;
		}
		if (!isExpandable(from) || typeof from === 'function' && !stringOf(from)) return;
		if (!into) into = func();
		let k, v;
		for (k in from)
			if (k !== 'call' && k !== 'apply') {
				v = build(from[k], into[k]);
				if (v !== void 0 && into[k] !== v) into[k] = v;
			}
		return into;
	});
	const stringOf = (f => {
		{"f(){} -> (function(){}),  ()=>{} -> (function(){})"}
		let s = f[Object.string].trim();
		let i = s.indexOf('{'), j = s.indexOf('=>');
		if (j >= 0) if (i<0 || i > j) i = j;
		{"Function args must not hide { or => inside (object destructuring or in strings)";
			("Fixing needs a lexer, to skip ()[]{}/strings/regexes — too long for small things")}
		if (s.slice(i+1, -1).trim() === '[native code]') return null;
		if (s[i] === '=') {
			let head = s[0] === '(' ? s.slice(0,i).trim() : '(' + s.slice(0,i).trim() + ')';
			let body = s.slice(i+2).trim();
			if (body[0] !== '{') body = '{return ' + body + '}'
			return '(function' + head + body.replace(/\t+/g, ' ') + ')';
		} else return '(function' + s.slice(s.indexOf('(')).replace(/\t+/g, ' ') + ')';
	});
	const path = (at => {
		let s = at[0] || 'ⴵSelf';
		for (var i=1; i < at.length; ++i)
			s += /[a-zA-Z_]+/y.test(at[i]) ? '.'+at[i] : '['+at[i]+']';
		return s;
	});
	const impl = ((into, run, refs, node) => {
		delete run.length, delete run.name;
		run.refs = refs, run.node = node, run.alt = null;
		if (into[code]) {
			into = into[code];
			while (into.alt) into = into.alt;
			into.alt = run;
		} else into[code] = run;
	});
	const mod = [], globals = { on:{} }, define = Object.create(globals);
	const compile = (o => {
		const arr = ["'use strict';"], old = array[0], free = array[0];
		const refs = Object.create(define);
		arr.args = { ⴵRefs:refs, ⴵImpl:impl, ⴵSelf:func() };
		const name = o.name || '<module>';
		let k, i = 0, at = array[0];
		if (o.define)
			for (k in o.define)
				if (k in o) throw "Shadowing own defines is not fine for a module: "+k;
		build(o, refs);
		for (k in o)
			if (!(k in refs))
				if (!isExpandable(o[k]) || typeof o[k] === 'function' && !stringOf(o[k]))
					refs[k] = o[k], delete o[k];
		for (k in refs) if (k[0] === 'ⴵ')
			throw "ⴵ is used internally — use another char eternally";
		arr.end = 'const{', arr.end = Object.keys(fr(refs)).join(','), arr.end = '}=ⴵRefs;';
		arr.end = '\n';
		const arg = (value => {
			const name = free.length ? free.end : 'ⴵ' + (i++).toString(36);
			arr.args[name] = value;
			return name;
		});
		const enter = (() => {
			const name = free.length ? free.end : 'ⴵ' + (i++).toString(36);
			arr.end='{const ', arr.end=name, arr.end='=', arr.end=path(at), arr.end=';';
			old.end = at, at = array[0], at.end = name;
		});
		const leave = (() => {
			free.end = at[0];
			arr.end = '}\n'; array['0'] = at, at = old.end;
		});
		(function self(o) {
			if (typeof o === 'function' && stringOf(o)) {
				let s = stringOf(o);
				arr.end = '{const self=', arr.end = path(at), arr.end = ';';
				arr.end = 'ⴵImpl(self,';
				arr.end = s, arr.end = ',ⴵRefs,';
				try { arr.end = arg(parse(s)) }
				catch (err) { log('When parsing this with Esprima:\n', s);  throw err }
				arr.end = ')}';
			} else if (typeof o === 'object' && isExpandable(o)) {
				let k, len=0;
				for (k in o) ++len;
				const short = at.length && (len-1) * path(at).length > 15;
				if (short) enter();
				for (k in o) if (k !== 'call') at.end = k, self(o[k]), at.end;
				if (o.call) self(o.call);
				if (short) leave();
			} else if (o && o[prototype] === Array.prototype) {
				const short = at.length && (o.length-1) * path(at).length > 15;
				if (short) enter();
				for (let i=0; i < o.length; ++i)
					at.end = ''+i, self(o[i]), at.end;
				if (short) leave();
			} else arr.end = path(at), arr.end = '=', arr.end = arg(o), arr.end = ';';
		})(o);
		array['0'] = old, array['0'] = free, array['0'] = at;
		arr.end = "return ⴵSelf";
		arr.end = '\n//# sourceURL=', arr.end = name;
		return arr;
	});
	const link = (a => Function(...Object.keys(a.args), a.join(''))(...Object.values(a.args)));



	globals.globals = globals, define.define = define;
	globals.prototype = prototype;
	globals.code = code, globals.args = args, globals.func = func, globals.before = before;
	{"Storing before is temporary now, will be useless later"}


	const performance = self.performance, process = self.process;
	const setImmediate = self.setImmediate, setTimeout = self.setTimeout;
	const time = (() => {
		if (globals.performance) return globals.performance.now();
		return globals.process ? globals.process.uptime()*1000 : 0;
	});
	const logTimes = (times => {
		let s=0, n=0, k, t;  for (k in times) s += times[k], ++n;
		for (k in times) if ((t = times[k]) > 2*s/n)
			globals.console.log(k+' took '+t.toFixed(2)+' ms ('+(t/s*100).toFixed(0)+'%)');
	});
	const freezeProp = (function self(o,k) {
		if (!self.d) self.d = { configurable:false, value:void 0, writable:false };
		if (!self.a) self.a = { configurable:false, get:void 0, set:void 0 };
		self.a.get = Object.getter(o,k), self.a.set = Object.setter(o,k);
		self.d.value = void 0;
		if (self.a.get || self.a.set) def(o, k, self.a);
		else self.d.value = o[k], def(o, k, self.d);
	});
	const asItWasSoItShallBe = (o => {
		if (!o || typeof o !== 'object' && typeof o !== 'function') return;
		if (Array.isArray(o)) return;
		let k;
		for (k in o) {
			if (!Object.owns.call(o,k)) continue;
			freezeProp(o,k);
			if (freezeProp.d.value !== void 0 && o !== o[k]) asItWasSoItShallBe(o[k]);
		}
	});
	const pb = { PrivacyBadger: 'relies on this being defined to not throw in our name.' };
	const spare = {
		code:1, self:1, devicePixelRatio:1, isSecureContext:1, GLOBAL:1, root:1,

		Math:0, Array:0, Object:pb, Function:0, Symbol:0, String:0, Map:0, Set:0,
		WeakMap:0, WeakSet:0, Int8Array:0, Int16Array:0, Int32Array:0,
		Uint8Array:0, Uint16Array:0, Uint32Array:0, Float32Array:0, Float64Array:0,

		CustomEvent:pb, Error:pb, Date:pb, setTimeout:pb, CanvasRenderingContext2D:pb,
		HTMLCanvasElement:pb, navigator:pb
	};
	const hide = (() => {
		ownNames(self).forEach(k => {
			try {
				if (typeof spare[k] === 'object')
					Object.assign(self[k], spare[k]);
				else if (!spare[k]) delete self[k];
			} catch (err) {}
		});
	});
	const hideRest = (() => {
		ownNames(self).forEach(k => {
			try { if (spare[k] !== 1) delete self[k] } catch (err) {}
		});
	});
	getset(self, 'code',
		() => {
			delete self.code;
			if (!mod.length) throw "No modules were defined";
			let prev = time();
			const qu = array[0], times = { fetchParse:prev };
			try {
				let i,k;
				for (i=0; i < mod.length; ++i) {
					if (!mod[i].define) continue;
					for (k in mod[i].define) if (k in globals) define[k] = globals[k];
					build(mod[i].define, define);
				}
				asItWasSoItShallBe(define);
				times.buildDefine = time()-prev, prev = time();
				for (i=0; i < mod.length; ++i) {
					let f = link(compile(mod[i]));
					if (f && f[code]) qu.end = f;
					times[mod[i].name || 'linkCompile'] = time()-prev, prev = time();
				}
				asItWasSoItShallBe(define);
				for (i=0; i < qu.length; ++i) {
					let f = qu[i].call(globals, define);
					if (typeof f==='function') qu.end = f;
				}
				asItWasSoItShallBe(define);
				times.run = time()-prev, logTimes(times);
				{"Deleting them all breaks js-Node and some extensions — sloppy code."}
				if (typeof process === ''+void 0) hide(), setTimeout(hideRest, 5000);
			} finally { esprima = parse = null, array['0'] = mod, array['0'] = qu }
		},
		f => {
			if (!mod.length) {
				if (process) process.nextTick(() => self.code);
				else if (setImmediate) setImmediate(() => self.code);
				else setTimeout(() => self.code, 0);
			}
			mod.push(f);
		}
	);
	self.process && require('./after.js');
	{
		const ap = Array.prototype, op = Object.prototype, fp = Function.prototype;
		const descr = ((f,k,g) => {
			f.replace = `Node.js (v10.14.2) seems to allocate 16 bytes on every function call, so try to use the Object.${k}-keyed ${g} instead of this call.`;
		});
		const replace = ((o,k, get, set) => {
			if (get && typeof get !== 'string') get = k;
			if (!get || set && typeof set !== 'string') set = k;
			if (get && !o[get] || set && !o[set]) return;
			if (!Object[k]) Object[k] = Symbol(k);
			if (typeof Object[k] !== 'symbol') throw "Unexpected Object non-symbol at " + k;
			Object.getset(o, Object[k], get ? o[get] : void 0, set ? o[set] : void 0);
			if (get) descr(o[get], k, get === set ? 'getter/setter' : 'getter');
			if (set) descr(o[set], k, get === set ? 'getter/setter' : 'setter');
		});
		let k;
		delete self.eval, delete self.content;
		replace(ap, 'start', 'shift', 'unshift');
		replace(ap, 'end', 'pop', 'push');
		replace(ap, 'sort');
		replace(ap, 'forEach');
		replace(ap, 'reverse', 'reverse');
		'concat entries every filter find findIndex flat flatMap keys lastIndexOf map reduce reduceRight shift some unshift values'.split(' ').forEach = (k => delete ap[k]);
		[Map, Set, WeakMap, WeakSet].forEach = (m => {
			delete m.entries, delete m.keys, delete m.values;
			replace(m, 'clear', 'clear');
			replace(m, 'forEach');
			replace(m, 'with', 0, 'add');
			replace(m, 'without', 0, 'delete');
		});
		const getProto = getter(op, '__proto__') || function() { return protoOf(this) };
		const setProto = (function(o) { Object.define(this, prototype, o) });
		getset(op, prototype, getProto, setProto);
		getset(op, Object.string = Symbol('.toString()'), op.toString);
		getset(fp, Object.string, fp.toString);
		ownNames(op).forEach(k => delete op[k]);
		ownNames(fp).forEach(k => k!=='call' && k!=='apply' && k!=='bind' && delete fp[k]);
		'anchor big blink bold fixed fontcolor fontsize italics link small strike sub substr sup'.split(' ').forEach = (k => delete String.prototype[k]);
		const o = { Aud:'io', CSS:'', DOM:'', HTM:'L', IDB:'', Med:'ia', Per:'formance',
			RTC:'', SVG:'', Web:'GL', eva:'l' };
		const needsBind = (f => typeof f==='function' && ownNames(f).length === 2);
		globals.HTMLCanvasElement = self.HTMLCanvasElement;
		ownNames(self).forEach(k => {
			if (spare[k] === 1) return;
			if (k.slice(0,2) === 'on') globals.on[k.slice(2)] = true;
			if (!(k.slice(0,3)in o) || k.slice(3, 3 + o[k.slice(0,3)].length) !== o[k.slice(0,3)])
				if (!(k in globals) && self[k])
					if (typeof self[k]==='function' || typeof self[k]==='object')
						globals[k] = needsBind(self[k]) ? self[k].bind(self) : self[k];
		});
	}
})(typeof self !== ''+void 0 ? self : global);




dream:{"Strings of thought can be left", "chained together, with no theft."
	"Describing functionality", "maintain orthogonality."
	"Reality can't reach it —", "first have to teach it."
	"Though it is too late", "no cost is too great."

	key:{"The goal of this is simple:", "make JS usage nimble."
		"Equivalent representations", "convenient transformations", "easy generation."

		{"Acts and expressions; imperative and functional."
		"Must this be a separate race? Is this too unclean for the base?"
			"What exactly is the base then?"
			"Compile the network, link and run. Allow it to alter reads and writes, no fun."}}

	refs:{"Take care of a rash", "clean out the trash."
		"Symbol('refs'), put in before all others.", "Value change can cut better than razors.";
		`{…}`, `[…]`, `from = to`, `new T(…)`, "those have not existed.";
		`init(T, …)`, `from = change(from, to)`, "no interface, only functions, about 2."
		"A type can have .init(…) and .deinit(), and properties ­— what name? .props? .keys?"
			"And, what type would need a dedicated init/deinit? Need a GC to do that right."}

	types:{"Each value knows its face.", "Each face can show its place.";
		`a = expect(a, Array, Number)`, "type conversions need no plumber.";
		`Array.to:[]`, "to be filled by others, with… to-type and to-value, with to-type able to be static and to-value being dynamic, called if to-type does not exist… hmm…"
			"And preferably, frequently-used type conversion paths are cached…"}

	streams:{"Async begets async.", "Incorporate on link."
		"One input at a time, some prior state, and .next()", "Can wait for all required context."
		"Class, to which any function can convert."}

	numbers:{"Numbers stood alone.", "Tensors took the throne."
		"Make operators overridable, and math will be fightable."}

	animations:{"A Mutation Observer on body is sufficient", "to make the DOM most magnificent."
		"(Showing a visual diff better)", "(Unless it's so async as to not matter)"}

	"Volume" + "is" + "scary", "Weaknesses seen rarely"
	"No will to break"; "Cannot unmake"
	"The end is clear", "this void lacks fear"
	{"Went where not one dared",
		"But no one cared."}}
//# sourceURL=before
