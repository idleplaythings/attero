describe("Landscaper", function() {
  var landscaper;

  beforeEach(function() {
    landscaper = new Landscaper();
  });

  it("should throw an exception if no tool selected", function() {
    expect(function() {
      landscaper.processTile();
    }).toThrow('No landscaping tool set');
  });

  it("should delegate tile processing to selected tool", function() {
    var tool = landscapingMockProvider.getToolMock();
    var tile = landscapingMockProvider.getTileMock();

    spyOn(tool, 'processTile');

    landscaper.setTool(tool);
    landscaper.processTile(tile);

    expect(tool.processTile).toHaveBeenCalledWith(tile);
  });

  it("should return selected tool", function() {
    var tool = landscapingMockProvider.getTileMock();

    landscaper.setTool(tool);

    expect(landscaper.getTool()).toBe(tool);
  });

  it("should unset selected tool", function() {
    var tool = landscapingMockProvider.getTileMock();

    landscaper.setTool(tool);
    landscaper.unsetTool();

    expect(landscaper.getTool()).toBe(null);
  });
});