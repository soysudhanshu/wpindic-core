import HindiTransliterator from "./Transliterators/HindiTransliterator.js";
import Tribute from "tributejs";
import { caretChooser } from "./Caret/helpers.js";
import iFrameCaret from "./Caret/iFrameCaret.js";
import InputCaret from "./Caret/InputCaret.js";
import BanglaTransliterator from "./Transliterators/BanglaTransliterator.js";
import GujratiTransliterator from "./Transliterators/GujratiTransliterator.js";
import KannadaTransliterator from "./Transliterators/KannadaTransliterator.js";
import MalyalamTransliterator from "./Transliterators/MalyalamTransliterator.js";
import NepaliTransliterator from "./Transliterators/NepaliTransliterator.js";
import OriyaTransliterator from "./Transliterators/OriyaTransliterator.js";
import PunjabiTransliterator from "./Transliterators/PunjabiTransliterator.js";
import SanskritTransliterator from "./Transliterators/SanskritTransliterator.js";
import SinhalaTransliterator from "./Transliterators/SinhalaTransliterator.js";
import TamilTransliterator from "./Transliterators/TamilTransliterator.js";
import TelguTransliterator from "./Transliterators/TelguTransliterator.js";
import UrduTransliterator from "./Transliterators/UrduTransliterator.js";
import MarathiTransliterator from "./Transliterators/MarathiTransliterator.js";

const supportedLanguageTransliterators = [
    BanglaTransliterator,
    GujratiTransliterator,
    HindiTransliterator,
    KannadaTransliterator,
    MarathiTransliterator,
    MalyalamTransliterator,
    NepaliTransliterator,
    OriyaTransliterator,
    PunjabiTransliterator,
    SanskritTransliterator,
    SinhalaTransliterator,
    TamilTransliterator,
    TelguTransliterator,
    UrduTransliterator
];

class Writer {
    /**
     * Enables transliteration writing for form input elements
     * for indic languages.
     * 
     * @param {HTMLElement} element Form input element to use for transliterations.
     * @param {*} language ISO 639-1 code of indic language.
     */
    constructor(element, language = 'bn') {
        element.writer = this;
        this.element = element;
        this.language = language;
        this.caret = new InputCaret(this.element);
        this.element.addEventListener('keydown', this.processKeyStrokes.bind(this));

        const availableTransliterators  = supportedLanguageTransliterators
            .filter(transliterator => language === transliterator.getLang());

        const isLanguageSupported = availableTransliterators.length !== 0;
        
        if(!isLanguageSupported){
            throw new Error(`${language} is not supported.`);
        }

        /**
         * Transliterator which will be used for transliterating 
         * user input.
         * 
         * We pick first transliterator for transliterations. 
         */
        this.transliterator = availableTransliterators.shift();

        /**
         * Waiting queue for words 
         * which needs to be transliterated.
         */
        this.transliterationQueue = [];

        /**
         * Being transliteration.
         */
        setTimeout(this._transliterate.bind(this), 1000);
    }

    /**
     * Process keystrokes and determines 
     * wether to initiate transliteration or
     * not.
     * @param {KeyboardEvent} event 
     */
    processKeyStrokes(event) {
        /**
         * We only want to process text once user has 
         * finished typing a word. ie. when user has 
         * entered space or a white space char
         */
        const inputChar = event.key;
        /**
         * Halt execution is space is not entered.
         */
        if ((/\s/.test(inputChar) || inputChar === 'Enter')) {
            /**
             * We will add every word to queue as it is 
             * being typed and then we will loop over 
             * them one by one and transliterate them.
             */
            this._updateTransliterationQueue();
        }
    }

    /**
     * Adds last typed word into transliteration queue.
     */
    _updateTransliterationQueue(){
        const word = this.caret.lastWord();
        this.transliterationQueue.push(word);
    }

    /**
     * Updates position of words in the queue 
     * after replacement by transliterator.
     * 
     * Often times transliterated strings have 
     * different lengths. This functions corrects
     * those length errors. Iterating over the queue 
     * and changing offsets.
     * 
     * @param {int} after Words with starting offset greater than 
     * this will see shift in position.
     * 
     * @param {int} change Position shift of word.
     */
    _updateQueueWordPositions(after, change){
        this.transliterationQueue.forEach(word => {
            /**
             * We only modify words which come 
             * after the word we transliterated.
             */
            if(word.start >= after){
                word.start += change;
                word.end += change;
            }
        });
    }

    async _transliterate() {

        const isTransliterationQueueEmpty = this.transliterationQueue.length === 0;

        if(!isTransliterationQueueEmpty){
            const word = this.transliterationQueue.shift();        
            const transliteration = await this.transliterator.transliterate(word.text);
            this.caret.replace(transliteration, word);
            const change = transliteration.length  - word.text.length;
            this._updateQueueWordPositions(word.end, change);
        }

        /**
         * We are going to increase wait
         * time for next call to 1000 microseconds
         * if `transliteration queue` is empty.
         * 
         */
        let waitTime = 0;
        if(isTransliterationQueueEmpty){
            waitTime = 1000;
        }
        /**
         * We are not going to wait here 
         */
        setTimeout(this._transliterate.bind(this), waitTime);
    }
}

export default Writer;