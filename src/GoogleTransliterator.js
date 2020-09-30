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
    /**
     * Determine if language is support is not.
     * @param {string} languageCode Two letter ISO 639-1 language code.
     * @returns {boolean}
     */
    static isSupported(languageCode){
        return supportedLanguages.includes(languageCode);
    }

    static transliterate(word, languageCode) {
        if(!isString(word)){
            throw new TypeError('Word must be string.');
        }

        if(!isString(languageCode)){
            throw new TypeError('Lanuage code must be string.');
        }

        if(!word.trim().length === 0){
            throw new TypeError('Transliteration word cannot be empty.')
        }

        if(!GoogleTransliterator.isSupported(languageCode)){
            throw new TypeError(`Language code ${languageCode} is not supported.`);
        }

        return new Promise((resolve, reject) => {
            this._getTransliteration(word, languageCode)
                .then(this._parseResponse.bind(this))
                .then(transliteration => resolve(transliteration))
                .catch(error => reject(error))
        });
    }

    static _getApiUrl(){
        return 'https://www.google.com/inputtools/request';
    }

    static _getImeMethodForLanguage(languageCode){
        return `transliteration_en_${languageCode}`;
    }

    static _getTransliteration(word, languageCode, suggestionCount = 5) {
        return axios({
            method: 'GET',
            url: GoogleTransliterator._getApiUrl(),
            params: {
                text: word,
                ime: GoogleTransliterator._getImeMethodForLanguage(languageCode),
                num: suggestionCount
            },
            responseType: "json"
        }).then(response => response.data);
    }

    static _parseResponse(responseJson) {
        const text = responseJson[1][0][0];
        const transliterations = responseJson[1][0][1];
        return new Transliteration(text, transliterations)
    }
    
}

export default GoogleTransliterator;