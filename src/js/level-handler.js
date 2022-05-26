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

	load(row, col)
	{
		this.current = this.overworld[row][col];
		console.log(this.current);
		this.current.reset();
	}

	getRoom() { return this.current; }

	switch(dir)
	{
		// Set resetTime for current room
		this.getRoom().setReset()
		// Fetch next room
		const row = this.current.getRow() + YDIR[dir];
		const col = this.current.getCol() + XDIR[dir];
		this.load(row, col);
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