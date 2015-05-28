/**
 * @ngdoc service
 * @name shStorage
 * @module SuhGeneral
 * @implements Persistence
 * @description provides an interface for localStorage objects if supported by the browser.
 */
angular.module('SuhGeneral')
	.factory('shStorage', [function () {
		var enabled = false,
			o = {
				/**
				 * @ngdoc method
				 * @name shStorage#isEnabled
				 * @module SuhGeneral
				 * @returns {boolean} true if localStorage is enabled for this application, false otherwise.
				 * @description checks whether the localStorage is enabled or not for this application
				 */
				isEnabled:function(){
					return enabled;
				},
				/**
				 * @ngdoc method
				 * @name shStorage#store
				 * @module SuhGeneral
				 * @description stores a key-value pair in the local storage or a dictionary.
				 * @param {string|object} key either a string representing a key, or an object literal
				 * @param {any} [data] any value to store on the provided key.
				 */
				store:function(key,data){
					if (enabled){
						if (angular.isObject(key)){
							for(var k in key){
								localStorage.setItem(k,(angular.isObject(key[k])?JSON.stringify(key[k]):key[k]));
							}
						}else{
							localStorage.setItem(key,JSON.stringify(data));
						}
						return true;
					}
					return false;
				},
				/**
				 * @ngdoc method
				 * @name shStorage#remove
				 * @module SuhGeneral
				 * @param {string|object}
				 * @description stores a key-value pair in the local storage or a dictionary 
				 */
				remove:function(key){
					if (enabled){
						if (angular.isObject(key)){
							angular.forEach(key,function(v,k){
								localStorage.removeItem(k);
							});
						}else{
							localStorage.removeItem(key);
						}
					}
				},
				/**
				 * @ngdoc method
				 * @name shStorage#get
				 * @module SuhGeneral
				 * @param {string} key the key to retrieve its data.
				 * @description
				 * Returns the data attached to a given key.
				 */ 
				get:function(key){
					if (enabled){
						var item = localStorage.getItem(key);
						if (item){
							return JSON.parse(item);
						}
					}
					return undefined;
				},
				/**
				 * @ngdoc method
				 * @name shStorage#_getType
				 * @module SuhGeneral
				 * @private
				 * @description internal function to retrieve data from the localStorage
				 * @param {string} key the key of the item to retrieve
				 * @param {function} Fn the function to be used to convert the retrieved data
				 * @returns {any|null} the item if available, null otherwise
				 */
				_getType:function(key,Fn){
					if (enabled){
						var val = localStorage.getItem(key);
						if (val !== null){
							return Fn(val);
						}
					}else{
						return null;
					}
				},
				/**
				 * @ngdoc method
				 * @name shStorage#getInteger
				 * @module SuhGeneral
				 * @description retrieves an item from the localStorage and converts it to an integer.
				 * @param {string} key the key of the item to retrieve.
				 * @returns {number|null} the item if available, null otherwise.
				 */
				getInteger:function(key){
					return o._getType(key,parseInt);
				},
				/**
				 * @ngdoc method
				 * @name shStorage#getFloat
				 * @module SuhGeneral
				 * @description retrieves an item from the localStorage and converts it to an float.
				 * @param {string} key the key of the item to retrieve.
				 * @returns {number|null} the item if available, null otherwise.
				 */
				getFloat:function(key){
					return o._getType(key,parseFloat);
				},
				/**
				 * @ngdoc method
				 * @name shStorage#getJSON
				 * @module SuhGeneral
				 * @description retrieves an item from the localStorage and converts it to a JSON object.
				 * @param {string} key the key of the item to retrieve.
				 * @returns {object|null} the item if available, null otherwise.
				 */
				getJSON:function(key){
					return o._getType(key,JSON.parse);
				}
			};

		return o;
		
	}]);