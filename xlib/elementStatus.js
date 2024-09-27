export const STATUS_ATTRIBUTE_NAME = 'status';

/**
 * Sets the "status" attribute for a given element
 * @param {HTMLElement} element 
 * @param {string} status 
 */
export function setElementStatus(element, status) {
    element.setAttribute(STATUS_ATTRIBUTE_NAME, status);
}

/**
 * Returns an element's status
 * @param {HTMLElement} element 
 * @returns {string|undefined}
 */
export function getElementStatus(element) {
    return element.getAttribute(STATUS_ATTRIBUTE_NAME);
}

/**
 * Removes the "status" attribute from the element
 * @param {HTMLElement} element 
 */
export function removeElementStatus(element) {
    element.removeAttribute(STATUS_ATTRIBUTE_NAME);
}
