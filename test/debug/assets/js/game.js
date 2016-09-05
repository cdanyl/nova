const game = {};

(() => {
    'use strict';

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const namespace = game;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const {compose, chain, composeP1, chainP1} = nova.shared.higherOrder;

    const {Color} = nova.components.appearances;
    const {Box, Circle} = nova.components.shapes;
    const {Dynamic} = nova.components.bodies;
    const {Name} = nova.components.misc;

    const {V} = nova.shared.math;

    const {Engine} = nova.core.engine;
    const {State} = nova.core.state;
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

        const state = State();

        namespace.state = state;

        const G = 6.67E-11 * 0.12;
        const METERS_PER_PIXEL = 500000;

        const camera = V(-canvas.width / 2, -canvas.height / 2);

        const update = composeP1(defaultUpdate, applyGravity(G, METERS_PER_PIXEL));
        const render = renderer(canvas, camera);

        const engine = Engine(state, update, render);

        namespace.engine = engine;

        const mouse = Mouse(canvas);

        namespace.mouse = mouse;

        const keyboard = Keyboard();

        namespace.keyboard = keyboard;

    	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        const Background = chain([
            Color('rgb(0, 0, 30)'),
            Box(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
        ]);

    	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        const Controls = (self = {}) => {
            const vel = 200;

            self.update = (dt) => {
                if (keyboard.pressed(KEYS.LEFT)) {
                    camera.x -= vel * dt
                }

                if (keyboard.pressed(KEYS.UP)) {
                    camera.y -= vel * dt
                }

                if (keyboard.pressed(KEYS.RIGHT)) {
                    camera.x += vel * dt
                }

                if (keyboard.pressed(KEYS.DOWN)) {
                    camera.y += vel * dt
                }

                return self;
            };

            return self;
        };

    	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        const PlanetaryBody = (vx, vy) => (self = {}) => {
            self.vel = V(vx, vy);

            self.resolve = (hit, other) => {
                return COLLISION_RESPONSE.IGNORE;
            };

            return self;
        };

        const Sun = chain([
            PlanetaryBody(50, 0),
            Dynamic(1.99E30),
            Color('rgb(255, 230, 100)'),
            Circle(0, 0, 40)
        ]);

        const Mercury = chain([
            PlanetaryBody(700, 0),
            Dynamic(3.29E23),
            Color('grey'),
            Circle(0, -100, 5)
        ]);

        const Venus = chain([
            PlanetaryBody(650, 0),
            Dynamic(3.29E23),
            Color('brown'),
            Circle(0, -133, 14)
        ]);

        const Earth = chain([
            PlanetaryBody(600, 0),
            Dynamic(5.97E24),
            Color('blue'),
            Circle(0, -167, 15)
        ]);

        const Mars = chain([
            PlanetaryBody(550, 0),
            Dynamic(3.29E23),
            Color('orange'),
            Circle(0, -200, 8)
        ]);

    	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

        state.add(Background());
        state.add(Sun());
        state.add(Mercury());
        state.add(Venus());
        state.add(Earth());
        state.add(Mars());

        state.add(Controls());

        engine.start();

    	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
    });

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
