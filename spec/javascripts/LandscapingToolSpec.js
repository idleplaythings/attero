describe("Landscaping Tool", function() {
  it("should return constructor parameters", function() {
    var tool = new LandscapingTool(1, "/foo/bar", "Some Tool")

    expect(tool.getId()).toEqual(1);
    expect(tool.getTitle()).toEqual("Some Tool");
    expect(tool.getSrc()).toEqual("/foo/bar");
  });
});