(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.shapes;

    const {V, randomBetween} = nova.shared.math;

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

		// interpolates the position between now and the last frame
		self.lerp = (alpha) => {
			// check if it's the first time lerping
			if (self.prev === undefined) {
				// set up lerping for the next frame
				self.prev = self.pos.clone();

				return self.pos.clone();
			}

			// calculate interpolated position
			const pos = (self.pos.minus(self.prev)).times(alpha).plus(self.prev);

			// store previous position
			self.prev = self.pos.clone();

			return pos;
		};

		return self;
	};

	namespace.Box = Box;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// circles are defined by a point and a radius
	const Circle = (x, y, radius) => (self = {}) => {
		self.shape = SHAPES.CIRCLE;

		self.pos = V(x, y);
		self.radius = radius;

		// interpolates the position between now and the last frame
		self.lerp = (alpha) => {
			// check if it's the first time lerping
			if (self.prev === undefined) {
				// set up lerping for the next frame
				self.prev = self.pos.clone();

				return self.pos.clone();
			}

			// calculate interpolated position
			const pos = (self.pos.minus(self.prev)).times(alpha).plus(self.prev);

			// store previous position
			self.prev = self.pos.clone();

			return pos;
		};

		return self;
	};

	namespace.Circle = Circle;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Infinite = (self = {}) => {
		self.shape = SHAPES.INFINITE;
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Repeating = (x, y, width, height) => (self = {}) => {
		self.shape = SHAPES.REPEATING;

		self.pos = V(x, y);
		self.size = V(width, height);
	};

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
