

/**
 * @ngdoc service
 * @name shCache 
 * @module SuhGeneral
 * @param {string} key application cache key, this key is used to persist the whole cache dictionary into the localStorage. 
 * @returns {SuhCacheType} an instance of the {@link SuhCacheType} class
 * @description
 * Provides an internal cache with persistance support (if the browser supports it)
 */
angular.module('SuhGeneral') 
	.factory('Cache', ['shEventEmitter','shStorage','shUtil',function (_EM,_GS,_UT) {
		/**
		 * @ngdoc interface
		 * @name Persistence 
		 * @module SuhGeneral
		 * @description
		 * A basic storage interface that must be implemented by any persistence storage service
		 */

		 /**
		  * @ngdoc method
		  * @name Persistence#store
		  * @module SuhGeneral
		  * @param {string|number} key the key to store the data under
		  * @param {any} data the data to store 
		  * @description
		  * Persists data into the underlying persistence storage. 
		  */

		  /**
		   * @ngdoc method
		   * @name Persistence#get
		   * @module SuhGeneral
		   * @param {string|number} key data identification key 
		   * @returns {Promise} resolved to the data or rejected with an error message. 
		   * @description 
		   * Returns the data under the provided key
		   */


		/**
		 * @ngdoc type
		 * @name SuhCacheType
		 * @module SuhGeneral
		 * @param {string} key the application key, this key is used to store items in the persistence storage.
		 * @param {Persistence} the persistence storage to use. 
		 * @property {boolean} enabled true if the cache is enabled, false otherwise.
		 * @property {object} data the cache storage object
		 * @description
		 * Creates a new cache object. The new cache will also automatically restore any previous states from the persistance storage
		 */
		var _gc = function(key,storage){
			this.data = {};
			this.key = key;
			this.enabled = true;
			this.persistence = storage || _GS;
			if (_GS.isEnabled()){
				this.restore();
			}
		};
		Util.inherits(_gc,_EG);
		var p = _gc.prototype; 
		/**
		 * @ngdoc method 
		 * @name SuhCacheType#store
		 * @module SuhGeneral
		 * @param {string|object|Array<object>} key the item key. 
		 * @param {string|integer|float|bool|Array|object} [value] the item value.
		 * @description
		 * Stores an element in the cache. <b>Note:</b> Any item with the same key will be overriden
		 */
		p.store = function(o,value){
			var self = this;
			if (this.enabled){
				if (angular.isArray(o)){
					angular.forEach(o,function(v,k){
						self.data[v.key] = self.data[v.value];
					});
					return;
				}else if (angular.isObject(o)){
					self.data[o.key] = o.value;
				}else{
					self.data[o] = value;
				}
			}
		};
		/**
		 * @ngdoc method
		 * @name SuhCacheType#disable
		 * @module SuhGeneral
		 * @description
		 * Disables the cache object such that invoking store, get, persist will result nothing.
		 * This is mainly useful upon restoring the previous object state from cache
		 */
		p.disable = function(){
			this.enabled = false;
		};
		/**
		 * @ngdoc method
		 * @name SuhCacheType#enable
		 * @module SuhGeneral
		 * @description
		 * Enables the cache object
		 */
		p.enable = function(){
			this.enabled = true;
		};

		/**
		 * @ngdoc method
		 * @name SuhCacheType#persist
		 * @module SuhGeneral
		 * @description
		 * Stores the current state of the cache into the loaclStorage (persistance)
		 */
		p.persist = function(){
			if (this.enabled){
				_GS.store(this.key,this.data);
			}
		};

		/**
		 * @ngdoc method
		 * @name SuhCacheType#restore
		 * @module SuhGeneral
		 * @description
		 * Restores the most recent cache state from the localStorage (persistance) 
		 */
		p.restore = function(){
			this.enabled = false;
			var temp = _GS.getJSON(this.key);
			if (temp === null ||
				typeof temp === 'undefined' ||
				!angular.isObject(temp)){
				this.data = {};
			}else{
				this.data = temp;
			}
			this.enabled = true;
		};

		/**
		 * @ngdoc method
		 * @name SuhCacheType#get
		 * @module SuhGeneral
		 * @param {string} key the item key to retrieve from the cache
		 * @returns {any|null} returns the requested item or null if not available 
		 * @description
		 * Returns an item from the cache given its key
		 */
		p.get = function(key){
			if (this.enabled){
				var t = this.data[key];
				if (typeof t !== 'undefined' &&
					t !== null){
					return this.data[key];
				}
				return null;
			}
		}; 

		return function(key){
			return new _gc(key);
		};
	}]);