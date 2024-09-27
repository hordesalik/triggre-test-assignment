import Widget from '../../Widget.js';

export const MOCK_WIDGET_INIT_ERROR_TEXT = 'MockWidgetInitErrorText';

export default class MockWidgetInitError extends Widget {
    initActual() {
        return Promise.reject(new Error(MOCK_WIDGET_INIT_ERROR_TEXT));
    }
}
