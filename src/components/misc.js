(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.misc;

	const {composeP1} = nova.shared.higherOrder;
	const {randomBetween} = nova.shared.math;

	const {Box, Circle} = nova.components.shapes;

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

	const Inherit = (proto) => (self = {}) => Object.create(proto);

	namespace.Inherit = Inherit;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const InheritMethods = (proto) => (self = {}) => {
		for (let key of Object.keys(proto)) {
			self[key] = proto[key].bind(self);
		}

		return self;
	};

	namespace.InheritMethods = InheritMethods;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
