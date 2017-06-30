import expect = require('expect.js');

import { BCP47, parseBCP47, formatBCP47, canonicalise, LIKELY_SUBTAGS } from '../src';

function validTag(langtag: string, expected: BCP47) {
  it('should accept ' + langtag, function (done: (err?: any) => void) {
    var result = parseBCP47(langtag);

    expect(result).to.eql(expected);

    done();
  });
}

function invalidTag(langtag: string) {
  it('should refuse ' + langtag, function (done: (err?: any) => void) {
    var result = parseBCP47(langtag);

    expect(result).to.be(null);

    done();
  });
}

function shouldCanonicalise(langtag: string, canonicalised: string) {
  it('canonical version of ' + langtag + ' is ' + canonicalised, function (done: (err?: any) => void) {
    expect(canonicalise(LIKELY_SUBTAGS, langtag)).to.be(canonicalised);

    done();
  });
}

describe('Simple language subtag', function () {
  validTag('de', { language: 'de', extLang: null, script: null, region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('fr', { language: 'fr', extLang: null, script: null, region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('ja', { language: 'ja', extLang: null, script: null, region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('i-enochian', { language: 'und', extLang: null, script: null, region: null, variants: [], extensions: {}, privateUse: ['i', 'enochian'] });
});

describe('Language subtag plus Script subtag', function () {
  validTag('zh-Hant', { language: 'zh', extLang: null, script: 'Hant', region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('zh-Hans', { language: 'zh', extLang: null, script: 'Hans', region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('sr-Cyrl', { language: 'sr', extLang: null, script: 'Cyrl', region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('sr-Latn', { language: 'sr', extLang: null, script: 'Latn', region: null, variants: [], extensions: {}, privateUse: [] });
});

describe('Extended language subtags and their primary language subtag counterparts', function () {
  validTag('zh-cmn-Hans-CN', { language: 'zh', extLang: 'cmn', script: 'Hans', region: 'CN', variants: [], extensions: {}, privateUse: [] });
  validTag('cmn-Hans-CN', { language: 'cmn', extLang: null, script: 'Hans', region: 'CN', variants: [], extensions: {}, privateUse: [] });
  validTag('zh-yue-HK', { language: 'zh', extLang: 'yue', script: null, region: 'HK', variants: [], extensions: {}, privateUse: [] });
  validTag('yue-HK', { language: 'yue', extLang: null, script: null, region: 'HK', variants: [], extensions: {}, privateUse: [] });
});

describe('Language-Script-Region', function () {
  validTag('zh-Hans-CN', { language: 'zh', extLang: null, script: 'Hans', region: 'CN', variants: [], extensions: {}, privateUse: [] });
  validTag('sr-Latn-RS', { language: 'sr', extLang: null, script: 'Latn', region: 'RS', variants: [], extensions: {}, privateUse: [] });
});

describe('Language-Variant', function () {
  validTag('sl-rozaj', { language: 'sl', extLang: null, script: null, region: null, variants: ['rozaj'], extensions: {}, privateUse: [] });
  validTag('sl-rozaj-biske', { language: 'sl', extLang: null, script: null, region: null, variants: ['rozaj', 'biske'], extensions: {}, privateUse: [] });
  validTag('sl-nedis', { language: 'sl', extLang: null, script: null, region: null, variants: ['nedis'], extensions: {}, privateUse: [] });
});

describe('Language-Region-Variant', function () {
  validTag('de-CH-1901', { language: 'de', extLang: null, script: null, region: 'CH', variants: ['1901'], extensions: {}, privateUse: [] });
  validTag('sl-IT-nedis', { language: 'sl', extLang: null, script: null, region: 'IT', variants: ['nedis'], extensions: {}, privateUse: [] });
});

describe('Language-Script-Region-Variant', function () {
  validTag('hy-Latn-IT-arevela', { language: 'hy', extLang: null, script: 'Latn', region: 'IT', variants: ['arevela'], extensions: {}, privateUse: [] });
});

describe('Language-Region', function () {
  validTag('de-DE', { language: 'de', extLang: null, script: null, region: 'DE', variants: [], extensions: {}, privateUse: [] });
  validTag('en-US', { language: 'en', extLang: null, script: null, region: 'US', variants: [], extensions: {}, privateUse: [] });
  validTag('es-419', { language: 'es', extLang: null, script: null, region: '419', variants: [], extensions: {}, privateUse: [] });
});

describe('Private use subtags', function () {
  validTag('de-CH-x-phonebk', { language: 'de', extLang: null, script: null, region: 'CH', variants: [], extensions: {}, privateUse: ['phonebk'] });
  validTag('az-Arab-x-AZE-derbend', { language: 'az', extLang: null, script: 'Arab', region: null, variants: [], extensions: {}, privateUse: ['AZE', 'derbend'] });
});

describe('Private use registry values', function () {
  validTag('x-whatever', { language: null, extLang: null, script: null, region: null, variants: [], extensions: {}, privateUse: ['whatever'] });
  validTag('qaa-Qaaa-QM-x-southern', { language: 'qaa', extLang: null, script: 'Qaaa', region: 'QM', variants: [], extensions: {}, privateUse: ['southern'] });
  validTag('de-Qaaa', { language: 'de', extLang: null, script: 'Qaaa', region: null, variants: [], extensions: {}, privateUse: [] });
  validTag('sr-Latn-QM', { language: 'sr', extLang: null, script: 'Latn', region: 'QM', variants: [], extensions: {}, privateUse: [] });
  validTag('sr-Qaaa-RS', { language: 'sr', extLang: null, script: 'Qaaa', region: 'RS', variants: [], extensions: {}, privateUse: [] });
});

describe('Tags that use extensions', function () {
  validTag('en-US-u-islamcal', { language: 'en', extLang: null, script: null, region: 'US', variants: [], extensions: { u: ['islamcal'] }, privateUse: [] });
  validTag('zh-CN-a-myext-x-private', { language: 'zh', extLang: null, script: null, region: 'CN', variants: [], extensions: { a: ['myext'] }, privateUse: ['private'] });
  validTag('en-a-myext-b-another', { language: 'en', extLang: null, script: null, region: null, variants: [], extensions: { a: ['myext'], b: ['another'] }, privateUse: [] });
});

describe('Some Invalid Tags', function () {
  invalidTag('de-419-DE');
  invalidTag('a-DE');
  invalidTag('ar-a-aaa-b-bbb-a-ccc');
});

describe('Formatting', function () {
  [
    'de', 'fr', 'ja',
    'zh-Hant', 'zh-Hans', 'sr-Cyrl', 'sr-Latn',
    'zh-cmn-Hans-CN', 'cmn-Hans-CN', 'zh-yue-HK', 'yue-HK',
    'zh-Hans-CN', 'sr-Latn-RS',
    'sl-rozaj', 'sl-rozaj-biske', 'sl-nedis',
    'de-CH-1901', 'sl-IT-nedis',
    'hy-Latn-IT-arevela',
    'de-DE', 'en-US', 'es-419',
    'de-CH-x-phonebk', 'az-Arab-x-AZE-derbend',
    'x-whatever', 'qaa-Qaaa-QM-x-southern', 'de-Qaaa', 'sr-Latn-QM', 'sr-Qaaa-RS',
    'en-US-u-islamcal', 'zh-CN-a-myext-x-private', 'en-a-myext-b-another'
  ].forEach(function (tag: string) {
    it('identity ' + tag, function (done: (err?: any) => void) {
      var result = formatBCP47(parseBCP47(tag));

      expect(result).to.be(tag);

      done();
    });
  });
});

describe('Canonicalisation', function () {
  shouldCanonicalise('mN-cYrL-Mn', 'mn-Cyrl-MN');
  shouldCanonicalise('fr-Latn', 'fr');
});
