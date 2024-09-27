import { describe, test, it } from 'node:test';
import { strictEqual } from 'node:assert';
import { STATUS_ATTRIBUTE_NAME, setElementStatus, getElementStatus, removeElementStatus } from '../elementStatus.js';
import createElement from '../testUtils/helpers/createElement.js';

function createTestElement() {
    const domStr = `<!DOCTYPE html>
        <div id="element">Element</div>
    `;
    return createElement(domStr);
}

describe('elementStatus tests', async () => {
    const STATUS = 'loading';

    await test('setElementStatus works', async () => {
        const element1 = createTestElement();
        const element2 = createTestElement();

        element2.setAttribute(STATUS_ATTRIBUTE_NAME, 'prev_status');

        setElementStatus(element1, STATUS);
        setElementStatus(element2, STATUS);

        await it(`"status" attribute is set to a given status if element didn't have this attribute`, () => {
            strictEqual(element1.getAttribute(STATUS_ATTRIBUTE_NAME), STATUS);
        });
        await it(`"status" attribute is set to a given status if element already have this attribute`, () => {
            strictEqual(element2.getAttribute(STATUS_ATTRIBUTE_NAME), STATUS);
        });
    });

    await test('getElementStatus works', async () => {
        const element1 = createTestElement();
        const element2 = createTestElement();

        element2.setAttribute(STATUS_ATTRIBUTE_NAME, STATUS);

        await it('Returns "null" if status IS NOT set', () => {
            strictEqual(getElementStatus(element1), null);
        });
        await it('Returns corrent status if status IS set', () => {
            strictEqual(getElementStatus(element2), STATUS);
        });
    });

    await test('removeElementStatus works', async () => {
        const element1 = createTestElement();
        const element2 = createTestElement();

        element2.setAttribute(STATUS_ATTRIBUTE_NAME, STATUS);

        removeElementStatus(element1);
        removeElementStatus(element2);

        await it(`No "status" attribute if the status WAS NOT set on the element`, () => {
            strictEqual(getElementStatus(element1), null);
        });
        await it(`No "status" attribute if the status WAS set on the element`, () => {
            strictEqual(getElementStatus(element2), null);
        });
    });
});
