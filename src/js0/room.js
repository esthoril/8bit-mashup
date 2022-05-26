const SIZE = 32;
let time = 0;

class Room {

  constructor(room, img) {
    this.name = room.name;
    this.text = room.text;
    this.mobs = room.mobs;
    this.img = img;
    this.grid = this.setRoomGrid(room);
    this.width = this.grid[0].length;
    this.height = this.grid.length;
    this.aFrame = 0;
  }

  getWorldId() {
    return this.worldId;
  }

  getRoomId() {
    return null;
  }

  setMobs(mobHandler) {
    if(this.mobs == null) {
      console.log("No mobs found");
      mobHandler.reset();
      return;
    }
    else {
      for(let i=0; i<this.mobs.length; i++) {
        let xG = this.mobs[i][0];
        let yG = this.mobs[i][1];
        let dir = this.mobs[i][2];
        let type = this.mobs[i][3];
        let mob = MOBS.filter((mob) => mob.id === type)[0];
        mobHandler.addMob(xG, yG, dir, mob);
      }
    }
  }

  /**
   * Initialize level array
   */
  setRoomGrid(room) {
    var w = room.tiles[0].length;
    var h = room.tiles.length;
    var grid = new Array(h);
    for(var j=0;j<h;j++){
      grid[j] = new Array(w);
      for(var i=0;i<w;i++){
        grid[j][i] = room.tiles[j][i];
      }
    }
    return grid;
  }

  getGrid() {
    return this.grid;
  }

  setGridTile(x,y,char) {
    console.log(this.grid[y][x] + " <-- " + char)
    this.grid[y][x] = char;
  }

  update(secondsPassed) {
    time+=.4;
    if(time >= 2.4) {
      this.aFrame = this.aFrame==0 ? 1 : 0;
      time = 0;
    }
  }
}

export default Room;
