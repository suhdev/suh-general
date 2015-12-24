
/** 
 * @ngdoc module 
 * @name SuhGeneral
 * @module SuhGeneral
 * @description
 * A module that provides a set of general purpose functionality 
 * through services, controllers, and directives. 
 */
angular.module('SuhGeneral',[]);
/**
 * @ngdoc directive
 * @name shLocalize
 * @module SuhGeneral
 * @restrict A
 * @description
 * A directive to bind translations to the DOM. This directive will replace 
 * the HTML content of the element with the translation key provided
 *
 * ```html
 *
 * <div sh-localize="phrases.welcome"></div>
 *
 * ```
 */
angular.module('SuhGeneral')
	.directive('shLocalize', ['shLocalizer',function (_SL) {
		return {
			restrict: 'A',
			scope:false,
			link: function ($S, $E, $A) {
				if (angular.isDefined($A.shLocalize)){
					var o = _SL.get($A.shLocalize);
					if (!o){
						_SL.ready().then(
							function(){
								var p = _SL.get($A.shLocalize);
								if (p){
									$E.html(p);
								}else {
									$E.html($A.shLocalize);
								}
							});
					}else {
						$E.html(o);
					}
				}
			}
		};
	}]);

/**
 * @ngdoc directive
 * @name shlocalizeAttr
 * @module SuhGeneral
 * @restrict A
 * @description
 * Binds translation data to an attribute rather than the HTML content. 
 *
 * ```html
 *
 * <div sh-localize-attr-title="phrases.welcome"></div>
 * will be
 * <div title="welcome message" sh-localize-attr-title="phrases.welcome"></div>

 * ```
 *
 */
angular.module('SuhGeneral')
	.directive('shLocalizeAttr', ['shLocalize',function (_SL) {
		return {
			restrict: 'A',
			scope: {},
			compile: function compile($E, $A) {
				var patt = /^shLocalizeAttr(.+)/,m,o;
				angular.forEach($A.$attr,function(attr,key){
					m = key.match(patt);
					if (m && m.length > 1){
						o = _SL.get($A[key]);
						if (!o){
							_SL.ready()
							   .then(function(){
						   		var p = _SL.get($A[key]);
						   		if(p){
								   	$E.attr(m[1].toLowerCase(),p);
						   		}else{
						   			$E.attr($A[key]);
						   		}
						   	});
						} else {
							$E.attr(m[1].toLowerCase(),o);
						}
					}
				});
			},
			link: function postLink($S, $E, $A) {
				console.log($A);
			}
		};
	}]);
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
/**
 * @ngdoc service
 * @name shBlockNavigation
 * @module SuhGeneral
 * @description
 * A service to stop users from navigation away from the page. 
 */
angular.module('SuhGeneral')
	.factory('shBlockNavigation', [function () {
		var requestBlock = false,
			block = function block(text){
				window.onbeforeunload = function() {
				  return text || 'Are you sure you want to leave? you may lose any unsaved work';
				};
			},
			unblock = function unblock(){
				window.onbeforeunload = undefined;
			};
		return {
			/**
			 * @ngdoc method
			 * @name shBlockNavigation#block
			 * @module SuhGeneral
			 * @param {string} the text to show to the user. 
			 * @description
			 * Stop the user from navgiating away from the page
			 */

			block:block,
			/**
			 * @ngdoc method
			 * @name shBlockNavigation#unblock
			 * @module SuhGeneral
			 * @description
			 * Allow user to navigate away from the page, removing any block callbacks. 
			 */
			unblock:unblock
		};
	}]);


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
	.factory('shCache', ['shStorage','shUtil',function (_GS,_UT) {
		var caches = {};
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
		   * Returns the data under the provided key.
		   */

		   /**
		    * @ngdoc method
		    * @name Persistence#remove
		    * @module SuhGeneral
		    * @param {string|number} key data identification key 
		    * @returns {Promise}
		    * @description 
		    * Removes the data under the provided key. 
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
			this.valid = true;
			this.persistence = storage || _GS;
			if (_GS.isEnabled()){
				this.restore();
			}
		};
		_gc.prototype = {
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
			isEnabled:function(){
				return enabled;
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
				if (this.enabled && this.valid){
					this.persistence.store(this.key,this.data);
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
				if (this.valid){
					this.enabled = false;
					var temp = this.persistence.getJSON(this.key);
					if (temp === null ||
						typeof temp === 'undefined' ||
						!angular.isObject(temp)){
						this.data = {};
					}else{
						this.data = temp;
					}
					this.enabled = true;
				}
			},

			clear:function(){
				if (this.valid && this.enabled){
					this.data = {};
				}
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
				if (this.enabled && this.valid){
					var t = this.data[key];
					if (typeof t !== 'undefined' &&
						t !== null){
						return this.data[key];
					}
				}
			},
			setStorage:function(storage){
				this.persistence = storage;
			},
			getStorage:function(){
				return this.persistence;
			},
			destroy:function(){
				this.data = {};
				this.valid = false;
			}

		};

		caches.appCache = new _gc('appCache',_GS);

		var f = function(key){
			return (caches[key]?caches[key]:(caches[key] = new _gc(key)));
		};
		f.store = angular.bind(caches.appCache,caches.appCache.store);
		f.get = angular.bind(caches.appCache,caches.appCache.get);
		f.getCache = function(key){
			return caches[key]; 
		};
		f.setCache = function(key,cache){
			caches[key] = cache;
		};
		f.clearCache = function(key){
			if (caches[key]){
				caches[key].destroy();
				delete caches[key];
			}
		};
		f.restore = angular.bind(caches.appCache,caches.appCache.restore);
		f.setStorage = angular.bind(caches.appCache,caches.appCache.setStorage);
		f.getStorage = angular.bind(caches.appCache,caches.appCache.getStorage);
		f.disable = angular.bind(caches.appCache,caches.appCache.disable);
		f.enable = angular.bind(caches.appCache,caches.appCache.enable);
		f.persist = angular.bind(caches.appCache,caches.appCache.persist);
		f.clear = angular.bind(caches.appCache,caches.appCache.clear);

		return f;
	}]);
/**
 * @ngdoc service
 * @name shDataTransformer
 * @module SuhGeneral
 * @description
 * A service that provide a simple data transformer 
 * that allows for chaining transformations. 
 */
angular.module('SuhGeneral')
	.factory('shDataTransformer',[function(){
		/**
		 * @ngdoc type
		 * @name DataTransformer
		 * @module SuhGeneral
		 * @description
		 * A chainable data transformer
		 */
		var _dt = function(){
			this.data = {}; 
			this.originalData = {}; 
		};

		_dt.prototype = {
			/**
			 * @ngdoc method
			 * @name DataTransformer#original 
			 * @module SuhGeneral
			 * @description
			 * @returns {any} the data before applying any of the transformations. 
			 */
			original:function(){
				return this.originalData; 
			},
			/**
			 * @ngdoc method
			 * @name DataTransformer#input
			 * @module SuhGeneral
			 * @param {any} data the data to transform 
			 * @description
			 * @returns {DataTransformer} the data transformer instance. 
			 */
			input:function(data){
				this.data = data; 
				this.originalData = data; 
				return this; 
			},
			/**
			 * @ngdoc method
			 * @name DataTransformer#processor
			 * @module SuhGeneral
			 * @param {function} fn the transformation function which will be passed 
			 * the input data. 
			 * @description
			 * Registers a new data processor and executes the transformation. 
			 * @returns {DataTransformer} the current transformer instance. 
			 */
			processor:function(fn){
				this.data = fn(this.data);
				return this;
			},
			/**
			 * @ngdoc method
			 * @name DataTransformer#out
			 * @module SuhGeneral
			 * @description
			 * @returns {any} the data after all the transformations; 
			 */
			out:function(){
				return this.data;
			}
		};

		return function(){
			return new _dt();
		};
	}]);
/**
 * @ngdoc service
 * @name shDeferredRequest
 * @module SuhGeneral
 * @description
 * Provides a unified method to handle AJAX requests
 * @requires shResponseHandler
 */
angular.module('SuhGeneral')
	.factory('shDeferredRequest', ['$q','$http','shResponseHandler',
		function ($Q,$H,_handler) {
		return function(_method,_url,_data,config,queryData,scs,err){
			var _d = $Q.defer(),
				sFn = scs||(config?config.success:_handler)||_handler,
				eFn = err||(config?config.error:_handler)||_handler;
			if (_method.toLowerCase() === 'get' || 
				typeof _data === 'undefined'){
				$H[_method](_url)
					.success(sFn(_d))
					.error(eFn(_d));	
			}else {
				$H[_method](_url,_data)
					.success(sFn(_d))
					.error(eFn(_d));
			}
			return _d.promise;
		};
	}]);
/**
 * @ngdoc service
 * @name shEventEmitter
 * @module SuhGeneral
 * @description
 * A service exposing the {@link EventEmitter EventEmitter} constructor to be inherited by
 * other classes. 
 * @returns {constructor} the {@link EventEmitter EventEmitter} constructor
 */

angular.module('SuhGeneral')
	.factory('shEventEmitter', [function () {
		/**
		 * @ngdoc type 
		 * @name EventEmitter
		 * @module SuhGeneral
		 * @param {Array<string>} events the supported events 
		 * @description
		 * An abstract class providing basic implementation for event emitters. 
		 * This class is intended to be inherited from by other classes. 
		 */
		function Emitter(events){
			/**
			 * @ngdoc property 
			 * @name EventEmitter#events
			 * @module SuhGeneral
			 * @description 
			 * Holds the objects supported events. 
			 */
			this.events = events || [];

			/**
			 * @ngdoc property
			 * @name EventEmitter#listeners
			 * @module SuhGeneral
			 * @type {object}
			 * @description
			 * An object literal in which the keys are the events names, and 
			 * the values are arrays of listeners. 
			 */
			this.listeners = {};
		}

		Emitter.prototype = {
			/**
			 * @ngdoc method
			 * @name EventEmitter#addEventListener
			 * @module SuhGeneral
			 * @param {string} evtName the event name (or type)
			 * @param {function} listener the listener function to call when the event is triggered. 
			 * @param {object} [ctx] the object on which the listener should be called. 
			 * @description 
			 * Add an event listener to a given event type. 
			 */
			addEventListener:function(evtName,listener,ctx){
				if (this.events.indexOf(evtName) === -1){
					throw new Error('The object does not support the event "'+evtName+'".');
				}
				this.listeners = this.listeners || {};
				this.listeners[evtName] = this.listeners[evtName] || [];
				var fn = ctx?angular.bind(ctx,listener):listener;
				fn.fn = listener;
				this.listeners[evtName].push(fn);
			},

			/**
			 * @ngdoc method
			 * @name EventEmitter#removeEventListener
			 * @module SuhGeneral
			 * @param {string} evtName the event name (or type)
			 * @param {function} listener the listener function to to remove. 
			 * @description 
			 * Removes an event listener from a given event.  
			 */
			removeEventListener:function(evtName,listener){
				if (!this.listeners[evtName]){
					throw new Error("Event '"+evtName+"' is not registered.");
				}
				var i=0,list=this.listeners[evtName],l=list.length,idx =-1;
				for(;i<l;i++){
					if (list[i].fn === listener){
						idx = i;
						break;
					}
				}
				if (i !== -1){
					this.listeners[evtName].splice(i,1);
				}
			},

			/**
			 * @ngdoc method
			 * @name EventEmitter#trigger
			 * @module SuhGeneral
			 * @param {string} evtName the event name (or type) of the triggered event
			 * @param {object} e the event object to pass to the listeners
			 * @description
			 * Triggers a given event by calling all event listeners. 
			 */
			trigger:function(evtName,e){
				if (this.listeners[evtName]){
					var list = this.listeners[evtName],i,l;
					for(i=0,l=list.length;i<l;i++){
						list[i](e);
					}
				}
			},
			/**
			 * @ngdoc method
			 * @name EventEmitter#on 
			 * @module SuhGeneral 
			 * @param {string} evtName the event name or type to listen to.
			 * @param {function} fn the function to call. 
			 * @param {object} [ctx] the context on which the function should be called. 
			 * @description 
			 * Registers a listener 
			 */ 
			on:function(evt,fn,ctx){
				return this.addEventListener(evt,fn,ctx);
			}
		};
	
		return Emitter;
	}]);
/**
 * @ngdoc service
 * @name shHttp
 * @module SuhGeneral
 * @param {object} conf a configuration dictionary as follows: 
 * ```javascript
 *	var conf = {
 * 		//the base url to be used for requests 		
 *		baseUrl:'/base_url_of_the_entity/${id}',
 *		//the restful url to be used for restful requests (if different from baseUrl)
 *		restfulUrl:'/restful_url_of_the_entity/${id}', 
 *		//by default this will be `restfulUrl/create`
 * 		restfulCreate:'/restful_url_for_create',
 *		//sets the defaults of the requests
 * 		defaults:{
 *			page:0,
 *			limit:20,
 *			orderBy:'id',//field
 *			order:'asc'|'desc'
 * 		},
 *		//the url to use for query requests, defaults to the following 
 * 		urlTemplate:'/${model}/${method}/${page}-${limit}/${orderBy}-${order}'
 *	}
 * ```
 * @description
 * Provides an object to create network resources
 * @requires shDeferredRequest
 * @requires shUtil
 */
angular.module('SuhGeneral')
	.factory('shHttp', ['$q','shDeferredRequest','shUtil',
		function ($Q,_RQ,_UTIL) {

		var _R = function(conf){
			this._model = conf.model || conf;
			if (!this._model || !angular.isString(this._model)){
				throw new Error('the model is missing, please provide a model name');
			}
			this._defaults = conf.defaults || {
				page:0,
				limit:20,
				orderBy:'id',
				order:'asc'
			};
			this._resource = _UTIL.capitalize(_UTIL.toCamelCase(conf.model));
			this._baseUrl = conf.baseUrl || '/'+this._model+'/${id}';
			this._restfulUrl = conf.restfulUrl || this._baseUrl;
			this._restfulCreate = conf.restfulCreate || this._restfulUrl.replace(/$\{id\}/,'create'); 
			this._urlTemplate = conf.urlTemplate || '/${model}/${method}/${page}-${limit}/${orderBy}-${order}';
		};
		var c = _R.prototype;
		/**
		 * @ngdoc method
		 * @name shHttp#perpareUrl
		 * @module SuhGeneral
		 * @param {object} params the replacements 
		 * @description prepares the URL for the request
		 */
		c.prepareUrl = function(params){
			var def = angular.extend({},this._defaults,params);
			return _UTIL.tokenReplace(this._urlTemplate,def);
		};

		/**
		 * @ngdoc method
		 * @name shHttp#get
		 * @module SuhGeneral
		 * @param {Number} id the id of the resource to get
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 * @description returns a single resource from the server given its id.
		 */
		c.get = function(idd){
			return this.httpGet(this._restfulUrl,{
				id:idd 
			});
		};

		/**
		 * @ngdoc method
		 * @name shHttp#update
		 * @description returns 
		 * @module SuhGeneral
		 * @param {Number} id the id of the resource to update
		 * @param {obj} obj the object to send to the server
		 * @returns {Promise} a promise that is either resolved 
		 * with the updated object or rejected with an array of reasons.
		 */
		c.update = function(idd,obj){
			return this.httpPut(this._restfulUrl,{
					id:idd
				},obj);
		};

		/**
		 * @ngdoc method
		 * @name shHttp#create
		 * @description creates a new resource
		 * @module SuhGeneral
		 * @param {object} obj the object to create
		 * @return {Promise} a promise that is either resolved with 
		 * the created resource with id or rejected with reasons.
		 */
		c.create = function(obj){
			return this.httpPost(this._restfulCreate,{id:'create'},obj);
		};

		/**
		 * @ngdoc method
		 * @name shHttp#kill
		 * @description removes a resource from the server given its id.
		 * @module SuhGeneral
		 * @param {number|Array<number>} id the id(s) of the resource(s) to delete
		 * @return {Promise} a promise that is either resolved 
		 * with the deleted resource or rejected with reasons.
		 */
		c.delete = function(mId){
			if (angular.isArray(mId)){
				return this.httpPost(this._restfulUrl,{id:'delete'},{
					ids:mId
				});
			}
			return this.httpDelete(this._restfulUrl,{id:mId});
		};

		/**
		 * @ngdoc method
		 * @name shHttp#httpPost
		 * @description sends a post request to the server.
		 * @module SuhGeneral
		 * @param {string} url the url to send the post request to. 
		 * @param {params} params any parameters to replace any placeholders in the url 
		 * @param {object} data the data to send with the post requst 
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 */
		c.httpPost = function(url,params,data){
			return _RQ.call(this,'post',_UTIL.tokenReplace(url,params||{}),data);
		};

		/**
		 * @ngdoc method
		 * @name shHttp#httpPut
		 * @description sends a put request to the server.
		 * @module SuhGeneral
		 * @param {string} url the url to send the post request to. 
		 * @param {params} params any parameters to replace any placeholders in the url 
		 * @param {object} data the data to send with the post requst 
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 */
		c.httpPut = function(url,params,data){
			return _RQ.call(this,'put',_UTIL.tokenReplace(url,params||{}),data);
		};

		/**
		 * @ngdoc method
		 * @name shHttp#httpGet
		 * @description sends a get request to the server.
		 * @module SuhGeneral
		 * @param {string} url the url to send the post request to. 
		 * @param {params} params any parameters to replace any placeholders in the url 
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 */
		c.httpGet = function(url,params){
			return _RQ.call(this,'get',_UTIL.tokenReplace(url,params||{}));
		};

		/**
		 * @ngdoc method
		 * @name shHttp#httpDelete
		 * @description sends a delete request to the server.
		 * @module SuhGeneral
		 * @param {string} url the url to send the post request to. 
		 * @param {params} params any parameters to replace any placeholders in the url 
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 */
		c.httpDelete = function(url,params){
			return _RQ.call(this,'delete',_UTIL.tokenReplace(url,params||{}));
		};

		/**
		 * @ngdoc method
		 * @name shHttp#httpHead
		 * @description sends a head request to the server.
		 * @module SuhGeneral
		 * @param {string} url the url to send the post request to. 
		 * @param {params} params any parameters to replace any placeholders in the url 
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 */
		c.httpHead = function(url,params){
			return _RQ.call(this,'head',_UTIL.tokenReplace(url,params||{}));
		};
		
		return _R;
	}]);
/**
 * @ngdoc service
 * @name shHttpModel
 * @module SuhGeneral
 * @description
 * Needs documentation
 * @todo {urgent} add documentation.
 */
angular.module('SuhGeneral')
	.factory('shHttpModel', ['shHttp','shUtil',function (_H,_UT) {
		return function(conf,proto){
			var _sj = function(){
				_H.call(this,conf);
			};
			_UT.inherits(_sj,_H);
			for(var key in proto){
				_sj.prototype[key] = proto[key]; 
			}
			return new _sj();
		};
	}]);
/**
 * @ngdoc service
 * @name shIdentityGenerator
 * @module SuhGeneral
 * @returns {string} the random identifier 
 * @description 
 * A service to generate pseudo-random identifiers 
 */
angular.module('SuhGeneral')
	.factory('shIdentityGenerator', [function () {
		return function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
		};
	}]);
/**
 * @ngdoc service
 * @name shResponseHandler
 * @module SuhGeneral
 * @description returns a function to be used by the {SuhGeneral.DeferredRequest} service
 * in cases of successful calls
 * @param {deferred} d the deferred object to resolve
 * @returns {function} a function that takes a single parameter (data) which is the data received from the server.
 */
angular.module('SuhGeneral')
	.factory('shResponseHandler', [function () {
		var fnHandler = function fnHandler(d,data){
			if (data && data.status)
				return d.resolve(data.result);
			else
				return d.reject(data.reasons||data);
		};

		var f = function(d){
			return function(data){
				fnHandler(d,data);
			};
		};

		f.setHandler = function(fn){
			fnHandler = fn;
		};

		return f;
	}]);
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
				isSupported:function(){
					return angular.isDefined(window.localStorage);
				},
				enable:function(){
					enabled = true && o.isSupported();
				},
				disable:function(){
					enabled = false;
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
				 * @param {string|Array<string>}
				 * @description stores a key-value pair in the local storage or a dictionary 
				 */
				remove:function(key){
					var result,i;
					if (enabled){
						if (angular.isArray(key)){
							result = [];
							angular.forEach(key,function(v,k){
								if ((i = localStorage.getItem(v))){
									try{
										i = JSON.parse(i); 
									}catch(e){
									}
									result.push(i);
									localStorage.removeItem(v);
								}
							});
							result = result.length === 0?undefined:result;
						}else{
							result = localStorage.getItem(key);
							try{
								result = JSON.parse(result);
							}catch(e){
								
							}
							localStorage.removeItem(key);
						}
					}
					return result;
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
		o.enable();

		return o;
		
	}]);
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
			        if (__O.getDataAt(t[i],f) == v){
			            r.push(t[i]);
			        }
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
			},
			tokenReplace:function(text,repl,startTag,endTag){
				if (!text){
					return text;
				}
				var reserved = '('+['[',']','(',')','{','}','-','.','$'].join('|')+')';
				var st = startTag || '\\$\\{',
					et = endTag || '\\}';
				st = st.replace(/^(\(|\)|\[|\]|\.|\$|\-|\{|\})$/g,function(e,m){
					return '\\'+m;
				});
				et = et.replace(/^(\(|\)|\[|\]|\.|\$|\-|\{|\})$/g,function(e,m){
					return '\\'+m;
				});
				return text.replace(new RegExp(st+'([\\S]+?)'+et,'g'),function(e,m){
					return repl[m] || e;
				});
			}
		};
		return __O;
	}]);