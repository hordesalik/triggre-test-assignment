import { JSDOM } from 'jsdom';

export const CREATE_ELEMENT_DEFAULT_DOM_STR = `<!DOCTYPE html>
    <div id="element">Element</div>
`;

export const CREATE_ELEMENT_DEFAULT_ELEMENT_ID = 'element';

export default function createElement(
    domStr = CREATE_ELEMENT_DEFAULT_DOM_STR,
    elementId = CREATE_ELEMENT_DEFAULT_ELEMENT_ID,
) {
    const dom = new JSDOM(domStr);
    return dom.window.document.getElementById(elementId);
}
