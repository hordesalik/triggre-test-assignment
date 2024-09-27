import { removeElementStatus } from './elementStatus.js';

/**
 * Destroys a single element and cleanup data
 * @param {HTMLElement} element - the element to be destroyed
 * @param {Map} elementInitMap - mapping elements to theirs initialization
 * @param {Map} elementWidgetMap - mapping elements to theirs widgets
 * @returns {void}
 */
export default function destroyElement(element, context) {
    const { elementInitMap, elementWidgetMap } = context;
    if (!element.getAttribute('widget')) {
        return;
    }

    elementInitMap.delete(element);

    const widgetInstance = elementWidgetMap.get(element);
    if (widgetInstance) {
        widgetInstance.destroy();
        elementWidgetMap.delete(element);
    }

    removeElementStatus(element);
}