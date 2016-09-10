const game = {};

(() => {
	'use strict';

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = game;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const {compose, chain, composeP1, chainP1} = nova.shared.higherOrder;

	const {Color} = nova.components.appearances;
	const {Box, Circle, Infinite} = nova.components.shapes;
	const {Movable, Dynamic} = nova.components.bodies;
	const {Name, Arrows, WASD} = nova.components.misc;

	const {V, radians, choose} = nova.shared.math;

	const {Engine, CruiseControl} = nova.core.engine;
	const {Camera, State} = nova.core.state;
	const {defaultUpdate, applyGravity, COLLISION_RESPONSE} = nova.core.update;
	const {renderer} = nova.core.render;

	const {Mouse, Keyboard, KEYS} = nova.utils.input;
	const {loadAll} = nova.utils.assets;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	loadAll({}).then((assets) => {
		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const canvas = document.getElementById('canvas');
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		namespace.canvas = canvas;

		const mouse = Mouse(canvas);

		namespace.mouse = mouse;

		const keyboard = Keyboard();

		namespace.keyboard = keyboard;

		const state = State(
			Camera(-canvas.width / 2, -canvas.height / 2),
			Infinite()
		);

		namespace.state = state;

		const update = defaultUpdate;
		const render = renderer(canvas);

		const engine = CruiseControl(state, update, render, 1 / 200);

		namespace.engine = engine;

        const PIXELS_PER_METER = 200;

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const Background = chain([
			Color('rgb(240, 240, 240)'),
			Infinite
		]);

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const nameTag = (text) => {
			const nameTags = document.getElementById('name-tags');

			const newElement = document.createElement('span');

			newElement.className = "name-tag";
			newElement.innerHTML = text;

			nameTags.appendChild(newElement);

			return newElement;
		};

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const Wall = (x) => (self = {}) => {
            
		};

        // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        const Ball = (mass, x, vx) => (self = {}) => {
            Color('blue')(self);
            Circle(x, 0, 20)(self);
            Dynamic(mass, 1)(self);

            self.vel = V(vx, 0);

            const myNameTag = nameTag(name);

			self.update = (dt) => {
				myNameTag.style.left = (self.pos.x - state.camera.pos.x + self.radius) + 'px';
				myNameTag.style.top = (self.pos.y - state.camera.pos.y + self.radius) + 'px';

                myNameTag.innerHTML = V.magnitude(self.vel).toFixed(2) + 'm/s<br />' + self.mass + 'kg';
			};

            return self;
        };

        const Ball1 = Ball(2, -1.5 * PIXELS_PER_METER, 0.8 * PIXELS_PER_METER);
        const Ball2 = Ball(1, 1.5 * PIXELS_PER_METER, -0.8 * PIXELS_PER_METER);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		state.add(Background());
		state.add(Ball1());
		state.add(Ball2());

		engine.start();

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
	});

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
