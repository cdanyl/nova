(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.body;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const BODIES = Object.freeze({
		BODILESS : Symbol('Bodiless'),
		DYNAMIC : Symbol('Dynamic'),
		IMMOVABLE : Symbol('Immovable'),
		MOVABLE : Symbol('Movable')
	});

	namespace.BODIES = BODIES;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Dynamic = (
		mass,
		restitution,
		vel = V.ZERO,
		acc = V.ZERO,
		lastAcc = V.ZERO,
	) => ({
		type : BODIES.DYNAMIC,
		mass,
		restitution,
		vel,
		acc,
		lastAcc
	});

	namespace.Dynamic = Dynamic;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Immovable = (restitution) => ({
		type : BODIES.DYNAMIC,
		restitution
	});

	namespace.Immovable = Immovable;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Dynamic = (mass, vel = V.ZERO, acc = V.ZERO, lastAcc = V.ZERO) => ({
		type : BODIES.DYNAMIC,
		mass,
		vel,
		acc,
		lastAcc
	});

	namespace.Movable = Movable;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
