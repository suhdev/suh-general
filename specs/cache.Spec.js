describe("cache suite", function() {
	var SuhGeneral,Cache,Util;
	beforeEach(module("SuhGeneral"));
	beforeEach(function(){
		
		inject(['shCache','shUtil',function(C,Ut){
			Cache = C;
			Util = Ut;
		}]);
		
	});

	it("should have default methods", function() {
		expect(typeof Cache).toEqual("function");
		expect(Cache.store).toBeDefined();
		expect(Cache.get).toBeDefined();
		expect(Cache.persist).toBeDefined();
		expect(Cache.restore).toBeDefined();
		expect(Cache.setStorage).toBeDefined();
		expect(Cache.getStorage).toBeDefined();
		expect(Cache.clear).toBeDefined();
	});

	it("should support storing item", function() {
		Cache.store('text','Suhail Abood');
		expect(Cache.get('text')).toEqual('Suhail Abood');
	});

	it("should not store items if the cache is disabled", function() {
		Cache.disable();
		Cache.store('text','Suhail Abood');
		expect(Cache.get('text')).toBeUndefined();
	});

	it("should persist items in the persistence storage", function() {
		Cache.store('text','Suhail Abood');
		expect(Cache.get('text')).toEqual('Suhail Abood');
		Cache.persist();
		Cache.clear();
		expect(Cache.get('text')).toBeUndefined();
		Cache.restore();
		expect(Cache.get('text')).toEqual('Suhail Abood');
		
	});

	it("should allow creating new cache", function() {
		var myCache = Cache('myCache'); 
		expect(myCache).toEqual(Cache.getCache('myCache'));
		expect(myCache.get('suhail')).toBeUndefined();
		myCache.store('suhail','Suhail Abood');
		expect(myCache.get('suhail')).toEqual('Suhail Abood');
		Cache.store('suhail','Testing');
		expect(myCache.get('suhail')).toEqual('Suhail Abood');
		expect(Cache.get('suhail')).toEqual('Testing');
		Cache.clearCache('myCache');
		expect(myCache.get('suhail')).toBeUndefined();		
	});


	
});