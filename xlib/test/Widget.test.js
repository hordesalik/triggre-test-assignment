import { describe, test, it } from 'node:test';
import { ok, strictEqual } from 'node:assert';
import { isPromise } from 'node:util/types';
import createElement from '../testUtils/helpers/createElement.js'
import createContext from '../testUtils/helpers/createContext.js';
import MockWidgetInitDelayed from '../testUtils/mocks/MockWidgetInitDelayed.js';
import waitPromise from '../testUtils/helpers/waitPromise.js';
import WidgetDestroyed from '../WidgetDestroyed.js';

describe('Widget tests', async () => {
    await test(`Widget initialization works as expected`, async () => {
        const element = createElement();
        const context = createContext();
        const widget = new MockWidgetInitDelayed(element, context);
        let resolved = false;

        await it('"destroyHandlers" is an empty array befor "init" method is called', () => {
            ok(widget.destroyHandlers);
            strictEqual(widget.destroyHandlers.length, 0);
        });

        const initPromise = widget.init();
        const resolvedPromise = initPromise.then(() => resolved = true);

        await it('Widget class construtor saved arguments in properties', () => {
            strictEqual(widget.element, element);
            strictEqual(widget.context, context);
        });
        await it(`Widget::init returns a promise`, () => {
            strictEqual(isPromise(initPromise), true);
        });
        await it('"destroyed" flag is "false"', () => {
            strictEqual(widget.destroyed, false);
        });
        await it('"destroyHandlers" is an array with length 1 after "init" method is called', () => {
            ok(widget.destroyHandlers);
            strictEqual(widget.destroyHandlers.length, 1);
        });

        await waitPromise();
        await it(`Does not get resolved immediately if widget initialization is taking a while`, () => {
            strictEqual(resolved, false);
        });
        await resolvedPromise;
        await it('Resolved once all init processes are finished', () => {
            strictEqual(resolved, true);
        });
    });

    await test('Widget destroying works correctly', async() => {
        const element = createElement();
        const context = createContext();
        const widget = new MockWidgetInitDelayed(element, context);
        const initPromise = widget.init();
        let error = null;
        
        await waitPromise();
        widget.destroy();
        try {
            await initPromise;
        } catch(e) {
            error = e;
        }
        await it ('Init promise rejects with a "WidgetDestroyed" error after "destroy" method is called', () => {
            ok(error);
            strictEqual(error instanceof WidgetDestroyed, true);
        });
        await it('"destroyHandlers" is an empty array after "destroy" method is called', () => {
            ok(widget.destroyHandlers);
            strictEqual(widget.destroyHandlers.length, 0);
        });
        await it('"destroyed" flag is "true" after "destroy" method is called', () => {
            strictEqual(widget.destroyed, true);
        });
    });
});
