import { describe, test, it, mock } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import initChildren from '../initChildren.js';
import createElement from '../testUtils/helpers/createElement.js';
import waitPromise from '../testUtils/helpers/waitPromise.js';
import createContext from '../testUtils/helpers/createContext.js';
import MockWidget from '../testUtils/mocks/MockWidget.js';
import MockWidgetInitError, { MOCK_WIDGET_INIT_ERROR_TEXT } from '../testUtils/mocks/MockWidgetInitError.js';
import MockWidgetInitDelayed from '../testUtils/mocks/MockWidgetInitDelayed.js';

const MOCK_RESOLVE_ERROR_MESSAGE = 'Mocker Resolve Error';

function createTestElement() {
    const domStr = `<!DOCTYPE html>
        <div id="element">
            <div>Element</div>
            <div widget="w1" id="w1"></div>
            <div widget="w2" id="w2">
                <div widget="w21" id="w21"></div>
                <div widget="w22" id="w22"></div>
            </div>
            <div widget="w3" id="w3">
                <div widget="w31" id="w31"></div>
                <div widget="w32" id="w32"></div>
            </div>
        </div>
    `;
    return createElement(domStr);
}

describe('initChildren tests', async () => {
    await test('Initializes children correctly', async () => {
        const element = createTestElement();
        const w1 = element.querySelector('#w1');
        const w2 = element.querySelector('#w2');
        const w21 = element.querySelector('#w21');
        const w22 = element.querySelector('#w22');
        const w3 = element.querySelector('#w3');
        const initPromise = Promise.resolve(MockWidget);
        const resolver = mock.fn(() => initPromise);
        const context = createContext({ resolver });

        const { elementInitMap, elementWidgetMap } = context;


        const childrenErrors = await initChildren(element, context);

        await it('Returns an empty array if no errors expected', () => {
            ok(childrenErrors);
            strictEqual(Array.isArray(childrenErrors), true);
            strictEqual(childrenErrors.length, 0, JSON.stringify(childrenErrors));
        });
        await it('Puts elements to elementInitMap', () => {
            strictEqual(elementInitMap.has(w1), true);
            strictEqual(elementInitMap.has(w2), true);
            strictEqual(elementInitMap.has(w3), true);
        });
        await it('Resolver called for each widget including children', () => {
            strictEqual(resolver.mock.callCount(), element.querySelectorAll('[widget]').length);
        });
        await it('Puts elements to elementWidgetMap with linked widgets instances', () => {
            strictEqual(elementWidgetMap.has(w1), true);
            strictEqual(elementWidgetMap.has(w2), true);
            strictEqual(elementWidgetMap.has(w3), true);
            strictEqual(elementWidgetMap.get(w1) instanceof MockWidget, true);
            strictEqual(elementWidgetMap.get(w2) instanceof MockWidget, true);
            strictEqual(elementWidgetMap.get(w3) instanceof MockWidget, true);
        });
        await it('Nested children elements are initialized correctly', () => {
            strictEqual(elementWidgetMap.has(w21), true);
            strictEqual(elementWidgetMap.has(w22), true);
            strictEqual(elementWidgetMap.get(w21) instanceof MockWidget, true);
            strictEqual(elementWidgetMap.get(w22) instanceof MockWidget, true);
        });
    });
    await test('Handles children initialization errors', async () => {
        const element = createTestElement();
        const resolver = mock.fn((widgetName) => {
            // trigger resolve error for widget "w2"
            if (widgetName === 'w21') {
                return Promise.reject(new Error(MOCK_RESOLVE_ERROR_MESSAGE));
            }
            // resolve "w3" widget as a widget with initialization error
            if (widgetName === 'w3') {
                return Promise.resolve(MockWidgetInitError);
            }
            return Promise.resolve(MockWidget);
        });
        const context = createContext({ resolver });
        const { elementInitMap, elementWidgetMap } = context;
        const allWidgetsInDom = element.querySelectorAll('[widget]');
        const widgetsNotBeenResolved = element.querySelectorAll('[widget="w3"] [widget]');
        const w3 = element.querySelector('#w3');
        const w31 = element.querySelector('#w31');
        const w32 = element.querySelector('#w32');
        const w21 = element.querySelector('#w21');
        const w22 = element.querySelector('#w22');

        const childrenErrors = await initChildren(element, context);

        await it('Returns all errors on resolve and init stage', () => {
            ok(childrenErrors);
            strictEqual(childrenErrors.length, 2);
            strictEqual(childrenErrors[0].message, MOCK_RESOLVE_ERROR_MESSAGE);
            strictEqual(childrenErrors[1].message, MOCK_WIDGET_INIT_ERROR_TEXT);
        });
        await it('Resolver called for all elements except children of elements with error', () => {
            strictEqual(resolver.mock.callCount(), allWidgetsInDom.length - widgetsNotBeenResolved.length);
        });
        await it('elementInitMap does not contain children of elements with errors', () => {
            strictEqual(elementInitMap.has(w31), false);
            strictEqual(elementInitMap.has(w32), false);
        });
        await it('elementInitMap contains children element sibling to element with error', () => {
            strictEqual(elementInitMap.has(w22), true);
        });
        await it('elementWidgetMap does not contain element with "resolve" error', () => {
            strictEqual(elementWidgetMap.has(w21), false);
        });
        await it('elementWidgetMap contains element with "init" error', () => {
            strictEqual(elementWidgetMap.has(w3), true);
        });
        await it('elementWidgetMap does not contain children of elements with error', () => {
            strictEqual(elementWidgetMap.has(w31), false);
            strictEqual(elementWidgetMap.has(w32), false);
        });
        await it('elementWidgetMap contains children element sibling to element with error', () => {
            strictEqual(elementWidgetMap.has(w22), true);
        });
    });

    await test('Handles initialization sequence with delayed init', async () => {
        const domStr = `<!DOCTYPE html>
            <div id="element">
                <div>Element</div>
                <div widget="w1" id="w1">
                    <div widget="w11" id="w11></div>
                </div>
            </div>
        `;
        const element = createElement(domStr);
        const resolver = mock.fn((widgetName) => {
            if (widgetName === 'w1') {
                return Promise.resolve(MockWidgetInitDelayed);
            }
            return Promise.resolve(MockWidget);
        });
        const context = createContext({ resolver });
        const initPromise = initChildren(element, context);
        await waitPromise();
        await it('During initializing resolver called only once', () => {
            strictEqual(resolver.mock.callCount(), 1);
        });
        await initPromise;
        await it('After initializing resolver called for all widgets', () => {
            strictEqual(resolver.mock.callCount(), element.querySelectorAll('[widget]').length);
        });
    });
});
