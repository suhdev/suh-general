/**
 * @ngdoc service
 * @name shUtil
 * @module SuhGeneral
 * @description 
 * A service containing a set of utility functions. 
 */ 
angular.module('SuhGeneral')
	.factory('shUtil', [function () {
		var __O = {
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
			extend:function extend(cstr,pcstr,cproto){
				cstr.prototype = pcstr.prototype;
				cstr.prototype.constructor = pcstr;
				if (cproto){
					cstr.prototype = angular.extend({},cstr.prototype,cproto);
				}
			},
			/**
			 * @ngdoc method
			 * @name shUtil#extend
			 * @module SuhGeneral
			 * @param {Constructor} cstr the child constructor 
			 * @param {Constructor} pstr the parent constructor 
			 * @param {object} cproto the child prototype 
			 * @description
			 * Provides a real prototypal inheritance 
			 */
			inherits:function inherits(childCtor,parentCtor){
				function tempCtor() { }
				tempCtor.prototype = parentCtor.prototype;
				childCtor.prototype = new tempCtor();
				childCtor.prototype.constructor = childCtor.constructor;
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
			 */
			proxy:function(fn,ctx){
				var c = ctx || this,
					args = (arguments.length > 2)?Array.prototype.slice.call(agruments,2):[];
				return function(){
					var a = Array.prototype.slice.call(arguments,0);
					return fn.apply(c,[].concat(args,a));
				};
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
			extractField:function(a,f){
				var t = angular.isArray(a)?a:this,
				res = [],i=0,l=t.length,k=-1;
				for(;i<l;i++){
					k = __O.getDataAt(t[i],f); 
					if (k){
						res.push(k);
					}
			    }
			    return res;
			},
			identify:function(k){
				return k;
			},
			filter:function(arr,fn){
				var key,f = __O.identity,res = [];
				for(key in arr){
					if (fn(arr[key],key,arr)){
						res.push(arr[key]);
					}
				}
				return res;
			},
			findIndexByField:function(a,f,v){
				var t = angular.isArray(a)?a:this,
					i = 0,l=t.length;
				for(;i<l;i++){
			        if (__O.getDataAt(t[i],f) == v)
			            return i;
				}
				return -1;
			},
			existsByField:function(a,f,v){
				for(var i =0,l=a.length;i<l;i++){
			        if (__O.getDataAt(a[i],f) == v){
			            return true;
			        }
				}
				return false;
			},
			removeByField:function(a,f,v){
				var temp,i=0,l=a.length;
				for(;i<l;i++){
			        if (__O.getDataAt(a[i],f) == v){
			        	return a.splice(i,1)[0];
			        }
				}
				return undefined;
			},
			removeAllByField:function(a,f,v){
				var list = [],i=0,l=a.length;
				for(;i<l;i++){
			        if (__O.getDataAt(a[i],f) == v){
			        	list.push(a.splice(i,1)[0]);
			        	i--;
			        	l--;
			        }
				}
				return list;
			},
			findAllByField:function(a,f,v){
				var t = angular.isArray(a)?a:this,
					r = [],i=0,l=t.length;
				for(;i<l;i++){
			        if (__O.getDataAt(t[i],f) == v)
			            r.push(t[i]);
			    }
			    return r;
			},
			findByField:function(ob,f,v){
				var t = angular.isArray(ob)?ob:this; 
				for(var i =0,l=t.length;i<l;i++){
					if (__O.getDataAt(t[i],f) == v){
			            return t[i];
					}
		    	}
		    	return undefined;
			},
			getDataAt:function(ob,k){
				var p = k.match(/[^\.]+/gi),t=angular.isString(ob)?this:ob,i=0,l=(p)?p.length:0;
				for(i=0;i<l && t;i++){
					t = t[p[i]];
				}
				return t; 
			},
			setDataAt:function(ob,k,v){
				var p = k.match(/[^\.]+/gi),t=angular.isString(ob)?this:ob,i=0,l=(p)?p.length-1:0;
				for(i=0;i<l;i++){
					t = (t[p[i]] = t[p[i]] || {});
				}
				t[p[l]] = v;
				return t; 
			},
			toSnakeCase:function(str){
				var m = str.match(/[A-Z]?[a-z0-9]+(?=[A-Z])?/g),t=str,l=m?m.length:0,i=1;
				if (l > 0){
					t = m[0];
					for(;i<l;i++){
						t = t +'_'+m[i];
					}
					t = t.toLowerCase();
				}
			    return t;
			},
			toCamelCase:function(str){
				var m = str.match(/[^\-\_\.]+/g);
				if (m && m.length > 1){
					return m[0].toLowerCase() + __O.map(m.slice(1),function(e){
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
			},
			lowerize:function(str){
				return str.charAt(0).toLowerCase()+str.slice(1);
			}
		};
		return __O;
	}]);