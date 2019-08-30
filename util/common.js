/* eslint-disable no-restricted-globals */
/* eslint-disable no-cond-assign */
/* eslint-disable no-param-reassign */
module.exports = {
  timeFormat(timestamp, needAdd8Hours = true) {
    if (!timestamp) {
      return '--';
      // timestamp = Date.now()
    }
    if (timestamp.toString().indexOf('-') > 0) {
      timestamp = timestamp.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/'); // 将 '-' 替换成 '/'
      timestamp = timestamp.slice(0, timestamp.indexOf('.')); // 删除小数点及后面的数字
    }
    let date = new Date(timestamp).getTime();
    if (needAdd8Hours) {
      date += 8 * 60 * 60 * 1000; // 手动加八个小时
    }
    date = new Date(date);
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = `${date.getDate()} `;
    const h = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
    const m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    return Y + M + D + h + m;
  },
  dateFormat(timestamp, needAdd8Hours = true) {
    if (!timestamp) {
      return '--';
      // timestamp = Date.now()
    }
    if (timestamp.toString().indexOf('-') > 0) {
      timestamp = timestamp.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/'); // 将 '-' 替换成 '/'
      timestamp = timestamp.slice(0, timestamp.indexOf('.')); // 删除小数点及后面的数字
    }
    let date = new Date(timestamp).getTime();
    if (needAdd8Hours) {
      date += 8 * 60 * 60 * 1000; // 手动加八个小时
    }
    date = new Date(date);
    const Y = `${date.getFullYear()}-`;
    const M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const D = `${date.getDate()} `;
    return Y + M + D;
  },
  getTimeMillisecond(timestamp) {
    if (timestamp.toString().indexOf('-') > 0) {
      timestamp = timestamp.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/'); // 将 '-' 替换成 '/'
      timestamp = timestamp.slice(0, timestamp.indexOf('.')); // 删除小数点及后面的数字
    }
    let date = new Date(timestamp).getTime();
    date += 8 * 60 * 60 * 1000; // 手动加八个小时
    return date;
  },
  formatMoney(number, places, symbol, thousand, decimal) {
    if (!number * 1 || isNaN(number * 1) || !number) return number;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : '';
    thousand = thousand || ',';
    decimal = decimal || '.';
    const negative = number < 0 ? '-' : '';
    const i = `${parseInt(number = Math.abs(+number || 0).toFixed(places), 10)}`;
    let j;
    j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousand}`) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
  },
  nFormatter(num, digits = 2) {
    if (!num * 1 || isNaN(num * 1) || !num) return num;
    const si = [{
      value: 1,
      symbol: '',
    },
    {
      value: 1E3,
      symbol: 'K',
    },
    {
      value: 1E6,
      symbol: 'M',
    },
    {
      value: 1E9,
      symbol: 'B',
    },
    {
      value: 1E12,
      symbol: 'T',
    },
    {
      value: 1E15,
      symbol: 'P',
    },
    {
      value: 1E18,
      symbol: 'E',
    },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i -= 1) {
      if (num >= si[i].value) {
        break;
      }
    }
    return this.formatMoney((num / si[i].value).toFixed(digits).replace(rx, '$1')) + si[i].symbol;
  },
  isEmpty(obj = {}) {
    if (JSON.stringify(obj) === '{}' || JSON.stringify(obj) === '[]') return true;
    return false;
  },
  splitFileName(text) {
    const pattern = /\.{1}[a-z]{1,}$/;
    if (pattern.exec(text) !== null) {
      return (text.slice(0, pattern.exec(text).index));
    }
    return text;
  },
};
