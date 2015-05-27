/**
 * @ngdoc service
 * @name shIdentityGenerator
 * @module SuhGeneral
 * @returns {string} the random identifier 
 * @description 
 * A service to generate pseudo-random identifiers 
 */
angular.module('SuhGeneral')
	.factory('shIdentityGenerator', [function () {
		return function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
		};
	}]);