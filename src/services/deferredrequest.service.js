/**
 * @ngdoc service
 * @name shDeferredRequest
 * @module SuhGeneral
 * @description
 * Provides a unified method to handle AJAX requests
 * @requires shSuccess
 * @requires shError
 */
angular.module('SuhGeneral')
	.factory('shDeferredRequest', ['$q','$http','shSuccess',
		'shError',function ($Q,$H,_SCS,_ERR) {
		return function(_method,_url,_data,config,queryData,scs,err){
			var _d = $Q.defer();
			var sFn = scs||_SCS;
			var eFn = err||_ERR;
			if (typeof config !== 'undefined'){
				if (typeof config.success !== 'undefined' &&
					angular.isFunction(config.success)){
					sFn = config.success;
				}
				if (typeof config.error !== 'undefined' &&
					angular.isFunction(config.error)){
					eFn = config.error;
				}
			}
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