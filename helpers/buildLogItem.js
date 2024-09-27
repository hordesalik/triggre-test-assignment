import { buildSelectorSection } from './buildElementInfo.js';

/**
 * Converts an html string to an html element
 * @param {String} html 
 * @returns {HTMLElement}
 */
function html2Element(html) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return tempElement.children[0];
}

/**
 * @param {Array<Error>} errors
 * @returns {HTMLElement}
 */
export function buildErrorListItem(errors) {
    const errorListItemHtml = `
    <ul class="toolbar-log-error-list">
        ${errors.map((item) => `<li>${item.message}</li>`).join('')}
    <ul>
    `;
    return html2Element(errorListItemHtml);
}

/**
 * @param {HTMLElement} element 
 * @param {HTMLElement} rootElement
 * @return {HTMLElement}
 */
export function buildLogItem(element, rootElement) {
    const logItemHtml = `
    <div class="toolbar-log-item">
        <div>
            <strong>Selector: ${buildSelectorSection(element, rootElement)}</strong>
        </div>
    </div>
    `;

    return html2Element(logItemHtml);
}
