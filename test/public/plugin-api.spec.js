describe("Plugin API",function(){


    it("Exports an object called resrc.plugin",function(){
        expect(resrc.plugin).toBeDefined();
    })




    describe('resrc.plugin.register()',function(){

        it('Should exist',function(){
            expect(resrc.plugin.register).toBeDefined();
        });

        it("Should be a function",function(){
            expect(typeof resrc.plugin.register).toBe('function');
        });

        it("Should create a method on resrc object with the same name as the first argument",function(){

            resrc.plugin.register('foo',function(){});

            expect(resrc.foo).toBeDefined();
            expect(typeof resrc.foo).toBe('function');
        })

    });




    describe("resrc.plugin.hook()",function(){

        it('Should exist',function(){
            expect(resrc.plugin.hook).toBeDefined();
        });

        it("Should be a function",function(){
            expect(typeof resrc.plugin.hook).toBe('function');
        });

    })



















});
