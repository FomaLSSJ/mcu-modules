let http = require('http');

let client = () => {};

client.prototype.get = (opts) => new Promise((resolve, reject) => {
	let query = [],
		timeout = null,
		options = {
			method: 'GET',
			host: opts.host,
			path: opts.path
		};

	if (opts.data) {
		for (let i in opts.data) {
			query.push(`${i}=${opts.data[i]}`);
		}
		options.path = `${opts.path}?${query.join('&')}`;
	}

	if (opts.timeout) timeout = setTimeout(() => reject('Request timeout'), opts.timeout);

	let req = http.request(options, res => {
		let buffer = '';

		res.on('data', data => buffer += data);
		res.on('close', () => {
			if (timeout) clearTimeout(timeout);
			if (res.headers['content-type'] === 'application/json') {
				return resolve(JSON.parse(buffer));
			} else {
				return resolve(buffer);
			}
		});
	});
	req.on('error', err => reject(JSON.stringify(err)));
	req.end();
});

client.prototype.post = (opts) => new Promise((resolve, reject) => {
	let query = [],
		timeout = null,
		encode = '',
		options = {
			method: 'POST',
			headers: {
      			'content-type': 'application/x-www-form-urlencoded',
      			'content-length': encode.length
    		},
			host: opts.host,
			path: opts.path
		};;

	if (opts.data) {
		for (let i in opts.data) {
			query.push(`${i}=${opts.data[i]}`);
		}
		encode = query.join('&');
	}

	if (opts.timeout) timeout = setTimeout(() => reject('Request timeout'), opts.timeout);

	let req = http.request(options, (res) => {
		let buffer = '';

		res.on('data', data => buffer += data);
		res.on('close', () => {
			if (timeout) clearTimeout(timeout);
			if (res.headers['content-type'] === 'application/json') {
				let parse = JSON.parse(buffer);
				return resolve(parse);
			} else {
				return resolve(buffer);
			}
		});
	});
	req.on('error', err => reject(JSON.stringify(err)));
	req.write(encode);
	req.end();
});

exports.init = () => new client();