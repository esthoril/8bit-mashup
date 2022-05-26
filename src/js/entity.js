const ANIM_COUNT = 2;

export default class Entity
{
	constructor(xG, yG, dir, speed, anim)
	{
		this.x = xG*SIZE;
		this.y = yG*SIZE;
		this.xG = xG;
		this.yG = yG;
		this.dir = dir;

		this.speed = speed;
		this.animSpeed = anim;
		this.animFrame = 0;

		this.moved = 0;
		//this.timePassed = 0;
	}

	// Update pixel coordinates of player or offset
	updateCoordinates(speed, dir)
	{
		this.x += XDIR[dir]*speed;
		this.y += YDIR[dir]*speed;
	}

	updateGridCoordinates(dir)
	{
		this.xG += XDIR[dir];
		this.yG += YDIR[dir];
	}

	updateAnimation(secondsPassed)
	{
		if(isNaN(this.timePassed)) // TODO fix mob animation?
			this.timePassed = 0;

		this.timePassed += secondsPassed*100;
		if(this.timePassed >= this.animSpeed)
		{
			this.timePassed = 0;
			this.animFrame = this.animFrame < ANIM_COUNT-1 ? this.animFrame + 1 : 0;
		}
	}
}
