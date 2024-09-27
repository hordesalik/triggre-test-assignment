import { describe, test, it, mock } from 'node:test';
import { strictEqual } from 'node:assert';
import createContext from '../testUtils/helpers/createContext.js';
import destroyChildren from '../destroyChildren.js';
import createElement from '../testUtils/helpers/createElement.js';
import MockWidget from '../testUtils/mocks/MockWidget.js';

describe('destroyChildren tests', async () => {
    await test('destroyChildren works as expected', async () => {
        const destroyMock = mock.fn();
        class MockWidgetDestroy extends MockWidget {
            destroy() {
                destroyMock(this.element.id);
            }
        }

        const domStr = `<!DOCTYPE html>
            <div id="element">
                <div widget="w1" id="w1">
                    <div widget="w11" id="w11">
                        <div widget="w111" id="w111"></div>
                    </div>
                    <div widget="w12" id="w12"></div>
                </div>
                <div widget="w2" id="w2"></div>
            </div>
        `;
        const element = createElement(domStr);
        const context = createContext();
        const { elementInitMap, elementWidgetMap } = context;
        Array.from(element.querySelectorAll('[widget]'))
            .forEach((element) => {
                elementInitMap.set(element, Promise.resolve());
                elementWidgetMap.set(element, new MockWidgetDestroy(element, context));
            });
        const destroySequence = ['w111', 'w11', 'w12', 'w1', 'w2'];

        destroyChildren(element, context);

        await it('Destroy function called for each element', () => {
            strictEqual(destroyMock.mock.callCount(), destroySequence.length);
        })

        await it('Destroys tree bottom to top', () => {
            for (const index of destroySequence.keys()) {
                strictEqual(destroyMock.mock.calls[index].arguments[0], destroySequence[index]);
            }
        });
    });
});
