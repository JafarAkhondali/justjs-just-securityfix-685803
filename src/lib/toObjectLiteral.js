define(['./core', './check'], function (APR, check) {

	'use strict';

	/**
	 * Converts [[k0, v0], {k1: v1}] to {k0: v0, k1: v1}.
	 *
	 * @namespace
	 * @memberof APR
	 * @param {!object[]|!object} array - An array containing sub-arrays
	 *     with object literal pairs, or object literals: [[k, v], {k: v}].
	 *
	 * @return {!object} An object literal.
	 */
	var toObjectLiteral = function toObjectLiteral (array) {

		var objectLiteral = {};

		if (check(array, {}, null)) {
			return Object.assign({}, array);
		}

		if (!check(array, [])) {
			throw new TypeError(array + ' must be either ' +
				'null, an object literal or an Array.');
		}

		array.forEach(function (subArray) {

			var key, value;

			if (check(subArray, [])) {
				key = subArray[0];
				value = subArray[1];
				this[key] = value;
			}
			else if (check(subArray, {})) {
				Object.assign(this, subArray);
			}
			else {
				throw new TypeError(subArray + ' must be either ' +
					'an object literal or an Array.');
			}

		}, objectLiteral);

		return objectLiteral;

	};

	return APR.setFn('toObjectLiteral', toObjectLiteral);

});