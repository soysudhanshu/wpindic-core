import CaretInterface from "./CaretInterface.js";

/**
 * Class provides Caret manipulation within a textarea or input element.
 * @class Input_Caret
 * @property {HTMLInputElement} element
 */
export default class InputCaret extends CaretInterface {
  /**
   * @constructor
   * @param {Element} element Accepts textarea and input element.
   */
  constructor(element) {
    super();
    this.element = element;
    
  }
  
  /**
   * Finds last word from the Caret position and returns caret position
   *    along with word position 
   * @returns {object|null}  Object with word and word's start and end position.
   */
  lastWord() {
    const caret = this.caretInfo();
    
    // Collapsed caret is required
    if(!caret.isCollapsed){ return null;}

    const text = this.element.value;
    const trailingTrimmedText = text.trimEnd();

    const wordEndOffset = trailingTrimmedText.length;

    /**
     * Getting start offset
     */
    const lastWord = trailingTrimmedText.split(/\s/g).pop();
    
    let wordStartOffset = wordEndOffset - lastWord.length;
    
    if(wordEndOffset < 0){
      wordStartOffset = 0;
    }

    return {
      text: lastWord,
      start: wordStartOffset,
      end: wordEndOffset
    }
  }

  /**
   * Returns Caret information of current element.
   * @return {object} Object with caret position and collapsed status info.
   *     
   */
  caretInfo() {
    const caret = {
      isCollapsed: true,
      position: {
        start: 0,
        end: 0
      }
    };

    const selection = {
      start: this.element.selectionStart,
      end: this.element.selectionEnd
    };

    caret.isCollapsed = selection.start === selection.end;

    if (caret.isCollapsed) {
      caret.position.end = caret.position.start = selection.start;
    }

    caret.position = selection;

    return caret;
  }

  /**
   * Replace given text at specific offset without disturbing caret.
   * @param {string} replacement
   * @param {number} start
   * @param {number} end
   * @return {void}
   */

  replace(replacement, word) {
    this.element.setRangeText(replacement, word.start, word.end);
  }
}
