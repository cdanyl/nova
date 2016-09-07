(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.state;

	const {V} = nova.shared.math;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Camera = (x, y, depth = 0) => {
		const self = {};

		self.pos = V(x, y);
		self.depth = depth;

		return self;
	};

	namespace.Camera = Camera;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const State = (camera, bounds) => {
        const self = {};

		self.camera = camera;
		self.bounds = bounds;

        self.entities = [];

        // removes all entities and cleans things up
		self.clear = () => {
			// iterate each entity and trigger the remove event on observable ones
			for (let entity of self.entities) {
                if (entity.isObservable) {
    				entity.trigger('remove');
                }
			}

			// clear the list of entities
			self.entities = [];

			// chain
			return self;
		};

		// adds an entity to the state
		self.add = (entity) => {
			self.entities.push(entity);

			// trigger the add event if it's observable
            if (entity.isObservable) {
    			entity.trigger('add');
            }

			// chain
			return self;
		};

		// adds an entity but clears all the others first
		self.solo = (entity) => {
			// clear the state first
			self.clear();

			// add the entity
			self.add(entity);

			// chain
			return self;
		};

        return self;
    };

    namespace.State = State;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
