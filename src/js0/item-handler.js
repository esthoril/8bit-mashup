const SIZE = 32;

let time = 0;

export default class Items {

  constructor(img, bar) {
    this.items = new Array();
    this.itemList = new Array();
    this.list = ITEMS;
    this.show = false;
    this.showItems = false;
    this.bar = bar;
    this.y = -352;
    this.selectedItem = 0;
    this.aFrame = 0;
  }

  addItem(char) {
    for(var i=0;i<this.list.length;i++) {
      if(this.list[i].sprite === char) {
        console.log("Picked up: " + this.list[i].name)
        this.items.push(this.list[i]);
        this.itemList.push(char);
      }
    }
  }

  reset() {
    this.items = [];
    this.itemList = [];
  }

  update(secondsPassed, keys)
  {
    this.toggleItems(keys);
    if(this.showItems && this.y < 0) {
      this.y += 16;
     }
    if(!this.showItems && this.y > -352) {
      this.y -= 16;
    }

    time+=.6;
    if(time >= 4.8) {
      this.aFrame = this.aFrame==0 ? 1 : 0;
      time = 0;
    }
  }

  // Some non-game functionality
  toggleItems(keys) {
    if(keys.isDown(73) && !this.show) {
      this.show = true;
      this.showItems = !this.showItems;
      console.log("Toggle items: " + this.showItems);
    }
    if(!keys.isDown(73) && this.show) {
      this.show = false;
    }
  }

  draw(ctx, levelHandler, player) {
    ctx.fillStyle = "rgba(0,0,0,1)";//'#D1E5FF';
    ctx.fillRect(0, this.y, 544, 480);

    this.drawTop(ctx, (this.y+352), levelHandler, player);
    if(this.showItems)
      this.drawItemOverview(ctx, this.y);
  }

  drawTop(ctx, offset, levelHandler, player) {
    // Overworld map
    let id = levelHandler.currentLevel.getWorldId();
    let type = player.worldtype;
    ctx.fillStyle = "rgba(102,102,102,1)";//'#D1E5FF';
    ctx.fillRect(12, 24+this.y+352, 180, 80);
    if(type === 0) {  // draw overworld location
      let xL = id%levelHandler.width;
      let yL = Math.floor(id/levelHandler.width);
      ctx.fillStyle = "rgba(192,192,192,1)";//'#D1E5FF';
      ctx.fillRect(12+xL*30, 24+yL*20 + offset, 30, 20);
    }

    // B A item
    ctx.drawImage(this.bar, 0, 200, 84, 60, 240, 48 + offset, 84, 60);

    // Health bar
    let health = player.health;
    ctx.drawImage(this.bar, 308, 200, 84, 16, 348, 48 + offset, 84, 16);

    for(let i=1; i<21; i++) {
      let xH = (i-1)%10;
      let yH = Math.floor((i-1)/10);
      if(i<=player.health)
        ctx.drawImage(this.bar, 260, 200, 16, 16, 348 + xH*18, 72 + offset + yH*18, 16, 16);
      else if(i-0.5<=player.health)  // half heart
        ctx.drawImage(this.bar, 276, 200, 16, 16, 348 + xH*18, 72 + offset + yH*18, 16, 16);
      else if(i<=player.maxHealth)
        ctx.drawImage(this.bar, 292, 200, 16, 16, 348 + xH*18, 72 + offset + yH*18, 16, 16);
      else
        ctx.drawImage(this.bar, 244, 200, 16, 16, 348 + xH*18, 72 + offset + yH*18, 16, 16);
    }
  }

  drawItemOverview(ctx, offset) {
    // Item selection
    ctx.drawImage(this.bar, 84, 200, 160, 88, 26, 26+offset, 160, 88);

    let xI = this.selectedItem%4;
    let yI = Math.floor(this.selectedItem/4);
    ctx.drawImage(this.bar, 244+this.aFrame*36, 216, 36, 36, 34+xI*36, 34+yI*36+offset, 36, 36);  // Selected item
    ctx.fillStyle = "rgba(192,192,192,1)";
    for(let i=0; i<8; i++) {
      let xH = i%4;
      let yH = Math.floor(i/4);
      ctx.fillRect(36+xH*36,36+yH*36+offset,32,32);
    }

    // Triforce
  }

    // Item selection


    /*
    for(var i=0;i<this.items.length;i++) {
      var item = this.items[i];
      var char = item.sprite.charCodeAt() - 48;
      var xSpriteOffset = char%10;
      var ySpriteOffset = Math.floor(char/10);
      ctx.drawImage(this.img, SIZE*xSpriteOffset, SIZE*ySpriteOffset, SIZE, SIZE, item.position.x*SIZE, item.position.y*SIZE, SIZE, SIZE);
    }
    */
}
