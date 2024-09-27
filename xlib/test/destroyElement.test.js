import { describe, test, it, mock } from 'node:test';
import { strictEqual } from 'node:assert';
import destroyElement from '../destroyElement.js';
import { STATUS_ATTRIBUTE_NAME } from '../elementStatus.js';
import createElement from '../testUtils/helpers/createElement.js';
import createContext from '../testUtils/helpers/createContext.js';

const STATUS = 'success';

function createElementWithoutWidget() {
    const domStr = `<!DOCTYPE html>
        <div id="element" ${STATUS_ATTRIBUTE_NAME}="${STATUS}">Element</div>
    `;
    return createElement(domStr);
}

function createElementWithWidget() {
    const domStr = `<!DOCTYPE html>
        <div id="element" widget="widget1" ${STATUS_ATTRIBUTE_NAME}="${STATUS}">Element</div>
    `;
    return createElement(domStr);
}

function createWidgetMock() {
    return {
        destroy: mock.fn(),
    }
}

describe('destroyElement tests', async () => {
    await test(`Destroying skipped if element doesn't have the "widget" attribute`, async () => {
        const element = createElementWithoutWidget();
        const widget = createWidgetMock();
        const elementInitMap = {
            delete: mock.fn(),
        };
        const elementWidgetMap = {
            delete: mock.fn(),
            get: mock.fn(() => widget),
        };
        const context = createContext({
            elementInitMap,
            elementWidgetMap,
        });

        destroyElement(element, context);

        await it('elementInitMap.delete is not called', () => {
            strictEqual(elementInitMap.delete.mock.callCount(), 0);
        });
        await it('elementWidgetMap.get is not called', () => {
            strictEqual(elementWidgetMap.get.mock.callCount(), 0);
        });
        await it('elementWidgetMap.delete is not called', () => {
            strictEqual(elementWidgetMap.delete.mock.callCount(), 0);
        });
        await it('widgetInstance.destroy is not called', () => {
            strictEqual(widget.destroy.mock.callCount(), 0);
        });
        await it(`element still has the "${STATUS_ATTRIBUTE_NAME}" attribute`, () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), STATUS);
        });
    });

    await test('Destroys element correctly with correct data', async () => {
        const element = createElementWithWidget();
        const context = createContext();
        context.elementInitMap.set(element, Promise.resolve());
        const widget = createWidgetMock();
        context.elementWidgetMap.set(element, widget);

        destroyElement(element, context);

        await it(`Removes element from the elementInitMap`, () => {
            strictEqual(context.elementInitMap.has(element), false);
        });
        await it('Calls widgetInstance.destroy method', () => {
            strictEqual(widget.destroy.mock.callCount(), 1);
        });
        await it(`Removes element from the elementWidgetMap`, () => {
            strictEqual(context.elementWidgetMap.has(element), false);
        });
        await it(`Removes element's "${STATUS_ATTRIBUTE_NAME}" attribute`, () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), null);
        });
    });

    await test('Destroys element correctly with missing widget instance', async () => {
        const element = createElementWithWidget();
        const context = createContext();
        context.elementInitMap.set(element, Promise.resolve());
        const widget = createWidgetMock();

        destroyElement(element, context);

        await it(`Removes element from the elementInitMap`, () => {
            strictEqual(context.elementInitMap.has(element), false);
        });
        await it('Does not call widgetInstance.destroy method', () => {
            strictEqual(widget.destroy.mock.callCount(), 0);
        });
        await it(`Removes element's "${STATUS_ATTRIBUTE_NAME}" attribute`, () => {
            strictEqual(element.getAttribute(STATUS_ATTRIBUTE_NAME), null);
        });
    });
});
