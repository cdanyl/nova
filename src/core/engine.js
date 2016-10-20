(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.engine;

	const {S} = nova.shared.signal;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const frames = () => {
		const signal = S();

		const scheduleFrame = (lastTime) => {
			requestAnimationFrame(() => {
				const currentTime = window.performance.now();

				const dt = (currentTime - lastTime) / 1000;

				S.write(dt, signal);

				scheduleFrame(currentTime);
			});
		};

		scheduleFrame(window.performance.now());

		return signal;
	};

	namespace.frames = frames;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
