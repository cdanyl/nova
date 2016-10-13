(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.state;

	const {V} = nova.shared.math;

	const {Infinite} = nova.components.shapes;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Camera = (pos, depth = 0) => ({pos, depth});

	namespace.Camera = Camera;

	const centerCamera = (canvas) => Camera(V(-canvas.width / 2, -canvas.height / 2));

	namespace.centerCamera = centerCamera;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const State = (camera, bounds, entities) => ({camera, bounds, entities});

	namespace.State = State;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
