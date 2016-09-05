(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.utils.misc;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    // intervals run a function at a given interval
    const interval = (int, timer = 0) => {
        const self = {};

        self.progress = function (dt, callback) {
            timer += dt;

            while (timer >= int) {
                timer -= int;

                callback();
            }
        };

        return self;
    };

    namespace.interval = interval;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    // loading and saving helpers
    const loadData = (key, defaultValue) => {
        const value = localStorage.getItem(key);

        return value !== null ? value : defaultValue;
    };

    namespace.loadData = loadData;

    const saveData = (key, value) => localStorage.setItem(key, value);

    namespace.saveData = saveData;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
