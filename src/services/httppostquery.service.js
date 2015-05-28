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