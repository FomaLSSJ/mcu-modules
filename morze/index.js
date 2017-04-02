const CODES = {
  'A': '.-',     'B': '-...',   'C': '-.-.',   'D': '-..',    'E': '.',      'F': '..-.',
  'G': '--.',    'H': '....',   'I': '..',     'J': '.---',   'K': '-.-',    'L': '.-..',
  'M': '--',     'N': '-.',     'O': '---',    'P': '.--.',   'Q': '--.-',   'R': '.-.',
  'S': '...',    'T': '-',      'U': '..-',    'V': '...-',   'W': '.--',    'X': '-..-',
  'Y': '-.--',   'Z': '--..',   '1': '.----',  '2': '..---',  '3': '...--',  '4': '....-',
  '5': '.....',  '6': '-....',  '7': '--...',  '8': '---..',  '9': '----.',  '0': '-----',
  '.': '......', ',': '.-.-.-', ':': '---...', ';': '-.-.-.', '(': '-.--.-', '`': '.----.',
  '"': '.-..-.', '-': '-....-', '/': '-..-.',  '!': '..--..', '?': '--..--', '_': '-...-',
  '@': '.--.-.', 'ERR': '........', 'END': '..-.-'
};

let Morze = (opts) => {
	let buz = require('@amperka/buzzer').connect(opts.buzzer),
    	btn = require('@amperka/button').connect(opts.button, {holdTime: 0.2}),
    	timer = null,
    	signals = [],
    	self = this;

    buz.frequency(3000);

    let setTimer = () => {
		timer = setTimeout(() => {
			let char = getCharacter(signals.join(''));
			signals = [];
			timer = null;
			return self.emit('response', char);
		}, 500);
	};

	let overSignal = () => setTimer();

	let getCharacter = (signals) => {
		for (let key in CODES) {
			if (CODES[key] === signals) return key;
		}
		return null;
	};

    btn.on('press', () => {
		buz.turnOn();
		if (timer) return clearTimeout(timer);
	});

	btn.on('click', () => signals.push('.'));

	btn.on('hold', () => signals.push('-'));

	btn.on('release', () => {
		buz.turnOff();
		if (!signals.length) return;
		return overSignal();
	});
};

exports.init = (opts) => new Morze(opts);