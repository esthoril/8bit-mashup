import Room from './room.js';

export default class WorldHandler
{
	constructor(overworld)
  {
    this.type = WORLD.OVERWORLD;

    this.overworld = overworld;
    this.room = null;

    this.map = overworld;
  }

  getType() { return this.type; }
  getMap() { return this.map; }
  getRoom() {
    if(this.type == WORLD.OVERWORLD || this.type == WORLD.DUNGEON)
      return this.map.getRoom();
    else if(this.type == WORLD.SHOP)
      return this.room;
  }

  update()
  {
    this.map.update();
  }

  draw(ctx)
  {
    this.map.draw(ctx);
  }

  loadOverworld()
  {
    this.map = this.overworld;
    this.type = WORLD.OVERWORLD;
  }

  loadMap(map, player)
  {
    let this_ = this;
    loadJson(map, function(data) {
      this_.type = WORLD.SHOP;
      this_.room = new Room(data, DUNGEON_SPRITE, DUNGEON_CHARS);
      const entrance = data["entrance"];
      player.setCoordinates(entrance[0], entrance[1]);
    });
  }
}

function loadJson(file, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `/assets/res/${file}`, true);
	xhr.responseType = 'text';
	xhr.onload = function(e)
	{
		callback(JSON.parse(this.responseText));
	}
	 xhr.send();
}