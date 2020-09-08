import Input_Caret from "../input-caret.js";
import Content_Editable_Caret from "../content-editable-caret.js";
import Caret from "../caret.js";
import iFrame_Caret from "../iframe-caret.js";

/**
 * Returns caret handling class based on given element.
 * @param {Element} element Element on which Caret will be bound.
 * @returns {Caret} Return one of the caret handler Class
 */

export default function CaretChooser(element) {
  const { tagName, contentEditable } = element;
  const tag = tagName.toLowerCase();

  if (contentEditable === "true") {
    return Content_Editable_Caret;
  }

  if (tag === "input" || tag === "textarea") {
    return Input_Caret;
  }

  if(tag === "iframe"){
    return iFrame_Caret;
  }
  return null;
}
