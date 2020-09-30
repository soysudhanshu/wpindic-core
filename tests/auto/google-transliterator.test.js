import GoogleTransliterator from '../../src/GoogleTransliterator.js';
import TransliteratorInterface from '../../src/Interfaces/TransliterateInterface.js';

test('Is instance of TransliteratorInterface', () => {
    expect((new GoogleTransliterator) instanceof TransliteratorInterface).toBeTruthy()
});

test('Supported Languages', () => {
    expect(GoogleTransliterator.isSupported([])).toBeFalsy();
    expect(GoogleTransliterator.isSupported('')).toBeFalsy();
    expect(GoogleTransliterator.isSupported(0)).toBeFalsy();
    expect(GoogleTransliterator.isSupported({})).toBeFalsy();
    expect(GoogleTransliterator.isSupported(new String)).toBeFalsy();
    expect(GoogleTransliterator.isSupported(new String('hi'))).toBeTruthy();
    expect(GoogleTransliterator.isSupported('hi')).toBeTruthy();
});


test('Transliterate', () => {
    expect(GoogleTransliterator.transliterate.bind(null)).toThrowError(TypeError);
    expect(GoogleTransliterator.transliterate.bind(null, '', '')).toThrowError(TypeError);
    expect(GoogleTransliterator.transliterate.bind(null, 'test', '')).toThrowError(TypeError);
    expect(GoogleTransliterator.transliterate.bind(null, 'test', 'bla')).toThrowError(TypeError);
    expect(GoogleTransliterator.transliterate.bind(null, ['blah'], ['bla'])).toThrowError(TypeError);
    expect(GoogleTransliterator.transliterate.bind(null, {}, {})).toThrowError(TypeError);
    expect(GoogleTransliterator.transliterate.bind(null, 'angrezi', 'hi')).toBeTruthy();
    expect(GoogleTransliterator.transliterate.bind(null, new String('angrezi'), new String('hi'))).toBeTruthy();
});

test('Supports Indic Languages', () => {
    // Bengali
    expect(GoogleTransliterator.isSupported('bn')).toBeTruthy();
    // Gujarati
    expect(GoogleTransliterator.isSupported('gu')).toBeTruthy();
    // Hindi
    expect(GoogleTransliterator.isSupported('hi')).toBeTruthy();
    // Kannada
    expect(GoogleTransliterator.isSupported('kn')).toBeTruthy();
    // Malayalam
    expect(GoogleTransliterator.isSupported('ml')).toBeTruthy();
    // Marathi
    expect(GoogleTransliterator.isSupported('mr')).toBeTruthy();
    // Nepali
    expect(GoogleTransliterator.isSupported('ne')).toBeTruthy();
    // Oriya
    expect(GoogleTransliterator.isSupported('or')).toBeTruthy();
    // Punjabi
    expect(GoogleTransliterator.isSupported('pa')).toBeTruthy();
    // Sanskrit
    expect(GoogleTransliterator.isSupported('sa')).toBeTruthy();
    // Sinhala
    expect(GoogleTransliterator.isSupported('si')).toBeTruthy();
    // Tamil
    expect(GoogleTransliterator.isSupported('ta')).toBeTruthy();
    // Telugu
    expect(GoogleTransliterator.isSupported('te')).toBeTruthy();
    // Urdu
    expect(GoogleTransliterator.isSupported('ur')).toBeTruthy();
});


