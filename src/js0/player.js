import Entity from './entity.js';

const DUNGEON_TILES = ["0","1","3","4","5","6","7",";","E","=","@","A","G","J","K","N","Q","R","S","T","U","X","Y","e"];
const OVERWORLD_TILES = ["D",":","0", "i","N","s","p","5","6","7","8","C","M","W"];
const SIZE = 32;
const XDIR = [-1,1,0,0];
const YDIR = [0,0,-1,1];
const PLAYINGFIELD = {"w": 17, "h": 11}
const YOFFSET = 128;
const BX = Math.floor(PLAYINGFIELD.w/2);  // 8
const BY = Math.floor(PLAYINGFIELD.h/2);  // 5

const SPEED = 320;

const LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;
const IDLE = -1, MOVING = 1, SLIDING = 2, SWITCHING = 3;
const OVERWORLD = 0, DUNGEON = 1, SHOP = 2;

export default class Player extends Entity {

  constructor(xG, yG, dir, type) {
    super(xG, yG, dir, SPEED, 9)
    this.switched = null;
    this.worldtype = type;
    this.img = document.getElementById("link");
    this.state = IDLE;
    this.aFrame = 0;
    this.switching = [null,null,null];

    this.health = 3.5;
    this.maxHealth = 8;
  }

  // Set player coordinates
  setPlayer(level, target) {
    this.xG = target.xG;
    this.yG = target.yG;
    this.dir = target.dir;
    this.x = target.xG*32;
    this.y = target.yG*32;
    this.worldtype = target.type;
  }

  getWorldType() {
    return this.worldtype;
  }

  hasItem(char) {
    return this.items.itemList.includes(char);
  }

  update(secondsPassed, levelHandler, keys)
  {
    if(this.state == IDLE) {
      this.aFrame = 1;
      this.moved = 0;
      this.timePassed = 0;

      if(keys.isDown(keys.RIGHT)) { this.state = this.movePlayer(RIGHT, levelHandler); }
      else if(keys.isDown(keys.LEFT)) { this.state = this.movePlayer(LEFT, levelHandler); }
      else if(keys.isDown(keys.UP)) { this.state = this.movePlayer(UP, levelHandler); }
      else if(keys.isDown(keys.DOWN)) { this.state = this.movePlayer(DOWN, levelHandler); }
    }
    else {

      var speed = this.mSpeed * secondsPassed;
      if(this.moved < SIZE-speed) {  // Normal speed until remainder to 32 pixels is less than 1 speed update
        this.updateCoordinates(speed, this.dir);
        this.moved += Math.abs(XDIR[this.dir]*speed) + Math.abs(YDIR[this.dir]*speed);
      }
      else {  // Final step to hit 32 pixels
        this.updateCoordinates((SIZE-this.moved), this.dir);

        if(this.state != SWITCHING)  // Swapping overworld map tile
          this.updateGridCoordinates(this.dir);

        this.state = IDLE;
        this.checkCurrentTile(levelHandler);
      }
    }
    if(this.state == MOVING) this.updateAnimation(secondsPassed)  // Calculate switching animation image
  }

  // A button was pressed. Update direction and check tile.
  movePlayer(dir, levelHandler) {
    let room = levelHandler.getRoom();
    this.dir = dir;  // Set direction

    if(this.xG == 0 && dir==LEFT)
      return this.switchRoom(room.width*32, room.width-1, LEFT, levelHandler);
    else if(this.xG == room.width-1 && dir==RIGHT)
      return this.switchRoom(-32, 0, RIGHT, levelHandler);
    else if(this.yG == 0 && dir==UP)
      return this.switchRoom(room.height*32, room.height-1, UP, levelHandler);
    else if(this.yG == room.height-1 && dir==DOWN)
      return this.switchRoom(-32, 0, DOWN, levelHandler);
    else  // Not at the side of screen so check normal movement.
      return this.checkNextTile(dir, room);
  }

  // Check if our current room is at the edge of the map (overworld or level)
  isAtMapRoomEdge(levelHandler) {
    let id = levelHandler.currentLevel.getRoomId();
    let xRoomG = id%levelHandler.width;
    let yRoomG = Math.floor(id/levelHandler.width);
    let edge =
      (xRoomG === 0 && this.dir === LEFT) ||
      (xRoomG === levelHandler.width-1 && this.dir === RIGHT) ||
      (yRoomG === 0 && this.dir === UP) ||
      (yRoomG === levelHandler.height-1 && this.dir === DOWN);
    return edge;
  }

  // Switch to next room
  switchRoom(crd, gridCrd, dir, levelHandler) {
    // Exit shop, enter overworld again
    if(this.worldtype === SHOP)
      return levelHandler.loadWorld(this,0);

    // Exit dungeon, enter overworld again
    if(this.worldtype === DUNGEON && this.isAtMapRoomEdge(levelHandler))
      return levelHandler.loadWorld(this,0);

    // To next room
    if(dir === LEFT || dir === RIGHT) {
      this.xG = gridCrd;
      this.x = crd;
    }
    else {
      this.yG = gridCrd;
      this.y = crd;
    }

    levelHandler.moveRoom(dir, this.worldtype);
    return SWITCHING;
  }

  // Check if next tile is possible to move to or has an item
  checkNextTile(dir, level) {
    var tile = this.getNextTile(dir, level);
    if((DUNGEON_TILES.includes(tile) && this.worldtype !== OVERWORLD) || (OVERWORLD_TILES.includes(tile) && this.worldtype === OVERWORLD))  // regular floor tile
      return MOVING;
    else if(tile==="f" && (dir === UP || dir === LEFT))
      return SLIDING;
    else if(tile==="h" && (dir === UP || dir === RIGHT))
      return SLIDING;
    else if(tile==="i" && (dir === RIGHT || dir === DOWN))
      return SLIDING;
    else if(tile==="j" && (dir === LEFT || dir === DOWN))
      return SLIDING;
    else if(tile === "^" && this.hasItem("T"))  // blue door and key
      return MOVING;
    else if(tile === "]" && this.hasItem("S"))  // red door and key
      return MOVING;
    else if(tile === "Z" && this.hasItem("R"))  // yellow door and key
      return MOVING;
    else if(tile === "[" && this.hasItem("Q"))  // green door and key
      return MOVING;
    else
      return IDLE;
  }

  checkNextOverworldTile() {

  }

  checkNextDungeonTile() {

  }

  checkNextShopTile() {

  }

  checkCurrentTile(levelHandler) {
    let room = levelHandler.getRoom();
    let grid = room.getGrid();
    let xG = this.xG;
    let yG = this.yG;

    switch(this.worldtype) {
      case 0: this.checkOverworldTile(xG, yG, grid, levelHandler); break;
      case 1: this.checkDungeonTile(xG, yG, grid, levelHandler); break;
      case 2: this.checkShopTile(xG, yG, grid, levelHandler); break;
    }
  }

  checkOverworldTile(xG, yG, grid, levelHandler) {
    this.mSpeed = SPEED;
    this.aSpeed = 9;
    switch(grid[yG][xG]) {
      case "0":  // Check tunnel/shop/dungeon entry points
      case "C":
      case "M":
      case "W":
        levelHandler.loadWorld(this,1);
        break;
      case "i":  // slow speed on ladder
        this.mSpeed = SPEED/2;
        this.aSpeed = 24;
        break;
    }
  }

  checkShopTile(xG, yG, grid, levelHandler) {

  }

  checkDungeonTile(xG, yG, grid, levelHandler) {
    let room = levelHandler.getRoom();
    switch(grid[yG][xG]) {
      case "d":  // back to OVERWORLD
        levelHandler.loadWorld(this,0);
        break;
      case "Q":  // green key
        room.setGridTile(xG, yG, "1");
        this.items.addItem("Q");
        break;
      case "R":  // yellow key
        room.setGridTile(xG, yG, "1");
        this.items.addItem("R");
        break;
      case "S":  // red key
        room.setGridTile(xG, yG, "1");
        this.items.addItem("S");
        break;
      case "T":  // blue key
        room.setGridTile(xG, yG, "1");
        this.items.addItem("T");
        break;
      case "N":  // fire shoe
        room.setGridTile(xG, yG, "1");
        this.items.addItem("N");
        break;
      case "X":  // flipper
        room.setGridTile(xG, yG, "1");
        this.items.addItem("X");
        break;
      case "b":  // magnetic shoe
        room.setGridTile(xG, yG, "1");
        this.items.addItem("b");
        break;
      case "e":  // spikes
        room.setGridTile(xG, yG, "1");
        this.items.addItem("e");
        break;
      case "=":  // green button
        room.toggle("=");
        break;
      case "G":  // purple button
        room.toggle("G");
        break;
      case "g":  // straight ice
        if(this.hasItem("e")) break;  // don't slide with spikes
        this.resetMovement(SLIDING);
        if(this.checkNextTile(this.dir, room) >= 0) {  // valid move. slide on!
        }
        else {  // switch direction when next tile is a wall
          if(this.dir%2 == 0) this.dir +=1;  // 0 -> 1 and 2 -> 3
          else this.dir -=1;                 // 1 -> 0 and 3 -> 2
        }
        break;
      case "f":  // top left corner ice
        if(this.hasItem("e")) break;  // don't slide with spikes
        this.resetMovement(SLIDING);
        this.dir = this.dir == UP ? RIGHT : DOWN;
        break;
      case "h":  // top right corner ice
        if(this.hasItem("e")) break;  // don't slide with spikes
        this.resetMovement(SLIDING);
        this.dir = this.dir == RIGHT ? DOWN : LEFT;
        break;
      case "i":  // bottom right corner ice
        if(this.hasItem("e")) break;  // don't slide with spikes
        this.resetMovement(SLIDING);
        this.dir = this.dir == DOWN ? LEFT : UP;
        break;
      case "j":  // bottom left corner ice
        if(this.hasItem("e")) break;  // don't slide with spikes
        this.resetMovement(SLIDING);
        this.dir = this.dir == LEFT ? UP : RIGHT;
        break;
      case "U":  // Triforce
        alert("Level complete!")
        this.levelDone = true;
        break;
      case "O":  // Fire
        if(!this.hasItem("N")) {
          alert("You need Fire shoes!");
        }
        break;
      case "Y":  // Fire
        if(!this.hasItem("X")) {
          alert("You need Flippers to swim!");
        }
        break;
      case "^":  // blue door
      case "Z":  // yellow door
      case "[":  // green door
      case "]":  // red door
        room.setGridTile(xG, yG, "1");
        break;
      case "7":
        this.items.reset();
        break;
    }
  }

  resetMovement(state) {
    this.moved = 0;
    this.timePassed = 0;
    this.state = state;
  }

  draw(ctx) {
    ctx.drawImage(this.img, SIZE*this.dir + SIZE*4*this.aFrame, 0 , SIZE, SIZE, this.x, this.y + YOFFSET, SIZE, SIZE);
  }
}
