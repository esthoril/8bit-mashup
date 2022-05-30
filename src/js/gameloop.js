import AudioPlayer from './audio-player.js';
import KeyListener from './key-listener.js';
import LevelHandler from './level-handler.js';
import Player from './player.js';

let secondsPassed;
let oldTimeStamp;
let fps;


// sleep time expects milliseconds
function sleep(time)
{
	return new Promise((resolve) => setTimeout(resolve, time));
}

class Gameloop
{
	constructor(data)
	{
		this.audio = null;
		this.keyListener = null;
		this.lhandler = null;
		this.room = null;

		this.canvas = document.getElementById("viewport");
		this.context = this.canvas.getContext("2d");

		this.fps = null;
		this.loop = this.loop.bind(this)
		this.zoom = false;

		this.init(data);
	}

	init(data)
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
			81,  // Q
			90,  // Z
			73,  // I items
			83,  // S start
			87   // W
		]);

		this.lhandler = new LevelHandler(data);  // starting level type, id
		this.lhandler.loadRoom(5, 8);
		this.player = new Player(7, 5, 0);

		sleep(120).then(() => { window.requestAnimationFrame(this.loop); });  // wait 120ms before starting loop
	}

	loop(timeStamp)
	{
		secondsPassed = (timeStamp - oldTimeStamp) / 1000;
		oldTimeStamp = timeStamp;

		//Calculate fps
		this.fps = Math.round(1 / secondsPassed);

		this.update(secondsPassed, this.keyListener);
		this.draw();

		// The loop function has reached it's end
		// Keep requesting new frames
		window.requestAnimationFrame(this.loop);
	}

	// Update objects
	update(secondsPassed, keys)
	{
		this.lhandler.update(secondsPassed);
		this.player.update(secondsPassed, this.lhandler, keys);
	}

	// Draw objects
	draw()
	{
		var ctx = this.context;
		this.lhandler.draw(ctx); // Draw current room
		this.player.draw(ctx);
		this.drawInfo(ctx);
	}

	drawInfo(ctx)
	{
		const XPOS = 0, YPOS = 352;
		ctx.fillStyle = "rgba(0,0,0,1)";
		ctx.fillRect(XPOS, YPOS, ROOM_W*32, 128);

		const player = this.player;
		const room = this.lhandler.getRoom();

		ctx.font = '17px Courier';
		ctx.fillStyle = '#EEE';
		ctx.fillText("FPS        : " + this.fps, 10, YPOS+20);
		ctx.fillText("Grid player: " + player.yG + ' ' + player.xG, 10, YPOS+40);
		ctx.fillText("Grid room  : " + room.getRow() + ' ' + room.getCol(), 10, YPOS+60);
	}
}

export default Gameloop;
