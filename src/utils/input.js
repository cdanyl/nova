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

	const KEY_CODES = Object.freeze({
	    'backspace': 8,
	    'tab': 9,
	    'enter': 13,
	    'shift': 16,
	    'ctrl': 17,
	    'alt': 18,
	    'pause/break': 19,
	    'caps lock': 20,
	    'esc': 27,
	    'space': 32,
	    'page up': 33,
	    'page down': 34,
	    'end': 35,
	    'home': 36,
	    'left': 37,
	    'up': 38,
	    'right': 39,
	    'down': 40,
	    'insert': 45,
	    'delete': 46,

	    '0': 48,
	    '1': 49,
	    '2': 50,
	    '3': 51,
	    '4': 52,
	    '5': 53,
	    '6': 54,
	    '7': 55,
	    '8': 56,
	    '9': 57,

	    'a': 65,
	    'b': 66,
	    'c': 67,
	    'd': 68,
	    'e': 69,
	    'f': 70,
	    'g': 71,
	    'h': 72,
	    'i': 73,
	    'j': 74,
	    'k': 75,
	    'l': 76,
	    'm': 77,
	    'n': 78,
	    'o': 79,
	    'p': 80,
	    'q': 81,
	    'r': 82,
	    's': 83,
	    't': 84,
	    'u': 85,
	    'v': 86,
	    'w': 87,
	    'x': 88,
	    'y': 89,
	    'z': 90,

	    'command': 91,
	    'left command': 91,
	    'right command': 93,
	    'numpad 0': 96,
	    'numpad 1': 97,
	    'numpad 2': 98,
	    'numpad 3': 99,
	    'numpad 4': 100,
	    'numpad 5': 101,
	    'numpad 6': 102,
	    'numpad 7': 103,
	    'numpad 8': 104,
	    'numpad 9': 105,
	    'numpad *': 106,
	    'numpad +': 107,
	    'numpad -': 109,
	    'numpad .': 110,
	    'numpad /': 111,
	    'f1': 112,
	    'f2': 113,
	    'f3': 114,
	    'f4': 115,
	    'f5': 116,
	    'f6': 117,
	    'f7': 118,
	    'f8': 119,
	    'f9': 120,
	    'f10': 121,
	    'f11': 122,
	    'f12': 123,
	    'num lock': 144,
	    'scroll lock': 145,
	    'my computer': 182,
	    'my calculator': 183,
	    ';': 186,
	    '=': 187,
	    ',': 188,
	    '-': 189,
	    '.': 190,
	    '/': 191,
	    '`': 192,
	    '[': 219,
	    '\\': 220,
	    ']': 221,
	    "'": 222
	});

	namespace.KEY_CODES = KEY_CODES;

	const KEY_ALIASES = Object.freeze({
	    'windows': KEY_CODES['command'],
	    '⇧': KEY_CODES['shift'],
	    '⌥': KEY_CODES['alt'],
	    '⌃': KEY_CODES['ctrl'],
	    '⌘': KEY_CODES['command'],
	    'ctl': KEY_CODES['ctrl'],
	    'control': KEY_CODES['ctrl'],
	    'option': KEY_CODES['alt'],
	    'pause': KEY_CODES['pause/break'],
	    'break': KEY_CODES['pause/break'],
	    'caps': KEY_CODES['caps lock'],
	    'return': KEY_CODES['enter'],
	    'escape': KEY_CODES['esc'],
	    'spc': KEY_CODES['space'],
	    'pgup': KEY_CODES['page up'],
	    'pgdn': KEY_CODES['page down'],
	    'ins': KEY_CODES['insert'],
	    'del': KEY_CODES['delete'],
	    'cmd': KEY_CODES['command']
	});

	namespace.KEY_ALIASES = KEY_ALIASES;

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
