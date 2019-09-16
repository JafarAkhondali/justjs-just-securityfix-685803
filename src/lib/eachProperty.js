define(['./core', './defaults'], function (APR, defaults) {
	
	'use strict';

	/**
	 * @typedef {function} APR.eachProperty~fn
	 *
	 * @this thisArg from {@link APR.eachProperty|the main function}.
	 *
	 * @param {*} value - The current value.
	 * @param {*} key - The current key.
	 * @param {!object} object - The current object being iterated.
	 *
	 * @return {boolean} If `true`, the current loop will stop.
 	 */
	
	/**
	 * Converts `object` to an Object, iterates over it,
	 * calls a function on each iteration, and if a truthy value
	 * is returned from that function, the loop will stop.
	 * 
	 * @namespace
	 * @memberof APR
	 * @param {*} object - Some value.
	 * @param {APR.eachProperty~fn} fn - The function that will be
	 *     called on each iteration.
	 * @param {*} [thisArg] - `this` for `fn`.
	 * @param {object} [opts={@link APR.eachProperty.DEFAULT_OPTIONS}] - Some options.
	 *
	 * @throws {TypeError} If `fn` is not a function.
	 * @return {boolean} `true` if the function was interrupted, `false` otherwise.
	 */
	var eachProperty = function eachProperty (object, fn, thisArg, opts) {

		var properties = Object(object);
		var options = defaults(opts, eachProperty.DEFAULT_OPTIONS);
		var wasInterrupted = false;
		var k;

		if (typeof fn !== 'function') {
			throw new TypeError(fn + ' is not a function.');
		}

		for (k in properties) {

			if (wasInterrupted) {
				break;
			}

			if (options.addNonOwned ||
				({}).hasOwnProperty.call(properties, k)) {
				
				wasInterrupted = !!fn.call(thisArg, properties[k], k,
					properties);

			}

		}

		return wasInterrupted;

	};

	Object.defineProperties(eachProperty, /** @lends APR.eachProperty */{
		/**
		 * Options for {@link APR.eachProperty}.
		 *
		 * @typedef {object} APR.eachProperty~options
		 * @property {boolean} [addNonOwned=false] - Include non-owned properties.
		 *     `false`: iterate only the owned properties.
		 *     `true`: iterate the (enumerable) inherited properties too.
		 */

		/**
		 * Default options for {@link APR.eachProperty}.
		 * 
		 * @type {APR.eachProperty~options}
		 * @readonly
		 */
		'DEFAULT_OPTIONS': {
			'get': function () {
				return {
					'addNonOwned': false
				};
			}
		}

	});

	return APR.setFn('eachProperty', eachProperty);

});