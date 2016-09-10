(function () {
	'use strict';

	const canvas = document.getElementById('canvas');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;

	const main = new blu.Container(canvas);

	window.main = main;

	const assets = new blu.Assets();

	assets.baseURL = '/invaders/assets/'

	assets.load({
		rocket : 'images/rocket.png',
		ufo : 'images/ufo.png'
	}).then(function () {
		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		// cardinal direction enum
		const dirs = {
			left : vec(-1, 0),
			up : vec(0, -1),
			right : vec(1, 0),
			down : vec(0, 1)
		};

		// checks if two directions are opposite;
		const opposite = ({x: x1, y: y1}, {x: x2, y: y2}) => x1 === -x2 && y1 === -y2;

		// english names for different keys
		const keys = {
			left : 37,
			up : 38,
			right : 39,
			down : 40
		};

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const GameOver = main.factory.scene();

		GameOver.prototype.init = function () {
			const background = document.getElementById('background');

			background.style.backgroundColor = 'black';

			document.getElementById('restart-overlay').className = 'visible overlay';

			document.getElementById('restart').onclick = function () {
				document.getElementById('restart-overlay').className = 'overlay';

				main.solo(Play);
			};
		};

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		const Play = main.factory.scene();

		Play.prototype.init = function () {

		};

		Play.prototype.makeSalad = function () {

		};

		Play.prototype.update = function (dt) {

		};

		Play.prototype.render = function (ctx) {

		};

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

		main.solo(Play);

		// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
	});
})();
