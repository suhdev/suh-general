/**
 * @ngdoc service
 * @name shHttpModel
 * @module SuhGeneral
 * @description
 * Needs documentation
 * @todo {urgent} add documentation.
 */
angular.module('SuhGeneral')
	.factory('shHttpModel', ['shHttp',function (_H) {
		return function(model){
			var _sj = function(){
				_H.call(this,model);
			};
			inherits(_sj,_H);
			return new _sj;
		};
	}]);