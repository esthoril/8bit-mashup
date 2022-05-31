import Room from './room.js';

export default class LevelHandler
{
	constructor(data)
	{
		this.overworld = new Array(WORLD_H);
		for(let i=0; i<WORLD_H; i++) {
  		this.overworld[i] = new Array(WORLD_W);
		}

		data.forEach(obj => {
			const row = obj["row"];
			const col = obj["col"];
			this.overworld[row][col] = new Room(obj, OVERWORLD_SPRITE, OVERWORLD_CHARS);
			console.log(`Add room ${row}, ${col}`);
		});
	}

	loadRoom(row, col)
	{
		this.current = this.overworld[row][col];
		this.current.reset();
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