import { describe, test, it, mock } from 'node:test';
import { strictEqual, ok } from 'node:assert';
import X from '../X.js';
import { isPromise } from 'node:util/types';
import createElement from '../testUtils/helpers/createElement.js';
import MockWidget from '../testUtils/mocks/MockWidget.js';
import MockWidgetInitError from '../testUtils/mocks/MockWidgetInitError.js';
import MockWidgetInitDelayed, { MOCK_WIDGET_INIT_DELAY_TIMEOUT } from '../testUtils/mocks/MockWidgetInitDelayed.js';
import waitPromise from '../testUtils/helpers/waitPromise.js';
import { STATUS_ATTRIBUTE_NAME } from '../elementStatus.js';

describe('X tests', async () => {
    await test('X::constructor works as expected', async () => {
        const resolver = mock.fn();
        const x1 = new X({ resolver });
        const x2 = new X({ resolver });

        await it('Receives "resolver" as a constructor and save it into a "resolver" property', () => {
            strictEqual(x1.resolver, resolver);
        });
        await it('Creates "elementInitMap" and "elementWidgetMap" maps', () => {
            ok(x1.elementInitMap);
            ok(x1.elementWidgetMap);
            strictEqual(x1.elementInitMap instanceof Map, true);
            strictEqual(x1.elementWidgetMap instanceof Map, true);
        });
        await it('Creates own instances of "elementInitMap" and "elementWidgetMap" maps across several X instances', () => {
            ok(x2.elementInitMap);
            ok(x2.elementWidgetMap);
            strictEqual(x2.elementInitMap instanceof Map, true);
            strictEqual(x2.elementWidgetMap instanceof Map, true);
            strictEqual(x1.elementInitMap === x2.elementInitMap, false);
            strictEqual(x1.elementWidgetMap === x2.elementWidgetMap, false);
        });
    });

    await test('X::init works as expected', async () => {
        const domStr = `<!DOCTYPE html>
            <div id="element" widget="w">
                Widget 1

                <div widget="initError"></div>
                <div widget="initDelayed"></div>
            </div>
        `;
        const element = createElement(domStr);
        const resolver = mock.fn(async (widgetName) => {
            switch (widgetName) {
                case 'initError':
                    return MockWidgetInitError;
                case 'initDelayed':
                    return MockWidgetInitDelayed;
                default:
                    return MockWidget;
            }
        });
        const x = new X({ resolver });
        const callback = mock.fn();

        const initPromise = x.init(element, callback);

        await it(`Result is a promise`, () => {
            strictEqual(isPromise(initPromise), true);
        });
        await it('Callback is not called instantly', () => {
            strictEqual(callback.mock.callCount(), 0);
        });
        await waitPromise();
        await it('Callback is not called until all children are initialized', () => {
            strictEqual(callback.mock.callCount(), 0);
        });
        await waitPromise(MOCK_WIDGET_INIT_DELAY_TIMEOUT);
        const initResult = await initPromise;
        await it('Callback is called when all children are initialized', () => {
            strictEqual(callback.mock.callCount(), 1);
        });
        await it('Callback is called with the array of errors', () => {
            const args = callback.mock.calls[0].arguments;
            ok(args, '"arguments" does no exist on the call');
            strictEqual(args.length, 1, `"arguments" doesn't have length 1`);
            const arr = args[0];
            ok(arr, 'errors argument is not');
            strictEqual(Array.isArray(arr), true, 'errors argument is not an array');
            strictEqual(arr.length, 1, 'errors argument contains more than one error');
        });
        await it('Resolves with the same value as passed in a callback', () => {
            strictEqual(initResult, callback.mock.calls[0].arguments[0]);
        });
    });

    await test('X::destroy works as expected', async () => {
        const domStr = `<!DOCTYPE html>
            <div id="element">
                Widget 1

                <div widget="w" id="w1">
                    <div widget="w" id="w11"></div>
                </div>
                <div widget="w" id="w2"></div>
            </div>
        `;
        const element = createElement(domStr);
        const resolver = async () => MockWidget;
        const xinstance = new X({ resolver });
        const { elementInitMap, elementWidgetMap } = xinstance;
        const allWidgetElements = Array.from(element.querySelectorAll('[widget]'));
        allWidgetElements.forEach(element => {
            elementInitMap.set(element, Promise.resolve(MockWidget));
            elementWidgetMap.set(element, new MockWidget());
            element.setAttribute(STATUS_ATTRIBUTE_NAME, 'success');
        });
        xinstance.destroy(element);
        await it('All elements with the "widget" attribute are destroyed', () => {
            allWidgetElements.forEach(element => {
                strictEqual(elementInitMap.has(element), false);
                strictEqual(elementWidgetMap.has(element), false);
                strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), null);
            });
        });
    });
});
