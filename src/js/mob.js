import Entity from './entity.js';

const IDLE = -1, MOVING = 1, SLIDING = 2, SWITCHING = 3;

class Mob extends Entity
{
	constructor(xG, yG, dir, speed, health, anim, sprite)
	{
    super(xG, yG, dir, speed, anim);
    this.sprite = sprite;
		this.health = health;
  }

  update(secondsPassed, tiles)
  {
		let speed = this.speed * secondsPassed;

    if(this.moved < SIZE-speed) {  // Normal speed until remainder to 32 pixels is less than 1 speed update
      this.updateCoordinates(speed, this.dir);
      this.moved += Math.abs(XDIR[this.dir]*speed) + Math.abs(YDIR[this.dir]*speed);
    }
    else  // Final step to hit 32 pixels
		{
      this.updateCoordinates((SIZE-this.moved), this.dir);
      this.updateGridCoordinates(this.dir);
      this.moved = 0;
			this.timePassed = 0;

			// Check next direction and change direction if needed
			while(!this.checkNextTile(tiles))
				this.dir = Math.floor(Math.random()*4);
    }
    this.updateAnimation(secondsPassed)
  }

	checkNextTile(tiles)
	{
		const xN = this.xG + XDIR[this.dir];
		const yN = this.yG + YDIR[this.dir];
		if(xN<0 || xN>=ROOM_W || yN<0 || yN>=ROOM_H)
			return false;
		if(OVERWORLD_TILES.includes(tiles[yN][xN]))
			return true;
		return false;
	}

  draw(ctx, img)
  {
		ctx.drawImage(
	  	img,
      64*this.dir + 32*this.animFrame, 32*this.sprite, 32, 32, // Crop image sprite
			this.x, this.y, SIZE, SIZE // Place image in canvas
		);
	}
}


class RedSpike extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 72;
    const ANIM = 12;
    const SPRITE = 2;
		const HEALTH = 1;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}


class BlueSpike extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 96;
    const ANIM = 18;
    const SPRITE = 3;
		const HEALTH = 2;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

export {
  BlueSpike,
  RedSpike
}