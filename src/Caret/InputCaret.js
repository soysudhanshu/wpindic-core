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
    const caretPosition = caret.position;
    
    // Collapsed caret is required
    if(!caret.isCollapsed){ return null;}

    /**
     * Extract text contents of the element.
     * @var {string} text
     */
    const text = this.element.value;

    /**
     * Here, we are going to extract last word to
     * the left of text inserter. For that 
     * 
     * 1. We'll extract portion of the string until current caret
     * position.
     * 2. We trim off string end to keep only word at the end.
     * 3. We spilt string based on spaces and return last element as the
     * word.
     */
    const textUntilInserter = text.substr(0, caretPosition.end).trimEnd();
    const lastWord = textUntilInserter.split(/\s/g).pop();

    /**
     * We calculate word start and end offsets.
     */
    const wordEndOffset = textUntilInserter.length;
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
