let http = require('http');

let logic = (req, res) => {
	res.writeHead(200, {'content-type': 'application/json'});
	if (!enabledAPI) {
		buz1.beep(0.15);
		return res.end(JSON.stringify({status: false}));
	}

	let data = url.parse(req.url, true),
		opts = {};

	if (req.method === 'GET') {
		if (data.query) {
			if (data.query.led) {
				opts.led = {
					on: led1._on,
					brightness: led1._brightness
				};
			}
			if (data.query.btn1) {
				opts.btn1 = {
					pressed: btn1.isPressed()
				}
			}
			if (data.query.btn2) {
				opts.btn2 = {
					pressed: btn2.isPressed()
				}
			}
			if (data.query.buz) {
				opts.buz = {
					on: buz1._on,
					frequency: buz1._frequency
				}
			}
		}

		return res.end(JSON.stringify({status: true, options: opts}));
	} else if (req.method === 'POST') {
		if (data.query) {
			if (data.query.led == 'true') {
				led1.turnOn();
			} else if (data.query.led == 'false') {
				led1.turnOff();
			}
			if (data.query.blink) {
				led1.blink(parseFloat(data.query.blink));
			}
			if (data.query.freq) {
				buz1.frequency(data.query.freq);
			}
			if (data.query.beep) {
				buz1.beep(parseFloat(data.query.beep));
			}
		}

		return res.end(JSON.stringify({status: true}));
	} else {
		return res.end(JSON.stringify({status: false}));
	}
};

let server = (port) => {
	print('Server start!');
	http.createServer(logic).listen(port);
};

exports.init = (port) => {
	return new server(port || 80);
};