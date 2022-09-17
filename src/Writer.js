import Tribute from "tributejs";
import { caretChooser } from "./Caret/helpers.js";
import iFrameCaret from "./Caret/iFrameCaret.js";
import InputCaret from "./Caret/InputCaret.js";

class Writer {
    /**
     * Enables transliteration writing for form input elements
     * for indic languages.
     *
     * @param {HTMLElement} element Form input element to use for transliterations.
     * @param {*} language ISO 639-1 code of indic language.
     */
    constructor(element, transliterator) {
        element.writer = this;
        this.element = element;
        this.caret = new InputCaret(this.element);
        this.element.addEventListener('keydown', this.processKeyStrokes.bind(this));


        this.transliterator = transliterator;

        /**
         * Waiting queue for words
         * which needs to be transliterated.
         */
        this.transliterationQueue = [];

        /**
         * Being transliteration.
         */
        setTimeout(this._transliterate.bind(this), 1000);

        this.suggestionEngine = new Tribute({
            values: this._suggestTransliterations.bind(this),
            trigger: '',
            lookup: (values, selected) => {
                return selected + values.value;
            },
            menuItemTemplate: function (item) {
                return item.original.value;
            },
            noMatchTemplate: function (item) {
                return '';
            }
        });

        this.suggestionEngine.attach(this.element);

        this.lastInputKey = null;
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
        if ((/\s/.test(inputChar) || inputChar === 'Enter') && !this.suggestionEngine.isActive) {
            /**
             * We will add every word to queue as it is
             * being typed and then we will loop over
             * them one by one and transliterate them.
             */
            this._updateTransliterationQueue();
        } else if (inputChar === 'Backspace') {
            this.suggestionEngine.showMenuForCollection(this.element);
        }

        this.lastInputKey = inputChar;
    }

    /**
     * Adds last typed word into transliteration queue.
     */
    _updateTransliterationQueue() {
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
    _updateQueueWordPositions(after, change) {
        this.transliterationQueue.forEach(word => {
            /**
             * We only modify words which come
             * after the word we transliterated.
             */
            if (word.start >= after) {
                word.start += change;
                word.end += change;
            }
        });
    }

    async _transliterate() {

        const isTransliterationQueueEmpty = this.transliterationQueue.length === 0;

        if (!isTransliterationQueueEmpty) {
            const word = this.transliterationQueue.shift();
            const transliteration = await this.transliterator.transliterate(word.text);

            if (typeof transliteration !== "undefined" && this._inputValueIsUnchanged(word)) {
                this.caret.replace(transliteration, word);
                const change = transliteration.length - word.text.length;
                this._updateQueueWordPositions(word.end, change);
            }
        }

        /**
         * We are going to increase wait
         * time for next call to 1000 microseconds
         * if `transliteration queue` is empty.
         *
         */
        let waitTime = 0;
        if (isTransliterationQueueEmpty) {
            waitTime = 1000;
        }
        /**
         * We are not going to wait here
         */
        setTimeout(this._transliterate.bind(this), waitTime);
    }

    _inputValueIsUnchanged(word) {
        /**
        * Verify same word exists in the
        * input before replacing it.
        */

        return word.text === this.element.value.substring(word.start, word.end);
    }

    /**
     * Suggests alternative transliteration for given word.
     * @param {KeyboardEvent} event
     */
    async _suggestTransliterations(text, cb) {
        const word = this.caret.lastWord();
        const suggestions = this.transliterator.suggestAlternative(word.text);
        const tributeData = suggestions.map(text => ({ key: text, value: text }));
        cb(tributeData);
    }
}

export default Writer;