code = {
	name:'concept',
	defines:{
		concept:{
			doc:`A concept is a pure view of anything, a basic building block of the conceptual language. Here (in native JS), a concept is anything that defines '.def(code)=>override', directly or in prototype (like numbers/strings should).

				When this is called directly, properly handles a native override; for usage like 'try{concept(self, arg)} catch(r){return r}' (it is very inconvenient otherwise).`,

			call(code, data) {
				if (typeof data.def !== 'function') return
				const d = data.def(code)
				if (d === concept.none) return
				if (typeof d !== 'function') throw d
				try { let r = d(data) }
				catch (err) { console.error(err); throw _ }
				if (r !== concept.none) throw r
			},

			none: { doc:`No override.`, def(c) { return concept.none } },
			get:{
				doc:`Gets the override of a key/code, or concept.none.
					"Override" this with a function of concept and key to handle keys that are not in the map explicitly.`,
				call(con, key) {
					if (con.has(key)) return con.get(key)
					if (con.has(self)) return con.get(self)(con, key)
					return concept.none
				},
			},
			js:{
				doc:`Easily creates a concept from a JS object or function.`,
				call(from) {
					//Concepts should be { def: a Map }, not relying on functions.
					switch (typeof from) {
						case'symbol': fail('no symbols allowed')
						case'boolean': fail('no booleans allowed')
						case'undefined': fail('no void allowed')
					}
					if (from === null) fail('no null allowed')
					else if (typeof from === 'number') return from
					else if (typeof from === 'string') return from

					if (from instanceof Map) return merge(from)

					let to = new Map
					if (typeof from === 'function')
						to.set(finish, act.js(from))
					let at, k, v
					for (k in from)
						if ((v = from[k]) !== concept.none)
							if (at = ((+k >>> 0) === k) ? +k : lookup(k) || k)
								to.set(at, v)
					return merge(to)
				},
			},

			create:{
				doc:`Creates a concept from an accessed container.
					A stub for now. Needs access to work.`,
				call(acc) { fail('stub') },
			},
			destroy:{
				doc:`Removes back-references to the concept, cleansing it from all memory. Then calls the destructor if defined.`,
				call(con) {
					if (typeof con.def !== 'function')
						fail('non-conceptual destruction')
					for (let [k,v] of con) {
						let b = concept.backrefs(k)
						if (b !== concept.none)
							filter(b, cand => !eq(con, cand))
						if (!b.length) defaultBacks.delete(k)

						b = concept.backrefs(v)
						if (b !== concept.none)
							filter(b, cand => !eq(con, cand))
						if (!b.length) defaultBacks.delete(v)
					}
					try{concept(self, con)} catch(r){return r}
				},
			},

			backrefs:{
				doc:`Gets some concepts which reference the passed concept.
					Each concept is stored in the backref-storage of one of its parts.`,
				call(c) {
					try{concept(self, c)} catch(r){return r}
					if (c instanceof Map)
						return c.get(self) || concept.none
					return defaultBacks.get(c) || concept.none
				},
			},

			//What about concept.dynamic, required for acting?
			//What about access, which also has the writing `key->value`?
				//I GUESS THE ONLY OPTION OPEN NOW IS ACCESS
					//(at least `part(obj, key)`/`write(key, value)`).
				//Also, just the function .def is no good — can't get keys then.
					//ACCESS WATCHERS ACCESS WATCHERS ACCESS WATCHERS
		},

		Map:{ prototype:{ def:{
			doc:`Looks up a conceptual override (dynamic definition) of a key/concept.
				A Map is the most general of all views (and thus is the slowest).`,
			call(c) {
				return this.has(c) ? this.get(c) : concept.none
			},
		} } },

		tests:[
			() => 3 === concept.js({ ['concept.destroy']:3 }).def(concept.destroy),
			() => {
				let b = 1
				concept.destroy(concept.js({ ['concept.destroy']: () => --b }))
				return !b
			},
			() => {
				let a = concept.js(new Map([ [23, 45], [67, 89] ]))
				let b = concept.js(new Map([ [ a, 45], [67, 89] ]))
				let c = concept.js(new Map([ [23, 45], [67,  a] ]))
				let d = concept.js(new Map([ [ a,  a], [ a,  b] ]))
				return backCost(b) === 1
			},
		],
	},
	backrefs: Symbol(`Just an invisible key.`),
	defaultBacks: new Map,
	backCost:{
		doc:`Returns the worst cost of searching through backrefs of a concept.
			Used to primitively minimize the impact of the worst case.`,
		call(c) {
			let b = concept.backrefs(c)
			return b !== concept.none ? b.length : 0
		},
	},

	eq:{
		doc:`Checks if two concepts are exactly equal override-wise.`,
		call(a,b) {
			if (!(a instanceof Map) || !(b instanceof Map))
				fail('non-conceptual equality')
			if (a.size !== b.size) return false
			for (let [k,v] of a) if (b.def(k) !== v) return false
			return true
		},
	},
	merge:{
		doc:`Performs a pure merge via a primitive linear search through back-references of all references. If did not merge, leaves a back-reference in the least-worst spot so that further merges can find the new object again.`,
		call(con) {
			if (!(con instanceof Map))
				fail('can only merge native JS Maps')
			if (!con.size) return concept.none
			let best = _
			for (let [k,v] of con) {
				let b = concept.backrefs(k)
				if (b !== concept.none)
					for (let cand of b)
						if (eq(con, cand))
							return cand
				if (best === _ || backCost(k) < backCost(best)) best = k
				b = concept.backrefs(v)
				if (b !== concept.none)
					for (let cand of b)
						if (eq(con, cand))
							return cand
				if (best === _ || backCost(v) < backCost(best)) best = v
			}
			let b = concept.backrefs(best)
			if (b === concept.none) {
				if (best instanceof Map)
					best.set(concept.backrefs, b = [])
				else
					defaultBacks.set(best, b = [])
			}
			b.push(con)
			return con
		},
	},
	lookup:{
		doc:`Looks up a network-defined global value or returns void; namespaces are separated via '.'.`,
		call(path) {
			let d = defines
			for (let x of path.split('.')) d = d && d[x]
			return d
		},
	},
}










code = {
	name:'step',
	defines:{
		ref:{
			doc:`Creates a local reference exclusively responsible for a remote object.`,
			call(c) {
				return concept.js({
					['ref.get']: c,
					['concept.destroy']: ref.destroy,
				})
			},
			destroy:{
				doc:`Destroys the pointee of a pointer.`,
				call(r) {
					if (r.get(ref.get)) concept.destroy(r.get(ref.get))
				},
			},
			get:{
				doc:`Releases the object inside a reference for use in the native wild.`,
				call(r) {
					let c = r.get(self)
					if (!c) fail('expected a reference')
					r.set(self, null)
						'No concept should have such power…'
					return c
				}
			},
		},
		step:{
			doc:`Performs one unit of execution of the concept inside of a reference.
				Unless overriden, throws a copy of the input.`,
			call(r) {
				let c = ref.get(r)
				if (!c.has(self)) throw ref(c)
				return ref(c.get(self)(c))
			},
		},
	},
}












code = {
	name:'access',
	defines:{
		all:{ doc:`A dummy value that serves as a temporary placeholder for 'all{}'.` },



		access:{
			doc:`Performs an access.
				Eventually, it should watch the evaluation of an expression to make a journal out of its actual accesses, to ensure linearizability. For now, it only exists to read/write.`,
			call(at) { fail('access must be overriden for now') },

			none:{ doc:`No value.`, def() { return concept.none } },

			write:{
				doc:`Represents a key/value pair in a container; when accessed, turns a read into a write. Containers exist to store writes.`,
				call(key, value) {
					return { k: key, v: value, def: over.write }
				},
			},

			part:{
				doc:`Represents a part of a container. Will read (key => write(key, value); use access to extract the value itself) or write (re-defining further reads, returning the new container) appropriately.`,
				call(of, at) { fail('part must be overriden') },
			},

			keys:{
				doc:`Represents the read-only container of keys in a container. Allows iteration and inspection.`,
				call(of) { fail('keys must be overriden') },
			},
		},



		tests:[
			() => { 'collection read/write'
				let o = new Map
				if (access(part(o, 'k')) !== access.none) //@o.k
					fail('collection not empty')

				if (part(o, write('k', 'v')) !== o) //o['k'→'v']
					fail('invalid result')
				if (access(part(o, 'k')) !== 'v') //@o.k
					fail('did not write')

				if (access(part(o, 'v')) !== access.none) //@o.v
					fail('wrote too much')
			},
			() => { 'collection multi-write'
				let a = new Map
				part(a, write(1, 2)) //a[1→2]
				part(a, write(3, 4)) //a[3→4]
				part(a, write(5, 6)) //a[5→6]

				let o = new Map
				access(part(o, a))
				if (access(part(o, 1)) !== 2) fail('wrong value')
				if (access(part(o, 3)) !== 4) fail('wrong value')
				if (access(part(o, 5)) !== 6) fail('wrong value')
			},
			() => access(write(1,2)) === 2,
			() => access(part(new Map, 1)) === access.none,
			() => access(part(part(new Map, write(1,2)), 1)) === 2,
			() => access(part(new Map([[1,2]]), 1)) === 2,

			() => access(part([4,5], 1)) === 5,
			() => access(new Map([[1,2], [3,4]])) instanceof Set,
			() => { 'collection multi-read'
				let o = new Map([[1,2], [3,4], [5,6]])
				let s = part(o, new Set([1,5])) //{ 1→2, 5→6 }
				if (s.size !== 2) fail('wrong size')
				if (access(part(s, 1)) !== 2) fail('wrong value')
				if (access(part(s, 3)) !== access.none) fail('wrong value')
				if (access(part(s, 5)) !== 6) fail('wrong value')
			},
		],
	},



	over:{},



	call() {

		Map.prototype.def = new Map([
			//access → create and return a set of values.
			//part → return k→v or a container if reading a set; modify and return self if writing.
			//keys → create and return a container of keys in self.
				//Can we return a Set of keys?
		])

		Set.prototype.def = new Map([
			//access → already all-values; should we fail?
			//part(Obj, Set) should fill a Map when accessed…
			//keys → return self?
				//If we do so, the only legit way to iterate becomes for-each.
					//Which must be overriden here.
		])

		Array.prototype.def = new Map([
			//A sequence… What is needed for it?
				//Same as for a collection?

			//Also, how to make the rest of overrides fall through to items?
				//Store a continuation (next in `first`) in concept.none?
					//Which would override… uh…
		])





		over.write = new Map([
			[access, w => w.v],
		])

		over.part = new Map([
			//When accessed, read the value, or write it if directed so.
		])



	},
}
