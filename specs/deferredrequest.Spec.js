describe("deferred request suite", function() {
	var util,df,$H; 
	beforeEach(module('SuhGeneral'));

	beforeEach(function(){
		inject(['shUtil','shDeferredRequest','$httpBackend',function(U,D,$h){
			util = U;
			df = D; 
			$H = $h;
		}]);
	});

	it("should send get requests", function() {
		var x = null;
		$H.when('GET','/geturl').respond({
			status:true,
			result:{
				name:'Suhail'
			}
		},{});
		df('get','/geturl').then(function(e){
			console.log(e);
			x = e;
		},function(v){
			x = v;
		});
		$H.flush();
		expect(x).toBeDefined();
		expect(x.name).toEqual('Suhail');
	});

	it("should send get requests", function() {
		var x = null;
		$H.when('GET','/geturl').respond({
			status:true,
			result:{
				name:'Suhail'
			}
		},{});
		df('get','/geturl').then(function(e){
			console.log(e);
			x = e;
		},function(v){
			x = v;
		});
		$H.flush();
		expect(x).toBeDefined();
		expect(x.name).toEqual('Suhail');
	});
});