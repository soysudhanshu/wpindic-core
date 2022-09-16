import GoogleTransliterator from '../GoogleTransliterator.js';
import LanguageTransliteratorInterface from '../Interfaces/LanguageTransliteratorInterface.js';

const cache = {};

class MarathiTransliterator extends LanguageTransliteratorInterface {
    static transliterate(word) {
        return new Promise((resolve, reject) => {
            this._getTransliteration(word)
                .then(this._addToCache)
                .then(transliteration => resolve(transliteration.transliterations[0]))
                .catch(error => reject(error));
        });
    }

    static suggest(word) {
        return new Promise((resolve, reject) => {
            this._getTransliteration(word)
                .then(this._addToCache)
                .then(transliteration => resolve(transliteration.transliterations))
                .catch(error => reject(error));
        });
    }

    static suggestAlternative(transliteratedText) {
        const possibles = {};
        for (const key in cache) {
            const transliteration = cache[key];
            const possibleTransliterations = transliteration.transliterations;
            if (possibleTransliterations.includes(transliteratedText)) {
                for (const text of possibleTransliterations) {
                    possibles[text] = '';
                }
            }
        }
        return Object.keys(possibles);
    }

    static _addToCache(transliteration) {
        cache[transliteration.original] = transliteration;
        return transliteration;
    }

    static _getTransliteration(word) {
        const transliterator = new GoogleTransliterator('mr');
        return transliterator.transliterate(word);
    }

    static getLang() {
        return 'mr';
    }
}

export default MarathiTransliterator;