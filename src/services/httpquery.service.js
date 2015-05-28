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