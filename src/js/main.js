import Gameloop from './gameloop.js';


function loadJson(file, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', `/assets/res/${file}`, true);
	xhr.responseType = 'text';
	xhr.onload = function(e)
	{
		callback(JSON.parse(this.responseText));
	}
	 xhr.send();
}


$(document).ready(function()
{
	console.log("Document ready");
	loadJson('overworld.json', function(data) {
		new Gameloop(data);
	});
});