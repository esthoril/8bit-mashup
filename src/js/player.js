import Entity from './entity.js';

export default class Player extends Entity
{
	constructor(xG, yG, dir)
	{
		const SPEED = 160;
		const ANIM = 9;
		super(xG, yG, dir, SPEED, ANIM);

		this.img = document.getElementById("link");
		this.state = IDLE;
	}

	checkInput(keys, world)
	{
		this.animframe = 1;
		this.moved = 0;
		this.timePassed = 0;

		// Check if we need to switch room
		// and if next tile is valid to move to
		if(keys.isDown(keys.RIGHT)) { this.state = this.movePlayer(DIRS.RIGHT, world); }
		else if(keys.isDown(keys.LEFT)) { this.state = this.movePlayer(DIRS.LEFT, world); }
		else if(keys.isDown(keys.UP)) { this.state = this.movePlayer(DIRS.UP, world); }
		else if(keys.isDown(keys.DOWN)) { this.state = this.movePlayer(DIRS.DOWN, world); }
	}

	makeStep(secondsPassed)
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
			//this.checkCurrentTile(levelHandler); // Check if current tile is ice, entrance to dungeon/shop, ...
			this.state = IDLE;
		}
	}

	update(secondsPassed, world, keys)
	{
		if(this.state == IDLE)
			this.checkInput(keys, world);
		else {
			this.makeStep(secondsPassed);
			this.updateAnimation(secondsPassed)  // Calculate switching animation image
		}

		//if(this.state == MOVING)

	}

	// A button was pressed. Update direction and check tile.
	movePlayer(dir, world)
	{
		this.dir = dir;  // Set direction
		const x = this.xG + XDIR[this.dir], y = this.yG + YDIR[this.dir];
		console.log(`Moving from (${this.yG}, ${this.xG}) to (${y}, ${x})`);

		if(x >= 0 && x < ROOM_W && y >= 0 && y < ROOM_H) {
			const tile = world.getRoom().getTile(x, y);
			if(!OVERWORLD_TILES.includes(tile))
				return IDLE;
			return MOVING;
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
		world.switch(dir);
		return MOVING;
	}

	resetMovement(state)
	{
		this.moved = 0;
		this.timePassed = 0;
		this.state = state;
	}

	draw(ctx)
	{
		ctx.drawImage(
			this.img,
			32*this.dir + 32*4*this.animFrame, 0, 32, 32, // Crop image sprite
			this.x, this.y, SIZE, SIZE // Place image in canvas
		);
	}
}
