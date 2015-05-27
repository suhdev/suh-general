/**
 * @ngdoc service
 * @name shUtil
 * @module SuhGeneral
 * @description 
 * A service containing a set of utility functions. 
 */ 
angular.module('SuhGeneral')
	.factory('shUtil', [function () {
		var o = {
			/**
			 * @ngdoc method
			 * @name shUtil#extend
			 * @module SuhGeneral
			 * @param {Constructor} cstr the child constructor 
			 * @param {Constructor} pstr the parent constructor 
			 * @param {object} cproto the child prototype 
			 * @description
			 * Provides a prototypal inheritance 
			 */
			extend:function(cstr,pcstr,cproto){
				cstr.prototype = pcstr.prototype;
				cstr.prototype.constructor = pcstr;
				if (cproto){
					cstr.prototype = angular.extend({},cstr.prototype,cproto);
				}
			},
			/**
			 * @ngdoc method
			 * @name shUtil#proxy
			 * @module SuhGeneral
			 * @param {function} fn the function to call. 
			 * @param {ctx} the context on which the function will be called. 
			 * @description
			 * Provides a proxy to call a method on a given context. Any parameters other
			 * than the `fn` and `ctx` will be passed as the first parameters to `fn` function. 
			 *
			 */

			proxy:function(fn,ctx){
				var c = ctx || this,
					args = (arguments.length > 2)?Array.prototype.slice.call(agruments,2):[];
				return function(){
					var a = Array.prototype.slice.call(arguments,0);
					return fn.apply(c,[].concat(args,a));
				}
			},
			format:function(ctx,repl,pref){
				var itm,replacements; 
				itm = angular.isString(this)?this.slice(0):ctx;
				replacements = angular.isString(this)?ctx:repl;
				prefix = angular.isString(this)?repl:((pref)?pref:':$');
				if (replacements){
					angular.forEach(replacements,function(v,k){
						itm = itm.replace(angular.isString(k)?(prefix.replace(/\$/,k)):"?",v);
					});
				}
				return itm;
				
			},
			map:function(o,fn){
				var a = angular.isArray(o)?[]:(angular.isObject(o)?[]:'');
				for (var key in o){
					a[key] = fn(o[key]);
				}
				return a;
			},
			string:{
				toCamelCase:function(str){
					var m = str.match(/[^\-\_\.]+/g);
					if (m && m.length > 1){
						return m[0].toLowerCase() + o.map(m.slice(1),function(e){
							return e[0].toUpperCase() + e.slice(1);
						}).join('');
					}
					return m[0].toLowerCase();
				},
				capitalize:function(str){
					if (!angular.isString(str)){
						throw new Error('invalid parameter passed, expecting a string');
					}
					return (str.length>1)?(str[0].toUpperCase()+str.slice(1)):str.toUpperCase();
				}
			}
		};
		return o;
	}]);