import { mock } from 'node:test';
import MockWidget from '../../testUtils/mocks/MockWidget.js';

export default function createContext({
    elementInitMap = new Map(),
    elementWidgetMap = new Map(),
    resolver = mock.fn(async () => MockWidget)
} = {}) {
    return {
        elementInitMap,
        elementWidgetMap,
        resolver,
    };
}
