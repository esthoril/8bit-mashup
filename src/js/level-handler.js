import Room from './room.js';

export default class LevelHandler
{
	constructor(data)
	{
		this.imgOverworld = document.getElementById("tiles_overworld");

		this.overworld = new Array(WORLD_H);
		for(let i=0; i<WORLD_H; i++) {
  		this.overworld[i] = new Array(WORLD_W);
		}

		data.forEach(obj => {
			const row = obj["row"];
			const col = obj["col"];
			this.overworld[row][col] = new Room(obj);
			console.log(`Add room ${row}, ${col}`);
		});
	}

	loadRoom(row, col)
	{
		this.current = this.overworld[row][col];
		this.current.reset();
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

	getRoom() { return this.current; }

	switchRoom(dir)
	{
		// Set resetTime for current room
		this.getRoom().setReset()
		// Fetch next room
		const row = this.current.getRow() + YDIR[dir];
		const col = this.current.getCol() + XDIR[dir];
		this.loadRoom(row, col);
		console.log(`Switching to room (${row}, ${col})`);
	}

	update(secondsPassed)
	{
		this.current.update(secondsPassed);
	}

	draw(ctx)
	{
		this.current.draw(ctx);
	}
}