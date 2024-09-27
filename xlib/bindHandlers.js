/**
 * Walks over all functions mentioned in the given prototype and binds them to the given object and walk down to the parent prototype
 * @param {Object} object - object to be bind to
 * @param {String} handlerEnding - a function name ending to determine if it's a handler and should be binded
 * @param {Function} prototype - a prototype of the object to search for methods
 * @returns {void}
 */
function bindHandlersForPrototype(object, handlerEnding, prototype) {
    if (!prototype) {
        return;
    }

    const handlerEndingIndex = handlerEnding.length * -1;

    Object.getOwnPropertyNames(prototype).forEach((name) => {
        if (typeof (prototype[name]) === 'function'
            && name.slice(handlerEndingIndex) === handlerEnding) {
            object[name] = object[name].bind(object);
        }
    });

    bindHandlersForPrototype(object, handlerEnding, Object.getPrototypeOf(prototype));
}

/**
 * Binds all object's methods which names are ending with a string passed to a "handlerEnding" parameter to the given object
 * @param {Object} object - an object to be processed
 * @param {String} [handlerEnding] - method ending string to determing if a method need to be bound
 */
export default function bindHandlers(object, handlerEnding = 'Handler') {
    bindHandlersForPrototype(object, handlerEnding, Object.getPrototypeOf(object));
}
