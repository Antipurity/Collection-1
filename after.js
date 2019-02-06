{'This old collection of various low-level things, made from blood…'
	'Peak of sum from peaks of parts — potentially. Very unfinished now.'
	'Each extended not by adding more and more functionality, flexible in development but ultimately rigid, but by punching holes in them (into which all else can fit), as far as it goes.'
		'Then, it will be able to combine strengths of all and weaknesses of none.'
		'Quite an impressive sight that could be, in the far future.'
		'Anywhere near now, it is useless.'



'The programming language still limits us so: however good, time will soon come to shed it. Another shall be devised (or this one revised — there is no difference).'
'Some primary basics are gleaming in mind, bright and sharp — but not in code yet.'

	'(Great flexibility, but at sad cost: slowness. With proper optimization it shall not be a problem, but at first, such a language (extension) would merely be a toy.)'

	'Basic constructs (if, while, +, *…) are powerful, but if values are allowed to change meanings of them all in any way they wish (by overriding a function/ality), wonders can be achieved:'
		'easy symbolic computation (by passing "anything" as all function parameters)',
			'getting/rewriting the executed code',
			'const propagation',
			'auto-optimization (like parallelizing loops over tensors onto GPU)',
		'non-intrusive promises/futures',
		'behaving-like-builtin numeric types (like number tensors or multiprecision)',
		'extending/broadcasting operations onto sequences (like `3*[1,2] -> [3,6]`)',
		'type inference (more later)',
		'recording path from hidden variables to output to allow propagating error-of-output to inside (as is done in machine learning).'
		'(Despite needing a check at every single operation (and/or a function call), branch prediction and JS object-shape-caching may make the slowdown less than expected.)'
		'(if/while/… must allow arbitrary bodies and passing/returning relevant local vars — a non-trivial rewrite of AST of JS will have to be devised for them.)'

	'Computation itself is powerful, but repeats what is already done too eagerly, without thought or order. They shall be provided.'
		'Conceptual merging through space and time: no two deeply-equal pure concepts, fine — only one light shall shine against the dark.'
		'Used in:'
			'building up the call stack (and merging by-function-and-args if pure and non-random)',
				'caching results of pure operations, never exploring needlessly',
				'detecting infinite recursion (and loops)',
			'reducing memory cost as much as possible',
				'creating objects, arrays, type instances',
				'structural match/replace and equivalencies',
			'exposing conceptual new-ness for any optimization of seeking — an unforgiving burden',
			'any/all of types for conceptual inference (symbolic-computation-like).'
		'Merely an extensively-used function merge(o), used to signal purity, creating a hash-table of backrefs on o unless any of its parts have no such hash-table (to allow inter-operation with non-pure).'
		'With (correct) ref-counting and re-using of freed objects for new ones (and keeping caches and backrefs until memory pressure), merged objects will not allocate memory — still, it requires re-implementing memory management in this garbage-collected JS. No way around it though (still, no perfect solution for memory here).'
		'Though performance impact should be great, the increase in convenience and *knowing* (and memory savings) should more than offset that.'
		'(Requires (shallow) equality and hashing; best to express those through a single context — object de/composition and iteration, and forEach/.rewrite. Existence of de/composition also means that conceptual difference should also be done.)'

	'Tweaking code options and picking implementations manually can get tedious; some automatic searching and picking of best is desired. Although the basic network implemented in before.js can do that, focus can be directed better.'
		{'Though it is not absolutely clear what is the best way of picking best, of extracting traces from random walk or anything for appraisal…'
			"Perhaps will be picked later. Plenty to do as-is."}

	'Less prioritized are secondaries, like a now-animation-less visual framework, or most convenient parsing/emitting/editing, or others — prior examples of such await consumption in node.js and parsedMap.js and in places beyond existence.'

	'(Words are great, but to merely reach the same expressiveness level in code, a conceptual weight several times the size of this description is required — tertiaries, like measure or randomNumbers near end — not even worth mentioning.)'}





































code = { define:{ _:void 0 } }




code = {
	define:{
		tests:[],
		test:{
			doc:`
				Runs all tests in random order, once; returns true if all were successful, false if any failed. Their results will be stored on tests[i].err (void if successful) and tests[i].time (sum of all runtimes) (and tests[i].runs, number of times it was run).
				A test is successful if it returns true or void and it creates no ref-leaks. Otherwise tests[i].err will contain its (most recent) exception or a ref-tracked array of its (most recent) ref-leaks.
				The global variable tests is an array of functions like () => f(2)===2; define its parts near the tested functionality.`,
			call() {
				if (!order.length) reorder();
				const b = true;
				while (order.length) if (time.limit(), !run(tests[order.pop()])) b = false;
				return b;
			},
			log:{
				doc:`Logs any failed tests (percentage passed, then for each failed test, first 50 chars of their bodies, their exception or their ref-leaks) with console.log/.group/.groupEnd.
					If all succeeded, logs the average time to execute all tests, and how many times the whole set was executed (and all tests that took more than double the average to run).`,
				call(...args) {
					let fail = init(Array);
					try {
						""
					} finally { set(fail) }
					""
				}
			},
		},
	},
	order:[],
	shuffle(a) {
		for (const i = a.length-1; i>0; --i) {
			const j = random(i+1);
			if (i !== j) [a[i], a[j]] = [a[j], a[i]];
		}
	},
	reorder() { while (order.length < tests.length) order.push(order.length); shuffle(order) },
	run(f) {
		type(f, Function);
		try {
			"Also track allocations…"
			let start = now(), r;
			try { r = f() }
			finally { f.time = (f.time || 0) + now(start), f.runs = (f.runs || 0) + 1 }
			if (r === true || r === void 0) set(f.err), f.err = void 0;
			else if (f.err !== r) set(f.err), f.err = ref(r);
			"Also check allocations…"
		} catch (err) { if (f.err !== err) set(f.err), f.err = ref(err) }
	},
}


"Should also update definitions to set props:{…} everywhere, not just de/composition."

code = {
	define:{
		eq:{
			doc:`Checks (shallow) equality of a and b by .get-decomposition.
				If their prototypes are different, returns false — else, for each key in a or b, checks that a.get(k)===b.get(k).`,

			call(a,b) {
				if (a === b) return true;
				if (typeof a !== typeof b) return false;
				if (typeof a !== 'object' && typeof a !== 'function') return false;
				if (a[prototype] !== b[prototype]) return false;
				if (typeof a.get !== 'function' || a.get !== b.get) return false;
				if (forEach.isLinear(a) && forEach.isLinear(b)) {
					"Get the one with max length, and check equality with forEach of that."
				} else {
					"For each key in a or b, if a.get(k)!==b.get(k), return false."
				}
			},

			cmp:{
				doc:`Performs a deep comparison.
					Returns 0 if a and b are equal, and ±n otherwise in a consistent manner (if -n, a comes first; if +n, b comes first).
					When only ordering by types is wanted, use .typeid instead.`,
				typeid:{
					doc:`Compares types of a and b in an arbitrary but consistent manner.
						When passed to [].sort(eq.cmp.typeid), orders same-type values together, for better caching or branch prediction.`,
					call(a,b) { return typeId(a) - typeId(b) }
				},
				call(a,b) {
					if (a===b) return 0;
					if (typeof a !== typeof b) return typeof a < typeof b ? -1 : 1;
					if (typeof a === 'symbol') return self(a.description, b.description);
					if (typeof a !== 'object' && typeof a !== 'function') return a < b ? -1 : 1;
					if (typeof a.get !== 'function' || a.get !== b.get) return false;
					""
				}
			},

			hash:{
				doc:`Returns the hash-number of an object, suitable as a key; a shallow hash. If objects are equal, their hashes are equal too.`,

				mix:{
					doc:`A simple mixing of two hashes (32-bit unsigned integers) by multiplication-by-constant-then-summing.
						In long chains, should be i = mix(i,j). Lower bits affect higher bits more.
						Hashes are chosen to minimize collisions (different-in->same-out); by choosing only functions with an inverse (same-out->same-in for all values, meaning no collisions) (such as addition or multiplication by a co-prime-with-2³² number, mod 2³²), we minimize collisions (though from inputs and hash, hash seed could be restored).
						(Since we, on hash collision, merely create a sub-hash-table with a different hash function (and we rely on JS objects to store our hash tables anyway), there is no need to ensure that similar values have wildly different hashes.)`,
					call(i,j) {
						let mult;
						if (info.n & 1) {
							if ((info.n >>> 1) & 1)
								mult = (((i + (i<<12))>>>0) + (i<<29))>>>0; "i * 536875009"
							else
								mult = (((i + (i<<12))>>>0) + (i<<25))>>>0; "i * 33558529"
						} else {
							if ((info.n >>> 1) & 1)
								mult = (((i + (i<<26))>>>0) + (i<<29))>>>0; "i * 603979777"
							else
								mult = (((i + (i<<22))>>>0) + (i<<30))>>>0; "i * 1077936129"
						} "Constants were picked to have the min non-2 number of bits."
						return (mult + j)>>>0;
					}
				},
				call(obj, depth=1) {
	"…hash should also accept i, or variant (or seed?), to maybe allow different mixing impls or such.", "should it not be level-of-complexity though, starting with min and progressing to max (or even ∞)?  Possible progressions: keys->keys&values(&keys)->…; cross-mix->mix-with-self-after-cross-mix;  maybe combine those into single depth, maybe mix-with-self if !!depth?  Seed should be stored on prototypes or objects, in a symbol — how often would we have a same-composition-different-types situation though? Also, we can't implement eq.cmp without type ids, so eh."
					if (info.seed === void 0)
						info.seed = random(random.max), info.n = random(4);
					const r = typeId(obj);
					"Would require forEach, unless obj has .hash=[…]."
					"Maybe, since this operation is as basic as === is, it should not be overridable."
					"If obj is linear, use forEach to mix hashes as-is."
						"If not, get an array of its keys, sort it with eq.cmp, and use forEach to mix that."
				}
			},
		},
	},
	info:{ seed:0, n:0 },
	typeid:Symbol('typeid'),
	typeId(o) {
		if (o === null) return 1;  if (o === void 0) return 2;  if (!o[prototype]) return 3;
		return o[prototype][typeid] || (o[prototype][typeid] = random(random.max));
	},

	/* Number hash example (should probably return input if uint32):
		if (isNaN(o)) return 5;
		if (o === Infinity) return 6;
		if (o === -Infinity) return 7;
		if (!o) return 8;
		let r = o > 0 ? 9 : 10;
		const e = Math.floor(Math.log2(Math.abs(o)));
		r = ((r * 37 | 0) + e) | 0;
		o = Math.abs(o) * Math.pow(2, -e);
		r = ((r * 41 | 0) + Math.floor(o = o * Math.pow(2,32))) | 0;
		r = ((r * 43 | 0) + Math.floor((o - Math.floor(o)) * Math.pow(2, 53 - 32))) | 0;
		return r;
	*/
}



"Transform-methods, accepting (r,w) and returning an object (merged/const) with appropriate .get/.set to make it work — keyMap, shuffled, utf16, utf8, lzw…"
	"Except, we often want to make one outer read to cause many inner reads (advancing the iterator), or possibly none at all — same with writes. get/set do not really allow that capability…"
	"How to make them work?"
	"(Probably needs to wait until merge…)"
	"(Also, should we even make Hash/Equals written-classes?)"
		"(That MIGHT necessitate merge for those, which requires those — no good.)"



"And (decomposition-based — easy if keys are non-linear, studied somewhat if linear) diff."
	"How to organize output? One type for all diffs, composed of the type?"
	"What about one-directional diffs, as opposed to bi-directional like we had originally?"
		"With .reverse(from), functionality can be the same at about half the memory cost."
			"I like that… I like that very much."



"Actually, even though the functionality network can choose best, it does not have a criteria/function for that (like measure-time), consulting the called function each time."
	"Criteria, able to modify a branch's cost estimator after execution…"
		"(And maybe before execution, like on self-recursion?)"
	"How to add that criteria?"
		"Should it be a global function, or something more easily changeable during execution, like a stack of global functions?"
		"Or should the way-to-modify (creator) be left on the cost estimator, somehow?"
			"This calls for a more general approach of store-creator-on-function, but…"
				"Would be best to have conceptual types Function, Call{ node, result }, Created{ v, by }, but we are barely starting with conceptual types."
				"Not being fully conceptual in functions and objects seems like quite a hurdle."
				"Created.by should accept a func, inputs, output, and return the new func (or modify v after/on each use, somehow) — but…"
				"And what if the meta-function itself changes, when something else finds a better variant, but Created's is static…"
"And how to 'leave a fillable slot', a window into absolute chaos from which paths can be pulled out by random walk?… Or how to specify the limitations to which the function conforms, and goals which the variant fulfills best…"
"Is there a way to write this all down more compactly?"




"Actually, having read DataView's documentation, it may be pointless to use number-type-specific types — merely a DataView on top of a Shared/ArrayBuffer (having methods for getting/setting ANY types) and a type marker is enough."



"Also, we probably want to separate deinit and, uh, drop/uncache, because we might want to keep back-refs in case they could be re-merged."
	"(Also, how to allow customizing dropping behavior — how to specify parts that will hold values until deemed no longer necessary, along with their estimated-value, changeable or not (all could be in a Heap if static)?)"
	"…Could it be done with some form of ref-resurrection — if after deinit the ref-count is not 0, do not decompose?"
		"How to specify a set of 'safely-droppable objects' (or a heap)?"




"And a way to store/return/wait-on not-yet-available numbers, which could have approximations, which could cause pre-computation/prediction…  Extended promises; would the earlier Later with throttling-except-on-end suffice?"






"And, represent all (extended) operators as functions, in one namespace, like op['+'](10, [1,2,3])."
	"Number/String are pre-checked/done; all others must be on objects."
	"Calling type(left)['+'] if a function, or type(right)['+'] if a function."
	"(And, represent extension with forEach… or maybe check .isLinear, and do composition ourselves? or with forEach of the longest sequence?)"
	//"(Symbolic computation requires overridable behavior of operators, if/while/…; then, it is very simple.)"


code = {
	define:{
		extend:{
			doc:`Extends a per-element function to operate on arrays, recursive or not, extending the last element if shapes mismatch.
				For all key paths that lead to values, f(…args[…keys]) will be called.
				Each input can either be iterable (with a function .get) or a value (without .get); iterables will get decomposed recursively.
				To allow more efficient extension if needed (like if tensors are on GPU), if all inputs are of the same type T and T.extend is a function, it will be called instead of recursing.
					"But what about Number+Tensor?"
						"Could go with type.super(…args)…"
						"Anything better, not requiring a number to be converted to a tensor?"
							"(And not requiring that which seems too complicated for us.)"
						"Call 5 .extend(5,t) and t.extend(5,t) if present?"
							"First to return non-void wins; if all are void or throw, CPU-extend."
						"Any other option? There has to be something."
							"Pass in args as-is, and if it throws, decompose all args (or re-throw if all are decomposed)? Seems like the best solution, honestly…"
				Iterables have .get()->length|keys and .get(key)->value. (keys here can be an iteratable-by-length-here like an array, or a function, which will be called with this being the object and first arg being the function to repeatedly call with the key.)
					"(Why aren't we using forEach? Can this and that be reconciled to behave more uniformly?)"
				If this is void, the result is an array. If this is not void, it is the type that will be constructed and .set of which will be called, either .set(void, length) (to pre-allocate) or .set(key, value).
				Equal elements at the end are trimmed from a length-having result to one, and if exactly one in total is left, then it is returned instead.`,

			NumPy:`This is not the same as broadcasting in NumPy (though close): NumPy adds 1-sized dimensions when needed at the start, while we do so at the end. (Also, on shape mismatch, we extend the last element, rather than fail.)
				NumPy: [1,2]*[[1,1], [2,2], [3,3]] -> [[1,2], [2,4], [3,6]].
				Here: [1,2]*[[1,1], [2,2], [3,3]] -> [[1,1], [4,4], [6,6]].
				Doing as NumPy does in the general case (recursive arrays, not just a data type knowing all its sizes) is awkward (needs an extra pass to get all sizes, or needs to depend on 0th elements — code is more complex and brittle either way). Besides, repeating a value is more cache-friendly than repeating a pattern, assuming CPU.
				To pad the start rather than the end, simply encase the value in one-element arrays (or define own extending function for tensors if that can be more efficient) (to go the other way, every bottom-level value would have needed such encasing — both slower and more complex).`,

			call(f, ...args) {
				""
			}
		},
	}
}





"Ancient."
	"Should extract equals, and probably multi-hash tables, from this module."
code = {
	name:'merging',
	define:{
		merge:{
			doc:`merges an object with its past conceptually-equal instance if it exists.
				works best when called on every object as a structure is assembled from the bottom up, to achieve deep merging.`,
			call(o) {
				if (!o) return o;
				"Also, should we not merge o's backrefs too (for when/if holes in a merged temp-pattern are filled in)?"
				try {
					"should o[prototype].shape be able to be a function, for an iterator?"
					"should we define a global forEach(array or function or …, callback)?"
					let min, len;
					"for each ref, findHash(ref, o); find one with min tableLength, exiting if 1"
						"o.forEach? or o[prototype].forEach?"
						"What about findHash(type(o), o)? (and null/void…)"
					if (isTable(min)) {
						for (let i=0; i in min; ++i) if (equals(min[i], o)) return min[i];
					} else if (equals(min, o)) return min;
					return ref(o);
				} finally { set(o) }
					"uhh, we decided to NOT set-args-to-void on function end — calling facility should take care of that for us…"
						"but how to do freeing that both does not get in rewrite's way AND works before the rewrite? Since merging is such a common operation."
			}
		},
		cached:{
			doc:`call a function, potentially merging it with a previous call.`,
			//might just be replaced with Op{…}…
			call(f, ...args) {
				""
			}
		},
	},

	//touch type, creating init/deinit/id, extending shape with hashTable
		//Should this also handle touch-function, giving it .id?
			//Or even, types (objects) and functions are treated the same, with same gifts?
		//What do init/deinit do, by default?









	call() {
		function uniq(o) { return shared(o) ? 'share' : 'own' }
		console.log('=== Merging test');
		"Should be re-done with tests…"
		let a = init(Array, 1,2,3);
			"There is currently no Array init-er…"
			"Should init/deinit be static, or instance methods, on prototype?"
			"Would it not make more sense to make init/deinit instance methods?"
				"So we should go to init and do that."
		a = merge(a);
		console.log(a, uniq(a), a === merge(init(Array, 1,2,3)), uniq(a));
		const b = merge(init(Array, a,2,3,4));
		console.log(b, uniq(b), b === merge(init(Array, a,2,3,4)), uniq(b));
	},



	findHash(at, o) {
		let t = tableOf(at);
		const hash = type(o && o[prototype].hash, Array);
		for (let i = 0; i in hash; ++i) {
			const h = hash[i](o);
			if (!(h in t)) return;
			if (!isTable(t[h])) return t[h];
			t = t[h];
		}
		("May return a { [hashTable]:true, 0:…, 1:…, 2:… } object",
			"so that when finding amongst many, only the shortest one can be searched.")
		return t;
	},
	add(at, o) {
		let t = tableOf(at);
		if (t === void 0) t = asTable(at, hashTable);
		const hash = type(o && o[prototype].hash, Array);
		for (let i = 0; i in hash; ++i) {
			const h = hash[i](o);
			if (!(h in t)) return Object.define(t, h, o, true, true, false), void 0;
			if (!isTable(t[h])) t = asTable(t,h);
			t = t[h];
		}
		if (isTable(t)) Object.define(t, tableLength(t), o, true, true, false);
	},
	remove(at, o) {
		let t = tableOf(at);
		if (!isTable(t))
			return (type(at)[hashTable] = t===o ? void 0 : t), void 0;
		removeImpl.i = 0, removeImpl.o = o, removeImpl.hash = type(o && o[prototype].hash, Array);
		t = type(at);
		t[hashTable] = removeImpl(tableOf(at));
		if (t[hashTable] === void 0) delete t[hashTable];
	},




	equals(a,b) {
		if (a===b || a!==a && b!==b) return true;
		if (!a || !b || typeof a !== typeof b) return false;
		if (typeof a !== 'object' && typeof a !== 'function') return false;
		if (!self(a[prototype], b[prototype])) return false;
		if (typeof a === 'function' && !(code in f)) return false;
		if (a[prototype].equals) return a[prototype].equals.call(a,b);
		let k = Reflect.ownKeys(a);
		try {
			for (let i=0; i < k.length; ++i) {
				if (!(k[i] in b)) return false;
				const g = Object.getter(a, k[i]), s = Object.setter(a, k[i]);
				if (g !== Object.getter(b, k[i])) return false;
				if (s !== Object.setter(b, k[i])) return false;
				if (!g && !s && a[k[i]] !== b[k[i]]) return false;
			}
		} finally { set.destroy(k) }
		k = Reflect.ownKeys(b);
		try {
			for (let i=0; i < k.length; ++i)
				if (!Object.owns.call(a, k[i])) return false;
		} finally { set.destroy(k) }
	},

	hashTable: Symbol('hashTable'),
	tableLength(t) {
		if (!t || t[hashTable] !== true) return 1;
		if (!(0 in t)) return 0;
		if (!(1 in t)) return 1;
		let j = 1;
		while ((j<<1) in t) j <<= 1;
		for (let s = j>>>1; s; s >>>= 1) if ((j|s) in t) j |= s;
		return j+1;
	},
	tableOf(t) {
		if (!t || typeof t !== 'object' || typeof t !== 'function')
			return t && t[prototype][hashTable];
		if (t[hashTable] && t[hashTable] !== true) return t[hashTable];
		return t;
	},
	isTable(t) { return t && t[hashTable] === true },
	asTable(o,h) {
		const t = { [hashTable]:true };
		if (o === null) o = self.null || (self.null = {});
		if (o === void 0) o = self.void || (self.void = {});
		if (h === hashTable) {
			if (h in o) return;
			o[h] = t;
			if (typeof h !== 'symbol') return t;
			if (!o.shape) (o.shape = []).free = true;
			"But .shape is supposed to be on type…"
				"Should it be changed to be on prototype?"
			if (!o.shape.includes(h)) o.shape.push(h);
		} else {
			if (h in o) t[h] = o[h];
			Object.define(o, h, t, true, true, false);
		}
		return t;
	},
	removeImpl(t) {
		if (!isTable(t)) return t === self.o ? void 0 : t;
		if (self.i in self.hash) {
			const h = hash[self.i](self.o);
			if (h in t) {
				++self.i, t[h] = self(t[h]);
				t[h] === void 0 && delete t[h]; ("void does not ref, and cannot be back-ref.")
			}
		} else {
			let j = 0;
			for (; j in t; ++j) if (t[j] === self.o) break;
			if (j in t) {
				const len = tableLength(t);
				t[j] = t[len-1], delete t[len-1];
			}
		}
		for (let k1 in t) {
			for (let k2 in t) if (k1 !== k2) return t;
			return t[k1];
		}
	},

	hashSeed: Math.floor(Math.random() * Math.pow(2, 32)),
	//and the hashes; + and ^ to mix, mix with shifted-self many times or not.
		//Perhaps defining hashes would work better as a separate module.
}





















//pre-defining bytes() for different stuff could be nice.
	//It could also be nice to be able to define functions AND the method they are (supposed to be) generated by, like "const m=memory(), f(), return(memory(m))"



























code = {
	name:'Ancient fragment. Ignore it.',
	call() {
		const pow = Math.pow;
		const bin = {
			['**']: (a,b) => pow(a,b),
			['*']: (a,b) => a*b,
			['/']: (a,b) => a/b,
			['%']: (a,b) => a%b,
			['+']: (a,b) => a+b,
			['-']: (a,b) => a-b,
			['<<']: (a,b) => a<<b,
			['>>']: (a,b) => a>>b,
			['>>>']: (a,b) => a>>>b,
			['&']: (a,b) => a&b,
			['^']: (a,b) => a^b,
			['|']: (a,b) => a|b,
			['<']: (a,b) => a<b,
			['<=']: (a,b) => a<=b,
			['>']: (a,b) => a>b,
			['>=']: (a,b) => a>=b,
			['===']: (a,b) => a===b,
			['!==']: (a,b) => a!==b,
			['==']: (a,b) => a==b,
			['!=']: (a,b) => a!=b,
			in: (a,b) => a in b,
		};
		const uno = {
			['+']: x => +x,
			['-']: x => -x,
			['!']: x => !x,
			['~']: x => ~x,
			void: x => void 0,
			typeof: x => typeof x,
		};
		"and logical… but how to define those, where the unnecessary branch is not computed?"
	},
}












































code = {
	name:"view",
	define:{
		view:{
			doc:`creates or updates a visual element based on a rule, contents of which are based on .toString-expansion of its rule.
				this is the element to update, or void.
				elements can be updated asynchronously.
				rule can have properties defined which can influence appearance/behavior; see view.prop for details on each.
				on rule, .name;  .style, .attr, .keys;  pre* / on*.`,
			name:`string. used only in DOM — 'span' by default; the tag name of the DOM element (if '', this virtual element does not create a DOM element).`,
			style:`object.`,
			attr:`object.`,
			keys:`object.`,
			pre:`functions. (maybe should be an object, to minimize string manipulation?)`,
			on:`functions. (maybe should be an object, to minimize string manipulation ('on' + evt.type)?)`,
			call(rule, ...args) {
				"rule can also be a string, to specify just a dom tagName, with args being children."
					"Or, should we have specialized functions, for DOM/SVG/… namespaces?"
				if (type(rule.toString) !== Function) type(rule, Function);
				"shall we have a class for visual elements?"
					".dom, .rule, .args — anything else? …children?"
					".update which uses emit.collect on .rule and .args."
					".force to expand all children immediately."
					"View? Elem? Node?"
				"actually, some may need to be extracted to a more global place, like styles or animations or svg definitions… (when shared, but not when an HTML element)"
				"and html->svg needs to be wrapped in a <svg>, and svg->html needs to be wrapped in a <html>, and style/animation needs to always be extracted to its place…"
					"and script wrapped in <script> or whatever — how are scripts specified, exactly? maybe just a function?"
						"a function (of …args) as name, a function in on, a function in pre, a function in style, a function in keys, maybe in attr…"
					"what if we make styles/attrs not properties of rules, but children things?"
			},
		},
	},
	call() {
		"if document exists, attach all listeners to document.body, and update it with view.document (args being… `index.html/arg0/arg1/arg2#arg3`? Any way to separate #id and `?query=strings`?)."
		"if in console, or preparing-to-send-stuff, what do we want?"
			"we do want fullscreen-viewing interface if possible (intercepting keys and such), and we do want read-line interface if possible (each line is an arg, and the result is output)."
				"how are keys sent? how are colors done? We CAN do without either — for now."
		"on a server, an interface like… listen(port, rule) would be good?"
			"or, just callback-decoration, view.html(rule), to be used in http.createServer(options, view.html(rule))?"
	},
}












































"Twin watcher of this library, it ensures peace.  Without its approval, none shall emit."
	"Should probably be rewritten with forEach.rewrite."
code = {
	name:"match",
	define:{
		match:{
			doc:``,
			call(...args) {
				"number/string: match the codepoint/s and advance."
				"first function and rest of args, or array (only one in in): apply them, return its result."
					"a function is either a Function .matchString on its class, or a Function."
					"which returns void if failed to match."
				"return true and advance if otherwise succeeded, void (and return to start) if not."

				"this.a = match`hello${Number}there` — matches `hello 12 there` if Number matches `12`."
			}
		},
	},
}
//ASI just means that newlines can be skipped anywhere except for a few places
	//("no LineTerminator here"; where semicolons are not inserted:
		//postfix ++/--, continue/break, return/throw, yield/async).
	//...by god. NOW it's on, and matching/viewing is required.
	"match end (of a node) should skip all whitespace (unless match.raw)."
		"…except, we return not match(), but the semantic value, so can't catch match end, or can we?"
			"should we instead skip the beginning whitespace? we do not produce either start/end ws in emit."
			"should we `return match() && value`?"
				"that will force us to always store it in a var though."
	"match.go(to: index|void)->index (skipping to next codepoint start)"
		"the first match.go() remembers the index, and allows parts of cache before it to be dropped."
	"match.look()->cp|void"
	"what about match.expect(word), that aborts matching the node if it fails…"
		"it does need an eqv, `match.expect(w); …act` -> `if (match(w)) act`…"
"external use should probably be like match.collect(Array, func, ...args)->Array."
	"what about tab-completion (suggesting characters/classes that are wanted at a place)?"
		"modify first array, and return an array of suggestions afterwards?"
	"what about match.splice, for modification?"
	"how to use node-cache efficiently? how can it be implemented?"
		"(there was something about preferring the old match if it covered more, too.)"
		"an array of [pos, …nodes], sorted by potentially-repeating pos."
			"usually we only add to the end, and backtracking has a time cost."
			"each node is either a string, or its own cache, yes."
				"or, what about functions?"
				"in fact, every branch in value-match must have a representation here."
	"what about remembering the looked-farthest-index for each subnode?"
		"…what about remembering subnodes, and not just enclosing?"
			"should we even do that, can't we just use .toString to get the intended display contents?"
			"simply enclosing and forgetting the original COULD be very convenient, and semantically appropriate too…"
				"but won't we lose the remembering-partial-matches, and thus pause/continue, ability?"
				"but match.collect is intended to allow restoring that ability, with external control."
					"but what should it do if it runs past the end of the string?"
					"or if we don't want to re-create the strings stored deeply, for every match?"
	"what about uniting the cache structure and in/out representations?"
		"many ways to peer at a position, and all of them lead to the same technician."
		"(a string is just one such way — but more there are, hidden away.)"
		"match.extract([pos, …nodes], …values) -> void if it needs to be called more, (what if failed?), anything else for the result?"
			"but result IS the updating of cache."
				"if succeeded, zeroth pos will contain a node equal to …values."
				"return true if need more, false if not."
			"or perhaps, match.try would be more sly."
	"another 'external' use would be, for a type with .toString, construct .matchString from that."
"should also have an eqv, (try-30-strings-in-order)=(construct-prefix-tree-and-.go-with-that)."
	"would probably make more sense in basic-syntactical iterator viewpoints."

"should have a `if/else if/else if/else` ←→ `switch/case/default` eqv, with if/else preferred."




























































































































"With fallthrough switch cases, it is possible to restore execution of a function to a certain point efficiently (by passing in a number of where should enter, and going from that — with all scoped resources saved and restored too)."









code = {
	name:'relink',
	a:1,
	call(define) {
		console.log('Pre-network is ready.')
		this.document && document.body.append('Ready')
		this.document && (document.body.style.textAlign = 'center');
		("There shall be no commentary, only functions and dream strings.")
		"Visit the whole network and re-link the functions better (clean f[code].node, enhance it, )."
	},
}
code = {
	name:'emit — will this have to be rewritten in light of forEach/…?',
	define:{
		emit:{
			doc:`emit a sequence of strings or string-expansions to the serialization context, ignoring void 0.
				to serialize, use String(v) or v.toString() — inside that, use emit.
				put spaces between values if between same chars or not before/after any of "!\"#%&'()*+,-./:;<=>?@[\\]^\`{|}~" (unlike emit.raw). pass in function(prevChar, nextChar)->value as this to override this behavior if needed.
				intended to be used inside .toString() { try { emit('content') } finally { return emit() } }, that can be used as a definition of both string-conversion and node-tree-expansion.
				do not use manual string conversions inside, like ''+s or […].join(',') (it won't work) — use emit(s) or emit.join([…], ',').
				emit objects/functions either alone or after inline strings.
				if expand is a function or a .toString-having object, passing an array [expand, …args] or calling emit(expand, …args), will expand.call(…args) — or collect [expand, …args].
				(.toString(…) can depend on: its arguments, emit.into, or emit.depth (for pretty-printing, at least 1 — always 1 in emit.collect).)`,
			raw:{
				doc:`emit a sequence of strings or string-expansions.
					does not insert extra spaces (but they can be inserted by an emit(…) call right after).
					otherwise, same as emit(…).`,
				call(...values) {
					{ const a = unrollTemplate(...values);  if (a) return self(...a) }
					if (!values.length) return end();
					try {
						++emit.depth;
						if (typeof values[0] === 'function' || typeof values[0] === 'object')
							raw(values);
						else
							values[Object.forEach] = raw;
					} finally { --emit.depth }
				}
			},
			collect:{
				doc:`collect (raw) emits made by shallowly expanding value into an array and return it.
					it may have strings, objects, functions, or arrays [obj/func, >=1 arg].
					value can be any of those (but not a whole array of those).
					spacing between different collects is not emitted.
					this is the emit.into to use if passed.`,
				call(value, ...args) {
					if (ctx.collects) throw "Tried to collect emissions while already collecting";
					ctx.collects = true;
					const start = ctx.length, old = emit.into, prev = ctx.prev;
					emit.into = this !== void 0 ? this : emit.into, ctx.prev = void 0;
					try {
						++emit.depth;
						raw(!args.length ? value : [value, ...args]);
						return ctx.slice(start);
					} finally {
						--emit.depth;
						ctx.prev = prev, emit.into = old, ctx.length = start;
						ctx.collects = false;
					}
				}
			},
			join:{
				doc:`the separator joins array's elements together, each expanded with optional …args.
					if passed a function: while it returns a function, call it, emitting separator between calls.`,
				call(separator, arr, ...args) {
					if (type(arr) === Array) {
						emit.call(this, arr[0], ...args);
						for (let i=1; i < arr.length; ++i)
							emit.call(this, separator), emit.call(this, arr[i], ...args);
					} else if (type(arr) === Function) {
						arr = arr.call(this, ...args);
						while (type(arr) === Function)
							emit.call(this, separator), arr = arr.call(this, ...args);
					} else throw "Tried to join neither an array nor a function";
				}
			},
			prettyPrinted:{
				doc:``,
				call(value, spaces = '  ', breakOnLength=80, ...args) {
					type(spaces, String), type(breakOnLength, Index);
					pretty.spaces = spaces;
					pretty.line = breakOnLength;
					const a = deepCollect(value, ...args);
					markDeepLengths(a);
					return pretty(a, 0);
				}
			},
			call(...values) {
				{ const a = unrollTemplate(...values);  if (a) return self(...a) }
				if (!values.length) return end();
				try {
					++emit.depth;
					if (type(values[0]) === Function || type(values[0]) === Object)
						raw(values);
					else
						for (let v of values)
							if (type(v) !== String) raw(v);
							else if (this === void 0)
								ctx.prev !== void 0 && raw(space(ctx.prev, v[0])), raw(v);
							else if (type(this) === Function)
								ctx.prev !== void 0 && raw(this(ctx.prev, v[0])), raw(v);
							else throw "Invalid spacing function passed to emit";
					easier:{"Non-BMP chars as args to space() are not in the supported base"}
				} finally { --emit.depth }
			},
		},
	},
	ctx:[],
	space:{
		doc:`whether a space will be emitted by non-raw emit between two chars`,
		no:" !\"#%&'()*+,-./:;<=>?@[\\]^`{|}~",
		call(prev, next) {
			if (prev === next || !self.no.includes(prev) && !self.no.includes(next)) return ' ';
		}
	},
	end() {
		if (!emit.depth) {
			const s = ctx.join('');
			ctx.prev = emit.into = void 0, ctx.length = 0;
			return s;
		}
	},
	invalidUtf16: /[\ud800-\udbff](?:$|[^\udc00-\udfff])|(?:^|[^\ud800-\udbff])[\udc00-\udfff]/,
	raw(v) {
		if (v === void 0 || !v && type(v) === String) return;
		if (type(v) === Array) {
			if (v.length === 0) throw "Tried to emit an empty array";
			else if (v.length === 1) v = v[0];
			else if (ctx.collects && emit.depth > 1) return ctx.end = v, ctx.prev = void 0;
			else return v[0].call(...v.slice(1));
		}
		if (type(v) === String) {
			if (invalidUtf16.test(v)) throw "Tried to emit an invalid-utf16 string";
			if (v) ctx.end = v, ctx.prev = v[v.length-1];
		} else if (type(v) === Number) {
			type(v, Codepoint);
			v = String.fromCodePoint(v);
			ctx.end = v, ctx.prev = v[v.length-1];
		} else if (type(v.toString) === Function) {
			if (ctx.collects && emit.depth > 1) ctx.end = v, ctx.prev = void 0;
			else v.toString();
		} else if (type(v) === Function) {
			if (ctx.collects) ctx.end = v, ctx.prev = void 0;
			else v();
		} else throw "Tried to emit '" + v + "'";
	},

	deepCollect(v, ...args) {
		const a = emit.collect(v, ...args);
		for (let i=0; i < a.length; ++i)
			if (type(a[i]) !== String)
				a[i] = deepCollect(a[i]);
		return a;
	},
	firstDeepChar(a) { return type(a) === String ? a[0] : a && self(a[0]) },
	lastDeepChar(a) { return type(a) === String ? a[a.length-1] : a && self(a[a.length-1]) },
	needsSpace(prev, next) {
		prev = lastDeepChar(prev), next = firstDeepChar(next);
		return prev && next && !!space(prev, next);
	},
	markDeepLengths(a) {
		let min = 0, max = 0;
		for (let i=0; i < a.length; ++i) {
			if (type(a[i]) !== String) self(a[i]);
			min += type(a[i]) !== String ? a[i].min : a[i].length;
			max += type(a[i]) !== String ? a[i].max : a[i].length;
			if (i && needsSpace(a[i-1], a[i])) ++min;
		}
		a.min = min, a.max = max + a.length-1;
	},
	deepDepth(a) {
		let max = 1;
		for (let i=0; i < a.length; ++i)
			if (type(a[i]) !== String)
				max = Math.max(max, self(a[i]) + 1);
		return max;
	},
	tightFlatten(a, depth) {
		if (type(a) === String) return a;
		if (!depth) {
			const r = [];
			for (let i=0; i < a.length; ++i) {
				if (i && needsSpace(a[i-1], a[i])) r.end = ' ';
				r.end = a[i];
			}
			return r.join('');
		} else {
			let max = 0;
			for (let i=0; i < a.length; ++i) {
				a[i] = self(a[i], depth-1);
				max += type(a[i]) !== String ? a[i].max : a[i].length;
			}
			a.max = max + a.length-1;
			return a;
		}
	},
	looseFlatten(a) {
		if (type(a) === String) return a;
		const r = [];
		for (let i=0; i < a.length; ++i)
			i && a[i-1] !== ' ' && a[i] !== ' ' && (r.end = ' '), r.end = self(a[i]);
		return r.join('');
	},
	pretty(a, depth) {
		if (type(a) === String) return a;
		if (a.min > self.line) {
			const r = [];
			for (let i=0; i < a.length; ++i)
				i && (r.end = '\n' + self.spaces.repeat(depth)), r.end = self(a[i], depth+1);
			return r.join('');
		}
		for (let d = deepDepth(a); d >= 0; --d) {
			if (a.max <= self.line) return looseFlatten(a);
			tightFlatten(a, d);
		}
		return looseFlatten(a);
	},

	unrollTemplate(...v) {
		if (type(v[0]) === Array && v[0].raw) {
			if (v[0].length !== v.length) throw "invalid tagged-template call";
			const a = [v[0][0]];
			for (let i=1; i < v.length; ++i)
				a.end = v[i], a.end = v[0][i];
			return a;
		}
	},
	call() { emit.depth = 0, ctx.collects = false, emit.into = void 0, ctx.prev = void 0
		const o1 = { toString() {
			try { emit`as1${void 0}df2` } finally { return emit() }
		} };
		const o2 = { toString() {
			try { emit('{..', o1, '..}') } finally { return emit() }
		} };
		console.log('test:', o2.toString());
		console.log('prettier:\n' + emit.prettyPrinted(o2, '  ', 10));
	},
}







code = {
	name:"iteration/composition",
	define:{
		forEach:{
			why:`
				The composition of any particular representation (of knowledge, code, AST, match/replace rules, etc.) is well-defined; any representation (discarding equivalencies) should define exactly one way of iterating over it, and/or building it.
				Not defining this de/composition in one place leads to duplicating this logic anywhere it comes up, for functions and types separately, leading to lots of bugs and inconsistencies, and this is such a basic thing that it comes up very often: equality, hashing, merging, differencing, extending/broadcasting, parsing and serialization.
				While JS does allow de/composition, its ways are practically not usable — see .builtinIterableProtocols.
				Besides, defining .get/.set generically allows to have a generic .rewrite(from, with, to), combining read (forEach, find, reduce, slice) and write (flatten, map/filter, expand/transform, splice) — most useful in parsing.
				(map/filter might use some defining, to re-use input when it is owned exclusively — though, what does it really save, half the space in CPU cache? But, could maybe just incorporate this into forEach, by having an array of to-write values for when more is written than was read.)
				While calling several functions per iteration might not be the most performant technique, it is nonetheless necessary to provide a reliable foundation. It only needs to hold until we could re/write code properly and automatically, with complete knowledge of what can be omitted where, at a level comparatively about as basic and pervasive as machine code.
				(And these methods are sync. While these methods could check for promises and return a promise if any are detected, that would make the code much more complex and repetitive (and slightly slower) (and dependent on a particular definition of async), for practically no gain. Check for asynchonicity elsewhere, where it is more suited.)`,

			doc:`
				For each key that makes up obj, on.call(obj, key, write = void 0), synchronously.
				Combines [].forEach/.map/.filter into a more general function.
				Simultaneously reads and writes; see .read/.write for details. To only read (and pass void as write inside on), do not pass to.
				Throw forEach.break from on to exit the loop early (result, if any, will still be finalized).`,
			read:`
				To read an object, it must provide a way to decompose itself into parts.
				.get-decomposition: obj.get(key)->value, obj.get()->length|keys (keys is a function (called like f.call(obj, on)) or have .get->length; no keys must be void).
				`,
			write:`
				To write an object, it must provide a way to compose itself from parts.
				.set-composition: an instance of the written type, obj, should have a method obj.set(key, value)->void|obj (this/written/destination can change, though the called function will be the same). For pre-allocation, key could be void; for finalization (do not invoke it manually), both will be void; to write to an increasing index, pass void as value (in .set, value will never be void).
				Be careful with passing void to write — it has special meaning for all key/value combinations, and will (likely) not throw.
				(For string->value, use Hash instead of Object.)
				(Often, get/set integrity (always reads what was written) is assumed (elsewhere). Also, post-finalization type should usually be the requested type (though not required to be). In addition, it is assumed in other places that objects are constant and do not change their de/composition after being constructed/built/written. Technically, these properties are optional.)
				`,
			break:Symbol('forEach.break'),
			builtinIterableProtocols:`
				Not usable because they allocate hideously: for each iteration, a new object, exactly as the spec says (in Node.js (10.15), 40 bytes per iteration) — which means very noticeable garbage-collection stops in anything like tight loops.
				More, they depend on Symbol.iterator, and since we often want to iterate over all properties of an object, including symbols in iterations is only possible through more allocation (for the result of Reflect.ownKeys or Object.getOwnPropertySymbols). (And if we want to be fully generic with iteration, we have to consider getters/setters too, detecting which either depends on deprecated methods OR allocates memory (AND complicates handling of values everywhere, anyway) (…OR both, like with Node.js (10.15), which allocates 16 bytes per function call).)`,
			refs:`Everything this function family touches is assumed to be properly ref-counting — in particular, returning ref-d results/keys (caller is responsible for unref-ing both args and result).`,
			void:`Synonym for undefined, or void 0 (shorter). Using it as a special marker value (everywhere) and not a real value allows some things to be shorter and more convenient, such as not returning anything from .set to not change this (not forcing 'return this'), or testing for a key's existence with .get (not forcing .has).`,

			call(obj, on, to = void 0) {
				type(obj.get, Function), type(on, Function);
				if (to !== void 0) {
					type(to.prototype.set, Function);
					info.o.push(init(to));
					info.f.push(ref(to.prototype.set));
					info.n.push(0);
				} else info.n.push(void 0);
				try {
					const f = obj.get();
					try {
						if (f === (f>>>0))
							for (let i=0; i < f; ++i) set(on(i, to && write));
						else if (type.is(f, Function)) {
							info.on.push(ref(on)), info.arr.push(ref(obj));
							try { set(f.call(obj, iter)) }
							finally { set(info.arr.pop()), set(info.on.pop()) }
						} else {
							type(f.get, Function);
							const r = len(f.get());
							for (let i=0; i < r; ++i) {
								const key = f.get(i);
								try { set(on(key, to && write)) }
								finally { set(key) }
							}
						}
					} catch(err) { if (err !== forEach.break) throw err }
					finally { set(f) }
					if (to !== void 0) return write(), ref(last(info.o));
				} finally {
					if (to !== void 0)
						set(info.o.pop()), set(info.f.pop());
					info.n.pop();
				}
			},

			key:{
				doc:`Alias for forEach, provided for symmetry with forEach.value.`,
				call(obj, on, to = void 0) {
					self[code] = forEach[code];
					return forEach(obj, on, to);
				}
			},
			value:{
				doc:`Like forEach, but instead of passing keys, passes values.
					For each value that makes up obj, on.call(obj, value), synchronously.`,
				call(obj, on, to = void 0) {
					info.len.push(ref(on));
					try { return forEach(obj, valueIter, to) }
					finally { set(info.len.pop()) };
				}
			},

			length:{
				doc:`Returns the number of times forEach will call (unless exited early).
					Often faster than counting one-by-one.`,
				call(obj) {
					type(obj.get, Function);
					const f = obj.get();
					try {
						if (f === (f>>>0)) return f;
						else if (type.is(f, Function)) {
							info.len.push(0);
							try { set(f.call(obj, count)); return last(info.len) }
							finally { info.len.pop() }
						} else {
							type(f.get, Function);
							return len(f.get());
						}
					} finally { set(f) }
				}
			},
			isLinear:{
				doc:`Returns whether obj is a linear sequence, like an array.`,
				call(obj) {
					type(obj.get, Function);
					const f = obj.get();
					if (f === (f>>>0)) return true;
					else return set(f), false;
				},
			},
			rewrite:{
				doc:`
					Like forEach, but inverses control over reading keys, allowing going back and forth in the input key list.
					Controller function f (replacing on) is called (once) like f.call(obj, read, write). Inside, write(key, value) will write, read()->key|void will read next, read(index) will go (back) to index (and return old index) (not key, even though they are the same for arrays), read(forEach.length) will return total number of input keys (always pre-computed).
					To only read, pass void as to; to only write, pass void as obj. Irrelevant functions-parameters to f will be void.
					Must not be used with infinite collections.`,
				call(obj = void 0, f, to = void 0) {
					type(f, Function);
					if (obj !== void 0) {
						type(obj.get, Function);
						const f = obj.get();
						try {
							if (f === (f>>>0)) {
								info.len.push(f), info.arr.push(f);
							} else if (type.is(f, Function)) {
								info.arr.push(init(Array)), info.len.push(0);
								try { set(f.call(obj, addKey)) }
								catch (err) { set(info.arr.pop()), info.len.pop(); throw err }
							} else {
								type(f.get, Function);
								info.len.push(len(f.get())), info.arr.push(f);
							}
						} finally { set(f) }
						info.on.push(0);
					}
					try {
						if (to !== void 0) {
							type(to.prototype.set, Function);
							info.o.push(init(to));
							try {
								info.n.push(0);
								info.f.push(ref(to.prototype.set));
								try { "If no end is in sight, try try try."
									try { set(f.call(obj, obj && next, write)) }
									catch(err) { if (err !== forEach.break) throw err }
									return write(), ref(last(info.o));
								} finally { set(info.f.pop()), info.n.pop() }
							} finally { set(info.o.pop()) }
						} else
							try { set(f.call(obj, obj && next, void 0)) }
							catch(err) { if (err !== forEach.break) throw err }
					} finally {
						if (obj !== void 0)
							info.len.pop(), set(info.arr.pop()), info.on.pop();
					}
				}
			},
		},
		Array:{
			prototype:{
				get(k) {
					if (k===void 0) return this.length;
					if (k !== (k>>>0)) throw "Tried to get in an array at not-an-index";
					return ref(this[k]);
				},
				set(k,v) {
					if (k===void 0) {
						if (v === void 0) return;
						if (v !== (v>>>0)) throw "Tried to set length of an array to not-an-index";
						this.length = v;
					} else {
						if (k !== (k>>>0)) throw "Tried to set in an array at not-an-index";
						if (this[k] !== v) ref(v), set(this[k]), this[k] = v;
					}
				},
			}
		},
		Hash:{
			doc:`A decomposable alternative to JS objects.
				A map from string keys to (non-void) values.
				Losing getters/setters and symbol properties and prototypes gains the lack of need to allocate memory for functionality related to de/composition.`,
			init(h) { if (!h.o) h.o = {} },
			prototype:{
				get(k) {
					if (k===void 0) return forEachInHash;
					if (typeof k !== 'string') throw "Tried to get in a Hash at not-a-string";
					return ref(this.o[k]);
				},
				set(k,v) {
					if (k===void 0) {
						if (v !== void 0) throw "Tried to set length of a Hash";
					} else {
						if (typeof k !== 'string') throw "Tried to set in a Hash at not-a-string";
						if (this.o[k] !== v) ref(v), set(this.o[k]), this.o[k] = v;
						if (v === void 0) delete this.o[k];
					}
				},
			}
		},
		String:{
			prototype:{
				textEncoding:`utf16`,
				get(k) {
					if (k===void 0) return this.length;
					if (k !== (k>>>0)) throw "Tried to get in an array at not-an-index";
					return this.charCodeAt(k);
				},
				set(k,v) {
					if (v===void 0)
						return type(this) === Array ? this.join('') : this;
					if (typeof this==='string') {
						const a = init(Array);
						try {
							this && a.push(this);
							String.prototype.set.call(a,k,v);
							return a;
						} catch (err) { set(a); throw err }
					} else if (type(this) === Array) {
						if (this.length >= 16 && pow2(this.length)) {
							{"Assuming a re-allocation happens, joining might take less memory."}
							let len = 0;
							for (const i=0; i < this.length && len < this.length*4; ++i)
								len += this[i].length;
							if (len < this.length*4)
								this[0] = this.join(''), this.length = 1;
						}
						if (typeof v==='string') this.push(v);
						else if (v === (v>>>0)) this.push(String.fromCharCode(v));
						else type(v, String, Index);
					} else throw "Invalid this for String..set";

					if (k===void 0) {
						if (v === void 0) return;
						if (v !== (v>>>0)) throw "Tried to set length of an array to not-an-index";
						this.length = v;
					} else {
						if (k !== (k>>>0)) throw "Tried to set in an array at not-an-index";
						if (this[k] !== v) ref(v), set(this[k]), this[k] = v;
					}
				},
			}
		},
		//"And Map/Set(/WeakMap/WeakSet), right?"
			//"Map/WeakMap already have .get/.set, which we use in some places, though."

		props:{ get:'forEach', set:'forEach' },

		tests:[
			() => {
				let n = 1;
				forEach([1,2,3,4], function(k) {
					if (k === 3) throw forEach.break;
					n *= this.get(k);
				});
				return n === 6;
			},
			() => {
				const a = forEach.value([1,2,3,40], (v,w) => {
					v===3 && (w(0), w(0));
					v!==2 && w(v*2);
				}, Array);
				try {
					return JSON.stringify(a) === '[2,0,0,6,80]';
				} finally { set(a) }
			},
			() => forEach.length([1,2,3]) === 3,
			() => forEach.length(Hash.prototype) === 0,
			() => forEach.isLinear(['test']),
			() => !forEach.isLinear(Hash.prototype),
			() => {
				const a = forEach.rewrite([1,2,3,40], function(r,w) {
					w(0);
					for (let k = r(); k !== void 0; k = r()) k%2 === 0 && w(this.get(k)*2);
					r(0), w(0);
					for (let k = r(); k !== void 0; k = r()) k%2 === 1 && w(this.get(k)*2);
					w(0);
					throw forEach.break; ("Same as returning, in ".rewrite)
				}, Array);
				try {
					return JSON.stringify(a) === '[0,2,6,0,4,80,0]';
				} finally { set(a) }
			},
			() => forEach.rewrite('hello', function(r,w) {
				for (const k = r(); k !== void 0; k = r())
					w(this.get(k)), w(this.get(k) + 1), w(this.get(k)), w(32);
			}, String) === 'hih efe lml lml opo ',
			() => forEach.rewrite(void 0, (r,w) => {
				w('this'), w(' '.charCodeAt()), w('str');
			}, String) === 'this str',
		],
	},
	info:{ f:[], o:[], n:[], on:[], arr:[], len:[] },
	len(r) {
		if (r !== (r>>>0)) throw set(r), "The decomposing object should be linear (obj.get().get() should be an index)";
		return r;
	},
	last(a) { return a[a.length-1] },
	count(k) {
		if (k === void 0) throw "A void .get-decomposition key encountered";
		++info.len[info.len.length-1];
	},
	iter(k) {
		if (k === void 0) throw "A void .get-decomposition key seen";
		last(info.on).call(last(info.arr), k, last(info.n) && write);
	},
	valueIter(k,w) {
		const v = this.get(k);
		try { last(info.len).call(this, v, w) }
		finally { set(v) }
	},
	addKey(k) {
		if (k === void 0) throw "A void .get-decomposition key detected";
		++info.len[info.len.length-1], info.arr.push(ref(k));
	},
	next(i) {
		const on = last(info.on), arr = last(info.arr), len = last(info.len);
		if (i === void 0) {
			if (on >= len) return;
			if (typeof arr === 'number') return info.on[info.on.length-1]++;
			return arr[info.on[info.on.length-1]++]];
		} else if (i === forEach.length) return len;
		if (i !== (i>>>0)) throw "Passed not-an-index to read/rewrite's next";
		if (i > len) i = len;
		info.on[info.on.length-1] = i;
		return on;
	},
	write(k,v) {
		if (k !== void 0 && v === void 0) v = k, k = [info.n[info.n.length-1]++;
		const r = last(info.f).call(last(info.o), k, v);
		if (r !== void 0 && r !== last(info.o))
			info.o[info.o.length-1] = set(last(info.o), void 0, r);
	},
	forEachInHash(on) { let k; if (this.o) for (k in this.o) on(k) },
	pow2(n) { return !(n & (n-1)) },
}












code = {
	name:"mark — has not found a use yet.",
	define:{
		mark:{
			doc:`leaves a mark on an object, which can be retrieved later: mark(o,v), mark(o)→v.
				a marking context must first be entered, and finally left.
				unmarked objects return void from mark(o) after entering.`,
			enter:{
				doc:`enter a marking context`,
				call() { ctx.end = void 0 }
			},
			leave:{
				doc:`leave a marking context after entering`,
				call() {
					if (!ctx.length) throw "must enter a marking context before leaving it";
					if (ctx.length === ctx.notch) {
						for (let i=0; i < notchMarked.length; ++i)
							notchMarked[i][notch] = void 0;
						notchMarked.length = 0;
						ctx.notch = 0;
					}
					ctx.end;
				}
			},
			etch:{
				doc:`leave a spot on an object which holds marks, merely to speed up marking.`,
				call(o) { o[notch] = void 0; return o }
			},
			call(o, v = void 0) {
				if (!ctx.length) throw "must enter a marking context before marking";
				if (v === void 0) {
					if (ctx.length === ctx.notch) return o[notch];
					if (ctx[ctx.length-1]) return ctx[ctx.length-1].get(o);
				} else {
					if (!ctx.notch) ctx.notch = ctx.length;
					if (ctx.length === ctx.notch) {
						if (ctx[ctx.length-1]) throw "using notch while not using notch, oops";
						o[notch] = v;
					} else {
						(ctx[ctx.length-1] || (ctx[ctx.length-1] = new WeakMap)).set(o, v);
					}
				}
			}
		},
	},
	notch:Symbol('mark.etch'),
	notchMarked:[],
	ctx:[],
}
code = {
	name:"refs — quite a few rough spots.",
	define:{
		init:{
			doc:`constructs/inits and returns an object of a type, possibly pulling it from cache.
				built-in object creation methods should be replaced with a call to init.
				'new T(...args)' → 'init(T, ...args)'.
				'[…]' → 'init(Array, …)'.
				'{…:…}' → 'init(Object, init(Array, …), init(Array, …))'.`,
			count:0, min:void 0,
			call(T, ...args) {
				if (type(T) === Function) {
					if (T === String) return '';
					if (T === Number) return 0;
					if (T === Boolean) return false;
					if (T === Symbol) return T(...args);
					return new T(...args);
				}
				type(T, Object);
				if (!T.prototype) throw "called init on a type without .prototype";
				type(T.prototype, Object, Function);
				let o;
				if (T.empty && type(T.empty, Array).length) o = T.empty.end, o[refs] = 1;
				else {
					o = Object.create(T.prototype), o[refs] = 1;
					if (T.shape && type(T.shape, Array)) {
						for (let i=0; i < T.shape.length; ++i)
							o[T.shape[i]] = void 0;
						if (!T.shape.free) seal(o);
					}
					++self.count;
				}
				type(T.init) === Function && T.init(o, ...args);

				if (self.min === void 0) self.min = memory();
				else if (memory() < self.min) self.min = memory();
				if (memory(self.min) > 256e6) self.min = void 0, cleanNow();

				return o;
			}
		},
		ref:{
			doc:`A shorter alias for set(void 0, void 0, o).
				Use to push responsibility for unref-ing onto somebody else, like 'return ref(a[i])' (but 'return f()') or 'a.push(ref(v))', with consequent 'set(value)' to unref. Caller/creator is responsible for unref-ing both inputs and outputs (with set(o)).`,
			call(o) { return set(void 0, void 0, o) }
		},
		set:{
			doc:`Reference-counting (on objects/functions) set/write/change operation.
				Caller/creator is responsible for ref/unref of created resources — since this is very inconvenient to remember, should be isolated to the lowest level possible, like the language.
				symbols or non-enumerable properties are not ref-counted.
				all assignments (including finally dropping vars to void) should be rewritten to use it (unless proven to be unneeded).
				will not collect cycles easily — use set.join or implement garbage collection for that.
				only things created with init will ref-count — use set.mark to adopt a structure to ref-count.
				'a.k = b' → 'set(a, "k", b)'; 'a = b' → 'set(a, void 0, b)'.
				'a.k = f(v, g())' → 'a.k = f(set(0,0,v), g())' (do not ref results of operations/functions).
				'delete a.k' → 'set(a, "k"), delete a.k'.
				'set(o,k, v1), set(o,k, v2)' → 'v1, set(o,k, v2)'.
				…what about re-defining a value to be get/set? And (re-)defining a value.
					probably have to re-define those too, huh?`,
			join:{
				doc:`joins reference counters of two ref-counted things, allowing cycles to be collected.
					do not join if no circular references are known.
					for each edge between two different nodes in a ref cycle, call set.join(o, o[k]).
					(for a two-node trivial cycle/loop/circuit, it must be called twice.)
					when the cycle breaks, set.split can be called for each edge to re-allow separate collection (though not necessary).`,
				report:`
In reference counting, breaking loops is usually accomplished with 'weak references', to not increment ref-count selectively, based on program knowledge.
For example, in tree structures, parent and siblings references should be weak references.
If aiming to ref-count on JS objects, weak refs do not fit their dynamic nature (have to either store another object of which keys are weakly-referenced, or mark entire objects as weakly-referencing (and/or have a special weak-reference object class), neither of which helps with saving memory).
Besides, they are brittle for references to objects holding weak refs — all further manipulations require detailed program-level knowledge of how it was made, to ensure use-after-free is never possible. It makes a generic auto-rewrite much more complicated, and intertwines data and code.
Garbage collection is always possible, but there is an overhead, and the freeing is delayed arbitrarily — which doesn't help with re-using the same objects to save memory in tight loops and such.
But there is another solution: joining ref-counts — an object's ref-counter can point to another object with a ref-counter (which fits well if object references are fitted in the NaN part of 8-byte float numbers, as is usually the case in JS).
Semantically, the tree example would have one ref-count for the whole tree, and not always-1 pseudo-count on non-root nodes — which is much clearer.
It can never free potentially-used objects, so is not brittle in that regard, and does not require knowledge after creation.
Perfect for working with static structures, since it can never leak if cycles do not ever separate.
The only brittle part is splitting ref-counts, which requires program-level knowledge of how many refs there are to each object — but that is exactly what working with weak refs requires, and is only limited to dynamic cycle breaking.
(While weak references here are technically supported with symbols or non-enumerable properties, it is more for being able to use a mostly-non-allocating for-in loop.)`,
				call(a,b) {
					if (!refable(a) || !refable(b)) return;
					if (refable(a[refs])) a = a[refs];
					if (refable(b[refs])) b = b[refs];
					type(a[refs], Index), type(b[refs], Index);
					if (!a[refs] || !b[refs]) throw "joined cycles must not be already collected";
					if (a !== b) a[refs] += b[refs], b[refs] = a;
					--a[refs];
				}
			},
			split:{
				doc:`after set.join(o, o[k]), call set.split(o, o[k]) to split reference counts.
					if b has any non-cycle refs, their count must be precisely passed as bRefs — else one or the other will never be collected.`,
				call(a,b, bRefs = 0) {
					if (!refable(a) || !refable(b)) return;
					type(bRefs, Index);
					if (refable(a[refs]) && !refable(b[refs])) [a,b] = [b,a];
					if (refable(a[refs])) a = a[refs];
					if (bRefs > a[refs]) throw "too many outside refs predicted";
					type(a[refs], Index);
					if (refable(b[refs])) {
						if (a !== b[refs]) throw "splitting those not of the same cycle";
						b[refs] = 0;
					} else {
						type(b[refs], Index);
						if (bRefs > b[refs]) throw "too many outside refs predicted";
					}
					b[refs] += bRefs, a[refs] -= bRefs;
					++a[refs];
				}
			},
			destroy:{
				doc:`if an object had references, ignores them and destroys/collects it.
					(for garbage collection.)`,
				call(obj) {
					if (!refable(obj)) return;
					if (refable(obj[refs])) obj = obj[refs];
					if (obj[refs] || !(refs in obj)) obj[refs] = 1, unref(obj);
				}
			},
			//Also, set.mark(…references), for adoption (or cycle splittage, right?).
			//(and if we are doing deep search, gc too, from define if no other points were specified?)
			call(obj, k, v) {
				if (k === void 0) {
					return obj !== v && (unref(obj), ref(v)), v;
				} else {
					if (!refable(obj))
						throw `set at ${k} on ${obj===null ? 'null' : typeof obj}`;
					if (owns(obj, k) && obj[refs] && obj[k] !== v)
						return unref(obj[k], obj), ref(v, obj), obj[k] = v;
					else return obj[k] = v;
				}
			},
		},
		shared:{
			doc:`true if obj must be copy-on-write (is shared with others).
				false if obj can be modified in-place (with no fear of affecting others).
				with this, seemingly-copy-on-write operations can be implemented seamlessly and efficiently.`,
			call(obj) {
				"Now that the caller is responsible for cleaning up args, mere shared(o) is not enough — no guarantee that the caller does not use it after."
					"We could make something that marks an object as last-use…"
					"Or we could make the caller free before call — actually no, not all operations can re-use their inputs for outputs."
				if (!refable(obj)) return true;
				return !(refs in o) || (refable(o[refs]) ? o[refs][refs] : o[refs]) !== 1;
			}
		},
		Array:{
			txt:`an ordered set/collection of elements, with methods for manipulating sequences.`,
			init(a, ...of) {
				a.length = of.length;
				for (let i=0; i < a.length; ++i) set(a, i, of[i]);
			},
			//copyWithin, fill, slice, splice, should all become ref-aware.
			//start/end getters/setters shall also become ref-aware.
			//and define reduce.
			//and define filter, map, expand — should they be copy-if-shared (except for reduce)?
		},
		Object:{
			txt:`an unordered key/value store, where keys are strings or symbols or indexes (seen as strings on iteration).
				practically, on iteration, indexes will usually be first and ordered; then strings, then symbols, in order of insertion.`,
			init(o, k, v) {
				type(k, Array), type(v, Array);
				if (k.length !== v.length) throw "object key/value lengths must match"
				for (let i=0; i < k.length; ++i) set(o, k[i], v[i]);
			},
			//Should also re-define all object-property-manipulation methods.
		},
		//probably also re-define methods of Map/WeakMap/Set/WeakSet to be ref-aware.
		//and Object.getset/.define.
		//and WebAssembly.Table.prototype.get/.set.
	},
	seal: Object.seal,
	refs: Symbol('refs'),
	refable(o) { return (typeof o === 'object' || typeof o === 'function') && o },
	cyclic(a,b) {
		if (!refable(a) || !refable(b)) return false;
		if (a === b) return true;
		if (refable(a[refs]))
			return refable(b[refs]) ? a[refs]===b || a===b[refs] || a[refs]===b[refs] : a[refs]===b;
		else
			return refable(b[refs]) ? a===b[refs] : false;
	},
	owns(o,k) {
		if (typeof k !== 'string' || !(k in o)) return false;
		if (o[prototype] !== Object.prototype || k === prototype || k === Object.string)
			if (!Object.enum.call(o,k)) return false;
		return type(o).shape && !type(o).shape.free || !Object.getter(o,k) && !Object.setter(o,k);
	},
	ref(v,o) {
		if (v && v[refs] !== void 0) {
			if (cyclic(v,o)) return;
			if (refable(v[refs])) v = v[refs];
			type(v[refs], Number), ++v[refs];
		}
	},
	unref(v,o) {
		if (v && v[refs]) {
			if (cyclic(v,o)) return;
			if (refable(v[refs])) v = v[refs];
			type(v[refs], Number);
			if (!--v[refs]) deinit(v);
		}
	},
	cleanLater(t) {
		cleanNow.t.with = t;
		if (!cleanNow.will) delay(cleanNow), cleanNow.will = true;
	},
	cleanNow:{
		t:new Set, will:false,
		call() { self.will = false, self.t[Object.forEach] = cleanType }
	},
	cleanType(t) {
		if (t.empty) {
			const l = type(t.empty, Array).length;
			if (t.empty.length > 1024) t.empty.length = 1024;
			if (t.empty.length > 16) t.empty.length = 16;
			else t.empty.length = 0, cleanNow.t.without = t;
			init.count -= l - t.empty.length;
			"Should do something about object resurrection (it is in caches, but its[refs] is not zero); not decrease count for those here and not return them from uncaching?"
		} else cleanNow.t.without = t;
	},
	deinit(o) {
		if (!(refs in o)) return;
		const T = type(o);
		o[refs] = 0;
		type(T.deinit) === Function && T.deinit(o);
		if (!T.empty) T.empty = [];
		if (T.shape && type(T.shape, Array))
			for (let i=0; i < T.shape.length; ++i)
				o[T.shape[i]] = set(o[T.shape[i]], void 0);
		else //Should likely be forEach, not simply such a branch.
			for (let k in o)
				if (owns(o, k))
					o[k] = set(o[k], void 0), delete o[k];
				"also, what about maps, or arrays, or WebAssembly.Table?"
					"should be able to properly iterate over all those, too."
					"forEach(o,f) should probably be used."
		type(T.empty, Array).end = o;
		"Should also keep track of init.active, so that tests could assert no ref-leaks."
			"And maybe a way to actually store created objects, and possibly their creation/destruction stack-traces, so that tests could display ref-leaks?"
		cleanLater(T);
	},
}
code = {
	name:"priorityHeap",
	define:{
		Heap:{
			txt:`a priority heap/queue; a min-first Number->value store.
				entries are pushed in any order, popped in ascending order, min-first.
				same-key values are extracted in an arbitrary order.`,
			init(h, cmp=null) { h.k = init(Array), h.v = init(Array), h.cmp = cmp },
			shape:['k', 'v', 'cmp'],
			forEach(h,f) {
				var min = init(Heap, h.cmp);
				min.push(h.k[0], 0);
				while (min.length()) {
					var i = min.pop();
					f(h.k[i], h.v[i]);
					i = more(i);
					if (i-1 < h.k.length) min.push(h.k[i-1], i-1);
					if (i < h.k.length) min.push(h.k[i], i);
				}
			},
			build(h,k,v) { return !h && (h = init(Heap)), h.push(k,v), h },
			prototype:{
				push(k,v) {
					type(k, Number);
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

				key:{
					doc:`gets or sets the key of the (now-)min element.`,
					call(k = void 0) {
						if (k === void 0) return this.k[0];
						return this.k[0] = type(k, Number), down(this, up(this, 0));
					}
				},
				value:{
					doc:`gets or sets the value of the min element.`,
					call(v = void 0) { return v === void 0 ? this.v[0] : this.v[0] = v }
				},

				length:{
					doc:`gets or limits the length of the heap.
						to limit its length, may remove some min elements.`,
					call(l = void 0) {
						if (l != void 0) while (l < this.k.length) this.pop();
						return this.k.length;
					}
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
		if (b === h.k.length) swap(h, i, i = a);
		return i;
	},
}
code = {
	name:"delay",
	define:{
		delay:{
			txt:`delays the execution of a function asynchronously.
				zero-delay callbacks are executed in order; others — when requested, as soon as possible.
				no state can be passed to the callback (schedule own callback-executing function instead).
				scheduled functions can not be cancelled.
				CPU usage is limited to delay.options.maxTimeUsage (0…1).
				use delay over setImmediate or process.nextTick or setTimeout or requestAnimationFrame (unless the delay specifically for animating is wanted).
				in browser background tabs, effects of timeout throttling are minimized — scheduling 100 callbacks to fire in a second will fire all in a second or two.
				callbacks that timed out (throw void 0, usually automatically-inserted) will be called again — other exceptions will not be tolerated.`,
			options:{ maxTimeUsage:.2 },
			call(ms, func) {
				if (type(ms) === Function) "the order does not matter", [ms, func] = [func, ms];
				if (ms === void 0) ms = 0;
				type(func, Function), type(ms, Number);
				if (!(ms >= 0)) throw "delay ms expected to be a positive number, got " + ms;
				if (!ms) imm.end = func, immLater();
				else {
					if (info.origin === void 0) info.origin = time();
					if (!info.next) info.next = init(Heap);
					info.next.push(time(info.origin) + ms, func);
					delayed();
				}
			},
		}
	},
	imm:[],
	info:{ origin:void 0, immWill:false, delayedWill:false,
		next:null, isImm:false, used:0, total:0, immLast:0 },
	immNow() {
		info.immWill = false, info.isImm = true;
		if (info.origin === void 0) info.origin = time();
		var start = time(info.origin);
		var max = delay.options.maxTimeUsage;
		info.total += start - info.immLast, info.immLast = start;
		if (info.used >= info.total * max) return immLater();
		var dur = Math.min((info.total * max - info.used) / (1 - max), 10);
		try {
			for (var i=0; i < imm.length && time(info.origin) <= start + dur; ++i) {
				if (i >= 128 && imm.length-i <= 8) i-=128, imm.splice(0,128);
				imm[i].call();
			}
		} catch (err) { if (err !== void 0) throw imm.splice(0,1), err } finally {
			imm.splice(0,i), immLater(), info.isImm = false;
			dur = time(info.origin) - start;
			info.used += dur, info.total += dur, info.immLast += dur;
			info.used /= 2, info.total /= 2;
		}
	},
	immLater() {
		if (!info.immWill && imm.length) {
			if (delay.options.maxTimeUsage < .1)
				setTimeout(immNow, 100);
			else if (typeof process !== ''+void 0) {
				(info.isImm ? setTimeout : process.nextTick)(immNow, 10);
			} else if (typeof requestAnimationFrame !== ''+void 0)
				requestAnimationFrame(immNow);
			else setTimeout(immNow, 10);
			info.immWill = true;
		}
	},
	delayed() {
		try {
			if (info.origin === void 0) info.origin = time();
			while (info.next.key() <= time(info.origin))
				info.next.value()(), info.next.pop();
		} catch (err) { if (err !== void 0) throw info.next.pop(), err } finally {
			if (info.next.length() && !info.delayedWill) {
				setTimeout(delayedTimer, info.next.key() - time(info.origin));
				info.delayedWill = true;
			}
		}
	},
	delayedTimer() { info.delayedWill = false, delayed() },
}
code = {
	name:'type',
	define:{
		syntax:[
			v => { typeof v==='boolean', type(v)===Boolean, type.is(v, Boolean) },
			v => { typeof v==='number', type(v)===Number, type.is(v, Number) },
			v => { typeof v==='string', type(v)===String, type.is(v, String) },
			v => { typeof v==='function', type(v)===Function, type.is(v, Function) },
			v => { typeof v==='symbol', type(v)===Symbol, type.is(v, Symbol) },
			v => { typeof v===''+void 0, type(v)===void 0, type.is(v), v===void 0 },
			v => { v && typeof v==='object', type.is(v, Object) },
			v => { !v && typeof v==='object', type.is(v, null), type(v)===null, v===null },
		],
		Int:{ is(v) { return type.is(v, Number) && v>>0 === v } },
		Index:{ is(v) { return type.is(v, Number) && v>>>0 === v } },
		Codepoint:{ is(v) { return type.is(v, Index) && (v < 0xd800 || v>=0xe000 && v<0x110000) } },
		Object:{ is(v) { return v && typeof v==='object' } },
		type:{
			doc:`Returns the type of value, or asserts that it is one of the supplied types and returns it.
				"Should also have type.super(…v), the type which all can be converted to or void… but how can we do this without actual value conversion?"`,
			is:{
				doc:`Checks if a value belongs to a type.`,
				call(v, type) {
					const t = T(v);
					if (t === type) return true;
					if (type && T(type.is) === Function && type.is(v)) return true;
					return false;
				}
			},
			call(v, t0, t1, t2, t3) {
				(tN:"An optimization, because …types allocates memory, and this is called a lot.")
				if (t0 === void 0) return T(v);
				if (t3 !== void 0) throw "Too many expected types passed to type(…)";
				if (t0 !== void 0) {
					if (type.is(v, t0)) return v;
					if (t1 !== void 0) {
						if (type.is(v, t1)) return v;
						if (t2 !== void 0) {
							if (type.is(v, t2)) return v;
							throw `Unexpected type: ${descr(T(v))} (expected ${descr(t0)} or ${descr(t1)} or ${descr(t2)})`;
						}
						throw `Unexpected type: ${descr(T(v))} (expected ${descr(t0)} or ${descr(t1)})`;
					}
					throw `Unexpected type: ${descr(T(v))} (expected ${descr(t0)})`;
				}
				throw 'Should not happen';
			}
		},
		to:{
			//to should probably be type.to. OR, not exist?
			doc:`convert v to any of types and return it, or throw an exception if not possible.
				use this to specify type interfaces for functions, at the front.
				type(result, ...types) will never throw, and to(result, ...types) will return result.
				uses v.to(...types), which should call to(converted) for each suggested variant.
					(should it pass ...types through, or not?)
						(why would we want to alter the to-types list?)`,
			call(v, ...types) {
				if (!types.length) return T(v);
				"maybe, if !types.length, return type of v — and replace type with self entirely?"
				"use mark to not re-visit already-visited ones; store types on self."
					"…what exactly do we want to mark?"
						"types of values? a value could sometimes convert into different forms, could it not?"
						"values? but deeply-equal values will not be marked the same."
				"depth-first search? breadth-first search?"
				"should we not mark, and just recurse immediately?"
					"or wait for a complete list of suggestions, and if none fit, convert each..."
			}
		},
	},
	T(v) {
		if (v === void 0 || v === null) return v;
		if (typeof v === 'function') return Function;
		v = v[prototype];
		return v === Object.prototype || !v ? Object : v.constructor || null;
	},
	isOf(v, types) {
		const t = T(v);
		for (let i=0; i < types.length; ++i)
			if (t === types[i]) return true;
			else if (T(types[i].is) === Function && types[i].is(v)) return true;
		return false;
	},
	descr(t) {
		try {
			return t && t.name ? t.name : String(t);
		} catch (err) { set(err); return '<type>' }
	}
}
code = {
	name:"measure",
	define:{
		time:{
			doc:`Measures elapsed time: time()→mark, time(mark)→ms; ms>=0.
				Browsers limit timer precision by default (to mitigate side-channel attacks (exploiting hardware optimizations to guess normally-inaccessible data)); performance measuring benefits from disabling this behavior: in Firefox, in about:config, set privacy.reduceTimerPrecision to false.
				(Browser timing randomization will likely wreak havoc on time and time.guess.)`,
			call(mark = 0) {
				type(mark, Number);
				if (typeof performance!==''+void 0)
					return Math.max(0, performance.now() - (mark && mark + self.time));
				if (!mark) return process.hrtime.bigint();
				return Math.max(0, Number(process.hrtime.bigint() - mark)/1e6 - self.time);
			},
			guess:{
				doc:`Measures elapsed time: time()→mark, time(mark)→ms; ms>=0.
					Less precise than time(…), but faster (if slower, it is replaced with time(…)).`,
				call(mark = 0) {
					const n = Date.now();
					if (info.last > n) info.delta += info.last - n;
					return (info.last = n) + info.delta - mark;
				}
			},
			limit:{
				doc:`Allows imposing and checking an approximate time-limit on execution.
					.limit() throws void if time-limit is exceeded; .limit(ms) will set the time-limit if it will be more restrictive than before; .limit(∞) will reset the time-limit (making .limit() not throw). Time-limit will also be reset after a 0-ms timeout after setting.`,
				call(ms = void 0) {
					if (ms === void 0) {
						if (info.limit && time.guess() > info.limit) throw void 0;
						return;
					}
					type(ms, Number);
					if (ms === Infinity) return void(info.limit = 0);
					if (!info.limit) info.limit = time.guess();
					else info.limit = Math.min(time.guess() + ms, info.limit);
					if (!info.lock) setTimeout(resetTimeLimit, 0), info.lock = true;
				}
			},
		},
		memory:{
			doc:`Measures memory change: memory()→mark, memory(mark)→bytes.
				Accurate (in Node.js — replaced with memory.guess in browsers).
				The bytes result could be negative (can only get the change of used memory, not allocations). Garbage collections will make the result less than was allocated — disregard outliers in repeated measurements.
				In Node.js (10.15), every call to this allocates memory (about 1-2 KB) — use memory.guess to not; memory(memory()) might not return 0, but will try to anyway (by pre-calibrating).`,

			guess:{
				doc:`Guesses the current memory usage from the number of currently-active ref-tracked objects (the precise method of guessing is completely unbased).
					Though very useful for optimizing memory usage in certain conditions, browsers do not expose any such interface.`,
				call(mark = 0) { return type(mark, Number), init.count*256 - mark }
			},
			call(mark = 0) {
				type(mark, Number);
				const m = process.memoryUsage();
				return m.rss + m.heapUsed - m.heapTotal - (mark + self.memory);
			}
		},
		tests:[
			() => time(time()) >= 0,
			() => time.guess(time.guess()) >= 0,
			() => memory(memory()) % 1 === 0,
			() => memory.guess(memory.guess()) % 1 === 0,
		],
	},
	info:{ last:0, delta:0, limit:0, lock:false },
	resetTimeLimit() { info.limit = 0, info.lock = false },
	call() {
		time.time = 0;
		const start = time();
		for (let i=0; i < 100; ++i) time(start);
		const durPrecise = time(start);
		for (let i=0; i < 100; ++i) time.guess(start);
		const durApprox = time(start) - durPrecise;
		if (durApprox > durPrecise*2) time.guess[code] = time[code];

		let f; {"Calibrate time/memory to account for devilry."}
		f = time, f(), f(), f(), f.time = (f(f()) + f(f()) + f(f())) / 3;
		if (f.time > 1) f.time = 0;
		if (typeof process===''+void 0)
			memory[code] = memory.guess[code];
		else {
			(f = memory).memory = 0, f(), f(), f(), f.memory = f(f());
			if (f.memory > 3000) f.memory = 0;
		}
	},
}
code = {
	name:"browserSpecific (including hot reloading on source change)",
	define:{
		favicon(ctx) {
			if (ctx instanceof CanvasRenderingContext2D) var c = ctx.canvas;
			else var c = context(ctx.imageData || ctx).canvas;
			c.toBlob ? c.toBlob(faviconBlob) : set(c.toDataURL());
		},
		notify(msg, title = document.title || 'Alert') {
			msg = String(msg);
			const iconUrl = get().href;
			if (typeof browser!==''+void 0)
				browser.notifications.create({ type:'basic', iconUrl, message:msg, title });
			else {
				if (N.permission !== 'granted' && N.permission !== 'denied') N.requestPermission();
				new N(title, { body:msg, icon }).onclick = close;
			}
		},
	},
	call() {
		if (typeof browser!==''+void 0)
			browser.notifications.getAll().then(o => Object.keys(o)[Object.forEach] = browserClear),
			("notifications would sometimes bug out and never close — just kill all.");
		if (typeof document===''+void 0 || typeof fetch===''+void 0) return;
		setInterval(checkSources, 5000);
	},
	N: typeof Notification!==''+void 0 && Notification,
	context(x) {
		var ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = x.width, ctx.canvas.height = x.height;
		return x.data && ctx.putImageData(x,0,0), ctx;
	},
	browserClear(id) { browser.notifications.clear(id) },
	get() {
		const e = document.querySelector('link[rel=icon]') || document.createElement('link');
		"wait — do we ever actually append it to document.head?"
		return e.rel = 'icon', e;
	},
	set(x) {
		get().href = x; typeof browser!==''+void 0 && browser.browserAction.setIcon({ path:x });
	},
	faviconBlob(blob) { URL.revokeObjectURL(get().href), set(URL.createObjectURL(blob)) },
	close() { this.close(), "instantly" },
	last:{ not:0, log:0 },
	sources:{},
	checkSources() {
		let url;
		if (!(document.URL in sources)) {
			sources[document.URL] = void 0;
			for (let i=0; i < document.scripts.length; ++i)
				(url = document.scripts[i].src) && (sources[url] = void 0);
		}
		for (url in sources)
			if (sources[url] !== null) {
				let k = url;
				fetch(k).then(r => r.text())
				.then(s => !sources[k] ? sources[k]=s : sources[k]!==s && location.reload())
				.catch(() => sources[k] = null);
			}
	},
}
code = {
	name:"randomNumbers",
	buf:{ a:new Uint32Array(1024), pos:1024 },
	define:{
		random:{
			txt:`Returns something uniformly-distributed and randomly-chosen.
				With no args, returns a number from 0 to 1 (1 is exclusive).
				With an integer n, returns an integer in 0…n-1.
				With an array, returns any element.`,
			max: Math.pow(2,32),
			call(end = void 0) {
				if (type(end) === Array) return end[self(end.length)];
				const l = random.max;
				if (end === void 0) return (self(l) + self(l)/l) / l;
				if (end<=0 || end%1) throw 'Expected a positive int — exclusive limit of the generated random number; got '+end;
				if (end > l) throw 'Provided upper limit is too big: '+end;
				do {
					if (buf.pos >= buf.a.length) buf.a.pos = 0, self.fill(buf.a);
					var x = buf.a[buf.pos++];
				} while ((end & (end-1)) ? (x >= l - l % end) : false);
				return (end & (end-1)) ? (x & (end-1)) : x % end;
			},
			bit() {
				if (!self.n) self.x = random(), self.n = 32;
				const r = self.x & 1;
				self.x >>= 1, --self.n;
				return r;
			},
			fill(a, bytes = void 0) {
				a = new Uint32Array(a.buffer || a);
				if (bytes === void 0) bytes = a.byteLength;
				if (typeof crypto!==''+void 0 && crypto.getRandomValues) {
					const quota = 65536, n = Math.floor(bytes/quota);
					let src = n && new Uint32Array(quota), i;
					for (i = 0; i < n; ++i) crypto.getRandomValues(src), a.set(src, i*quota);
					src = new Uint32Array(bytes - n*quota);
					crypto.getRandomValues(src), a.set(src, n*quota);
				} else for (let i = 0; i < a.length; ++i)
					a[i] = Math.floor(Math.random() * random.max);
				return a;
			},
		}
	}
}
code = {
	name:"prettify",
	define:{
		prettify:{
			doc:`capitalizes first letters in (English) sentences and separates words in camelCase, putting '.' at the end.
				'escapeThisHTMLHere' → 'Escape this HTML here.', 'Uint32Array' → 'Uint 32 array.'.
				in-code variable/function names are much prettier when seen this way.`,
			call(s) {
				s = s.trim();
				s = s.replace(/[a-z0-9][A-Z](?=[A-Z])/g, s => s[0] + ' ' + s[1]);
				s = s.replace(/[a-z0-9][A-Z](?=[a-z])/g, s => s[0] + ' ' + s[1].toLowerCase());
				s = s.replace(/[A-Z][A-Z](?=[a-z])/g, s => s[0] + ' ' + s[1].toLowerCase());
				s = s.replace(/[a-zA-Z][0-9]/g, s => s[0] + ' ' + s[1]);
				s = s.replace(/[\.\?\!…]\s+[a-z]/g, s => s.toUpperCase());
				s = s.replace(/^[a-z]/, s => s.toUpperCase());
				s = s.replace(/[^\.\?\!…]$/, s => s[0] + '.');
				return s;
			},
			back:{
				doc:`converts (English) sentences to in-code names, of the format [a-z][a-zA-Z0-9]*.`,
				call(s) {
					s = s.replace(/\ba\b/g, '');
					s = s.replace(/(?:^|[^a-zA-Z0-9])+([a-zA-Z0-9]|$)/g, (s,c) => c.toUpperCase());
					s = s.replace(/^[0-9]+/, '');
					s = s.replace(/^[A-Z]/, s => s.toLowerCase());
					return s;
				}
			},
		},
	},
}























