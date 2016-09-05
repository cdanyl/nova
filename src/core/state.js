(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.state;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const State = () => {
        const self = {};

        self.entities = [];

        // recursively removes all entities and cleans things up
		self.clear = () => {
			// iterate each entity and run their die method if they have one
			for (let entity of self.entities) {
                if (entity.isObservable) {
    				// let the entity do any necessary cleanup
    				entity.trigger('die');
                }
			}

			// clear the list of entities
			self.entities = [];

			// chain
			return self;
		};

		// adds a sub-entity as a entity
		self.add = (entity, args) => {
			self.entities.push(entity);

            if (entity.isObservable) {
    			// let the entity do any necessary setup
    			entity.trigger('init', args);
            }

			// chain
			return self;
		};

		// adds a sub-entity but clears all the others first
		self.solo = (entity, args) => {
			// clear the state first
			self.clear();

			// add the entity
			return self.add(entity, args);
		};

        return self;
    };

    namespace.State = State;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
