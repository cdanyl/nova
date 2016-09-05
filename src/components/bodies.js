(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.bodies;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const BODIES = Object.freeze({
		DYNAMIC : Symbol('Dynamic'),
		IMMOVABLE : Symbol('Immovable'),
		MOVABLE : Symbol('Movable')
	});

	namespace.BODIES = BODIES;

	const canMove = entity => entity.body === BODIES.DYNAMIC || entity.body === BODIES.MOVABLE;

	namespace.canMove = canMove;

	const canCollide = entity => entity.body === BODIES.DYNAMIC || entity.body === BODIES.IMMOVABLE;

	namespace.canCollide = canCollide;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Dynamic = (mass = 1, restitution = 0) => (self = {}) => {
		self.body = BODIES.DYNAMIC;

		self.mass = mass;
		self.restitution = restitution;

		// velocity is a 2d vector for the "speed" of an object
		self.vel = V.ZERO;

		// both the current acceleration and the previous acceleration are needed for verlet integration
		self.acc = V.ZERO;
		self.lastAcc = V.ZERO;

		return self;
	};

	namespace.Dynamic = Dynamic;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Immovable = (restitution = 0) => (self = {}) => {
		self.body = BODIES.IMMOVABLE;

		self.mass = Infinity;
		self.restitution = restitution;
	};

	namespace.Immovable = Immovable;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Movable = (mass = 1) => (self = {}) => {
		self.body = BODIES.MOVABLE;

		self.mass = mass;

		// velocity is a 2d vector for the "speed" of an object
		self.vel = V.ZERO;

		// both the current acceleration and the previous acceleration are needed for verlet integration
		self.acc = V.ZERO;
		self.lastAcc = V.ZERO;

		return self;
	};

	namespace.Movable = Movable;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
