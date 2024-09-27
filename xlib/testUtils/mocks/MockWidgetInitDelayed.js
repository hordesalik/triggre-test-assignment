import Widget from '../../Widget.js';
import waitPromise from '../../testUtils/helpers/waitPromise.js';

export const MOCK_WIDGET_INIT_DELAY_TIMEOUT = 100;

export default class MockWidgetInitDelayed extends Widget {
    initActual() {
        return waitPromise(MOCK_WIDGET_INIT_DELAY_TIMEOUT, []);
    }
}
