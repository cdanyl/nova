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

	loadAll({
		background: '/tests/planets/assets/images/rocket.png'
	}).then((assets) => {
		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const canvas = document.getElementById('canvas');
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		namespace.canvas = canvas;

		const state = State(
			Camera(-canvas.width / 2, -canvas.height / 2),
			Infinite()
		);

		namespace.state = state;

		const G = 1.00E-23;
		const KM_PER_PIXEL = 5000;

		const update = composeP1(defaultUpdate, applyGravity(G));
		const render = renderer(canvas);

		const engine = CruiseControl(state, update, render, 1 / 1000);

		namespace.engine = engine;

		const mouse = Mouse(canvas);

		namespace.mouse = mouse;

		const keyboard = Keyboard();

		namespace.keyboard = keyboard;

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const Background = chain([
			Color('rgb(5, 5, 5)'),
			Infinite
		]);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const Controls = (self = {}) => {
			const vel = 200;

			self.update = (dt) => {
				if (keyboard.pressed(KEYS.LEFT)) {
					state.camera.pos.x -= vel * dt
				}

				if (keyboard.pressed(KEYS.UP)) {
					state.camera.pos.y -= vel * dt
				}

				if (keyboard.pressed(KEYS.RIGHT)) {
					state.camera.pos.x += vel * dt
				}

				if (keyboard.pressed(KEYS.DOWN)) {
					state.camera.pos.y += vel * dt
				}

				return self;
			};

			return self;
		};

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

		const Planet = ({planetMass, sunMass, distance, angle, radius, color, name}) => (self = {}) => {
			const pos = V.polar(radians(angle), distance);

			Circle(pos.x, pos.y, radius)(self);

			const v = Math.sqrt(G * sunMass / distance) * 0.6;

			const direction = V.normal(pos);
			const vDirection = V.rotate(direction, radians(choose([-90, 90])));

			Dynamic(planetMass, 1.3)(self);

			self.vel = V.mul(vDirection, v);

			Color('white')(self);

			const planetNameTag = nameTag(name);

			self.update = (dt) => {
				planetNameTag.style.left = (self.pos.x - state.camera.pos.x + self.radius) + 'px';
				planetNameTag.style.top = (self.pos.y - state.camera.pos.y + self.radius) + 'px';
			};

			return self;
		};

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const sunMass = 1.99E30;

		const Sun = chain([
			WASD(keyboard, 150, 150),
			Dynamic(sunMass),
			Color('rgb(255, 140, 30)'),
			Circle(0, 0, 695700 / KM_PER_PIXEL),
		]);

		const Mercury = Planet({
			sunMass: sunMass,
			planetMass: 3.29E23,
			distance: 900000 / KM_PER_PIXEL,
			angle: 0,
			radius: 2440 / KM_PER_PIXEL,
			color: 'rgb(177, 95, 21)',
			name: 'Mercury',
		});

		const Venus = Planet({
			sunMass: sunMass,
			planetMass: 4.87E24,
			distance: 1050000 / KM_PER_PIXEL,
			angle: 90,
			radius: 6052 / KM_PER_PIXEL,
			color: 'rgb(157, 29, 4)',
			name: 'Venus',
		});

		const Earth = Planet({
			sunMass: sunMass,
			planetMass: 5.97E24,
			distance: 1200000 / KM_PER_PIXEL,
			angle: 180,
			radius: 6370 / KM_PER_PIXEL,
			color: 'rgb(33, 37, 98)',
			name: 'Earth',
		});

		const Mars = Planet({
			sunMass: sunMass,
			planetMass: 6.39E23,
			distance: 1350000 / KM_PER_PIXEL,
			angle: 270,
			radius: 3390 / KM_PER_PIXEL,
			color: 'rgb(251, 118, 51)',
			name: 'Mars',
		});

		const Jupiter = Planet({
			sunMass: sunMass,
			planetMass: 1.90E27,
			distance: 1500000 / KM_PER_PIXEL,
			angle: 45,
			radius: 69911 / KM_PER_PIXEL,
			color: 'rgb(235, 236, 228)',
			name: 'Jupiter',
		});

		const Saturn = Planet({
			sunMass: sunMass,
			planetMass: 5.68E26,
			distance: 1650000 / KM_PER_PIXEL,
			angle: 135,
			radius: 58232 / KM_PER_PIXEL,
			color: 'rgb(250, 204, 135)',
			name: 'Saturn',
		});

		const Uranus = Planet({
			sunMass: sunMass,
			planetMass: 8.68E25,
			distance: 1800000 / KM_PER_PIXEL,
			angle: 225,
			radius: 25362 / KM_PER_PIXEL,
			color: 'rgb(148, 228, 232)',
			name: 'Uranus',
		});

		const Neptune = Planet({
			sunMass: sunMass,
			planetMass: 1.02E26,
			distance: 1950000 / KM_PER_PIXEL,
			angle: 315,
			radius: 24622 / KM_PER_PIXEL,
			color: 'rgb(62, 90, 233)',
			name: 'Neptune',
		});

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const ResetButton = (self = {}) => {
			const normalColor = 'rgba(255, 255, 255, 0.25)';
			const hoverColor = 'rgba(255, 255, 255, 0.15)';

			Color(normalColor)(self);
			Circle(0, 0, 40)(self);

			self.update = (dt) => {
				const dist = V.squareMagnitude(V.sub(mouse.pos, self.pos));

				if (dist < self.radius * self.radius) {
					self.color = hoverColor;
				}

				else {
					self.color = normalColor;
				}

				return self;
			};

			return self;
		};

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		state.add(Background());
		state.add(Sun());
		state.add(Mercury());
		state.add(Venus());
		state.add(Earth());
		state.add(Mars());
		state.add(Jupiter());
		state.add(Saturn());
		state.add(Uranus());
		state.add(Neptune());

		state.add(Controls());

		engine.start();

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
	});

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
