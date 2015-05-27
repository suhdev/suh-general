angular.module('SuhGeneral')
	.provider('shApplicationData', [function () {
		var data = {},
			ext = {
				get:function(key){
					return key?data[key]:data;
				},
				set:function(key,val){
					if (angular.isObject(key)){
						angular.forEach(key,function(k,v){
							data[k] = v;
						});
					}else if (angular.isString(key)){
						data[key] = val;
					}else {
						throw new Error('Provided key is neither an object literal nor a string');
					}
				}
		};
		this.setData = function(d){
			data = d;
		};
		this.setExtensions = function(e){
			for (var k in e){
				ext[k] = angular.bind(ext,e[k]);
			}
		};
	
		this.$get = [function() {
			var o = function(){
				Object.defineProperty(this,'data',{
					get:function(){
						return data;
					},
				});
			};
			o.prototype = ext;
			return new o();
		}];
	}]);