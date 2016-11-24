var Lofte = require('./index')

describe('Lofte tests', function () {
    describe('Lofte Promises/A+ spec', function () {
        describe('function resolve', function () {
            it('returns 2', function (done) {
                Lofte.resolve(2).then(function (value) {
                    expect(value).toBe(2)
                    done()
                })
            })
        })
        describe('Lofte', function () {
            describe('method then', function () {
                it('works normally?', function (done) {
                    new Lofte(function (resolve) {
                        resolve('a value')
                    }).then(function (value) {
                        expect(value).toBe('a value')
                        done()
                    })
                })
                it('works with rejection?', function (done) {
                    new Lofte(function (resolve, reject) {
                        reject('an error')
                    }).then(null, function (reason) {
                        expect(reason).toBe('an error')
                        done()
                    })
                })
            })
            describe('method catch', function () {
                it('works with rejection?', function (done) {
                    new Lofte(function (resolve, reject) {
                        reject('an error')
                    }).catch(function (reason) {
                        expect(reason).toBe('an error')
                        done()
                    })
                })
            })
        })
        describe('function reject', function () {
            it('returns "welp a error happened"', function (done) {
                Lofte.reject("welp a error happened").then(null, function (reason) {
                    expect(reason).toBe("welp a error happened")
                    done()
                })
            })
        })
        describe('function all', function () {
            it('returns a array of 1 (after 100ms) 0 (after 600ms) "test" (after 400ms) and false (after 800ms)', function (done) {
                function timeout(value, ms) {
                    return new Lofte(function (resolve) {
                        setTimeout(function () {
                            resolve(value)
                        }, ms)
                    })
                }

                Lofte.all([timeout(1, 100), timeout(0, 600), timeout('test', 400), timeout(false, 800)]).then(function (values) {
                    expect(values).toEqual([1, 0, 'test', false])
                    done()
                })
            })
            it('resolves to [3, 1337, "foo"]', function (done) {
                var p1 = Lofte.resolve(3)
                var p2 = 1337
                var p3 = new Lofte(function (resolve) {
                    setTimeout(resolve, 100, "foo")
                })

                Lofte.all([p1, p2, p3]).then(function (values) {
                    expect(values).toEqual([3, 1337, "foo"])
                    done()
                })
            })

            it('tests to see if it has fail-fast behavior', function (done) {
                var p1 = new Lofte(function (resolve) {setTimeout(resolve, 100, "one")})
                var p2 = new Lofte(function (resolve) {setTimeout(resolve, 200, "two")})
                var p3 = new Lofte(function (resolve) {setTimeout(resolve, 300, "three")})
                var p4 = new Lofte(function (resolve) {setTimeout(resolve, 400, "four")})
                var p5 = new Lofte(function (resolve, reject) {reject("reject")})

                Lofte.all([p1, p2, p3, p4, p5]).then(function () {
                    done.fail('The promise should have been rejected')
                }, function (reason) {
                    expect(reason).toBe('reject')
                    done()
                })
            })
        })
        describe('function race', function () {
            it('resolves the first promise to be done', function (done) {
                var p1 = new Lofte(function(resolve) {setTimeout(resolve, 500, "one")})
                var p2 = new Lofte(function(resolve) {setTimeout(resolve, 100, "two")})

                Lofte.race([p1, p2]).then(function(value) {
                    expect(value).toBe("two")
                    done()
                })
            })
            it('can also reject the first one', function (done) {
                var p1 = new Lofte(function(resolve) {setTimeout(resolve, 100, "one")})
                var p2 = new Lofte(function(resolve, reject) {setTimeout(reject, 500, "two")})

                Lofte.race([p1, p2]).then(function(value) {
                    expect(value).toBe("one")
                    done()
                }, function() {
                    done.fail('Should not have been called')
                })
            })
        })
    })
    describe('function callback', function () {
        it('works normally?', function (done) {
            new Lofte(function (resolve) {
                resolve('a value')
            }).callback(function (error, value) {
                expect(error).toBeUndefined()
                expect(value).toBe('a value')
                done()
            })
        })
        it('works with rejection?', function (done) {
            new Lofte(function (resolve, reject) {
                reject('an error')
            }).callback(function (error, value) {
                expect(error).toBe('an error')
                expect(value).toBeUndefined()
                done()
            })
        })
    })
    describe('function promisify', function () {
        it('', function () {

        })
    })
})