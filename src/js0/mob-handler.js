import Mob from './mob.js';

let LEFT = 0, RIGHT = 1, UP = 2, DOWN = 3;

export default class MobHandler {

  constructor() {
    this.img = document.getElementById("mobs");

    this.mobList = new Array();
    //this.mobList.push(new Mob(9, 8, DOWN, this.mobs[0]));
  }

  reset() {
    this.mobList = [];
  }

  addMob(xG, yG, dir, mob) {
    this.mobList.push(new Mob(xG, yG, dir, mob));
  }

  update(secondsPassed, level) {
    for(var m=0;m<this.mobList.length;m++) {
      this.mobList[m].update(secondsPassed, level);
    }
  }

  draw(ctx) {
    for(var m=0;m<this.mobList.length;m++) {
      this.mobList[m].draw(ctx, this.img);
    }
  }
}
