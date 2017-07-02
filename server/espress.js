/**
 * Author: FomaLSSJ
 * GitHub Page: https://github.com/fomalssj
 * 
 * Dependencies:
 * http (core)
 */

let http = require('http');

/**
 * Return bytes in String
 * @method byteLength
 * @param {String} str - inner string
 * @return {Number} - return total bytes in string
 */
let byteLength = (str) => {
	let total = 0,
		LOG2x256 = 8,
		LN2x8 = Math.LN2 * LOG2x256;

	for (let i = 0; i < str.length; i++) {
		total += Math.ceil(Math.log(str[i].charCodeAt()) / LN2x8);
	}

	return total;
};

/**
 *
 */
let Server = {
	init(opts) {
		opts = opts || {};

		this.env = opts.env || 'development';
		this.logger = {};
		this.port = opts.port || 80;
		this.type = opts.type || 'text/plain';
		this.index = opts.index || 'index.html';
		this.status = opts.status || 200;
		this.not_found = opts.not_found || '404 Not Found';
		this.server_error = opts.server_error || '500 Internal Server Error';
		this.forbidden = opts.forbidden || '403 Forbidden';
		this.fs = opts.fs || '';
		this.routes = {};

		this.middleware = opts.middleware || null;

		this.routes.get = opts.get || {};
		this.routes.post = opts.post || {};
		this.routes.put = opts.put || {};
		this.routes.delete = opts.delete || {};

		this.server = null;
		this.uri = null;
		this.headers = {
			'status': this.status,
			'Content-Type': this.type,
			'X-Powered-By': 'Espress'
		};
	},

	get(route, opts, handle) {
		opts = opts || {};

		this.routes.get[route] = {
			type: opts.type || this.type,
			header: opts.header || this.header,
			content: handle
		}
	},

	/**
	 *
	 */
	post(route, opts, handle) {
		opts = opts || {};

		this.routes.post[route] = {
			type: opts.type || this.type,
			header: opts.header || this.header,
			content: handle
		}
	},

	/**
	 *
	 */
	put(route, opts, handle) {
		opts = opts || {};

		this.routes.put[route] = {
			type: opts.type || this.type,
			header: opts.header || this.header,
			content: handle
		}
	},

	/**
	 *
	 */
	delete(route, opts, handle) {
		opts = opts || {};

		this.routes.delete[route] = {
			type: opts.type || this.type,
			header: opts.header || this.header,
			content: handle
		}
	},

	/**
	 *
	 */
	router(req, res) {
		this.uri = url.parse(req.url, true);
		this.uri.method = req.method;

		req.espress = {
			uri: this.uri,
			status: 200,
			headers: {'Content-Type': this.type},
			content: ''
		};

		if (this.middleware) {
			let x = this.middleware(req, res);

			if (x) {
				this.logger = {method: req.method, path: this.uri.path, status: req.espress.status};
				if (this.env === 'development') print(this.logger.method, this.logger.path, this.logger.status, byteLength(x.message));

				res.writeHead(req.espress.status, req.espress.headers);
				return res.end(x.message);
			}
		}

		try {
			let index = (this.uri.pathname.length <= 1);
			
			this.uri.file = (index) ? this.index : this.uri.pathname;
			this.emit('request', req, res, this.uri, this);

			switch (req.method) {
				case 'VIEW':
				case 'TRACE':
					req.espress.headers['Content-Type'] = 'message/http';
					req.espress.headers['X-Powered-By'] = 'Espress';
					content = this.trace(req);
					res.writeHead(req.espress.status, req.espress.headers);
					return res.end(content);
				case 'HEAD':
					req.espress.headers['Content-Type'] = 'text/html';
					req.espress.headers['X-Powered-By'] = 'Espress';
					res.writeHead(req.espress.status, req.espress.headers);
					return res.end(null);
				default:
					let data = (this.routes[req.method.toLowerCase()]) ? this.routes[req.method.toLowerCase()][this.uri.file] : null;

					if (data) {
						req.espress.headers['Content-Type'] = data.type;
						req.espress.headers['X-Powered-By'] = 'Espress';
						let result = this.evalMethod(req, res, data.content);

						if (this.env === 'development') print(this.logger.method, this.logger.path, this.logger.status, byteLength(result));

						return res.end(result);
					} else {
						req.espress.status = 404;
						req.espress.headers['Content-Type'] = 'text/html';
						req.espress.headers['X-Powered-By'] = 'Espress';
						let result = this.evalMethod(req, res, this.not_found);

						if (this.env === 'development') print(this.logger.method, this.logger.path, this.logger.status, byteLength(result));

						return res.end(result);
					}
			}
		} catch (e) {
			this.emit('error', e, this);
			req.espress.status = 500;
			req.espress.headers['Content-Type'] = 'text/html';
			req.espress.headers['X-Powered-By'] = 'Espress';
			let result = this.evalMethod(req, res, this.server_error);

			if (this.env === 'development') print(this.logger.method, this.logger.path, this.logger.status, byteLength(result));

			return res.end(result);
		}
	},

	/**
	 * Starting server
	 * @method start
	 * @return {Class} - new server instance
	 */
	start() {
		try {
			this.server = http.createServer(this.router.bind(this));
			this.server.listen(this.port);
			this.emit('start', this);
		} catch (e) {
			this.emit('error', e, this);
		}
	},

	/**
	 *
	 */
	evalMethod(req, res, data) {
		res.writeHead(req.espress.status, req.espress.headers);
		this.logger = {method: req.method, path: this.uri.path, status: req.espress.status};

		if (typeof data === 'object') return this.evalFile(data);
		if (typeof data === 'function') return data(req, res, this.uri, this);
		return data;
	},

	/**
	 *
	 */
	evalFile(data) {
		let chunk = txt = '',
			content;

		try {
			while (chunk = data.read(8)) {
				txt += chunk;
			}
		
			data.close();
			content = eval(txt)();
		} catch (e) {
			this.emit('error', e, this);
		}

		return content;
	},

	/**
	 *
	 */
	trace(req) {
		let content = '"status": "200"' + "\n";
		content += '"method": "' + req.method + '"' + "\n";
		content += '"url": "' + req.url + '"' + "\n";

		for (let property in req.headers) {
			content += '"' + property + '": "' + req.headers[property] + '"' + "\n";
		}

		return content;
	}
};

module.exports = Server;