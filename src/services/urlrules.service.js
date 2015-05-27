/**
 * @ngdoc service
 * @name shUrlRules
 * @module SuhGeneral
 * @description
 * A service to generate URL rules
 */ 
angular.module('SuhGeneral')
	.factory('shUrlRules', [function () {
		var rules = [{
			rule:/\/(experience|guide|user)-[a-z\-0-9]+-([0-9]+)/,
			pieces:['object','id','mode:view']
		},{
			rule:/\/me/,
			pieces:['object:user','id:-1','mode:edit']
		},{
			rule:/\/(experiencebox|guidebox)\/([0-9]+)/,
			pieces:['object','id']
		},
		{
			rule:/\/(guide|experience)\/(edit|preview|pdf|embed|box)\/([0-9]*)/,
			pieces:['object','mode','id']
		},{
			rule:/\/(guide|experience)\/(create)/,
			pieces:['object','mode']
		}];
		return {
			rules:function(){
				return rules;
			}
		};
	}]);