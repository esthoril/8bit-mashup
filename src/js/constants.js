const OVERWORLD_TILES = ["D",":","0", "i","N","s","p","5","6","7","8","C","M","W"];

const IDLE = -1, MOVING = 1, SLIDING = 2, SWITCHING = 3;

const SIZE = 32;

const XDIR = [-1,1,0,0];
const YDIR = [0,0,-1,1];

const DIRS = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3
}

const WORLD_W = 16;
const WORLD_H = 8;
const ROOM_W = 16;
const ROOM_H = 11;

//
const DEBUG = false;


//
// Overworld sprite tiles
//
const CHARS = {
	'0': [0,0],
	'?': [1,5],
	'@': [1,6],
	':': [1,0],
	'<': [1,2],
	'=': [1,3],
	'>': [1,4],
	'B': [1,8], // green bush
	'V': [3,8], // brown bush
	';': [1,1],
	// Brown rock
	'O': [3,1],
	'P': [3,2],
	'Q': [3,3],
	'R': [3,4],
	'S': [3,5],
	'T': [3,6],
	// Tree
	'X': [0,10],
	'Y': [0,11],
	'Z': [0,12],
	'b': [1,10],
	'd': [1,12],
	// Water
	'N': [3,0], // dock
	'4': [0,4], // waterfall
	'i': [1,17], // stairs
	'v': [3,10],
	'w': [3,11],
	'x': [3,12],
	'y': [3,13],
	'z': [3,14],
	'{': [3,15],
	'|': [3,16],
	'}': [3,17],
	'~': [3,18],
	'5': [0,5],
	'6': [0,6],
	'7': [0,7],
	'8': [0,8],
	// Cemetery
	'1': [0,1], // tombstone
	'I': [2,5],
	'D': [2,0],
	'G': [2,3],
	'E': [2,1],
	'F': [2,2],
	'J': [2,6],
	'H': [2,4],
	// Cemetery level entrance
	'^': [0,16],
	'_': [0,17],
	'`': [0,18],
	'h': [1,16],
	'j': [1,18],
	'3': [0,3] // white statue
};