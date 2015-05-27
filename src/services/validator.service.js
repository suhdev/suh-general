/**
 * @ngdoc service
 * @name  shValidator
 * @module SuhGeneral
 * @description an object used to validate data before sending it to the server. 
 */
angular.module('SuhGeneral')
	.factory('SuhGeneral.Validator', [function () {
		
		var _v = function(fields,rules,messages){
			this._fields = fields;
			this._rules = rules;
			this._messages = messages;
			this._errors = {};
		};
		_v.prototype = {
			fails:function(){
				var result = true;
				for(var f in this._fields){
					var rules = this._rules[f];
					for(var r in rules){
						result = result && this._parse()
					}
				}
				return result;

			},
			error:function(f){
				return this._errors.getAt(f);
			},
			rules:{
				between:function(v,min,max){
					return (v >= min) && (v <= max);
				},
				less:function(v,t){
					return v < t;
				},
				greater:function(v,t){
					return v > t;
				},
				not:function(v,tv){
					return v != tv;
				},
				notnull:function(val){
					return val !== null;
				},
				in:function(val,list){
					var l = JSON.parse(list);
					return l.indexOf(val) !== -1;
				},
				string:function(val){
					return angular.isString(val);
				}
			},
			_parse:function(f,v,r){
				var rx = r.match(/[^\:]/gi);
				if (rx !== null){
					var rn = rx.shift();
					this._errors[f] = this._errors[f] || {};
					return this._errors[f][rn] = this.rules[rn].apply(this,[v].concat(rx));
				}
			},

		};
		return function(fields,rules,messages){
			return new _v(fields,rules,messages);
		};
	}]);