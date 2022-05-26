import AudioPlayer from './audio-player.js';
import KeyListener from './key-listener.js';
import Player from './player.js';
import MobHandler from './mob-handler.js';
import LevelHandler from './level-handler.js';
import Items from './item-handler.js';

let secondsPassed;
let oldTimeStamp;
let fps;

const DEBUG = false;

// sleep time expects milliseconds
function sleep(time)
{
	return new Promise((resolve) => setTimeout(resolve, time));
}

class Gameloop
{
	constructor()
	{
		this.audio = null;
		this.keyListener = null;
		this.canvas = document.getElementById("viewport");
		this.context = this.canvas.getContext("2d");
		this.fps = null;
		this.loop = this.loop.bind(this)
		this.zoom = false;

		this.init();
	}

	init()
	{
		//this.audio = new AudioPlayer('assets/music/02-overworld.mp3', () => {
		//  this.stopMusic = this.audio.play({ loop: true, offset: 1, volume: 0.4 });
		//});

		this.keyListener = new KeyListener();
		this.keyListener.subscribe([
			this.keyListener.LEFT,
			this.keyListener.RIGHT,
			this.keyListener.UP,
			this.keyListener.DOWN,
			this.keyListener.SPACE,
			65,  // A
			90,  // Z
			73,  // I items
			83,  // S start
			87   // W
		]);

		//this.mobs = new MobHandler();
		//this.items = new Items(null, document.getElementById("items"));
		this.level = new LevelHandler(0, 51, this.mobs);  // starting level type, id
		this.player = new Player(8, 6, 2, 0);  // starting level coordinates and direction

		sleep(120).then(() => { window.requestAnimationFrame(this.loop); });  // wait 120ms before starting loop
	}

	loop(timeStamp)
	{
		secondsPassed = (timeStamp - oldTimeStamp) / 1000;
		oldTimeStamp = timeStamp;

		//Calculate fps
		this.fps = Math.round(1 / secondsPassed);

		this.update(secondsPassed, this.level, this.keyListener);
		this.draw();

		// The loop function has reached it's end
		// Keep requesting new frames
		window.requestAnimationFrame(this.loop);
	}

	// Update objects
	update(secondsPassed, level, keys)
	{
		//this.setZoom();

		//if(!this.items.showItems) {  // Don't update when viewing items
		  let room = level.getRoom();
		  this.levels.update(secondsPassed);
		//  this.mobs.update(secondsPassed, room);
		  this.player.update(secondsPassed, levelHandler, keys);
		//}
		//this.items.update(secondsPassed, keys);
	}

	// Some non-game functionality
	//setZoom()
	//{
	//  if(this.keyListener.isDown(87) && !this.zoom) {
	//		console.log("Toggle zoom")
	//		this.zoom = true;
	//		let $wrapper = document.querySelector(".wrapper");
	//		$wrapper.classList.toggle("large");
	//	}
	//	if(!this.keyListener.isDown(87) && this.zoom) {
	//		this.zoom = false;
	//	}
	//}

	// Draw objects
	draw()
	{
		var ctx = this.context;

		// Draw objects
		let type = this.player.getWorldType();
		//if(!this.items.showItems) {  // Don't update when viewing items
		//	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);  // Clear background
		//	this.levels.draw(ctx, type);
	//		this.mobs.draw(ctx);
			this.player.draw(ctx);
		//}
		//this.items.draw(ctx, this.levels, this.player);

		if(DEBUG)
			this.drawDebug(ctx);
	}

	drawDebug(ctx)
	{
		ctx.fillStyle = "rgba(209,229,255,1)";//'#D1E5FF';
		ctx.fillRect(320, 0, 224, 128);

		let worldId = this.levels.currentLevel.getWorldId();
		let roomId = this.levels.currentLevel.getRoomId();
		let xG = this.player.xG;
		let yG = this.player.yG;
		let xL = roomId%this.levels.width;
		let yL = Math.floor(roomId/this.levels.width);

		ctx.font = '17px Courier';
		ctx.fillStyle = 'black';
		ctx.fillText("FPS: " + this.fps, 324, 20);
		ctx.fillText("Grid Player: " + xG + ' ' + yG, 324, 40);
		ctx.fillText("     world : " + this.levels.width + "x" + this.levels.height, 324, 60);
		ctx.fillText("     room  : " + xL + " " + yL, 324, 80);
		ctx.fillText("Id   world : " + worldId, 324, 100);
		ctx.fillText("     room  : " + roomId, 324, 120);

		//this.drawTilesetTable(ctx);
	}

	drawTilesetTable(ctx)
	{
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0,640,512);
		ctx.fillStyle = "#000";
		for(var i=1;i<=9;i++) {
			ctx.beginPath();
			ctx.moveTo(i*64,0);
			ctx.lineTo(i*64,512);
			ctx.stroke();
		}
		for(var j=1;j<=7;j++) {
			ctx.beginPath();
			ctx.moveTo(0,j*64);
			ctx.lineTo(640,j*64);
			ctx.stroke();
		}
		for(var i=0;i<=9;i++) {
			for(var j=0;j<=7;j++) {
				var val = i+j*10+48;
				ctx.fillStyle = "#600";
				ctx.fillText(String.fromCharCode(val), i*64+6,(j+1)*64-46)  // character
				ctx.fillStyle = "#CCF";
				ctx.fillText(val, i*64+6,(j+1)*64-26)  // ASCII value
				ctx.fillStyle = "#060";
				ctx.fillText(val-48, i*64+6,(j+1)*64-6)  // ASCII value
			}
		}
	}
}

export default Gameloop;
