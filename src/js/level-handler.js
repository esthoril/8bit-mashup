import Room from './room.js';
import Dungeon from './dungeon.js';

export default class LevelHandler
{
	constructor(data, type)
	{
		console.log(`Loading world ${type}`);
		this.map = new Array(WORLD_H);
		for(let i=0; i<WORLD_H; i++) {
  		this.map[i] = new Array(WORLD_W);
		}

		data.forEach(obj => {
			const row = obj["row"];
			const col = obj["col"];
			if(type == WORLD.OVERWORLD)
				this.map[row][col] = new Room(obj, OVERWORLD_SPRITE, OVERWORLD_CHARS);
			if(type == WORLD.DUNGEON)
				this.map[row][col] = new Dungeon(obj, DUNGEON_SPRITE, DUNGEON_CHARS);
			console.log(`Add room: ${row}, ${col}`);
		});
	}

	loadRoom(row, col)
	{
		console.log(`Loading room: ${row}, ${col}`);
		this.current = this.map[row][col];
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