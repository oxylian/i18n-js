// https://tools.ietf.org/html/bcp47
// VOIR https://tools.ietf.org/html/rfc4647
// https://tools.ietf.org/html/rfc6067
// http://cldr.unicode.org/index/bcp47-extension

/*
 * langtag = language ["-" script] ["-" region] *("-" variant) *("-" extension) ["-" privateuse]
 * language = 2*3ALPHA ["-" extlang] / 4ALPHA / 5*8ALPHA
 * extlang = 3ALPHA *2("-" 3ALPHA)
 * script = 4ALPHA
 * region = 2ALPHA / 3DIGIT
 * variant = 5*8alphanum / (DIGIT 3alphanum)
 * extension = singleton 1*("-" (2*8alphanum))
 * singleton = DIGIT / %x41-57 / %x59-5A / %x61-77 / %x79-7A
 * privateuse = "x" 1*("-" (1*8alphanum))
 * grandfathered = irregular / regular
 * irregular = "en-GB-oed" / "i-ami" / "i-bnn" / "i-default" / "i-enochian" / "i-hak" / "i-klingon" / "i-lux" / "i-mingo" / "i-navajo" / "i-pwn" / "i-tao" / "i-tay" / "i-tsu" / "sgn-BE-FR" / "sgn-BE-NL" / "sgn-CH-DE"
 * regular = "art-lojban" / "cel-gaulish" / "no-bok" / "no-nyn" / "zh-guoyu" / "zh-hakka" / "zh-min" / "zh-min-nan" / "zh-xiang"
 */

export interface BCP47 {
  language: string; // ISO 639
  extLang: string;
  script: string; // ISO 15924
  region: string; // ISO 3166-1 | UN M.49
  variants: string[];
  extensions: { [key: string]: string[] };
  privateUse: string[];
}

const reLanguage = /^[a-z]{2,3}$/i;
const reExtLang = /^[a-z]{3}$/i;
const reScript = /^[a-z]{4}$/i;
const reRegion = /^[a-z]{2}$|^\d{3}$/i;
const reVariant = /^[a-z][\da-z]{4,7}$|^\d[\da-z]{3,7}$/i;
const reSingleton = /^[\da-wyz]$/i;
const reExtension = /^[\da-z]{2,8}$/i;
const regPrivateUse = /^[\da-z]{1,8}$/i;

const replacements: { [key: string]: string} = {
  'en-GB-oed': 'en-GB-x-oed',
  'i-ami': 'ami',
  'i-bnn': 'bnn',
  'i-default': 'en-x-i-default',
  'i-enochian': 'und-x-i-enochian',
  'i-hak': 'hak',
  'i-klingon': 'tlh',
  'i-lux': 'lb',
  'i-mingo': 'see-x-i-mingo',
  'i-navajo': 'nv',
  'i-pwn': 'pwn',
  'i-tao': 'tao',
  'i-tay': 'tay',
  'i-tsu': 'tsu',
  'sgn-BE-FR': 'sfb',
  'sgn-BE-NL': 'vgt',
  'sgn-CH-DE': 'sgg',
  'art-lojban': 'jbo',
  'cel-gaulish': 'xtg-x-cel-gaulish',
  'no-bok': 'nb',
  'no-nyn': 'nn',
  'zh-guoyu': 'cmn',
  'zh-hakka': 'hak',
  'zh-min': 'nan-x-zh-min',
  'zh-min-nan': 'nan',
  'zh-xiang': 'hsn'
};

export function parseBCP47(tag: string): BCP47 {
  var parts: string[], i: number, language: string, extLang: string[] = [], script: string, region: string, variants: string[] = [], singleton: string, extension: string[] = [], extensions: { [key: string]: string[] } = {}, privateUse: string[] = [];

  if (typeof tag !== 'string') {
    throw new TypeError('Invalid tag type');
  }

  tag = replacements[tag] || tag;

  parts = tag.split('-');

  if (parts.length < 1) {
    return null;
  }

  i = 0;

  // language.

  if (reLanguage.test(parts[i])) {
    language = parts[i++];

    // extLang

    while (i < parts.length && reExtLang.test(parts[i]) && i < 4) {
      extLang.push(parts[i++]);
    }

    // script

    if (i < parts.length && reScript.test(parts[i])) {
      script = parts[i++];
    }

    // region

    if (i < parts.length && reRegion.test(parts[i])) {
      region = parts[i++];
    }

    // variants

    while (i < parts.length && reVariant.test(parts[i])) {
      variants.push(parts[i++]);
    }

    // extensions

    while (i < parts.length && reSingleton.test(parts[i])) {
      singleton = parts[i++].toLowerCase();

      if (extensions[singleton] !== undefined) {
        return null;
      }

      extensions[singleton] = extension = [];

      while (i < parts.length && reExtension.test(parts[i])) {
        extension.push(parts[i++]);
      }
    }
  }

  // privateuse

  if (parts[i] === 'x' || parts[i] === 'X') {
    i += 1;

    while (i < parts.length && regPrivateUse.test(parts[i])) {
      privateUse.push(parts[i++]);
    }
  }

  if (i !== parts.length) {
    return null;
  }

  return {
    language: typeof language === 'undefined' ? null : language,
    extLang: extLang.length > 0 ? extLang.join('-') : null,
    script: typeof script === 'undefined' ? null : script,
    region: typeof region === 'undefined' ? null : region,
    variants: variants,
    extensions: extensions,
    privateUse: privateUse
  };
}

export function formatBCP47(locale: BCP47): string {
  var parts: string[] = [], i: number;

  if (typeof locale !== 'object' || locale === null) {
    throw new Error('Invalid BCP47');
  }

  if (typeof locale.language === 'string') {
    if (reLanguage.test(locale.language)) {
      parts.push(locale.language);
    } else {
      throw new Error('Invalid language');
    }

    if (typeof locale.extLang === 'string') {
      if (reExtLang.test(locale.extLang)) {
        parts.push(locale.extLang);
      } else {
        throw new Error('Invalid extLang');
      }
    }

    if (typeof locale.script === 'string') {
      if (reScript.test(locale.script)) {
        parts.push(locale.script);
      } else {
        throw new Error('Invalid script');
      }
    }

    if (typeof locale.region === 'string') {
      if (reRegion.test(locale.region)) {
        parts.push(locale.region);
      } else {
        throw new Error('Invalid region');
      }
    }

    for (let variant of locale.variants) {
      if (reVariant.test(variant)) {
        parts.push(variant);
      } else {
        throw new Error('Invalid variant');
      }
    }

    for (let singleton of Object.keys(locale.extensions).sort()) {
      if (reSingleton.test(singleton)) {
        parts.push(singleton);

        for (let extension of locale.extensions[singleton]) {
          if (reExtension.test(extension)) {
            parts.push(extension);
          } else {
            throw new Error('Invalid extension value');
          }
        }
      } else {
        throw new Error('Invalid extension key');
      }
    }
  }

  if (locale.privateUse.length > 0) {
    parts.push('x');

    for (let value of locale.privateUse) {
      if (regPrivateUse.test(value)) {
        parts.push(value);
      } else {
        throw new Error('Invalid private value');
      }
    }
  }

  return parts.join('-');
}

function lowerCase(value: string): string {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }

  return null;
}

function upperCase(value: string): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }

  return null;
}

function initialUpperCase(value: string): string {
  if (typeof value === 'string') {
    return value[0].toUpperCase() + value.substr(1).toLowerCase();
  }

  return null;
}

// https://tools.ietf.org/html/bcp47#section-2.1.1

export function canonicaliseBCP47(likelySubtags: { [key: string]: string }, source: BCP47): BCP47 {
  var language = lowerCase(source.language), script = initialUpperCase(source.script), region = upperCase(source.region);
  var likelySubtag = parseBCP47(likelySubtags[language]);

  if (script === likelySubtag.script) {
    script = null;
  }

  return {
    language: language,
    extLang: lowerCase(source.extLang),
    script: script,
    region: region,
    variants: source.variants.map(lowerCase),
    extensions: source.extensions,
    privateUse: source.privateUse
  };
}

export function canonicalise(likelySubtags: { [key: string]: string }, tag: string): string {
  return formatBCP47(canonicaliseBCP47(likelySubtags, parseBCP47(tag)));
}
