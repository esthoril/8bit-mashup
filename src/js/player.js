import Entity from './entity.js';

export default class Player extends Entity
{
	SLASH_COUNT = 12;

	constructor(xG, yG, dir)
	{
		const SPEED = 160;
		const ANIM = 9;
		super(xG, yG, dir, SPEED, ANIM);

		this.img = document.getElementById("link");
		this.state = STATE.IDLE;
		this.frameTimer = 0;
	}

	checkInput(keys, world)
	{
		this.animframe = 1;
		this.moved = 0;

		//
		if(keys.isDown(keys.Q)) {
			return STATE.SLASH;
		}

		//
		if(keys.isDown(keys.RIGHT)) return this.move(DIRS.RIGHT, world);
		else if(keys.isDown(keys.LEFT)) return this.move(DIRS.LEFT, world);
		else if(keys.isDown(keys.UP)) return this.move(DIRS.UP, world);
		else if(keys.isDown(keys.DOWN)) return this.move(DIRS.DOWN, world);

		return this.state;
	}

	makeStep(secondsPassed, world)
	{
		let speed = this.speed * secondsPassed;

		if(this.moved < SIZE-speed) {  // Normal speed until remainder to 32 pixels is less than 1 speed update
			this.updateCoordinates(speed, this.dir);
			this.moved += Math.abs(XDIR[this.dir]*speed) + Math.abs(YDIR[this.dir]*speed);
		}
		else // Final step to hit 32 pixels
		{
			this.updateCoordinates((SIZE-this.moved), this.dir);
			this.updateGridCoordinates(this.dir); // TODO only do this when we didnt move at the edge of a room
			this.checkTile(world); // Finished moving, check if current tile is shop/dungeon entrance, ice, water, ...
			this.state = STATE.IDLE;
		}
	}

	checkTile(world)
	{
		const tile = world.getRoom().getTile(this.xG, this.yG);
		if("0".includes(tile)) {
			const link = world.getRoom().getLink();
			const map = link[1];
			console.log(`Dungeon/shop entrance at ${link[0]}; map: ${map}`);
			world.loadMap(map);
		}
	}

	update(secondsPassed, world, keys)
	{
		if(this.state == STATE.IDLE) {
			this.frameTimer = 0;
			this.state = this.checkInput(keys, world);
		}

		if(this.state == STATE.SLASH) {
			this.frameTimer++;
			if(this.frameTimer == this.SLASH_COUNT)
				this.state = STATE.IDLE;
		}
		else if(this.state == STATE.MOVING) {
			this.makeStep(secondsPassed, world);
			this.updateAnimation(secondsPassed)  // Calculate switching animation image
		}
	}

	move(dir, world)
	{
		this.dir = dir;
		const x = this.xG + XDIR[this.dir], y = this.yG + YDIR[this.dir];

		if(x >= 0 && x < ROOM_W && y >= 0 && y < ROOM_H) {
			const tile = world.getRoom().getTile(x, y);
			if(!OVERWORLD_TILES.includes(tile)) //if(OVERWORLD_TILES.indexOf(tile) == -1)
				return STATE.IDLE;
			return STATE.MOVING;
		}

		// Switch room
		if(x == -1) // this.xG == 0 && dir == DIRS.LEFT
			this.xG = ROOM_W;
		else if(x == ROOM_W)
			this.xG = -1;
		else if(y == -1)
			this.yG = ROOM_H;
		else if(y == ROOM_H)
			this.yG = -1;

		this.x = this.xG*SIZE;
		this.y = this.yG*SIZE;
		world.switchRoom(dir);
		return STATE.MOVING;
	}

	resetMovement(state)
	{
		this.moved = 0;
		this.timePassed = 0;
		this.state = state;
	}

	draw(ctx)
	{
		if(this.state == STATE.MOVING || this.state == STATE.IDLE) {
			ctx.drawImage(
				this.img,
				32*this.dir + 32*4*this.animFrame, 0, 32, 32, // Crop image sprite
				this.x, this.y, SIZE, SIZE // Place image in canvas
			);
		}
		else if(this.state == STATE.SLASH) {
			const fX = [-24, 0, 0,-24], fY = [0, 0, -24, 0];
			ctx.drawImage(
				this.img,
				56*this.dir, 32, 56, 56,
				this.x + fX[this.dir], this.y + fY[this.dir], 56, 56
			);
		}
	}
}
