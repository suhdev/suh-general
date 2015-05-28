/**
 * @ngdoc service
 * @name shEventsManager
 * @module SuhGeneral
 * @requires shException
 * @requires shIdentityGenerator
 * @description
 * A service to handle events.
 * @todo {urgent} complete documentation. 
 */
angular.module("SuhGeneral")
	.factory('shEventsManager', [function () {
		var t = function(){
			this._e = {};
		};
		t.prototype = {
			addListener:function(l){
				if (l.listenEvents){
					var events = l.listenEvents(),i=0,last=events.length,c;
					for(i=0;i<last;i++){
						c = events[i];
						this._e[c] = this._e[c] || [];
						this._e[c].push(l);						
					}
				}
			},
			removeListener:function(l,eN){
				if (l.listenEvents){
					var i;
					if (eN && this._e[eN]){
						i =this._e[eN].indexOf(l);
						this._e[eN].splice(i,1);
					}else{
						var events = l.listenEvents(),last = events.length,j;
						i = 0;
						for(;i<last;i++){
							if (this._e[events[i]] && 
							(j = this._e[events[i]].indexOf(l)) !== -1){
								this._e[events[i]].splice(j,1);
								i--;
								last--;
							}
						}
					}
				}
			},
			trigger:function(eN,eD){
				if (this._e[eN]){
					var i=0,l=this._e[eN].length || 0;
					for(;i<l;i++){
						if (this._e[eN][i]){
							this._e[eN][i].fire(eN,eD);
						}else{
							this._e[eN].splice(i,1);
							i--;
							l--;
						}
					}
				}
			}
		};	
		return new t();
	}]);