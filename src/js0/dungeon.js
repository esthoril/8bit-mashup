import Room from './room.js';
const SIZE = 32;
const ANIMATION = [">","@","H","J","O","8","L","V"];

const YOFFSET = 128;

class Dungeon extends Room {

  constructor(room, id) {
    super(room, document.getElementById("tiles_dungeon"));  // filter for starting room for this dungeon
    this.worldId = id;
    this.roomId = room.id;
  }

  getRoomId() {
    return this.roomId;
  }

  toggle(char) {
    var w = this.grid[0].length;
    var h = this.grid.length;
    for(var i=0;i<w;i++) {
      for(var j=0;j<h;j++) {
        switch(char) {
          case "=":
            if([">", "@"].includes(this.grid[j][i])) {
              this.grid[j][i] = this.grid[j][i] === ">" ? "@" : ">";
            }
            break;
          case "G":
            if(["H", "J"].includes(this.grid[j][i])) {
              this.grid[j][i] = this.grid[j][i] === "H" ? "J" : "H";
            }
            break;
        }
      }
    }
  }

  // Draw objects
  draw(ctx, worldtype) {

    var w = this.grid[0].length;
    var h = this.grid.length;

    for(let i=1;i<w-1;i++) {  // 1 to w-1 not drawing the outer tiles as they are hidden under the walls
      for(let j=1;j<h-1;j++) {  //
        let char = this.grid[j][i].charCodeAt() - 48;
        let xTile = char%10;
        let yTile = Math.floor(char/10);
        if(ANIMATION.includes(this.grid[j][i]))
          ctx.drawImage(this.img, SIZE*xTile + this.aFrame*32, SIZE*yTile, SIZE, SIZE, i*SIZE, j*SIZE + YOFFSET, SIZE, SIZE);
        else
          ctx.drawImage(this.img, SIZE*xTile, SIZE*yTile, SIZE, SIZE, i*SIZE, j*SIZE + YOFFSET, SIZE, SIZE);
      }
    }

    // Draw dungeon walls
    let walls = document.getElementById("items");
    ctx.drawImage(walls, 0, 136, 544, 32, 0, YOFFSET, 544, 32);  // top wall
    ctx.drawImage(walls, 0, 168, 544, 32, 0, 10*SIZE+YOFFSET, 544, 32);  // bottom wall
    ctx.drawImage(walls, 544, 0, 32, 288, 0, 32+YOFFSET, 32, 288);  // left wall
    ctx.drawImage(walls, 576, 0, 32, 288, 16*SIZE, 32+YOFFSET, 32, 288);  // right wall

    // Draw dungeon doors
    let doors = [this.grid[5][0], this.grid[5][w-1], this.grid[0][8], this.grid[h-1][8]];  // left, right, up, down door colours
    for(let i=0; i<4; i++) {
      let color = doors[i];
      if(color!==null && color!=="-")
        this.drawDoor(ctx, walls, i, doors[i]);
    }
  }

  // color - plain wall
  //       0 yellow key door
  //       1 red key door
  //       2 blue key door
  //       3 green key door
  //       4 open door
  //       5 bomb hole
  drawDoor(ctx, img, dir, color) {
    switch(dir) {
      case 0: ctx.drawImage(img, color*72, 0, 32, 72, 0, 140+YOFFSET, 32, 72); break; // left door
      case 1: ctx.drawImage(img, 32 + color*72, 0, 32, 72, 512, 140+YOFFSET, 32, 72); break; // right door
      case 2: ctx.drawImage(img, color*72, 72, 72, 32, 236, YOFFSET, 72, 32); break; // top door
      case 3: ctx.drawImage(img, color*72, 104, 72, 32, 236, 320+YOFFSET, 72, 32); break; // bottom door
    }
  }
}

export default Dungeon;
