import { describe, test, it } from 'node:test';
import {strictEqual} from 'node:assert';
import Widget from '../Widget.js';

describe('bindHandlers tests', async () => {
    class A extends Widget {
        someHandler() {
            return this;
        }

        someFunc() {
            return this;
        }
    }

    class B extends A {
        extHandler() {
            return this;
        }

        extFunc() {
            return this;
        }
    }

    await test('bindHandlers works as expected for first-level children', async () => {
        const inst = new A();
        const {someHandler, someFunc} = inst;

        await it ('A::someHandler is binded to A instance', () => {
            strictEqual(someHandler(), inst);
        });
        await it ('A::someFunc is not binded to A instance', () => {
            strictEqual(someFunc() !== inst, true);
        });
    });

    await test('bindHandlers works as expected for second-level children', async () => {
        const inst = new B();
        const {someHandler, someFunc, extHandler, extFunc} = inst;

        await it ('B::someHandler is binded to B instance', () => {
            strictEqual(someHandler(), inst);
        });
        await it ('B::someFunc is not binded to B instance', () => {
            strictEqual(someFunc() !== inst, true);
        });
        await it ('B::extHandler is binded to B instance', () => {
            strictEqual(extHandler(), inst);
        });
        await it ('B::extFunc is not binded to B instance', () => {
            strictEqual(extFunc() !== inst, true);
        });
    });
});
