import {
	RedSpike,
	BlueSpike,
	Ghost,
	RedDog,
	BlueDog,
	RedCentaur,
	BlueCentaur
} from './mob.js';


export default class Dungeon
{
	constructor(obj, img, charset)
	{
		this.resetTime = 0;

		this.tiles = obj["tiles"];
		this.width = this.tiles[0].length; // 16 by default
		this.height = this.tiles.length; // 11 by default

		this.img = img;
		this.img_walls = document.getElementById("items");
		this.charset = charset;

		this.row = obj["row"];
		this.col = obj["col"];
		this.mobs = obj["mobs"];
		this.links = obj["link"];
 		this.mobSprite = document.getElementById("mobs");
		this.mobList = new Array();

		//if(obj.hasOwnProperty('mobs'))
		if(this.mobs != null)
			this.setMobs();
	}

	getTile(row, col) { return this.tiles[col][row]; }
	getRow(row) { return this.row; }
	getCol(col) { return this.col; }
	getLink() { return this.links; }

	update(secondsPassed)
	{
		for(let m=0; m<this.mobList.length; m++) {
			this.mobList[m].update(secondsPassed, this.tiles);
		}
	}

	draw(ctx)
	{
		// Walls
		ctx.drawImage(this.img_walls, 0, 136, 544, 32, 0, 0, 544, 32);
		ctx.drawImage(this.img_walls, 0, 168, 544, 32, 0, 320, 544, 32);
		ctx.drawImage(this.img_walls, 544, 0, 32, 288, 0, 32, 32, 288);
		ctx.drawImage(this.img_walls, 576, 0, 32, 288, 512, 32, 32, 288);
		//ctx.drawImage(this.img_walls, 0, 136, 544, 40, 0, 0, 544, 40);
		// Doors
		// Tiles
		for(let i=0; i<this.width; i++) {
			for(let j=0; j<this.height; j++) {
				const char = this.tiles[j][i];
				if(char in this.charset) {
					const coord = this.charset[char];
					ctx.drawImage(
						this.img,
						32*coord[1], 32*coord[0],	32, 32, // Crop image sprite
						(i+1)*SIZE, (j+1)*SIZE, SIZE, SIZE // Place image in canvas
					);
				}
			}
		}
		// Mobs
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
		let diff = (t - this.resetTime)/1000; // seconds
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
				case 0: this.mobList.push(new RedSpike(mob[0], mob[1], mob[2])); break;
				case 1: this.mobList.push(new BlueSpike(mob[0], mob[1], mob[2])); break;
				case 2: this.mobList.push(new Ghost(mob[0], mob[1], mob[2])); break;
				case 3: this.mobList.push(new RedDog(mob[0], mob[1], mob[2])); break;
				case 4: this.mobList.push(new BlueDog(mob[0], mob[1], mob[2])); break;
				case 5: this.mobList.push(new RedCentaur(mob[0], mob[1], mob[2])); break;
				case 6:	this.mobList.push(new BlueCentaur(mob[0], mob[1], mob[2]));	break;
				default:
					console.log(`Unknown mob type: ${mob[3]}`);
			}
		});
	}
}