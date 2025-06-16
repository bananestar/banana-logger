# 🍌 BananaLogger

&#x20;&#x20;

BananaLogger is a stylish, zero-dependency logging utility for Node.js – with colors, tags, timestamps, timers, and advanced file/JSON support. **Fun to use, readable for humans, simple to parse for machines.**

---

## 🚀 Features

- **Zero dependencies** – pure Node.js
- Color-coded levels: info, warn, error, success, debug
- Custom tags for easy log filtering
- Per-log timestamp (locale/customizable)
- File logging: append plain text or JSON (one object per line)
- Timer support: `.timerStart()`, `.timerLap()`, `.timerEnd()`
- Advanced: tag chaining, log level filtering, full customization

---

## 📦 Installation

```bash
npm install banana-logger
```

_or simply copy **`src/index.js`** into your project for full portability._

---

## ⚡ Quick Start

```js
import BananaLogger from './src/index.js';

const logger = new BananaLogger();

logger.info('Server started');
logger.tag('AUTH').warn('Failed login attempt');
logger.setLevel('warn');
logger.info('Will not show');
logger.error('Critical error!');
logger.setDateLocale('en-US');
logger.success('Logged in');

// Logging to file (text and JSON modes)
logger.toFile('./logs/app.log');
logger.info('Written to file!');
logger.asJsonFileMode(true);
logger.tag('TEST').error('JSON error', { foo: 123 });

// Timers
logger.timerStart('task');
setTimeout(() => {
  logger.timerLap('task', 'midway');
  setTimeout(() => {
    logger.timerEnd('task', 'all done');
  }, 250);
}, 250);
```

---

## 🛠️ API Reference

### **Constructor**

```js
new BananaLogger();
```

### **Log Methods**

- `logger.info(...args)`
- `logger.warn(...args)`
- `logger.error(...args)`
- `logger.success(...args)`
- `logger.debug(...args)`

### **Tagging**

- `logger.tag('MODULE').info('Message')`

### **Log Level**

- `logger.setLevel('warn')` // only `warn`, `error`, and above displayed

### **Locale Date Formatting**

- `logger.setDateLocale('fr-FR', { hour12: false })`

### **File Logging**

- `logger.toFile('./logs/myapp.log')`
- `logger.asJsonFileMode(true)` // one JSON object per line

### **Timers**

- `logger.timerStart('label')`
- `logger.timerLap('label', 'optional comment')`
- `logger.timerEnd('label', 'optional final comment')`

### **Advanced Usage**

- All methods are chainable for a clean syntax
- Tags reset after each log for thread safety

---

## 📚 Advanced Examples

### **Chaining**

```js
logger.tag('API').setLevel('debug').debug('Request received');
```

### **Locale Customization**

```js
logger.setDateLocale('de-DE', { timeZone: 'Europe/Berlin' });
```

### **Timer Advanced**

```js
logger.timerStart('import');
// ...
logger.timerLap('import', 'Phase 1 done');
// ...
logger.timerEnd('import', 'Import complete');
```

### **JSON Log Parsing**

```js
import { readFileSync } from 'fs';
const lines = readFileSync('./logs/app.log', 'utf8')
  .split('\n')
  .filter(Boolean);
const logs = lines.map((l) => JSON.parse(l));
console.log(logs);
```

---

## ✅ Unit Testing (with Node.js only)

Basic structure (see `test/index.test.js`):

```js
import BananaLogger from '../src/index.js';
import { readFileSync } from 'fs';

const logger = new BananaLogger();
logger.asJsonFileMode(true).toFile('./logs/banana-test.log');
logger.info('JSON Test', { foo: 42 });

const lines = readFileSync('./logs/banana-test.log', 'utf8')
  .split('\n')
  .filter(Boolean);
for (const line of lines) {
  try {
    const obj = JSON.parse(line);
    if (!obj.timestamp || !obj.level || !obj.message)
      throw new Error('Invalid JSON');
  } catch (e) {
    throw new Error('Not valid JSON log: ' + line);
  }
}
console.log('All logs are valid JSON!');
```

You can add more assertions and even test output with [assert](https://nodejs.org/api/assert.html) or a full test runner.

---

## 🏷️ Special Badges

- [![Zero Dependency](https://img.shields.io/badge/zero--dependency-100%25-green?style=flat-square)](#)
- [![Made in Belgium](https://img.shields.io/badge/Made%20in-Belgium-ffd700?style=flat-square&logo=belgium)](https://en.wikipedia.org/wiki/Belgium)
- [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## 🧑‍💻 Contributing

- Fork, PR, issues & stars welcome!
- Ideas, feature requests, or bug reports = open an issue

---

## 📝 License

MIT — See [LICENSE](./LICENSE)

---

🍌 Go bananas with your logs!
