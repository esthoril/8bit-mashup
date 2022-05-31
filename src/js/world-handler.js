import LevelHandler from './level-handler.js';

export default class WorldHandler
{
	constructor(data)
  {
    this.overworld = new LevelHandler(data);
  }

  getCurrent() { return this.overworld; }

  update()
  {
    this.overworld.update();
  }

  draw(ctx)
  {
    this.overworld.draw(ctx);
  }

  loadMap(map)
  {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `/assets/res/${map}`, true);
    xhr.responseType = 'text';
    xhr.onload = function(e)
    {
      console.log(JSON.parse(this.responseText));
    }
    xhr.send();
  }
}