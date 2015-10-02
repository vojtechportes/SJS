var resp = new Request({
	"method": "POST",
	"url": "assets/response.php",
	"events": {
		"complete": function (response) {
			console.log(response);
			console.log(this);
		},
		"loading": function () {
			console.log('loading...');
		},
		"error": function () {
			console.log('File not found');
		}
	}
});
resp.send("id=2&lorem=ipsum");