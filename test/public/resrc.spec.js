describe('This is a spec', function () {




    it("Can be run via resrc.it()", function () {
        expect(resrc.it).toBeDefined();
        expect(typeof resrc.it).toBe('function');
    });

    it("Can be run via resrc.run()", function () {
        expect(resrc.run).toBeDefined();
        expect(typeof resrc.run).toBe('function');
    });

    it("Does the same for it() and run()",function(){
        expect(resrc.it).toEqual(resrc.run);
    });



    describe('resrc.configure() works as expected', function () {


        it('updates the resrc options', function () {
            resrc.configure({resrcClass: 'baz'});
            expect(resrc.options.resrcClass).toBe('baz');

        })


    });


})
