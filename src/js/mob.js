import Entity from './entity.js';

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
		if(OVERWORLD_TILES.includes(tiles[yN][xN]))	//if(OVERWORLD_TILES.indexOf(tiles[yN][xN]) >= 0)
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
    const SPRITE = 0;
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
    const SPRITE = 1;
		const HEALTH = 2;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

class Ghost extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 48;
    const ANIM = 6;
    const SPRITE = 2;
		const HEALTH = 4;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

class RedDog extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 48;
    const ANIM = 16;
    const SPRITE = 3;
		const HEALTH = 6;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

class BlueDog extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 36;
    const ANIM = 24;
    const SPRITE = 4;
		const HEALTH = 12;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

class RedCentaur extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 64;
    const ANIM = 16;
    const SPRITE = 5;
		const HEALTH = 6;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

class BlueCentaur extends Mob
{
  constructor(xG, yG, dir)
  {
    const SPEED = 48;
    const ANIM = 24;
    const SPRITE = 6;
		const HEALTH = 18;
    super(xG, yG, dir, SPEED, HEALTH, ANIM, SPRITE);
  }
}

export {
  BlueSpike,
  RedSpike,
	Ghost,
	RedDog,
	BlueDog,
	RedCentaur,
	BlueCentaur
}