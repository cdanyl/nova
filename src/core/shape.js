(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.shape

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// the shape "enum" is used to identify primitive shapes
	const SHAPES = Object.freeze({
		SHAPELESS : Symbol('Shapeless'),
		BOX : Symbol('Box'),
		CIRCLE : Symbol('Circle'),
		INFINITE : Symbol('Infinite'),
		REPEATING : Symbol('Repeating')
	});

	namespace.SHAPES = SHAPES;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Shapeless = {
		type : SHAPES.SHAPELESS
	};

	namespace.Shapeless = Shapeless;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// box defines an AABB (axis-aligned bounding box)
	const Box = (pos, size) => ({
		type : SHAPES.BOX,
		pos,
		size
	});

	namespace.Box = Box;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// circles are defined by a point and a radius
	const Circle = (pos, radius) => ({
		type : SHAPES.CIRCLE,
		pos,
		radius
	});

	namespace.Circle = Circle;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Infinite = {
		type : SHAPES.INFINITE
	};

	namespace.Infinite = Infinite;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Repeating = (pos, size) => ({
		type : SHAPES.REPEATING,
		pos,
		size
	});

	namespace.Repeating = Repeating;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
