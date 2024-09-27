import Widget from '../xlib/Widget.js';

/**
 * Whidget is not get resolved automatically, it waits for API methods to be called
 */
export default class UserControlledWidget extends Widget {
    initActual() {
        return new Promise(() => {});
    }
}
