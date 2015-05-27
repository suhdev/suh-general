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
			this.resource = _UTIL.string.toCamelCase(model)
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
			this._fields;
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
					if (ob[elems[0]] == 0)
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