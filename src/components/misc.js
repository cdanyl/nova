(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const namespace = nova.components.misc;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// observable objects allow for decoupling of objects
	// they can be "observed", waiting for events to be triggered on them
	const Observable = (self = {}) => {
		self.isObservable = true;

		// keep a track of "observers", which listen for events on this entity
		// each entry is an event name, which holds a list of responses to that event
		const observers = {};

		// register an observer response to an event name
		self.on = (eventName, response) => {
			if (observers[eventName] === undefined) {
				observers[eventName] = [];
			}

			observers[eventName].push(response);

			return self;
		};

		// trigger all the responses to an event, using the provided arguments
		self.trigger = (eventName, args) => {
			if (observers[eventName] !== undefined) {
				for (let response of observers[eventName]) {
					response(...args);
				}
			}

			if (self[eventName] !== undefined) {
				self[eventName](...args);
			}

			return self;
		};
	};

	namespace.Observable = Observable;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const Name = (name) => (self = {}) => {
        self.name = name;

        return self;
    };

    namespace.Name = Name;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
