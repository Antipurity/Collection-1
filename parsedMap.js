'use strict';(function before(self) {
	"I stand before the beginning", "start/end difference is thinning";
	before.doc = "Cleans up the global environment, and compiles/links/executes one network module that will do the rest.";
	const mod = [], global = { before }, define = {};
	const Error = self.Error, Object = self.Object, Infinity = self.Infinity;
	const getGetter = Object.prototype.__lookupGetter__;
	const getSetter = Object.prototype.__lookupSetter__;
	const def = Object.defineProperty, lookup = Object.getOwnPropertyDescriptor;
	const ownNames = Object.getOwnPropertyNames, protoOf = Object.getPrototypeOf;
	const descr = { configurable:true, enumerable:true, get:void 0, set:void 0 };
	const hasOwnProperty = Object.prototype.hasOwnProperty;
	Object.owns = ((o,k) => hasOwnProperty.call(o,k));
	const getset = Object.getset = ((obj, k, get = void 0, set = void 0) => {
		descr.get = get, descr.set = set, def(obj, k, descr);
	});
	const getter = Object.getter = ((obj, k) => {
		if (getGetter) return getGetter.call(obj, k);
		if (obj !== getset.o || k !== getset.k)
			getset.d = lookup(getset.o = obj, getset.k = k);
		return getset.d.get;
	});
	const setter = Object.setter = ((obj, k) => {
		if (getSetter) return getSetter.call(obj, k);
		if (obj !== getset.o || k !== getset.k)
			getset.d = lookup(getset.o = obj, getset.k = k);
		return getset.d.set;
	});
	const isExpandable = (obj => {
		if (typeof obj==='function') return true;
		return obj && typeof obj==='object' && obj[Object.proto] === Object.prototype;
	});
	(() => {
		let k, ap = Array.prototype, op = Object.prototype, fp = Function.prototype;
		delete self.eval;
		getset(ap, 'start', ap.shift, ap.unshift);
		getset(ap, 'end', ap.pop, ap.push);
		getset(ap, 'sort', void 0, ap.sort);
		getset(ap, 'forEach', void 0, ap.forEach);
		getset(ap, 'reverse', ap.reverse);
		'concat entries every filter find findIndex flat flatMap keys lastIndexOf map reduce reduceRight shift some unshift values'.split(' ').forEach = (k => delete ap[k]);
		[Map, Set, WeakMap, WeakSet].forEach = (m => {
			delete m.entries, delete m.keys, delete m.values;
			if (m.clear) getset(m, 'clear', m.clear);
			if (m.forEach) getset(m, 'forEach', void 0, m.forEach);
			if (m.add) getset(m, 'with', void 0, m.add);
			if (m.delete) getset(m, 'without', void 0, m.delete);
		});
		Object.proto = Symbol('prototype');
		getset(op, Object.proto, getter(op, '__proto__') || (function() {return protoOf(this)}));
		"getters for op and fp at Object.string"
		getset(op, Object.string = Symbol('.toString()'), op.toString);
		getset(fp, Object.string, fp.toString);
		ownNames(op).forEach = (k => delete op[k]);
		ownNames(fp).forEach = (k => k!=='call' && k!=='apply' && k!=='bind' && delete fp[k]);
		'anchor big blink bold fixed fontcolor fontsize italics link small strike sub substr sup'.split(' ').forEach = (k => delete String.prototype[k]);
		let o = { Aud:'io', CSS:'', DOM:'', HTM:'L', IDB:'', Med:'ia', Per:'formance',
			RTC:'', SVG:'', Web:'GL', eva:'l' };
		ownNames(self).forEach = (k => {
			if (k === 'HTMLCanvasElement') return;
			if (!(k.slice(0,3)in o) || k.slice(3, 3 + o[k.slice(0,3)].length) !== o[k.slice(0,3)])
				if (isExpandable(self[k]) && !(k in global)) global[k] = self[k];
			if (!self.process) try { delete self[k] } catch (err) {}
		});
	})();



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
			if ('length' in iter) {
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
			for (let i=2; i < a.length && i < 8; ++i) args[indexes[i]] = a[i-2];
			for (let i=8; i < a.length && i < 16; ++i) args.r[indexes[i-8]] = a[i-2];
			for (let i=16; i < a.length; ++i) args.r[i-8] = a[i-2];
			return best[0];
		});
		delete f.name, delete f.length, f[code] = void 0;
		return f;
	});
	"Would be good to set func.refs and freeze it, no? Since it is global."
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
			let a = stack[indexes[stack.length-1] || (stack.length-1)];
			f = a[0], args.in = 0;
			args.l = a.length, args.r.length = a.length <= 8 ? 0 : a.length - 8;
			for (let i=0; i < a.length && i < 8; ++i) args[indexes[i]] = a[i];
			for (let i=8; i < a.length && i < 16; ++i) args.r[indexes[i-8]] = a[i];
			for (let i=16; i < a.length; ++i) args.r[i-8] = a[i];
		}
	});
	const callFunc = fr({
		refs: fr({ array, args, indexes }),
		get 0() {
			try {
				var a = array[0];
				a.length = args.l-2;
				for (let i=0; i < a.length && i < 6; ++i) a[indexes[i]] = args[i+2];
				for (let i=6; i < a.length; ++i) a[i] = args.r[i-6];
				return args[0].apply(args[1], a);
			} finally { array['0'] = a }
		}
	});
	const findBest = fr({
		refs: fr({ Infinity, Error, enter, leave, restore, code }),
		get 0() {
			try {
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
							a.sort = ((i,j) => (restore[0], +f.cost[i]) - (restore[0], +f.cost[j]));
							for (i=0; i < a.length; ++i)
								try { return restore[0], f[a[i]] }
								catch (e) { if (e === void 0 || e instanceof Error) throw e }
						} finally { array['0'] = a }
					else
						for (i=0; i in f; ++i) {
							if (i !== mini && +f.cost[i] < Infinity)
								try { return restore[0], f[i] }
								catch (e) { if (e === void 0 || e instanceof Error) throw e }
							(i+1) in f && restore[0];
						}
					throw err;
				}
			} finally { leave[0] }
		}
	});
	const best = fr({
		refs: fr({ Infinity, args, callFunc, enter, leave, restore, findBest, code }),
		get 0() {
			args.in = 0;
			if (!args[0]) return;
			let f = args[0][code];
			if (typeof f==='function') args['0'] = f, f = 0;
			if (!f) return callFunc[0];
			else if (!f || typeof f!=='object') throw"Calling not-a-function";
			else if (!(0 in f)) throw"Calling an unimplemented function";

			if (!(1 in f) || !f.cost || typeof f.cost!=='object') {
				if (1 in f) return f[0];
				try {
					enter[0];
					if (!(+f.cost[0] < Infinity)) throw Infinity;
					return restore[0], f[0];
				} finally { leave[0] }
			} else return findBest[0];
		},
	});
	{cannot:{"delay", "wait", "leave and return"} can:"only do"
		is:"A fundamental shortcoming, or a low-level, performance-oriented design?"}



	const build = ((from, into) => {
		if (!isExpandable(from)) return;
		if (!into) into = func();
		for (let k in from)
			if (k !== 'call' && k !== 'apply') {
				let v = build(from[k], into[k]);
				if (v !== void 0) into[k] = v;
			}
		return into;
	});
	const stringOf = (f => {
		"f(){} -> (function self(){}),  ()=>{} -> (function self(){})"
		let s = f[Object.string].trim();
		let i = s.indexOf('{'), j = s.indexOf('=>');
		if (j >= 0) if (i<0 || i > j) i = j;
		"Function arguments must not have { or => inside them (object destructuring or in strings)"
		if (s.slice(i+1, -1).trim() === '[native code]') return null;
		if (s[i] === '=') {
			let head = s[0] === '(' ? s.slice(0,i).trim() : '(' + s.slice(0,i).trim() + ')';
			let body = s.slice(i+2).trim();
			if (body[0] !== '{') body = '{return ' + body + '}'
			return '(function self' + head + body.replace(/\s+/g, ' ') + ')';
		} else return '(function self' + s.slice(s.indexOf('(')).replace(/\s+/g, ' ') + ')';
	});
	const compile = (o => {
		if (!o.call) throw"First module must be callable";
		let arr = ["'use strict';"], k, refs = {}, i = 0, at = [];
		arr.args = { $refs:refs, $code:code, $self:func() };
		for (k in global) refs[k] = global[k];
		for (k in define) refs[k] = define[k];
		build(o, refs);
		arr.end = 'const{', arr.end = Object.keys(fr(refs)).join(','), arr.end = '}=$refs;';
		const lets = [];
		for (k in o) if (!isExpandable(o[k])) lets.end = k;
		if (lets.length) arr.end = 'let ', arr.end = lets.join(','), arr.end = ';';
		(function self(o) {
			if (typeof o === 'function' && stringOf(o)) {
				arr.end = '(';
				arr.end = at.length ? at.join('.') : '$self';
				"Path must not contain non-js-identifiers";
				arr.end = '[$code]=';
				arr.end = stringOf(o);
				arr.end = ').refs=$refs;'
			} else if (typeof o === 'object' && isExpandable(o)) {
				let k;
				for (k in o) if (k !== 'call') at.end = k, self(o[k]), at.end;
				if (o.call) self(o.call);
			} else {
				const name = '$' + (i++).toString(36);
				arr.args[name] = o;
				arr.end = at.join('.'), arr.end = '=', arr.end = name, arr.end = ';';
			}
		})(o);
		arr.end = "return $self";
		arr.end = '\n//# sourceURL=', arr.end = o.name || 'first';
		return arr;
	});
	const link = (a => Function(...Object.keys(a.args), a.join(''))(...Object.values(a.args)));



	global.code = code, global.args = args, global.func = func;
	getset(self, 'code',
		() => {
			delete self.code;
			if (!mod.length) throw"No modules were defined";
			try {
				for (let i=0; i < mod.length; ++i) build(mod[i].define, define);
				link(compile(mod[0])).call(global, define, mod);
			} finally { mod.length = 0 }
		},
		f => {
			if (!mod.length) {
				if (global.process) global.process.nextTick(() => global.code);
				else if (global.setImmediate) global.setImmediate(() => global.code);
				else global.setTimeout(() => global.code, 0);
			}
			mod.end = f;
		}
	);
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
		"A type can have .init(…) and .deinit(), and properties ­— what name?"
			"And, what type would need a dedicated init/deinit? Need a GC to do that right."}

	types:{"Each value knows its face.", "Each face can show its place.";
		`a = expect(a, Array, Number)`, "type conversions need no plumber.";
		`Array.to:[]`, "to be filled by others, with… to-type and to-value, with to-type able to be static and to-value being dynamic, called if to-type does not exist… hmm…"
			"And preferably, frequently-used type conversion paths are cached…"}

	streams:{"Async begets async.", "Incorporate on link."
		"One input at a time, some prior state, and .next()", "Can wait for all required context."
		"Class, to which any function can convert."}

	numbers:{"Numbers stood alone.", "Tensors took the throne."
		}

	animations:{"A Mutation Observer on body is sufficient", "to make the DOM most magnificent."
		"(Showing a visual diff better)", "(Unless it's so async as to not matter)"}

	"Volume" + "is" + "scary", "Weakness seen rarely"
	"No will to break"; "Cannot unmake"
	"The end is clear", "this void lacks fear"}







"We don't even need to work in the same file as this, do we?"
"We can connect the network code separately."
"This should be before.js; that should be after.js. United by face.html."











"No, this format will not do."
"Instead, define a network module, that will init the rest."
'use strict';'use restrict';(function base(self) {
	(function() { if (this) throw "Strict mode unsupported" })();
	let Array = self.Array, Error = self.Error, Function = self.Function, Object = self.Object;
	let RegExp = self.RegExp, Symbol = self.Symbol;
	let Map = self.Map, Set = self.Set, WeakMap = self.WeakMap, WeakSet = self.WeakSet;
	Object.seal('ES2015');
	let Panic = function Panic(msg) { this.message = msg };
	Panic.prototype = Object.create(Error.prototype);
	let cache = Array.cache = [];
	let esprima = self.esprima || require('./esprima.js');
		//Esprima is bad with brackets — (a.b)() is the same as a.b(), and (-1)**2 is an error.



	let freeze = Object.freeze, seal = Object.seal;
	let refd = ((f,r) => {
		delete f.name, delete f.length;
		return f.refs = freeze(r), f;
	});
	refd.refs = freeze({ freeze });



	let args = seal({
		0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6, 7:7, r:[], l:0, in:0,
		set next(v) {
			if (args.l < 8) args[indexes[args.l]] = v;
			else if (args.l < 16) args.r[indexes[args.l - 8]] = v;
			else args.r[args.l] = v;
			++args.l;
		},
		set spread(iter) {
			if ('length' in iter) {
				args.r.length = args.l + iter.length <= 8 ? 0 : args.l + iter.length - 8;
				for (var i=0; i < iter.length; ++i) args.next = iter[i];
			} else for (var i of iter) args.next = i;
		},
		set this(o) { args['1'] = o },
		set method(name) { args['0'] = args[1][name]; args.l = 2 },
		get next() {
			if (args.in < args.l)
				return args.in < 8 ? args[args.in++] : args.r[args.in++ - 8];
		},
		get rest() {
			var a = array[0];
			while (args.in < args.l) a.end = args.next;
			return a;
		},
		set rest(a) { array['0'] = a },

		set at(i) { stack.i[indexes[stack.i.length-1] || (stack.i.length-1)] = i },
	});
	let indexes = freeze({ 0:'0', 1:'1', 2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7' });
	let call = self.call = (function(...a) {
		if (typeof this==='function') return this.call(...a);
		if (!this || typeof this!=='object') return this;
		args.l = a.length+1, args.r.length = a.length <= 7 ? 0 : a.length - 7;
		args.l = a.length;
		if (a.length > 8) args.r.length = a.length - 8;
		args['0'] = this;
		for (var i=1; i < a.length && i < 8; ++i) args[indexes[i]] = a[i-1];
		for (var i=8; i < a.length && i < 16; ++i) args.r[indexes[i-8]] = a[i-1];
		for (var i=16; i < a.length; ++i) args.r[i-8] = a[i-1];
		return best[0];
	});



	let array = {
		refs: freeze({ cache, indexes }),
		get 0() {
			var a = cache[cache.length-1];
			return cache.length ? (--cache.length, a) : [];
		},
		set 0(a) {
			a.length = 0;
			cache.end = a;
		}
	};
	let f, stack = [];
	stack.i = [], stack.from = [], stack.from.i = [];
	let enter = {
		get 0() {
			for (var i=0; i < stack.from.length; ++i) array['0'] = stack.from[i];
			stack.from.length = 0;
			stack.from.i.length = 0;
			var a = array[0];
			a.length = args.l;
			for (var i=0; i < a.length && i < 8; ++i) a[indexes[i]] = args[i];
			for (var i=8; i < a.length; ++i) a[i] = args.r[i-8];
			stack.end = a, stack.i.end = 0;
		}
	};
	let leave = {
		get 0() {
			if (!stack.length) throw new Panic("Left without entering the call stack");
			var from = stack, to = stack.from;
			to[indexes[to.length-1] || (to.length-1)] = from[from.length-1], --from.length;
			from = stack.i, to = stack.from.i;
			to[indexes[to.length-1] || (to.length-1)] = from[from.length-1], --from.length;
		}
	};
	let restore = {
		get 0() {
			var a = stack[indexes[stack.length-1] || (stack.length-1)];
			f = a[0].call, args.in = 0;
			args.l = a.length, args.r.length = a.length <= 8 ? 0 : a.length - 8;
			for (var i=0; i < a.length && i < 8; ++i) args[indexes[i]] = a[i];
			for (var i=8; i < a.length && i < 16; ++i) args.r[indexes[i-8]] = a[i];
			for (var i=16; i < a.length; ++i) args.r[i-8] = a[i];
		}
	};
	let callFunc = {
		get 0() {
			try {
				var a = array[0];
				a.length = args.l-2;
				for (var i=0; i < a.length && i < 6; ++i) a[indexes[i]] = args[i+2];
				for (var i=6; i < a.length; ++i) a[i] = args.r[i-6];
				return f(args[1], ...a);
			} finally { array['0'] = a }
		}
	};
	let findBest = {
		get 0() {
			try {
				enter[0];
				var mini = 0, min = Infinity, max = -Infinity;
				for (var i=0; i in f; ++i) {
					var a = +f.cost[i];
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
							var a = array[0];
							for (var i=0; i in f; ++i) {
								if (i !== mini && +f.cost[i] < Infinity) a.end = i;
								(i+1) in f && restore[0];
							}
							a.sort = ((i,j) => (restore[0], +f.cost[i]) - (restore[0], +f.cost[j]));
							for (var i=0; i < a.length; ++i)
								try { return restore[0], f[a[i]] }
								catch (e) { if (e === void 0 || e instanceof Error) throw e }
						} finally { array['0'] = a }
					else
						for (var i=0; i in f; ++i) {
							if (i !== mini && +f.cost[i] < Infinity)
								try { return restore[0], f[i] }
								catch (e) { if (e === void 0 || e instanceof Error) throw e }
							(i+1) in f && restore[0];
						}
					throw err;
				}
			} finally { leave[0] }
		}
	};
	let best = {
		get 0() {
			if (!args[0]) return;
			f = args[0].call, args.in = 0;
			if (typeof f==='function') callFunc[0];
			else if (!f || typeof f!=='object' || !(0 in f)) return f;

			if (!(1 in f) || !f.cost || typeof f.cost!=='object') {
				if (1 in f) return f[0];
				try {
					enter[0];
					if (!(+f.cost[0] < Infinity)) throw Infinity;
					return restore[0], f[0];
				} finally { leave[0] }
			} else return findBest[0];
		},
	};



	let funcStr = Function.prototype.toString, objStr = Object.prototype.toString;
	let owns = Object.prototype.hasOwnProperty;
	let lookupGetter = Object.prototype.__lookupGetter__;
	let lookupSetter = Object.prototype.__lookupSetter__;
	let define = Object.defineProperty, lookup = Object.getOwnPropertyDescriptor;
	let ownNames = Object.getOwnPropertyNames, protoOf = Object.getPrototypeOf;
	let descr = { configurable:true, enumerable:true, get:void 0, set:void 0 };
	let getset = ((obj, k, get = void 0, set = void 0) => {
		descr.get = get, descr.set = set, define(obj, k, descr);
	});
	let getter = ((obj, k) => {
		if (lookupGetter) return lookupGetter.call(obj, k);
		if (obj !== getset.o || k !== getset.k)
			getset.d = lookup(getset.o = obj, getset.k = k);
		return getset.d.get;
	});
	let setter = ((obj, k) => {
		if (lookupSetter) return lookupSetter.call(obj, k);
		if (obj !== getset.o || k !== getset.k)
			getset.d = lookup(getset.o = obj, getset.k = k);
		return getset.d.set;
	});
	let prototype = Symbol('prototype');
	let clearGlobals = (() => {
		let k, ap = Array.prototype, op = Object.prototype, fp = Function.prototype;
		delete self.eval, delete self.code;
		getset(ap, 'start', ap.shift, ap.unshift);
		getset(ap, 'end', ap.pop, ap.push);
		getset(ap, 'sort', void 0, ap.sort);
		getset(ap, 'forEach', void 0, ap.forEach);
		getset(ap, 'reverse', ap.reverse);
		'concat entries every filter find findIndex flat flatMap keys lastIndexOf map reduce reduceRight shift some unshift values'.split(' ').forEach = (k => delete ap[k]);
		[Map, Set, WeakMap, WeakSet].forEach = (m => {
			delete m.entries, delete m.keys, delete m.values;
			if (m.clear) getset(m, 'clear', m.clear);
			if (m.forEach) getset(m, 'forEach', void 0, m.forEach);
			if (m.add) getset(m, 'with', void 0, m.add);
			if (m.delete) getset(m, 'without', void 0, m.delete);
		});
		getset(op, prototype, getter(op, '__proto__') || (function() { return protoOf(this) }));
		ownNames(op).forEach = (k => delete op[k]);
		ownNames(fp).forEach = (k => k!=='call' && k!=='apply' && k!=='bind' && delete fp[k]);
		'anchor big blink bold fixed fontcolor fontsize italics link small strike sub substr sup'.split(' ').forEach = (k => delete String.prototype[k]);
	});



	//We should probably have some facility for defining eqvs from modules, because init/deinit and new->init & set->transfer & finally->deinit should really be in the same spot.
		//A function, or a prop within a module?
			//A prop within a module requires a defining-props facility.
	//Should we maybe have a starter-stage network module, which primitively compiles one module via simple string concatenation (with each-func-refs-everything), which will actually do the setup?
		//Yeah, maybe even directly in HTML; on setting self.code, clears globals, creates a function of functions with every method as vars inside and calling .call (what to execute with this=self) and executes it — and that's all there is to this kickstarter. Ignore .define/.eqv/.interval/.on/….
			//Actually, we want to collect all module requests, and exec the first one, passing the rest, in the context of the definitions of all. To allow binding-to-later.



	let ok, forbid = (node => { throw "Node type is forbidden: " + node.type });
	let rename = ((node, from, to) => {
		if (node[from] === void 0) throw new Error("Node property renaming's from is invalid");
		node[to] = node[from], delete node[from];
	});
	let func = (node => {
		if (node.generator) throw "Generator functions are forbidden.";
		if (node.async) throw "Async functions are forbidden.";
		delete node.generator, delete node.expression, delete node.async;
		rename(node, 'id', 'name');
		rename(node, 'params', 'of');
		rename(node, 'body', 'do');
		if (node.type !== 'ArrowFunction')
			node.of.start = { type:'Identifier', name:'this' };
		else
			node.of.start = null, node.type = 'Function';
	}), conditional = (node => {
		rename(node, 'test', 'if');
		rename(node, 'consequent', 'then');
		rename(node, 'alternate', 'else');
	}), sanerLetInFor = (node => {
		delete node.each;
		rename(node, 'body', 'do');
		node.test && rename(node, 'test', 'while');
		node.right && rename(node, 'right', 'of');
		node.left && rename(node, 'left', 'key');
		var v = node.init || node.key;
		if (v.type === 'VariableDeclaration' && v.kind !== 'var') {
			//actually, maybe we should do this on write (and recognize that here), not right here?
				//replace on read, or replace on write? Analysis.
					//read: user forced to look at {let i;for(…)…}, but js semantics unchanged.
					//write: nice-looking for(let i;…)…, but js semantics change — like they will anyway with a<b<c, or new->init.
			if (v.of.length !== 1) throw "invalid declarations length";
			var n = v.of[0];
			node.type === 'For' ? (node.init = n) : (node.key = n);
			node = { type:'Block', do:[v, node] };
			v.of.length = 0;
			collectVars(n, id => v.of.end = id);
			return node;
		}
	});
	let identifierToLiteral = (k => {
		if (k.type !== 'Identifier') throw "Expected an Identifier node, got " + k.type;
		k.type = 'Literal', k.value = k.name, k.raw = "'" + k.name + "'", delete k.name;
	});
	let isIdentifier = (k => {
		k.type==='Literal' && typeof k.value==='string' && /[$_a-zA-Z][$_a-zA-Z0-9]*/y.test(k.value);
	});
	let childrenFirst = (map => {
		return refd((function self(node) {
			if (!node || typeof node !== 'object') return node;
			if ('length' in node) {
				for (var k=0; k < node.length; ++k) node[indexes[k] || k] = self(node[k]);
				return node;
			}
			for (var k in node)
				if (k !== 'type' && k.slice(-8) !== 'Comments')
					node[k] = self(node[k]);
			if (!node.type) return node;
			if (node.type.slice(-10) === 'Expression') node.type = node.type.slice(0, -10);
			else if (node.type.slice(-9) === 'Statement') node.type = node.type.slice(0, -9);
			return map[node.type] && (k = map[node.type](node)) !== void 0 ? k : node;
		}), { map });
	});
	let compareNodes = (function self(a,b) {
		if (a.type !== b.type) return a.type < b.type ? -1 : b.type < a.type ? 1 : 0;
		try {
			var keys = array[0];
			for (var k in a)
				if (k !== 'type' && k.slice(-8) !== 'Comments')
					keys.end = k;
			keys.sort = void 0;
			for (var i=0; i < keys.length; ++i)
				if ((k = self(a[keys[i]], b[keys[i]])) < 0) return -1;
				else if (k > 0) return 1;
			return 0;
		} finally { array['0'] = keys }
	});
	let unaryToBinary = (node => {
		node.type = node.type === 'Unary' ? 'Binary' : 'Assignment';
		if (node.prefix)
			node.left = null, rename(node, 'argument', 'right');
		else
			rename(node, 'argument', 'left'), node.right = null;
		delete node.prefix;
	});
	let templateStrings = ((str, raw) => { return str.raw = raw, str });
	let unescapes = { ['\\']:'\\', n:'\n', r:'\r', t:'\t', b:'\b', f:'\f', v:'\v', 0:'\0' };
	let unescape = (raw => {
		if (typeof raw !== 'string') return null;
		try {
			var s = raw.replace(/\\x(?:[^]{2}|)/g, s => {
				if (s.length !== 4 || isNaN(s = parseInt(s.slice(2), 16))) throw null;
				return String.fromCodePoint(s);
			});
			s = s.replace(/\\u\{.*\}/g, s => {
				if (isNaN(s = parseInt(s.slice(2, -1), 16))) throw null;
				return String.fromCodePoint(s);
			});
			s = s.replace(/\\u(?:[^]{4}|)/g, s => {
				if (s.length !== 6 || isNaN(s = parseInt(s.slice(2), 16))) throw null;
				return String.fromCodePoint(s);
			});
			s.replace(/\\0[0-9]/g, () => { throw null });
			return s.replace(/\\(?:n|r|t|b|f|v|0)/g, s =>  unescapes[s[1]]);
		} catch (err) { if (err===null) return null; else throw err }
	});
	let correctArray = (node => { node.type = 'Array', rename(node, 'elements', 'of') });
	let correctObject = (node => {
		node.type = 'Object', rename(node, 'properties', 'of'), node.of.sort = compareNodes;
	});
	let correct = childrenFirst({
		Assignment: ok,
		AssignmentPattern(node) { node.type = 'Assignment', node.operator = '=' },
		Array: correctArray,
		ArrayPattern: correctArray,
		ArrowFunction: func,
		Await: forbid,
		Block(node) { rename(node, 'body', 'do') },
		Binary: ok,
		Break: ok,
		Call(node) { rename(node, 'callee', 'function'), rename(node, 'arguments', 'of') },
		CatchClause(node) { rename(node, 'param', 'on'), rename(node, 'body', 'do') },
		ClassBody: forbid,
		ClassDeclaration: forbid,
		Class: forbid,
		Conditional: conditional,
		Continue: ok,
		DoWhile(node) { rename(node, 'body', 'do'), rename(node, 'test', 'while') },
		Debugger: forbid,
		Empty(node) { node.type = 'Block', node.do = [] },
		ExportAllDeclaration: forbid,
		ExportDefaultDeclaration: forbid,
		ExportNamedDeclaration: forbid,
		ExportSpecifier: forbid,
		Expression(node) { return node.expression },
		For: sanerLetInFor,
		ForOf: sanerLetInFor,
		ForIn: sanerLetInFor,
		FunctionDeclaration: func,
		Function: func,
		Identifier(node) { if (node.name === 'undefined') return void0 },
		If: conditional,
		ImportDeclaration: forbid,
		ImportDefaultSpecifier: forbid,
		ImportNamespaceSpecifier: forbid,
		ImportSpecifier: forbid,
		Literal(node) { delete node.regex },
		Labeled(node) { rename(node, 'body', 'do') },
		Logical(node) { node.type = 'Binary' },
		Member(node) {
			rename(node, 'property', 'key'), rename(node, 'object', 'of');
			if (!node.computed) identifierToLiteral(node.key);
			delete node.computed;
		},
		MetaProperty: forbid,
		MethodDefinition: forbid,
		New(node) { rename(node, 'callee', 'function'), rename(node, 'arguments', 'of') },
		Object: correctObject,
		ObjectPattern: correctObject,
		Program(node) {
			delete node.sourceType;
			if (node.body.length === 1) return node.body[0];
			node.type = 'Block', rename(node, 'body', 'do');
		},
		Property(node) {
			if (!node.computed && node.key.type === 'Identifier') identifierToLiteral(node.key);
			if (node.kind === 'init') node.kind = '';
			delete node.computed, delete node.method, delete node.shorthand;
		},
		RestElement(node) { rename(node, 'argument', 'of') },
		Return(node) { rename(node, 'argument', 'of') },
		Sequence(node) { rename(node, 'expressions', 'of') },
		SpreadElement(node) { rename(node, 'argument', 'of') },
		Super: forbid,
		SwitchCase(node) { rename(node, 'test', 'on'), rename(node, 'consequent', 'do') },
		Switch(node) { rename(node, 'discriminant', 'on'), rename(node, 'cases', 'do') },
		TaggedTemplate(node) {
			var tag = node.tag, template = node.quasi;
			delete node.tag, delete node.quasi;
			node.type = 'Call', node.function = tag;
			var args = [{ type:'Array', of:template.value }, { type:'Array', of:template.raw }];
			node.of = [{ type:'Call', function:{ type:'Ref', to:templateStrings }, of:args }];
			for (var i=0; i < template.expressions.length; ++i)
				node.of.end = template.expressions[i];
		},
		TemplateElement: ok,
		TemplateLiteral(node) {
			var elems = node.quasis;  delete node.quasis;
			var value = node.value = [], raw = node.raw = [];
			for (var i=0; i < elems.length; ++i) {
				raw.end = literal(elems[i].value.raw);
				if (elems[i].value.cooked !== unescape(elems[i].value.raw))
					throw "In a received template, raw does not turn into value correctly";
				value.end = elems[i].value.cooked ? literal(elems[i].value.cooked) : void0;
			}
		},
		This(node) { node.type = 'Identifier', node.name = 'this' },
		Throw(node) { rename(node, 'argument', 'of') },
		Try(node) {
			rename(node, 'block', 'try');
			rename(node, 'handler', 'catch');
			rename(node, 'finalizer', 'finally');
		},
		Unary: unaryToBinary,
		Update: unaryToBinary,
		VariableDeclaration(node) { rename(node, 'declarations', 'of') },
		VariableDeclarator(node) {
			if (node.init) {
				node.type = 'Assignment';
				node.operator = '=';
				rename(node, 'id', 'left');
				rename(node, 'init', 'right');
			} else return node.id;
		},
		While(node) { rename(node, 'test', 'while'), rename(node, 'body', 'do') },
		With: forbid,
		Yield: forbid
	});
	let dispatch = ( map => refd(node => map[node.type](node), { map }) );
	let parseLiteral = (raw => {
		if (raw[0] === "'") {
			if (raw[raw.length-1] !== "'") return;
			return unescape(raw.slice(1,-1).replace(/\\'/g, "'"));
		} else if (raw[0] === '"') {
			if (raw[raw.length-1] !== '"') return;
			return unescape(raw.slice(1,-1).replace(/\\"/g, '"'));
		} else if (raw[0] === '/') {
			let to = raw.lastIndexOf('/');
			if (!to) return;
			return RegExp(raw.slice(1, to), raw.slice(to + 1))
		} else if (raw === 'null') return null;
		else if (raw === 'NaN') return NaN;
		else return isNaN(+raw) ? void 0 : +raw;
	});
	let isExprWrong = (node => {
		if (!node) return 1;
		if (node.type.slice(-11) === 'Declaration') return 1;
		//not CatchClause, Property, RestElement, SwitchCase.
		//SpreadElement can only be inside Array/Call/New.
		//Identifier — not arguments or eval or null.
		//Literal — check that .raw parses into .value…
			//Should have a function, parseLiteral(raw)→value, and check.
			//Except, template literals return a (new) object, and we should check in another way…
				//Check .flags and .source after parsing (since flags can be re-ordered).
	});
	let isTargetWrong = (function self(node) {
		if (!node) return 1;
		if (node.type === 'Identifier') {
			if (['this', 'Infinity', 'NaN', 'arguments', 'eval'].includes(node.name)) return 1;
			return;
		} else if (node.type === 'Assignment') {
			if (!self.destructure) return 1;
			if (node.operator !== '=') return 1;
			if (self(node.left)) return 1;
			if (isExprWrong(node.right)) return 1;
		} else if (node.type === 'Array')
			for (var i=0; i < node.of.length; ++i) {
				if (node.of[i].type === 'RestElement' && node.of[i].of.type !== 'Identifier')
					//…wait; can we do [...a.a]=[]?
						//yes, we can, unless !.member;
							//how to, uh, temporarily set .destructure to false?
					//Also, a rest element can only occur at the end of an array.
					return 1;
				if (self(node.of[i].type === 'RestElement' ? node.of[i].of : node.of[i]))
					return 1;
			}
		else if (node.type === 'Member') {
			if (!self.members) return 1;
			if (self(node.of)) return 1;
			if (isExprWrong(node.key)) return 1;
		} else if (node.type === 'Object') {
			if (!self.destructure) return 1;
			if (node.kind !== '' && node.kind !== 'get' && node.kind !== 'set') return 1;
			if (self(node.value)) return 1;
			if (isExprWrong(node.key)) return 1;
		} else return 1;
	});
	let isWrong = dispatch({
		//probably want to pass not the full-constructed node, but its values, right?
		Assignment(node) {
			var op = node.operator;
			if (op === '++' || op === '--') {
				if (!op.left === !op.right) return 1;
				isTargetWrong.destructure = false, isTargetWrong.member = true;
				if (isTargetWrong(op.left || op.right)) return 1;
			} else {
				if (op[op.length-1] !== '=') return 1;
				else if (op !== '=' && !operators.includes(op.slice(0, -1))) return 1;
				isTargetWrong.destructure = true, isTargetWrong.member = true;
				if (isTargetWrong(op.left)) return 1;
				if (isExprWrong(op.right)) return 1;
			}
		},
		//…Before we continue.
			//Is there a way to represent all this checking in such a way that generating syntactically-possible alternatives is also handled in one fell swoop, kinda like with writing?
			//Like, use a set of easily-swappable functions, that make sense in both.
				//Which ones?
			//…Also, with return, we must have `if(check)return 1;` everywhere; with throw, `check`.
			//(Also, these should be basic-validations, to be used in node(…), not full tree checks.)
	});
	//Should have checkWith(map).
	process.nextTick(() => console.log(JSON.stringify(read(`NaN`), null, 2)));



	let keys = (() => {
		var binary = ['operator', 'left', 'right'];
		var of = ['of'], ofMany = ['of', '…'];
		var label = ['label'];
		var call = ['function', 'of', '…'];
		var match = ['on', 'do', '…'];
		var cond = ['if', 'then', 'else'];
		var forEach = ['key', 'of', 'do'];
		var func = ['name', 'do', 'of', '…'];
			//…shouldn't function args always bind to the same thing, so that trivially-equivalent function nodes can always be restored?
				//but, in `a => b => a`, do we really want the a of different functions to refer to the same thing? And in `a => { var a; b=>a }`, to different each time…
		//Won't having different identifier objects for each function result in things like void0 having way, way too many useless-for-other-functions .in entries?
			//How to resolve it?
		return {
			Assignment: binary,
			Array: ofMany,
			Block: ['do', '…'],
			Binary: binary,
			Break: label,
			Call: call,
			CatchClause: ['on', 'do'],
			Conditional: cond,
			Continue: label,
			DoWhile: ['do', 'while'],
			For: ['init', 'while', 'update', 'do'],
			ForOf: forEach,
			ForIn: forEach,
			FunctionDeclaration: func,
			Function           : func,
			Identifier: ['name'],
			If: cond,
			Literal: ['value', 'raw'],
			Labeled: ['label', 'do'],
			Member: ['of', 'key'],
			New: call,
			Object: ofMany,
			Property: ['kind', 'key', 'value'],
			Ref: ['to'],
			RestElement: of,
			Return: of,
			Sequence: ofMany,
			SpreadElement: of,
			SwitchCase: match,
			Switch: match,
			TemplateLiteral: ['value', 'raw', 'expressions'],
			Throw: of,
			Try: ['try', 'catch', 'finally'],
			VariableDeclaration: ['kind', 'of', '…'],
			While: ['while', 'do'],
		};
	})();
	let types = (() => {
		let expr = 'Assignment Array Binary Call Conditional Function Identifier Literal Member New Object Ref Sequence TemplateLiteral'.split(' ');
		let maybeExpr = [...expr, null];
		let act = [...expr, ...'Block Break Continue DoWhile For ForOf ForIn FunctionDeclaration If Labeled Return Switch Throw Try VariableDeclaration While'.split(' ')];
		let target = ['Identifier', 'Member', 'Array', 'Object'];
		let funcArgs = ['Assignment', 'Array', 'Identifier', 'Object', 'RestElement'];
		let callArgs = [...expr, 'SpreadElement'];
		let op = '** * / % + - << >> >>> & ^ |'.split(' ');
		let strings = (...str) => {
			let o = {};
			for (var i=0; i < str.length; ++i) o[str[i]] = 1;
			return o;
		};
		let type = {};
		for (var k in keys)
			type[k] = expr.includes(k) ? 'expr' : act.includes(k) ? 'act' : 'part';
		let identifier = ['Identifier'];
		let arg = [expr];
		let exprAct = [expr, act];
		let forOfIn = [['VariableDeclaration', ...target], expr, act];
		let call = [expr, callArgs];
		return {
			type,
			Assignment: [
				strings('=', '++', '--', ...op.map(s => s+'=')),
				[...target, null], maybeExpr
			],
			Array: [[...maybeExpr, 'RestElement', 'SpreadElement']],
			Block: [act],
			Binary: [
				strings(...'! && || ~ < <= > >= === !== void typeof delete == !='.split(' '), ...op),
				maybeExpr, expr
			],
			Break: identifier,
			Call: call,
			CatchClause: ['Identifier', 'Block'],
			Conditional: [expr, expr, expr],
			Continue: identifier,
			DoWhile: [act, expr],
			For: [['VariableDeclaration', ...maybeExpr], maybeExpr, maybeExpr, act],
			ForOf: forOfIn,
			ForIn: forOfIn,
			FunctionDeclaration: ['Identifier', 'Block', funcArgs],
			Function           : [['Identifier', null], ['Block', ...expr], funcArgs],
				//maybe we should make ()=>expr into ()=>{return expr} on reading…
			Identifier: void 0,
			If: [expr, act, [...act, null]],
			Literal: void 0,
			Labeled: ['Identifier', act],
			Member: [expr, expr],
			New: call,
			Object: ['Property'],
			Property: [strings('', 'get', 'set'), expr, expr],
			Ref: void 0,
			RestElement: identifier,
			Return: arg,
			Sequence: arg,
			SpreadElement: arg,
			SwitchCase: exprAct,
			Switch: exprAct,
			TemplateLiteral: void 0,
				//what are value/raw/expressions?
					//arrays (str/str/expr)… so they don't seem to fit into even the node system.
					//should really make strings and expressions into a single array, so they do.
						//No .value, only .raw — and Literal should follow this too.
			Throw: arg,
			Try: ['Block', ['CatchClause', null], ['Block', null]],
			VariableDeclaration: [strings('var', 'let', 'const'), ['Assignment', 'Identifier']],
			While: exprAct,
		};
	})();



	let node = (function self(type, ...values) {
		try {
			if (!keys[type]) throw "Unknown node type: " + type;
			var k = keys[type], spread = k[k.length-1] === '…', end = k.length - (spread ? 2 : 0);
			if (values.length < end) throw "Too few args for a node, expected " + k;
			if (!spread && values.length > end) throw "Too much args for a node, expected " + k;

			//Want to validate the node first before creating it.
			if (types[type]) {
				//
			}

			if (type === 'Ref') {
				let refs = self.refs || (self.refs = new WeakMap);
				if (!Number.isSafeInteger(self.count))
					self.count = 0, self.prefix = 'ⵔ' + (self.prefix || '');
				if (!refs.has(values[0])) {
					k = self.prefix + (self.count++).toString(36);
					refs.set(values[0], { type, to:values[0], name:k })
				}
				return refs.get(values[0]);
			} else {
				for (var i=0; i < values.length; ++i)
					if (values[i].in) for (var j=0; j < values[i].in.length; ++j) {
						var node = values[i].in[j];
						for (var z=0; z < end; ++z)
							if (node[k[z]] !== values[z]) continue;
						if (!spread) return node;
						else {
							spread = node[k[end]];
							if (spread.length + end !== values.length) continue;
							for (var z = end; z < values.length; ++z)
								if (spread[z-end] !== values[z]) continue;
							return node;
						}
					}
				node = { type };
					//Should every node be an instance of the same class, or are just objects enough?
						//An instance is probably better — except, there isn't a one-for-all set of property names…
				for (var i=0; i < values.length; ++i)
					(values[i].in || (values[i].in = array[0])).end = node;
				for (var i=0; i < end; ++i) node[k[i]] = values[i]
				if (spread)
					for (var spread = node[k[end]] = array[0], i = end; i < values.length; ++i)
						spread.end = values[i];
				return node;
			}
		} finally { array['0'] = values }
	});
		//Post var merging, re-build tree from identifiers, literals, refs — from the ground up.
		//In any equivalent transformations, build up the result with node().
	//And forgetNode(node), removing it from …values.in, recursively removing them if now needed.
		//(Put it into a Set, which is cleared async — allowing batching.)



	//assign/member should probably be replaced with node().
	let assign = ((left, right) => {
		return { type:'Assignment', operator:'=', left, right }
	});
	let member = ((o,k) => {
		return { type:'Member', object:o, property:k }
	});
	let literal = (v => {
		if (typeof v==='string') {
			var raw = "'" + v.replace(/'/g, "\\'").replace(/\\/g, "\\\\") + "'";
			raw = raw.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
			raw = raw.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
		} else
			var raw = String(v);
		return { type:'Literal', value:v, raw }
	});
	let void0 = { type:'Binary', operator:'void', left:null, right:literal(0) };
	let getterExecution = {
		to:childrenFirst({
			Call(node) {
				var expr = [], args = { type:'Ref', to:args }, next = literal('next');
				expr.end = assign(member(args, literal('l')), literal(0));
				if (node.function.type === 'Member') {
					expr.end = assign(member(args, literal('this')), node.function.of);
					expr.end = assign(member(args, literal('method')), node.function.key);
				} else {
					expr.end = assign(member(args, literal('next')), node.function);
					expr.end = assign(member(args, literal('next')), void0);
				}
				for (var i=0; i < node.of.length; ++i)
					if (node.of[i].type !== 'SpreadElement')
						expr.end = assign(member(args, next), node.of[i]);
					else
						expr.end = assign(member(args, literal('spread')), node.of[i].of);
				expr.end = member({ type:'Ref', to:best }, literal(0));
				return { type:'Sequence', expressions:expr };
			},
			//what about inner functions (FunctionDeclaration/Function), and refs?
		}),
	};



	//Main rewriting modules:
		//Replacing this with a var, assigned-to at function enter.
			//And the other way.
		//Var object consolidation: references to the same var should be exactly the same object.
			//(References to outside become same-for-same-name Ref{to:void}.)
			//How exactly should the used data structures be arranged?
				//Lists of vars… Stack of scopes… Combine, how?
				//
		//Get vars defined at a node?
			//
		//Checking that cross-function refs/vars are not written to (directly).
		//a.b(c) -> (&args.l=0, &args.this=a, &args.method='b', &args.next=c, &best[0])
			//Should probably remove get/set args.start, right?
			//And the other way.
		//Inline global/public object/function accesses (if a property is owned directly):
			//a.b.c() -> Ref{a.b}.c();  a.b.c -> Ref{a.b.c}
			//And the other way.
	//Optional rewriting modules:
		//a==b -> a===b
		//new T(…args) -> init(T, …args)
			//And the other way.
		//Insert &args.at=n at every if's .then/.else, for/while's .do, …?
			//
			//And the other way.
		//Remove all no-side-effects no-assignments branches, like 'use strict'.
		//Side-effect analysis, function (or node?) -> modifiedRefs (including args).
			//Both directly and indirectly modified.
			//Using itself for sub-function — but built-in functions' side-effects are unknown?
				//
			//A pure function is not a function without side-effects (this does not include caches), it is one that returns same value for same arguments… How to codify that?
				//
		//Static lifetime analysis, and finally{deinit(var)} for those that will definitely die.
			//For those that are unknown, a=b -> a=transfer(a,b), that keeps a ref count map?
				//Dynamic lifetime analysis, or memory management.
				//Built-in functions, like [].filter, have to be either all rewritten or all taken into account.
				//
		//a<b<c -> (&temp = b, a < &temp && &temp < c), or (a<b && b<c) if b has no side-effects.
			//And the other way.
		//a*b -> a['*'] ? a['*'](b) : a*b
			//And the other way.
			//(types and a = expect(a, Array, Number)? Should we separate 0 and T in expect?)
				//(Just like var analysis, but also keep an array of types (that are suitable to be used as arguments to expect); for each function, each return can return an array of types; cache result per-function?)
				//(What about replacing ++a or a+=1 -> a=a+1, and a>b -> b<a, and a<=b -> !(b<a)?)
				//
		//[…], {…} -> init(Array/Object) with elements.
		//a: Array, Object; -> expect(a, Array, Object) (except, a duplicate label error may happen…).



	let collect = (function self(node) {
		//self.enter, self.leave, self.get, self.set
		//should assign be a args-level var, or self-level?
		//should we also have define?
	});
	let collectVars = (function self(node, set, get = null, inSet = false) {
		//should probably just be collect — and have collectVars as a convenience interface for it.
		//should also have enter/leave.
			//also, have these functions as properties of self, not copied-each-time parameters.
		if (!node) return;
		var t = node.type;
		if (t === 'Array') node = node.of;
		else if (t === 'Object') node = node.of;
		else if (t === 'VariableDeclaration') node = node.of, inSet = true;

		if ('length' in node)
			for (var t=0; t < node.length; ++t)
				self(node[t], set, get, inSet);
		else if (t === 'Assignment') {
			self(node.left || node.right, set, get, true);
			node.left && self(node.right, set, get, false);
		} else if (t === 'FunctionDeclaration') self(node.name, set, get, true);
		else if (t === 'Identifier') (inSet ? set : get)(node);
		else if (t === 'Member') {
			self(node.of, set, get, inSet);
			self(node.key, set, get, false);
		} else if (t === 'Property') {
			self(node.key, set, get, false);
			self(node.value, set, get, inSet);
		} else if (t === 'RestElement') self(node.of, set, get, inSet);
		//…now that we have get, shouldn't we also descend into all other node types?
			//.of/.do — and .if/.then/.else, and .try/.catch/.finally,  and .init/.update/.while, and .left/.right.
				//Also, if .operator==='delete', should recurse to right in set mode.
	});
	let functionBodyVars = (function self(node, f) {
		if (!node) return;
		var t = node.type;
		if (t === 'Function') return;

		if (node.do) self(node.do, f);

		if ('length' in node)
			for (var t=0; t < node.length; ++t)
				self(node[t], f);
		else if (t === 'For') self(node.init, f);
		else if (t === 'ForOf') self(node.key, f);
		else if (t === 'ForIn') self(node.key, f);
		else if (t === 'If') self(node.then, f), self(node.else, f);
		else if (t === 'Try')
			self(node.try, f), self(node.catch, f), self(node.finally, f);
		else if (t === 'VariableDeclaration' && node.kind === 'var') collectVars(node, f);
	});
	let blockLets = (function self(node, f) {
		var t = node.type;
		if (t === 'Block')
			for (var i=0; i < node.do.length; ++i) {
				var t = node.do[i].type;
				if (t === 'FunctionDeclaration') collectVars(node.do[i].name, f, null, true);
				else if (t === 'VariableDeclaration' && node.do[i].kind !== 'var')
					collectVars(node.do[i], f);
			}
		else if (t === 'CatchClause')
			collectVars(node.on, f);
		else if (t === 'FunctionDeclaration' || t === 'Function')
			collectVars(node.name, f, null, true), collectVars(node.of, f, null, true);
	});
	let refs = (function self(node, get, set) {
		if (!node) return;
		//Descend into node, (temporarily) shielding from functionBodyVars/blockLets;
			//Have an object { name: timesEncountered }.
		//Should go through all node types and see which ones need descending where:
//		Assignment: collectVars(node, set, get) on .left || .right, !left && .right is get expressions,
//		Array: ….of,
//		Block: ….do,
//		Binary: .left, .right, (delete operator… isn't it a set?)
//		Call: .function, ….of,
//		CatchClause: .do,
//		Conditional: .if, .then, .else,
	});
	let transformWithVars = (map => {
		//map[type](node, lookup); lookup will throw an exception if a var is in temporal-dead-zone.
		//First transform all children, then transform the node.
		//…Should probably automatically replace references to vars with the var objects.
		//if after a pass, some vars no longer get found by bodyVars/blockLets, add them before we leave a block, right?
			//not found, but still referenced in the tree; how to determine that?
			//…probably something with a Map. hmm.
			//Should be able to enum all refs of a subtree… refs(node, read, write)?
			//Also, defining lets can change the temporal-dead-zone.
			//Also, no-.name Identifiers should be turned into a let.
	});



	let write = ((tree, map = jsProgram) => {
		if (!emit.into) {
			emit.into = [], emit.at = [], emit.last = '';
			emit.noSpace = '\n+-*%?:;!~^&|=,.<>(){}[]\'"`/';
		}
		emit.map = map;
		try { return emit(tree), emit.into.join('') }
		finally { emit.into.length = 0, emit.last = '' }
	});
	let read = ((str, transform = correct) => {
		if (typeof str === 'function') str = funcStr.call(str);
		return transform(esprima.parseModule(str, {}));
	});
	let emit = (function self(...str) {
		let act = self.at[self.at.length-1];
		act = act ? act.type : 'SwitchCase';
		act = types.type[act] === 'act' || act === 'SwitchCase';
		for (var i=0; i < str.length; ++i) {
			if (typeof str[i]==='string') {
				if (!str[i]) continue;
				if (self.last==='+' && str[i][0]==='+') self.into.end = ' ';
				if (self.last==='-' && str[i][0]==='-') self.into.end = ' ';
				if (!self.noSpace.includes(self.last) && !self.noSpace.includes(str[i][0]))
					self.into.end = ' ';
				self.into.end = str[i], self.last = str[i][str[i].length-1];
			} else if (!str[i])
				throw new Panic("Tried to emit nothing");
			else try {
				self.at.end = str[i];
				if (act && str[i].type === 'Sequence')
					join(str[i].of, ',');
				else if (!act && str[i] === 'Object')
					emit('{'), join(str[i].of, ','), emit('}');
				else
					self.map[str[i].type](str[i]);
			} finally { self.at.end }
		}
	});
	let join = ((array, separator) => {
		if (array.length) array[0] && emit(array[0]);
		if (typeof separator === 'function')
			for (var i=1, s; i < array.length; ++i)
				s = separator(array[i-1]), s && emit(s), array[i] && emit(array[i]);
		else
			for (var i=1; i < array.length; ++i)
				separator && emit(separator), array[i] && emit(array[i]);
	});
	let precedence = (node => {
		var t = node.type;
		if (t === 'Call' || t === 'Member') return 19;
		if (t === 'New') return node.of.length ? 19 : 18;
		if (t === 'Binary') {
			if (!node.left || !node.right) return 16;
			t = node.operator;
			if (t === '**') return 15;
			if (t === '*' || t === '/' || t === '%') return 14;
			if (t === '+' || t === '-') return 13;
			if (t === '<<' || t === '>>' || t === '>>>') return 12;
			if (t==='<' || t==='<=' || t==='>' || t==='>=' || t==='in' || t==='instanceof') return 11;
			if (t==='==' || t==='===' || t==='!=' || t==='!==') return 10;
			if (t === '&') return 9;
			if (t === '^') return 8;
			if (t === '|') return 7;
			return t === '&&' ? 6 : 5;
		} else if (t === 'Conditional') return 4;
		else if (t === 'Assignment') return !node.left ? 16 : !node.right ? 17 : 3;
		else if (t === 'Sequence') return 1;
		return 0;
	});
	let child = ((node, ch, same = false) => {
		var p = precedence(node), c = precedence(ch);
		if (p && c) var b = same ? p > c : p >= c;
		b && emit('('), emit(ch), b && emit(')');
	});
	let isAssignment = (op => {
		return op[op.length-1]==='=' && op[0]!=='!' && op[0]!=='=' && op!=='<=' && op!=='>=';
	});
	let binaryExpr = (node => {
		var op = node.operator;
		if (op==='**' || isAssignment(op))
			child(node, node.left), emit(op), child(node, node.right, true);
		else
			child(node, node.left, true), emit(op), child(node, node.right);
	});
	let actSeparator = (function self(node) {
		var t = node.type;
		if (t==='Block' || t==='Switch' || t==='Try') return;
		if (t==='While' || t==='Labeled') return self(node.do);
		if (t==='For' || t==='ForOf' || t==='ForIn') return self(node.do);
		if (t==='If') return self(node.else || node.then);
		return ';';
	});
	let nameOfRef = (function self(to) {
		if (!self.prefix) self.prefix = 'ⵔ', self.num = 0, self.map = new WeakMap;
		if (!Number.isSafeInteger(self.num)) self.prefix = 'ⵔ' + self.prefix, self.num = 0;
		if (!self.map.has(to)) self.map.set(to, self.prefix + (self.num++).toString(36));
		return self.map.get(to);
	});
	let templateLiteral = ((value, raw, expr) => {
		if (value.length !== raw.length || raw.length !== expr.length+1)
			throw "Wrong lengths of template elements/expressions";
		if (!expr.length) emit('`' + raw[0].value + '`');
		else {
			emit('`' + raw[0].value + '${');
			for (var i=0; i < expr.length-1; ++i)
				emit(expr[i], '}' + raw[i+1].value + '${');
			emit(expr[i], '}' + raw[i+1].value + '`');
		}
	});
	let maybeTaggedTemplate = (node => {
		if (node.type !== 'Call') return;
		if (!node.of.length) return;
		if (node.of[0].type !== 'Call') return;
		if (node.of[0].function.type !== 'Ref') return;
		if (node.of[0].function.to !== templateStrings) return;
		if (node.of[0].of.length !== 2) return;
		var [value, raw] = node.of[0].of;
		if (value.type !== 'Array' || raw.type !== 'Array') return;
		value = value.of, raw = raw.of;
		if (value.length !== raw.length) return;
		if (raw.length !== node.of.length) return;
		for (var i=0; i < raw.length; ++i) {
			if (raw[i].type !== 'Literal') return;
			var v = unescape(raw[i].value);
			if (v !== null && (value[i].type !== 'Literal' || value[i].value !== v)) return;
			else if (v === null) {
				if (value[i].type !== 'Binary' || value[i].operator !== 'void') return;
				if (value[i].right.type !== 'Literal' || value[i].right.value !== 0) return;
			}
		}
		emit(node.function);
		templateLiteral(value, raw, node.of.slice(1));
		return true;
	});
	let needsExtraction = (init => {
		return init && init.type === 'VariableDeclaration' && init.kind !== 'var';
	});
	let jsProgram = {
		Assignment: binaryExpr,
		Array(node) {
			emit('['), join(node.of, ','), !node.of[node.of.length-1] && emit(','), emit(']');
		},
		Block(node) { emit('{'), join(node.do, actSeparator), emit('}') },
		Binary: binaryExpr,
		Break(node) { emit('break'), node.label && emit(node.label) },
		Call(node) {
			if (maybeTaggedTemplate(node)) return;
			child(node, node.function, true), emit('('), join(node.of, ','), emit(')');
		},
		CatchClause(node) { emit('catch'), emit('(', node.on, ')'), emit(node.do) },
		Conditional(node) {
			child(node, node.if), emit('?');
			child(node, node.then, true), emit(':');
			child(node, node.else, true);
		},
		Continue(node) { emit('continue'), node.label && emit(node.label) },
		DoWhile(node) {
			emit('do', node.do);
			if (actSeparator(node.do)) emit(actSeparator(node.do));
			emit('while', '(', node.while, ')');
		},
		For(node) {
			//`for(let a=…, b=…;…;…)…` -> `{let a,b; for(a=…, b=…;…;…)…}`
			var ex = needsExtraction(node.init);
			if (ex) {
				emit('{', (ex = node.init).kind);
				//uhhh, vars need to be collected.
				//after, all the assignments of ex.of need to be emitted, after ';' 'for' '('.
			} else
				emit('for', '('), node.init && emit(node.init);
			emit(';'), node.while && emit(node.while);
			emit(';'), node.update && emit(node.update);
			emit(')', node.do);
			if (ex) emit('}');
		},
		ForOf(node) { emit('for', '(', node.key, 'of', node.of, ')', node.do) },
			//…do we also need to do the get-vars-out transform for for-of and for-in?
				//yes, we do.
		ForIn(node) { emit('for', '(', node.key, 'in', node.of, ')', node.do) },
		FunctionDeclaration(node) {
			emit('function'), node.name && emit(node.name);
			emit('('), join(node.of.slice(1), ','), emit(')');
			emit(node.do);
		},
		Function(node) {
			if (node.of[0]) {
				if (node.of[0].name !== 'this')
					throw "Unexpected name of this arg: " + node.of[0].name;
				emit('(', 'function'), node.name && emit(node.name);
				emit('('), join(node.of.slice(1), ','), emit(')');
				emit(node.do, ')');
			} else {
				emit('(');
				if (node.of.length === 2 && node.of[1].type === 'Identifier')
					emit(node.of[1]);
				else emit('('), join(node.of.slice(1), ','), emit(')');
				emit('=>', node.do, ')');
			}
		},
		Identifier(node) { emit(node.name) },
		If(node) {
			emit('if', '(', node.if, ')');
			if (node.then.type !== 'If' || node.else || node.then.else)
				emit(node.then);
			else
				emit('{', node.then, '}');
			if (node.else && actSeparator(node.then))
				emit(actSeparator(node.then));
			node.else && emit('else', node.else);
		},
		Literal(node) { emit(node.raw) },
		Labeled(node) { emit(node.label, ':', node.do) },
		Member(node) {
			child(node, node.of, true);
			if (isIdentifier(node.key))
				emit('.', node.key.value);
			else emit('[', node.key, ']');
		},
		New(node) {
			emit('new'), child(node, node.function, true);
			if (node.of.length)
				emit('('), join(node.of, ','), emit(')');
		},
		Object(node) { emit('({'), join(node.of, ','), emit('})') },
		Property(node) {
			var k = node.key, v = node.value;
			if (!node.kind && k.type === 'Literal' && v.type === 'Identifier' && k.value === v.name)
				emit(k.value);
			else {
				emit(node.kind);
				if (isIdentifier(k) || k.type === 'Literal' && typeof k.value === 'number')
					emit(String(k.value));
				else emit('[', k, ']');
				if (v.type === 'Function' && v.of[0] && !v.name)
					emit('('), join(v.of.slice(1), ','), emit(')', v.do);
				else emit(':', v);
			}
		},
		Ref(node) {
			if (!node.to || typeof node.to!=='object' && typeof node.to!=='function')
				throw "Unresolved Ref to " + node.to;
			emit(nameOfRef(node.to));
			//should also do emit.ref(node.to), for knowing which refs to pass to a containing func.
		},
		RestElement(node) { emit('...', node.of) },
		Return(node) { emit('return'), node.of && emit(node.of) },
		Sequence(node) { emit('('), join(node.of, ','), emit(')') },
		SpreadElement(node) { emit('...', node.of) },
		SwitchCase(node) {
			node.on ? emit('case', node.on) : emit('default');
			emit(':'), join(node.do, actSeparator);
		},
		Switch() {
			emit('switch', '(', node.on, ')', '{'), join(node.do, actSeparator), emit('}');
		},
		TemplateLiteral(node) { templateLiteral(node.value, node.raw, node.expressions) },
		Throw(node) { emit('throw', node.of) },
		Try(node) {
			emit('try', node.try);
			node.catch && emit(node.catch);
			node.finally && emit('finally', node.finally);
		},
		VariableDeclaration(node) { emit(node.kind), join(node.of, ',') },
		While(node) { emit('while', '(', node.while, ')', node.do) },
	};



	//We can build up a tree comfortably — but what about matching comfortably?
		//Nested functions won't work, because we want the many arguments to be evaluated only after the parent.



	let prebuild = ((obj, into) => {
		//Where is this function used?
			//When we have a list of modules, we need to loop over them and pre-build them.
			//We do need to make functions functions, so a function-making function is required.
				//Should turn call into a call-returning function, and move it here.
		/*
			obj={
				f(){},
				scope:{
					call(){},
					refs(){}
				},
				a:[],b:'txt'
			} should paste {
				f:{call:{}},
				scope:{call:{}, refs:{call:{}}},
				a:[],b:'txt'
			} into into.
			If some of those props exist, merge them.
			Non-basic-objects get copied by-reference, having to equal to what's-already-there.
			Basic-objects ({} or ()=>{}) cannot override non-basic objects, and the other way.
			Should probably also leave .name to indicate the path.
			Also, freeze() all the created objects.
		*/
	});
	//having func() and alt(src, dst, …scope)→dst…
	//turn function nodes into func(), and call alt on it sometime before (read-only) accesses.



	let impl = Symbol('implementation');
		//Should this be exposed as a global, or in the network?
			//Or should we expose a different symbol as a global, call?
	let alt = ((src, dst, ...bind) => {
		//Should have a func()->function, calling which is eqv to return call(...args).
		//Should use a symbol for storing node data, instead of .call.
		//if !dst, should create it…
		//src could be:
			//if src.call === Function.prototype.call, refs = src.refs, src = read(src),
				//(and delete .name/.length of a function?)
			//else if src.call, refs = src.call.refs[0], src = src.call.node ? src.call.node[0] : read(getter(src.call, 0)),
				//(should we have n?)
			//else src is a string, refs=void, src = read(src);
			//(if src.refs, add it to bind;  src is now a tree)
		//dst could be:
			//if !(0 in dst),
				//if !dst.call || dst.call === Function.prototype.call, dst = dst.call = {}, break;
				//else dst = dst.call,
			//(getter into dst[n], its node into dst.node[n], its refs into dst.refs[n])
		//bind is a set of plain objects.
		//Do:
			//Convert function(s) into get-based model (this->unusedVarName; to call, &args.start, &args.next/spread=v, &best[0]; on call, &args.start=0; var self/&this/a = args.next/rest),
				//(wouldn't it be best for best to set args.in to 0? then we'll only have one statement.)
			//resolve all refs against bind (last-first), throwing if any ref is not in bind, or any ref is directly written to.
		return dst;
	});
	let fix = (function self(obj, at = obj) {
		if (typeof at === 'function') alt(at, at, obj);
		else if (at && typeof at === 'object')
			for (var k in at) self(obj, at[k]);
	});



})(typeof self !== ''+void 0 ? self : global);

//# sourceURL=before
