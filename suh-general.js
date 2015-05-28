
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
 * @name shUrlRulesProvider
 * @module SuhGeneral
 * @description
 * 
 *
 *
 */
angular.provider('shUrlRules', [function () {
	var rules = [{
		rule:/\/(experience|guide|user)-[a-z\-0-9]+-([0-9]+)/,
		pieces:['object','id','mode:view']
	},{
		rule:/\/me/,
		pieces:['object:user','id:-1','mode:edit']
	},{
		rule:/\/(experiencebox|guidebox)\/([0-9]+)/,
		pieces:['object','id']
	},
	{
		rule:/\/(guide|experience)\/(edit|preview|pdf|embed|box)\/([0-9]*)/,
		pieces:['object','mode','id']
	},{
		rule:/\/(guide|experience)\/(create)/,
		pieces:['object','mode']
	}];

	this.setRules = function(r){
		rules = r;
	};
	
	/**
	 * @ngdoc service
	 * @name shUrlRules
	 * @module SuhGeneral
	 * @description
	 *
	 */

	this.$get = [function() {
		return {
			rules:function(){
				return rules;
			}
		};
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
/**
 * @ngdoc service
 * @name shDeferredRequest
 * @module SuhGeneral
 * @description
 * Provides a unified method to handle AJAX requests
 * @requires shSuccess
 * @requires shError
 */
angular.module('SuhGeneral')
	.factory('shDeferredRequest', ['$q','$http','shSuccess',
		'shError',function ($Q,$H,_SCS,_ERR) {
		return function(_method,_url,_data,config,queryData,scs,err){
			var _d = $Q.defer();
			var sFn = scs||_SCS;
			var eFn = err||_ERR;
			if (typeof config !== 'undefined'){
				if (typeof config.success !== 'undefined' &&
					angular.isFunction(config.success)){
					sFn = config.success;
				}
				if (typeof config.error !== 'undefined' &&
					angular.isFunction(config.error)){
					eFn = config.error;
				}
			}
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
 * @name shError
 * @module SuhGeneral
 * @description
 * Handles rejection of {@link shDeferredRequest shDeferredRequests}
 */
angular.module('SuhGeneral')
	.factory('shError', [function () {
		return function(d){
			return function(data){
				d.reject([{
					code:0x11111,
					description:'Network error'
				}]);
			};
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
		 * @abstract
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
			 * @propertyOf EventEmitter
			 * @description 
			 * Holds the objects supported events. 
			 */
			this.events = events || [];

			/**
			 * @ngdoc property
			 * @name EventEmitter#listeners
			 * @module SuhGeneral
			 * @type {object}
			 * @propertyOf EventEmitter
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
					throw new Error('The object does not support the event "'+evt+'".');
				}
				this.listeners = this.listeners || {};
				this.listeners[evtName] = this.listeners[evtName] || [];
				this.listeners[evtName].push(ctx?angular.bind(ctx,listener):listener);
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
				var i = this.listeners[evtName].indexOf(listener);
				if (i !== -1){
					this.listeners.splice(i,1);
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
/**
 * @ngdoc service
 * @name shException
 * @module SuhGeneral
 * @description
 * A factory for generating {SuhException} objects
 * @param {Number} code error code 
 * @param {string} description error description 
 * @returns {SuhException} a new instance of SuhGeneral.Exception
 */
angular.module('SuhGeneral')
	.factory('shException', [function () {
		/**
		 * @ngdoc type
		 * @name  SuhException
		 * @module SuhGeneral
		 * @param  {number} code error code
		 * @param  {string} desc error description
		 */
		var _ge = function(code,desc){
			this._code = code;
			this._desc = desc;
		};

		_ge.prototype = {
			/**
			 * @ngdoc method
			 * @name SuhException#code
			 * @description
			 * Returns the error code of the exception
			 * @module SuhGeneral
			 * @returns {Number} error code
			 */
			code:function(){
				//get exception code
				return this._code;
			},
			/**
			 * @ngdoc method
			 * @name SuhException#description
			 * @module SuhGeneral
			 * @description
			 * Returns the error desciption of the exception
			 * @returns {string} error description
			 */
			description:function(){
				//get exception description
				return this._desc;
			},
			toString:function(){
				return 'Error with code: '+this._code+
						' has occured.\n'+this._desc;
			}
		};
	
		return function(c,d){
			return new _ge(c,d);
		};
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
		return function(model){
			var _sj = function(){
				_H.call(this,model);
			};
			_UT.inherits(_sj,_H);
			return new _sj();
		};
	}]);
/**
 * @ngdoc service
 * @name shHttp
 * @module SuhGeneral
 * @description
 * Provides an object to create network resources
 * @requires  shDeferredRequest
 */
angular.module('SuhGeneral')
	.factory('shHttp', ['$q','shDeferredRequest','shHttpQuery','shUtil',
		function ($Q,_RQ,_HQ,_UTIL) {
		var _R = function(model,fields){
			this.model = model;
			this.resource = _UTIL.capitalize(_UTIL.toCamelCase(model));
			this._fields = fields;
			this._url = '/'+model+'/:id';
			this._extUrl = '/'+model+'-:p-:c/:orderBy-:direction/:method/:id';
			this._queryUrl = '/'+model+'/search';
		};
		var c = _R.prototype;
		/**
		 * @ngdoc method
		 * @name shHttp#perpareUrl
		 * @module SuhGeneral
		 * @description prepares the URL for the request
		 * @param {string} method the method to request
		 * @param {Number} methodId the method id to request
		 * @param {Number} page the page no defaults to 0
		 * @param {Number} chunk the request chunk size in 
		 * cases of arrays defaults to 20
		 */
		c.prepareUrl = function(method,id,page,chunk,orderBy,direction){
			var _page = page || 0;
			var _chunk = chunk || 20;
			var _orderBy = orderBy || 'id';
			var _direction = direction || 'asc';
			return this._extUrl
				.replace(/:method/,method)
				.replace(/:id/,id)
				.replace(/:p/,_page)
				.replace(/:c/,_chunk)
				.replace(/:orderBy/,_orderBy)
				.replace(/:direction/,_direction)
				.replace(/\/$/,'');
		};
		c.postUrl = function(mId,o,id){
			var _i = id || '';
			return this._postUrl
						.replace(/:mid/,mId)
						.replace(/:object/,o)
						.replace(/:oid/,_i)
						.replace(/\/$/,'')
						.replace(/\/$/,'');
		};
		c.fields = function(){
			return this._fields;
		};

		c.createLocalObject = function(obj){
			var ob = obj || {};
			var o = {};
			var elems = [];
			var key = '';
			for (var i=0;i<this._fields.length;i++){
				key = this._fields[i];
				elems = key.split(':');
				if (elems.length < 3){
					if (ob[elems[0]] === 0)
						o[elems[0].toCamelCase()] = 0;
					else 	
						o[elems[0].toCamelCase()] = ob[elems[0]] || elems[1] || '';
				}else{
					switch(elems[1]){
						case 'int':
							o[elems[0].toCamelCase()] = ob[elems[0]] || parseInt(elems[2]) || 0;
						break;
						case 'float':
							o[elems[0].toCamelCase()] = ob[elems[0]] || parseFloat(elems[2]) || 0;
						break;
						case 'json':
							o[elems[0].toCamelCase()] = ob[elems[0]] || JSON.parse(elems[2]) || {};
						break;
						default:
							o[elems[0].toCamelCase()] = ob[elems[0]] || elems[2] || '';
					}
				}
			}
			return o;
		};
		c.createRemoteObject = function(obj){
			var ob = obj || {};
			var o = {};
			var key = '';
			for(var i=0;i<this._fields.length;i++){
				key = this._fields[i];
				o[key] = ob[key.toCamelCase()] || '';
			}
			return o;
		};
		/**
		 * @ngdoc method
		 * @name shHttp#get
		 * @description returns a single resource from the server given its id.
		 * @module SuhGeneral
		 * @param {Number} id the id of the resource to get
		 * @returns {Promise} a promise that can be either 
		 * resolved with the requested data or 
		 * rejected with the reasons of failure
		 */
		c.get=function(id){
			return _RQ.call(this,'get',this._url.replace(/:id/,id));
		};

		c.getAll = function(_ids){
			return _RQ.call(this,'post',this.prepareUrl('get-all',''),{
				ids:_ids
			});
		};

		c.getByAuth = function(){
			return _RQ.call(this,'get',this._url.replace(/:id/,'auth'));
		};
		c.post = function(mId,meth,methId,data){
			return _RQ.call(this,'post',this.postUrl(mId,meth,methId),data);
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
		c.update=function(id,obj){
			return _RQ.call(this,'put',this._url.replace(/:id/,id),obj);
		};
		/**
		 * @ngdoc method
		 * @name shHttp#search
		 * @module SuhGeneral
		 * @description Searches the server for resources matching a textual value.
		 * @param {string} value the value to use as a needle 
		 * @param {obj} obj the object to send to the server
		 * @return {Promise} a promise that is either 
		 * resolved with an array of items matching the search 
		 * query or rejected with an array of reasons.
		 */
		c.search=function(value,page,chunk){
			return _RQ.call(this,'post',this._queryUrl,
				{
					query:value,
					page:page,
					chunk:chunk
				});
		};
		/**
		 * @ngdoc method
		 * @name shHttp#search
		 * @module SuhGeneral
		 * @description generic function to retrieve resources 
		 * using their parent objects.
		 * @param {string} value the value to use as a needle 
		 * @param {obj} obj the object to send to the server
		 * @return {Promise} a promise that is either resolved with 
		 * an array of items matching the search query or 
		 * rejected with an array of reasons.
		 */
		c.by=function(by,id,page,chunk){
			return _RQ.call(this,'get',this.prepareUrl(by,id,page,chunk));
		};

		c.byMethod = function(method,data){
			return _RQ.call(this,'post',this._url.replace(/:id/,method),data);
		};
		/**
		 * @ngdoc method
		 * @name shHttp#kill
		 * @description removes a resource from the server given its id.
		 * @module SuhGeneral
		 * @param {number|Array<number>} id the id of the resource to delete
		 * @return {Promise} a promise that is either resolved 
		 * with the deleted resource or rejected with reasons.
		 */
		c.kill=function(mId){
			if (angular.isArray(mId)){
				return _RQ.call(this,'post',this._url.replace(/:id/,'kill'),{
					ids:mId
				});
			}
			return _RQ.call(this,'delete',this._url.replace(/:id/,mId));
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
		c.create=function(obj){
			return _RQ.call(this,'post',this._url.replace(/:id/,'create'),obj);
		};
		/**
		 * @ngdoc method
		 * @name shHttp#byAny
		 * @module SuhGeneral
		 * @description retrieves resources that matches a given 
		 * key => value dictionary
		 * @param {object} byObj a dictionary used as matching criteria
		 * @return {Promise} a promise that is either resolved 
		 * with an array of items matching the byObj query or 
		 * rejected with an array of reasons.
		 */
		c.byAny = function(byObj){
			return _RQ.call(this,'post',this._url.replace(/:id/,'any'),byObj);
		};

		c.index = function(page,chunk){
			return _RQ.call(this,'post',this._url.replace(/:id/,'index'),{
				page:page,
				chunk:chunk
			});
		};

		c.select = function(page,chunk){
			return _RQ.call(this,'post',this._url.replace(/:id/,'select'),{
				page:page,
				chunk:chunk
			});
		};
		/**
		 * @ngdoc method
		 * @name shHttp#query
		 * @module SuhGeneral
		 * @description retrieves resources by a given 
		 * @param {number} page the page no. to get (defaults to 0)
		 * @param {number} chunk the chunk size of the results (defaults to 20)
		 * @return {Promise} a promise that is either resolved with 
		 * an array of items matching the search query or rejected 
		 * with an array of reasons.
		 */
		c.query = function(page,chunk){
			return _HQ(this.model);
		};

		
		return _R;
	}]);
/**
 * @ngdoc service
 * @name shHttpPostQuery
 * @module SuhGeneral
 * @description
 * Provides a way to request resources from the server using a chain pattern
 * @requires  shDeferredRequest
 */
angular.module('SuhGeneral')
	.factory('shHttpPostQuery', ['shDeferredRequest',
		function (_RQ) {
		var _r = function(url){
			this._query = {};
			this._orderBy = [];
			this._url = '/'+url+'/post-query';
		};
		var c = _r.prototype;
		c.by = function(m){
			this._query.method = m;
			return this;
		};
		c.byId = function(byId){
			this._query.methodParam = byId;
			return this;
		};
		c.orderBy = function(orderBy,direction){
			var _d = direction || 'asc';
			this._query.orderBy = this._query.orderBy || [];
			this._query.orderBy.push([orderBy,direction]);
			return this;
		};
		c.where = function(key,operator,value){
			this._query.where = this._query.where || {};
			switch(arguments.length){
				case 2:
					this._query.where[key] = ['=',value];
					break;
				case 3:
					this._query.where[key] = [operator,value];
					break;
			}
			return this;
		};
		c.whereBetween = function(key,start,end){
			this._query.whereBetween = this._query.whereBetween || {};
			if (arguments.length == 3){
				this._query.whereBetween[key] = [start,end];
			}
			return this;
		};
		c.whereIn = function(key,inArray){
			this._query.whereIn = this._query.whereIn || {};
			if (arguments.length == 2){
				this._query.whereIn[key] = inArray;
			}
			return this;
		};
		c.page = function(page){
			this._query.page = page;
			return this;
		};
		c.chunk = function(chunk){
			this._query.chunk = chunk;
			return this;
		};
		c.send = function(){
			this._query.page = this._query.page || 0;
			this._query.chunk = this._query.chunk || 20;
			return _RQ('post',url,this._query);
		};
		
		return function(model){
			return new _r(model);
		};
	}]);
/**
 * @ngdoc service
 * @name shHttpQuery
 * @module SuhGeneral
 * @description
 * Provides a way to request resources from the server using a chain pattern
 * @requires  shDeferredRequest
 */
angular.module('SuhGeneral')
	.factory('shHttpQuery', ['shDeferredRequest',
		function (_RQ) {
		var _r = function(url){
			this._orderBy = [];
			this._url = '/'+url+'/search';
		};
		var c = _r.prototype;
		c.by = function(m){
			this._method = m;
			return this;
		};
		c.byId = function(byId){
			this._methodParam = byId;
			return this;
		};
		c.orderBy = function(orderBy,direction){
			var _d = direction || 'asc';
			this._orderBy.push(orderBy+':'+_d);
			return this;
		};
		c.where = function(key,operator,value){
			this._where = this._where || [];
			if (typeof operator !== 'undefined' &&
				typeof value !== 'undefined'){
				this._where.push([key,operator,value]);
			}else if (typeof operator !== 'undefined'){
				this._where.push([key,'=',operator]);
			}
			return this;
		};
		c.orWhere = function(key,operator,value){
			this._orWhere = this._orWhere || [];
			if (typeof operator !== 'undefined' &&
				typeof value !== 'undefined'){
				this._orWhere.push([key,operator,value]);
			}else if (typeof operator !== 'undefined'){
				this._orWhere.push([key,'=',operator]);
			}
			return this;
		};
		c.whereBetween = function(key,start,end){
			this._where = this._where || [];
			if (typeof start !== 'undefined' && 
				typeof end !== 'undefined'){
				this._where.push([key,'between',start,end]);
			}
			return this;
		};
		c.whereIn = function(key,inArray){
			this._where = this._where || [];
			if (typeof inArray !== 'undefined'){
				this._where.push([key,'in',inArray]);
			}
			return this;
		};
		c.page = function(page){
			this._url = this._url.replace(/:p/,page);
			return this;
		};
		c.chunk = function(chunk){
			this._url = this._url.replace(/:c/,chunk);
			return this;
		};
		c.send = function(){
			var url = this._url;
			if (url.lastIndexOf('/') === (url.length -1)){
				url = url.substr(0,url.length-1);
			}
			var w = this._where || [];
			var oW = this._orWhere || [];
			return _RQ('post',url,{
				method:{
					name:this._method,
					param:this._methodParam
				},
				where:w,
				orWhere:oW,
				orderBy: this._orderBy
			});
		};
		
		return function(model){
			return new _r(model);
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
/** 
 * @ngdoc service
 * @name shLocationListener
 * @module SuhGeneral
 * @description implements observer pattern to notify listeners for Location changes.
 * @requires  shException
 */
angular.module('SuhGeneral')
	.factory('shLocationListener',
		['$location','shException', function ($L,_GE) {
		var _gll = function(){
			this._observers = [];
			this._parts = $L.path().match(/[a-zA-Z0-9\-]+/g);
		};

		_gll.prototype = {
			/**
			 * @ngdoc method
			 * @name  shLocationListener#register
			 * @module SuhGeneral
			 * @description registers an observer to be notified on Location changes
			 * @param {object} observer the observer object to be registered
			 */
			register:function(observer){
				if (this._observers.indexOf(observer) === -1){
					if (typeof observer.onLocationChange !== 'undefined')
						this._observers.push(observer);
					else{
						throw _GE(0x01,'Observer does not implement onLocationChange').toString();
					}
				}			
			},
			/**
			 * @ngdoc method
			 * @name  shLocationListener#unregister
			 * @module SuhGeneral
			 * @description unregisters an observer 
			 * @param {object} observer the observer object to be unregistered
			 */
			unregister:function(observer){
				var idx = this._observers.indexOf(observer);
				if (idx !== -1)
					this._observers.splice(idx,1);
			},
			/**
			 * @ngdoc method
			 * @name  shLocationListener#_process
			 * @module SuhGeneral
			 * @description invoked everytime location changes to notify all observers
			 */
			_process:function(){
				this._parts = $L.path().match(/[a-zA-Z0-9\-]+/g); 
				if (this._parts !== null && this._parts.length > 0)
					for(var i=0;i<this._observers.length;i++)
						this._observers[i].onLocationChange(this._parts[0],
							this._parts);
			},
			/**
			 * @ngdoc method
			 * @name  shLocationListener#get
			 * @module SuhGeneral
			 * @description returns the parts array of the current location 
			 */
			get:function(){
				return this._parts;
			}
		};
	
		return new _gll();
	}]);

/**
 * @ngdoc service
 * @name  shSharedDataRepository
 * @module SuhGeneral
 * @description a service to share data between controllers 
 */
angular.module('SuhGeneral')
	.factory('shSharedDataRepository', [function () {
		var _gsdr = function(){
			this.repo = {};
		};

		_gsdr.prototype = {
			/**
			 * @ngdoc method
			 * @name  shSharedDataRepository#set
			 * @module SuhGeneral
			 * @param {string} aK application key
			 * @param {string} dK data key
			 * @param {any} d  data 
			 * @return {shSharedDataRepostiroy} returns the instance of the shSharedDataRepository.
			 */
			set:function(aK,dK,d){
				this.repo[aK] = this.repo[aK] || {};
				this.repo[aK][dk] = d;
				return this;
			},
			/**
			 * @ngdoc method
			 * @name  shSharedDataRepository#get
			 * @description returns an item from the repository if exists or undefined
			 * @module SuhGeneral
			 * @param  {string} aK applicatio key
			 * @param  {string} dK data key
			 * @return {any|undefined} the requested data
			 */
			get:function(aK,dK){
				if (this.exists(aK,dK)){
					return this.repo[aK][dK];
				}
			},
			/**
			 * @ngdoc method
			 * @name  shSharedDataRepository#exists
			 * @description checks whether an item exists in the repository
			 * @module SuhGeneral
			 * @param  {string} aK applicatio key
			 * @param  {string} dK data key
			 * @return {any} the requested data
			 */
			exists:function(aK,dK){
				return angular.isDefined(this.repo[aK]) &&
					angular.isDefined(this.repo[aK][dK]);
			}
		};
	
		return new _gsdr();
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
/**
 * @ngdoc service
 * @name shSuccess
 * @module SuhGeneral
 * @description returns a function to be used by the {SuhGeneral.DeferredRequest} service
 * in cases of successful calls
 * @param {deferred} d the deferred object to resolve
 * @returns {function} a function that takes a single parameter (data) which is the data received from the server.
 */
angular.module('SuhGeneral')
	.factory('shSuccess', [function () {
		return function(d){
			return function(data){
				if (data.status)
					return d.resolve(data.result);
				else
					return d.reject(data.reasons);
			};
		};
	}]);
/**
 * @ngdoc service
 * @name sHUrlInspector
 * @module SuhGeneral
 * @description
 * A service to track url changes to specific rules. 
 */
angular.module('SuhGeneral')
	.factory('shUrlInspector', ['shUrlRules',function (_GUR) {
		var currentUrl = document.URL,model = {
			activeRule:null,
			pieces:[],
			mode:'view',
			id:-1,
			object:null
		};
		return {
			parse:function(){
				var i=0,rules=_GUR.rules(),l=rules.length,r=null,j=0,k=0;
				for(;i<l;i++){
					r = currentUrl.match(rules[i].rule);
					if (typeof r !== 'undefined' && 
						r !== null){
						for(k=rules[i].pieces.length;j<k;j++){
							var p = rules[i].pieces[j].split(':');
							model[p[0]] = r[j+1] || p[1];
						}
					}
				}
				model.id = parseInt(model.id);
			},
			mode:function(){
				return model.mode;
			},
			id:function(){
				return parseInt(model.id);
			},
			object:function(){
				return model.object;
			}
		};
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