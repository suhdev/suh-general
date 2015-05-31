/**
 * @ngdoc service
 * @name shResponseHandler
 * @module SuhGeneral
 * @description returns a function to be used by the {SuhGeneral.DeferredRequest} service
 * in cases of successful calls
 * @param {deferred} d the deferred object to resolve
 * @returns {function} a function that takes a single parameter (data) which is the data received from the server.
 */
angular.module('SuhGeneral')
	.factory('shResponseHandler', [function () {
		var fnHandler = function fnHandler(d,data){
			if (data && data.status)
				return d.resolve(data.result);
			else
				return d.reject(data.reasons||data);
		};

		var f = function(d){
			return function(data){
				fnHandler(d,data);
			};
		};

		f.setHandler = function(fn){
			fnHandler = fn;
		};

		return f;
	}]);