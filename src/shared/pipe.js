(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.pipe;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const asap = (fn) => {
		setTimeout(fn, 0);
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const P = () => {
		const self = {};

		self.listeners = [];
		self.queue = [];
		self.open = true;

		self.open = () => P.open(self);
		self.close = () => P.close(self);
		self.read = (fn) => P.read(fn, self);
		self.write = (value) => P.write(value, self);
		self.flush = () => P.flush(self);
		self.drain = (pipe) => P.drain(self, pipe);
		self.map = (fn) => P.map(fn, self);
		self.filter = (fn) => P.filter(fn, self);
		self.flatten = () => P.flatten(self);
		self.flatMap = (fn) => P.flatMap(fn, self);
		self.foldp = (fn, init) => P.foldp(fn, init, self);

		return self;
	};

	P.open = (pipe) => {
		pipe.open = true;

		return pipe;
	};

	P.close = (pipe) => {
		pipe.open = false;

		return pipe;
	};

	P.read = (fn, pipe) => {
		pipe.listeners.push(fn);

		return pipe;
	};

	P.write = (value, pipe) => {
		pipe.queue.push(value);

		P.flush(pipe);

		return pipe;
	};

	P.flush = (pipe) => {
		if (pipe.open) {
			for (let value of pipe.queue) {
				for (let listener of pipe.listeners) {
					listener(datum);
				}
			}

			pipe.queue.length = 0;
		}

		return pipe;
	};

	P.drain = (pipeA, pipeB) => {
		P.read((value) => P.write(value, pipeB), pipeA);

		return pipeB;
	};

	P.map = (fn, pipe) => {
		const newPipe = P();

		P.read((value) => P.write(fn(value), newPipe), pipe);

		return newPipe;
	};

	P.filter = (fn, pipe) => {
		const newPipe = P();

		P.read((value) => fn(value) ? P.write(value, newPipe) : undefined, pipe);

		return newPipe;
	};

	P.flatten = (pipe) => {
		const newPipe = P();

		P.read((subP) => P.drain(subP, newPipe), pipe);

		return newPipe;
	};

	P.flatMap = (fn, pipe) => {
		return P.flatten(P.map(fn, pipe));
	};

	P.foldp = (fn, init, pipe) => {
		const newPipe = P();

		let state = init;

		P.read(value => {
			state = fn(state, value);

			P.write(state, newPipe);
		}, newPipe);

		return newPipe;
	};

	P.fromArray = (array) => {
		const pipe = P();

		asap(() => {
			for (element of array) {
				pipe.write(element);
			}
		});

		return pipe;
	};

	P.interval = (interval) => {
		const pipe = P();

		let counter = 0;

		setInterval(() => {
			P.write(counter, pipe);

			counter += 1;
		}, interval);

		return pipe;
	};

	P.timeout = (timeout) => {
		const pipe = P();

		setTimeout(() => {
			P.write(0, pipe);
		}, timeout);

		return pipe;
	};

	namespace.P = P;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
