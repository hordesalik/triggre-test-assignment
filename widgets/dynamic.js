import Widget from '../xlib/Widget.js';

const DYNAMIC_TEMPLATE = `
    Dynamic content attached

    <div widget="widgets/dynamic-child">Dynamic child 1</div>
    <div widget="widgets/dynamic-child">Dynamic child 1</div>
    <div widget="widgets/dynamic-child">Dynamic child 1</div>
`;

/**
 * Widget with a dynamic content added
 */
export default class DynamicWidget extends Widget { 
    initActual() {
        this.element.innerHTML = DYNAMIC_TEMPLATE;

        return super.initActual();
    }
}
