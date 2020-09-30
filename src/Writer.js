import HindiTransliterator from "./Transliterators/HindiTransliterator.js";
import Tribute from "tributejs";
import { caretChooser } from "./Caret/helpers.js";
import iFrameCaret from "./Caret/iFrameCaret.js";
import InputCaret from "./Caret/InputCaret.js";

class Writer {
    /**
     * 
     * @param {HTMLElement} element 
     * @param {*} language 
     */
    constructor(element, language = 'bn') {
        element.writer = this;
        this.element = element;
        this.language = language;
        this.caret = new InputCaret(this.element);
        this.element.addEventListener('keydown', this.processKeyStrokes.bind(this));

        /**
         * Waiting queue for words 
         * which needs to be transliterated.
         */
        this.transliterationQueue = [];
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

    async _transliterate() {
        const word = this.caret.lastWord();
        const transliteration = await HindiTransliterator.transliterate(word.text);
        this.caret.replace(transliteration, word);
    }
}

export default Writer;