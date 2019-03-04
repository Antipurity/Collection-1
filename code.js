'use strict';(function init(self) {
	{"The code you are looking for comes in after. This is merely infrastructure for that code."}
	init.doc = "Cleans up the global scope, and compiles/links/runs functionality. Has to be applied to a JS environment before code.";
	delete self.eval, self._ = void 0;
	delete self.content, delete self.onmozfullscreenchange, delete self.onmozfullscreenerror;

	const Object = self.Object, lookup = Object.getOwnPropertyDescriptor;
	const auth = ((ctx, obj, name) => {
		if (!name) name = obj, obj = ctx[name];
		if ((lookup(ctx, name) || {}).value !== obj) throw name + ' is a getter';
		if (typeof obj === 'function' && (''+obj).slice(0,9) === 'function ')
			if ((''+obj).slice(9, 9+name.length) !== name || !/\[native code\]\s*}$/.test(obj))
				if (obj !== Function.prototype)
					throw name + ' is not native';
		return obj;
	});
	auth(self, Object, 'Object');
	auth(Object, lookup, 'getOwnPropertyDescriptor');
	const Array = auth(self, 'Array'), Function = auth(self, 'Function'), String = auth(self, 'String');
	[Object, Array, Function, String].forEach(t => auth(t, 'prototype'));
	const Symbol = auth(self, 'Symbol'), Error = auth(self, 'Error'), Infinity = self.Infinity;
	const def = auth(Object, 'defineProperty');
	const log = self.console ? self.console.log : () => {};
	const prototype = self.prototype = Symbol('prototype');
	const get = auth(Object.prototype, '__lookupGetter__');
	const set = auth(Object.prototype, '__lookupSetter__');
	def.doc = `should not be used — use .getset or .define instead`;
	lookup.doc = `should not be used — use .getter or .setter or .writable or .configurable or .enumerable instead`;
	const e = auth(Object.prototype, 'propertyIsEnumerable');
	const ownNames = auth(Object, 'getOwnPropertyNames'), protoOf = auth(Object, 'getPrototypeOf');
	const d1 = { configurable:true, enumerable:true, get:_, set:_ };
	const d2 = { configurable:true, enumerable:true, value:_, writable:true };
	Object.owns = auth(Object.prototype, 'hasOwnProperty');
	Object.owns.doc = `used like Object.owns.call(obj, key)->false/true.`;
	Object.getset = ((obj, k, get=_, set=_, configurable=true, enumerable=true) => {
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



	const array = (a => a === _ ? array.a.pop() || [] : (a.length = 0, array.a.push(a)));
	array.a = [];



	const fr = auth(Object, 'freeze');
	const fenv = Symbol('Function.env');
	const named = (k => {
		if (!/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(k)) throw "Not name-able: "+k;
		return k;
	});
	(Function.env = (function self(f, env = _, name = _) {
		if (typeof f === 'string') {
			if (s.indexOf('ⴵ')>=0) throw "ⴵ is used internally — use another char eternally";
			let keys = {};
			for (const k in env) if (named(k)) keys[k] = true;
			keys = Object.keys(keys);
			const arr = [];
			let s = "'use strict';";
			s += keys.length ? `const[${keys}]=[ⴵ.${keys.join(',ⴵ.')}];` : '';
			s += `ⴵ=_;return(${f})`;
			if (env && env.name && typeof env.name === 'string')
				s += '\n//# sourceURL=' + env.name;
			return self(Function('ⴵ', s)(env), env);
		}
		if (typeof f !== 'function') throw "Expected a function or a string";
		if (env === _) return f[fenv] || null;
		if (!env || typeof env !== 'object') throw "Function env must be an object";
		if (f[fenv]) throw "Trying to change function env after creation";
		delete f.prototype, delete f.length, delete f.name, name && (f.name = name);
		f[fenv] = env;
		return f;
	})).doc = `Constructs a JS function from a string in an (unchangable) environment, or sets the environment after construction elsewhere, or gets the environment of a function (for reconstruction). For example, Function.env('x=>a+b+x', {a:1,b:2})(3) returns 6.`;
	const expandable = (obj => {
		if (typeof obj==='function') return true;
		if (obj && typeof obj==='object')
			return obj[prototype] === Object.prototype;
		return false;
	});
	const mix = ((o,f) => {
		if (o === _ || o === f) return f;
		if (f === _) return o;
		if (typeof o === 'function' && typeof f === 'function')
			throw`Trying to override a function with another function`;
		if (o instanceof Array)
			return f instanceof Array ? o.push(...f) : o.push(f), o;
		if (typeof f === 'function') {
			if (!o || !expandable(o) && o[prototype] !== define)
				throw`Trying to override ${typeof o} with a function`;
			for (const k in o) f[k] = mix(o[k], f[k]);
			return f;
		} else if (expandable(f)) {
			for (const k in f) o[k] = mix(o[k], f[k]);
			return o;
		} else if (f instanceof Array) return f.unshift(o), f;
		else throw`Trying to override ${typeof o} with ${typeof f}`;
	});



	const performance = self.performance, process = auth(self, 'process');
	const time = (() => {
		return performance ? performance.now() : process ? process.uptime()*1000 : 0;
	});
	const logTimes = (times => {
		let s=0, n=0, k, t;  for (k in times) s += times[k], ++n;
		for (k in times) if ((t = times[k]) > 2*s/n)
			log(k+' took '+t.toFixed(2)+' ms ('+(t/s*100).toFixed(0)+'%)');
	});
	const mark = (name => {
		if (!mark.prev) return void(mark.times = { [name]:mark.prev=time() });
		if (!name) return logTimes(mark.times), mark.prev = mark.times = _;
		if (typeof name !== 'string') throw "Name of a time-mark should be a string";
		mark.times[name] = (mark.times[name] || 0) + (time() - mark.prev), mark.prev = time();
	});



	const stringOf = (f => {
		{"f(){} -> (function(){}),  ()=>{} -> (function(){}),  native -> null"}
		if (f.name && globals[f.name] === f) return null;
		let s = f[Object.string].trim();
		let i = s.indexOf('{'), j = s.indexOf('=>');
		{'Function args must not hide { or => inside (object destructuring or in strings)';
			('Fixing needs a lexer, to skip ()[]{}/strings/regexes — too long for small things.')}
		if (j >= 0) if (i<0 || i > j) i = j;
		if (s.slice(i+1, -1).trim() === '[native code]') return null;
		if (s[i] === '=') {
			let head = s[0] === '(' ? s.slice(0,i).trim() : '(' + s.slice(0,i).trim() + ')';
			let body = s.slice(i+2).trim();
			if (body[0] !== '{') body = '{return ' + body + '}';
			return '(function self' + head + body.replace(/\t+/g, ' ') + ')';
		} else return '(function self' + s.slice(s.indexOf('(')).replace(/\t+/g, ' ') + ')';
	});
	const assemble = ((mods, env, name) => {
		const arr = ["'use strict';ⴵMark('Fetch+parse');const ⴵCall=[];"];
		const args = { ⴵ:env, ⴵMix:mix, ⴵFenv:Function.env, ⴵView:Object.create, ⴵFr:fr, ⴵMark:mark, _ };

		const all = {};
		for (const r in env) if (named(r)) all[r] = true;
		mods.forEach(m => { if (m.define) for (let k in m.define) if (named(k)) all[k] = true });
		arr.push('const[', Object.keys(all).join(','), ']=(()=>{');

		let n = 0, path = [];
		function arg(o) { const s = 'ⴵ' + (n++).toString(36); args[s] = o, arr.push(s) }
		function called(o) { return typeof o.call === 'function' }
		function expr(o, base = false) {
			let s = '';
			if (typeof o === 'function' && (s = stringOf(o)) !== null && !base) {
				if (s.indexOf('ⴵ')>=0) throw 'ⴵ is used internally — use another char eternally';
				arr.push('ⴵFenv(', s, ',ⴵMod,', expr(path.join('.')), ')');
			} else if (o instanceof Array && !base) {
				arr.push('[');
				for (const i=0; i < o.length; ++i) s && arr.push(','), s=1, expr(o[i]);
				arr.push(']');
			} else if (expandable(o) && s !== null) {
				if (called(o) && !base) arr.push('ⴵMix('), expr(o.call), arr.push(',');
				else if (o[prototype] && !base) arr.push('ⴵMix(ⴵView('), arg(o), arr.push('),');
				arr.push('{');
				for (const k in o) if (k !== 'call' || !called(k)) {
					s && arr.push(','), s=1;
					if (/^[A-Za-z_]+$/.test(k)) arr.push(k);
					else arr.push('["', k.replace(/"/g, '\\"'), '"]');
					arr.push(':'), path.push(k), expr(o[k]), path.pop();
				}
				arr.push('}');
				if ((called(o) || o[prototype]) && !base) arr.push(')');
			} else if (o === _) arr.push('_');
			else if (o === null || typeof o === 'number' || typeof o === 'boolean') arr.push(''+o);
			else arg(o);
		}

		mods.forEach(m => {
			if (m.define)
				for (const k in m.define)
					if (k in m) throw 'Shadowing own defines is not fine for a module: '+k;
			arr.push('ⴵMix(ⴵ,(()=>{const ⴵMod=ⴵView(ⴵ)');
			for (const k in m) if (k !== 'define' && k !== 'name' && (k !== 'call' || !called(m)))
				!named(k) && error('Unnameable private module definition: '+k),
				arr.push(',', k, '=ⴵMod.', k, '='), expr(m[k]);
			arr.push(';ⴵFr(ⴵMod);ⴵMark('), expr(m.name || '<unnamed>'), arr.push(');');
			if (called(m)) arr.push('ⴵCall.push('), expr(m.call), arr.push(');');
			if (m.define) arr.push('return'), expr(m.define, true);
			arr.push('})());\n');
		});

		arr.push('ⴵFr(ⴵ);return[ⴵ.', Object.keys(all).join(',ⴵ.'), ']})();');
		arr.push('ⴵCall.forEach(f=>f(ⴵ)),ⴵCall.length=0;ⴵMark("Post-init calls"),ⴵMark();');
		arr.push('ⴵ=ⴵMix=ⴵFenv=ⴵView=ⴵFr=ⴵMark=_\n//# sourceURL=', name);

		return Function(Object.keys(args), arr.join('')).apply(_, Object.values(args));
	});



	const globals = { on:{} }, define = auth(Object, 'create')(globals);
	define.globals = globals, define.define = define;
	define.window = define.global = define.self = _;
	define.on = {};
	define._ = _, define.prototype = prototype;
	Function(define.init = ("'use strict';("+init+")(typeof self!=''+void 0?self:typeof global!=''+void 0?global:window);").replace(/\s+/g, ' '));



	const setImmediate = self.setImmediate, setTimeout = self.setTimeout;
	const pb = { PrivacyBadger: 'relies on this near page load to not throw in our name.' };
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



	const mods = array();
	getset(self, 'code',
		() => {
			delete self.code, fr(globals);
			if (!mods.length) return;
			{"Deleting them all breaks JS-Node and some extensions — sloppy code."}
			if (typeof process === ''+_) hide(), setTimeout(hideRest, 5000);
			try { assemble(mods, define, 'after') }
			finally { array(mods), array.a.length = 0 }
		},
		f => {
			if (!mods.length) {
				if (process) process.nextTick(() => self.code);
				else if (setImmediate) setImmediate(() => self.code);
				else setTimeout(() => self.code, 0);
			}
			mods.push(f);
		}
	);
	self.process && require('./after.js');
	{
		const ap = Array.prototype, op = Object.prototype, fp = Function.prototype;
		'concat entries every filter find findIndex flat flatMap keys lastIndexOf map reduce reduceRight shift some unshift values'.split(' ').forEach(k => delete ap[k]);
		[Map, Set, WeakMap, WeakSet].forEach(m => {
			delete m.entries, delete m.keys, delete m.values;
		});
		const getProto = getter(op, '__proto__') || function() { return protoOf(this) };
		getset(op, prototype, getProto);
		getset(op, Object.string = Symbol('.toString()'), auth(op, 'toString'));
		getset(fp, Object.string, auth(fp, 'toString'));
		ownNames(op).forEach(k => delete op[k]);
		ownNames(fp).forEach(k => k!=='call' && k!=='apply' && k!=='bind' && delete fp[k]);
		'anchor big blink bold fixed fontcolor fontsize italics link small strike sub substr sup'.split(' ').forEach = (k => delete String.prototype[k]);
		const o = { Aud:'io', CSS:'', DOM:'', HTM:'L', IDB:'', Med:'ia', Per:'formance',
			RTC:'', SVG:'', Web:'G', eva:'l' };
		const needsBind = (f => typeof f==='function' && ownNames(f).length === 2);
		globals.HTMLCanvasElement = self.HTMLCanvasElement;
		ownNames(self).forEach(k => {
			if (spare[k] === 1 || k === 'code') return;
			if (k.slice(0,2) === 'on') define.on[k.slice(2)] = true;
			try {
				if (!(k.slice(0,3)in o) || k.slice(3, 3 + o[k.slice(0,3)].length) !== o[k.slice(0,3)])
					if (!(k in globals) && self[k])
						if (typeof self[k]==='function' || typeof self[k]==='object')
							globals[k] = needsBind(self[k]) ? self[k].bind(self) : self[k];
			} catch (err) {}
		});
	}
})(typeof self !== ''+void 0 ? self : typeof global !== ''+void 0 ? global : window);
//# sourceURL=code
