import Widget from '../xlib/Widget.js';

/**
 * Widgets get initialize in a second with it's children
 */
export default class DelayedWidget extends Widget {
    async initActual() {
        await (new Promise((resolve) => setTimeout(resolve, 1000)));

        return super.initActual();
    }
}
