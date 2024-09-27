/**
 * @param {HTMLElement} element 
 */
function buildElementIdentifier(element) {
    if (element.id) {
        return `#${element.id}`;
    }
    const parts = [element.tagName];
    if (element.getAttribute('widget')) {
        parts.push(`[widget="${element.getAttribute('widget')}"]`);
    }
    return parts.join('');
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} rootElement
 * @returns {Array<String>}
 */
function buildSelectorItems(element, rootElement) {
    if (element === rootElement) {
        return [buildElementIdentifier(element)];
    } else {
        return [...buildSelectorItems(element.parentNode, rootElement), buildElementIdentifier(element)];
    }
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} rootElement
 * @returns {String}
 */
export function buildSelectorSection(element, rootElement) {
    return buildSelectorItems(element, rootElement).join(' &gt; ');
}

/**
 * @param {HTMLElement} element 
 * @returns {String}
 */
function buildWidgetSection(element) {
    return element.getAttribute('widget') || 'Not A Widget';
}

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} rootElement
 * @returns {String}
 */
export default function buildElementInfo(element, rootElement) {
    return `
        <div>Selector: ${buildSelectorSection(element, rootElement)}</div>
        <div>Widget: ${buildWidgetSection(element)}</div>
    `
}
