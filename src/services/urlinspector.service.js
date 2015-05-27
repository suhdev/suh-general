/**
 * @ngdoc service
 * @name sHUrlInspector
 * @module SuhGeneral
 * @description
 * A service to track url changes to specific rules. 
 */
angular.module('SuhGeneral')
	.factory('shUrlInspector', ['shUrlRules',function (_GUR) {
		var currentUrl = document.URL,model = {
			activeRule:null,
			pieces:[],
			mode:'view',
			id:-1,
			object:null
		};
		return {
			parse:function(){
				var i=0,rules=_GUR.rules(),l=rules.length,r=null,j=0,k=0;
				for(;i<l;i++){
					r = currentUrl.match(rules[i].rule);
					if (typeof r !== 'undefined' && 
						r !== null){
						for(k=rules[i].pieces.length;j<k;j++){
							var p = rules[i].pieces[j].split(':');
							model[p[0]] = r[j+1] || p[1];
						}
					}
				}
				model.id = parseInt(model.id);
			},
			mode:function(){
				return model.mode;
			},
			id:function(){
				return parseInt(model.id);
			},
			object:function(){
				return model.object;
			}
		};
	}]);