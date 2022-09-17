const cache = {};

class LanguageTransliterator {

    constructor(transliterationProvider) {
        this.transliterationProvider = transliterationProvider;
    }

    transliterate(word) {
        return new Promise((resolve, reject) => {
            this.transliterationProvider.transliterate(word)
                .then(this._addToCache)
                .then(transliteration => resolve(transliteration.transliterations[0]))
                .catch(error => reject(error));
        });
    }

    suggest(word) {
        return new Promise((resolve, reject) => {
            this.transliterationProvider._getTransliteration(word)
                .then(this._addToCache)
                .then(transliteration => resolve(transliteration.transliterations))
                .catch(error => reject(error));
        });
    }

    suggestAlternative(transliteratedText) {
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

    _addToCache(transliteration) {
        cache[transliteration.original] = transliteration;
        return transliteration;
    }
}

export default LanguageTransliterator;