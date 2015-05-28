/** 
 * @ngdoc service
 * @name shLocalizer
 * @module SuhGeneral
 * @description
 * A module to handle localization of an Angular app by providing a way to manage translation files. 
 */ 

 /** 
  * @ngdoc service
  * @name shLOCALE
  * @module SuhGeneral
  * @description 
  * A string representing the current locale of the application. 
  */ 
angular.module('SuhGeneral')
	.factory('shLocalizer', ['$http','$q','shLOCALE','shUtil',function ($H,$Q, _SL,_UT) {
		var dict = {},
			__o,
			def = $Q.defer(),
			source = '',
			locale = _SL,
			loaded = false,
			onLoad = function onLoad(resp){
				dict = resp;
				loaded = true;
				def.resolve(); 
			},
			onError = function onError(err){
				def.resolve('An error has occured'); 
			};

		__o = {
			/**
			 * @ngdoc method
			 * @name shLocalizer#load
			 * @module SuhGeneral
			 * @param {string|object} source the translation source (valid json)
			 * @description
			 * Loads either an object literal as a translation source, or a URL to get the 
			 * translation data from (must return a valid JSON data)
			 */
			load:function(source){
				if (angular.isString(srouce)){
					$H.get(source)
						.success(onLoad)
						.error(onError); 
				}else if (angular.isObject(source)){
					onLoad(source);
				}
			},
			/**
			 * @ngdoc method 
			 * @name shLocalizer#ready
			 * @module SuhGeneral
			 * @returns {Promise} 
			 * @description
			 * Returns a promise that will be resolved when the translation source has been
			 * loaded. 
			 */
			ready:function(){
				return def.promise;
			},
			/**
			 * @ngdoc method
			 * @name shLocalizer#isLoaded
			 * @module SuhGeneral
			 * @returns {boolean}
			 * @description
			 * Returns either true if the source file has been loaded, false otherwise. 
			 */
			isLoaded:function(){
				return loaded;
			},
			/**
			 * @ngdoc method 
			 * @name shLocalizer#get
			 * @module SuhGeneral
			 * @param {string} key a string path i.e. 'name', 'name.first', 'user.name.lastname' 
			 * @returns {string|undefined} 
			 * @description
			 * Returns a formatted string representing the translation, any string path will be parsed 
			 * and the value under the specific path will be retrieved 
			 * ```javascript 
			 * var obj = {
			 *	name:{
			 *		first:'John',
			 *		last: 'Doe'
			 * 		 }
			 * 	}
			 * // a string path to get the first name 'name.first'; 
			 * ```
			 *
			 */
			get:function(key,values){
				var a = _UT.getDataAt(dict,key);
				if (angular.isDefined(a)){
					return __o.format(a,values);
				}
				return undefined;
			},
			format:function(item,obj){
				if (angular.isDefined(obj)){
					for(var key in obj){
						item = item.replace(new RegExp(":"+key,"ig"),obj[key]);
					}
				}
				return item;
			}

		}; 
	
		return __o;
	}]);