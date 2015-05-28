/**
 * @ngdoc service
 * @name shHttpModel
 * @module SuhGeneral
 * @description
 * Needs documentation
 * @todo {urgent} add documentation.
 */
angular.module('SuhGeneral')
	.factory('shHttpModel', ['shHttp','shUtil',function (_H,_UT) {
		return function(model){
			var _sj = function(){
				_H.call(this,model);
			};
			_UT.inherits(_sj,_H);
			return new _sj();
		};
	}]);