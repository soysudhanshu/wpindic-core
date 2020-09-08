import  InputCaret from "./Caret/InputCaret.js";
import HindiTransliterator from "./Transliterators/HindiTransliterator.js";

class Writer{
    /**
     * 
     * @param {HTMLElement} element 
     * @param {*} language 
     */
    constructor(element, language = 'hi') {
        this.element = element;
        this.language = language;
        this.caret = new InputCaret(element);
        this.element.addEventListener('keydown', this.processKeyStrokes.bind(this));
    }

    /**
     * Process keystrokes and determines 
     * wether to initiate transliteration or
     * not.
     * @param {KeyboardEvent} event 
     */
    processKeyStrokes(event){
        /**
         * We only want to process text once user has 
         * finished typing a word. ie. when user has 
         * entered space or a white space char
         */
        const inputChar = event.key;

        /**
         * Halt execution is space is not entered.
         */
        if(inputChar === 'Backspace'){
            // event.preventDefault();
            this._suggestTransliterations(event);
        }
        else if(/\s/.test(inputChar) || inputChar === 'Enter'){
            this._transliterate();
        }
        
    }

    async _transliterate(){
        const word = this.caret.lastWord();
        const transliteration = await HindiTransliterator.transliterate(word.text);
        console.log(transliteration);
        this.caret.replace(transliteration, word.start, word.end);
    }

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    async _suggestTransliterations(event){
        const word = this.caret.lastWord();
        const suggestions = HindiTransliterator.suggestAlternative(word.text);
        console.log(suggestions);
    }
}

window.Writer = Writer;