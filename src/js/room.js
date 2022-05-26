import {
	RedSpike,
	BlueSpike
} from './mob.js';

const IMG = document.getElementById("tiles_overworld");

export default class Room
{
	constructor(obj)
	{
		this.resetTime = 0;

		this.tiles = obj["tiles"];
		this.width = this.tiles[0].length; // 16 by default
		this.height = this.tiles.length; // 11 by default

		this.row = obj["row"];
		this.col = obj["col"];
		this.mobs = obj["mobs"];
 		this.mobSprite = document.getElementById("mobs");
		this.mobList = new Array();

		//if(obj.hasOwnProperty('mobs'))
		if(this.mobs != null)
			this.setMobs();
	}

	getTile(row, col) { return this.tiles[col][row]; }
	getRow(row) { return this.row; }
	getCol(col) { return this.col; }

	update(secondsPassed)
	{
		for(let m=0; m<this.mobList.length; m++) {
			this.mobList[m].update(secondsPassed, this.tiles);
		}
	}

	draw(ctx)
	{
		for(let i=0; i<this.width; i++) {
			for(let j=0; j<this.height; j++) {
				const char = this.tiles[j][i];
				if(char in CHARS) {
					const coord = CHARS[char];
					ctx.drawImage(
						IMG,
						32*coord[1], 32*coord[0],	32, 32, // Crop image sprite
						i*SIZE, j*SIZE, SIZE, SIZE // Place image in canvas
					);
				}
			}
		}

		for(let m=0; m<this.mobList.length; m++) {
			this.mobList[m].draw(ctx, this.mobSprite);
		}
	}

	setReset()
	{
		this.resetTime = new Date().getTime();
	}

 	/**
	 * Reset mobs if last visit > 300 seconds
	 */
	reset()
	{
		const t = new Date().getTime();
		let diff = (t - this.resetTime)*1000; // seconds
		console.log(`Time since last visit ${diff}`);

		if(this.mobs != null && diff > 10) {
			this.mobList = [];
			this.setMobs();
		}
	}

	setMobs()
	{
		//let mob = this.mobs[0];
		//this.mobList.push(new RedSpike(mob[0], mob[1], mob[2]));

		this.mobs.forEach(mob => {
			switch(mob[3]) { // Mob type
				case 0:
					break;
				case 1:
					this.mobList.push(new RedSpike(mob[0], mob[1], mob[2]));
					break;
				case 2:
					this.mobList.push(new BlueSpike(mob[0], mob[1], mob[2]));
					break;
				default:
					console.log(`Unknown mob type: ${mob[3]}`);
			}
		});
	}
}