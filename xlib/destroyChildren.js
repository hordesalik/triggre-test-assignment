import destroyElement from './destroyElement.js';

/**
 * Destroy all children elements in the elements tree withing the given root element walking from bottom to top
 * @param {HTMLElement} element - parent element
 * @param {object} context - context object
 */
export default function destroyChildren(element, context) {
    for (const child of element.children) {
        destroyChildren(child, context);
        destroyElement(child, context);
    }
}
