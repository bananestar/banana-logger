import BananaLogger from '../src/index.js';
import { readFileSync, unlinkSync } from 'fs';

const LOG_FILE = './logs/banana-test.log';

try {
  unlinkSync(LOG_FILE);
} catch {}

const logger = new BananaLogger();

// 1. Test console simple
logger.info('Ceci est un log info');
logger.warn('Ceci est un warning');
logger.error('Ceci est une erreur');
logger.success('Tout est bon 🍌');
logger.debug('Debug seulement visible si niveau est debug');

// 2. Test tag
logger.tag('AUTH').info('User connected');
logger.tag('API').warn('Missing parameter');

// 3. Test niveau de log (setLevel)
logger.setLevel('warn');
logger.info("Ne s'affiche pas");
logger.warn("S'affiche");
logger.setLevel('debug');

// 4. Test format de date custom
logger.setDateLocale('en-GB');
logger.info('Date en anglais UK');

// 5. Test log dans un fichier texte brut
logger.toFile(LOG_FILE);
logger.info('Ceci va dans le fichier aussi');

// 6. Test log fichier en JSON
logger.asJsonFileMode(true);
logger.tag('TEST').error('Erreur JSON', { foo: 123 });
logger.info('Ceci est du log JSON');

// 7. Test timers
logger.timerStart('process');
setTimeout(() => {
  logger.timerLap('process', 'First lap');
  setTimeout(() => {
    logger.timerEnd('process', 'Fin du timer');
    // 9. Vérification du contenu du fichier log
    console.log('\n=== Contenu du fichier de log ===');
    const content = readFileSync(LOG_FILE, 'utf8');
    console.log(content);
    // 10. Nettoyage (optionnel)
    // unlinkSync(LOG_FILE);
    process.exit(0);
  }, 500);
}, 500);
