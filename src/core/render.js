(() => {
	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.render;

	const {SHAPES} = nova.components.shapes;
	const {APPEARANCES, hasAppearance} = nova.components.appearances;

	const {V} = nova.shared.math;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const cull = (ctx, camera, entity) => {
		if (entity.shape === SHAPES.INFINITE) {
			return true;
		}

		else if (entity.shape === SHAPES.REPEATING) {
			return true;
		}

		else if (entity.shape === SHAPES.BOX) {
			const {x, y} = entity.pos;
			const {x : w, y : h} = entity.size;

			const {x : cx, y : cy} = camera.pos;
			const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];

			return x + w - cx > 0 && y + h - cy > 0 && x - cx < cw && y - cy < ch;
		}

		else if (entity.shape === SHAPES.CIRCLE) {
			const {x, y} = entity.pos;
			const r = entity.radius;

			const {x : cx, y : cy} = camera.pos;
			const [cw, ch] = [ctx.canvas.width, ctx.canvas.height];

			return x + r - cx > 0 && y + r - cy > 0 && x - r - cx < cw && y - r - cy < ch;
		}

		else {
			return false;
		}
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const render = (ctx, camera, entity) => {
		if (entity.appearance === APPEARANCES.COLOR) {
			if (entity.shape === SHAPES.BOX) {
				const {x, y} = V.sub(entity.pos, camera.pos);
				const {x: w, y: h} = entity.size;

				ctx.fillStyle = entity.color;
				ctx.fillRect(x, y, w, h);
			}

			else if (entity.shape === SHAPES.CIRCLE) {
				const {x, y} = V.sub(entity.pos, camera.pos);
				const r = entity.radius;

				ctx.fillStyle = entity.color;
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2 * Math.PI);
				ctx.fill();
			}

			else if (entity.shape === SHAPES.INFINITE) {
				const [w, h] = [ctx.canvas.width, ctx.canvas.height];

				ctx.fillStyle = entity.color;
				ctx.fillRect(0, 0, w, h);
			}
		}

		else if (entity.appearance === APPEARANCES.PICTURE) {
			if (entity.shape === SHAPES.BOX) {
				const {x, y} = V.sub(entity.pos, camera.pos);

				ctx.drawImage(entity.image, x, y, entity.size.x, entity.size.y);
			}

			else if (entity.shape === SHAPES.REPEATING) {
				const {x, y} = V.sub(entity.pos, camera.pos);
				const {x: w, y: h} = entity.size;

				const [width, height] = [ctx.canvas.width, ctx.canvas.height];

				const startX = x % width - (x < 0 ? width : 0);
				const startY = y % height - (y < 0 ? height : 0);

				// for (let px = startX; px < width; px += width)
			}
		}

		else if (entity.appearance === APPEARANCES.SPRITE) {
			if (entity.shape === SHAPES.BOX) {
				const {x, y} = V.sub(entity.pos, camera.pos);

				ctx.drawImage(
					entity.image,
					entity.clipPos.x,
					entity.clipPos.y,
					entity.clipSize.x,
					entity.clipSize.y,
					x,
					y,
					entity.size.x,
					entity.size.y
				);
			}
		}
	};

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const renderer = (canvas) => {
		const ctx = canvas.getContext('2d');

		return (state, alpha) => {
			// filter out entities without an appearance or that can't be seen
			const culled = [];

			for (let entity of state.entities) {
				if (hasAppearance(entity) && cull(ctx, state.camera, entity)) {
					culled.push(entity);
				}
			}

			// sort so that farther back entities are rendered first
			const sorted = culled.sort((a, b) => b.depth - a.depth || b.layer - a.layer);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			for (let entity of sorted) {
				render(ctx, state.camera, entity);
			}
		};
	};

	namespace.renderer = renderer;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
