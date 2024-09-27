import dynamicImportResolver from './resolvers/dynamicImportResolver.js';
import initElement from './initElement.js';
import destroyChildren from './destroyChildren.js';
import destroyElement from './destroyElement.js';

export default class X {
    constructor({
        resolver = dynamicImportResolver
    } = {}) {
        this.resolver = resolver;
        this.elementInitMap = new Map();
        this.elementWidgetMap = new Map();
    }

    createContext() {
        const { elementInitMap, elementWidgetMap, resolver } = this;

        return {
            elementInitMap,
            elementWidgetMap,
            resolver,
        };
    }

    async init(rootElement, callback) {
        const context = this.createContext();

        const result = await initElement(rootElement, context);

        callback(result);

        return result;
    }

    destroy(rootElement) {
        const context = this.createContext();

        destroyChildren(rootElement, context);
        destroyElement(rootElement, context);
    }
}
