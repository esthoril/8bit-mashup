import Room from './room.js';
import LevelHandler from './level-handler.js';


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

  loadDungeon(map, player)
  {
    let this_ = this;
    loadJson(map, function(data) {
			console.log(`Loading dungeon ${data[0]["COMMENT"]}`)
      this_.type = WORLD.DUNGEON;
      this_.map = new LevelHandler(data, WORLD.DUNGEON);
      const entrance = data[0]["entrance"]; // First room needs entrance field
      player.setCoordinates(entrance[0], entrance[1]);
			this_.map.loadRoom(1, 1);
    });
  }

  loadShop(map, player)
  {
    let this_ = this;
    loadJson(map, function(data) {
			console.log(`Loading shop ${data["COMMENT"]}`)
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