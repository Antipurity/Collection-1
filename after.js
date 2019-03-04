code = {
	doc:`Code here is separated into modules cleanly to combine easily.
		Each little viewpoint here has a hole into which any viewpoint can fit — extensibility and non-interference at the same time; with self-knowledge, overhead of any checking can be eliminated.
		Finding any way to make even more holes and modules from these is always appreciated.

		('code.js' defines the particular shapes this program takes.)`

	define:{ [Symbol()]: 'the public interface of a module' },
	call() { 'the function that is called on initialization of a module' },
	rest: 'private variables, visible (but const) from any function of a module',

	obj:{
		call() { 'makes obj a function' },
		arrays: ['are merged into one array (used for defining tests)'],
		allKeys: 'must be enumerable strings.',
		f: 'Function.env(f) returns the creation environment of f (or creates).'
	}
}
















code = {
	name:'call',
	define:{
		tests:[
			() => {
				let b = false;
				call(14, () => b = true).stop().start().finish();
				return b;
			},
		],
		call:{
			doc:`Starts a global interpreter loop. Calls x until it cannot be called. Returns an object with .stop()/.start() — fiber of execution, already marked as started; take responsibility for it.
				An interruptible version of 'while (x && x.call) x = x.call(x); then(x)' (an interpreter, which allows easily overriding executed bodies); throw void to force an interrupt.
				'…Actually, maybe this should not auto-unwrap JS functions (unless finished).'
					'Maybe call should be called run instead, for this?'`,

			why:`Compiling code to a machine-native language (and optimizing compilation) is good, but it is not extensible at runtime, and thus has to be shed eventually. Besides, traditionally, optimizations are exclusively aimed for speed/memory, and the code conversion is one way only.
				Interpreting code is easy to make (compared to a compiler) but slow — but it is the only extensible way. Extensible (conceptual) interpretation is absolutely required, long-term.
				Also, JS lacks interrupts and pause/resume, what kind of language is this?`,

			combo:`Through extension, optimization may be obtained (just like anything else), for any aim in any way — so interpretation is only a temporary step back.
				Represent every call-with-args using act (defined elsewhere) to avoid (allocating) closures and rest args, and to allow symbolic execution / easy functionality overriding / result caching / detection of infinite recursion.
				Not parallel, since that requires a lot of extra effort, in JS or not. Does not have any fancy attention-allocating scheme. Responsible only for doing one thing — execution; do one thing and do it as well as possible. Prefer creating just one fiber, and implement whatever else is needed inside of it.`,

			call(x, then) {
				const f = ref.init(Fiber);
				f.then = ref.take(then), f.x = ref.take(x);
				return f;
			}
		},
	},
	Fiber:{
		doc:`Fiber/thread of CPU execution.`,
		init() { this.then = this.x = this.i = _; this.start() },
		deinit() {
			this.stop();
			this.x = ref.give(this.x, true);
			this.then = ref.give(this.then, true);
		},
		stopped() { return this.i !== _ },
		stop:{
			doc:`Stops/pauses execution. To resume, call .start().
				Will only stop on the next interrupt — to force an interrupt now, throw void.`,
			call() {
				if (this.i === _) return;
				type(this.i, Index);
				const q = step.qu;
				if (this.i !== q.length-1)
					[q[this.i], q[q.length-1]] = [q[q.length-1], q[this.i]];
				ref.give(q.pop(), true), this.i = _;
				return this;
			}
		},
		start:{
			doc:`Starts/resumes execution. To cancel/pause, call .stop().`,
			call() {
				if (this.i !== _) return;
				this.i = qu.length, qu.push(ref.take(this));
				if (!step.lock) delay(step), step.lock = true;
				return this;
			}
		},
		finish:{
			doc:`Finishes execution synchronously, with an optional timelimit.
				If failed to finish (interrupted by throwing void or timed out), returns false — else returns true (and stops it); re-throws any non-void exception.
				The callers must be fully ref-tracking (or not manage any resources), like event handlers (ref.finally is used).`,
			call(ms = _) {
				try {
					const start = time.guess();
					while (ms === _ || time.guess(start) < ms) {
						item.x = ref.take(item.x.call(ref.give(item.x)));
						ref.finally();
						if (!item.x || !item.x.call) {
							try {
								if (item.then)
									item.then(ref.give(item.x, item.x = _));
							}
							finally { item.stop() }
							return true;
						}
					}
					'Should we not signal interrupts with item.x.call()?'
				} catch (err) { if (err !== _) throw ref.take(item.x), item.stop(), err }
				return false;
			}
		},
		'Probably should not have wrap(o), should have finish(o), so that directly-executed and interpreted behaviors can be the same.'
			'…Though then, will we not have to wrap literally every single function node (and inputs) in finish?'
	},
	step:{
		qu:[], lock:false,
		call() {
			if (!qu.length) return;
			step.lock = false;
			random(qu).finish(5);
			if (!step.lock) delay(step), step.lock = true;
		}
	},
}








code = {
	define:{
		trace:{
			doc:`Creates a wrapper around a callable value that will accumulate all (or those passing a filter) no-interrupt called-function sequences into one trace and replace the first function with the trace, minimizing the overhead of interpretation.
				'(Can this truly be done separate from acts?)'
				'(A trace is: functions-passed-through-environment and "return f(g(1),h(a,b))" (using vars if >=2 refs to a node) — or, building up acts, all at once?…)'`,
			call(o) {
				""
			}
		},
	},
}




















code = {
	name:'pure',
	define:{
		pure:{
			doc:`Merges an object (by equality of decomposition) with its past instance if an equal exists. All pure acts and structures must be built up using pure.
				The object will become ref-counted (and given to caller) if it was not already.
				Specify o.pure to return non-_ to pick a single best/canonical form of data.`,
			why:`To eliminate any wasted activity, something must ensure that no repetitions are made, and that multiple incarnations refer to the same concept.`,
			combo:`Deep pure merging allows mapping out a conceptual space most efficiently, and so when combined with having a few methods of estimating what to pick more, leads to sabotaging some measures of good to cycle through possibilities the fastest; ensure that some are opposing.
				By decomposing code to machine-instructions nodes (making the foundation a real machine rather than a virtual one), which optimize their contextual usage with .pure, perfect code generation could be achieved (or as good as the current self-knowledge).`,

			total:0, same:0,
			call(o) { 'Ref-aware (take on entry, give on exit, drop on error)'
				'++.total'
				'If o && o.pure, const r = o.pure(), if (r !== _) return r.'
				'For each of decomposition, if equal of o is in its backrefs, ++.same and return it.'
					'If decomposition is empty, use backrefs of type… everywhere…'
				'If none, put o into backrefs of least-occupied-at-o-multihash and return o.'
					'(Creating a multiHash if any do not have it.)'
			},
			is:{
				doc:`Returns a boolean, which is true if the object is pure.`,
				call(o) {
					'For any of decomposition, if equal of o is in its backrefs, return true.'
				}
			},
			destroy:{
				doc:`Makes the object not mergable with. Returns a boolean, which is true when the object was pure.
					Called on all objects before they are dropped from cache; can also be called before modifying (decomposition of) a not-shared object in-place.`,
				call(o) {
					'--.total'
					'For each of decomposition, if equal of o is in its backrefs, remove and break.'
				}
			},
		},
		tests:[
			() => {
				const a = pure([1,2,3]);
				if (!pure.is(a)) error('is not pure');
				if (a !== pure(a)) error('re-merge went wrong');
				if (a !== pure([1,2,3])) error('did not merge');
				if (pure.destroy(a) !== true) error('was not pure');
			},
			() => {
				const T = { pure() { return this.a }, a:12 };
				const a = pure(T), b = pure(T, T.a=13);
				return a !== b;
			},
		],
	},
	b:Symbol('backrefs'),
	backrefs(v) { 'Ensure _/null/numbers/strings/booleans have pools, else return v[b] || null' },
	eq: 'probably goes here, not in public definitions',
}










code = {
	name:'act — the most important but the least straightforward',
	define:{
		act:{
			doc:`Provides a way to purely instantiate a function with args: when passed a function, returns a function that has to be repeatedly called with each (non-void) arg in turn and finally with void: 'build(Act)(1)(2)(3)(func)()', which returns an instance of an act.
				Call of an act will do what is necessary to compute the function (call callable args then self), and ensure that there is no infinite recursion, and that all functions are extensible by args as needed in any way.
				The final result may be an earlier instantiation if all dependencies are the same — it is conceptually merged.
				Overridable by args/function like '.act(next, caller, fiber)->next' (next must have '.call(this)->this', which must then go to next); if fiber is _, set it; if fiber is same, return last computed value; if fiber is different, suspend it and change next to resume-it-then-next. For functions with '.name', behavior is overridable (by args) by a method 'a[.name]' (unless it returns _) — devoid of ceilings, merely floors to re/build on.
					'(Is there a way to encapsulate/specify these fiber checks closer to fibers?)'
				If act is used as a function of an act, it will expect two args: (a wrapper of) a function, and a linear sequence (forEach.isLinear). Same role as Function.prototype.apply.
				The called function must be of a special form; while a parser/emitter for automatic conversion to this form can be made, we are not there yet. No rest args (to save memory), and each first usage of an arg A at N must be 'A=act(N,A)' (can throw to interrupt execution if it needs computing), and no JS built-in constructs must be used (except return/throw), only function calls made by act; do not recurse directly. Returned acts and functions will be computed to compute the result; to return them as values, use wrap(…). The behavior is then fully de/composable and able to be done both with a direct call and within an act, and args can be not computed if not needed.
					'(Maybe, to allow interoperability with built-in functions, if it has a .length, request all args and call it?)'
					'(If we require functions to describe every single part of themselves, why do we even need functions, and not just things with a hole for args?)'
						'(Functions should just be a bootstrap phase…)'
						'(And, always instantiating may be good if there is lots of uncaching, but extremely bad for CPU caches otherwise. Maybe we should, while keeping function template in memory, store inputs-hash-to-times-computed for each node, and switch to instantiating when there is ≥3 for one hash (or if spent too much time inside one hash?).)'
							(Should we re-use the backrefs object for this?)
							(Should we even lift this backref-on-pressure functionality into pure?)`,

			'Should really be split onto methods of Act, because THIS is a monster.'
				'And, act itself seems unnecessary, only Act is needed…'
			'And, since just returning an act would make the behavior very different in direct execution and interpreted, should have finish(f), to be used for returns?'

			why:`no idea`,

			call(f,v) {
				'if f is a number, info.cur is the current act — get its fth arg; if .cur is _, return v.'
				'assert that both v and info.cur are _.'
				'if act.is(this), expect exactly two args, of which the first is a wrapper of something with .call, and the second one is a linear sequence.'
				'assert that f is has .call.'
				'set info.cur to ref.init(Act), and .set(0,f), and return buildUp.'
			},

			is:{
				doc:``,
				call(o) {
				}
			},
		},
		'And maybe error/catch/finally, here…'
			'Named what? Those are not exactly non-colliding. Or, in what namespace?'

		tests:[
			() => {
				function plus(a,b) {
					if (this) a = this.get(0), b = this.get(1);
						'this can be not-an-act, right? How to check properly, do we NEED Act.is?'
							'(That might be too hard-coded though…)'
					return a+b;
				}
				function F(x) {
					if (this) x = this.get(0);
					return finish(build(Act)(x)(x)(plus)());
				}
				'Is there no way to allow function-override, AND arg-request, AND arg-get, all in one?…'
				return call(finish(build(Act)(2)(F)())).finish() === 4;
			},
		],
	},
	info:{ cur:_, n:0 },
	buildUp(v) {
		'If v is _, merge/return info.cur, clearing cur/n — else info.cur.set(++info.n, v).'
			'(Actually, with the real build (and Act exposed directly), this is not necessary anymore.)'
	},
	Act:{
		pure:{
			doc:`Forwards to .pure of the function if any.`,
			call() {
			}
		},
		call:{
			doc:``,
			call() {
			}
		},
		act:{
			doc:``,
			call(next, parent) {
			}
		},
		get:{
			doc:``,
			call(k) {
			}
		},
		set:{
			doc:``,
			call(k,v) {
			}
		},
	},
}






'hole(f), allowing self-awareness by easy possibility of relevant conceptual self-replication?'
	'Any better name?'
	'How to make substitution actually sane — or at least make it?'
	'Also, having a stack-tracer without any way to actually stop it is kinda silly.'
		'How to signal end of unwind, to allow the accumulated code to actually be used?'
			'Maybe, on creation, be like Promise — pass a function that is passed an on-complete function, and maybe some used-in information for reconstruction.'
	'(Technically, this functionality is that of maybe-partial bind; holes are left to be filled in later, by normal execution or by an outside promise, potentially many times. The bottom of the hole should be able to be used as the function of an Act (have .call).)'
		'(Also, the hole object (its bottom) must decompose to all not-reachable-from-others users — on use, add user to self and remove its composition from self. But then all things form a loop with the hole at the bottom being referred to, and the hole at the top(s) referring to stuff…)'
		'(And to allow both recording of usage and using the record, top(s) and bottom must be separate objects. But, do we even need top(s), since we have .next of acts already more or less ready, only needing something to ensure non-holes are computed?)'
		'(We do need to preserve ALL that depend on it, but on creation of a hole, we must specify how it will be filled…)'
			'((And if so, non-intrusive promises are automatically merged with symbolic execution.))'
	'…Should make all this into a documentation thing.'
code = {}






code = {
	name:'is',
	define:{
		is:{
			doc:`Returns a pure object that matches any instance of the passed type T.
				The result has .is(v=_) that will generate an instance when passed _ or check whether a value is an instance when passed v (or if v is equal to T), and which can be overriden by T.is.
				Matching the result with an instance will return an instance or Any{}.
				To allow type inference, All concept bases (which operate with concrete values) must handle correctly the case where one of the inputs is such a thing (how — is.is?).
					('…what about any/all of types?')`,
			why:`Sometimes useful in pattern-matching and type inference, and to augment type-checking with values-representing-types.`,
			call(T=_) {
			}
		},
	},
	also:`Make type(is(T)) return T, and make type(is(T), A,B) return Any{All{is(T),is(A)}, All{is(T),is(B)}}?`,
}





code = {
	name:'patterns',
	define:{

		Any:{
			doc:`Matches if any values match, or never with no values to match.
				Match of any is any of matches: match(x, Any{A,B}) = Any{match(x,A), match(x,B)}.
				Any and All are completely symmetrical.`,
			pure:{
				doc:`If one element or have an empty Any, return one of those, else inline all Any elements and sort (removing duplicates) (mostly by-type for better branch prediction) (if possible?) and return _.
					'(…Or do we want to turn some interactions of and/or into a single canonical form? Which ones?)'
						'Like an empty All (always | …) being propagated as output?'
							'Why is this stand-alone though?'
							'How to define others to be able to swallow things, like how instances(Number) swallows 1,2,3,4?'
								'.Any(any)/.All(all)? .Any(v)/.All(v) — there is no structure?'
									'Is this too much, since any/all are symmetrical?'
								'inst.is(v), with v swallowed in Any and inst in All?'
									'(If inst.is(v)=>inst.is(type(v)), then we could divide by-type and have efficiency… Is that too much of a limitation to impose though?)'
									'But will we ever have any other types of swallowing?'
									'And, what about any kind of depending-on-match?'
										'Should .is imply "matching-v will always match inst"?'
										'(Or should we swallow one on match(inst,v)===All{}? It would not be symmetrical though, right?)'
						'ab+ac = a(b+c).'
						'(a+b)(c+d) is ac+ad+bc+bd, which may or may not be less in total size. Search for the smallest representation?'
							'Should we really be doing such a (limited) search in building the canonical representation though?'
							'What if we want to search through equivalents for some other purpose, how to organize such a search? And when would we want that?'`,
				call() {
				}
			},
			match:{
				doc:`For each part, writes match(part, v) to the Any result.
					Propagates any possibly-equal parts to output.`,
				call(v) {
				}
			},
		},

		All:{
			doc:`Matches if all values match, or always with no values to match.
				Match of all is all of matches: match(x, All{A,B}) = All{match(x,A), match(x,B)}.
				All and Any are completely symmetrical.`,
			pure:{
				doc:`If one element, return it, else inline all All elements and remove empty Any elements and sort (removing duplicates) (mostly by-type for better branch prediction) (if possible?) and return _.
					'(Actually, just be as Any.)'`,
				call() {
				}
			},
			match:{
				doc:`For each part, writes match(part, v) to the All result.
					Propagates all possibly-non-equal parts to output.`,
				call(v) {
				}
			},
		},

		Not:{
			doc:`Matches if the value does not match.`,
			pure:{
				doc:`Turn not-not-not-x into not-x, not-always into never, not-never into always, else return _.`,
				call() {
				}
			},
			match:{
				doc:``,
				call(v) {
				}
			},
		},

		Sequence:{
			doc:`Matches if values match in a sequence, leaving none.
				'Does an empty sequence match any-length sequence?'
					'We need something that matches any-length sequence, but should it be this?'
						'(…Do we though?)'`,
			pure:{
				doc:`If one element, return it, else return _.`,
				call() {
				}
			},
			match:{
				doc:``,
				call(v) {
				}
			},
			//…Should a Sequence have a type, so that it can build instances of it, and represent its concrete syntax?
				//Then, 'To match instances of a type to a string, override .match to "return build(Sequence)(type)('if')('(')('condition', type2)(')')()".' — how would this built-up representation work with emit though? Do we not need to pass in this instead of type?…
					//(And "To actually do the match, match(instances(type), 'string').".)
		},

		//…How would we assign to keys of the parsed value (or emit them)?
			//Should we have another type for this, Key(obj, k, as)? Not really cow though…

		match:{
			doc:`Conceptual equality check: describes the situations where a and b are the same. Unless overriden, returns everything if a===b or nothing otherwise.`,
			why:`Extensible equality is convenient for expressing many kinds of representation checks and selections in a convenient, declarative, and decomposable way.`,
			combo:`Use match.any/.all to use the result in conditions.
				With Any/All, allows constructive pattern matching (where constructing a concrete example is essentially free).
				With also Not, allows more pattern matching.
				With also instances, allows pattern-matching to all values of a type.
				With Sequence, allows parsing (reading). With emit, allows emitting (writing).`,

			call(a,b) {
				'return a===b ? build(All)() : build(Any)(). [But cache the empty All/Any.]'
				'(To match a written piece to v, "return match(build(Sequence)('[')(']')(), v)" — how to pass in keys of this, for reading/writing?)'
			},
			any:{
				doc:`Checks whether a match can ever match. Returns false if passed an empty Any, true otherwise.`,
				call(r) {
				}
			},
			all:{
				doc:`Checks whether a match always matches. Returns true if passed an empty All, false otherwise.`,
				call(r) {
				}
			},
		},

	},
}





code = {
	name:'get/set',
	define:{
		get:{
			doc:`Returns the part of an object under a key. If k is _, returns its shape (uint32 length or an array(-like object) or a function-iterator (called like 'iter.call(obj, on)', calling 'on(k)')).
				Can be overriden if o defines '.get(k)' (which cannot happen just using set).`,
			call(o, k=_) {
			},

			isLinear:{
				doc:`Tests whether the shape of an object is a uint32 length, meaning that it is a sequence.`,
				call(o) {
				}
			},

			length:{
				doc:`Returns the number of keys in the shape of an object. Fastest for sequences.`,
				call(o) {
				}
			},
		},

		set:{
			doc:`Sets the part of an object under a key to value. If v is _, deletes the value of key; if k is _, sets shape to v (mostly useful for pre-allocation); both cannot be _. Returns the object.
				If the object is owned by set, modifies it in-place — else makes a copy and modifies that; the caller must be ref-tracking. Purity is preserved either way.
				Can be overriden if o defines '.set(k,v)' (which cannot happen just using set).`,

			impl:`Unless overriden, number/boolean keys are stored as-is (converted to string if needed), string keys are prefixed with ⴵ (Or should we store all non-uint32 keys in the multi-hash table?), (symbols — where? how? Should we extend multi-hash table to allow those inside?) (objects/functions — multi-hash table? But how to store both keys AND values; '{ k:…, v:… }'?)…`,

			call(o, k=_, v=_) {
			}
		},

		build:{
			doc:`A utility function for creating pure objects from their decomposition: 'build(Array)(1)(2)(3)() → [1,2,3]'; equivalent to 'forEach(["…"], (r,w) => { w(1),w(2),w(3) }, Array)'.
				Accepts the type to create and returns a function that accepts key/value and returns itself. If value is _, key is the value to store next in a sequence; if key is _, value is the new shape; if none are _, falls through to 'set(o,k,v)'; if both are _, finalizes and returns the resulting object.`,
			call(T) {
			}
		},

		slice:{
			doc:`Creates and returns a view of a sequence, with the specified start/end/step (start=end is an empty sequence); if start/end are less than 0, length of the sequence is added; then start/end/step must be uint32 (step cannot be 0).
				The resulting sequence gets/sets on the original, and goes from inclusive min(start, end) to exclusive max(start, end), in reverse if end<start, with each next index adding or subtracting step original indexes; outside that is void.
				Intended to be a very lightweight thing, and is not merged purely.`,
			call(seq, start, end=_, step=1) {
			}
		},

		tests:[
			() => JSON.stringify(build(Array)(1)(2)(3)()) === '[1,2,3]',
			() => get(build(Array)(1)(2)(3)()) === 3,
			() => get(build(Array)(1)(2)(3)(), 1) === 2,
			() => JSON.stringify(set(build(Array)(1)(2)(3)(), 1, 20)) === '[1,20,3]',
			() => {
				const a = ref.take(build(Array)(1)(2)(3)());
				const after = ref.take(set(ref.give(a, a=_), 1, 20));
				return JSON.stringify(after) === '[1,20,3]' && a === after;
				try {
					const after = ref.take(set(ref.give(a), 1, 20));
					return JSON.stringify(after) === '[1,20,3]' && after === a;
				} finally { ref.drop(a) }
			},
			() => {
				const a = ref.take(build(Array)(1)(2)(3)()), b = ref.take(a);
				try {
					a = ref.take(set(ref.give(a, a=_), 1, 20));
					return JSON.stringify(a) === '[1,20,3]' && JSON.stringify(b) === '[1,2,3]';
				} finally { ref.drop(a), ref.drop(b) }
			},
		],
	},
}





code = {
	name:'MultiHash',
	define:{
		MultiHash:{
			doc:`Unordered store of arbitrary values, retrieved by their decomposition. Not a key/value store (by default). Iff a cheaper-to-compute hash collides, more expensive (or just different) ones are computed instead.`,
		},
	},
}















code = {
	name:'hash',
	define:{
		hash:{
			doc:`Returns the hash-number of an object, suitable as a key; a shallow hash. If objects are equal, their hashes are equal too, else they are very likely different.`,
			why:`A way of optimizing retrieval of unchanging objects, used in hash tables.
				Hashes are chosen to minimize collisions (different-in->same-out); by choosing only functions with an inverse (same-out is only caused by same-in for all values, meaning no collisions) (such as addition or multiplication by a co-prime-with-2³² number, mod 2³²), we minimize collisions (though from inputs and hash, hash seed could be restored).
				(Since we use multi-hash tables (on hash collision, create a sub-hash-table with a different hash function), there is no need to ensure that similar values have wildly different hashes.)`,

			call(o, depth=0) {
				if (info.seed === _) info.seed = random(random.max), info.n = random(4);
				let h = info.seed;
				"For each in o, mix the hash of key with h, and if the value is not object/function, mix it too."
				'If depth, for each object/function of o, mix the hash of value (of depth-1) with h.'
				return h;
			},

			mix:{
				doc:`A simple mixing of two hashes (32-bit unsigned integers) by multiplication-by-constant-then-summing.
					In long chains, should be 'i = mix(i,j)'. Lower bits affect higher bits more.`,
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
					} "Constants were picked to have a min non-2 number of bits."
					return (mult + j)>>>0;
				}
			},
		},

		Boolean:{ prototype:{ hash() { return this ? 1 : 2 } } },
		Number:{ prototype:{ hash() {
			if (this === this>>>0) return this;
			if (this !== this) return 5;
			if (this === Infinity) return 6;
			if (this === -Infinity) return 7;
			let h = hash.mix(this > 0 ? 9 : 10, info.seed);
			const n = this, e = Math.floor(Math.log2(Math.abs(n)));
			h = hash.mix(h,e);
			n = Math.abs(n) * Math.pow(2, -e);
			h = hash.mix(h, Math.floor(n = n * Math.pow(2,32)));
			h = hash.mix(h, Math.floor((n - Math.floor(n)) * Math.pow(2,21)));
			return h;
		} } },
		String:{ prototype:{ hash() {
			let h = info.seed;
			for (const i = 0; i < this.length; ++i) h = hash.mix(h, this.charCodeAt(i));
			return h;
		} } },
		Symbol:{ prototype:{ hash() {
			return hash(this.description || Symbol.keyFor(this) || '');
		} } },
	},
	info:{ seed:0, n:0 },
}



code = {
	name:'eq',
	define:{
		eq:{
			doc:`Checks (shallow) equality of a and b by .get-decomposition.
				If their prototypes are different, returns false — else, for each key in a or b, checks that a.get(k)===b.get(k).`,
			why:`Deep conceptual merging both requires structure-based equality checking, and allows getting away with just shallow equality checking.`,
			impl:`Creates a closure. Is it auto-optimized out, or does it have to be manually optimized away? Should assume the second, and optimize it out…`,

			call(a,b) {
				if (a === b) return true;
				if (typeof a !== typeof b) return false;
				if (typeof a !== 'object' && typeof a !== 'function') return false;
				if (a[prototype] !== b[prototype]) return false;
				if (typeof a.get !== 'function' || a.get !== b.get) return false;
				let r = true;
				const f = k => { if (a.get(k) !== b.get(k)) throw r = false, forEach.break };
				if (forEach.isLinear(a) && forEach.isLinear(b)) {
					forEach(forEach.length(a) < forEach.length(b) ? a : b, f);
					return r;
				} else {
					forEach(a, f), r && forEach(b, f);
					return r;
				}
			},

			cmp:{
				doc:`Performs a deep comparison.
					Returns 0 if a and b are equal, and ±n otherwise in a consistent manner (if -n, a comes first; if +n, b comes first).
					When only ordering by types is wanted, use .typeid instead.`,
				why:`Hashing potentially-complex-keyed concepts in a consistent manner requires being able to sort those arbitrary keys, which requires a deep comparison operation.`,

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
						'Also, probably want a/b to be able to override the cmp function, with </…'
					""
				}
			},
		},
	},
	typeid:Symbol('typeid'),
	typeId(o) {
		if (o === null) return 1;  if (o === _) return 2;  if (!o[prototype]) return 3;
		return o[prototype][typeid] || (o[prototype][typeid] = random(random.max));
	},
}
































































code = {
	define:{
		op:{
			['**']:{
				doc:`Exponentiation of two numbers; a raised to the power of b.
					1**10 → 1; 10**1 → 10; 2**3 → 8; 10**-1 → .1; (-2)**9 → -512; (-2)**9.1 → NaN; 2**-∞ → 0.
						'1**… or …**0 always return 1 in Python (or C99); is that true here?'
					Extensible if any operand (left is checked first) defines a '**'(a,b) method.`,
				call(a,b) {
					if (canExt('**', a, b)) return doExt('**', a, b);
					return type(a, Number), type(b, Number), a ** b;
				}
			},
			['*']:{
				doc:`Multiplication of two numbers — their product; a times b.
					a*b = b*a; a*1=a. Approximately, a*b*c = a*(b*c).
					10*0 → 0; 2*2 → 4; -2*3 → -6; ∞*0 → NaN; ∞*∞→∞.
					Extensible if any operand (left is checked first) defines a '*'(a,b) method.`,
				call(a,b) {
					if (canExt('*', a, b)) return doExt('*', a, b);
					return type(a, Number), type(b, Number), a * b;
				}
			},
			['/']:{
				doc:`Division of two numbers; a divided by b.
					Approximately, a = (a/b)*b; a/b = a*(1/b).
					10/1 → 10; -1/2 → -.5; 5.5/2 → 2.75; 12/5 → 2.4; 0/0 → NaN; 2/0 → ∞.
					Extensible if any operand (left is checked first) defines a '/'(a,b) method.`,
				call(a,b) {
					if (canExt('/', a, b)) return doExt('/', a, b);
					return type(a, Number), type(b, Number), a / b;
				}
			},
			['%']:{
				doc:`Remainder of division of two numbers; a modulo b.
					a = Math.trunc(a/b)*b + (a%b).
						'On platforms using IEEE 754 binary floating-point, the result of this operation [%] is always exactly representable — must check that the above holds.'
					10%1 → 0; -1%2 → -1; 5.5%2 → 1.5; 12%5 → 2; 0%0 → NaN; 2%0 → NaN.
					Extensible if any operand (left is checked first) defines a '%'(a,b) method.`,
				call(a,b) {
					if (canExt('%', a, b)) return doExt('%', a, b);
					return type(a, Number), type(b, Number), a % b;
				}
			},
			['+']:{
				doc:`Addition — sum of two numbers, or concatenation of two strings.
					Numbers: a+b = b+a; a+0 = a; a+(0-b) = a-b; a+a = 2*a.
					Approximately (or if strings), a+b+c = a+(b+c).
					Strings: ''+a = a+'' = a; (a+b).length = a.length + b.length.
					10+0 → 10; -2+3 → 1; 5.5+2 → 7.5; -∞+∞ → NaN; -1e100+∞ → ∞.
					''+'a' → 'a'; 'ab' + 'bc' → 'abbc'.
					Extensible if any operand (left is checked first) defines a '+'(a,b) method.`,
				call(a,b) {
					if (canExt('+', a, b)) return doExt('+', a, b);
					return type(a, String, Number), type(b, String, Number), a + b;
				}
			},
			['-']:{
				doc:`Subtraction — difference of two numbers.
					Numbers: a-b = 0-(b-a); a-0 = a; a-b = -(b-a); a-a = 0.
					10-0 → 10; -2-3 → -5; 5.5-2 → 3.5; ∞-∞ → NaN; 1e100-∞ → -∞.
					Extensible if any operand (left is checked first) defines a '-'(a,b) method.`,
				call(a,b) {
					if (canExt('-', a, b)) return doExt('-', a, b);
					return type(a, Number), type(b, Number), a - b;
				}
			},

			['<<']:{
				doc:`Left bitwise shift of a by b bits. Converts them into signed 32-bit integers mod 2³² (rounding to zero) and shifts bits left, filling those missing with 0; only the lowest 5 bits of b are used.
					10<<0 = 10; 12<<1 = 24; 13<<-1 = -2147483648; NaN<<1 = 0.
					Extensible if any operand (left is checked first) defines a '<<'(a,b) method.`,
				call(a,b) {
					if (canExt('<<', a, b)) return doExt('<<', a, b);
					return type(a, Number), type(b, Number), a << b;
				}
			},
			['>>']:{
				doc:`Right signed bitwise shift of a by b bits. Converts them into signed 32-bit integers mod 2³² (rounding to zero) and shifts bits right, propagating sign; only the lowest 5 bits of b are used.
					10>>0 = 10; 13>>1 = 6; -13>>2 = -4; ∞>>1 = 0.
					Extensible if any operand (left is checked first) defines a '>>'(a,b) method.`,
				call(a,b) {
					if (canExt('>>', a, b)) return doExt('>>', a, b);
					return type(a, Number), type(b, Number), a >> b;
				}
			},
			['>>>']:{
				doc:`Right unsigned bitwise shift of a by b bits. Converts them into unsigned 32-bit integers mod 2³² (rounding to zero) and shifts bits right, filling those missing with 0; only the lowest 5 bits of b are used.
					10>>>0 = 10; 13>>>1 = 6; -13>>>2 = 1073741820; -1>>>0 = 4294967295; NaN>>>2 = 0.
					Extensible if any operand (left is checked first) defines a '>>>'(a,b) method.`,
				call(a,b) {
					if (canExt('>>>', a, b)) return doExt('>>>', a, b);
					return type(a, Number), type(b, Number), a >>> b;
				}
			},
			['&']:{
				doc:`Bitwise AND of numbers a and b. Converts them into signed 32-bit integers mod 2³² (rounding to zero) and sets an output bit to 1 only if both corresponding input bits are 1.
					If inputs are the same sign (and non-zero), result is no greater than either input (after conversion).
					a&b = b&a; a&b&c = a&(b&c); a&0 = 0. If already int32: a&-1 = a.
					0&0 → 0; 0&1 → 0; 1&1 → 1; 10&-1 → 10; 7&10 → 2; -3.9&-1 → -3; NaN&-1 → 0; ∞&-1 → 0.
					Extensible if any operand (left is checked first) defines a '&'(a,b) method.`,
				call(a,b) {
					if (canExt('&', a, b)) return doExt('&', a, b);
					return type(a, Number), type(b, Number), a & b;
				}
			},
			['^']: {
				doc:`Bitwise exclusive OR of numbers a and b. Converts them into signed 32-bit integers mod 2³² (rounding to zero) and sets an output bit to 1 only if both corresponding input bits are different.
					Not exponentiation.
					a^b = b^a; a^b^c = a^(b^c). If already int32: a^0 = a; a^-1 = ~a = -a-1.
					0^0 → 0; 0^1 → 1; 1^1 → 0; 10^0 → 10; 7^10 → 13; -3.9^-1 → 2; NaN^-1 → -1; ∞^-1 → -1.
					Extensible if any operand (left is checked first) defines a '^'(a,b) method.`,
				call(a,b) {
					if (canExt('^', a, b)) return doExt('^', a, b);
					return type(a, Number), type(b, Number), a ^ b;
				}
			},
			['|']: {
				doc:`Bitwise OR of numbers a and b. Converts them into signed 32-bit integers mod 2³² (rounding to zero) and sets an output bit to 1 only if either of corresponding input bits is 1.
					If inputs are the same sign (and non-zero), result is no less than either input (after conversion).
					a|b = b|a; a|b|c = a|(b|c); a|-1 = -1. If already int32: a|0 = a.
					0|0 → 0; 0|1 → 1; 1|1 → 1; 10|0 → 10; 7|10 → 15; -3.9|-1 → -1; NaN&-1 → 0; ∞&-1 → 0.
					Extensible if any operand (left is checked first) defines a '|'(a,b) method.`,
				call(a,b) {
					if (canExt('|', a, b)) return doExt('|', a, b);
					return type(a, Number), type(b, Number), a | b;
				}
			},
			['~']: {
				doc:`Bitwise NOT of number a. Converts it into a signed 32-bit integer mod 2³² (rounding to zero) and sets an output bit to 1 only if the input bit is 1.
					If already int32: ~~a = a; ~a = -a-1.
					~0 → -1; ~1 → -2; ~-18 → 17; ~NaN → -1; ~∞ → -1.
					Extensible if the operand defines a '~'(a) method.`,
				call(a) {
					if (canExt('~', a)) return doExt('~', a);
					return type(a, Number), ~a;
				}
			},
			['!']: {
				doc:`Logical NOT of a. Returns false for ±0, null, NaN, '', void — else true.
					If already false/true: !!a = a.
					Extensible if the operand defines a '!'(a) method.`,
				//'Should also override .match for de/serializing, and such.'
					//'(All expressions (with priorities/precedences) match to their decompositions or to the next lower priority in turn (or, if the lowest priority, match to the highest priority in brackets.)'
				call(a) {
					if (canExt('!', a)) return doExt('!', a);
					return !a;
				}
			},

			/*in: (a,b) => a in b, "check b.get(a)!==_, right?"
			"get/set, including delete."
				"…Perhaps we DO have a valid use-case for value-is-void, and that is deletion…"
			"uno (+/- (achieved with first operand being void, right?) and !/~; forbid void/typeof?)"
			"array/hash creation, MAYBE."
			"Return-to-label (break/continue/return/throw) (by throwing a symbol); catch-label."
				"Most shaky, this one…  but more complex ones do not work well."
			"Function call."
			"…And every single other syntax construct."*/
		},
		props:{
			['**']: 'op',
			['*']: 'op',
			['/']: 'op',
			['%']: 'op',
			['+']: 'op',
			['-']: 'op',
			['<<']: 'op',
			['>>']: 'op',
			['>>>']: 'op',
			['&']: 'op',
			['^']: 'op',
			['|']: 'op',
		},
	},
	canExt(op,a,b) {
		return a && type.is(a[op], Function) || b && type.is(b[op], Function);
	},
	doExt(op,a,b) {
		if (a && type.is(a[op], Function)) return a[op](a,b);
		if (b && type.is(b[op], Function)) return b[op](a,b);
		error('Did not extend');
	},
}

"Can we make something like Number.tests(N): +∞, -∞, NaN, 0, 1, -1, .5, then random?"
	"Or just Number.get()->iterator(f)."
	"Or should we make it a part of interval-based, uh, sets/maps?"
	'(Or, instances(Number) or smth?)'













code = {
	define:{ _:void 0 },
	doc:`Though void (undefined, or the shorter void 0, or the even shorter _) can be used in JS as its own value, it is very often used as a special marker value in functions here (like storage). (If such a void value is absolutely required to pass through those functions, use a symbol and special-case its in/out — but such a need should be rare, and decrease in code size is substantial.)`
}
code = {
	name:'error',
	define:{
		error:{
			doc:`Throws an error defined by the first argument.
				Second argument can be set to true to force storing a stack-trace, or to false to forbid that.`,
			call(e, stack = false) { throw stack && !(e instanceof Error) ? new Error(e) : e }
		},
	}
}




code = {
	name:'tests',
	call() {
		setTimeout(() => {
			time.limit(100), test(), setTimeout(() => {
				time.limit(100), test(), setTimeout(() => {
					test(), test.log();
				}, 1000);
			}, 1000);
		}, 1000);
	},
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
				doc:`Logs any failed tests (percentage passed, then for each failed test, first 50 chars of their bodies, their last exception or ref-leak count) with console.log/.group/Collapsed/End.
					If all succeeded, logs the average time to execute all tests, and how many times the whole set was executed (and all tests that took more than double the average to run).`,
				call() {
					let total = 0;
					const fail = ref.take(forEach.value(tests, (t,w) => {
						if (t.runs) total += t.time / t.runs;
						if (t.err !== _) return t;
					}, Array));
					try {
						const c = console, group = c.groupCollapsed || c.group;
						if (!fail.length) {
							let s = 0, n = 0;
							for (const i = 0; i < fail.length; ++i)
								s += fail[i].time || 0, n += fail[i].runs || 0;
							const avgS = (s/n).toFixed(1), avgN = (n / tests.length).toFixed(1);
							group.call(c, `Tests OK (${avgS} ms for all, done ${avgN} times)`);
							try {
								forEach.value(tests, t => {
									if (!t.runs) return;
									const ms = t.time / t.runs;
									if (ms > 2 * total / tests.length) {
										b = (ms/total*100).toFixed(0);
										c.log(str(t), 'took', ms.toFixed(2), `ms (${b}%)`);
									}
								});
							} finally { c.groupEnd() }
						} else {
							group.call(c, `Passed ${fail.length/tests.length * 100}% tests`);
							try {
								for (const i = 0; i < fail.length; ++i)
									c.log('Failed', str(fail[i]), 'with', fail[i].err);
							finally { c.groupEnd() }
						}
					} finally { ref.give(fail, true) }
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
			let start = now(), active = ref.active, r;
			try { r = f() }
			finally { f.time = (f.time || 0) + now(start), f.runs = (f.runs || 0) + 1 }
			if (active !== ref.active)
				ref.give(r, true), r = 'Created ' + (ref.active - active) + ' extra references';
			if (r === true || r === _) ref.give(f.err, true), f.err = _;
			else if (f.err !== r) ref.give(f.err, true), f.err = ref.take(r);
		} catch (err) { if (f.err !== err) ref.give(f.err, true), f.err = ref(err) }
	},
	str(f) {
		const body = f[Object.string].replace(/\s/g, ' ');
		return body.length > 50 ? body.slice(0, 50) + '…' : body;
	},
}

















"And (decomposition-based — easy if keys are non-linear, studied somewhat if linear) diff."
	"How to organize output? One type for all diffs, composed of the type?"
	"What about one-directional diffs, as opposed to bi-directional like we had originally?"
		"With .reverse(from), functionality can be the same at about half the memory cost."
code = {}























'Instead of this, should have basic(arg) and basic(type, result), throwing in non-act mode, to make parallel broadcasting simple (to use).'
	'…Or is there a better way, that does not require modifying call/act?'
code = {
	define:{
		extend:{
			doc:`Extends a per-element function to operate on arrays, recursive or not, extending the last element if shapes mismatch.
				For all key paths that lead to values, f(…args[…keys]) will be called.
				Each input can either be iterable (with a function .get) or a value (without .get); iterables will get decomposed recursively.
				To allow more efficient extension if needed (like if tensors are on GPU), if all inputs are of the same type T and T.extend is a function, it will be called instead of recursing.
					"But what about Number+Tensor? Should check both, left-first."
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
		if (t === _) t = asTable(at, hashTable);
		const hash = type(o && o[prototype].hash, Array);
		for (let i = 0; i in hash; ++i) {
			const h = hash[i](o);
			if (!(h in t)) return Object.define(t, h, o, true, true, false), _;
			if (!isTable(t[h])) t = asTable(t,h);
			t = t[h];
		}
		if (isTable(t)) Object.define(t, tableLength(t), o, true, true, false);
	},
	remove(at, o) {
		let t = tableOf(at);
		if (!isTable(t))
			return (type(at)[hashTable] = t===o ? _ : t), _;
		removeImpl.i = 0, removeImpl.o = o, removeImpl.hash = type(o && o[prototype].hash, Array);
		t = type(at);
		t[hashTable] = removeImpl(tableOf(at));
		if (t[hashTable] === _) delete t[hashTable];
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
		if (o === _) o = self.void || (self.void = {});
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
		if (!isTable(t)) return t === self.o ? _ : t;
		if (self.i in self.hash) {
			const h = hash[self.i](self.o);
			if (h in t) {
				++self.i, t[h] = self(t[h]);
				t[h] === _ && delete t[h]; ("void does not ref, and cannot be back-ref.")
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
































































'Ancient. Needs to at least have basics be separated into HTML/SVG.'
	'And more care with one-node-multiple-elements, like highlight-all-on-hover and/or collapsing.'
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
































'ASI in JS just means that newlines are be skipped anywhere except for a few places'
	'("no LineTerminator here" in formal grammar).'
	'With a proper parse/emit framework, making a JS (or any other) parser/emitter is exactly as simple as specifying a list of rules, about one per line.'
		'(Though that would just be the syntactical representation — also have to symbolically execute it once to assimilate.)'
code = {}

















code = {
	name:'relink',
	a:1,
	call(define) {
		console.log('Pre-network is ready.')
		this.document && document.body.append('Ready')
		this.document && (document.body.style.textAlign = 'center');
	},
}





'Since we now have de/composition, not only shall emit/parse be joined in usage, but also sequence activity will be just a special case of conceptual equality.'
	'Still, this was a nice interface.'
code = {
	name:'emit — will this have to be rewritten in light of forEach/…?',
	define:{
		emit:{
			doc:`emit a sequence of strings or string-expansions to the serialization context, ignoring _.
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
					emit.into = this !== _ ? this : emit.into, ctx.prev = _;
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
							else if (this === _)
								ctx.prev !== _ && raw(space(ctx.prev, v[0])), raw(v);
							else if (type(this) === Function)
								ctx.prev !== _ && raw(this(ctx.prev, v[0])), raw(v);
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
			ctx.prev = emit.into = _, ctx.length = 0;
			return s;
		}
	},
	invalidUtf16: /[\ud800-\udbff](?:$|[^\udc00-\udfff])|(?:^|[^\ud800-\udbff])[\udc00-\udfff]/,
	raw(v) {
		if (v === _ || !v && type(v) === String) return;
		if (type(v) === Array) {
			if (v.length === 0) throw "Tried to emit an empty array";
			else if (v.length === 1) v = v[0];
			else if (ctx.collects && emit.depth > 1) return ctx.push(v), ctx.prev = _;
			else return v[0].call(...v.slice(1));
		}
		if (type(v) === String) {
			if (invalidUtf16.test(v)) throw "Tried to emit an invalid-utf16 string";
			if (v) ctx.push(v), ctx.prev = v[v.length-1];
		} else if (type(v) === Number) {
			type(v, Codepoint);
			v = String.fromCodePoint(v);
			ctx.push(v), ctx.prev = v[v.length-1];
		} else if (type(v.toString) === Function) {
			if (ctx.collects && emit.depth > 1) ctx.push(v), ctx.prev = _;
			else v.toString();
		} else if (type(v) === Function) {
			if (ctx.collects) ctx.push(v), ctx.prev = _;
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
				if (i && needsSpace(a[i-1], a[i])) r.push(' ');
				r.push(a[i]);
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
			i && a[i-1] !== ' ' && a[i] !== ' ' && (r.push(' ')), r.push(self(a[i]));
		return r.join('');
	},
	pretty(a, depth) {
		if (type(a) === String) return a;
		if (a.min > self.line) {
			const r = [];
			for (let i=0; i < a.length; ++i)
				i && r.push('\n' + self.spaces.repeat(depth)), r.push(self(a[i], depth+1));
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
				a.push(v[i]), a.push(v[0][i]);
			return a;
		}
	},
	call() { emit.depth = 0, ctx.collects = false, emit.into = _, ctx.prev = _
		const o1 = { toString() {
			try { emit`as1${_}df2` } finally { return emit() }
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
				For each key that makes up obj, on.call(obj, key, write = _), synchronously. Returning a value or calling write(…) will write it to output.
				Combines [].forEach/.map/.filter into a more general function.
				Simultaneously reads and writes; see .read/.write for details. To only read (and pass void as write inside on), do not pass to.
				Throw forEach.break from on to exit the loop early (result, if any, will still be finalized).
				If to is the write-function passed to on, will flatten — write to the last-requested object. Write of an outer callback should not be used in an inner callback (it will not write to outer object).`,
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
			void:`Synonym for undefined, or _ (shorter). Using it as a special marker value (everywhere) and not a real value allows some things to be shorter and more convenient, such as not returning anything from .set to not change this (not forcing 'return this'), or testing for a key's existence with .get (not forcing .has).`,

			call(obj, on, to = _) {
				type(obj.get, Function), type(on, Function);
				if (to !== _) {
					type(to.prototype.set, Function);
					if (to !== write) info.o.push(ref.take(init(to)));
					else if (info.o.length) info.o.push(ref.take(last(info.o)));
					else error('No object to write to');
					info.f.push(ref.take(to.prototype.set));
					info.n.push(0);
				} else info.n.push(_);
				"If (after taking ref) type(obj)===to and !ref.shared(obj) and it is linear (maybe?), should write to just-read keys immediately, with a cache for those keys that are not yet free."
				try {
					const f = ref.take(obj.get());
					try {
						if (f === (f>>>0))
							for (let i=0; i < f; ++i) write(on(i, to && write));
						else if (type.is(f, Function)) {
							info.on.push(ref.take(on)), info.arr.push(ref.take(obj));
							try { f.call(obj, iter) }
							finally { ref.drop(info.arr.pop()), ref.drop(info.on.pop()) }
						} else {
							type(f.get, Function);
							const r = len(f.get());
							for (let i=0; i < r; ++i) {
								const key = ref.take(f.get(i));
								try { write(on(key, to && write)) }
								finally { ref.drop(key) }
							}
						}
					} catch(err) { if (err !== forEach.break) throw err }
					finally { ref.drop(f) }
					if (to !== _) return write(), ref.give(info.o.pop());
				} catch (err) {
					if (to !== _) ref.drop(info.o.pop());
					throw err;
				} finally {
					if (to !== _) ref.drop(info.f.pop());
					info.n.pop();
				}
			},

			//'Maybe we should have forEach for multiple objects?'
				//'…Should All override forEach? How; with obj.forEach(on, to) — should add that?'

			in:{
				doc:`For each key of an object, execute on, and accumulate results.
					Alias for forEach, provided for symmetry with forEach.of.
					For each key that makes up obj, on.call(obj, key), synchronously.`,
				call(obj, on, to = _) { return forEach(obj, on, to) }
			},
			of:{
				doc:`For each value of an object, execute on, and accumulate results.
					Like forEach, but instead of passing keys, passes values.
					For each value that makes up obj, on.call(obj, value), synchronously.`,
				call(obj, on, to = _) {
					info.len.push(ref.take(on));
					try { return forEach(obj, valueIter, to) }
					finally { ref.drop(info.len.pop()) };
				}
			},

			length:{
				doc:`Returns the number of times forEach will call (unless exited early).
					Often faster than counting one-by-one.`,
				call(obj) {
					type(obj.get, Function);
					const f = ref.take(obj.get());
					try {
						if (f === (f>>>0)) return f;
						else if (type.is(f, Function)) {
							info.len.push(0);
							try { f.call(obj, count); return last(info.len) }
							finally { info.len.pop() }
						} else {
							type(f.get, Function);
							return len(f.get());
						}
					} finally { ref.drop(f) }
				}
			},
			isLinear:{
				doc:`Returns whether obj is a linear sequence, like an array.`,
				call(obj) {
					type(obj.get, Function);
					const f = ref.take(obj.get());
					if (f === (f>>>0)) return true;
					else return ref.drop(f), false;
				},
			},
			rewrite:{
				doc:`
					"…Maybe remove it and force relying on forEach?"
						"But for string parsing, that would force doubling the input in-memory."
					Like forEach, but inverses control over reading keys, allowing going back and forth in the input key list.
					Controller function f (replacing on) is called (once) like f.call(obj, read, write). Inside, write(key, value) will write, read()->key|void will read next, read(index) will go (back) to index (and return old index) (not key, even though they are the same for arrays), read(forEach.length) will return total number of input keys (always pre-computed).
					To only read, pass void as to; to only write, pass void as obj. Irrelevant functions-parameters to f will be void.
					Must not be used with infinite collections.`,
				call(obj = _, f, to = _) {
					type(f, Function);
					if (obj !== _) {
						type(obj.get, Function);
						const f = ref.take(obj.get());
						try {
							if (f === (f>>>0)) {
								info.len.push(ref.take(f)), info.arr.push(ref.take(f));
							} else if (type.is(f, Function)) {
								info.arr.push(ref.take(init(Array))), info.len.push(0);
								try { f.call(obj, addKey) }
								catch (err) { ref.drop(info.arr.pop()), info.len.pop(); throw err }
							} else {
								type(f.get, Function);
								info.len.push(len(f.get())), info.arr.push(ref.take(f));
							}
						} finally { ref.drop(f) }
						info.on.push(0);
					}
					try {
						if (to !== _) {
							type(to.prototype.set, Function);
							info.o.push(ref.take(ref.init(to)));
							try {
								info.n.push(0);
								info.f.push(ref.take(to.prototype.set));
								try { "If no end is in sight, try try try."
									try { f.call(obj, obj && next, write) }
									catch(err) { if (err !== forEach.break) throw err }
									return write(), ref.give(info.o.pop());
								} finally { ref.drop(info.f.pop()), info.n.pop() }
							} catch (err) { ref.drop(info.o.pop()); throw err }
						} else
							try { f.call(obj, obj && next, _) }
							catch(err) { if (err !== forEach.break) throw err }
					} finally {
						if (obj !== _)
							ref.drop(info.len.pop()), ref.drop(info.arr.pop()), info.on.pop();
					}
				}
			},
		},
		Array:{
			prototype:{
				get(k) {
					if (k === _) return this.length;
					if (k !== (k>>>0)) error("Tried to get in an array at not-an-index");
					return this[k];
				},
				set(k,v) {
					if (k===_) {
						if (v === _) return;
						if (v !== (v>>>0)) error("Tried to set length of an array to not-an-index");
						this.length = v;
					} else {
						if (k !== (k>>>0)) error("Tried to set in an array at not-an-index");
						if (!ref.counted(this))
							error('Cannot take responsibility if irresponsible');
						ref.take(v), ref.drop(this[k]), this[k] = v;
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
					if (k===_) return forEachInHash;
					if (typeof k !== 'string') throw "Tried to get in a Hash at not-a-string";
					return this.o[k];
				},
				set(k,v) {
					if (k===_) {
						if (v !== _) throw "Tried to set length of a Hash";
					} else {
						if (typeof k !== 'string') throw "Tried to set in a Hash at not-a-string";
						if (!ref.counted(this))
							error('Cannot take responsibility if irresponsible');
						ref.take(v), ref.drop(this.o[k]), this.o[k] = v;
						if (v === _) delete this.o[k];
					}
				},
			}
		},
		String:{
			prototype:{
				textEncoding:`utf16`,
				get(k) {
					if (k===_) return this.length;
					if (k !== (k>>>0)) throw "Tried to get in an array at not-an-index";
					return this.charCodeAt(k);
				},
				set(k,v) {
					if (v===_)
						return type(this) === Array ? this.join('') : this;
					if (typeof this==='string') {
						const a = ref.take(init(Array));
						try {
							this && a.push(this);
							String.prototype.set.call(a,k,v);
							return ref.give(a);
						} catch (err) { ref.drop(a); throw err }
					} else if (type(this) === Array) {
						if (this.length === 16) {
							{"Assuming a re-allocation happens, joining may take less memory."}
							let len = 0;
							for (const i=0; i < this.length && len < this.length*4; ++i)
								len += this[i].length;
							if (len < this.length*4)
								this[0] = this.join(''), this.length = 1;
						}
						if (typeof v==='string') this.push(v);
						else if (v === (v>>>0)) this.push(String.fromCharCode(v));
						else type(v, String, Index);
					} else throw "Invalid this for String.prototype.set";
				},
			}
		},

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
				return JSON.stringify(a) === '[2,0,0,6,80]';
			},
			() => forEach.length([1,2,3]) === 3,
			() => forEach.length(Hash.prototype) === 0,
			() => forEach.isLinear(['test']),
			() => !forEach.isLinear(Hash.prototype),
			() => {
				const a = forEach.rewrite([1,2,3,40], function(r,w) {
					w(0);
					for (let k = r(); k !== _; k = r()) k%2 === 0 && w(this.get(k)*2);
					r(0), w(0);
					for (let k = r(); k !== _; k = r()) k%2 === 1 && w(this.get(k)*2);
					w(0);
					throw forEach.break; ("Same as returning, in ".rewrite)
				}, Array);
				return JSON.stringify(a) === '[0,2,6,0,4,80,0]';
			},
			() => forEach.rewrite('hello', function(r,w) {
				for (const k = r(); k !== _; k = r())
					w(this.get(k)), w(this.get(k) + 1), w(this.get(k)), w(32);
			}, String) === 'hih efe lml lml opo ',
			() => forEach.rewrite(_, (r,w) => {
				w('this'), w(' '.charCodeAt()), w('str');
			}, String) === 'this str',
		],
	},
	info:{ f:[], o:[], n:[], on:[], arr:[], len:[] },
	len(r) {
		if (r !== (r>>>0)) ref.take(r), ref.drop(r),
			error("The decomposing object should be linear (obj.get().get() should be an index)");
		return r;
	},
	last(a) { return a[a.length-1] },
	count(k) {
		if (k === _) error("A void .get-decomposition key encountered");
		++info.len[info.len.length-1];
	},
	iter(k) {
		if (k === _) error("A void .get-decomposition key seen");
		write(last(info.on).call(last(info.arr), k, last(info.n) && write));
	},
	valueIter(k,w) {
		const v = ref.take(this.get(k));
		try { last(info.len).call(this, v, w) }
		finally { ref.drop(v) }
	},
	addKey(k) {
		if (k === _) error("A void .get-decomposition key detected");
		++info.len[info.len.length-1], info.arr.push(ref.take(k));
	},
	next(i) {
		const on = last(info.on), arr = last(info.arr), len = last(info.len);
		if (i === _) {
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
		if (k === _ && v === _) return;
		if (k !== _ && v === _) v = k, k = [info.n[info.n.length-1]++;
		const r = last(info.f).call(last(info.o), k, v);
		if (r !== _ && r !== last(info.o))
			ref.drop(last(info.o)), info.o[info.o.length-1] = ref.take(r);
	},
	forEachInHash(on) { let k; if (this.o) for (k in this.o) on(k) },
}
"Actually, should parsing stuff really use .rewrite, or should it actually all use forEach?"

"Transform-methods, accepting (r,w) and returning an object (merged/const) with appropriate .get/.set to make it work — transform, shuffled, utf16, utf8, lzw, map (only on write, mapping input key groups to output key groups; has to be integrated with the forEach and its current/last read/write indexes (needs two new indexes? Or should it even keep track itself?))…"
	"Except, we often want to make one outer read to cause many inner reads (advancing the iterator), or possibly none at all — same with writes. get/set do not really allow that capability…"
	"How to make them work? Make them classes that override .get/.set to forward to their values?"
	'(Put them in a namespace? What namespace?)'











code = {
	name:"mark — has not found a use yet.",
	define:{
		mark:{
			doc:`leaves a mark on an object, which can be retrieved later: mark(o,v), mark(o)→v.
				a marking context must first be entered, and finally left.
				unmarked objects return void from mark(o) after entering.`,
			enter:{
				doc:`enter a marking context`,
				call() { ctx.push(_) }
			},
			leave:{
				doc:`leave a marking context after entering`,
				call() {
					if (!ctx.length) throw "must enter a marking context before leaving it";
					if (ctx.length === ctx.notch) {
						for (let i=0; i < notchMarked.length; ++i)
							notchMarked[i][notch] = _;
						notchMarked.length = 0;
						ctx.notch = 0;
					}
					ctx.pop();
				}
			},
			etch:{
				doc:`leave a spot on an object which holds marks, merely to speed up marking.`,
				call(o) { o[notch] = _; return o }
			},
			call(o, v = _) {
				if (!ctx.length) throw "must enter a marking context before marking";
				if (v === _) {
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
					call(k = _) {
						if (k === _) return this.k[0];
						return this.k[0] = type(k, Number), down(this, up(this, 0));
					}
				},
				value:{
					doc:`gets or sets the value of the min element.`,
					call(v = _) { return v === _ ? this.v[0] : this.v[0] = v }
				},

				length:{
					doc:`gets or limits the length of the heap.
						to limit its length, may remove some min elements.`,
					call(l = _) {
						if (l != _) while (l < this.k.length) this.pop();
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
			doc:`Delays the execution of a function asynchronously.
				Zero-delay callbacks are executed in order; others — when requested, as soon as possible.
				No state can be passed to the callback (schedule own callback-executing function instead).
				Scheduled functions can not be cancelled.
				CPU usage is limited to delay.options.maxTimeUsage (0…1).
				Use delay over setImmediate or process.nextTick or setTimeout or requestAnimationFrame (unless the delay specifically for animating is wanted).
				In browser background tabs, effects of timeout throttling are minimized — scheduling 100 callbacks to fire in a second will fire all in a second or two.
				Callbacks that timed out (throw _, usually automatically-inserted) will be called again — other exceptions will not be tolerated.`,
			options:{ maxTimeUsage:.2 },
			call(ms, func) {
				if (type(ms) === Function) "the order does not matter", [ms, func] = [func, ms];
				if (ms === _) ms = 0;
				type(func, Function), type(ms, Number);
				if (!(ms >= 0)) throw "delay ms expected to be a positive number, got " + ms;
				if (!ms) imm.push(func), immLater();
				else {
					if (info.origin === _) info.origin = time();
					if (!info.next) info.next = init(Heap);
					info.next.push(time(info.origin) + ms, func);
					delayed();
				}
			},
		}
	},
	imm:[],
	info:{ origin:_, immWill:false, delayedWill:false,
		next:null, isImm:false, used:0, total:0, immLast:0 },
	immNow() {
		info.immWill = false, info.isImm = true;
		if (info.origin === _) info.origin = time();
		const start = time(info.origin);
		const max = delay.options.maxTimeUsage;
		info.total += start - info.immLast, info.immLast = start;
		if (info.used >= info.total * max) return immLater();
		let dur = Math.min((info.total * max - info.used) / (1 - max), 10);
		try {
			for (const i=0; i < imm.length && time(info.origin) <= start + dur; ++i) {
				if (i >= 128 && imm.length-i <= 8) i-=128, imm.splice(0,128);
				imm[i].call();
			}
		} catch (err) { if (err !== _) throw imm.splice(0,1), err } finally {
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
			else if (typeof process !== ''+_) {
				(info.isImm ? setTimeout : process.nextTick)(immNow, 10);
			} else if (typeof requestAnimationFrame !== ''+_)
				requestAnimationFrame(immNow);
			else setTimeout(immNow, 10);
			info.immWill = true;
		}
	},
	delayed() {
		try {
			if (info.origin === _) info.origin = time();
			while (info.next.key() <= time(info.origin))
				info.next.value()(), info.next.pop();
		} catch (err) { if (err !== _) throw info.next.pop(), err } finally {
			if (info.next.length() && !info.delayedWill) {
				setTimeout(delayedTimer, info.next.key() - time(info.origin));
				info.delayedWill = true;
			}
		}
	},
	delayedTimer() { info.delayedWill = false, delayed() },
}
code = {
	name:'type — used for type-checking and getting the type',
	define:{
		syntax:[
			v => { typeof v==='boolean', type(v)===Boolean, type.is(v, Boolean) },
			v => { typeof v==='number', type(v)===Number, type.is(v, Number) },
			v => { typeof v==='string', type(v)===String, type.is(v, String) },
			v => { typeof v==='function', type(v)===Function, type.is(v, Function) },
			v => { typeof v==='symbol', type(v)===Symbol, type.is(v, Symbol) },
			v => { typeof v===''+_, type(v)===_, type.is(v), v===_ },
			v => { !v && typeof v==='object', type.is(v, null), type(v)===null, v===null },
		],
		Int:{ is(v) { return type.is(v, Number) && v>>0 === v } },
		Index:{ is(v) { return type.is(v, Number) && v>>>0 === v } },
		Codepoint:{ is(v) { return type.is(v, Index) && (v < 0xd800 || v>=0xe000 && v<0x110000) } },
		type:{
			doc:`Returns the type of value, or asserts that it is one of the supplied types and returns it.
				(Only up to 3 types can be supplied, to avoid having to create a garbage array for the rest of args.)
				"Should also have type.super(…v), the type which all can be converted to or void… but how can we do this without actual value conversion? Too inefficient to have otherwise."
					'…So maybe should not.'`,
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
				{tN:"An optimization, because …types allocates memory, and this is called a lot."}
				if (t0 === _) return T(v);
				if (t3 !== _) error("Too many expected types passed to type(…)");
				if (t0 !== _) {
					if (type.is(v, t0)) return v;
					if (t1 !== _) {
						if (type.is(v, t1)) return v;
						if (t2 !== _) {
							if (type.is(v, t2)) return v;
							error(`Unexpected type: ${descr(T(v))} (expected ${descr(t0)} or ${descr(t1)} or ${descr(t2)})`);
						}
						error(`Unexpected type: ${descr(T(v))} (expected ${descr(t0)} or ${descr(t1)})`);
					}
					error(`Unexpected type: ${descr(T(v))} (expected ${descr(t0)})`);
				}
				error('Should not happen');
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
		if (v === _ || v === null) return v;
		if (typeof v === 'function') return Function;
		v = v[prototype];
		return v === Object.prototype || !v ? Object : v.constructor || v;
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
		} catch (err) { return '<type>' }
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
				if (typeof performance!==''+_)
					return Math.max(0, performance.now() - (mark && mark + self.time));
				if (!mark) return process.hrtime.bigint();
				return Math.max(0, Number(process.hrtime.bigint() - mark)/1e6 - self.time);
			},
			guess:{
				doc:`Measures elapsed time: time()→mark, time(mark)→ms; ms>=0.
					Less precise than time(…), but faster (if slower, it is replaced with time(…)).`,
				call(mark = 0) {
					if (info.last === null) return time(mark);
					const n = Date.now();
					if (info.last > n) info.delta += info.last - n;
					return (info.last = n) + info.delta - mark;
				}
			},
			limit:{
				doc:`Allows imposing and checking an approximate time-limit on execution.
					.limit() throws void if time-limit is exceeded; .limit(ms) will set the time-limit if it will be more restrictive than before; .limit(∞) will reset the time-limit (making .limit() not throw). Time-limit will also be reset after a 0-ms timeout after setting.`,
				call(ms = _) {
					if (ms === _) {
						if (info.limit && time.guess() > info.limit) throw _;
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
				doc:`Guesses the current memory usage from the number of active-or-cached ref-tracked objects (the precise method of guessing is completely unbased).
					Though very useful for optimizing memory usage in certain conditions, browsers do not expose any such interface.`,
				avgRefMem: 256,
				call(mark = 0) {
					type(mark, Number);
					return info.base + Math.round(ref.total * self.avgRefMem) - mark;
				}
			},
			call(mark = 0) {
				if (typeof process===''+_) return memory.guess(mark);
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
	info:{ last:0, delta:0, limit:0, lock:false, base:0 },
	resetTimeLimit() { info.limit = 0, info.lock = false },
	call() {
		time.time = 0;
		const start = time();
		for (let i=0; i < 100; ++i) time(start);
		const durPrecise = time(start);
		for (let i=0; i < 100; ++i) time.guess(start);
		const durApprox = time(start) - durPrecise;
		if (durApprox > durPrecise*2) info.last = null;

		let f;
		f = time, f(), f(), f(), f.time = (f(f()) + f(f()) + f(f())) / 3;
		if (f.time > 1) f.time = 0;
		if (typeof process!==''+_) {
			(f = memory).memory = 0, f(), f(), f(), f.memory = f(f());
			if (f.memory > 3000) f.memory = 0;
			setTimeout(() => {
				info.base = memory();
				setInterval(() => { "Calibrate guessed memory to account for devilry."
					if (ref.active) memory.guess.avgRefMem = memory() / ref.active;
				}, 1000).unref();
			}, 1000).unref();
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
			if (typeof browser!==''+_)
				browser.notifications.create({ type:'basic', iconUrl, message:msg, title });
			else {
				if (N.permission !== 'granted' && N.permission !== 'denied') N.requestPermission();
				new N(title, { body:msg, icon }).onclick = close;
			}
		},
	},
	call() {
		if (typeof browser!==''+_)
			browser.notifications.getAll().then(o => Object.keys(o)[Object.forEach] = browserClear),
			("notifications would sometimes bug out and never close — just kill all.");
		if (typeof document===''+_ || typeof fetch===''+_) return;
		setInterval(checkSources, 5000);
	},
	N: typeof Notification!==''+_ && Notification,
	context(x) {
		var ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = x.width, ctx.canvas.height = x.height;
		return x.data && ctx.putImageData(x,0,0), ctx;
	},
	browserClear(id) { browser.notifications.clear(id) },
	get() {
		let e = document.querySelector('link[rel=icon]');
		if (!e) e = document.createElement('link'), e.rel = 'icon', document.head.appendChild(e);
		return e;
	},
	set(x) {
		get().href = x; typeof browser!==''+_ && browser.browserAction.setIcon({ path:x });
	},
	faviconBlob(blob) { URL.revokeObjectURL(get().href), set(URL.createObjectURL(blob)) },
	close() { this.close(), "instantly" },
	last:{ not:0, log:0 },
	sources:{},
	checkSources() {
		let url;
		if (!(document.URL in sources)) {
			sources[document.URL] = _;
			for (let i=0; i < document.scripts.length; ++i)
				(url = document.scripts[i].src) && (sources[url] = _);
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
	define:{
		tests:[() => random()<1, () => random(10)<10, () => random() >= 0],
		random:{
			why:`An interface to crypto.getRandomValues for generating random numbers on-demand as opposed to in-batches, optimized to request the least amount of random bits required, is desirable.
				(To allow objects to define their own notion of uniform random element, extensible, as all things should be.)`,

			doc:`Returns something uniformly-distributed and randomly-chosen.
				With an unsigned 32-bit integer n, returns an integer in 0…n-1 (where 0 returns any uint32).
				With no args, returns a number in 0…1 (1 is exclusive).
				With an object/function with .random() (like an array), returns obj.random().`,

			call(end = _) {
				if (end === _) return random.float();
				if (end !== (end>>>0)) {
					if (type.is(end.random, Function)) return end.random();
					error('Expected uint32/void/extensible as limit of random');
				}
				if (end === 0) return random.bits(); if (end === 1) return 0;
				if (!(end & (end-1))) return random.bits(count(end));

				let n=0, q0=0, q1=0;
				if (buf.end === end) n = buf.n, q0 = (1 << n) % end;
				else {
					n = count(end) + 1, q0 = (1 << n) % end, q1 = 2*q0, q1>=end && (q1-=end);
					"Expected bit-cost of N: N / (1 - (2**N)%end/(2**N)). Seek while next is less."
					while (true) {
						if (n >= 32) { n = 32; break }
						if (n <= 15) {
							if ((1<<(2*n+1)) <= ( q1*(n<<n) - q0*((n+1)<<(n+1)) )) break;
						} else if (n <= 20) {
							if ((1<<(2*n-9)) <= ( q1*(n<<(n-9)) - q0*((n+1)<<(n-8)) )) break;
						} else if (n <= 25) {
							if ((1<<(2*n-19)) <= ( q1*(n<<(n-19)) - q0*((n+1)<<(n-18)) )) break;
						} else {
							if (n*(1-(2*2**n)%end/(2*2**n)) <= (n+1)*(1-(2**n)%end/(2**n))) break;
						}
						++n, q0 = q1, q1 *= 2, q1>=end && (q1-=end);
					}
					buf.end = end, buf.n = n;
				}
				q1 = (n < 32 ? 1 << n : 2 ** n) - q0;
				do { q0 = random.bits() } while (q0 >= q1);
				return q0 % end;
			},
			float:{
				doc:`Returns a uniformly-distributed number from 0 to 1 (0 is inclusive).
					Equivalent to 'random()'.`,
				call() {
					let a = bits(21), b = bits(), e = 0;
					while ((a === ((a << 12) >>> 12)) && e < 1021)
						a = (a << 1) | (b >>> 31), b = (b << 1) | bits(1), ++e;
					return (a * Math.pow(2,32) + b) * Math.pow(2, -53-e);
				}
			},
			roll:{
				doc:`Returns true with probability p, else false.
					Equivalent to 'random() < p' with checks on p, but faster.`,
				call(p) {
					type(p, Number);
					if (p < 0) error('Probability is too low: '+p);
					if (p > 1) error('Probability is too high: '+p);
					if (p !== p) error('Probability is NaN');
					if (p === 1) return true;
					while (true) {
						const n = Math.floor(p *= 16);
						if (p === n) {
							if (!n) return false;
							if (n === n >> 3 << 3) return !random.bits(1);
							if (n === n >> 2 << 2) return random.bits(2) < (n >> 2);
							if (n === n >> 1 << 1) return random.bits(3) < (n >> 1);
						}
						const r = random.bits(4);
						if (r !== n || p === n) return r < n; else p -= n;
					}
					error();
				},
				impl:`Generating (up to) 4 bits at a time is not based on past performance measures, or anything.
					Using 4 bits at a time consumes on average about double the bits that using 1 bit at a time would, but should be much faster.`,
			},



			bits(n) {
				if (!n) {
					if (buf.pos >= buf.a.length) buf.a.pos = 0, random.fill(buf.a);
					return buf.a[buf.pos++];
				}
				if (n !== (n & 31)) error('Expected 0…31 bits to generate (where 0 is 32)');
				if (self.n === _) self.r = self.n = 0;
				let r = 0;
				if (n > self.n) r = self.r, n -= self.n, self.r = self(), self.n = 32;
				r = (r << n) | (self.r & ((1 << n) - 1)), self.n -= n, self.r >>>= n;
				return r;
			},
			fill(a, bytes = _) {
				a = new Uint32Array(a.buffer || a);
				if (bytes === _) bytes = a.byteLength;
				if (typeof crypto!==''+_ && crypto.getRandomValues) {
					const quota = 65536, n = Math.floor(bytes/quota);
					let src = n && new Uint32Array(quota), i;
					for (i = 0; i < n; ++i) crypto.getRandomValues(src), a.set(src, i*quota);
					src = new Uint32Array(bytes - n*quota);
					crypto.getRandomValues(src), a.set(src, n*quota);
				} else for (const i = 0; i < a.length; ++i)
					a[i] = (Math.random() * Math.pow(2,32)) >>> 0;
				return a;
			},
		},
		Array:{ prototype:{ random() { return this[random(this.length)] } } }
	},
	buf:{ a:new Uint32Array(1024), pos:1024, end:0, n:0 },
	count(n) { let x=0; while (n >>>= 1) ++x; return x },
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
			undo:{
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







code = {
	name:'refs',
	define:{
		ref:{
			doc:`Non-intrusive ref-counting by giving/taking responsibility. Required if managing a resource (then each take must have exactly one give); otherwise its existence can be forgotten unless otherwise specified by called functions (its inclusion may allow greater efficiency, not greater correctness, unless a child actually reads the ref-count).
				Allows re-use of no-longer-used objects (and thus of CPU cache).`,

			why:`
				Automatic garbage collection is the most general solution to memory management, but to re-use objects and CPU cache reliably (especially desired in a tight loop), another way of tracking their lifetime is required.
				Pairing creation with destruction (RAII), necessitating smart-pointer classes, in a dynamic language would mean that instances of those smart-pointers must be created for any lifetime management — double-indirection is not only inefficient, but also a source of easy-to-fix bugs and some code repetition for dereferencing.
				Ref-counting must not impose any constraints on code that does not care about ownership (and thus not be a far-reaching source of bugs, and require every single function to be re/written with ref-counting in mind), and it must integrate seamlessly with non-ref-counted objects (and thus not require every single pre-existing global object to be augmented). Giving/taking responsibility with delayed destruction achieves these.`,

			call(o) { return ref.take(o) },
			active:0,
			give:{
				doc:`Gives responsibility for a reference (object/function) to someone else, decrementing its ref-counter. If it is still zero on ref.finally or async as-soon-as-possible (if no one takes responsibility), ref.deinit is called on it; take-after-give is then a no-op. Deferred-deinit unref.
					Returns the passed object (unless unwanted). If it is not ref-tracked, no responsibility is ever claimed, and give/take/drop are no-op.
					Use when returning an owned variable or passing its last use as a parameter; on exception, drop it in try/catch.
					Ensure least possible delay between give/take — try to only use give/take at function call boundaries, and maybe call ref.finally if correct to clean up now.`,
				call(o) {
					if (!refable(o) || o[refs] === _) return o;
					return dec(o, false), o;
				}
			},
			take:{
				doc:`Takes responsibility for a reference (object/function) from someone else, incrementing its ref-counter (and making it not be cleaned up). Maybe-given ref.
					Returns the passed object. If it is not ref-tracked, no responsibility is ever taken, and give/take are no-op.
					Use when accepting args, or when storing a variable in some way.
				`,
				call(o) {
					if (!refable(o) || o[refs] === _) return o;
					return inc(o), o;
				}
			},
			drop:{
				doc:`Drops or gives up responsibility for a reference; none will take it.
					Use when a variable goes out of scope, inside finally of try/finally.`,
				call(o) { if (!refable(o) || o[refs] === _) return o; dec(o, true) }
			},
			finally:{
				doc:`All owner-less responsibility is unwanted, and will be claimed by the void.
					Only do this if all callers are known to be fully ref-counting (for example, the outer event loop can call this), else use-after-free will ensue.`,
				call() { abyss.forEach(ref.deinit) }
			},

			shared:{
				doc:`Returns false if the passed object/function has only one reference to it, else true (if not ref-tracked, true).
					Make sure that callers, direct or not, are ref-tracking.
					If the object has zero refs to it, throws, to help with use-after-free bugs.
					Check used after taking (given to void with try/finally if needed) to see if (potentially more efficient) in-place modification is allowed. (This generally means that reads can be non-ref-tracking, but writes should be ref-tracking.)`,
				call(o) {
					if (!refable(o)) return true;
					if (o[refs] === 0) throw "Use after free detected";
					return o[refs] !== 1;
				}
			},
			count:{
				doc:`Returns ref-count of o. For use in optimizations only.
					Will not be correct unless all callers are ref-tracking.`,
				call(o) {
					return !refable(o) ? _ : !refable(o[refs]) ? o[refs] : o[refs][refs];
				}
			},
			counted:{
				doc:`Returns whether an object is ref-counted. Assert this before attaching any responsibility to its lifetime.`,
				call(o) { return o && o[refs] !== _ }
			},

			joined:{
				doc:`Returns true if a and b use the same ref-counter, and false otherwise.
					If true, ref.take(a),ref.give(b, true) is a no-op (for any order of a/b), as is ref.take(a),ref.give(b) (for any order of a/b and take/give).`,
				call(a,b) {
					if (!refable(a) || !refable(b)) return false;
					return a[refs] !== _ && a === b || a[refs] === b || a === b[refs];
				}
			},
			join:{
				doc:`Joins ref-counters of an object and its value, allowing cycles to be collected.
					Most suitable for unchanging structures.
					Do not join if it is known that no circular references exist.
					For each o.get(k) in a cycle (on a trace through composition that has led from a value to that same value), ref.join(o,k) must be called (for example, for a two-node trivial cycle/loop/circuit, it must be called twice.); before any future composition modifications, ref.split(o,k) should be called (though not required for correctness).`,

				why:`
					Using strong (ref-counting) references everywhere in code presents a causality problem with reference cycles (their ref-count cannot ever reach 0). It is usually solved by using weak references — that is, non-ref-counting, and carefully engineering resource lifetimes to still be correct (for example, in tree structures, parent and siblings references should be weak references). This intertwines data and code, and runs into use-after-free during development too often, and makes robust program rewrites much more complicated and/or brittle. Weak references are not a solution to the cycle problem, only a workaround, better used elsewhere (not ref-counting is faster than ref-counting, so since JS is single-threaded run-until-completion, ref-counting can be limited to function boundaries).
					Garbage collection (of cycles) is always possible, but there is an overhead, and the freeing is delayed arbitrarily — which does not help with re-using the same objects to not bloat during tight loops and such.
					Joining ref-counts is an actual solution to ref-cycles — a ref-counter (obj[refs], usually a number) can point to another object with a ref-counter, and both are treated as one by give/take (which fits well if object references are fitted in the NaN part of 8-byte float numbers, as is usually the case in JS engines) (semantically, the tree example would have one ref-count for the whole tree, and not always-1 pseudo-counts on non-root nodes). It can never free potentially-used objects, so is not brittle in that regard, and fully encapsulates ref knowledge within a value (not sprinkled through code). (The only brittle part is splitting ref-counts before writing, which requires program-level knowledge of how many refs there are to each object (likely zero) — but that is exactly what working with weak refs requires, and is only limited to dynamic cycle breaking.)`,
				call(o,k) {
					type(o.get, Function);
					const v = ref.take(o.get(k));
					try {
						if (!refable(o) || !refable(v)) return;
						if (o === v) return;
						if (refable(o[refs])) o = o[refs];
						if (refable(v[refs])) v = v[refs];
						type(o[refs], Index), type(v[refs], Index);
						if (!o[refs] || !v[refs])
							error("Joined cycles must not be already collected");
						if (o !== v) o[refs] += v[refs], v[refs] = o;
						return ref.give(v);
					} finally { ref.give(v, true) }
				}
			},
			split:{
				doc:`After ref.join(o,k), call ref.split(o,k) to split reference counts before modifications to structure.
					If the value has any non-cycle refs, their count must be precisely passed as bRefs — else one of them will never be collected, and another will report having to give responsibility it does not have (near destruction).`,
				call(o,k, vRefs = 0) {
					type(o.get, Function);
					const v = ref.take(o.get(k));
					try {
						if (!refable(o) || !refable(v)) return;
						type(vRefs, Index);
						if (refable(o[refs]) && !refable(v[refs])) [o,v] = [v,o];
						if (refable(o[refs])) o = o[refs];
						if (vRefs > o[refs]) error("Too many outside refs predicted");
						type(o[refs], Index);
						if (refable(v[refs])) {
							if (o !== v[refs]) error("Splitting different ref-counters");
							v[refs] = 0;
						} else {
							type(v[refs], Index);
							if (vRefs > v[refs]) error("Too many outside refs predicted");
						}
						v[refs] += vRefs, o[refs] -= vRefs;
						return ref.take(v);
					} finally { ref.give(v, true) }
				}
			},


			active:0, total:0,
			init:{
				doc:`Initialize and return an object of type t, taking from a (type-specific) cache or creating if empty. Take responsibility for it to make it last past the immediate synchronous execution.
					If t is a function, it is created with 'new T'; if an object, with 'Object.create(t)' (do not create .prototype for types, define both static and instance methods on the type); else throw. On the created object, 'o.init()' is called if present; if it returns non-_ non-o, that is returned instead.
					If second arg is true, does not create a ref-counter on the object (nor gives responsibility).`,
				call(T, noRef = false) {
					if (T === String) return '';
					if (T === Number) return 0;
					if (T === Boolean) return false;
					if (T === Symbol) return T();
					if (memory.guess() > ref.maxMem) ref.free(memory() - ref.maxMem);
					let o;
					if (T.cache)
						do { o = T.cache.pop(), --ref.total } while (o && o[refs] !== 0);
					if (o === _) o = type(T) !== Function ? Object.create(T) : new T;
					if (type.is(o.init, Function) && o.init.prototype) {
						const r = o.init();
						if (r !== _ && r !== o)
							o[refs] = 1, ref.drop(o), o = r, --ref.total, --ref.active;
					}
					++ref.total, ++ref.active;
					return !noRef ? (o[refs] = 1) : (delete o[refs]), ref.give(o);
				}
			},
			deinit:{
				doc:`Deinitialize an object (or function), giving all responsibility for it to a (type-specific) cache.
					'o.deinit()' is called if present. Then, each value composing o is dropped (using forEach).
					Even a non-ref-tracked object will be treated as ref-tracked.`,
				call(o) {
					if (!refable(o) || o[refs] === _) return;
					o[refs] = 0, --self.active;
					type.is(o.deinit, Function) && o.deinit();
					forEach.value(o, ref.drop);
					const T = type(o);
					if (Object.owns.call(o, 'cache')) ref.drop(o.cache);
					if (T.cache === _) T.cache = init(StackCache);
					if (T.cache) T.cache.push(o);
				}
			},

			maxMem: 100e6,
			free:{
				doc:`Low-level; frees mem (likely bytes) by freeing caches. Called internally when ref.maxMem is reached on an allocation.`,
				list:[d => { free.d = d, stackCaches.forEach(free) }],
				call(mem, ms = 5) {
					type(ms, _, Number);
					const start = time.guess();
					while (mem > 0 && (ms === _ || time.guess(start) < ms))
						mem -= random(self.list)(mem);
				}
			},
			onFree:{
				doc:`Low-level; adds a requestedFreeMem → actualFreedMem function to the list of functions called on free.`,
				call(f) { ref.free.list.push(ref.take(f)) }
			},
			destroy:{
				doc:`Low-level; make sure to call this when an object will no longer be reachable even by caches.`,
				call(o) {
					--ref.total, 'remove back-refs of o.'
				}
			},
		},
		init:'ref.init',
		deinit:'ref.deinit',
		cache:'ref.init/.deinit',


		tests:[
			() => { 'refs'
				if (!ref.shared({})) error('no-ref must be shared');
				const a = { [refs]:1 };
				if (ref.shared(a)) error('one-ref must not be shared');
				try { return abyss.has(ref.give(a)) }
				finally { ref.finally() }
			},
			() => { 'cycles'
				const a = { [refs]:1 }, b = { [refs]:1 };
				a.get = () => b, b.get = () => a, "— not a good way to define those in general.";
				if (!ref.joined(a,a) || !ref.joined(b,b)) error('not self-joined');

				const cycle = ref.take(ref.join(ref.join(a, ''), ''));
				try {
					if (cycle !== a) error('not a cycle');
					if (!ref.joined(a,b)) error('cycle not joined');
					if (cycle[refs] !== 1) error(cycle[refs] + ' refs of cycle');
					if (abyss.has(a) || abyss.has(b)) error('deleting after joining');
				} catch (err) { ref.give(cycle, true); throw err }

				ref.give(ref.split(ref.split(cycle, ''), ''));
				if (ref.joined(a,b)) error('failed to split');
				if (!abyss.has(a) || !abyss.has(b)) error('not deleting after splitting');
			},
			() => { 'inits'
				const o = ref.take(ref.init({ x:12 }));
				if (ref.shared(o)) error('wrong ref-count of a just-initialized object');
				if (o.x !== 12) error('type is not a prototype');
				ref.deinit(o);
				if (o[refs] !== 0) error('not freed');
			},
		],
	},
	refs:Symbol('refs'),
	abyss:new Set,
	clearAbyss() { self.lock = false; ref.finally() },
	refable(o) { return (typeof o === 'object' || typeof o === 'function') && o },
	inc(o) {
		if (refable(o[refs])) o = o[refs];
		type(o[refs], Number), ++o[refs];
		if (o[refs] === 1) ++ref.active, abyss.delete(o);
	},
	dec(o, unwanted = false) {
		if (refable(o[refs])) o = o[refs];
		if (o[refs] === 0) error("Gave too much responsibility, without having it");
		type(o[refs], Number), --o[refs];
		if (o[refs] === 0) {
			--ref.active;
			if (unwanted) ref.deinit(o);
			else if (abyss.add(o), !clearAbyss.lock)
				clearAbyss.lock = true, delay(clearAbyss);
		}
	},

	epoch:{
		n:0, lock:false,
		end() { epoch.lock = false, epoch.n = (epoch.n+1) >>> 0 },
		call() { if (!self.lock) delay(self.end), self.lock = true; return self.n }
	},
	free(c) { c.free(self.d) },
	stackCaches:new Set,
	StackCache:{
		[prototype]: Array.prototype,
		doc:`Basic cache for freed objects. Does not cache at first. When it would have been useful 3 times in one synchronous run, turns into an actual last-in-first-out cache, and turns back when it becomes empty.`,
		why:`
			When an object is no longer required, CPU caches can be re-used if the object is re-used.
			However, JS garbage collection is optimized towards freeing most-recently-allocated objects, so unless we can (more or less) prove that caching would actually be beneficial, we must not cache.`,

		init() { this.length = 3, this[0] = epoch(), this[1] = this[2] = 0 },
		deinit() { this.length = 0, stackCaches.delete(this) },
		monitoring() {
			return type.is(this[0], Number) && (this[0] !== epoch() && this.init(), true);
		},
		push(o) {
			if (this.monitoring()) this[1] = (this[1] + 1) >>> 0;
			else this[this.length++] = o;
		},
		pop() {
			if (this.monitoring()) {
				this[2] = Math.min(this[1], this[2] + 1) >>> 0;
				if (this[2] >= 3) this.length = 0, stackCaches.add(this);
			} else {
				if (this.length)
					try { return this[this.length-1] } finally { --this.length }
				else this.init(), stackCaches.delete(this);
			}
		},
		get(k) { return k === _ ? 0 : _ },

		free(d) {
			if (type.is(this[0], Number)) error('Freeing a cache while in monitoring mode');
			if (!this.length) error('Freeing an empty cache');
			const start = memory.guess();
			ref.total -= this.length;
			const max = -memory.guess(start);
			if (max > d) {
				ref.total += this.length;
				const n = Math.ceil(this.length * d / max);
				for (const i = this.length - n; i < this.length; ++i) ref.destroy(this[i]);
				this.length -= n;
				if (!this.length) stackCaches.delete(this);
			} else this.forEach(ref.destroy), this.length = 0, stackCaches.delete(this);
		},
	},
}



























































code
