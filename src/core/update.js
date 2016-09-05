(() => {
    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const namespace = nova.core.update;

    const {SHAPES} = nova.components.shapes;
	const {BODIES, canMove} = nova.components.bodies;

	const {V, combinations, combinationsBetween} = nova.shared.math;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const updater = ({integrate, collisionPairs, collision, resolve, update}) => (state, dt) => {
		const collidables = [];

		for (let entity of state.entities) {
			if (entity.body === BODIES.DYNAMIC || entity.body === BODIES.MOVABLE) {
				integrate(entity, dt);
			}

			if (entity.body === BODIES.DYNAMIC || entity.body === BODIES.IMMOVABLE) {
				collidables.push(entity);
			}
		}

		const pairs = collisionPairs(collidables);

		for (let [a, b] of pairs) {
			const hit = collision(a, b);

			if (hit !== null) {
				resolve(hit, a, b);
			}
		}

		for (let entity of state.entities) {
			update(entity, dt);
		}

        return state;
    };

    namespace.updater = updater;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const verletIntegrator = (entity, dt) => {
		// uses verlet integration to move the entity forward over a change in time
		entity.pos = V.add(entity.pos, V.mul(V.add(entity.vel, V.mul(entity.lastAcc, dt / 2)), dt));
		entity.vel = V.add(entity.vel, V.mul(V.add(entity.lastAcc, entity.acc), dt / 2));
		entity.lastAcc = V.clone(entity.acc);

		return entity;
	};

	namespace.verletIntegrator = verletIntegrator;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const bruteforcePairs = (bodies) => {
		const dynamic = [];
        const immovable = [];

		for (let entity of bodies) {
			if (entity.body === BODIES.DYNAMIC) {
                dynamic.push(entity);
            }

            else if (entity.body === BODIES.IMMOVABLE) {
                immovable.push(entity);
            }
		}

		const dynamicPairs = combinations(dynamic);
		const immovablePairs = combinationsBetween(dynamic, immovable);

		const pairs = dynamicPairs.concat(immovablePairs);

        return pairs;
	};

	namespace.bruteforcePairs = bruteforcePairs;

	const Quadtree = (x, y, width, height, depth = 1) => {
        const self = {};

		// boundary position bound vector
		self.pos = V(x, y);

		// boundary size vector
		self.size = V(width, height);

		// list of sub quadrants
		self.trees = [];

		// list of entities
		self.movableBodies = [];

		// list of immovable entities
        // this is seperate to reduce the number of collision checks
		self.immovableBodies = [];

		// maximum number of bodies per leaf before splitting
		const maxBodies = 10;

		// maximum depth of the entire quadtree hierarchy
		const maxDepth = 10;

        const getFittingQuadtree = ({pos: {x1, y1}, size: {x: w1, y: h1}}) => {
            for (let tree of self.trees) {
                let {pos: {x2, y2}, size: {x: w2, y: h2}} = tree;

                if (x1 > x2 && x1 + w1 < x2 + w2 && y1 > y2 && y1 + h1 < y2 + h2) {
                    return tree;
                }
            }

            return null;
        };

        const split = () => {
            const {x: halfX, y: halfY} = self.size.over(2);
    		const {x: middleX, y: middleY} = self.pos.plus(half);
    		const {x: cornerX, y: cornerY} = self.pos;

    		// create the subbodies in their respective locations
    		const nw = Quadtree(cornerX, cornerY, halfX, halfY, depth + 1);
    		const ne = Quadtree(middleX, cornerY, halfX, halfY, depth + 1);
    		const sw = Quadtree(cornerX, middleY, halfX, halfY, depth + 1);
    		const se = Quadtree(middleX, middleY, halfX, halfY, depth + 1);

    		// add them
    		self.trees.push(nw, ne, sw, se);

    		// re-add entities
    		const bodies = self.bodies;

    		self.bodies = [];

    		for (let entity of bodies) {
    			self.add(entity);
    		}

    		// re-add immovable entities
    		const immovableBodies = self.immovableBodies;

    		self.immovableBodies = [];

    		for (let entity of immovableBodies) {
    			self.add(entity);
    		}

    		// chain
    		return self;
        };

        self.add = (entity) => {
            const tree = getFittingQuadtree(entity);

            if (tree !== null) {
                tree.add(entity);
            }

            else {
                if (entity.immovable) {
                    self.immovableBodies.push(entity);
                }

                else {
                    self.movableBodies.push(entity);
                }

                if (self.movableBodies.length + self.immovableBodies.length > movableBodies && depth < maxDepth) {
                    split();
                }
            }

            // chain
            return self;
        };

        self.pairs = (entity, pairs = []) => {
            pairs.push(...self.movableBodies);

            if (!entity.immovable) {
                pairs.push(...self.immovableBodies);
            }

            const fittingTree = getFittingQuadfittingTree(entity);

            if (fittingTree !== null) {
                fittingTree.pairs(entity, pairs);
            }

            else {
                for (let tree of self.trees) {
                    tree.pairs(entity, pairs);
                }
            }

            // chain
            return self;
        };

        self.oldGetPairs = () => {
    		const pairs = [];

    		// rain is a helper function that compares a entity against all its descendants
    		const rain = (entity, quadtree, pairs = []) => {
                for (let quad of quadtree.quadtrees) {
    				for (let other of quad.bodies) {
    					pairs.push([entity, other]);
    				}

    				for (let other of quad.immovableBodies) {
    					pairs.push([entity, other]);
    				}

    				// rain recursively
    				rain(entity, quad, pairs);
    			}

                return pairs;
    		}

    		// this recursively check each entity against all the others at their level, as well as all their decendants
    		const recurse = (quadtree) => {
    			// iterate all movable bodies
    			for (let entity of quadtree.bodies) {
    				// compare against all movable bodies that come after this one
    				for (let k = i + 1, max = length; k < max; k ++) {
    					const other = quadtree.bodies[k];

    					pairs.push([entity, other]);
    				}

    				// compare against immovable bodies if this one is movable
    				if (entity.immovable === false) {
    					for (let other of quadtree.immovableBodies) {
    						pairs.push([entity, other]);
    					}
    				}

    				// compare this entity against all its descendants
    				rain(entity, quadtree);
    			}

    			// check each immovable entity against all its movable descendants
    			for (i = 0, length = quadtree.immovableBodies.length; i < length; i ++) {
    				entity = quadtree.immovableBodies[i];

    				// compare this entity against all its descendants
    				rain(entity, quadtree);
    			}

    			// recurse into sub-quadrants
    			for (i = 0, length = quadtree.quadtrees.length; i < length; i ++) {
    				const quad = quadtree.quadtrees[i];

    				recurse(quad);
    			}
    		}

    		// start recursion
    		recurse(self);

    		return pairs;
    	};

        return self;
	};

	const quadtreePairs = (bodies) => {
		// the following algorithm calculates the second largest box that contains all of the bodies provided
		// this is because the bodies beyond that box are outliers, and cannot collide with anything

		// the following constiables start as far as possible from where they should end up
		// e.g, the farthest left const should start as far to the right as possible, i.e., +infinity

		// keep track of the farthest and second farthest x-pos to the left
		let minX1 = Infinity;
		let minX2 = Infinity;

		// keep track of the farthest and second farthest x-pos to the right
		let maxX1 = -Infinity;
		let maxX2 = -Infinity;

		// keep track of the farthest and second farthest x-pos to the top
		let minY1 = Infinity;
		let minY2 = Infinity;

		// keep track of the farthest and second farthest x-pos to the bottom
		let maxY1 = -Infinity;
		let maxY2 = -Infinity;

		// iterate all the bodies in the scene and calculate the second largest container
		for (let entity of bodies) {
			// move the left bounds
			if (entity.pos.x < minX1) {
				minX2 = minX1;
				minX1 = entity.pos.x;
			}

			else if (entity.pos.x < minX2) {
				minX2 = entity.pos.x;
			}

			// move the right bounds
			if (entity.pos.x + entity.size.x > maxX1) {
				maxX2 = maxX1;
				maxX1 = entity.pos.x + entity.size.x;
			}

			else if (entity.pos.x + entity.size.x > maxX2) {
				maxX2 = entity.pos.x + entity.size.x;
			}

			// move the upper bounds
			if (entity.pos.y < minY1) {
				minY2 = minY1;
				minY1 = entity.pos.y;
			}

			else if (entity.pos.y < minY2) {
				minY2 = entity.pos.y;
			}

			// move the lower bounds
			if (entity.pos.y + entity.size.y > maxY1) {
				maxY2 = maxY1;
				maxY1 = entity.pos.y + entity.size.y;
			}

			else if (entity.pos.y + entity.size.y > maxY2) {
				maxY2 = entity.pos.y + entity.size.y;
			}
		}

		// generate a new quadtree with the size calculated
		const quadtree = Quadtree(minX2, minY2, maxX2 - minX2, maxY2 - minY2);

		// iterate each entity and add them to the quadtree
        for (let entity of bodies) {
            quadtree.add(entity);
        }

		return quadtree.pairs();
	};

	namespace.quadtreePairs = quadtreePairs;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const getCollision = (a, b) => {
		// box vs box collisions
		if (a.shape === SHAPES.BOX && b.shape === SHAPES.BOX) {
			if (a.pos.x < b.pos.x + b.size.x &&
				a.pos.x + a.size.x > b.pos.x &&
				a.pos.y < b.pos.y + b.size.y &&
				a.pos.y + a.size.y > b.pos.y) {
				const min = V.sub(V.add(a.pos, a.size), b.pos);
				const max = V.sub(a.pos, V.add(b.pos, b.size));

				const hitX = Math.abs(min.x) < Math.abs(max.x) ? min.x : max.x;
				const hitY = Math.abs(min.y) < Math.abs(max.y) ? min.y : max.y;

				const hit = Math.abs(hitX) >= Math.abs(hitY) ? V(hitX, 0) : V(0, hitY);

				return hit;
			}

			return null;
		}

		// circle vs circle collisions
		if (a.shape === SHAPES.CIRCLE && b.shape === SHAPES.CIRCLE) {
			// find the difference between the circle's centers
			const difference = V.sub(b.pos, a.pos);

			// find (square) seperation between centers
			const seperationSquared = V.squareMagnitude(difference);

			// find what the (not-squared) seperation would be if both circles were touching
			const totalRadii = a.radius + b.radius;

			// check if the distance between the centers is less than the sum of the radii
			// both sides of the inequality are squared to be more efficient
			if (seperationSquared < totalRadii * totalRadii) {
				// find the actual seperation
				const seperation = Math.sqrt(seperationSquared);

				const hit = V.mul(difference, (totalRadii - seperation) / seperation);

				return hit;
			}

			return null;
		}
	};

	namespace.getCollision = getCollision;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const COLLISION_RESPONSE = Object.freeze({
		RESOLVE : Symbol('Resolve'),
		IGNORE : Symbol('Ignore')
	});

	namespace.COLLISION_RESPONSE = COLLISION_RESPONSE;

	const impulseResolver = (correction, slop) => (hit, a, b) => {
		const response1 = a.resolve !== undefined ?
			a.resolve(hit, a) : COLLISION_RESPONSE.RESOLVE;

		const response2 = b.resolve !== undefined ?
			b.resolve(hit, b) : COLLISION_RESPONSE.RESOLVE;

		if (
			response1 === COLLISION_RESPONSE.RESOLVE &&
			response2 === COLLISION_RESPONSE.RESOLVE
		) {
			// calulate the magnitude of the collision
			const magnitude = V.magnitude(hit);

			// calculate the collision normal
			const normal = V.div(hit, magnitude);

			// calculate relative velocity in terms of the normal direction
			const normalVel = V.dot(V.sub(b.vel, a.vel), normal);

			// don't resolve if velocities are seperating
			if (normalVel <= 0) {
				// calculate inverse masses
				const inverseMassA = 1 / a.mass;
				const inverseMassB = 1 / b.mass;

				// calculate the impulse scalar
				const impulseScalar = -(1 + Math.min(a.restitution, b.restitution)) * normalVel / (inverseMassA + inverseMassB);

				// calculate impulse vector
				const impulse = V.mul(normal, impulseScalar);

				// apply impulse to velocity
				a.vel = V.sub(a.vel, V.mul(impulse, inverseMassA));
				b.vel = V.sub(b.vel, V.mul(impulse, inverseMassB));

				// apply positional correction
				const correction = V.mul(normal, Math.max(magnitude - self.slop, 0) / (inverseMassA + inverseMassB) * self.correction);

				a.pos = V.sub(a.pos, V.mul(correction, inverseMassA));
				b.pos = V.add(b.pos, V.mul(correction, inverseMassB));
			}
		}
	};

	namespace.impulseResolver = impulseResolver;

	const positionalResolver = (hit, a, b) => {
		a.pos = V.sub(a.pos, hit);

		// slow the corrected entity to the velocity of the other entity if it moves into the collision
		if (a.vel.x * hit.x > 0) {
			a.vel.x = b.vel.x;
		}

		if (a.vel.y * hit.y > 0) {
			a.vel.y = b.vel.y;
		}
	};

	namespace.positionalResolver = positionalResolver;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

    const updateChild = (entity, dt) => {
		if (entity.update !== undefined) {
			return entity.update(dt);
		}

		else {
	        return entity;
		}
    };

    namespace.updateChild = updateChild;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const defaultUpdate = updater({
		integrate : verletIntegrator,
		collisionPairs : bruteforcePairs,
		collision : getCollision,
		resolve : impulseResolver(0.7, 0),
		update : updateChild
	});

	namespace.defaultUpdate = defaultUpdate;

	// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //

	const applyGravity = (G, METERS_PER_PIXEL) => {
		const gravityForce = (a, b) => {
			const dif = V.sub(a.pos, b.pos);

			const r = V.magnitude(dif) * METERS_PER_PIXEL;
			const m1 = a.mass;
			const m2 = b.mass;

			const force = G * m1 * m2 / (r * r);

			return V.mul(V.normal(dif), force);
		};

		return (state, dt) => {
			const movableEntities = state.entities.filter(canMove);

			for (let entity of movableEntities) {
				entity.acc = V.ZERO;
			}

			for (let [a, b] of combinations(movableEntities)) {
				const forceB = gravityForce(a, b);
				const forceA = V.negate(forceB);

				a.acc = V.add(a.acc, V.div(forceA, a.mass));
				b.acc = V.add(b.acc, V.div(forceB, b.mass));
			}

			return state;
		};
	};

	namespace.applyGravity = applyGravity;

    // :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: //
})();
