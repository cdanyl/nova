const nova = {
	shared: {
		higherOrder: {},
		math: {},
		pipe: {},
	},

	components: {
		shapes: {},
		bodies: {},
		appearances: {},
		misc: {}
	},

	core: {
		engine: {},
		update: {},
		render: {},
		state: {}
	},

	utils: {
		input: {},
		assets: {},
		misc: {}
	}
};

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.higherOrder;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const id = (value) => value;

	namespace.id = id;

	const constant = (value) => (_) => value;

	namespace.constant = constant;

	const compose = (fn1, fn2) => (value) => fn1(fn2(value));

	namespace.compose = compose;

	const chain = (fns) => fns.reduce(compose, id);

	namespace.chain = chain;

	const composeP1 = (fn1, fn2) => (value, ...args) => fn1(fn2(value, ...args), ...args);

	namespace.composeP1 = composeP1;

	const chainP1 = (fns) => fns.reduce(composeP1, id);

	namespace.chainP1 = chainP1;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const TAU = 6.283185307179586;

	namespace.TAU = TAU;

	const PI = TAU / 2;

	namespace.PI = PI;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const degrees = (radians) => radians / TAU * 360;

	namespace.degrees = degrees;

	const radians = (degrees) => degrees / 360 * TAU;

	namespace.radians = radians;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const randomRGB = () => {
		const r = Math.floor(randomBetween(0, 255 + 1));
		const g = Math.floor(randomBetween(0, 255 + 1));
		const b = Math.floor(randomBetween(0, 255 + 1));

		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	};

	namespace.randomRGB = randomRGB;

	const randomBetween = (min, max) => {
		return (Math.random() * (max - min)) + min;
	};

	namespace.randomBetween = randomBetween;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const snap = (number, multiple) => Math.floor(number / multiple) * multiple;

	namespace.snap = snap;

	const clamp = (number, min, max) => number < min ? min : number > max ? max : number;

	namespace.clamp = clamp;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const ORD = Object.freeze({
		GT : 1,
		EQ : 0,
		LT : -1
	});

	namespace.ORD = ORD;

	const compare = (x, y) => x > y ? ORD.GT : x < y ? ORD.LT : ORD.EQ;

	namespace.compare = compare;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const combinations = (array) => {
		const result = [];

		for (let i = 0, length = array.length; i < length; i += 1) {
			const a = array[i];

			for (let j = i + 1; j < length; j += 1) {
				const b = array[j];

				result.push([a, b]);
			}
		}

		return result;
	};

	namespace.combinations = combinations;

	const combinationsBetween = (array1, array2) => {
		const result = [];

		for (let i = 0, length1 = array1.length; i < length1; i += 1) {
			const a = array1[i];

			for (let j = 0, length2 = array2.length; j < length2; j += 1) {
				const b = array[j];

				result.push([a, b]);
			}
		}

		return result;
	};

	namespace.combinationsBetween = combinationsBetween;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const V = (x = 0, y = 0) => ({x, y});

	// adds two vectors without changing the originals
	V.add = ({x : x1, y : y1}, {x : x2, y : y2}) => V(x1 + x2, y1 + y2);

	// subtracts two vectors without changing the originals
	V.sub = ({x : x1, y : y1}, {x : x2, y : y2}) => V(x1 - x2, y1 - y2);

	// multiplies a vector by a scalar without changing the original
	V.mul = ({x, y}, scalar) => V(x * scalar, y * scalar);

	// divides a vector by a scalar without changing the original
	V.div = ({x, y}, scalar) => V(x / scalar, y / scalar);

	// negates a vector so it faces the opposite direction
	V.negate = ({x, y}) => V(-x, -y);

	// calculates the magnitude (length)
	V.magnitude = ({x, y}) => Math.sqrt(x * x + y * y);

	// calculates the magnitude squared (faster for comparisons)
	V.squareMagnitude = ({x, y}) => x * x + y * y;

	// normal finds the unit vector that points the same direction
	V.normal = (vector) => V.div(vector, V.magnitude(vector));

	// determines the area that the vector covers
	V.area = ({x, y}) => x * y;

	// calculates the dot product with another vector
	V.dot = ({x : x1, y : y1}, {x : x2, y : y2}) => x1 * x2 + y1 * y2;

	// rotates a vector clockwise by an angle
	V.rotate = ({x, y}, theta) => {
		const sx = Math.cos(theta);
		const sy = Math.sin(theta);

		return V(x * sx - y * sy, x * sy + y * sx);
	};

	// creates an identical clone of this vector
	V.clone = ({x, y}) => V(x, y);

	// creates a vector from polar coordinates
	V.polar = (theta, magnitude) => V(Math.cos(theta) * magnitude, Math.sin(theta) * magnitude);

	// 2d zero vector
	V.ZERO = V(0, 0);

	namespace.V = V;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.pipe;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const asap = (fn) => {
		setTimeout(fn, 0);
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const P = () => {
		const self = {};

		self.listeners = [];
		self.queue = [];
		self.open = true;

		self.open = () => P.open(self);
		self.close = () => P.close(self);
		self.read = (fn) => P.read(fn, self);
		self.write = (value) => P.write(value, self);
		self.flush = () => P.flush(self);
		self.drain = (pipe) => P.drain(self, pipe);
		self.map = (fn) => P.map(fn, self);
		self.filter = (fn) => P.filter(fn, self);
		self.flatten = () => P.flatten(self);
		self.flatMap = (fn) => P.flatMap(fn, self);
		self.foldp = (fn, init) => P.foldp(fn, init, self);

		return self;
	};

	P.open = (pipe) => {
		pipe.open = true;

		return pipe;
	};

	P.close = (pipe) => {
		pipe.open = false;

		return pipe;
	};

	P.read = (fn, pipe) => {
		pipe.listeners.push(fn);

		return pipe;
	};

	P.write = (value, pipe) => {
		pipe.queue.push(value);

		P.flush(pipe);

		return pipe;
	};

	P.flush = (pipe) => {
		if (pipe.open) {
			for (let value of pipe.queue) {
				for (let listener of pipe.listeners) {
					listener(datum);
				}
			}

			pipe.queue.length = 0;
		}

		return pipe;
	};

	P.drain = (pipeA, pipeB) => {
		P.read((value) => P.write(value, pipeB), pipeA);

		return pipeB;
	};

	P.map = (fn, pipe) => {
		const newPipe = P();

		P.read((value) => P.write(fn(value), newPipe), pipe);

		return newPipe;
	};

	P.filter = (fn, pipe) => {
		const newPipe = P();

		P.read((value) => fn(value) ? P.write(value, newPipe) : undefined, pipe);

		return newPipe;
	};

	P.flatten = (pipe) => {
		const newPipe = P();

		P.read((subP) => P.drain(subP, newPipe), pipe);

		return newPipe;
	};

	P.flatMap = (fn, pipe) => {
		return P.flatten(P.map(fn, pipe));
	};

	P.foldp = (fn, init, pipe) => {
		const newPipe = P();

		let state = init;

		P.read(value => {
			state = fn(state, value);

			P.write(state, newPipe);
		}, newPipe);

		return newPipe;
	};

	P.fromArray = (array) => {
		const pipe = P();

		asap(() => {
			for (element of array) {
				pipe.write(element);
			}
		});

		return pipe;
	};

	P.interval = (interval) => {
		const pipe = P();

		let counter = 0;

		setInterval(() => {
			P.write(counter, pipe);

			counter += 1;
		}, interval);

		return pipe;
	};

	P.timeout = (timeout) => {
		const pipe = P();

		setTimeout(() => {
			P.write(0, pipe);
		}, timeout);

		return pipe;
	};

	namespace.P = P;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.shapes;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// the shape "enum" is used to identify primitive shapes
	const SHAPES = Object.freeze({
		BOX : Symbol('Box'),
		CIRCLE : Symbol('Circle'),
		INFINITE : Symbol('Infinite'),
		REPEATING : Symbol('Repeating')
	});

	namespace.SHAPES = SHAPES;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// box defines an AABB (axis-aligned bounding box)
	const Box = (x, y, width, height) => (self = {}) => {
		self.shape = SHAPES.BOX;

		self.pos = V(x, y);
		self.size = V(width, height);
	};

	namespace.Box = Box;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// circles are defined by a point and a radius
	const Circle = (x, y, radius) => (self = {}) => {
		self.shape = SHAPES.CIRCLE;

		self.pos = V(x, y);
		self.radius = radius;

		return self;
	};

	namespace.Circle = Circle;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Infinite = (self = {}) => {
		self.shape = SHAPES.INFINITE;

		return self;
	};

	namespace.Infinite = Infinite;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Repeating = (x, y, width, height) => (self = {}) => {
		self.shape = SHAPES.REPEATING;

		self.pos = V(x, y);
		self.size = V(width, height);

		return self;
	};

	namespace.Repeating = Repeating;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.misc;

	const {randomBetween} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// observable objects allow for decoupling of objects
	// they can be "observed", waiting for events to be triggered on them
	const Observable = (self = {}) => {
		self.isObservable = true;

		// keep a track of "observers", which listen for events on this entity
		// each entry is an event name, which holds a list of responses to that event
		const observers = {};

		// register an observer response to an event name
		self.on = (eventName, response) => {
			if (observers[eventName] === undefined) {
				observers[eventName] = [];
			}

			observers[eventName].push(response);

			return self;
		};

		// trigger all the responses to an event, using the provided arguments
		self.trigger = (eventName, args) => {
			if (observers[eventName] !== undefined) {
				for (let response of observers[eventName]) {
					response(...args);
				}
			}

			if (self[eventName] !== undefined) {
				self[eventName](...args);
			}

			return self;
		};
	};

	namespace.Observable = Observable;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Name = (name) => (self = {}) => {
		self.name = name;

		return self;
	};

	namespace.Name = Name;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Fourway = (keys, keyboard, vx, vy) => (self = {}) => {
		self.update = (dt) => {
			if (keyboard.pressed(keys.left)) {
				self.pos.x -= vx * dt;
			}

			if (keyboard.pressed(keys.up)) {
				self.pos.y -= vx * dt;
			}

			if (keyboard.pressed(keys.right)) {
				self.pos.x += vx * dt;
			}

			if (keyboard.pressed(keys.down)) {
				self.pos.y += vx * dt;
			}

			return self;
		};

		return self;
	};

	namespace.Fourway = Fourway;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Arrows = (keyboard, vx, vy) => Fourway({
		left : 37,
		up : 38,
		right : 39,
		down : 40
	}, keyboard, vx, vy);

	namespace.Arrows = Arrows;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const WASD = (keyboard, vx, vy) => Fourway({
		left : 65,
		up : 87,
		right : 68,
		down : 83
	}, keyboard, vx, vy);

	namespace.WASD = WASD;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// random boxes take a random position within boundaries
	const RandomBox = (width, height, totalWidth, totalHeight) => {
		const x = randomBetween(0, totalWidth - width);
		const y = randomBetween(0, totalHeight - height);

		return Box(x, y, width, height);
	};

	namespace.RandomBox = RandomBox;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// random circles take a random position within boundaries
	const RandomCircle = (radius, totalWidth, totalHeight) => {
		const x = randomBetween(radius, totalWidth - radius);
		const y = randomBetween(radius, totalHeight - radius);

		return Circle(x, y, radius);
	};

	namespace.RandomCircle = RandomCircle;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.engine;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Engine = (state, update, render) => {
		const self = {};

		let tracker = null;

		const scheduleFrame = (state, lastTime = performance.now()) => {
			tracker = requestAnimationFrame(() => {
				const currentTime = performance.now();

				const dt = (currentTime - lastTime) / 1000;

				const newState = update(state, dt * 0.5);

				render(newState, 1);

				scheduleFrame(newState, currentTime);
			});
		};

		self.start = () => {
			scheduleFrame(state);
		};

		self.stop = () => {
			cancelAnimationFrame(tracker);
		};

		return self;
	};

	namespace.Engine = Engine;

	const CruiseControl = (state, update, render, timestep = 1 / 60, maximum = 1 / 15) => {
		const self = {};

		let tracker = null;

		const scheduleFrame = (state, lastTime = performance.now(), lastAccumulator = 0) => {
			tracker = requestAnimationFrame(() => {
				const currentTime = performance.now();

				// calculate the change in time
				const dt = (currentTime - lastTime) / 1000;

				// increase the update accumulator by the change in time
				// the change is capped out so that updating doesn't become too slow
				let accumulator = lastAccumulator + Math.min(dt, maximum);

				let newState = state;

				// update while there are timesteps remaining in the accumulator
				while (accumulator >= timestep) {
					// drain the accumulator
					accumulator -= timestep;

					// update the state
					newState = update(newState, timestep);
				}

				// render the state
				// the second parameter, alpha, is used for interpolation
				render(newState, 1 - accumulator / dt);

				// schedule the next frame
				scheduleFrame(newState, currentTime, accumulator);
			});
		};

		self.start = () => {
			scheduleFrame(state);
		};

		self.stop = () => {
			cancelAnimationFrame(tracker);
		};

		return self;
	};

	namespace.CruiseControl = CruiseControl;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.state;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Camera = (x, y, depth = 0) => {
		const self = {};

		self.pos = V(x, y);
		self.depth = depth;

		return self;
	};

	namespace.Camera = Camera;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const State = (camera, bounds) => {
		const self = {};

		self.camera = camera;
		self.bounds = bounds;

		self.entities = [];

		// removes all entities and cleans things up
		self.clear = () => {
			// iterate each entity and trigger the remove event on observable ones
			for (let entity of self.entities) {
				if (entity.isObservable) {
					entity.trigger('remove');
				}
			}

			// clear the list of entities
			self.entities = [];

			// chain
			return self;
		};

		// adds an entity to the state
		self.add = (entity) => {
			self.entities.push(entity);

			// trigger the add event if it's observable
			if (entity.isObservable) {
				entity.trigger('add');
			}

			// chain
			return self;
		};

		// adds an entity but clears all the others first
		self.solo = (entity) => {
			// clear the state first
			self.clear();

			// add the entity
			self.add(entity);

			// chain
			return self;
		};

		return self;
	};

	namespace.State = State;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.update;

	const {SHAPES} = nova.components.shapes;
	const {BODIES, canMove} = nova.components.bodies;

	const {V, combinations, combinationsBetween} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const updater = ({integrate, collisionPairs, collision, resolve, update}) => (state, dt) => {
		const collidables = [];

		for (let entity of state.entities) {
			if (entity.body === BODIES.DYNAMIC || entity.body === BODIES.MOVABLE) {
				integrate(entity, dt);
			}

			if (entity.body === BODIES.DYNAMIC || entity.body === BODIES.IMMOVABLE) {
				collidables.push(entity);
			}
		}

		const pairs = collisionPairs(collidables);

		for (let [a, b] of pairs) {
			const hit = collision(a, b);

			if (hit !== null) {
				resolve(hit, a, b);
			}
		}

		for (let entity of state.entities) {
			update(entity, dt);
		}

		return state;
	};

	namespace.updater = updater;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const verletIntegrator = (entity, dt) => {
		// uses verlet integration to move the entity forward over a change in time
		entity.pos = V.add(entity.pos, V.mul(V.add(entity.vel, V.mul(entity.lastAcc, dt / 2)), dt));
		entity.vel = V.add(entity.vel, V.mul(V.add(entity.lastAcc, entity.acc), dt / 2));
		entity.lastAcc = V.clone(entity.acc);

		return entity;
	};

	namespace.verletIntegrator = verletIntegrator;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const bruteforcePairs = (bodies) => {
		const dynamic = [];
		const immovable = [];

		for (let entity of bodies) {
			if (entity.body === BODIES.DYNAMIC) {
				dynamic.push(entity);
			}

			else if (entity.body === BODIES.IMMOVABLE) {
				immovable.push(entity);
			}
		}

		const dynamicPairs = combinations(dynamic);
		const immovablePairs = combinationsBetween(dynamic, immovable);

		const pairs = dynamicPairs.concat(immovablePairs);

		return pairs;
	};

	namespace.bruteforcePairs = bruteforcePairs;

	const Quadtree = (x, y, width, height, depth = 1) => {
		const self = {};

		// boundary position bound vector
		self.pos = V(x, y);

		// boundary size vector
		self.size = V(width, height);

		// list of sub quadrants
		self.trees = [];

		// list of entities
		self.movableBodies = [];

		// list of immovable entities
		// this is seperate to reduce the number of collision checks
		self.immovableBodies = [];

		// maximum number of bodies per leaf before splitting
		const maxBodies = 10;

		// maximum depth of the entire quadtree hierarchy
		const maxDepth = 10;

		const getFittingQuadtree = ({pos: {x1, y1}, size: {x: w1, y: h1}}) => {
			for (let tree of self.trees) {
				let {pos: {x2, y2}, size: {x: w2, y: h2}} = tree;

				if (x1 > x2 && x1 + w1 < x2 + w2 && y1 > y2 && y1 + h1 < y2 + h2) {
					return tree;
				}
			}

			return null;
		};

		const split = () => {
			const {x: halfX, y: halfY} = self.size.over(2);
			const {x: middleX, y: middleY} = self.pos.plus(half);
			const {x: cornerX, y: cornerY} = self.pos;

			// create the subbodies in their respective locations
			const nw = Quadtree(cornerX, cornerY, halfX, halfY, depth + 1);
			const ne = Quadtree(middleX, cornerY, halfX, halfY, depth + 1);
			const sw = Quadtree(cornerX, middleY, halfX, halfY, depth + 1);
			const se = Quadtree(middleX, middleY, halfX, halfY, depth + 1);

			// add them
			self.trees.push(nw, ne, sw, se);

			// re-add entities
			const bodies = self.bodies;

			self.bodies = [];

			for (let entity of bodies) {
				self.add(entity);
			}

			// re-add immovable entities
			const immovableBodies = self.immovableBodies;

			self.immovableBodies = [];

			for (let entity of immovableBodies) {
				self.add(entity);
			}

			// chain
			return self;
		};

		self.add = (entity) => {
			const tree = getFittingQuadtree(entity);

			if (tree !== null) {
				tree.add(entity);
			}

			else {
				if (entity.immovable) {
					self.immovableBodies.push(entity);
				}

				else {
					self.movableBodies.push(entity);
				}

				if (self.movableBodies.length + self.immovableBodies.length > movableBodies && depth < maxDepth) {
					split();
				}
			}

			// chain
			return self;
		};

		self.pairs = (entity, pairs = []) => {
			pairs.push(...self.movableBodies);

			if (!entity.immovable) {
				pairs.push(...self.immovableBodies);
			}

			const fittingTree = getFittingQuadfittingTree(entity);

			if (fittingTree !== null) {
				fittingTree.pairs(entity, pairs);
			}

			else {
				for (let tree of self.trees) {
					tree.pairs(entity, pairs);
				}
			}

			// chain
			return self;
		};

		self.oldGetPairs = () => {
			const pairs = [];

			// rain is a helper function that compares a entity against all its descendants
			const rain = (entity, quadtree, pairs = []) => {
				for (let quad of quadtree.quadtrees) {
					for (let other of quad.bodies) {
						pairs.push([entity, other]);
					}

					for (let other of quad.immovableBodies) {
						pairs.push([entity, other]);
					}

					// rain recursively
					rain(entity, quad, pairs);
				}

				return pairs;
			}

			// this recursively check each entity against all the others at their level, as well as all their decendants
			const recurse = (quadtree) => {
				// iterate all movable bodies
				for (let entity of quadtree.bodies) {
					// compare against all movable bodies that come after this one
					for (let k = i + 1, max = length; k < max; k ++) {
						const other = quadtree.bodies[k];

						pairs.push([entity, other]);
					}

					// compare against immovable bodies if this one is movable
					if (entity.immovable === false) {
						for (let other of quadtree.immovableBodies) {
							pairs.push([entity, other]);
						}
					}

					// compare this entity against all its descendants
					rain(entity, quadtree);
				}

				// check each immovable entity against all its movable descendants
				for (i = 0, length = quadtree.immovableBodies.length; i < length; i ++) {
					entity = quadtree.immovableBodies[i];

					// compare this entity against all its descendants
					rain(entity, quadtree);
				}

				// recurse into sub-quadrants
				for (i = 0, length = quadtree.quadtrees.length; i < length; i ++) {
					const quad = quadtree.quadtrees[i];

					recurse(quad);
				}
			}

			// start recursion
			recurse(self);

			return pairs;
		};

		return self;
	};

	const quadtreePairs = (bodies) => {
		// the following algorithm calculates the second largest box that contains all of the bodies provided
		// this is because the bodies beyond that box are outliers, and cannot collide with anything

		// the following constiables start as far as possible from where they should end up
		// e.g, the farthest left const should start as far to the right as possible, i.e., +infinity

		// keep track of the farthest and second farthest x-pos to the left
		let minX1 = Infinity;
		let minX2 = Infinity;

		// keep track of the farthest and second farthest x-pos to the right
		let maxX1 = -Infinity;
		let maxX2 = -Infinity;

		// keep track of the farthest and second farthest x-pos to the top
		let minY1 = Infinity;
		let minY2 = Infinity;

		// keep track of the farthest and second farthest x-pos to the bottom
		let maxY1 = -Infinity;
		let maxY2 = -Infinity;

		// iterate all the bodies in the scene and calculate the second largest container
		for (let entity of bodies) {
			// move the left bounds
			if (entity.pos.x < minX1) {
				minX2 = minX1;
				minX1 = entity.pos.x;
			}

			else if (entity.pos.x < minX2) {
				minX2 = entity.pos.x;
			}

			// move the right bounds
			if (entity.pos.x + entity.size.x > maxX1) {
				maxX2 = maxX1;
				maxX1 = entity.pos.x + entity.size.x;
			}

			else if (entity.pos.x + entity.size.x > maxX2) {
				maxX2 = entity.pos.x + entity.size.x;
			}

			// move the upper bounds
			if (entity.pos.y < minY1) {
				minY2 = minY1;
				minY1 = entity.pos.y;
			}

			else if (entity.pos.y < minY2) {
				minY2 = entity.pos.y;
			}

			// move the lower bounds
			if (entity.pos.y + entity.size.y > maxY1) {
				maxY2 = maxY1;
				maxY1 = entity.pos.y + entity.size.y;
			}

			else if (entity.pos.y + entity.size.y > maxY2) {
				maxY2 = entity.pos.y + entity.size.y;
			}
		}

		// generate a new quadtree with the size calculated
		const quadtree = Quadtree(minX2, minY2, maxX2 - minX2, maxY2 - minY2);

		// iterate each entity and add them to the quadtree
		for (let entity of bodies) {
			quadtree.add(entity);
		}

		return quadtree.pairs();
	};

	namespace.quadtreePairs = quadtreePairs;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const getCollision = (a, b) => {
		// box vs box collisions
		if (a.shape === SHAPES.BOX && b.shape === SHAPES.BOX) {
			if (a.pos.x < b.pos.x + b.size.x &&
				a.pos.x + a.size.x > b.pos.x &&
				a.pos.y < b.pos.y + b.size.y &&
				a.pos.y + a.size.y > b.pos.y) {
				const min = V.sub(V.add(a.pos, a.size), b.pos);
				const max = V.sub(a.pos, V.add(b.pos, b.size));

				const hitX = Math.abs(min.x) < Math.abs(max.x) ? min.x : max.x;
				const hitY = Math.abs(min.y) < Math.abs(max.y) ? min.y : max.y;

				const hit = Math.abs(hitX) >= Math.abs(hitY) ? V(hitX, 0) : V(0, hitY);

				return hit;
			}

			return null;
		}

		// circle vs circle collisions
		if (a.shape === SHAPES.CIRCLE && b.shape === SHAPES.CIRCLE) {
			// find the difference between the circle's centers
			const difference = V.sub(b.pos, a.pos);

			// find (square) seperation between centers
			const seperationSquared = V.squareMagnitude(difference);

			// find what the (not-squared) seperation would be if both circles were touching
			const totalRadii = a.radius + b.radius;

			// check if the distance between the centers is less than the sum of the radii
			// both sides of the inequality are squared to be more efficient
			if (seperationSquared < totalRadii * totalRadii) {
				// find the actual seperation
				const seperation = Math.sqrt(seperationSquared);

				const hit = V.mul(difference, (totalRadii - seperation) / seperation);

				return hit;
			}

			return null;
		}
	};

	namespace.getCollision = getCollision;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const COLLISION_RESPONSE = Object.freeze({
		RESOLVE : Symbol('Resolve'),
		IGNORE : Symbol('Ignore')
	});

	namespace.COLLISION_RESPONSE = COLLISION_RESPONSE;

	const impulseResolver = (correctionFactor, slop) => (hit, a, b) => {
		const response1 = a.resolve !== undefined ?
			a.resolve(hit, a) : COLLISION_RESPONSE.RESOLVE;

		const response2 = b.resolve !== undefined ?
			b.resolve(hit, b) : COLLISION_RESPONSE.RESOLVE;

		if (
			response1 === COLLISION_RESPONSE.RESOLVE &&
			response2 === COLLISION_RESPONSE.RESOLVE
		) {
			// calulate the penetration depth
			const magnitude = V.magnitude(hit);

			// calculate the direction of the collision
			const normal = V.div(hit, magnitude);

			// calculate relative velocity in terms of the direction
			const normalVel = V.dot(V.sub(b.vel, a.vel), normal);

			// don't resolve if velocities are seperating
			if (normalVel <= 0) {
				// calculate inverse masses for efficiency
				const inverseMassA = 1 / a.mass;
				const inverseMassB = 1 / b.mass;

				// calculate the magnitude of the impulse
				const impulseSize = -(1 + Math.min(a.restitution, b.restitution)) * normalVel / (inverseMassA + inverseMassB);

				// calculate the impulse in the direction of the normal
				const impulse = V.mul(normal, impulseSize);

				// apply the impulse to each velocity
				a.vel = V.sub(a.vel, V.mul(impulse, inverseMassA));
				b.vel = V.add(b.vel, V.mul(impulse, inverseMassB));

				// apply positional correction
				const correction = V.mul(normal, Math.max(magnitude - slop, 0) / (inverseMassA + inverseMassB) * correctionFactor);

				a.pos = V.sub(a.pos, V.mul(correction, inverseMassA));
				b.pos = V.add(b.pos, V.mul(correction, inverseMassB));
			}
		}
	};

	namespace.impulseResolver = impulseResolver;

	const positionalResolver = (hit, a, b) => {
		a.pos = V.sub(a.pos, hit);

		// slow the corrected entity to the velocity of the other entity if it moves into the collision
		if (a.vel.x * hit.x > 0) {
			a.vel.x = b.vel.x;
		}

		if (a.vel.y * hit.y > 0) {
			a.vel.y = b.vel.y;
		}
	};

	namespace.positionalResolver = positionalResolver;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const updateChild = (entity, dt) => {
		if (entity.update !== undefined) {
			return entity.update(dt);
		}

		else {
			return entity;
		}
	};

	namespace.updateChild = updateChild;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const defaultUpdate = updater({
		integrate : verletIntegrator,
		collisionPairs : bruteforcePairs,
		collision : getCollision,
		resolve : impulseResolver(0.7, 0),
		update : updateChild
	});

	namespace.defaultUpdate = defaultUpdate;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const applyGravity = (G, METERS_PER_PIXEL) => {
		const gravityForce = (a, b) => {
			const dif = V.sub(a.pos, b.pos);

			const r = V.magnitude(dif) * METERS_PER_PIXEL;
			const m1 = a.mass;
			const m2 = b.mass;

			const force = G * m1 * m2 / (r * r);

			return V.mul(V.normal(dif), force);
		};

		return (state, dt) => {
			const movableEntities = state.entities.filter(canMove);

			for (let entity of movableEntities) {
				entity.acc = V.ZERO;
			}

			for (let [a, b] of combinations(movableEntities)) {
				const forceB = gravityForce(a, b);
				const forceA = V.negate(forceB);

				a.acc = V.add(a.acc, V.div(forceA, a.mass));
				b.acc = V.add(b.acc, V.div(forceB, b.mass));
			}

			return state;
		};
	};

	namespace.applyGravity = applyGravity;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.render;

	const {SHAPES} = nova.components.shapes;
	const {APPEARANCES, hasAppearance} = nova.components.appearances;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const cull = (ctx, camera, entity) => {
		if (entity.shape === SHAPES.INFINITE) {
			return true;
		}

		else if (entity.shape === SHAPES.REPEATING) {
			return true;
		}

		else if (entity.shape === SHAPES.BOX) {
			const {x, y} = entity.pos;
			const {x : w, y : h} = entity.size;

			const {x : cx, y : cy} = camera.pos;
			const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];

			return x + w - cx > 0 && y + h - cy > 0 && x - cx < cw && y - cy < ch;
		}

		else if (entity.shape === SHAPES.CIRCLE) {
			const {x, y} = entity.pos;
			const r = entity.radius;

			const {x : cx, y : cy} = camera.pos;
			const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];

			return x + r - cx > 0 && y + r - cy > 0 && x - r - cx < cw && y - r - cy < ch;
		}

		else {
			return false;
		}
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const render = (ctx, camera, entity) => {
		if (entity.appearance === APPEARANCES.COLOR) {
			if (entity.shape === SHAPES.BOX) {
				const pos = V.sub(entity.pos, camera.pos);

				ctx.fillStyle = entity.color;
				ctx.fillRect(pos.x, pos.y, entity.size.x, entity.size.y);
			}

			else if (entity.shape === SHAPES.CIRCLE) {
				const pos = V.sub(entity.pos, camera.pos);

				ctx.fillStyle = entity.color;
				ctx.beginPath();
				ctx.arc(pos.x, pos.y, entity.radius, 0, 2 * Math.PI);
				ctx.fill();
			}

			else if (entity.shape === SHAPES.INFINITE) {
				ctx.fillStyle = entity.color;
				ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			}
		}

		else if (entity.appearance === APPEARANCES.IMAGE) {
			if (entity.shape === SHAPES.BOX) {
				const pos = V.sub(entity.pos, camera.pos);

				ctx.drawImage(entity.image, pos.x, pos.y, self.size.x, self.size.y);
			}
		}

		else if (entity.appearance === APPEARANCES.SPRITE) {
			if (entity.shape === SHAPES.BOX) {
				const pos = V.sub(entity.pos, camera.pos);

				ctx.drawImage(
					entity.image,
					entity.clipPos.x,
					entity.clipPos.y,
					entity.clipSize.x,
					entity.clipSize.y,
					pos.x,
					pos.y,
					entity.size.x,
					entity.size.y
				);
			}
		}
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const renderer = (canvas) => {
		const ctx = canvas.getContext('2d');

		return (state, alpha) => {
			// filter out entities without an appearance or that can't be seen
			const culled = [];

			for (let entity of state.entities) {
				if (hasAppearance(entity) && cull(ctx, state.camera, entity)) {
					culled.push(entity);
				}
			}

			// sort so that farther back entities are rendered first
			const sorted = culled.sort((a, b) => b.depth - a.depth || b.layer - a.layer);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let entity of sorted) {
				render(ctx, state.camera, entity);
			}
		};
	};

	namespace.renderer = renderer;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.utils.input;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const getElementOffset = (element) => {
		const box = element.getBoundingClientRect();

		const body = document.body;
		const docElem = document.documentElement;

		const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

		const clientTop = docElem.clientTop || body.clientTop || 0;
		const clientLeft = docElem.clientLeft || body.clientLeft || 0;

		const top = box.top + scrollTop - clientTop;
		const left = box.left + scrollLeft - clientLeft;

		return {x : Math.round(left), y : Math.round(top)};
	};

	const MOUSE_STATE = Object.freeze({
		CLICKED : Symbol('Clicked'),
		CANCELLED : Symbol('Cancelled'),
		UNCLICKED : Symbol('Unclicked')
	});

	const Mouse = (stage) => {
		const self = {};

		let state = MOUSE_STATE.UNCLICKED;

		self.pos = V(0, 0);

		// checks if the mouse is in the clicked state
		self.clicked = () => {
			return state === MOUSE_STATE.CLICKED;
		};

		// cancels the click
		self.cancel = () => {
			if (state === MOUSE_STATE.CLICKED) {
				state = MOUSE_STATE.CANCELLED;
			}

			// chain
			return self;
		};

		// begins listening for mouse events
		stage.addEventListener('mousedown', () => {
			if (state !== MOUSE_STATE.CANCELLED) {
				state = MOUSE_STATE.CLICKED;
			}
		}, false);

		stage.addEventListener('mouseup', () => {
			state = MOUSE_STATE.UNCLICKED;
		}, false);

		stage.addEventListener('mousemove', (event) => {
			const offset = getElementOffset(stage);

			self.pos.x = event.clientX - offset.x;
			self.pos.y = event.clientY - offset.y;
		}, false);

		return self;
	};

	namespace.Mouse = Mouse;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const KEYS = Object.freeze({
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40
	});

	namespace.KEYS = KEYS;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const KEY_STATE = Object.freeze({
		PRESSED : Symbol('Pressed'),
		CANCELLED : Symbol('Cancelled'),
		UNPRESSED : Symbol('Unpressed')
	});

	const Keyboard = () => {
		const self = {};

		const keys = {};

		// begin listening for keyboard events
		window.addEventListener('keydown', (event) => {
			if (keys[event.keyCode] !== KEY_STATE.CANCELLED) {
				keys[event.keyCode] = KEY_STATE.PRESSED;
			}
		}, false);

		window.addEventListener('keyup', (event) => {
			keys[event.keyCode] = KEY_STATE.UNPRESSED;
		}, false);

		// checks if a key is pressed, cancels the key if specified
		self.pressed = (key) => {
			return keys[key] === KEY_STATE.PRESSED;
		};

		// cancels a key press so that a key has to be repressed
		self.cancel = (key) => {
			if (keys[key] === KEY_STATE.PRESSED) {
				keys[key] = KEY_STATE.CANCELLED;
			}

			// chain
			return self;
		};

		return self;
	};

	namespace.Keyboard = Keyboard;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.utils.assets;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for an image element from a url
	const loadImage = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create an image object
			const resource = new Image();

			// set it to fulfill the promise once loaded
			resource.onload = () => {
				fulfill(resource);
			};

			// start loading the url
			// this happens after setting the handler in case the image loads immediately
			resource.src = url;
		});
	};

	namespace.loadImage = loadImage;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for an audio media element from a url
	const loadAudioMedia = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create an audio object
			const resource = new Audio();

			// set it to fulfill the promise once loaded
			resource.oncanplay = () => {
				fulfill(resource);
			};

			// start loading the url
			// this happens after setting the handler in case the udio loads immediately
			resource.src = url;
		});
	};

	namespace.loadAudioMedia = loadAudioMedia;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a singleton web audio context
	const webAudioContext = () => {
		// create the singleton, if it doesn't exist
		if (webAudioContext.singleton === undefined) {
			webAudioContext.singleton = (
				window.AudioContext !== undefined ? new window.AudioContext() :
				window.WebkitAudioContext !== undefined ? new window.WebkitAudioContext() : null
			)
		}

		return webAudioContext.singleton;
	};

	// creates a promise for an audio buffer from a url
	const loadAudioBuffer = (url) => {
		// defer loading to load audio media if web audio is not implemented
		if (webAudioContext() === null) {
			return ;
		}

		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			const request = new XMLHttpRequest();
			request.open('GET', url, true);
			request.responseType = 'arraybuffer';

			request.onload = () => {
				webAudioContext().decodeAudioData(request.response, (buffer) => {
					if (!buffer) {
						reject(new Error('Error decoding file data: ' + url));

						return;
					}

					fulfill(buffer);
				}, (error) => {
					reject(error);
				});
			};

			request.onerror = () => {
				reject('Audio failed to load.');
			};

			request.send();
		});
	};

	namespace.loadAudioBuffer = loadAudioBuffer;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for json data
	const loadJSON = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create object
			const httpRequest = new XMLHttpRequest();

			// load
			httpRequest.onreadystatechange = () => {
				if (httpRequest.readyState === 4 && httpRequest.status === 200) {
					fulfill(JSON.parse(self.responseText));
				}
			};

			httpRequest.open('GET', url);
			httpRequest.send();
		});
	};

	namespace.loadJSON = loadJSON;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// creates a promise for an external script
	const loadScript = (url) => {
		// generate a promise wrapper
		return new Promise((fulfill, reject) => {
			// create object
			const resource = document.createElement('script');

			// load
			resource.onload = resource.onreadystatechange = () => {
				if (!self.readyState || self.readyState == 'compconste') {
					fulfill(resource);
				}
			};

			resource.src = url;

			// add to head
			document.getElementsByTagName('head')[0].appendChild(resource);
		});
	};

	namespace.loadScript = loadScript;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// maps file extensions to the appropriate loader to use for that extension
	const extensions = {
		jpg : loadImage,
		png : loadImage,
		bmp : loadImage,

		mp3 : loadAudioMedia,
		ogg : loadAudioMedia,
		wav : loadAudioMedia,

		json : loadJSON,

		js : loadScript
	};

	// a general loader that loads things based on file extensions
	const load = (url) => {
		// figure out the file extension
		const extension = url.match(/(?:\.([^.]+))?$/)[1];

		// dynamically choose which asset loader to use based on the file extension
		const loader = extensions[extension];

		// load the url if the loader for that extention exists
		// otherwise, return a rejected promise with an error message
		return loader !== undefined ? loader(url) : Promise.reject(Error('Unknown extension "' + extension + '".'));
	};

	namespace.load = load;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// entries creates a list of key value pairs from an object
	const entries = (object) => {
		const result = [];

		for (let key of Object.keys(object)) {
			result.push([key, object[key]]);
		}

		return result;
	};

	// loads a set of named assets
	const loadAll = (assetMap) => {
		// this will store all of the assets once they've loaded
		const loadedAssets = {};

		// map each entry into a promise using the general loader
		// make the URL's relative to the base URL
		// create a promise that waits for each asset to load
		return Promise.all(entries(assetMap).map(([name, url]) => load(url).then((asset) => {
			// attach the asset to the set of loaded assets
			loadedAssets[name] = asset;
		}))).then(() => {
			return loadedAssets;
		});
	};

	namespace.loadAll = loadAll;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();

(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.utils.misc;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// intervals run a function at a given interval
	const interval = (int, timer = 0) => {
		const self = {};

		self.progress = function (dt, callback) {
			timer += dt;

			while (timer >= int) {
				timer -= int;

				callback();
			}
		};

		return self;
	};

	namespace.interval = interval;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// loading and saving helpers
	const loadData = (key, defaultValue) => {
		const value = localStorage.getItem(key);

		return value !== null ? value : defaultValue;
	};

	namespace.loadData = loadData;

	const saveData = (key, value) => localStorage.setItem(key, value);

	namespace.saveData = saveData;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
