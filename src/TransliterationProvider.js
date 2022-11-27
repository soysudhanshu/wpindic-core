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

class TransliterationProvider extends TransliteratorInterface {

    constructor(languageCode, providerUrl = "https://writer.soysudhanshu.com/transliterate") {
        super();

        if (!supportedLanguages.includes(languageCode)) {
            throw new TypeError(`Language code ${languageCode} is not supported.`);
        }

        this.providerUrl = providerUrl;
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
            this._getTransliteration(word)
                .then(this._parseResponse.bind(this))
                .then(transliteration => resolve(transliteration))
                .catch(error => reject(error))
        });
    }

    _getTransliteration(word) {
        return axios({
            method: 'GET',
            url: this.providerUrl,
            params: {
                text: word,
                language: this.language,
            },
            responseType: "json"
        }).then(response => response.data);
    }

    _parseResponse(responseJson) {
        return new Transliteration(
            responseJson.original,
            responseJson.alternatives
        );
    }
}

export default TransliterationProvider;