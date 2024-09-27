export const WAIT_PROMISE_DEFAULT_TIMEOUT = 10;
export const WAIT_PROMISE_DEFAULT_RESULT = null;

/**
 * Creates a promise which is resolved after a given timeout
 * @param {number} [timeout] - number in milliseconds until promise is resolved
 * @param {*} [resolveResult] - the result of the resolved promise
 * @returns {Promise}
 */
export default function waitPromise(
    timeout = WAIT_PROMISE_DEFAULT_TIMEOUT,
    resolveResult = WAIT_PROMISE_DEFAULT_RESULT,
) {
    return new Promise(resolve => setTimeout(() => resolve(resolveResult), timeout));
}
