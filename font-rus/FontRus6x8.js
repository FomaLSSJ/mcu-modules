/* 
 * Usage:
 * require('FontRus6x8').add(Graphics);
 * g.setFontRus6x8();
 * g.drawRus('Кек Лол Дед Жиза, ара!', 0, 0);
 *
 */

const RUS_DEFINE = {
	A0: '\xC0', //А
	A1: '\xC1', //Б
	A2: '\xC2', //В
	A3: '\xC3', //Г
	A4: '\xC4', //Д
	A5: '\xC5', //Е
	A6: '\xC6', //Ж
	A7: '\xC7', //З
	A8: '\xC8', //И
	A9: '\xC8', //Й
	AA: '\xC9', //К
	AB: '\xCA', //Л
	AC: '\xCB', //М
	AD: '\xCC', //Н
	AE: '\xCD', //О
	AF: '\xCE', //П
	B0: '\xCF', //Р
	B1: '\xD0', //С
	B2: '\xD1', //Т
	B3: '\xD2', //У
	B4: '\xD3', //Ф
	B5: '\xD4', //Х
	B6: '\xD5', //Ц
	B7: '\xD6', //Ч
	B8: '\xD7', //Ш
	B9: '\xD8', //Щ
	BA: '\xD9', //Ъ
	BB: '\xDA', //Ы
	BC: '\xDB', //Ь
	BD: '\xDC', //Э
	BE: '\xDD', //Ю
	BF: '\xDE', //Я
	C0: '\xE0', //а
	C1: '\xE1', //б
	C2: '\xE2', //в
	C3: '\xE3', //г
	C4: '\xE4', //д
	C5: '\xE5', //е
	C6: '\xE6', //ж
	C7: '\xE7', //з
	C8: '\xE8', //и
	C9: '\xE8', //й
	CA: '\xE9', //к
	CB: '\xEA', //л
	CC: '\xEB', //м
	CD: '\xEC', //н
	CE: '\xED', //о
	CF: '\xEE', //п
	D0: '\xEF', //р
	D1: '\xF0', //с
	D2: '\xF1', //т
	D3: '\xF2', //у
	D4: '\xF3', //ф
	D5: '\xF4', //х
	D6: '\xF5', //ц
	D7: '\xF6', //ч
	D8: '\xF7', //ш
	D9: '\xF8', //щ
	DA: '\xF9', //ъ
	DB: '\xFA', //ы
	DC: '\xFB', //ь
	DD: '\xFC', //э
	DE: '\xFD', //ю
	DF: '\xFE', //я
};

let font = atob("AAAAAPoAwADAAFhw2HDQAGSS/5JMAGCW+DzSDAxSolIMEsAAPEKBAIFCPABIMOAwSAAQEHwQEAABBgAQEBAQAAIAAwwwwAB8ipKifABA/gBChoqSYgCEkrLSjAAYKEj+CADkoqKinAA8UpKSDACAgI6wwABskpKSbABgkpKUeAAiAAEmABAoRAAoKCgoKABEKBAAQIqQYAA8WqW9RDgOOMg4DgD+kpKSbAB8goKCRAD+goJEOAD+kpKCAP6QkIAAfIKCklwA/hAQEP4A/gAMAgIC/AD+EChEggD+AgICAP5AIED+AP7AMAz+AHyCgoJ8AP6QkJBgAHyChoN8AP6QmJRiAGSSkpJMAICA/oCAAPwCAgL8AOAYBhjgAPAOMA7wAMYoECjGAMAgHiDAAI6SosIA/4EAwDAMAwCB/wBAgEAAAQEBAQEBEn6SggQABCoqHgD+IiIcABwiIhQAHCIi/gAcKioYACB+oIAAGCUlPgD+ICAeAL4AAQG+AP4IFCIA/AIAPiAeIB4APiAgHgAcIiIcAD8kJBgAGCQkPwA+ECAgABIqKiQAIPwiADwCAjwAIBgGGCAAOAYIBjgAIhQIFCIAIRkGGCAAJioyIgAQboEA5wCBbhAAQIDAQIAAPFqlpUI8cPh8+HAAcDhwACBg/mAgAAgM/gwIABA4fBAQABAQfDgQAHxERER8AHxE9CRcAHxUbFR8AP58OBAAEDh8/gACAAIAAgB8fHx8fAD+/gD+/gACilIiAgACIlKKAgA+Yu5iPgACAgICAgAGBgYGBgAODg4ODgAeHh4eHgA+Pj4+PgB+fn5+fgD+/v7+/gD+/v7+/gAAAAAA/gD+/gD+/v4A/v7+/gD+/v7+/gA4OHz+/gAMDPBAIACeADhE/kQIABJ8koIEAEQ4KDhEAKhoPmioACh8qqqCAARSqpRAAJCkqKSQAP6CupL+ABKqqqp6ABAoVChEADh8fHw4ADhUbFQ4AP6Cpor+ABAYHBgQAGCQkGAAIiL6IiIASJioSACIqKhQACBAgAB/BAQIfABgkP6A/gAwMAAAAAAASPgIADlFRUU5AEQoVCgQAOgWKl+CAOgQKVONAKj4BgofAAYJUQIADjjIOA4A/pKSkowA/pKSkmwA/oCAgMAABvyEfAYA/pKSkgDuEP4Q7gCSkpJsAP4EGCD+AP4QKESCAAL8gID+AP5AIED+AP4QEBD+AHyCgoJ8AP6AgID+AP6QkJBgAHyCgoJEAICA/oCAAOQSEhL8AHCI/ohwAMYoECjGAP4CAv4DAOAQEBD+AP4C/gL+AP4C/gL+A4D+EhIMAP4SDAD+AP4SEgwARIKSknwA/hB8goJ8YpSYkP4AAAAAAAQqKh4AHCoqRAA+KioUAD4gICAABhwkPAYAHCoqGAA2CD4INgAqKioUAD4ECD4APggUIgACHiA+AD4QCBA+AD4ICD4AHCIiHAA+ICA+AD4oKBAAHCIiFAAgID4gIAAwCgo8ABgkPiQYACIUCBQiAD4CAj4DADAICD4APgI+Aj4APgI+Aj4DID4KCgQAPgoEAD4APgoKBAAUIioqHAA+CBwiHAASLCg+AAAAAAA=");
let widths = atob("BAIEBgYGBgIEBAYGAwUCBQYDBgYGBgYGBgYCAwQGBAUGBgYGBgUFBgYCBgYFBgYGBgYGBgYGBgYGBgUDBQMEBgYFBQUFBQUFBQIEBQMGBQUFBQUFBAUGBgYGBQQCBAYGBgQGBgYGBgYGBQUGBgYGBgYGBgYGBgYGBgQCAwQFBgYGAgYGBgYGBgYGBgYGBgYGBQYFBQQGBgMEBAYGBgYGBQYGBgYGBQYFBgYGBgYGBgYGBgYGBgYGBgYGBgUGBgYEBQUFBQYFBgUFBQUGBQUFBQUGBQYGBgUGBgYGBQYGBQQ=");

function drawRus(s) {
  let n = [];

  for (let i = 0; i < s.length; i++) {
    if(i !== s.length) {
      if (RUS_DEFINE[s[i] + s[i + 1]]) {
        n.push(RUS_DEFINE[s[i] + s[i + 1]]);
        i++;
      } else {
        n.push(s[i]);
      }
    }
  }

  return n.join('');
}

module.exports = {
	add: function(graphics) {
		graphics.prototype.setFontRus6x8 = function() {
    		this.setFontCustom(font, 32, widths, 8);
  		};
  		graphics.prototype.drawRus = function(s, x, y) {
  			this.drawString(drawRus(s), x, y);
  		};
  	}
};