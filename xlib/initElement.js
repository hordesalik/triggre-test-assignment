import { setElementStatus } from './elementStatus.js';
import initChildren from './initChildren.js';
import WidgetDestroyed from './WidgetDestroyed.js';

/**
 * Initializes element: load widget class, instanciate, trigger init
 * @param {HTMLElement} element - the element to be initialized
 * @param {object} context - the context object
 * @returns {Promise} - promise which resolves once initialization is finished with a list of errors if any
 */
export default async function initElement(element, context) {
    const { elementInitMap, elementWidgetMap, resolver } = context;

    const widgetName = element.getAttribute('widget');
    if (!widgetName) {
        return initChildren(element, context);
    }

    const existingElementInit = elementInitMap.get(element);
    if (existingElementInit) {
        return existingElementInit;
    }

    const result = new Promise(async (resolve) => {
        try {
            setElementStatus(element, 'loading');
            const widgetClass = await resolver(widgetName);

            const widgetInstance = new widgetClass(element, context);
            elementWidgetMap.set(element, widgetInstance);

            setElementStatus(element, 'initializing');
            const errors = await widgetInstance.init();

            setElementStatus(element, 'success');
            resolve(errors);
        } catch (e) {
            console.warn(`Widget initialization error`, element, e);
            if (!(e instanceof WidgetDestroyed)) {
                setElementStatus(element, 'error');
            }
            resolve([e]);
        }
    });

    elementInitMap.set(element, result);

    return result;
}
