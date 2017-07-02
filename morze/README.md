# Morze Module

Если в настройках включить Minification, возникают проблемы в работе, минимизирует не правильно. По этому рядом лежит ```morze.min.js```, используйте его.

## Usage
```
let morze = require('morze').init({buzzer: P8, button: P9});

morze.on('response', r => print(r));
```

## Dependencies
```@amperka/buzzer``` -> http://wiki.amperka.ru/js:buzzer  
```@amperka/button``` -> http://wiki.amperka.ru/js:button#amperka_button