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
        this.caret = new (caretChooser(this.element))(this.element);
        let iframe = null;
        if (this.caret instanceof iFrameCaret) {
            iframe = this.element;

            this.element.contentWindow.addEventListener(
                "keydown",
                this.processKeyStrokes.bind(this)
            );
            
        } else {
            this.element.addEventListener('keydown', this.processKeyStrokes.bind(this));
        }

        
        this.tribute = new Tribute({
            values: this._suggestTransliterations.bind(this),
            trigger: '',
            lookup: (values, selected) => {
                console.log(values, selected);
                return selected + values.value;
            },
            menuItemTemplate: function (item) {
                return item.original.value;
            },
            iframe,
            noMatchTemplate: () => {
                return `<span> Done </span>`;
            }
        });
        this.tribute.attach(this.element);
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
        if (inputChar === 'Backspace') {
            // event.preventDefault();
            // this._suggestTransliterations(event);
            this.tribute.showMenuForCollection(this.element);
        }
        else if ((/\s/.test(inputChar) || inputChar === 'Enter') && !this.tribute.isActive) {
            this._transliterate();
        }

    }

    async _transliterate() {
        const word = this.caret.lastWord();
        const transliteration = await HindiTransliterator.transliterate(word.text);
        this.caret.replace(transliteration, word);
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    async _suggestTransliterations(text, cb) {
        console.log(text);
        // const word = this.caret.lastWord();
        const suggestions = HindiTransliterator.suggestAlternative(text);
        // const suggestions = await HindiTransliterator.suggest('apple');
        const tributeData = suggestions.map(text => ({ key: text, value: text }));
        cb(tributeData);
    }
}

export default Writer;