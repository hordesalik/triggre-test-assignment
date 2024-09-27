import { describe, test, it, mock } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import initElement from '../initElement.js';
import { STATUS_ATTRIBUTE_NAME } from '../elementStatus.js';
import createElement from '../testUtils/helpers/createElement.js';
import createContext from '../testUtils/helpers/createContext.js';
import MockWidget from '../testUtils/mocks/MockWidget.js';
import MockWidgetInitDelayed from '../testUtils/mocks/MockWidgetInitDelayed.js';
import waitPromise from '../testUtils/helpers/waitPromise.js';
import WidgetDestroyed from '../WidgetDestroyed.js';

function createWidgetElement() {
    const domStr = `<!DOCTYPE html>
        <div id="element" widget="w1">Widget 1</div>
    `;
    return createElement(domStr);
}

function createNoWidgetElement() {
    const domStr = `<!DOCTYPE html>
        <div id="element">No Widget Block</div>
    `;
    return createElement(domStr);
}

describe('initElement tests', async () => {
    await test(`Skips the initialization if element doesn't have a "widget" attribute`, async () => {
        const element = createNoWidgetElement();
        const context = createContext();

        await initElement(element, context);

        await it(`The "resolver" wasn't called`, () => {
            strictEqual(context.resolver.mock.callCount(), 0);
        })
        await it(`The element wasn't put to the "elementInitMap"`, () => {
            strictEqual(context.elementInitMap.has(element), false);
        });
        await it(`The "status" attribute on the given element is not set`, () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), null);
        });
    });

    await test('First initialization', async () => {
        const element = createWidgetElement();
        let constructorCalled = false;
        let initCalled = false;

        class FirstInitMockWidget extends MockWidget {
            constructor(...params) {
                constructorCalled = true;
                super(...params);
            }

            init(...params) {
                initCalled = true;
                return super.init(...params);
            }
        }

        const resolver = mock.fn(() => Promise.resolve(FirstInitMockWidget));
        const context = createContext({ resolver });

        await initElement(element, context);

        await it('Calls a resolver to resolve a widget class', () => {
            strictEqual(context.resolver.mock.callCount(), 1);
        });
        await it(`Widget's constructor is called`, () => {
            strictEqual(constructorCalled, true);
        });
        await it(`Element is set to the elementWidgetMap with an instance of a widget`, () => {
            strictEqual(context.elementWidgetMap.has(element), true);
            strictEqual(context.elementWidgetMap.get(element) instanceof FirstInitMockWidget, true);
        });
        await it(`Widget's "init" method is called`, () => {
            strictEqual(initCalled, true);
        });
        await it('Puts an element to the "elementInitMap" when initialization has stared', () => {
            ok(context.elementInitMap.get(element));
        });
        await it(`Element's "status" attribute is set to "success" after initializing`, () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), 'success');
        });
    });

    await test('Sequential initialization', async () => {
        const element = createWidgetElement();
        const context = createContext();;
        const initPromise = Promise.resolve();
        context.elementInitMap.set(element, initPromise);

        await initElement(element, context);

        await it(`The resolver is not called if element is already has mapped initiazation promise`, () => {
            strictEqual(context.resolver.mock.callCount(), 0);
        });
        await it('Linked promise in the "elementInitMap" is not changed', () => {
            strictEqual(context.elementInitMap.get(element), initPromise);
        });
    });

    await test('Handles an error for non exising widget', async () => {
        const element = createWidgetElement();
        const errorMessage = 'Mocked Widget not found';
        const resolver = mock.fn(() => Promise.reject(new Error(errorMessage)));
        const context = createContext({ resolver });

        const result = await initElement(element, context);

        await it(`"resolver" is called`, () => {
            strictEqual(context.resolver.mock.callCount(), 1);
        });
        await it(`resolves with an array containing a single erorr with a message "${errorMessage}"`, () => {
            ok(result);
            strictEqual(Array.isArray(result), true);
            strictEqual(result.length, 1);
            strictEqual(result[0].message, errorMessage);
        });
        await it('Element has "error" in status attribute', () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), 'error');
        });
    });

    await test('Handles destroying elements correctly', async() => {
        const element = createWidgetElement();
        const resolver = mock.fn(() => MockWidgetInitDelayed);
        const context = createContext({ resolver });
        const initPromise = initElement(element, context);
        await waitPromise();
        const widget = context.elementWidgetMap.get(element);
        widget.destroy();
        const result = await initPromise;
        await it('Init promise resolves with an array containing a single error "WidgetDestroyed"', () => {
            ok(result);
            strictEqual(Array.isArray(result), true);
            strictEqual(result.length, 1);
            strictEqual(result[0] instanceof WidgetDestroyed, true);
        });
        await it('When "WidgetDestroyed" is detected no "error" status is added', () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME) !== 'error', true);
        });
    });
});
