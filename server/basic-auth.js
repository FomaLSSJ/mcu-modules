let BasicAuth = (allow) => (req, res) => {
	let auth = req.headers.Authorization || req.headers.authorization;

    if (auth) {
      let key = auth.split(' ')[1],
      	decode = atob(key);

      if (!!ALLOW.filter(item => item === decode).length) return null;
    }

    req.espress.status = 401;
    req.espress.headers = {'WWW-Authenticate': 'Basic realm="Secure Area"'};

    return {status: 401, headers: {'WWW-Authenticate': 'Basic realm="Secure Area"'}, message: 'You shall not pass'};
};

module.exports = BasicAuth;