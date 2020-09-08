/**
 * Abstract class Caret
 * @constructor
 * @param {Element} element HTML Element
 */
export default class CaretInterface {
  
  constructor(element) {
    this.element = element;
  }

  /**
   * Function returns last word from the current position of caret.
   * @returns {object} Returns Object containing word and its position
   */
  lastWord() {
    throw new Error("lastWord() method must be implemented.");
  }

  /**
   * @param {string} replace Replacement text for that range.
   * @param {int} start Starting character offset for replacement range.
   * @param {int} end End character offset for replacement range.
   * @param {Node} node HTML node to perform replacement on 
   */
  replace(replace, start, end, node) {
    throw new Error("replace() method must be implemented.");
  }

  /**
   * Returns Caret information.
   * @return {object} Object with caret position and collapsed status info.
   */
  caretInfo() {
    throw new Error("caretInfo() method must be implemented.");
  }
}
