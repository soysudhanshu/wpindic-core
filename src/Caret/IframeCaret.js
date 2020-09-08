import Content_Editable_Caret from "./content-editable-caret.js";
/**
 * Class provides an interface to manipulate Caret inside a content editable area.
 * @constructor
 * @param {Element} element HTML Element
 */
export default class iFrame_Caret extends Content_Editable_Caret {

  caretInfo() {
    const selection = this.element.contentWindow.getSelection();
    const {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
      isCollapsed
    } = selection;

    // Offset and Node from where selection begins
    const start = {
      node: anchorNode,
      offset: anchorOffset
    };

    // Offset and Node where selection ends
    const end = {
      node: focusNode,
      offset: focusOffset
    };

    const caret = {
      isCollapsed,
      position: {
        start,
        end
      }
    };

    return caret;
  }
}
window.iFrame_Caret = iFrame_Caret;