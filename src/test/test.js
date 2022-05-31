const FILES = ['green.json', 'red.json'];
let index = 0;
let color = "";

class ClrObject
{
	constructor(){
			this.color = "";
	}
	setColor(clr) { this.color = clr; }
	updateBackground() { document.body.style.backgroundColor = this.color; }

	count()
	{
		let this_ = this;
		setTimeout(function()
		{
			loadFile(FILES[index], function(data) {
				color = data["color"];
				console.log(data, color);
			});
			index = (index+1)%2;

			this_.setColor(color);
			this_.updateBackground();
			this_.count();
		}, 1000)
	}
}


function loadFile(file, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', file, true);
	xhr.send();
	xhr.responseType = 'text';
	xhr.onload = function(e)
	{
		callback(JSON.parse(this.responseText));
	}
}


$(document).ready(function()
{
	console.log("Document ready");
	loadFile('green.json', function(data) {
    console.log(data);
	});

	let obj = new ClrObject();
	obj.count();
	//count(obj);
});


function count(obj)
{
	setTimeout(function() {
		loadFile(FILES[index], function(data) {
			color = data["color"];
			console.log(data, color);
		});
		index = (index+1)%2;
		obj.setColor(color);
		obj.updateBackground();
		count(obj);
	}, 1000)
}