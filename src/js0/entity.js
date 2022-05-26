const XDIR = [-1,1,0,0];
const YDIR = [0,0,-1,1];

export default class Entity {

  constructor(xG, yG, dir, mSpeed, aSpeed) {
    this.x = xG*32;
    this.y = yG*32;
    this.xG = xG;
    this.yG = yG;
    this.dir = dir;

    this.mSpeed = mSpeed;
    this.aSpeed = aSpeed;

    this.moved = 0;
    this.timePassed = 0;
  }

  // Update pixel coordinates of player or offset
  updateCoordinates(speed, dir) {
    this.x += XDIR[dir]*speed;
    this.y += YDIR[dir]*speed;
  }

  updateGridCoordinates(dir) {
    this.xG += XDIR[dir];
    this.yG += YDIR[dir];
  }

  updateAnimation(secondsPassed) {
    this.timePassed += secondsPassed*100;
    if(this.timePassed >= this.aSpeed) {
      this.timePassed=0;
      this.aFrame += 1;
      if(this.aFrame >= 2)
        this.aFrame = 0;
    }
  }

  // Get next level tile given player direction
  getNextTile(dir, level) {
    var grid = level.getGrid();
    var xG = this.xG + XDIR[dir]
    var yG = this.yG + YDIR[dir]
    if(xG < 0 || yG < 0 || xG >= level.width || yG >= level.height) {
      console.log("out of room");
      return null;
    }
    return grid[yG][xG];
  }
}
