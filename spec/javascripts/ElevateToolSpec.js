describe("Elevate Tool", function() {
  it("should ask brush for a list of affected tiles", function() {
    var brush = landscapingMockProvider.getBrushMock();
    spyOn(brush, 'getAffectedTiles');

    var tool = new ElevateTool(1, "/foo/bar", "Some Tool", brush);
    var tile = landscapingMockProvider.getTileMock();

    tool.processTile(tile);

    expect(brush.getAffectedTiles).toHaveBeenCalledWith(tile);
  });
});