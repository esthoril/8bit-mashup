import Room from './room.js';
const SIZE = 32;
const ANIMATION = [">","@","H","J","O","8","L","V"];

let time = 0;

const PLAYINGFIELD = {"w": 17, "h": 11}
const YOFFSET = 128;

class Shop extends Room {

  constructor(level) {
    super(level, document.getElementById("tiles_dungeon"));
    this.worldId = level.id;
    this.text = level.text;
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

    if(this.text != null)
      this.drawText(ctx);
  }

  drawText(ctx) {
    for(let t=0; t<this.text.length; t++) {
      let text = this.text[t];
      for(var j=0;j<text.content.length; j++) {  // for each line of text
        let content = text.content[j].toUpperCase();
        for(let i=0; i<content.length; i++) {  // for each char in that line
          let char = content[i].charCodeAt();
          switch(char) {
            case 32: break;  // space
            case 46: ctx.drawImage(this.img, 12*16, 256, 16, 16, 0+i*16+this.text.x, j*18+this.text.y + YOFFSET, 16, 16); break;  // .
            case 39: ctx.drawImage(this.img, 10*16, 256, 16, 16, 0+i*16+this.text.x, j*18+this.text.y + YOFFSET, 16, 16); break;  // '
            case 33: ctx.drawImage(this.img, 11*16, 256, 16, 16, 0+i*16+this.text.x, j*18+this.text.y + YOFFSET, 16, 16); break;  // !
            default:
              let xTile = (char-48)%17;
              let yTile = Math.floor((char-48)/17);
              ctx.drawImage(this.img, xTile*16, yTile*16+256, 16, 16, 0+i*16+text.x, j*18+text.y + YOFFSET, 16, 16);
          }
        }
      }
    }
  }
}

export default Shop;
