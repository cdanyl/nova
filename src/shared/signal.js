(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.signal;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const asap = (fn) => {
		setTimeout(fn, 0);
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const S = () => {
		const self = {};

		self.listeners = [];
		self.queue = [];
		self.isOpen = true;

		self.open = () => S.open(self);
		self.close = () => S.close(self);
		self.each = (fn) => S.each(fn, self);
		self.write = (value) => S.write(value, self);
		self.pipe = (signal) => S.pipe(self, signal);
		self.map = (fn) => S.map(fn, self);
		self.filter = (fn) => S.filter(fn, self);
		self.flatten = () => S.flatten(self);
		self.flatMap = (fn) => S.flatMap(fn, self);
		self.scan = (fn, init) => S.scan(fn, init, self);

		return self;
	};

	S.open = (signal) => {
		signal.isOpen = true;

		return signal;
	};

	S.close = (signal) => {
		signal.isOpen = false;

		return signal;
	};

	S.each = (fn, signal) => {
		signal.listeners.push(fn);

		return signal;
	};

	S.write = (value, signal) => {
		if (signal.isOpen) {
			for (let listener of signal.listeners) {
				listener(value);
			}
		}

		return signal;
	};

	S.pipe = (signalA, signalB) => {
		S.each((value) => S.write(value, signalB), signalA);

		return signalB;
	};

	S.map = (fn, signal) => {
		const newSignal = S();

		S.each((value) => S.write(fn(value), newSignal), signal);

		return newSignal;
	};

	S.filter = (fn, signal) => {
		const newSignal = S();

		S.each((value) => fn(value) ? S.write(value, newSignal) : undefined, signal);

		return newSignal;
	};

	S.flatten = (signal) => {
		const newSignal = S();

		S.each((subP) => S.pipe(subP, newSignal), signal);

		return newSignal;
	};

	S.flatMap = (fn, signal) => {
		return S.flatten(S.map(fn, signal));
	};

	S.scan = (fn, init, signal) => {
		const newSignal = S();

		let accumulator = init;

		S.each(value => {
			accumulator = fn(accumulator, value);

			S.write(accumulator, newSignal);
		}, signal);

		return newSignal;
	};

	S.fromArray = (array) => {
		const signal = S();

		asap(() => {
			for (let element of array) {
				signal.write(element);
			}
		});

		return signal;
	};

	S.interval = (interval) => {
		const signal = S();

		let counter = 0;

		setInterval(() => {
			S.write(counter, signal);

			counter += 1;
		}, interval);

		return signal;
	};

	S.timeout = (timeout) => {
		const signal = S();

		setTimeout(() => {
			S.write(0, signal);
		}, timeout);

		return signal;
	};

	namespace.S = S;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
