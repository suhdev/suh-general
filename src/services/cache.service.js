/**
 * @ngdoc service
 * @name shCache 
 * @module SuhGeneral
 * @param {string} key application cache key
 * @returns {SuhCacheType} an instance of the {@link SuhCacheType} class
 * @description
 * Provides an internal cache with persistance support (if the browser supports it)
 */
angular.module('SuhGeneral') 
	.factory('Cache', ['shEventGenerator','shStorage','shUtil',function (_EG,_GS,_UT) {
		/**
		 * @ngdoc type
		 * @name SuhCacheType
		 * @module SuhGeneral
		 * @param {string} key the application key, this key is used to store items in the persistence storage.
		 * @property {object} data the cache storage object
		 * @property {bool} enabled whether the cache object is enabled or disabled
		 * @description
		 * Creates a new cache object. The new cache will also automatically restore any previous states from the persistance storage
		 */
		var _gc = function(key){
			this.data = {};
			this.key = key;
			this.enabled = true;
			if (_GS.isEnabled()){
				this.restore();
			}
		};
		_UT.extend(_gc,_EG,
		{
			/**
			 * @ngdoc method 
			 * @name SuhCacheType#store
			 * @module SuhGeneral
			 * @param {string|object|Array<object>} key the item key. 
			 * @param {string|integer|float|bool|Array|object} [value] the item value.
			 * @description
			 * Stores an element in the cache. <b>Note:</b> Any item with the same key will be overriden
			 */
			store:function(o,value){
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
			},

			/**
			 * @ngdoc method
			 * @name SuhCacheType#disable
			 * @module SuhGeneral
			 * @description
			 * Disables the cache object such that invoking store, get, persist will result nothing.
			 * This is mainly useful upon restoring the previous object state from cache
			 */
			disable:function(){
				this.enabled = false;
			},

			/**
			 * @ngdoc method
			 * @name SuhCacheType#enable
			 * @module SuhGeneral
			 * @description
			 * Enables the cache object
			 */
			enable:function(){
				this.enabled = true;
			},

			/**
			 * @ngdoc method
			 * @name SuhCacheType#persist
			 * @module SuhGeneral
			 * @description
			 * Stores the current state of the cache into the loaclStorage (persistance)
			 */
			persist:function(){
				if (this.enabled){
					_GS.store(this.key,this.data);
				}
			},

			/**
			 * @ngdoc method
			 * @name SuhCacheType#restore
			 * @module SuhGeneral
			 * @description
			 * Restores the most recent cache state from the localStorage (persistance) 
			 */
			restore:function(){
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
			},

			/**
			 * @ngdoc method
			 * @name SuhCacheType#get
			 * @module SuhGeneral
			 * @param {string} key the item key to retrieve from the cache
			 * @returns {any|null} returns the requested item or null if not available 
			 * @description
			 * Returns an item from the cache given its key
			 */
			get:function(key){
				if (this.enabled){
					var t = this.data[key];
					if (typeof t !== 'undefined' &&
						t !== null){
						return this.data[key];
					}
					return null;
				}
			},
		}); 

		
		return function(key){
			return new _gc(key);
		};
	}]);