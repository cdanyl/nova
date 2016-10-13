(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.appearance;

	const {constant, composeP1, Fundamental} = nova.shared.higherOrder;
	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const Invisible = Object.freeze(() => {
		const value = {};
		value.type = value;

		return value;
	}());

	namespace.Invisible = Invisible;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// a color renders as a solid color as a primitive shape
	const Color = (color, depth = 0, layer = 0) => ({
		type : Color,
		color,
		depth,
		layer
	});

	namespace.Color = Color;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// sprites render images as an AABB
	const Sprite = (
		image,
		depth = 0,
		layer = 0,
		clipX = 0,
		clipY = 0,
		clipWidth = image.width,
		clipHeight = image.height
	) => ({
		type : Sprite,
		image,
		depth,
		layer,
		clipPos : V(clipX, clipY),
		clipSize : V(clipWidth, clipWidth)
	});

	namespace.Sprite = Sprite;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// builds an animation represented by an array of coordinates
	const buildAnimation = (
		sprite,
		start,
		length,
		displayWidth,
		displayHeight,
		frameWidth = displayWidth,
		frameHeight = displayHeight
	) => {
		const sprites = [];

		// find the number of frames per row of the image
		const framesPerRow = Math.ceil(sprite.image.width / frameWidth);

		// iterate frames start to end
		for (let frame = 0; frame < length; frame ++) {
			const x = (frame + start) % framesPerRow;
			const y = Math.floor((frame + start) / framesPerRow);

			sprites.push(Sprite(
				sprite.image,
				sprite.depth,
				sprite.layer,
				frameWidth * x,
				frameHeight * y,
				displayWidth,
				displayHeight
			));
		}

		return sprites;
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
