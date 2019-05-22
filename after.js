code = {
	doc:`('code.js' defines the particular shapes this program takes.)`,

	why:`Modules like here are a way to bootstrap to concepts.
		Each extensibility point is a big long-term win. Natural or artificial, you too should strive to know more different concepts, separated cleanly to combine easily.`,

	defines:{ [Symbol()]: 'the public interface of a module' },
	call() { 'the function that is called on initialization of a module' },
	rest: 'private variables, visible (but const) from any function of a module',

	obj:{
		call() { 'makes obj a function' },
		arrays: ['are merged into one array (used for defining tests)'],
		objects: { merged:'too' },
		allKeys: 'must be enumerable strings.',
		f: 'Function.env(f) returns the creation environment of f (or creates a function).',
		why:`Standard JS modules are neither fully-inspectable (and thus non-copyable, even theoretically) nor allow functions to be augmented with things like documentation or other functions.`
	}
}













code = {
	name:'fail',
	defines:{
		fail:{
			doc:`Throws a failure defined by the first argument.
				Second argument can be set to true to force storing a stack-trace, or to false to not.`,
			call(e, stack = false) {
				throw stack && !(e instanceof Error) ? new Error(e) : e
			}
		},
	}
}




code = {
	name:'tests',
	call() {
		'Run some tests on every load.'
		setTimeout(() => {
			try { time.limit(100), test() } catch (err) {}
			setTimeout(() => {
				try { time.limit(100), test() } catch (err) {}
				setTimeout(() => {
					try { test() } catch (err) {}
					test.log()
				}, 1000);
			}, 1000);
		}, 1000);
	},
	defines:{
		tests:[],
		test:{
			doc:`
				Runs all tests in random order, once; returns true if all were successful, false if any failed. Their results will be stored on tests[i].err (void if successful) and tests[i].time (sum of all runtimes) (and tests[i].runs, number of times it was run).
				A test is successful if it returns true or void and it creates no ref-leaks. Otherwise tests[i].err will contain its (most recent) exception or a ref-tracked array of its (most recent) ref-leaks.
				The global variable tests is an array of functions like () => f(2)===2; define its parts near the tested functionality.`,
			call() {
				if (!order.length) reorder();
				let b = true;
				time.limit(Infinity)
				while (order.length)
					if (time.limit(), !run(tests[order.pop()]))
						b = false;
				return b;
			},
			log:{
				doc:`Logs any failed tests (percentage passed, then for each failed test, first 50 chars of their bodies, their last exception or ref-leak count) with console.log/.group/Collapsed/End.
					If all succeeded, logs the average time to execute all tests, and how many times the whole set was executed (and all tests that took more than double the average to run).`,
				call() {
					let total = 0;
					const fail = []
					for (let t of tests) {
						if (t.runs) total += t.time / t.runs
						if (t.err !== _) fail.push(t)
					}
					try {
						const c = console, group = c.groupCollapsed || c.group;
						if (!fail.length) {
							let s = 0, n = 0;
							for (let i = 0; i < tests.length; ++i)
								s += tests[i].time || 0, n += tests[i].runs || 0;
							const avgS = (s/n).toFixed(1), avgN = (n / tests.length).toFixed(1);
							group.call(c, `Tests OK (${avgS} ms for all, done ${avgN} times)`);
							try {
								for (let t of tests) {
									if (!t.runs) return;
									const ms = t.time / t.runs;
									if (ms > 2 * total / tests.length) {
										const b = (ms/total*100).toFixed(0);
										c.log(str(t), 'took', ms.toFixed(2), `ms (${b}%)`);
									}
								}
							} finally { c.groupEnd() }
						} else {
							const p = (100-fail.length/tests.length * 100).toFixed(1);
							group.call(c, `Passed ${p}% tests (failed ${fail.length}/${tests.length})`);
							try {
								for (let i = 0; i < fail.length; ++i)
									c.log('Failed', str(fail[i]), 'with', fail[i].err);
							} finally { c.groupEnd() }
						}
					} finally { /*ref.give(fail, true)*/ }
				}
			},
		},
	},
	order:[],
	shuffle(a) {
		for (let i = a.length-1; i>0; --i) {
			const j = random(i+1);
			if (i !== j) [a[i], a[j]] = [a[j], a[i]];
		}
	},
	reorder() { while (order.length < tests.length) order.push(order.length); shuffle(order) },
	run(f) {
		type(f, Function);
		try {
			let start = time(), /*active = ref.active, */r;
			try { r = f() }
			finally { f.time = (f.time || 0) + time(start), f.runs = (f.runs || 0) + 1 }
			/*if (active !== ref.active)
				ref.give(r, true), r = 'Created ' + (ref.active - active) + ' extra references';*/
			if (r === true || r === _) /*ref.give(f.err, true), */f.err = _;
			else if (f.err !== r) /*ref.give(f.err, true), */f.err = /*ref.take*/(r);
		} catch (err) { if (f.err !== err) /*ref.give(f.err, true), */f.err = /*ref*/(err) }
	},
	str(f) {
		const body = f[Object.string].replace(/\s/g, ' ');
		return body.length > 84 ? '…' + body.slice(16, 100) + '…' : body;
	},
}





code = {
	name:"delay",
	defines:{
		delay:{
			doc:`Delays the execution of a function asynchronously.
				Zero-delay callbacks are executed in order; others — when requested, as soon as possible.
				No state can be passed to the callback (schedule own callback-executing function instead).
				Scheduled functions can not be cancelled.
				CPU usage is limited to delay.options.maxTimeUsage (0…1).
				Use delay over setImmediate or process.nextTick or setTimeout or requestAnimationFrame (unless the delay specifically for animating is wanted).
				In browser background tabs, effects of timeout throttling are minimized — scheduling 100 callbacks to fire in a second will fire all in a second or two, unless computation budget is exceeded.
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
		let dur = Math.min((info.total * max - info.used) / (1 - max), 10), i;
		try {
			for (i=0; i < imm.length && time(info.origin) <= start + dur; ++i) {
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
	name:"measure",
	defines:{
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
					if (!info.limit) info.limit = time.guess() + ms;
					else info.limit = Math.min(time.guess() + ms, info.limit);
					if (!info.lock)
						setTimeout(resetTimeLimit, 0), info.lock = true;
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
					return info.base/* + Math.round(ref.total * self.avgRefMem)*/ - mark;
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
		/*if (typeof process!==''+_) {
			(f = memory).memory = 0, f(), f(), f(), f.memory = f(f());
			if (f.memory > 3000) f.memory = 0;
			setTimeout(() => {
				info.base = memory();
				setInterval(() => { "Calibrate guessed memory to account for devilry."
					if (ref.active) memory.guess.avgRefMem = memory() / ref.active;
				}, 1000).unref();
			}, 1000).unref();
		}*/
	},
}





code = {
	name:"browserSpecific (including hot reloading on source change)",
	defines:{
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
				new N(title, { body:msg, icon }).onclick = closex;
			}
		},
	},
	call() {
		if (typeof browser!==''+_)
			browser.notifications.getAll().then(o => Object.keys(o).forEach(browserClear)),
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
	closex() { this.close(), "instantly" },
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
	defines:{
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
					fail('Expected uint32/void/extensible as limit of random');
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
						'These are tricks to express comparisons by that formula in int arithmetic.'
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
				do { q0 = random.bits(n) } while (q0 >= q1);
				return q0 % end;
			},
			float:{
				doc:`Returns a uniformly-distributed number from 0 to 1 (0 is inclusive).
					Equivalent to 'random()'.`,
				call() {
					let a = random.bits(21), b = random.bits(), e = 0;
					while ((a === ((a << 12) >>> 12)) && e < 1021)
						a = (a << 1) | (b >>> 31),
						b = (b << 1) | random.bits(1), ++e;
					return (a * Math.pow(2,32) + b) * Math.pow(2, -53-e);
				}
			},
			roll:{
				doc:`Returns true with probability p, else false.
					Equivalent to 'random() < p' with checks on p, but faster.`,
				call(p) {
					type(p, Number);
					if (p < 0) fail('Probability is too low: '+p);
					if (p > 1) fail('Probability is too high: '+p);
					if (p !== p) fail('Probability is NaN');
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
					fail();
				},
				impl:`Generating (up to) 4 bits at a time is not based on past performance measures, or anything.
					Using 4 bits at a time consumes on average about double the bits that using 1 bit at a time would, but should be much faster.`,
			},



			bits(n) {
				if (!n) {
					if (buf.pos >= buf.a.length)
						buf.pos = 0, random.fill(buf.a);
					return buf.a[buf.pos++];
				}
				if (n !== (n & 31)) fail('Expected 0…31 bits to generate (where 0 is 32)');
				if (self.n === _) self.r = self.n = 0;
				let r = 0;
				if (n > self.n) r = self.r, n -= self.n, self.r = self(), self.n = 32;
				r = (r << n) | (self.r & ((1 << n) - 1)), self.n -= n, self.r >>>= n;
				return r;
			},
			fill(a, bytes = _) {
				a = new Uint8Array(a.buffer || a);
				if (bytes === _) bytes = a.byteLength;
				if (typeof crypto!==''+_ && crypto.getRandomValues) {
					const quota = 65536, n = Math.floor(bytes/quota);
					let src = n && new Uint8Array(quota), i;
					for (i = 0; i < n; ++i)
						crypto.getRandomValues(src), a.set(src, i*quota);
					src = new Uint8Array(bytes - n*quota);
					crypto.getRandomValues(src), a.set(src, n*quota);
				} else for (let i = 0; i < a.length; ++i)
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
	name:'filter',
	defines:{
		filter:{
			doc:`An in-place version of array filtering (removing elements not passing a condition), not supporting thisArg, but supporting removed.call(arr, elem) if needed. pass will be called as pass.call(arr, elem), unlike in JS.`,
			call(arr, pass, removed = void 0) {
				let i = 0, from = 0 && 'from ≤ i', to = 0 && 'to ≤ i'
				try {
					for (; i < arr.length; ++i)
						if (!pass.call(arr, arr[i]))
							arr[i] = removed && void removed.call(arr, arr[i]),
							arr.copyWithin(to, from, i),
							to += i - from, from = i+1
					arr.copyWithin(to, from, i), to += i - from
					arr.length = to
					return arr
				} catch (err) {
					arr[i] = removed && void removed.call(arr, arr[i]),
					arr.copyWithin(to, from, i), to += i - from
					arr.copyWithin(to, ++i)
					arr.length -= i - to
					throw err
				} 
			},
		},
		tests:[
			() => JSON.stringify(filter([1,2,3,4], x => true)) === '[1,2,3,4]',
			() => JSON.stringify(filter([1,2,3,4], x => x!==2)) === '[1,3,4]',
			() => JSON.stringify(filter([1,2,3,4], x => x===2)) === '[2]',
			() => JSON.stringify(filter([1,2,3,4], x => false)) === '[]',
			() => JSON.stringify(filter([1,2,3,4], x => x===2 && fail())) === '[3,4]',
			() => JSON.stringify(filter([1,2,3,4], x => x===2 && fail() || true)) === '[1,3,4]',
		]
	}
}















code = {
	name:'hash',
	defines:{
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
							mult = (((i + (i<<12))>>>0) + (i<<29))>>>0, "i * 536875009"
						else
							mult = (((i + (i<<12))>>>0) + (i<<25))>>>0, "i * 33558529"
					} else {
						if ((info.n >>> 1) & 1)
							mult = (((i + (i<<26))>>>0) + (i<<29))>>>0, "i * 603979777"
						else
							mult = (((i + (i<<22))>>>0) + (i<<30))>>>0, "i * 1077936129"
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
			for (let i = 0; i < this.length; ++i)
				h = hash.mix(h, this.charCodeAt(i));
			return h;
		} } },
		Symbol:{ prototype:{ hash() {
			return hash(this.description || Symbol.keyFor(this) || '');
		} } },
	},
	info:{ seed:0, n:0 },
}
































































code = {
	defines:{
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
		fail('Did not extend');
	},
}

"Can we make something like Number.tests(N): +∞, -∞, NaN, 0, 1, -1, .5, then random?"
	"Or just Number.get()->iterator(f)."
	"Or should we make it a part of interval-based, uh, sets/maps?"
	'(Or, instances(Number) or smth?)'























































code = {
	name:'relink',
	a:1,
	call(defines) {
		console.log('Pre-network is ready.')
		delay(() => {
		})
		defines.document && defines.document.body.append('Ready')
		defines.document && (defines.document.body.style.textAlign = 'center');
	},
}





'Since we now have de/composition, not only shall emit/parse be joined in usage, but also sequence activity will be just a special case of conceptual equality.'
	'Still, this was a nice interface.'
code = {
	name:'emit — will this have to be rewritten in light of forEach/…?',
	defines:{
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
							values.forEach(raw);
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
		//console.log('test:', o2.toString());
		//console.log('prettier:\n' + emit.prettyPrinted(o2, '  ', 10));
	},
}






















code = {
	name:"priorityHeap",
	defines:{
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
	name:'type — used for type-checking and getting the type',
	defines:{
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
		Codepoint:{ is(v) {
			return type.is(v, Index) && (v < 0xd800 || v>=0xe000 && v<0x110000)
		} },
		type:{
			doc:`Returns the type of value, or asserts that it is one of the supplied types and returns it.
				(Only up to 3 types can be supplied, to avoid having to create a garbage array for the rest of args.)`,
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
				if (t3 !== _) fail("Too many expected types passed to type(…)");
				if (t0 !== _) {
					if (type.is(v, t0)) return v;
					if (t1 !== _) {
						if (type.is(v, t1)) return v;
						if (t2 !== _) {
							if (type.is(v, t2)) return v;
							fail(`Unexpected type: ${descr(T(v))} (expected ${descr(t0)} or ${descr(t1)} or ${descr(t2)})`);
						}
						fail(`Unexpected type: ${descr(T(v))} (expected ${descr(t0)} or ${descr(t1)})`);
					}
					fail(`Unexpected type: ${descr(T(v))} (expected ${descr(t0)})`);
				}
				fail('Should not happen');
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
	name:"prettify",
	defines:{
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







/*code = {
	name:'refs',
	defines:{
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
							fail("Joined cycles must not be already collected");
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
						if (vRefs > o[refs]) fail("Too many outside refs predicted");
						type(o[refs], Index);
						if (refable(v[refs])) {
							if (o !== v[refs]) fail("Splitting different ref-counters");
							v[refs] = 0;
						} else {
							type(v[refs], Index);
							if (vRefs > v[refs]) fail("Too many outside refs predicted");
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
					o.forEach && o.forEach(ref.drop)
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


		tests:[
			() => { 'refs'
				if (!ref.shared({})) fail('no-ref must be shared');
				const a = { [refs]:1 };
				if (ref.shared(a)) fail('one-ref must not be shared');
				try { return abyss.has(ref.give(a)) }
				finally { ref.finally() }
			},
			() => { 'cycles'
				const a = { [refs]:1 }, b = { [refs]:1 };
				a.get = () => b, b.get = () => a, "— not a good way to define those in general.";
				if (!ref.joined(a,a) || !ref.joined(b,b)) fail('not self-joined');

				const cycle = ref.take(ref.join(ref.join(a, ''), ''));
				try {
					if (cycle !== a) fail('not a cycle');
					if (!ref.joined(a,b)) fail('cycle not joined');
					if (cycle[refs] !== 1) fail(cycle[refs] + ' refs of cycle');
					if (abyss.has(a) || abyss.has(b)) fail('deleting after joining');
				} catch (err) { ref.give(cycle, true); throw err }

				ref.give(ref.split(ref.split(cycle, ''), ''));
				if (ref.joined(a,b)) fail('failed to split');
				if (!abyss.has(a) || !abyss.has(b)) fail('not deleting after splitting');
			},
			() => { 'inits'
				const o = ref.take(ref.init({ x:12 }));
				if (ref.shared(o)) fail('wrong ref-count of a just-initialized object');
				if (o.x !== 12) fail('type is not a prototype');
				ref.deinit(o);
				if (o[refs] !== 0) fail('not freed');
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
		if (o[refs] === 0) fail("Gave too much responsibility, without having it");
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
			if (type.is(this[0], Number)) fail('Freeing a cache while in monitoring mode');
			if (!this.length) fail('Freeing an empty cache');
			const start = memory.guess();
			ref.total -= this.length;
			const max = -memory.guess(start);
			if (max > d) {
				ref.total += this.length;
				const n = Math.ceil(this.length * d / max);
				for (let i = this.length - n; i < this.length; ++i)
					ref.destroy(this[i]);
				this.length -= n;
				if (!this.length) stackCaches.delete(this);
			} else this.forEach(ref.destroy), this.length = 0, stackCaches.delete(this);
		},
	},
}*/



























































//code
