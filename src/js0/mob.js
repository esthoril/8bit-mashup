import Entity from './entity.js';

const SIZE = 32;
const XDIR = [-1,1,0,0];
const YDIR = [0,0,-1,1];
const YOFFSET = 128;
const TILES = [":"];

export default class Mob extends Entity {

  constructor(xG, yG, dir, mob) {
    super(xG, yG, dir, mob.mSpeed, mob.aSpeed);
    this.id = mob.id;
    this.health = mob.health;
    this.sprite = mob.sprite;
    this.movement = mob.movement;
    this.aFrame = 0;
  }

  update(secondsPassed, room)
  {
    var speed = this.mSpeed * secondsPassed;
    if(this.moved < SIZE-speed) {  // Normal speed until remainder to 32 pixels is less than 1 speed update
      this.updateCoordinates(speed, this.dir);
      this.moved += Math.abs(XDIR[this.dir]*speed) + Math.abs(YDIR[this.dir]*speed);
    }
    else {  // Final step to hit 32 pixels
      this.updateCoordinates((SIZE-this.moved), this.dir);
      this.updateGridCoordinates(this.dir);
      this.checkCurrentTile(room);
      this.moved = 0;

      // Depending on movement pattern, check for next direction
      switch(this.movement) {
        case 0:  // switch 180
          if(!this.checkNextTile(this.dir, room))
            (this.dir%2 == 0) ? this.dir +=1 : this.dir -=1;  // 0 -> 1, 2 -> 3, 1 -> 0 and 3 -> 2
          break;
        case 1:  // random next direction
          while(!this.checkNextTile(this.dir, room)) {
            this.dir = Math.floor(Math.random()*4);
          }
          break;
        case 2:  // stop one step then switch randomly after 3 steps
          break;
        case 3:  // always towards player
          break;
      }


    }
    this.updateAnimation(secondsPassed);
  }

  checkCurrentTile(room) {
    var grid = room.getGrid();
    var xG = this.xG;
    var yG = this.yG;
    switch(grid[yG][xG]) {
      case "=":  // green button
        room.toggle("=");
        break;
      case "G":  // purple button
        room.toggle("G");
        break;
    }
  }

  // check if next tile is valid in our current direction
  checkNextTile(dir, room) {
    var tile = this.getNextTile(dir, room);
    return (!TILES.includes(tile) || tile == null) ? false : true;
  }

  draw(ctx, img) {
    //ctx.fillStyle = "rgba(255,64,64,1)";
    //ctx.fillRect(this.x, this.y+128, 32, 32);
    //ctx.drawImage(img, this.dir*SIZE*2, this.sprite*SIZE, SIZE, SIZE, this.x, this.y, SIZE, SIZE);
    if(this.aSpeed != null)
      ctx.drawImage(img, this.dir*SIZE*2 + this.aFrame*SIZE, this.sprite*SIZE, SIZE, SIZE, this.x, this.y + YOFFSET, SIZE, SIZE);
    else
      ctx.drawImage(img, this.dir*SIZE*2, this.sprite*SIZE, SIZE, SIZE, this.x, this.y + YOFFSET, SIZE, SIZE);
  }
}
