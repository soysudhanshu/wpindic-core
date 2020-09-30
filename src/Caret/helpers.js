import ContentEditableCaret from './ContentEditableCaret.js';
import InputCaret from './InputCaret.js';
import iFrameCaret from './iFrameCaret.js';
/**
 * Returns caret handling class based on given element.
 * @param {Element} element Element on which Caret will be bound.
 * @returns {Caret} Return one of the caret handler Class
 */
export function caretChooser(element) {
    const { tagName, contentEditable } = element;
    const tag = tagName.toLowerCase();

    if (contentEditable === "true") {
        return ContentEditableCaret;
    }

    if (tag === "input" || tag === "textarea") {
        return InputCaret;
    }

    if (tag === "iframe") {
        return iFrameCaret;
    }
    return null;
}

/**
 * Returns a HTML Node that is precedes given node.
 * @param {Node} node
 * @returns {Node|null}  Returns a node that is immediately before provided
 *      node
 */
export function previousNode( node ){
    
    let previous =  node.previousSibling;

    if (previous !== null) {
       return previous;
    }
    // Returns last node 
    const parent = node.parentElement;
    
    previous = parent.previousSibling;

    return previous;
}
