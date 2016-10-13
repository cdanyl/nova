(() => {
	'use strict';

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const {compose, chain, composeP1, chainP1} = nova.shared.higherOrder;

	const {Color} = nova.components.appearances;
	const {Box, Circle, Infinite} = nova.components.shapes;
	const {Movable, Dynamic} = nova.components.bodies;
	const {InheritMethods, Name, Arrows, WASD} = nova.components.misc;

	const {V, radians, choose} = nova.shared.math;
	const {S} = nova.shared.signal;

	const {frames} = nova.core.engine;
	const {State, centerCamera} = nova.core.state;
	const {defaultUpdate} = nova.core.update;
	const {renderer} = nova.core.render;

	const {Mouse, Keyboard, KEY_CODES} = nova.utils.input;
	const {loadAll} = nova.utils.assets;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	loadAll({}).then((assets) => {
		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const canvas = document.getElementById('canvas');
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		const mouse = Mouse(canvas);
		const keyboard = Keyboard();

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const RedBoxMethods = {};

		RedBoxMethods.update = function (dt) {
			return RedBox(this.pos.x + dt * 50, this.pos.y);
		};

		const RedBox = (x, y) => chain([
			Color('red'),
			Circle(x, y, 10),
			InheritMethods(RedBoxMethods)
		])();

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const initialState = () => State(centerCamera(canvas), Infinite(), [
			RedBox(0, 0)
		]);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const state = initialState();
		const update = defaultUpdate;
		const render = renderer(canvas);

		return frames().scan(update, state).each(render);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
	});
})();
