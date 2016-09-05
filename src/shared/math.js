(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.shared.math;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const TAU = 6.283185307179586;

    namespace.TAU = TAU;

    const PI = TAU / 2;

    namespace.PI = PI;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const degrees = (radians) => radians / TAU * 360;

    namespace.degrees = degrees;

    const radians = (degrees) => degrees / 360 * TAU;

    namespace.radians = radians;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const randomRGB = () => {
        const r = Math.floor(randomBetween(0, 255 + 1));
        const g = Math.floor(randomBetween(0, 255 + 1));
        const b = Math.floor(randomBetween(0, 255 + 1));

        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    };

    namespace.randomRGB = randomRGB;

    const randomBetween = (min, max) => {
        return (Math.random() * (max - min)) + min;
    };

    namespace.randomBetween = randomBetween;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const snap = (number, multiple) => Math.floor(number / multiple) * multiple;

    namespace.snap = snap;

    const clamp = (number, min, max) => number < min ? min : number > max ? max : number;

    namespace.clamp = clamp;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const combinations = (array) => {
		const result = [];

		for (let i = 0, length = array.length; i < length; i += 1) {
			const a = array[i];

			for (let j = i + 1; j < length; j += 1) {
				const b = array[j];

				result.push([a, b]);
			}
		}

		return result;
	};

	namespace.combinations = combinations;

	const combinationsBetween = (array1, array2) => {
		const result = [];

		for (let i = 0, length1 = array1.length; i < length1; i += 1) {
			const a = array1[i];

			for (let j = 0, length2 = array2.length; j < length2; j += 1) {
				const b = array[j];

				result.push([a, b]);
			}
		}

		return result;
	};

	namespace.combinationsBetween = combinationsBetween;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const V = (x = 0, y = 0) => ({x, y});

    // adds two vectors without changing the originals
    V.add = ({x : x1, y : y1}, {x : x2, y : y2}) => V(x1 + x2, y1 + y2);

    // subtracts two vectors without changing the originals
    V.sub = ({x : x1, y : y1}, {x : x2, y : y2}) => V(x1 - x2, y1 - y2);

    // multiplies a vector by a scalar without changing the original
    V.mul = ({x, y}, scalar) => V(x * scalar, y * scalar);

    // divides a vector by a scalar without changing the original
    V.div = ({x, y}, scalar) => V(x / scalar, y / scalar);

	// negates a vector so it faces the opposite direction
	V.negate = ({x, y}) => V(-x, -y);

    // calculates the magnitude (length)
    V.magnitude = ({x, y}) => Math.sqrt(x * x + y * y);

    // calculates the magnitude squared (faster for comparisons)
    V.squareMagnitude = ({x, y}) => x * x + y * y;

	// normal finds the unit vector that points the same direction
	V.normal = (vector) => V.div(vector, V.magnitude(vector));

    // determines the area that the vector covers
    V.area = ({x, y}) => x * y;

    // calculates the dot product with another vector
    V.dot = ({x : x1, y : y1}, {x : x2, y : y2}) => x1 * x2 + y1 * y2;

    // creates an identical clone of this vector
    V.clone = ({x, y}) => V(x, y);

	// creates a vector from polar coordinates
	V.polar = (theta, magnitude) => V(Math.cos(theta) * magnitude, Math.sin(theta) * magnitude);

	// 2d zero vector
	V.ZERO = V(0, 0);

    namespace.V = V;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
