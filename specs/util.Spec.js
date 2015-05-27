describe('Util',function(){
	var SuhGeneral,Util;
	beforeEach(module("SuhGeneral"));
	beforeEach(function(){
		inject(['shUtil',function(U){
			Util = U;
		}]);
	});

	it('should contain a Util service',function(){
		expect(Util).toBeDefined();
	});

	it('should extend two classes',function(){
		var Parent = function Parent(){
			this.name = 'Suhail';
		};
		Parent.prototype = {
			change:function(){
				this.name = 'Abood';
			},
		};
		var Test = function TestObj(){
			Parent.call(this);
			this.age = 12;
		};
		Util.extend(Test,Parent,{
			add:function(){
				this.age++;
			}
		});
		var j = new Test();

		expect(j).toBeDefined();
		expect(j.name).toEqual('Suhail');
		expect(j.change).toBeDefined();
		j.change();
		expect(j.name).toEqual('Abood');
		expect(j.age).toEqual(12);
		expect(j.add).toBeDefined();
		j.add();
		expect(j.age).toEqual(13);
	});

	it('should run a method on another context',function(){
		var Parent = function(){
			var self = this;
			this.name = 'Suhail';
			this.doIt = function(name){
				self.name = name;
			};
		};

		var X = new Parent();


		expect(Util.proxy).toBeDefined();
		spyOn(X,'doIt').and.callThrough();
		var fn = Util.proxy(X.doIt,X);
		fn('test');
		expect(X.doIt).toHaveBeenCalled();
		expect(X.name).toEqual('test');
	});

	it('should run a method on base context',function(){
		var Parent = function(){
			var self = this;
			this.name = 'Suhail';
		};

		Parent.prototype = {
			doIt:function(name){
				this.name = name;
			}
		};

		var X = new Parent();


		expect(Util.proxy).toBeDefined();
		spyOn(X,'doIt').and.callThrough();
		var fn = Util.proxy(X.doIt);
		fn('test');
		expect(X.doIt).toHaveBeenCalled();
		expect(X.name).toEqual('Suhail');
	});

	it('should format text properly and replace placeholders from array',function(){
		var s = 'Expect 1 = ? to be ?';
		expect(Util.format).toBeDefined();
		expect(Util.format(s,['1','true'])).toEqual('Expect 1 = 1 to be true');
	});

	it('should format text properly and replace placeholders from object using default placeholder',function(){
		var s = 'Expect 1 = :1 to be :val';
		expect(Util.format).toBeDefined();
		expect(Util.format(s,{
			'1':1,
			val:'true'
		})).toEqual('Expect 1 = 1 to be true');
	});

	it('should format text properly and replace placeholders from object using wrapper placeholder',function(){
		var s = 'Expect 1 = {1} to be {val}';
		expect(Util.format).toBeDefined();
		expect(Util.format(s,{
			'1':1,
			val:'true'
		},'{$}')).toEqual('Expect 1 = 1 to be true');
	});

	it('should format text properly and replace placeholders from object using trailing placeholder',function(){
		var s = 'Expect 1 = 1} to be val}';
		expect(Util.format).toBeDefined();
		expect(Util.format(s,{
			'1':1,
			val:'true'
		},'$}')).toEqual('Expect 1 = 1 to be true');
	});

	it('should format text properly with no replacements',function(){
		var s = 'Expect 1 = 1 to be true';
		expect(Util.format).toBeDefined();
		expect(Util.format(s,{
			'1':1,
			val:'true'
		},'$}')).toEqual('Expect 1 = 1 to be true');
	});

	it('should map items properly',function(){
		var s = [1,2,3];
		expect(Util.map).toBeDefined();
		expect(Util.map(s,function(e){
			return e*10;
		}).join(',')).toEqual('10,20,30');
	});

	it('should convert string to camelcase properly',function(){
		var s = 'to-create-map';
		expect(Util.string).toBeDefined();
		expect(Util.string.toCamelCase).toBeDefined();
		expect(Util.string.toCamelCase(s)).toEqual('toCreateMap');
	});

	it('should convert string to camelcase properly when having one term',function(){
		var s = 'to';
		expect(Util.string).toBeDefined();
		expect(Util.string.toCamelCase).toBeDefined();
		expect(Util.string.toCamelCase(s)).toEqual('to');
	});


	it('should convert capitalize string',function(){
		var s = 'to';
		expect(Util.string).toBeDefined();
		expect(Util.string.capitalize).toBeDefined();
		expect(Util.string.capitalize(s)).toEqual('To');
	});

	it('should convert string to camelcase properly when having one term',function(){
		var s = 'o';
		expect(Util.string).toBeDefined();
		expect(Util.string.capitalize).toBeDefined();
		expect(Util.string.capitalize(s)).toEqual('O');
	});
});