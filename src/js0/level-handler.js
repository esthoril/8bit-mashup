
//import Level from './level.js';
import Dungeon from './dungeon.js';
import Overworld from './overworld.js';
import Shop from './shop.js';

function loadJson(file, handler, callback)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `/assets/res/${file}`, true);
		xhr.responseType = 'text';
		xhr.onload = function(e)
		{
			callback(JSON.parse(this.responseText), handler);
		}
		 xhr.send();
	}

class LevelHandler {

	constructor(type, id, mobHandler) {
		this.overworld = null;
		console.log("Reading level files");
		loadJson('overworld.json', this, function(data, handler) {
			console.log(data.width);
			handler.overworld = data;
		});
		console.log(this.overworld.width);

		this.currentLevel = this.loadWorldFromId(type, id);
		this.mobHandler = mobHandler;
	}


	getWorldId() {
		return this.currentLevel.getWorldId();
	}

	// Moving around in the overworld
	moveRoom(dir, type) {
		var roomId = this.currentLevel.getRoomId();
		switch(dir) {
			case 0: roomId -= 1; break;  // LEFT
			case 1: roomId += 1; break; // RIGHT
			case 2: roomId -= this.width; break; // UP
			case 3: roomId += this.width; break; // DOWN
			default: console.log("No direction")
		}
		this.currentLevel = this.loadRoom(type, roomId);
		this.currentLevel.setMobs(this.mobHandler);
	}

	loadRoom(type, roomId) {
		switch(type) {
			case 0:  // overworld
				console.log("Loading overworld room: " + roomId)
				return new Overworld(this.overworld.rooms.filter(level => level.id === roomId)[0]);
			case 1:  // level
				console.log("Loading dungeon room: " + roomId)
				let worldId = this.currentLevel.getWorldId();
				let dungeon = DUNGEONS.filter(dungeon => dungeon.id === worldId)[0];
				let room = dungeon.rooms.filter((room) => room.id === roomId)[0];
				return new Dungeon(room, worldId);
		}
	}

	// Helper function to load map
	loadWorld(player, type) {
		let id = this.currentLevel.getWorldId();
		for(let i=0; i<LINKS.length; i++) {
			let origin = LINKS[i].link;
			if(origin[0].id === id) {  // check first part of links for match
				var target = origin[1];
			}
			if(origin[1].id === id) {  // check second part of links for match
				var target = origin[0];
			}
		}
		this.currentLevel = this.loadWorldFromId(target.type, target.id);
		player.setPlayer(this.currentLevel, target);
		console.log("New world type: " + target.type);
	}

	loadWorldFromId(type, id)
	{
		switch(type) {
			case 0:
				this.setDimension(this.overworld.width, this.overworld.height);
				return new Overworld(this.overworld.rooms.filter(level => level.id === id)[0]);
			case 1:
				let level = DUNGEONS.filter(level => level.id === id)[0];
				let room = level.rooms.filter((room) => room.id === level.start)[0];
				this.setDimension(level.width, level.height);
				return new Dungeon(room, id);
			case 2:
				return new Shop(SHOPS.filter(level => level.id === id)[0]);
		}
	}

	// Set dimension of current world (overworld or level)
	setDimension(w, h) {
		this.width = w;
		this.height = h;
	}

	getRoom() {
		return this.currentLevel;
	}

	update(secondsPassed) {
		this.currentLevel.update(secondsPassed);
	}

	draw(ctx, worldtype) {
		this.currentLevel.draw(ctx);
	}
}

export default LevelHandler;
