import Caret from "./caret.js";
import * as helper from "./helper/nodes.js";
/**
 * Class provides an interface to manipulate Caret inside a content editable area.
 * @constructor
 * @param {Element} element HTML Element
 */
export default class Content_Editable_Caret extends Caret {
  lastWord() {
    const caret = this.caretInfo();

    // Collapsed caret is required
    if (!caret.isCollapsed) {
      return null;
    }

    // Get content of current node
    const node = {
      current: caret.position.end.node,
      previous: caret.position.end.node.previousSibling
    };

    if (node.previous === null) {
      node.previous = helper.previousNode(node.current);
    }

    if (node.previous === this.element) {
      node.previous = null;
    }

    // Check content
    const nodeContent = {
      current: node.current.nodeValue,
      previous: ""
    };

    if (node.previous !== null) {
      nodeContent.previous = node.previous.nodeValue;
    }

    // Extract last word from node list
    const requiredContent = nodeContent.current.substr(0, caret.position.end.offset);
    const trimmedContent = requiredContent.trimRight();
    const wordList = trimmedContent.split(" ");

    let lastWord = wordList[wordList.length - 1];
    const wordLength = lastWord.length;

    const wordInfo = {
      word: lastWord,
      node: node.current,
      position: {
        start: trimmedContent.length - wordLength,
        end: trimmedContent.length
      }
    };

    return wordInfo;
  }

  replace(replace, start, end, node) {
    // Select
    const range = new Range();
    range.setStart(node, start);
    range.setEnd(node, end);

    // Replace
    range.deleteContents();
    range.insertNode(document.createTextNode(replace));
  }

  caretInfo() {
    const selection = window.getSelection();
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
