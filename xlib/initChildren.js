import initElement from './initElement.js';

/**
 * Iterates over children elements and triggers theirs initialization
 * @param {HTMLElement} rootElement - an parent element which children need to be initialized
 * @param {object} context - a context object
 * @returns {Promise<Error[]>} - a promise which resolves with an array of errors
 */
export default async function initChildren(rootElement, context) {
    const childrenPromises = Array.from(rootElement.children).map(
        async (element) => {
            try {
                return await initElement(element, context);
            } catch (e) {
                console.warn('Failed to initialize child element', element, Object.keys(e), e);
                return [e];
            }
        }
    );

    const childrenResults = await Promise.all(childrenPromises);
    const errors = childrenResults.flat();

    return errors;
}