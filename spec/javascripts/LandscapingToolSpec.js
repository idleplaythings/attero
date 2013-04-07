describe("Landscaping Tool", function() {
  it("should return constructor parameters", function() {
    var id = 1;
    var src = "/foo/bar";
    var title = "Some Tool";

    var tool = new LandscapingTool(id, src, title);

    expect(tool.getId()).toEqual(id);
    expect(tool.getTitle()).toEqual(title);
    expect(tool.getSrc()).toEqual(src);
  });
});