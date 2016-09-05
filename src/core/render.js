(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const namespace = nova.core.render;

	const {SHAPES} = nova.components.shapes;
	const {APPEARANCES} = nova.components.appearances;

	const {V} = nova.shared.math;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const renderer = (canvas, camera) => {
		const ctx = canvas.getContext('2d');

		return (state, alpha) => {
			const culled = [];

			// figure out which entities need to be rendered
			for (let entity of state.entities) {
				if (entity.appearance !== undefined) {
					culled.push(entity);
				}
			}

			// sort the culled list according based on their "3d" depth
			culled.sort((a, b) => {
				return b.depth - a.depth || b.layer - a.layer;
			});

			// clear the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// let each entity render itself
			for (let entity of culled) {
				if (entity.appearance === APPEARANCES.COLOR) {
					ctx.fillStyle = entity.color;

					if (entity.shape === SHAPES.BOX) {
		                const pos = V.sub(entity.pos, camera);

						ctx.fillRect(pos.x, pos.y, entity.size.x, entity.size.y);
					}

					else if (entity.shape === SHAPES.CIRCLE) {
		                const pos = V.sub(entity.pos, camera);

						ctx.beginPath();
						ctx.arc(pos.x, pos.y, entity.radius, 0, 2 * Math.PI);
						ctx.fill();
					}
				}

				else if (entity.appearance === APPEARANCES.IMAGE) {
					if (entity.shape === SHAPES.BOX) {
		                const pos = V.sub(entity.pos, camera);

						ctx.drawImage(entity.image, pos.x, pos.y, self.size.x, self.size.y);
					}
				}

				else if (entity.appearance === APPEARANCES.SPRITE) {
					if (entity.shape === SHAPES.BOX) {
		                const pos = V.sub(entity.pos, camera);

						ctx.drawImage(
							entity.image,
							entity.clipPos.x,
							entity.clipPos.y,
							entity.clipSize.x,
							entity.clipSize.y,
							pos.x,
							pos.y,
							entity.size.x,
							entity.size.y
						);
					}
				}
			}
		};
	};

	namespace.renderer = renderer;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
