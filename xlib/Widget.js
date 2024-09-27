import bindHandlers from './bindHandlers.js';
import initChildren from './initChildren.js';
import WidgetDestroyed from './WidgetDestroyed.js';

export default class Widget {
    /**
     * Widget's constructor
     * @param {HTMLElement} element - the element of the widget
     * @param {object} context - the context object
     */
    constructor(element, context) {
        this.element = element;
        this.context = context;

        bindHandlers(this);
    }

    /**
     * A list of functions to be called once "destroy" API is called
     */
    destroyHandlers = [];

    /**
     * A flag indicates whether the "destroy" method was called or not
     */
    destroyed = false;

    /**
     * A list of functions to be called onces "finish" API is called
     */
    finishHandlers = [];

    /**
     * A list if functions to be called onces "fail" API is called
     */
    failHandlers = [];

    /**
     * Basic init method, wraps an "initActual" method to handle widget destroying process and throws the WidgetDestroyed error
     * @returns {Promise} - the promise resolved when initialiation is completed successfully and rejected otherwise
     */
    init() {
        this.destroyed = false;

        return new Promise((resolve, reject) => {
            this.onDestroy(() => reject(new WidgetDestroyed()));
            this.onFinish(() => resolve([]));
            this.onFail(() => reject(new Error('Failed via API')));

            return this.initActual()
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * The method to be overrided in widgets extended from this. Not wrapped with a destroying handler.
     * @returns {Promise} - the promise of actual initialization process
     */
    initActual() {
        return initChildren(this.element, this.context);
    }

    /**
     * Registers a callback in the "restroyHandlers" which called once "destroy" API is called
     * @param {Function} callback - the function to be called once "destroy" API is called
     * @returns {Function} - a function which removes a callback from registered "destroyHandlers"
     */
    onDestroy(callback) {
        this.destroyHandlers.push(callback);
        return () => {
            this.destroyHandlers = this.destroyHandlers.filter(item => item !== callback);
        };
    }

    /**
     * "destroy" API
     */
    destroy() {
        this.destroyHandlers.forEach(callback => callback());
        this.destroyHandlers = [];
        this.destroyed = true;
    }

    /**
     * Registers a callback in the "finishHandlers" which called once "finish" API is called
     * @param {Function} callback - the function to be called once "finish" API is called
     * @returns {Function} - a function which removes a callback from registered "finishHandlers"
     */
    onFinish(callback) {
        this.finishHandlers.push(callback);
        return () => {
            this.finishHandlers = this.finishHandlers.filter(item => item !== callback);
        }
    }

    /**
     * "finish" API
     */
    finish() {
        this.finishHandlers.forEach(callback => callback());
        this.finishHandlers = [];
    }

    /**
     * Registers a callback in the "failHandlers" which called once "fail" API is called
     * @param {Function} callback - the function to be called once "fail" API is called
     * @returns {Function} - a function which removes a callback from registered "failHandlers"
     */
    onFail(callback) {
        this.failHandlers.push(callback);
        return () => {
            this.failHandlers = this.failHandlers.filter(item !== callback);
        };
    }

    /**
     * "fail" API
     */
    fail() {
        this.failHandlers.forEach(callback => callback());
        this.failHandlers = [];
    }
}