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

class GoogleTransliterator extends TransliteratorInterface {

    constructor(languageCode) {
        super();
        
        if (!supportedLanguages.includes(languageCode)) {
            throw new TypeError(`Language code ${languageCode} is not supported.`);
        }

        this.language = languageCode;
    }

    transliterate(word) {
        if (!isString(word)) {
            throw new TypeError('Word must be string.');
        }

        if (!word.trim().length === 0) {
            throw new TypeError('Transliteration word cannot be empty.')
        }

        return new Promise((resolve, reject) => {
            this._getTransliteration(word, this.language)
                .then(this._parseResponse.bind(this))
                .then(transliteration => resolve(transliteration))
                .catch(error => reject(error))
        });
    }

    _getApiUrl() {
        return 'https://www.google.com/inputtools/request';
    }

    _getImeMethod() {
        return `transliteration_en_${this.language}`;
    }

    _getTransliteration(word, suggestionCount = 5) {
        return axios({
            method: 'GET',
            url: this._getApiUrl(),
            params: {
                text: word,
                ime: this._getImeMethod(),
                num: suggestionCount
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