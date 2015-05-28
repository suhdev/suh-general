/**
 * @ngdoc provider
 * @name shUrlRulesProvider
 * @module SuhGeneral
 * @description
 * 
 *
 *
 */
angular.provider('shUrlRules', [function () {
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

	this.setRules = function(r){
		rules = r;
	};
	
	/**
	 * @ngdoc service
	 * @name shUrlRules
	 * @module SuhGeneral
	 * @description
	 *
	 */

	this.$get = [function() {
		return {
			rules:function(){
				return rules;
			}
		};
	}];
}]);