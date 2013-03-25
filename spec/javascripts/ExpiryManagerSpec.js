describe("Expiry Manager", function() {
  var em;

  beforeEach(function() {
    em = new ExpiryManager();
  });

  it("should return all registered items if no collection expiry time is specified", function() {
    em.register('123');
    em.register('456');
    em.register('789');
    expect(em.collect()).toEqual(['123', '456', '789']);
  });

  it("should return values that have not been updated for given time period", function() {
    var now = Date.now();
    em.register('123');
    em.register('456');
    spyOn(Date, 'now').andReturn(now + 3000);
    em.register('456');

    expect(em.collect(2000)).toEqual(['123']);
  });

  it("should de-register items when they are collected", function() {
    em.register('123');
    em.register('456');
    em.collect();

    expect(em.collect()).toEqual([]);
  });
});
