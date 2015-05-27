/**
 * @ngdoc service
 * @name shSuccess
 * @module SuhGeneral
 * @description returns a function to be used by the {SuhGeneral.DeferredRequest} service
 * in cases of successful calls
 * @param {deferred} d the deferred object to resolve
 * @returns {function} a function that takes a single parameter (data) which is the data received from the server.
 */
angular.module('SuhGeneral')
	.factory('shSuccess', [function () {
		return function(d){
			return function(data){
				if (data.status)
					return d.resolve(data.result);
				else
					return d.reject(data.reasons);
			}
		};
	}]);