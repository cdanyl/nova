(() => {
	'use strict';

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const {compose, chain, composeP1, chainP1} = nova.shared.higherOrder;

	const {Color, Custom} = nova.components.appearances;
	const {Box, Circle, Infinite} = nova.components.shapes;
	const {Movable, Dynamic} = nova.components.bodies;
	const {Name, Arrows, WASD} = nova.components.misc;

	const {V, radians, choose} = nova.shared.math;
	const {S} = nova.shared.signal;

	const {fixedFPS} = nova.core.engine;
	const {centerCamera, State} = nova.core.state;
	const {defaultUpdate, fixTimestep, applyGravity, COLLISION_RESPONSE} = nova.core.update;
	const {renderer} = nova.core.render;

	const {Mouse, Keyboard, KEYS} = nova.utils.input;
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

		const MomentumGraph = (object, x, y) => (self = {}) => {
			const xScale = 40;
			const yScale = 1 / 5;

			const xMax = 5;

			const points = [];

			let time = 0;

			self.update = (dt) => {
				time += dt;

				if (time < xMax) {
					const xMomentum = object.vel.x * object.mass;

					points.push([time, xMomentum]);
				}

				return self;
			};

			self.render = (ctx, camera) => {
				ctx.strokeStyle = 'rgb(200, 200, 200)';

				ctx.beginPath();

				ctx.lineTo(x - camera.pos.x, y - camera.pos.y);
				ctx.lineTo(x - camera.pos.x + xMax * xScale, y - camera.pos.y);

				ctx.stroke();

				ctx.strokeStyle = 'rgb(30, 30, 30)';

				ctx.beginPath();

				for (let [time, momentum] of points) {
					ctx.lineTo(time * xScale + x - camera.pos.x, momentum * yScale + y - camera.pos.y);
				}

				ctx.stroke();

				return ctx;
			};

			return self;
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

				return self;
			};

			return self;
		};

		const Ball1 = Ball(2, -1.5 * PIXELS_PER_METER, 0.8 * PIXELS_PER_METER);
		const Ball2 = Ball(1, 1.5 * PIXELS_PER_METER, -0.8 * PIXELS_PER_METER);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const initialState = () => {
			const ball1 = Ball1();
			const ball2 = Ball2();

			const graph1 = MomentumGraph(ball1, -200, -200)();
			const graph2 = MomentumGraph(ball2, 200, -200)();

			const state = State(centerCamera(canvas), Infinite(), [
				Background(),

				ball1,
				ball2,
				graph1,
				graph2
			]);

			return state;
		};

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const state = initialState();
		const update = fixTimestep(defaultUpdate, 1 / 200, 1 / 15);
		const render = renderer(canvas);

		return fixedFPS().scan(update, state).each(render);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
	});

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
