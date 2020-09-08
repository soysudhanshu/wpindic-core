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
