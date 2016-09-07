(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.higherOrder;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const id = (value) => value;

	namespace.id = id;

	const constant = (value) => (_) => value;

	namespace.constant = constant;

	const compose = (fn1, fn2) => (value) => fn1(fn2(value));

	namespace.compose = compose;

	const chain = (fns) => fns.reduce(compose, id);

	namespace.chain = chain;

	const composeP1 = (fn1, fn2) => (value, ...args) => fn1(fn2(value, ...args), ...args);

	namespace.composeP1 = composeP1;

	const chainP1 = (fns) => fns.reduce(composeP1, id);

	namespace.chainP1 = chainP1;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
