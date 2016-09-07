(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.engine;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Engine = (state, update, render) => {
		const self = {};

		let tracker = null;

		const scheduleFrame = (state, lastTime = performance.now()) => {
			tracker = requestAnimationFrame(() => {
				const currentTime = performance.now();

				const dt = (currentTime - lastTime) / 1000;

				const newState = update(state, dt * 0.5);

				render(newState, 1);

				scheduleFrame(newState, currentTime);
			});
		};

		self.start = () => {
			scheduleFrame(state);
		};

		self.stop = () => {
			cancelAnimationFrame(tracker);
		};

		return self;
	};

	namespace.Engine = Engine;

	const CruiseControl = (state, update, render, timestep = 1 / 60, maximum = 1 / 15) => {
		const self = {};

		let tracker = null;

		const scheduleFrame = (state, lastTime = performance.now(), lastAccumulator = 0) => {
			tracker = requestAnimationFrame(() => {
				const currentTime = performance.now();

				// calculate the change in time
				const dt = (currentTime - lastTime) / 1000;

				// increase the update accumulator by the change in time
				// the change is capped out so that updating doesn't become too slow
				let accumulator = lastAccumulator + Math.min(dt, maximum);

				let newState = state;

				// update while there are timesteps remaining in the accumulator
				while (accumulator >= timestep) {
					// drain the accumulator
					accumulator -= timestep;

					// update the state
					newState = update(newState, timestep);
				}

				// render the state
				// the second parameter, alpha, is used for interpolation
				render(newState, 1 - accumulator / dt);

				// schedule the next frame
				scheduleFrame(newState, currentTime, accumulator);
			});
		};

		self.start = () => {
			scheduleFrame(state);
		};

		self.stop = () => {
			cancelAnimationFrame(tracker);
		};

		return self;
	};

	namespace.CruiseControl = CruiseControl;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
