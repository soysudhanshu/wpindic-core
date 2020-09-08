import GoogleTransliterator from '../GoogleTransliterator.js';

const transliterator = new GoogleTransliterator('hi');
const cache = {};

class HindiTransliterator {
    static transliterate(word) {
        return new Promise((resolve, reject) => {
            transliterator.transliterate(word)
                .then(HindiTransliterator._addToCache)
                .then(transliteration => resolve(transliteration.transliterations[0]))
                .catch(error => reject(error));
        });
    }

    static suggest(word) {
        return new Promise((resolve, reject) => {
            transliterator.transliterate(word)
                .then(HindiTransliterator._addToCache)
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


}

export default HindiTransliterator;