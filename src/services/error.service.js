/**
 * @ngdoc service
 * @name shError
 * @module SuhGeneral
 * @description
 * Handles rejection of {@link shDeferredRequest shDeferredRequests}
 */
angular.module('SuhGeneral')
	.factory('shError', [function () {
		return function(d){
			return function(data){
				d.reject([{
					code:0x11111,
					description:'Network error'
				}]);
			};
		};
	}]);