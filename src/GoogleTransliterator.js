import TransliteratorInterface from "./Interfaces/TransliterateInterface.js";
import axios from "axios";
import Transliteration from "./Transliteration.js";
import { isString } from "./helpers.js";

/**
 * @var supportedLanguages ISO 639-1 code of supported languages
 */
const supportedLanguages = [
    'bn', 'gu', 'hi',
    'kn', 'ml', 'mr',
    'ne', 'or', 'pa',
    'sa', 'si', 'ta',
    'te', 'ur'
];

const TRANSLITERATE_API_URL = 'https://www.google.com/inputtools/request';

class GoogleTransliterator extends TransliteratorInterface {

    constructor(languageCode, suggestionCount = 5) {
        super();

        if (!supportedLanguages.includes(languageCode)) {
            throw new TypeError(`Language code ${languageCode} is not supported.`);
        }

        this.language = languageCode;
        this.suggestionCount = suggestionCount;
        this.imeMethod = `transliteration_en_${this.language}`;
    }

    transliterate(word) {
        if (!isString(word)) {
            throw new TypeError('Word must be string.');
        }

        if (!word.trim().length === 0) {
            throw new TypeError('Transliteration word cannot be empty.')
        }

        return new Promise((resolve, reject) => {
            this._getTransliteration(word)
                .then(this._parseResponse.bind(this))
                .then(transliteration => resolve(transliteration))
                .catch(error => reject(error))
        });
    }

    _getTransliteration(word) {
        return axios({
            method: 'GET',
            url: TRANSLITERATE_API_URL,
            params: {
                text: word,
                ime: this.imeMethod,
                num: this.suggestionCount,
            },
            responseType: "json"
        }).then(response => response.data);
    }

    _parseResponse(responseJson) {
        const text = responseJson[1][0][0];
        const transliterations = responseJson[1][0][1];
        return new Transliteration(text, transliterations)
    }
}

export default GoogleTransliterator;