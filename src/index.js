import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

const LEVELS = {
  info: { color: '\x1b[36m', label: 'INFO' }, // cyan
  warn: { color: '\x1b[33m', label: 'WARN' }, //yellow
  error: { color: '\x1b[31m', label: 'ERROR' }, // red
  success: { color: '\x1b[32m', label: 'SUCCESS' }, // green
  debug: { color: '\x1b[35m', label: 'DEBUG' }, // magenta
  TIMER: { color: '\x1b[34m', label: 'TIMER' },
  TIMER_LAP: { color: '\x1b[90m', label: 'TIMER_LAP' },
};

const RESET = '\x1b[0m';

export default class BananaLogger {
  constructor() {
    this._tag = null;
    this._level = 'info'; //default
    this._levelsOrder = ['debug', 'info', 'warn', 'error'];
    this._dateLocale = undefined;
    this._dateOptions = undefined;
    this._logFile = null; // fichier pour log desactivé par default
    this._logAsJson = false;
    this._timers = {};
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

  toFile(path) {
    this._logFile = path;
    if (path) {
      const dir = dirname(path);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
    return this;
  }

  asJsonFileMode(enable = true) {
    this._logAsJson = !!enable;
    return this;
  }

  timerStart(label) {
    if (!label) throw new Error('timerStart: label is required');
    this._timers[label] = Date.now();
    return this;
  }

  timerEnd(label, ...args) {
    if (!this._timers[label]) {
      this.warn(`Timer "${label}" doesn't exist.`);
      return;
    }

    const duration = Date.now() - this._timers[label];
    delete this._timers[label];
    const durationStr = this._formatDuration(duration);

    // Console log
    this._log('TIMER', `[TIMER] ${label} : ${durationStr}`, ...args);

    // JSON fichier
    if (this._logFile && this._logAsJson) {
      const obj = {
        timestamp: new Date().toISOString(),
        level: 'TIMER',
        tag: this._tag,
        timer: label,
        duration: duration,
        durationText: durationStr,
        extra: args,
      };
      try {
        appendFileSync(this._logFile, JSON.stringify(obj) + '\n');
      } catch (e) {
        console.error('[BananaLogger][FileWriteError]', e);
      }
    }
    this._tag = null;
    return this;
  }

  timerLap(label, ...args) {
    if (!this._timers[label]) {
      this.warn(`Timer "${label}" doesn't exist.`);
      return this;
    }
    const now = Date.now();
    const duration = now - this._timers[label];
    this._timers[label] = now;
    const durationStr = this._formatDuration(duration);

    this._log('TIMER_LAP', `[TIMER LAP] ${label} : ${durationStr}`, ...args);

    if (this._logFile && this._logAsJson) {
      const obj = {
        timestamp: new Date().toISOString(),
        level: 'TIMER_LAP',
        tag: this._tag,
        timer: label,
        duration: duration,
        durationText: durationStr,
        extra: args,
      };
      try {
        appendFileSync(this._logFile, JSON.stringify(obj) + '\n');
      } catch (e) {
        console.error('[BananaLogger][FileWriteError]', e);
      }
    }
    this._tag = null;
    return this;
  }

  _formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    const s = Math.floor(ms / 1000);
    const rest = ms % 1000;
    return rest ? `${s}s ${rest}ms` : `${s}s`;
  }

  _writeToFile(msg, level, args) {
    if (!this._logFile) return;
    try {
      if (this._logAsJson) {
        const obj = this._formatMsgObject(level, args);
        appendFileSync(this._logFile, JSON.stringify(obj) + '\n');
      } else {
        appendFileSync(this._logFile, msg + '\n');
      }
    } catch (e) {
      console.error('[BananaLogger][FileWriteError]', e);
    }
  }

  _shouldLog(level) {
    if (!LEVELS[level]) return true;
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
    parts.push(`[${LEVELS[level]?.label || level}]`);
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
  _formatMsgObject(level, args) {
    return {
      timestamp: new Date().toISOString(),
      level: LEVELS[level]?.label || level,
      tag: this._tag,
      message: args.map((a) =>
        a instanceof Error ? { error: a.message, stack: a.stack } : a
      ),
    };
  }

  _log(level, ...args) {
    if (!this._shouldLog(level)) return;
    const color = LEVELS[level].color;
    const msg = this._formatMsg(level, args);
    console.log(color + msg + RESET);
    if (this._logFile) this._writeToFile(msg, level, args);
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
