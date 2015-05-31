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
		return function(conf,proto){
			var _sj = function(){
				_H.call(this,conf);
			};
			_UT.inherits(_sj,_H);
			for(var key in proto){
				_sj.prototype[key] = proto[key]; 
			}
			return new _sj();
		};
	}]);