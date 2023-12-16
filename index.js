import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, parseDocument } from 'yaml';

/**
 * Simple translation file synchronization for `Devographics`.
 * 
 * Locales should be same to the ones in locale repository names.
 * Files should be small enough to parse and keep them in memory.
 * 
 * @param {string} fileName - `yml` file name in repository
 * @param {string} baseLocale - locale of the original file
 * @param {string} dictLocale - locale of the file to update
 */ 
function syncTranslations(fileName, baseLocale, dictLocale) {
  const base = join(`..`, `locale-${baseLocale}`, fileName);
  const dict = join(`..`, `locale-${dictLocale}`, fileName);

  // Parse dict and make translations a key/value dict
  const { locale, namespace, translations } = parse(
    readFileSync(dict, 'utf-8'),
    (key, value) => key === 'translations'
      ? new Map(value.map(o => [o.key, o.t]))
      : value,
  );

  // Parse base as a document to preserve structure
  const doc = parseDocument(readFileSync(base, 'utf-8'));

  // Update locale and namespace
  doc.set('locale', locale);
  if (namespace) {
    doc.set('namespace', namespace);
  }

  // Update t in translations
  doc.get('translations').items.forEach(item => {
    const t = translations.get(item.get('key'));
    if (t) {
      item.set('t', t)
    }
  });

  // Write to dict file
  writeFileSync(dict, doc.toString({ lineWidth: 0 }), 'utf-8');
}

syncTranslations('state_of_js.yml', 'en-US', 'ua-UA');
