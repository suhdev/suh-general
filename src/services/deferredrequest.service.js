/**
 * @ngdoc service
 * @name shDeferredRequest
 * @module SuhGeneral
 * @description
 * Provides a unified method to handle AJAX requests
 * @requires shResponseHandler
 */
angular.module('SuhGeneral')
	.factory('shDeferredRequest', ['$q','$http','shResponseHandler',
		function ($Q,$H,_handler) {
		return function(_method,_url,_data,config,queryData,scs,err){
			var _d = $Q.defer(),
				sFn = scs||(config?config.success:_handler)||_handler,
				eFn = err||(config?config.error:_handler)||_handler;
			if (_method.toLowerCase() === 'get' || 
				typeof _data === 'undefined'){
				$H[_method](_url)
					.success(sFn(_d))
					.error(eFn(_d));	
			}else {
				$H[_method](_url,_data)
					.success(sFn(_d))
					.error(eFn(_d));
			}
			return _d.promise;
		};
	}]);