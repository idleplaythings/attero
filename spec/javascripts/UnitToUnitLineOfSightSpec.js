describe("UnitToUnitLineOfSight", function() {
  var routes = UnitToUnitLOSRoutes;
  var number = 0;
  var runOnly = null;

  var partialUnitHeight = 0;
  var fullUnitHeight = 0.75;

  beforeEach(function() {
  });

  routes.forEach(function(route)
  {
    number++;

    if (runOnly && number !== runOnly)
      return;

    var expected = route.expected;
    var unitheight = route.unitheight;
    var degradation = route.degradation;

    var trace = new UnitToUnitRaytrace(unitheight, degradation, route.route, partialUnitHeight, fullUnitHeight);

    it(number + ": " + route.description, function() {
      expect(trace.run()).toBe(expected);
    });
  });
});