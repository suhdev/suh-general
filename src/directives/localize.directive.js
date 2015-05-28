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