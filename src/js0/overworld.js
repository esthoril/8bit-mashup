import Room from './room.js';
const SIZE = 32;
const ANIMATION = [];
const YOFFSET = 128;

class Overworld extends Room {

  constructor(room) {
    super(room, document.getElementById("tiles_overworld"));
    this.worldId = room.id;
  }

  getRoomId() {
    return this.worldId;  // same id
  }

  // Draw objects
  draw(ctx) {

    var w = this.grid[0].length;
    var h = this.grid.length;

    for(var i=0;i<w;i++) {
      for(var j=0;j<h;j++) {
        let char = this.grid[j][i].charCodeAt() - 48;
        let xTile = char%10;
        let yTile = Math.floor(char/10);
        if(ANIMATION.includes(this.grid[j][i]))
          ctx.drawImage(this.img, SIZE*xTile+this.aFrame*32, SIZE*yTile, SIZE, SIZE, i*SIZE, j*SIZE + YOFFSET, SIZE, SIZE);
        else
          ctx.drawImage(this.img, SIZE*xTile, SIZE*yTile, SIZE, SIZE, i*SIZE, j*SIZE + YOFFSET, SIZE, SIZE);
      }
    }
  }
}

export default Overworld;
