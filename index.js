import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, parseDocument, stringify } from 'yaml';

// eslint-disable-next-line no-undef
const baseLocale = process.env.BASE_LOCALE;
// eslint-disable-next-line no-undef
const dictLocale = process.env.DICT_LOCALE;
// eslint-disable-next-line no-undef
const fileName = process.env.FILE_NAME;

/**
 * Simple translation file synchronization for `Devographics`.
 * 
 * Files should be small enough to parse and keep them in memory.
 */ 
function syncTranslations() {
  if (!baseLocale || !dictLocale || !fileName) return;

  const base = join('..', `locale-${baseLocale}`, fileName);
  const dict = join('..', `locale-${dictLocale}`, fileName);
  const untr = join('..', `locale-${dictLocale}`, `untranslated-${fileName}`);

  // Read dict file if it exists
  let dictFile;
  try {
    dictFile = readFileSync(dict, 'utf-8');
  } catch (e) {
    if (e.code === 'ENOENT') {
      copyFileSync(base, dict);
    } else {
      console.log(e);
    }
    return;
  }

  // Parse dict and make translations a key/value dict
  const { locale, namespace, translations } = parse(
    dictFile,
    (key, value) => key === 'translations'
      ? new Map(value.map(o => [o.key, o.t]))
      : value,
  );

  // Parse base as a document to preserve structure
  const doc = parseDocument(readFileSync(base, 'utf-8'));

  // Update locale and namespace
  doc.set('locale', locale);
  if (namespace) doc.set('namespace', namespace);

  // Update t in translations and create list of untranslated texts
  const untranslated = [];
  doc.get('translations').items.forEach(item => {
    const t = translations.get(item.get('key'));
    // t is empty for missing key or one with aliasFor
    if (t) item.set('t', t);
    else if (item.has('t')) untranslated.push(item.get('t'));
  });

  // Construct output without a limit for the folded blocks
  const output = stringify(doc, { lineWidth: 0 });

  // Retain the original formatting for the folded blocks
  const data = output
    .split('\n')
    .map(line => {
      // Extract leading spaces
      const offset = line.match(/^\s*/) ? line.match(/^\s*/)[0] : '';
      // Per line: text + 2 spaces + text => text + space + \n + offset + text
      // (2 spaces is result of additional space and transformed newline)
      return line.replace(/(\S)( {2})(\S)/g, `$1 \n${offset}$3`);
    })
    .join('\n');

  // Write to dict file
  writeFileSync(dict, data, 'utf-8');

  // Write list of untranslated texts
  if (untranslated.lenth) {
    writeFileSync(untr, stringify(untranslated, { lineWidth: 0 }), 'utf-8');
  }
}

syncTranslations();
