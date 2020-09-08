import TransliteratorInterface from "./Interfaces/TransliterateInterface.js";
import axios from "axios";
import Transliteration from "./Transliteration.js";

class GoogleTransliterator extends TransliteratorInterface {
    /**
     * 
     */
    constructor(languageCode) {
        super();
        this._currentLanguage = languageCode;
        this._supportedLanguages = {
            'hi': 'हिन्दी'
        };
        
        this._supportedLanguagesCode = Object.keys(this._supportedLanguages);

        if (!this._supportedLanguagesCode.includes(languageCode)) {
            throw new Error(`Language code ${languageCode} is not supported.`);
        }

        this._remoteApi = 'https://www.google.com/inputtools/request'
        this._inputMethod = `transliteration_en_${languageCode}`;
        this._suggestionCount = 5;
    }

    transliterate(word) {
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
            url: this._remoteApi,
            params: {
                text: word,
                ime: this._inputMethod,
                num: this._suggestionCount
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