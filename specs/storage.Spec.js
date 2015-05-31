describe("storage suite", function() {
	var SuhGeneral,Storage,Util;
	beforeEach(module("SuhGeneral"));
	beforeEach(function(){
		
		inject(['shStorage','shUtil',function(U,Ut){
			Storage = U;
			Util = Ut;
		}]);
		
	});
	it("should implement Persistence interface", function() {
		expect(Storage.store).toBeDefined();
		expect(Storage.get).toBeDefined();
	});

	it("should be enabled by default", function() {
		expect(Storage.isEnabled()).toBe(true);
	});

	it("should return undefined if item does not exist", function() {
		expect(Storage.get('gogogoa')).toBeUndefined();
	});

	it("should support storing items and retrieving them", function() {
		Storage.store('suhail',{'name':'Suhail Abood'});
		expect(Storage.get('suhail')).toBeDefined();
		expect(Storage.get('suhail').name).toEqual('Suhail Abood');
	});

	it("should support removing stored items", function() {
		Storage.store('suhail',{'name':'Suhail Abood'});
		expect(Storage.get('suhail')).toBeDefined();
		expect(Storage.remove('suhail').name).toEqual('Suhail Abood');
	});

	it("should support storing integers", function() {
		Storage.store('testnum',1231);
		expect(Storage.get('testnum')).toBeDefined();
		expect(Storage.remove('testnum')).toEqual(1231);
	});

	it("should support storing floats", function() {
		Storage.store('testnum',12.31);
		expect(Storage.get('testnum')).toBeDefined();
		expect(Storage.remove('testnum')).toEqual(12.31);
	});

	it("should support storing strings", function() {
		Storage.store('teststr','123sss1231');
		expect(Storage.get('teststr')).toBeDefined();
		expect(Storage.remove('teststr')).toEqual('123sss1231');
	});

	it("should support storing arrays", function() {
		Storage.store('testarr',['1','2','3']);
		expect(Storage.get('testarr')).toBeDefined();
		expect(Storage.remove('testarr')).toEqual(['1','2','3']);
	});
	
});