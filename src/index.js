const LEVELS = {
  info: { color: '\x1b[36m', label: 'INFO' }, // cyan
  warn: { color: '\x1b[33m', label: 'WARN' }, //yellow
  error: { color: '\x1b[31m', label: 'ERROR' }, // red
  success: { color: '\x1b[32m', label: 'SUCCESS' }, // green
  debug: { color: '\x1b[35m', label: 'DEBUG' }, // magenta
};

const RESET = '\x1b[0m';

export default class BananaLogger {
  constructor() {
    this._tag = null;
    this._level = 'info'; //default
    this._levelsOrder = ['debug', 'info', 'warn', 'error'];
    this._dateLocale = undefined;
    this._dateOptions = undefined;
  }

  tag(tag) {
    this._tag = tag;
    return this;
  }

  setLevel(level) {
    if (LEVELS[level]) {
      this._level = level;
    }
    return this;
  }

  setDateLocale(locale, options) {
    this._dateLocale = locale;
    this._dateOptions = options;
    return this;
  }

  _shouldLog(level) {
    return (
      this._levelsOrder.indexOf(level) >= this._levelsOrder.indexOf(this._level)
    );
  }

  _formatDate() {
    const d = new Date();
    if (this._dateLocale)
      return d.toLocaleString(this._dateLocale, this._dateOptions);
    return d.toLocaleString();
  }

  _formatMsg(level, args) {
    const parts = [];
    parts.push(`[${this._formatDate()}]`);
    if (this._tag) parts.push(`[${this._tag}]`);
    parts.push(`[${LEVELS[level].label}]`);
    parts.push(
      ...args.map((a) =>
        typeof a === 'object'
          ? a instanceof Error
            ? a.stack
            : JSON.stringify(a, null, 2)
          : a
      )
    );

    return parts.join(' ');
  }

  _log(level, ...args) {
    if (!this._shouldLog(level)) return;
    const color = LEVELS[level].color;
    console.log(color + this._formatMsg(level, args) + RESET);
    this._tag = null;
  }

  info(...args) {
    this._log('info', ...args);
    return this;
  }
  warn(...args) {
    this._log('warn', ...args);
    return this;
  }
  error(...args) {
    this._log('error', ...args);
    return this;
  }
  success(...args) {
    this._log('success', ...args);
    return this;
  }
  debug(...args) {
    this._log('debug', ...args);
    return this;
  }
}
