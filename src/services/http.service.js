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