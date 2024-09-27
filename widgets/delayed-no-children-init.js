import Widget from '../xlib/Widget.js'

/**
 * Widget with a delayed initialization with doesn't trigger children initialization
 */
export default class DelayedNoChildrenInitWidget extends Widget {
    async initActual() {
        await (new Promise((resolve) => setTimeout(resolve, 1000)));

        return Promise.resolve([]);
    }
}
