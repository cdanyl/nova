(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.utils.input;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const getElementOffset = (element) => {
		const box = element.getBoundingClientRect();

		const body = document.body;
		const docElem = document.documentElement;

		const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
		const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

		const clientTop = docElem.clientTop || body.clientTop || 0;
		const clientLeft = docElem.clientLeft || body.clientLeft || 0;

		const top = box.top + scrollTop - clientTop;
		const left = box.left + scrollLeft - clientLeft;

		return {x : Math.round(left), y : Math.round(top)};
	};

	const MOUSE_STATE = Object.freeze({
		CLICKED : Symbol('Clicked'),
		CANCELLED : Symbol('Cancelled'),
		UNCLICKED : Symbol('Unclicked')
	});

	const Mouse = (stage) => {
		const self = {};

		let state = MOUSE_STATE.UNCLICKED;

		self.pos = V(0, 0);

		// checks if the mouse is in the clicked state
		self.clicked = () => {
			return state === MOUSE_STATE.CLICKED;
		};

		// cancels the click
		self.cancel = () => {
			if (state === MOUSE_STATE.CLICKED) {
				state = MOUSE_STATE.CANCELLED;
			}

			// chain
			return self;
		};

		// begins listening for mouse events
		stage.addEventListener('mousedown', () => {
			if (state !== MOUSE_STATE.CANCELLED) {
				state = MOUSE_STATE.CLICKED;
			}
		}, false);

		stage.addEventListener('mouseup', () => {
			state = MOUSE_STATE.UNCLICKED;
		}, false);

		stage.addEventListener('mousemove', (event) => {
			const offset = getElementOffset(stage);

			self.pos.x = event.clientX - offset.x;
			self.pos.y = event.clientY - offset.y;
		}, false);

		return self;
	};

	namespace.Mouse = Mouse;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const KEYS = Object.freeze({
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40
	});

	namespace.KEYS = KEYS;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const KEY_STATE = Object.freeze({
		PRESSED : Symbol('Pressed'),
		CANCELLED : Symbol('Cancelled'),
		UNPRESSED : Symbol('Unpressed')
	});

	const Keyboard = () => {
		const self = {};

		const keys = {};

		// begin listening for keyboard events
		window.addEventListener('keydown', (event) => {
			if (keys[event.keyCode] !== KEY_STATE.CANCELLED) {
				keys[event.keyCode] = KEY_STATE.PRESSED;
			}
		}, false);

		window.addEventListener('keyup', (event) => {
			keys[event.keyCode] = KEY_STATE.UNPRESSED;
		}, false);

		// checks if a key is pressed, cancels the key if specified
		self.pressed = (key) => {
			return keys[key] === KEY_STATE.PRESSED;
		};

		// cancels a key press so that a key has to be repressed
		self.cancel = (key) => {
			if (keys[key] === KEY_STATE.PRESSED) {
				keys[key] = KEY_STATE.CANCELLED;
			}

			// chain
			return self;
		};

		return self;
	};

	namespace.Keyboard = Keyboard;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
