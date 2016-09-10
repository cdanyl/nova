(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.components.appearances;

	const {constant} = nova.shared.higherOrder;
	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// the appearance "enum" is used to identify primitive graphical types
	const APPEARANCES = Object.freeze({
		COLOR : Symbol('Color'),
		PICTURE : Symbol('Picture'),
		SPRITE : Symbol('Sprite')
	});

	namespace.APPEARANCES = APPEARANCES;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const hasAppearance = (entity) => entity.appearance !== undefined;

	namespace.hasAppearance = hasAppearance;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// a color renders as a solid color as a primitive shape
	const Color = (color, depth = 0, layer = 0) => (self = {}) => {
		self.appearance = APPEARANCES.COLOR;

		self.color = color;
		self.depth = depth;
		self.layer = layer;

		return self;
	};

	namespace.Color = Color;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// sprites render images as an AABB
	const Picture = (image, depth = 0, layer = 0) => (self = {}) => {
		self.appearance = APPEARANCES.PICTURE;

		self.image = image;
		self.depth = depth;
		self.layer = layer;

		return self;
	};

	namespace.Picture = Picture;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	// animated objects are sprites that can be animated
	const Sprite = (image, animation, depth = 0, layer = 0) => (self = {}) => {
		self.appearance = APPEARANCES.SPRITE;

		self.image = image;
		self.animation = animation;
		self.depth = depth;
		self.layer = layer;

		self.clipPos = V(0, 0);
		self.clipSize = V(image.width, image.height);

		// sets the animation
		self.setAnimation = (animation) => {
			// change the animation
			self.animation = animation;

			// wrap around the end
			self.frame %= self.animation.length;

			// change source position to match animation
			self.determineClipPos();

			// chain
			return self;
		};

		// progresses the animation over a scalable period of time
		self.animate = (dt) => {
			// check if an animation exists
			if (self.animation.length > 0) {
				// progress the frame by dt
				self.frame += dt;

				// wrap around the end
				self.frame %= self.animation.length;

				// change source position to match animation
				self.determineClipPos();
			}

			// chain
			return self;
		};

		// resets the animation to the first frame
		self.resetAnimation = () => {
			// check if an animation exists
			if (self.animation.length > 0) {
				// set the frame back to the first one
				self.frame = 0;

				// change source position to match animation
				self.determineClipPos();
			}

			// chain
			return self;
		};

		// determines the new position in the animation
		self.determineClipPos = () => {
			// change source position to match animation
			const currentFrame = self.animation[Math.floor(self.frame)];

			self.clipPos.x = currentFrame[0];
			self.clipPos.y = currentFrame[1];
		};

		// builds an animation represented by an array of coordinates
		self.buildAnimation = (start = 0, end = 0, gapX = 0, gapY = 0) => {
			const result = [];

			// find the number of frames per row of the image
			const framesPerRow = Math.ceil((self.image.width + gapX) / (self.size.x + gapX));

			// iterate frames start to end
			for (let i = start; i < end; i ++) {
				result.push([
					(self.size.x + gapX) * (i % framesPerRow),
					(self.size.y + gapY) * Math.floor(i / framesPerRow)
				]);
			}

			return result;
		};

		return self;
	};

	namespace.Sprite = Sprite;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
