describe('Maintains core public API from v0.7.0', function () {


    describe('resrc.resrcAll()   [DEPRECIATED]', function () {

        xit("Still exists", function () {
            expect(resrc.resrcAll).toBeDefined();
            expect(typeof resrc.resrcAll).toBe('function');
        });

        xit("Is now an alias for resrc.it()", function () {
            expect(resrc.resrcAll).toEqual(resrc.it);
        })

    });


    describe('resrc.resrc()   [DEPRECIATED]', function () {

        it("Still exists", function () {
            expect(resrc.resrc).toBeDefined();
            expect(typeof resrc.resrc).toBe('function');
        });

        it("Is now an alias for resrc.it()", function () {
            expect(resrc.resrc).toEqual(resrc.it);
        })

    });


    describe('resrc.ready()   [DEPRECIATED]', function () {
        xit("Still exists", function () {
            expect(resrc.ready).toBeDefined();
            expect(typeof resrc.ready).toBe('function');
        });


        xit("Still works", function () {

            var didRun = false
            resrc.ready(function () {
                didRun = true;
            });

            expect(didRun).toBe(true);
        });

        xit("Is now just an alias of resrc.util.ready",function(){
            expect(resrc.ready).toEqual(resrc.util.ready);
        })
    });


    describe('resrc.extend()   [DEPRECIATED]',function(){

        xit('Still exists',function(){
            expect(resrc.extend).toBeDefined();
            expect(typeof resrc.extend).toBe('function');
        });

        xit('Still works',function(){

            var a = {
                fred: 'flintstone',
                barney: 'rubble'
            };
            var b = {
                barney: 'stenson',
                bam: 'bam'
            };

            var c = resrc.extend(a,b);

            expect(c.fred).toBe('flintstone');
            expect(c.barney).toBe('stenson');
            expect(c.bam).toBe('bam');

        });

        xit("Is now just an alias of resrc.util.merge",function(){
            expect(resrc.extend).toEqual(resrc.util.merge);
        })

    });



    describe('resrc.options',function(){
        it("Still exposes config options via resrc.options", function () {
            expect(resrc.options).toBeDefined();
            expect(typeof resrc.options).toBe('object')
            expect(resrc.options.resrcClass).toBeDefined();
        })

    })






});
