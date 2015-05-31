/**
 * @ngdoc provider
 * @name shLocalizerProvider
 * @module SuhGeneral
 * @description 
 * A provider to provide localization for angular apps. 
 */

angular.module('SuhGeneral')
	.provider('shLocalizer', [function (_SL) {
		var startTag = '\\$\\{',
			locale = 'en_US',
			endTag = '\\}'; 
		/**
		 * @ngdoc method
		 * @name shLocalizerProvider#startTag 
		 * @module SuhGeneral
		 * @param {string} tag the start tag 
		 * @description 
		 * Sets the start tag of interpolation. 
		 */
		this.startTag = function(tag){
			startTag = tag;
		};
		/**
		 * @ngdoc method
		 * @name shLocalizerProvider#endTag 
		 * @module SuhGeneral
		 * @param {string} tag the end tag 
		 * @description 
		 * Sets the end tag of interpolation. 
		 */
		this.endTag = function(tag){
			endTag = tag;
		};
		/**
		 * @ngdoc method
		 * @name shLocalizerProvider#setLocale 
		 * @module SuhGeneral
		 * @param {string} locale the locale to use 
		 * @description 
		 * Sets the current locale. 
		 */
		this.setLocale = function(loc){
			locale = loc; 
		};
		
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
		this.$get = ['shUtil','$http','$q','shLOCALE',function(_UT,$H,$Q,_SL) {
			var dict = {},
				__o,
				loaded = false,
				def = $Q.defer(),
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
				if (angular.isString(source)){
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
				if (a){
					return __o.format(a,values);
				}
				return undefined;
			},

			format:function(item,obj){
				if (obj){
					return item.replace(new RegExp(startTag+"([\\S]+?)"+endTag,"g"),function(e,m){
						return obj[m] || e;
					});
				}
				return item;
			}

		}; 
	
		return __o;
		}];
	}]);