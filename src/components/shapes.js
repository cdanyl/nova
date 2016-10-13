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

		return self;
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
